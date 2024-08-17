/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import randomAudio from "utils/randomAudio";
import { toast } from "react-toastify";
import * as Tone from "tone";

import Button from "components/common/Button";

import PlayMusicIcon from "components/icons/PlayMusicIcon";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import VolumeLoudIcon from "components/icons/VolumeLoudIcon";
import MuteIcon from "components/icons/MuteIcon";
import PauseMusicIcon from "components/icons/PauseMusicIcon";

import findAverage from "utils/findAverage";
import Slider from "@mui/material/Slider";
import {
  toggleSoundMute,
  toggleSoundPlay,
  updateSoundVolume,
  toggleSoundSolo,
  setMoment,
  randomSound,
  reset,
  setIsLoaded,
  deleteSound,
  setAverageDecayValue,
  setAverageDelayTimeValue,
  setAverageThresholdValue,
  setAverageRatioValue,
  setAverageFilterFreqValue,
  setAverageWetValue,
  setAverageFeedbackValue,
} from "store/reducers/padReducer";

import { useAppDispatch, useAppSelector } from "hooks/store";

import {
  FilterType,
  ICategory,
  ICompressor,
  IDelay,
  IEffect,
  IFilter,
  IReverb,
  ISound,
} from "types/Music";

import s from "./Sound.module.scss";

interface SoundProps {
  sound: ISound;
  isPlaying: boolean;
  muted: boolean;
  playSolo: string | "all";
  setPlaySolo: (id: string | "all") => void;
  index: number;
  volume: number;
  onSelect: (songId: string) => void;
  isSelected: boolean;
  soundRatio: number;
  isFirst: boolean;
  isSecond: boolean;
  rolledUp: boolean;
  category: ICategory;
  onDelete: (id: string | "all") => void;
}

function Sound({
  sound,
  isPlaying,
  playSolo,
  muted,
  setPlaySolo,
  index,
  volume,
  onSelect,
  isSelected,
  soundRatio,
  isFirst,
  isSecond,
  rolledUp,
  onDelete,
  category,
}: SoundProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volumeValuePlayer, setVolumeValuePlayer] =
    useState<number>(soundRatio);

  const intervalId = useRef<NodeJS.Timer>();

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveform = useRef<WaveSurfer | null>(null);

  const dispatch = useAppDispatch();

  const { moment } = useAppSelector((state) => state.pad.config);
  const {
    averageEffectsValues: {
      decay,
      delayTime,
      feedback,
      filterFreq,
      ratio,
      threshold,
      wet,
    },
  } = category;

  function isFilter(effect: IEffect): effect is IEffect & { content: IFilter } {
    return "filter" in effect.content;
  }

  function isCompressor(
    effect: IEffect,
  ): effect is IEffect & { content: ICompressor } {
    return effect.type === "Compressor" && "compressor" in effect.content;
  }

  function isReverb(effect: IEffect): effect is IEffect & { content: IReverb } {
    return effect.type === "Reverb" && "reverb" in effect.content;
  }

  function isDelay(effect: IEffect): effect is IEffect & { content: IDelay } {
    return effect.type === "Delay" && "delay" in effect.content;
  }

  useEffect(() => {
    const filteredDecayValues = category.effects
      .filter(isReverb)
      .map((eff) => eff.content.reverb.decay);

    const filteredWetValues = category.effects
      .filter(isReverb)
      .map((eff) => eff.content.reverb.wet);

    const averageDecay = findAverage(filteredDecayValues, 0.1);
    const averageWet = findAverage(filteredWetValues, 0);

    dispatch(
      setAverageDecayValue({
        categoryId: category.id,
        decayValue: averageDecay,
      }),
    );

    dispatch(
      setAverageWetValue({
        categoryId: category.id,
        wetValue: averageWet,
      }),
    );
  }, [category.effects]);

  useEffect(() => {
    const filteredDelayFeedback = category.effects
      .filter(isDelay)
      .map((eff) => eff.content.delay.feedback);

    const filteredDelayTimeValues = category.effects
      .filter(isDelay)
      .map((eff) => eff.content.delay.delayTime);

    const averageTimeDelay = findAverage(filteredDelayTimeValues, 0);
    const averageFeedback = findAverage(filteredDelayFeedback, 0);

    dispatch(
      setAverageFeedbackValue({
        categoryId: category.id,
        feedbackValue: averageFeedback,
      }),
    );

    dispatch(
      setAverageDelayTimeValue({
        categoryId: category.id,
        delayTimeValue: averageTimeDelay,
      }),
    );
  }, [category.effects]);

  useEffect(() => {
    const filteredRatioCompressorValues = category.effects
      .filter(isCompressor)
      .map((eff) => eff.content.compressor.ratio);

    const filteredThresholdCompressorValues = category.effects
      .filter(isCompressor)
      .map((eff) => eff.content.compressor.threshold);

    const averageThresholdCompressor = findAverage(
      filteredThresholdCompressorValues,
      0,
    );
    const averageRatioCompressor = findAverage(
      filteredRatioCompressorValues,
      0,
    );

    dispatch(
      setAverageRatioValue({
        categoryId: category.id,
        ratioValue: averageRatioCompressor,
      }),
    );
    dispatch(
      setAverageThresholdValue({
        categoryId: category.id,
        thresholdValue: averageThresholdCompressor,
      }),
    );
  }, [category.effects]);

  useEffect(() => {
    const filteredFreqValues = category.effects
      .filter(isFilter)
      .map((eff) => eff.content.filter.filterFreq);

    const averageFreq = findAverage(filteredFreqValues, 0);

    dispatch(
      setAverageFilterFreqValue({
        categoryId: category.id,
        filterFreqValue: averageFreq,
      }),
    );
  }, [category.effects]);

  const player = useRef<Tone.Player | null>(null);
  const buffer = useRef<Tone.ToneAudioBuffer | null>(null);
  const reverb = useRef<Tone.Reverb | null>(null);
  const filter = useRef<Tone.Filter | null>(null);
  const delay = useRef<Tone.FeedbackDelay | null>(null);
  const compressor = useRef<Tone.Compressor | null>(null);

  useEffect(() => {
    const b = new Tone.Buffer(sound.file, () => {
      player.current = new Tone.Player({
        url: sound.file,
        volume: volumeValuePlayer,
      }).toDestination();
    });
    buffer.current = b;
    return () => {
      player.current!.disconnect();
      player.current = null;
    };
  }, [sound.file]);

  useEffect(() => {
    player.current = new Tone.Player({
      url: buffer.current!,
      volume: volumeValuePlayer,
    });
    if (category.effects.length > 0) {
      reverb.current = new Tone.Reverb();

      filter.current = new Tone.Filter();

      delay.current = new Tone.FeedbackDelay({
        maxDelay: 5,
        delayTime: delayTime || 0,
        feedback: feedback || 0,
      });

      compressor.current = new Tone.Compressor({
        threshold: threshold || 0,
        ratio: ratio || 1,
      });

      const compressors = category.effects.filter(
        (eff) => eff.type === "Compressor",
      );
      const lastCompressor = compressors[compressors.length - 1];

      const reverbs = category.effects.filter((eff) => eff.type === "Reverb");
      const lastReverb = reverbs[reverbs.length - 1];

      const filters = category.effects.filter((eff) => eff.type === "Filter");
      const lastFilter = filters[filters.length - 1];

      const delays = category.effects.filter((eff) => eff.type === "Delay");
      const lastDelay = delays[delays.length - 1];

      if (lastCompressor) {
        compressor.current.ratio.value = ratio || 1;
        compressor.current.threshold.value = threshold || -60;
      }

      if (lastDelay) {
        delay.current.delayTime.value = delayTime || 0;
        delay.current.feedback.value = feedback || 0;
      }

      if (lastFilter) {
        const selectedFilterType = filters
          .filter(isFilter)
          .map((fil) => fil.content.type);

        filter.current.type = selectedFilterType[0] || "lowpass";
        filter.current.frequency.value = filterFreq || 0;
      }

      if (lastReverb) {
        reverb.current.decay = decay || 0.1;
        reverb.current.wet.value = wet || 0;
      }

      if (
        filters.length > 0 &&
        reverbs.length === 0 &&
        delays.length === 0 &&
        compressors.length === 0
      ) {
        player.current.chain(filter.current, Tone.Master);
      }

      if (
        reverbs.length > 0 &&
        filters.length === 0 &&
        delays.length === 0 &&
        compressors.length === 0
      ) {
        player.current.chain(reverb.current, Tone.Master);
      }

      if (
        delays.length > 0 &&
        filters.length === 0 &&
        reverbs.length === 0 &&
        compressors.length === 0
      ) {
        player.current.chain(delay.current, Tone.Master);
      }

      if (
        filters.length > 0 &&
        reverbs.length > 0 &&
        delays.length === 0 &&
        compressors.length === 0
      ) {
        player.current.chain(filter.current, reverb.current, Tone.Master);
      }

      if (
        filters.length > 0 &&
        reverbs.length === 0 &&
        delays.length > 0 &&
        compressors.length === 0
      ) {
        player.current.chain(filter.current, delay.current, Tone.Master);
      }

      if (
        filters.length === 0 &&
        reverbs.length > 0 &&
        delays.length > 0 &&
        compressors.length === 0
      ) {
        player.current.chain(reverb.current, delay.current, Tone.Master);
      }

      if (
        filters.length > 0 &&
        reverbs.length > 0 &&
        delays.length > 0 &&
        compressors.length === 0
      ) {
        player.current.chain(
          filter.current,
          reverb.current,
          delay.current,
          Tone.Master,
        );
      }

      if (
        filters.length === 0 &&
        reverbs.length === 0 &&
        delays.length === 0 &&
        compressors.length > 0
      ) {
        player.current.chain(compressor.current, Tone.Master);
      }

      if (
        filters.length > 0 &&
        reverbs.length === 0 &&
        delays.length === 0 &&
        compressors.length > 0
      ) {
        player.current.chain(filter.current, compressor.current, Tone.Master);
      }

      if (
        reverbs.length > 0 &&
        filters.length === 0 &&
        delays.length === 0 &&
        compressors.length > 0
      ) {
        player.current.chain(reverb.current, compressor.current, Tone.Master);
      }

      if (
        delays.length > 0 &&
        filters.length === 0 &&
        reverbs.length === 0 &&
        compressors.length > 0
      ) {
        player.current.chain(delay.current, compressor.current, Tone.Master);
      }

      if (
        filters.length > 0 &&
        reverbs.length > 0 &&
        delays.length === 0 &&
        compressors.length > 0
      ) {
        player.current.chain(
          filter.current,
          reverb.current,
          compressor.current,
          Tone.Master,
        );
      }

      if (
        filters.length > 0 &&
        reverbs.length === 0 &&
        delays.length > 0 &&
        compressors.length > 0
      ) {
        player.current.chain(
          filter.current,
          delay.current,
          compressor.current,
          Tone.Master,
        );
      }

      if (
        filters.length === 0 &&
        reverbs.length > 0 &&
        delays.length > 0 &&
        compressors.length > 0
      ) {
        player.current.chain(
          reverb.current,
          delay.current,
          compressor.current,
          Tone.Master,
        );
      }

      if (
        filters.length > 0 &&
        reverbs.length > 0 &&
        delays.length > 0 &&
        compressors.length > 0
      ) {
        player.current.chain(
          filter.current,
          reverb.current,
          delay.current,
          compressor.current,
          Tone.Master,
        );
      }
    } else {
      player.current.chain(Tone.Master);
    }
  }, [wet, decay, feedback, filterFreq, ratio, delayTime, threshold]);

  useEffect(() => {
    if (isSelected && isPlaying) {
      player.current?.start();
    } else {
      player.current?.stop();
    }
  }, [isSelected, isPlaying]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (waveformRef.current) {
      const wf = WaveSurfer.create({
        barWidth: 3,
        cursorWidth: 0,
        container: waveformRef.current,
        height: 70,
        progressColor: sound.color,
        responsive: true,
        waveColor: "#9491AA",
        cursorColor: "none",
        interact: false,
      });

      waveform.current = wf;

      waveform.current.load(sound.file);

      waveform.current.on("ready", () => {
        dispatch(setIsLoaded({ soundId: sound.id, isLoaded: true }));
      });

      waveform.current?.setMute(false);

      return () => {
        player.current?.disconnect();
        waveform.current?.destroy();
      };
    }
  }, [sound.color, sound.file]);

  useEffect(() => {
    waveform.current?.setProgressColor(isSelected ? sound.color : "#38364C");
  }, [isSelected]);

  useEffect(() => {
    if (moment === 0) {
      waveform.current?.seekTo(0);
      player.current?.seek(0);
      setCurrentTime(0);
    }

    waveform.current?.on("finish", () => {
      player.current?.seek(0);
      waveform.current?.seekTo(0);
      player.current?.start();
      waveform.current?.play();
    });
  }, [moment]);

  useEffect(() => {
    if (!isSelected) {
      player.current!.mute = true;
    }
  }, [isSelected]);

  const interpolateAudio = useCallback(
    (input_1_db: number, input_2_db: number, interpolateAudioRatio: number) => {
      const linearFirst = 10 ** (input_1_db / 20);
      const linearSecond = 10 ** (input_2_db / 20);

      const interpolatedLinear =
        (1 - interpolateAudioRatio) * linearFirst +
        interpolateAudioRatio * linearSecond;
      const interpolatedDb = 20 * Math.log10(interpolatedLinear);

      return interpolatedDb;
    },
    [],
  );

  useEffect(() => {
    if (isSecond) {
      const normalizedRatio = (soundRatio - -60) / (0 - -60);
      const combined = interpolateAudio(-60, 0, normalizedRatio);
      const value = volume + combined;
      setVolumeValuePlayer(value);

      player.current!.volume.value = value;
      dispatch(
        updateSoundVolume({
          categoryId: sound.categoryId,
          soundId: sound.id,
          volume: soundRatio,
        }),
      );
    }
  }, [soundRatio, isSecond, volume]);

  useEffect(() => {
    if (isFirst && player.current) {
      const normalizedRatio = (soundRatio - -60) / (0 - -60);
      const combined = interpolateAudio(0, -60, normalizedRatio);
      const value = volume + combined;

      setVolumeValuePlayer(value);
      player.current.volume.value = value;

      dispatch(
        updateSoundVolume({
          categoryId: sound.categoryId,
          soundId: sound.id,
          volume: -60 + -soundRatio,
        }),
      );
    }
  }, [soundRatio, isFirst, volume]);

  useEffect(() => {
    if (muted || !isSelected) {
      waveform.current?.setMute(true);
    } else {
      waveform.current?.setMute(true);
    }

    waveform.current?.playPause();
    dispatch(
      toggleSoundMute({
        categoryId: sound.categoryId,
        soundId: sound.id,
        muted: !waveform.current?.getMute(),
      }),
    );

    const percentage =
      // eslint-disable-next-line no-unsafe-optional-chaining
      (waveform.current?.getCurrentTime()! /
        // eslint-disable-next-line no-unsafe-optional-chaining
        waveform.current?.getDuration()!) *
      100;
    dispatch(setMoment(Math.round(percentage)));
  }, [isPlaying]);

  useEffect(() => {
    waveform.current?.setMute(!isSelected);
    dispatch(
      toggleSoundMute({
        categoryId: sound.categoryId,
        soundId: sound.id,
        muted: !waveform.current?.getMute(),
      }),
    );
  }, [isSelected]);

  useEffect(() => {
    if (muted) {
      waveform.current?.setMute(true);
      player.current!.mute = true;
    }
    dispatch(
      toggleSoundMute({
        categoryId: sound.categoryId,
        soundId: sound.id,
        muted: !waveform.current?.getMute(),
      }),
    );
  }, [muted]);

  useEffect(() => {
    if (!muted) {
      waveform.current?.setMute(false);
      player.current!.mute = false;
    }
    dispatch(
      toggleSoundMute({
        categoryId: sound.categoryId,
        soundId: sound.id,
        muted: !waveform.current?.getMute(),
      }),
    );
  }, [muted]);

  useEffect(() => {
    if (playSolo !== sound.id && playSolo !== "all") {
      waveform.current?.setMute(true);
    }
    dispatch(
      toggleSoundSolo({
        categoryId: sound.categoryId,
        soundId: sound.id,
      }),
    );
  }, [playSolo, sound.id]);

  useEffect(() => {
    if (playSolo === "all" && isSelected) {
      waveform.current?.setMute(false);
    }
  }, [playSolo]);

  useEffect(() => {
    if (isPlaying) {
      intervalId.current = setInterval(() => {
        setCurrentTime(
          // eslint-disable-next-line no-unsafe-optional-chaining
          (waveform.current?.getCurrentTime()! /
            // eslint-disable-next-line no-unsafe-optional-chaining
            waveform.current?.getDuration()!) *
            100,
        );
      }, 1);
    } else if (intervalId !== null) {
      clearInterval(intervalId.current);
    }

    return () => {
      clearInterval(intervalId.current);
    };
  }, [waveform.current?.getCurrentTime(), isPlaying]);

  const handleMuteToggle = useCallback(() => {
    if (isSelected) {
      waveform.current?.setMute(!sound.muted);
      dispatch(
        toggleSoundMute({
          categoryId: sound.categoryId,
          soundId: sound.id,
          muted: !waveform.current?.getMute(),
        }),
      );
    }
  }, [isSelected, sound.muted, sound.categoryId, sound.id, dispatch]);

  const handleVolumeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const volumeValue = typeof newValue === "number" ? newValue : newValue[0];
      player.current!.volume.value = volumeValue;
      dispatch(
        updateSoundVolume({
          categoryId: sound.categoryId,
          soundId: sound.id,
          volume: volumeValue,
        }),
      );
    },
    [volume, sound.categoryId, sound.id],
  );

  const handleClick = useCallback(() => {
    if (rolledUp) {
      onSelect(sound.id);
    }
  }, [rolledUp, onSelect, sound.id]);

  const soloPause = () => {
    setPlaySolo("all");
    dispatch(
      toggleSoundPlay({
        categoryId: sound.categoryId,
        soundId: sound.id,
      }),
    );
  };

  const soloPlay = useCallback(() => {
    setPlaySolo(sound.id);
    dispatch(
      toggleSoundPlay({
        categoryId: sound.categoryId,
        soundId: sound.id,
      }),
    );
  }, [sound.id, sound.categoryId]);

  const handleDeleteSound = () => {
    const result = window.confirm("Are you sure you want to delete?");
    if (result) {
      onSelect(sound.id);
      dispatch(deleteSound({ soundId: sound.id }));
      onDelete(sound.id);
      setPlaySolo("all");
      toast.success("Everything went well");
    }
  };

  useEffect(() => {
    waveform.current?.load(sound.file);

    player.current?.load(sound.file);
    dispatch(reset());
  }, [sound.file]);

  const handleRandomAudio = useCallback(() => {
    const audioFile = randomAudio(sound.type);
    dispatch(
      randomSound({
        categoryId: sound.categoryId,
        soundId: sound.id,
        audioFile,
      }),
    );
  }, [sound.type, sound.categoryId, sound.id, dispatch]);

  return (
    <div className={s.container}>
      <div
        className={`${s.kick} ${
          playSolo === "all" || playSolo === sound.id || s.muted
        }`}
        style={{ display: !rolledUp && !isSelected ? "none" : "flex" }}
      >
        <div className={s.mobileAdapty}>
          <div
            className={s.kick__title}
            style={{
              backgroundColor: isSelected ? sound.color : "#38364C",
            }}
          >
            <button type="button" onClick={handleClick} />
            {sound.type.charAt(0).toUpperCase() + sound.type.slice(1)} {index}
          </div>
          <div className={s.kick__sound} style={{ position: "relative" }}>
            <div ref={waveformRef} className={s.waves} />
            {sound && (
              <div
                style={{
                  height: "100%",
                  border: "2px solid",
                  position: "absolute",
                  top: "0%",
                  left: `${currentTime}%`,
                  zIndex: "10",
                }}
              />
            )}
            <button type="button" onClick={handleClick} />
          </div>
        </div>
        <div className={s.kick__settings}>
          <div className={s.kick__changing}>
            <button
              type="button"
              onClick={handleDeleteSound}
              className={s.closeSettingsButton}
            >
              <CloseSettingsIcon />
            </button>
            <Button
              classNameForContainer={s.randomizeButton}
              variant="filledColored"
              onClick={handleRandomAudio}
              style={{
                pointerEvents: isPlaying ? "none" : "auto",
              }}
            >
              Randomize
            </Button>
          </div>
          <div
            className={s.settings__icons}
            style={{
              pointerEvents:
                isSelected && (playSolo === "all" || playSolo === sound.id)
                  ? "auto"
                  : "none",
            }}
          >
            <div
              className={s.settings__iconPlay}
              style={{
                pointerEvents: (
                  playSolo !== "all" ? playSolo === sound.id : true
                )
                  ? "auto"
                  : "none",
              }}
            >
              {sound.isPlaying ? (
                <PauseMusicIcon className={s.icon} onClick={soloPause} />
              ) : (
                <PlayMusicIcon className={s.icon} onClick={soloPlay} />
              )}
            </div>
            <div className={s.volumeSlider}>
              <div className={s.settings__iconVolume}>
                {sound.muted && sound.volume >= volume / 2 ? (
                  <VolumeLoudIcon
                    className={s.icon}
                    onClick={handleMuteToggle}
                  />
                ) : (
                  <MuteIcon className={s.icon} onClick={handleMuteToggle} />
                )}
              </div>
              <Slider
                className={s.slider}
                value={sound.volume}
                min={-60}
                max={0}
                onChange={handleVolumeChange}
                defaultValue={sound.volume}
                step={1}
                sx={{
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#0BD1C9",
                  },
                  color: "#FFFFFF",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sound;

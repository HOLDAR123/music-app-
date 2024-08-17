/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-alert */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as Tone from "tone";

import Button from "components/common/Button";
import PlayProjectsButton from "components/PlayProjectsButton";
import AiDjIcon from "components/icons/AiDjIcon";
import RecordMusicIcon from "components/icons/RecordMusicIcon";
import { useAppSelector, useAppDispatch } from "hooks/store";
import {
  deleteProject,
  setUpConfig,
  updateProjects,
} from "store/reducers/projectReducer";
import { setVolume, togglePlay } from "store/reducers/padReducer";
import Projects from "components/Projects";
import randomColor from "utils/randomColor";
import { ICategory, IPad } from "types/Music";

import { toast } from "react-toastify";

import s from "./LivePadsContent.module.scss";

function LivePadsContent() {
  const projects: IPad[] = useAppSelector((state) => state.project.projects);
  const currentProject = useAppSelector((state) => state.pad);
  const dispatch = useAppDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );

  const { volume } = currentProject.config;

  const player = useRef<Tone.Player[][]>([]);
  const buffer = useRef<Tone.ToneAudioBuffer[][]>([]);

  const reverb = useRef<Tone.Reverb[][]>([]);
  const filter = useRef<Tone.Filter[][]>([]);
  const delay = useRef<Tone.FeedbackDelay[][]>([]);
  const compressor = useRef<Tone.Compressor[][]>([]);

  const handleSelect = useCallback(
    (selectedInx: number) => {
      if (selectedInx === selectedIndex) {
        setSelectedIndex(undefined);
      } else {
        setSelectedIndex(selectedInx);
      }
    },
    [selectedIndex],
  );

  const handlePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const buildEffectChain = useCallback(
    (cat: ICategory, projectIndex: number, i: number) => {
      const effects = [];
      const reverbs = cat.effects.filter((effect) => effect.type === "Reverb");
      const delays = cat.effects.filter((effect) => effect.type === "Delay");
      const compressors = cat.effects.filter(
        (effect) => effect.type === "Compressor",
      );
      const filters = cat.effects.filter((effect) => effect.type === "Filter");

      if (reverbs.length > 0) effects.push(reverb.current[projectIndex][i]);
      if (delays.length > 0) effects.push(delay.current[projectIndex][i]);
      if (compressors.length > 0)
        effects.push(compressor.current[projectIndex][i]);
      if (filters.length > 0) effects.push(filter.current[projectIndex][i]);

      effects.push(Tone.Master);

      player.current[projectIndex][i].chain(...effects);
    },
    [],
  );
  useEffect(() => {
    if (projects.length < 1) return;

    projects.forEach((project, projectIndex) => {
      if (!project || !project.config) return;

      player.current[projectIndex] = [];
      buffer.current[projectIndex] = [];
      reverb.current[projectIndex] = [];
      filter.current[projectIndex] = [];
      delay.current[projectIndex] = [];
      compressor.current[projectIndex] = [];

      const { categories } = project.config;
      const averages = categories.map((cat) => cat.averageEffectsValues);
      let i = 0;

      categories.forEach((cat, catIndex) => {
        if (!cat.isMuted) {
          cat.sounds.forEach((sound) => {
            if (sound.isSelected) {
              buffer.current[projectIndex][i] = new Tone.Buffer(
                sound.file,
                () => {
                  player.current[projectIndex][i] = new Tone.Player({
                    url: sound.file,
                  }).toDestination();

                  if (averages[catIndex]) {
                    const average = averages[catIndex];

                    reverb.current[projectIndex][i] = new Tone.Reverb({
                      decay: average.decay || 0.1,
                      wet: average.wet || 0,
                    });

                    filter.current[projectIndex][i] = new Tone.Filter({
                      frequency: average.filterFreq || 0,
                      type: "lowpass",
                    });

                    delay.current[projectIndex][i] = new Tone.FeedbackDelay({
                      maxDelay: 5,
                      delayTime: average.delayTime || 0,
                      feedback: average.feedback || 0,
                    });

                    compressor.current[projectIndex][i] = new Tone.Compressor({
                      threshold: average.threshold || 0,
                      ratio: average.ratio || 1,
                    });
                  }

                  buildEffectChain(cat, projectIndex, i);
                  i += 1;
                },
              );
            }
          });
        }
      });
    });
  }, [projects]);

  const handleStopAndRepeat = (playerArray: Tone.Player[], index: number) => {
    if (!isPlaying) {
      return;
    }

    const longestDuration = playerArray.reduce((acc, _, i) => {
      const duration = buffer.current[index]?.[i]?.duration;
      return Math.max(acc, duration || 0);
    }, 0);

    Tone.Transport.cancel();

    const startTime = Tone.Transport.seconds + 0.1;

    playerArray.forEach((play, playerIndex) => {
      const timeOffset = startTime + playerIndex * 0.01;
      Tone.Transport.schedule((time) => {
        if (isPlaying) {
          if (play) {
            play.start(time);
            play.mute = false;
          }
        }
      }, timeOffset);
    });

    const nextStartTime = startTime + longestDuration;

    Tone.Transport.scheduleOnce(() => {
      if (isPlaying) {
        playerArray.forEach((p) => {
          if (p) {
            p.stop();
            p.mute = true;
          }
        });
        const nextIndex =
          projects.length === 1 ? index : (index + 1) % projects.length;
        setSelectedIndex(nextIndex);

        if (projects.length === 1) {
          handlePlayForProject(index);
        } else {
          Tone.Transport.scheduleOnce(() => {
            if (isPlaying) {
              handlePlayForProject(nextIndex);
            }
          }, nextStartTime);
        }
      }
    }, nextStartTime - 0.01);
  };

  useEffect(() => {
    if (isPlaying && Tone.Transport.state !== "started") {
      Tone.Transport.start();
    }

    if (!isPlaying && Tone.Transport.state !== "stopped") {
      Tone.Transport.stop();
    }
  }, [isPlaying]);

  const handlePlayForProject = (projectIndex: number) => {
    if (!isPlaying) {
      return;
    }
    const selectedPlayerArray = player.current[projectIndex];
    handleStopAndRepeat(selectedPlayerArray, projectIndex);
  };

  useEffect(() => {
    if (!isPlaying || typeof selectedIndex === "undefined") {
      return;
    }

    handlePlayForProject(selectedIndex);
  }, [selectedIndex, isPlaying]);

  useEffect(() => {
    if (selectedIndex !== undefined) {
      const selectedPlayerArray = player.current[selectedIndex];
      if (isPlaying) {
        handleStopAndRepeat(selectedPlayerArray, selectedIndex);
      } else {
        selectedPlayerArray?.forEach((p) => {
          if (p) {
            p?.stop();
            p.mute = true;
          }
        });
      }
    }
  }, [isPlaying, selectedIndex]);

  const onDelete = useCallback((projectId: string) => {
    const result = window.confirm("Do you really want to delete this project");
    if (result) {
      dispatch(deleteProject(projectId));
      toast.success("Everything went well");
    }
  }, []);

  const handleVolumeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const volumeValue = typeof newValue === "number" ? newValue : newValue[0];
      player.current.forEach((playerArray) =>
        playerArray.forEach((p) => {
          // eslint-disable-next-line no-param-reassign
          if (p) p.volume.value = volumeValue;
        }),
      );
      if (typeof volumeValue === "number") {
        dispatch(setVolume(volumeValue));
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setSelectedIndex(undefined);
    dispatch(togglePlay(false));
    player.current.forEach((playerArray) =>
      playerArray.forEach((p) => {
        if (p) {
          p.stop();
          p.mute = true;
        }
      }),
    );
  }, []);

  const moveProject = (dragItem: IPad, hoverItem: IPad) => {
    const dragIndex = projects.findIndex((p) => p.id === dragItem.id);
    const hoverIndex = projects.findIndex((p) => p.id === hoverItem.id);

    if (dragIndex === hoverIndex) {
      return;
    }

    const newProjects = [...projects];
    const draggedProject = newProjects[dragIndex];

    newProjects.splice(dragIndex, 1);
    newProjects.splice(hoverIndex, 0, draggedProject);

    dispatch(updateProjects(newProjects.map((p, i) => ({ ...p, order: i }))));

    handleReset();
  };

  const addRandomProject = useCallback(() => {
    const newRandomCategories = currentProject.config.categories.map(
      (category) => {
        return {
          ...category,
          isMuted: Math.random() < 0.5,
        };
      },
    );

    const newColor = randomColor();
    const number = Math.floor(Math.random() * 42) + 1;

    const createNewRandomProject: IPad = {
      ...currentProject,
      color: newColor,
      id: `project-${Date.now()}`,
      imageVariant: `l${number}`,
      config: {
        ...currentProject.config,
        categories: newRandomCategories,
      },
    };

    dispatch(setUpConfig(createNewRandomProject));
  }, []);

  return (
    <div className={s.livePadsContent}>
      <div className={s.livePads__possibilities}>
        <div className={s.livePads__title}>Live pads</div>
        <div className={s.livePads__settings}>
          <Button variant="outlined">
            <AiDjIcon />
            AI DJ
          </Button>
          <div className={s.separation} />
          <Button>
            <RecordMusicIcon />
            Record
          </Button>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <Projects
          onSelect={handleSelect}
          selectedIndex={selectedIndex}
          projects={projects}
          moveProject={moveProject}
          onDelete={onDelete}
          addRandomProject={addRandomProject}
        />
      </DndProvider>
      {projects.length > 0 && (
        <PlayProjectsButton
          onPlay={handlePlay}
          isPlaying={isPlaying}
          maxVolume={0}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
}

export default LivePadsContent;

import React, { useState } from "react";

import { Slider } from "@mui/material";

import PlayMusicIcon from "components/icons/PlayMusicIcon";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import VolumeLoudIcon from "components/icons/VolumeLoudIcon";
import MuteIcon from "components/icons/MuteIcon";
import PauseMusicIcon from "components/icons/PauseMusicIcon";

import { useAppDispatch } from "hooks/store";
import { reset } from "store/reducers/padReducer";

import s from "./PlayProjectsButton.module.scss";

interface PlayProjectsButtonProps {
  onPlay: () => void;
  isPlaying: boolean;
  onVolumeChange: (event: Event, v: number | number[]) => void;
  maxVolume: number;
  volume: number;
}

function PlayProjectsButton({
  onPlay,
  isPlaying,
  onVolumeChange,
  volume,
  maxVolume,
}: PlayProjectsButtonProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={s.playButton}>
      <div className={s.stop}>
        <StopRoundedIcon
          className={s.icon}
          onClick={() => {
            dispatch(reset());
          }}
        />
      </div>
      <div className={s.play}>
        {isPlaying ? (
          <PauseMusicIcon className={s.icon} onClick={onPlay} />
        ) : (
          <PlayMusicIcon className={s.icon} onClick={onPlay} />
        )}
      </div>
      <div className={s.volumeChange}>
        {volume > -50 ? (
          <VolumeLoudIcon className={s.icon} />
        ) : (
          <MuteIcon className={s.icon} />
        )}
      </div>
      <div className={s.up}>
        <div className={s.up_settings}>
          <Slider
            className={s.sliderStyles}
            value={volume}
            min={-60}
            max={maxVolume}
            onChange={onVolumeChange}
            step={1}
            sx={{
              width: "80px",
              position: "absolute",
              "& .MuiSlider-thumb": {
                backgroundColor: "#0BD1C9",
              },
              color: "#FFFFFF",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayProjectsButton;

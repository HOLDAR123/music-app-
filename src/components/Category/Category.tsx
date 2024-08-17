/* eslint-disable consistent-return */
import React, { useCallback, useEffect, useState } from "react";

import Slider from "components/common/Slider";
import Button from "components/common/Button";
import Sound from "components/Sound";

import VolumeMuteIcon from "components/icons/VolumeMuteIcon";
import VolumeLoudIcon from "components/icons/VolumeLoudIcon";
import RecordMusicIcon from "components/icons/RecordMusicIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import CrossIcon from "components/icons/CrossIcon";
import ExportMusicIcon from "components/icons/ExportMusicIcon";
import ListArrowDown from "components/icons/ListArrowDown";
import ListArrowUp from "components/icons/ListArrowUp";
import PlusIcon from "components/icons/PlusIcon";
import EffectsIcon from "components/icons/EffectsIcon";

import EffectsContainer from "components/EffectsContainer";
import { toast } from "react-toastify";

import {
  addRandomSoundToCategory,
  deleteCategory,
  reset,
  toggleCategoryMute,
  deleteSound,
  addEffect,
  effectsState,
  updateEffects,
  setSelectedSound,
  updateSoundsToCategory,
} from "store/reducers/padReducer";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { EffectType, ICategory, IEffect, ISound } from "types/Music";

import { useAppDispatch, useAppSelector } from "hooks/store";
import randomAudio from "utils/randomAudio";
import randomColor from "utils/randomColor";

import s from "./Category.module.scss";

interface CategoryProps {
  category: ICategory;
  isPlaying: boolean;
  volume: number;
}

function Category({ category, isPlaying, volume }: CategoryProps) {
  const dispatch = useAppDispatch();

  const [rolledUp, setRolledUp] = useState<boolean>(true);
  const [playSolo, setPlaySolo] = useState<string | "all">("all");
  const [openSettingMenu, setOpenSettingMenu] = useState<boolean>(false);

  const [toggleEffectsModal, setToggleEffectsModal] = useState<boolean>(false);

  const [soundRatio, setSoundRatio] = useState<number>(-25);

  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const [firstSong, setFirstSong] = useState<ISound | undefined>(undefined);
  const [secondSong, setSecondSong] = useState<ISound | undefined>(undefined);

  const [isEffectsVisible, setIsEffectsVisible] = useState<boolean>(true);

  const allEffects = useAppSelector(
    (state) =>
      state.pad.config.categories.find((cat) => cat.id === category.id)
        ?.effects || [],
  );

  const moveEffect = (dragItem: IEffect, hoverItem: IEffect) => {
    const dragIndex = category.effects.findIndex((p) => p.id === dragItem.id);
    const hoverIndex = category.effects.findIndex((p) => p.id === hoverItem.id);
    const newEffects = [...category.effects];

    const draggedProject = newEffects[dragIndex];
    newEffects.splice(dragIndex, 1);
    newEffects.splice(hoverIndex, 0, draggedProject);

    dispatch(
      updateEffects({
        effects: newEffects,
        categoryId: category.id,
      }),
    );
  };

  const handleToggleEffectsVisible = () => {
    setIsEffectsVisible((prev) => !prev);
  };

  const handleToggleEffectsModal = useCallback(() => {
    setToggleEffectsModal((prev) => !prev);
  }, []);

  const handleAddEffect = useCallback(
    (type: EffectType) => {
      if (!isPlaying) {
        const effectId = `id-effect-${Date.now()}`;

        if (category.sounds.length > 0) {
          if (type === "Filter") {
            const filterID = `filter-${Date.now()}`;
            dispatch(
              addEffect({
                categoryId: category.id,
                effect: {
                  type,
                  id: effectId,
                  content: {
                    type: "lowpass",
                    id: filterID,
                    filter: {
                      filterFreq: 0,
                    },
                  },
                },
              }),
            );
          }
          if (type === "Reverb") {
            const reverbID = `reverb-${Date.now()}`;
            dispatch(
              addEffect({
                categoryId: category.id,
                effect: {
                  id: effectId,
                  type,
                  content: {
                    id: reverbID,
                    type: "none",
                    reverb: {
                      decay: 0.1,
                      wet: 0,
                    },
                  },
                },
              }),
            );
          }
          if (type === "Delay") {
            const delayID = `delay-${Date.now()}`;
            dispatch(
              addEffect({
                categoryId: category.id,
                effect: {
                  id: effectId,
                  type,
                  content: {
                    id: delayID,
                    delay: {
                      feedback: 0,
                      delayTime: 0,
                    },
                  },
                },
              }),
            );
          }
          if (type === "Compressor") {
            const compressorID = `compressor-${Date.now()}`;
            dispatch(
              addEffect({
                categoryId: category.id,
                effect: {
                  id: effectId,
                  type,
                  content: {
                    id: compressorID,
                    compressor: {
                      ratio: 0,
                      threshold: 0,
                    },
                  },
                },
              }),
            );
          }
        }
        setToggleEffectsModal(false);
      }
    },
    [isPlaying, category.sounds, category.id],
  );

  const handleSongSelect = (songId: string) => {
    const selectedSound = category.sounds.find((sound) => sound.id === songId);

    if (!selectedSound) {
      return;
    }

    if (selectedSongs.length < 2) {
      if (selectedSongs.includes(songId)) {
        setSelectedSongs(selectedSongs.filter((id) => id !== songId));
      } else {
        setSelectedSongs([...selectedSongs, songId]);
      }
    } else {
      const currentFirstSound = category.sounds.find(
        (sound) => sound.id === selectedSongs[0],
      );
      const currentSecondSound = category.sounds.find(
        (sound) => sound.id === selectedSongs[1],
      );
      if (currentFirstSound && currentSecondSound) {
        let quieterSound = selectedSound;

        if (
          selectedSound.volume <= currentFirstSound.volume ||
          selectedSound.volume !== currentFirstSound.volume
        ) {
          quieterSound = currentFirstSound;
        }

        if (quieterSound.volume <= currentSecondSound.volume) {
          quieterSound = currentSecondSound;
        }

        if (quieterSound === selectedSound) {
          setSelectedSongs([songId, selectedSongs[1]]);
        } else if (quieterSound === currentFirstSound) {
          setSelectedSongs([selectedSongs[0], songId]);
        } else {
          setSelectedSongs([songId, selectedSongs[1]]);
        }
      }
      if (selectedSongs.includes(songId)) {
        setSelectedSongs(selectedSongs.filter((id) => id !== songId));
      }
    }
  };

  useEffect(() => {
    const fs: ISound | undefined = category.sounds.find(
      (sound) => sound.id === selectedSongs[0],
    );
    const ss: ISound | undefined = category.sounds.find(
      (sound) => sound.id === selectedSongs[1],
    );
    setFirstSong(fs);
    setSecondSong(ss);
  }, [selectedSongs]);

  const handleMuteCategory = () => {
    dispatch(toggleCategoryMute({ categoryId: category.id }));
  };

  const handlePlaySolo = (id: string | "all") => {
    setPlaySolo(id);
  };

  const handleSoundRatio = useCallback(
    (v: number) => {
      setSoundRatio(v);
    },
    [soundRatio],
  );

  const handleRolledUp = () => {
    setRolledUp((roll) => !roll);
  };
  const ToggleSettingsMenu = () => {
    setOpenSettingMenu((prev) => !prev);
  };

  const handleDeleteCategory = () => {
    const result = window.confirm("Are you sure you want to delete?");
    if (result) {
      dispatch(deleteCategory({ categoryId: category.id }));
      toast.success("Everything went well");
    }
  };

  const handleDeleteSound = (soundId: string) => {
    dispatch(deleteSound({ soundId }));
  };
  useEffect(() => {
    const soundIdsToUpdate: string[] = [];

    if (firstSong) {
      soundIdsToUpdate.push(firstSong.id);
    }

    if (secondSong) {
      soundIdsToUpdate.push(secondSong.id);
    }
    category.sounds.forEach((sound) => {
      const isSelected = soundIdsToUpdate.includes(sound.id);
      dispatch(
        setSelectedSound({
          categoryId: category.id,
          isSelected,
          soundId: sound.id,
        }),
      );
    });
  }, [category, firstSong, secondSong, dispatch]);

  const addSound = () => {
    if (!isPlaying) {
      const color = randomColor();
      const audioFile = randomAudio(category.type);
      dispatch(
        addRandomSoundToCategory({
          categoryId: category.id,
          audioFile,
          color,
          type: category.type,
        }),
      );
      dispatch(reset());
    }
  };

  return (
    <div
      className={s.music}
      style={{
        opacity: category.isMuted ? "0.3" : "1",
        pointerEvents: category.isMuted ? "none" : "auto",
      }}
    >
      <div className={s.music__settings}>
        <div className={s.track__settings}>
          <Button
            onClick={handleMuteCategory}
            style={{
              opacity: "1",
              pointerEvents: "auto",
              border: category.isMuted ? "1px solid Salmon" : "",
            }}
            className={s.iconSetting}
          >
            {category.isMuted ? (
              <>
                <VolumeLoudIcon />
                Unmute Track
              </>
            ) : (
              <>
                <VolumeMuteIcon />
                Mute Track
              </>
            )}
          </Button>
          <Button className={s.iconSetting}>
            <RecordMusicIcon />
            Record track
          </Button>
          <Button className={s.iconSetting}>
            <ExportMusicIcon />
            Export
          </Button>
        </div>
        <div className={s.mobileMenu}>
          <button
            type="button"
            className={s.showButtonSettings}
            onClick={ToggleSettingsMenu}
          >
            {openSettingMenu ? <CrossIcon /> : <ListArrowDown />}
          </button>
        </div>
        <div className={s.bundling__settings}>
          <Button onClick={handleDeleteCategory} className={s.iconSetting}>
            <DeleteIcon />
            Delete
          </Button>
          <Button onClick={handleRolledUp} className={s.iconSetting}>
            {rolledUp ? (
              <>
                Roll up
                <ListArrowDown />
              </>
            ) : (
              <>
                Roll down
                <ListArrowUp />
              </>
            )}
          </Button>
        </div>
      </div>
      {openSettingMenu && (
        <div className={s.containerSettings}>
          <Button onClick={handleDeleteCategory} className={s.iconSetting}>
            <DeleteIcon />
            Delete
          </Button>
          <Button onClick={handleRolledUp} className={s.iconSetting}>
            {rolledUp ? (
              <>
                Roll up
                <ListArrowDown />
              </>
            ) : (
              <>
                Roll down
                <ListArrowUp />
              </>
            )}
          </Button>
        </div>
      )}
      <div className={s.kicks}>
        {category.sounds.map((sound, index) => {
          return (
            <Sound
              category={category}
              sound={sound}
              key={sound.id}
              isPlaying={isPlaying}
              muted={category.isMuted}
              playSolo={playSolo}
              setPlaySolo={handlePlaySolo}
              index={index + 1}
              volume={volume}
              onSelect={handleSongSelect}
              isSelected={
                firstSong?.id === sound.id || secondSong?.id === sound.id
              }
              soundRatio={soundRatio}
              isFirst={firstSong?.id === sound.id}
              isSecond={secondSong?.id === sound.id}
              rolledUp={rolledUp}
              onDelete={() => handleDeleteSound(sound.id)}
            />
          );
        })}
        <Button
          variant="outlined"
          onClick={addSound}
          style={{
            pointerEvents: rolledUp ? "auto" : "none",
          }}
        >
          <div className={s.iconSetting}>
            <PlusIcon />
            Generate track
          </div>
        </Button>
      </div>
      <div className={s.kick__soundSettings}>
        <div className={s.kick__mainSlider}>
          <div className={s.soundSeparator}>
            <div
              className={`${s.soundSeparator__kickTitle}`}
              style={{
                left: "0%",
                background: `${firstSong?.color || "#38364C"}`,
              }}
            >
              {firstSong?.index}
            </div>
            <Slider
              value={soundRatio}
              onChange={handleSoundRatio}
              height={50}
              width={50}
              min={-60}
              max={0}
              step={1}
              primary={firstSong?.color || "#38364C"}
              secondary={secondSong?.color || "#38364C"}
            />
            <div
              className={`${s.soundSeparator__kickTitle}`}
              style={{
                right: "0%",
                background: `${secondSong?.color || "#38364C"} `,
              }}
            >
              {secondSong?.index}
            </div>
          </div>
          <div className={s.effectsVisibleToggler}>
            <Button
              variant="outlined"
              onClick={handleToggleEffectsVisible}
              classNameForContainer={s.buttonAddEffect}
            >
              <div className={s.iconSetting}>
                <EffectsIcon />
                <span className={s.effectsLabel}>Effects</span>
                {isEffectsVisible ? <ListArrowUp /> : <ListArrowDown />}
              </div>
            </Button>
          </div>
        </div>

        {isEffectsVisible && (
          <div className={s.kick__effects}>
            <div className={s.kick__effectAdding}>
              <div className={s.kick__effectsTitle}>Effects</div>
              <div
                className={
                  !toggleEffectsModal
                    ? s.kick__effectsListItems
                    : s.kick__effectsListItemsList
                }
              >
                <button
                  type="button"
                  onClick={handleToggleEffectsModal}
                  className={s.kick__effectsButton}
                  style={
                    toggleEffectsModal
                      ? {
                          borderBottom: "1px solid transparent",
                          borderImage:
                            "linear-gradient(95deg, #0ad1ce 0%, #14c156 100%)",
                          borderImageSlice: 1,
                          padding: "0.8rem 0.8rem 0.4rem 0.8rem",
                        }
                      : {
                          padding: "0.8rem",
                        }
                  }
                >
                  <PlusIcon className={s.icon} />
                  Add effects
                </button>
                {toggleEffectsModal && (
                  <div className={s.kick__effectsItems}>
                    {effectsState.map((effect) => (
                      <li className={s.kick__effectsItem} key={effect.id}>
                        <button
                          className={s.kick__effectsItemText}
                          onClick={() => handleAddEffect(effect.type)}
                          type="button"
                        >
                          {effect.type}
                        </button>
                      </li>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={s.effectsContainer}>
              <DndProvider backend={HTML5Backend}>
                <div className={s.effects_container}>
                  {allEffects.map((effect: IEffect) => (
                    <EffectsContainer
                      effect={effect}
                      key={effect.id}
                      category={category}
                      isPlaying={isPlaying}
                      moveEffect={moveEffect}
                    />
                  ))}
                </div>
              </DndProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;

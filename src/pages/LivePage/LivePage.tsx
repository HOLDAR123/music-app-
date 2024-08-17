import React, { useEffect, useState, useRef } from "react";
import Button from "components/common/Button";
import PlayButton from "components/PlayButton";
import Category from "components/Category";
import randomColor from "utils/randomColor";

import EditPenIcon from "components/icons/EditPenIcon";
import AddToLivePadsIcon from "components/icons/AddToLivePadsIcon";
import ExportMusicIcon from "components/icons/ExportMusicIcon";
import RecordMusicIcon from "components/icons/RecordMusicIcon";
import ListArrowDown from "components/icons/ListArrowDown";
import CrossIcon from "components/icons/CrossIcon";
import LoadMusicIcon from "components/icons/LoadMusicIcon";
import SaveMusicIcon from "components/icons/SaveMusicIcon";

import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "hooks/store";

import {
  addCategory,
  setNewSettings,
  setVolume,
  togglePlay,
  setTitle,
  setId,
} from "store/reducers/padReducer";

import { setUpConfig } from "store/reducers/projectReducer";
import { saveProject } from "store/reducers/authReducer";
import { allCategories } from "types/Music";

import s from "./LivePage.module.scss";

function LivePage() {
  const [playButtonVisible, setPlayButtonVisible] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<string>("My Project 001");
  const [visibleGroupSettings, setVisibleGroupSettings] =
    useState<boolean>(false);
  const [openSettingMenu, setOpenSettingMenu] = useState<boolean>(false);
  const [projectTitleEditable, setProjectTitleEditable] =
    useState<boolean>(false);
  const [openMusicAddingModal, setOpenMusicAddingModal] =
    useState<boolean>(false);

  const { isPlaying, categories, volume } = useAppSelector(
    (state) => state.pad.config,
  );
  const pad = useAppSelector((state) => state.pad);
  const { projects } = useAppSelector((state) => state.project);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1250) {
        setVisibleGroupSettings(true);
      } else {
        setVisibleGroupSettings(false);
        setOpenSettingMenu(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePlay = () => {
    const allSoundsLoaded = categories.every((category) =>
      category.sounds.every((sound) => sound.isLoaded),
    );

    if (allSoundsLoaded) {
      dispatch(togglePlay(false));
    } else {
      toast.warning("Some sounds are not loaded");
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const volumeValue = typeof newValue === "number" ? newValue : newValue[0];
    dispatch(setVolume(volumeValue));
  };

  const addToLivePads = () => {
    const selectedSoundsCount = categories.reduce((count, cat) => {
      return count + cat.sounds.filter((sound) => sound.isSelected).length;
    }, 0);

    if (selectedSoundsCount < 1) {
      toast.error("Please select more music before adding to live pads.");
      return;
    }

    const result = window.confirm(
      "Do you want to add this project to live pads?",
    );
    if (result) {
      const color = randomColor();
      dispatch(setUpConfig(pad));
      dispatch(setNewSettings({ projects, color }));
      toast.success("Everything went well");
    }
  };

  const handleOpenMusicAddingModal = () => {
    setOpenMusicAddingModal(!openMusicAddingModal);
  };

  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const addButtonElement = addButtonRef.current;
      if (
        openMusicAddingModal &&
        addButtonElement &&
        !addButtonElement.contains(event.target as Node)
      ) {
        setOpenMusicAddingModal(false);
      }
    };

    if (openMusicAddingModal) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [openMusicAddingModal]);

  const handleAddCategory = (categoryType: any) => {
    dispatch(setTitle(projectTitle));
    dispatch(setId(new Date().getTime().toString()));
    setOpenMusicAddingModal(false);
    const newCategory = { type: categoryType };
    dispatch(addCategory(newCategory));
    setPlayButtonVisible(true);
  };

  const handleSaveProject = () => {
    if (categories.length === 0) {
      toast.error("You cannot save the project without added music.");
      return;
    }

    const result = window.confirm("Do you want to save this project?");
    if (result) {
      dispatch(saveProject(pad));
      toast.success("Everything went well");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(togglePlay(true));
    };
  }, []);

  const toggleSettingsMenu = () => {
    setOpenSettingMenu((prev) => !prev);
  };

  const handleProjectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(projectTitle));
    setProjectTitle(e.target.value);
  };

  return (
    <div className={s.livePage}>
      <div className={s.fixed}>
        <div className={s.possibilities}>
          <div className={s.possibilities__title}>
            {projectTitleEditable ? (
              <input
                type="text"
                value={projectTitle}
                onChange={handleProjectTitle}
                onBlur={() => setProjectTitleEditable(false)}
                className={s.possibilities__titleInput}
              />
            ) : (
              <div className={s.titleEdit}>
                {projectTitle.length > 15
                  ? `${projectTitle.slice(0, 15)}...`
                  : projectTitle}
                <button
                  type="button"
                  onClick={() => setProjectTitleEditable(true)}
                >
                  <EditPenIcon />
                </button>
              </div>
            )}
          </div>
          <div className={s.possibilities__settings}>
            <Button
              onClick={addToLivePads}
              variant="outlined"
              className={s.settingsButton}
            >
              <AddToLivePadsIcon />
              Add to Live Pads
            </Button>
            <div className={s.separationFirst} />
            {visibleGroupSettings ? (
              <button
                type="button"
                className={s.showButtonSettings}
                onClick={toggleSettingsMenu}
              >
                {openSettingMenu ? <CrossIcon /> : <ListArrowDown />}
              </button>
            ) : (
              <div className={s.containerSettings}>
                <Button>
                  <ExportMusicIcon />
                  Export all
                </Button>
                <Button>
                  <RecordMusicIcon />
                  Record
                </Button>
                <div className={s.separation} />
                <Button>
                  <LoadMusicIcon />
                  Load
                </Button>
                <Button onClick={handleSaveProject}>
                  <SaveMusicIcon />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
        {openSettingMenu && (
          <div className={s.settingsMenu}>
            <Button className={s.settingsButton}>
              <ExportMusicIcon />
              Export all
            </Button>
            <Button className={s.settingsButton}>
              <RecordMusicIcon />
              Record
            </Button>
            <div className={s.separationMenu} />
            <Button className={s.settingsButton}>
              <LoadMusicIcon />
              Load
            </Button>
            <Button onClick={handleSaveProject} className={s.settingsButton}>
              <SaveMusicIcon />
              Save
            </Button>
          </div>
        )}
      </div>
      <div className={s.container}>
        <div className={s.categories}>
          {categories.map((category) => (
            <Category
              category={category}
              key={category.id}
              isPlaying={isPlaying}
              volume={volume}
            />
          ))}
          {categories.length !== 0 && (
            <PlayButton
              onPlay={handlePlay}
              isPlaying={isPlaying}
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          )}
        </div>
      </div>
      {categories.length === 0 && (
        <div className={s.pressPlus}>
          <p className={s.pressPlusText}>Press + to add new track</p>
        </div>
      )}
      <div className={s.createNewTrack}>
        {openMusicAddingModal && (
          <div className={s.musicAddingModal}>
            {allCategories.map((category) => (
              <div className={s.musicAddingModal__title} key={category}>
                <button
                  type="button"
                  onClick={() => handleAddCategory(category)}
                  className={s.addCategoryButton}
                >
                  {category}
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          ref={addButtonRef}
          className={s.addingNewTrack}
          onClick={handleOpenMusicAddingModal}
        >
          <div
            className={`${s.plusIcon} ${openMusicAddingModal ? s.rotate : ""}`}
          >
            +
          </div>
        </button>
      </div>
    </div>
  );
}

export default LivePage;

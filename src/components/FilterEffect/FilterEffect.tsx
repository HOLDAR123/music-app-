import React, { useCallback, useMemo, useState } from "react";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import Slider from "components/common/Slider";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";
import { ICategory, IEffect, IFilter } from "types/Music";
import ListArrowUp from "components/icons/ListArrowUp";
import ListArrowDown from "components/icons/ListArrowDown";
import {
  filtersState,
  deleteEffect,
  updateEffect,
} from "store/reducers/padReducer";
import { useAppDispatch } from "hooks/store";
import s from "./FilterEffect.module.scss";

interface EffectProps {
  effect: IEffect;
  isPlaying: boolean;
  category: ICategory;
  moveEffect: (effect: IEffect, effect2: IEffect) => void;
}

function isFilter(effect: IEffect): effect is IEffect & { content: IFilter } {
  return "filter" in effect.content;
}

function FilterEffect({
  effect,
  isPlaying,
  category,
  moveEffect,
}: EffectProps) {
  const dispatch = useAppDispatch();
  const [activeFilterType, setActiveFilterType] = useState<string>("");
  const [toggleFiltersModal, setToggleFiltersModal] = useState<boolean>(false);

  const frequencyValue = useMemo(() => {
    return category.effects.filter(isFilter).find((eff) => eff.id === effect.id)
      ?.content.filter.filterFreq;
  }, [category.effects, effect.id]);

  const typeVal = useMemo(() => {
    return category.effects.filter(isFilter).find((eff) => eff.id === effect.id)
      ?.content.type;
  }, [category.effects, effect.id]);

  const [, drag] = useDrag<IEffect, unknown, any>({
    type: "effect",
    item: { ...effect },
  });

  const [, drop] = useDrop({
    accept: "effect",
    hover(item: IEffect) {
      if (!item || !effect) return;
      moveEffect(item, effect);
    },
    // drop: () => {
    //   handleReverbOrderChange([effect]);
    // },
  });

  const updateFilterFrequency = useCallback(
    (newFrequency: number) => {
      if (!isPlaying) {
        dispatch(
          updateEffect({
            categoryId: category.id,
            effect,
            values: {
              id: effect.content.id,
              type: "lowpass",
              filter: {
                filterFreq: newFrequency,
              },
            },
          }),
        );
      }
    },
    [isPlaying, category.id, effect],
  );

  const handleToggleFiltersModal = useCallback(() => {
    setToggleFiltersModal((prev) => !prev);
  }, []);

  const updateFilterType = useCallback(
    (filter: IFilter) => {
      if (!isPlaying) {
        dispatch(
          updateEffect({
            categoryId: category.id,
            effect,
            values: {
              id: effect.content.id,
              type: filter.type,
              filter: {
                filterFreq: frequencyValue || 0,
              },
            },
          }),
        );

        setActiveFilterType(filter.type);
        setToggleFiltersModal(false);
      }
    },
    [isPlaying, effect, category.id, frequencyValue],
  );

  const handleDeleteFilter = useCallback(() => {
    if (isPlaying) {
      toast.error("You can't delete compressor while playing");
      return;
    }

    const result = window.confirm("Are you sure you want to delete?");
    if (result) {
      dispatch(deleteEffect({ effectId: effect?.id, categoryId: category.id }));
      toast.success("Everything went well");
    }
  }, [effect?.id, isPlaying, category.id]);

  return (
    <div className={s.effect} ref={(element) => drag(drop(element))}>
      <div className={s.effectSettings}>
        <div className={s.effectTitle}>Filter</div>
        <button
          type="button"
          onClick={handleDeleteFilter}
          className={s.effectDelete}
        >
          <CloseSettingsIcon />
        </button>
      </div>
      <div className={s.effectType}>
        <div className={s.effectTypeName}>Freq</div>
        <Slider
          value={frequencyValue || 0}
          max={5000}
          min={0}
          step={100}
          width={25}
          height={25}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={updateFilterFrequency}
          className={s.slider}
        />
      </div>

      <div className={s.effectType}>
        <div className={s.effectTypeName}>Type</div>
        <div className={s.kick__effectAdding}>
          <div className={s.kick__effectsListItems}>
            <button
              type="button"
              onClick={handleToggleFiltersModal}
              className={s.kick__effectsButton}
              style={
                toggleFiltersModal
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
              <span className={s.iconSetting}>
                {typeVal}
                {toggleFiltersModal ? <ListArrowDown /> : <ListArrowUp />}
              </span>
            </button>
            {toggleFiltersModal && (
              <div className={s.kick__effectsItems}>
                {filtersState.map((filter) => (
                  <li
                    className={`${s.kick__effectsItem} ${
                      activeFilterType === filter.type ? s.active : ""
                    }`}
                    key={filter.id}
                  >
                    <button
                      className={s.kick__effectsItemText}
                      type="button"
                      onClick={() => updateFilterType(filter)}
                    >
                      {filter.type}
                    </button>
                  </li>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterEffect;

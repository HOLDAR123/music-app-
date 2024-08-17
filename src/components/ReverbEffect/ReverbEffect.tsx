import React, { useCallback, useMemo, useState } from "react";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import Slider from "components/common/Slider";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";
import { ICategory, IEffect, IReverb, ReverbType } from "types/Music";
import ListArrowDown from "components/icons/ListArrowDown";
import ListArrowUp from "components/icons/ListArrowUp";
import {
  deleteEffect,
  reverbsState,
  updateEffect,
} from "store/reducers/padReducer";
import { useAppDispatch } from "hooks/store";
import s from "./ReverbEffect.module.scss";

interface EffectProps {
  effect: IEffect;
  isPlaying: boolean;
  moveEffect: (effect: IEffect, effect2: IEffect) => void;
  category: ICategory;
}

function isReverb(effect: IEffect): effect is IEffect & { content: IReverb } {
  return effect.type === "Reverb" && "reverb" in effect.content;
}

function ReverbEffect({
  effect,
  isPlaying,
  category,
  moveEffect,
}: EffectProps) {
  const dispatch = useAppDispatch();

  const [activeReverbType, setActiveReverbType] = useState<string>("");
  const [toggleReverbsModal, setToggleReverbsModal] = useState<boolean>(false);

  const decayVal = useMemo(() => {
    return category.effects.filter(isReverb).find((eff) => eff.id === effect.id)
      ?.content.reverb.decay;
  }, [category.effects, effect.id]);

  const wetVal = useMemo(() => {
    return category.effects.filter(isReverb).find((eff) => eff.id === effect.id)
      ?.content.reverb.wet;
  }, [category.effects, effect.id]);

  const typeVal = useMemo(() => {
    return category.effects.filter(isReverb).find((eff) => eff.id === effect.id)
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

  const updateReverb = useCallback(
    (newDecay: number, newWet: number) => {
      if (!isPlaying && activeReverbType === "Custom") {
        dispatch(
          updateEffect({
            categoryId: category.id,
            effect,
            values: {
              type: activeReverbType as ReverbType,
              id: effect.content.id,
              reverb: {
                decay: newDecay,
                wet: newWet,
              },
            },
          }),
        );
      }
    },
    [isPlaying, category.id, effect, activeReverbType],
  );

  const handleDeleteReverb = useCallback(() => {
    if (isPlaying) {
      toast.error("You can't delete reverb while playing");
      return;
    }

    const result = window.confirm("Are you sure you want to delete?");
    if (result) {
      dispatch(deleteEffect({ effectId: effect?.id, categoryId: category.id }));
      toast.success("Everything went well");
    }
  }, [effect?.id, isPlaying, category.id]);

  const handleToggleFiltersModal = useCallback(() => {
    setToggleReverbsModal((prev) => !prev);
  }, []);

  const handleReverbEffect = useCallback(
    (reverb: IReverb) => {
      if (!isPlaying) {
        setToggleReverbsModal(false);
        setActiveReverbType(reverb.type);

        const selectedReverbSettings = reverbsState.find(
          (item) => item.type === reverb.type,
        ) || {
          reverb: {
            decay: 0,
            wet: 0,
          },
        };
        dispatch(
          updateEffect({
            categoryId: category.id,
            effect,
            values: {
              type: reverb.type,
              id: effect.content.id,
              reverb: {
                decay: selectedReverbSettings.reverb.decay,
                wet: selectedReverbSettings.reverb.wet,
              },
            },
          }),
        );
      }
      setToggleReverbsModal(false);
    },
    [isPlaying, category.id],
  );

  return (
    <div className={s.effect} ref={(element) => drag(drop(element))}>
      <div className={s.effectSettings}>
        <div className={s.effectTitle}>Reverb</div>
        <button
          type="button"
          onClick={handleDeleteReverb}
          className={s.effectDelete}
        >
          <CloseSettingsIcon />
        </button>
      </div>
      <div className={s.effectType}>
        <div className={s.effectTypeName}>Decay</div>
        <Slider
          value={decayVal || 0}
          max={10}
          min={0}
          step={1}
          width={25}
          height={25}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={(value: number) => updateReverb(value, wetVal || 0)}
          className={s.slider}
        />
      </div>
      <div className={s.effectType}>
        <div className={s.effectTypeName}>Wet</div>
        <Slider
          value={wetVal || 0}
          max={1}
          min={0}
          step={0.1}
          width={25}
          height={25}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={(value: number) => updateReverb(decayVal || 0, value)}
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
                toggleReverbsModal
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
                {typeVal === "none" ? "Choose Type" : typeVal}
                {toggleReverbsModal ? <ListArrowDown /> : <ListArrowUp />}
              </span>
            </button>
            {toggleReverbsModal && (
              <div className={s.kick__effectsItems}>
                {reverbsState.map((reverb) => (
                  <li
                    className={`${s.kick__effectsItem} ${
                      activeReverbType === reverb.type ? s.active : ""
                    }`}
                    key={reverb.id}
                  >
                    <button
                      className={s.kick__effectsItemText}
                      type="button"
                      onClick={() => handleReverbEffect(reverb)}
                    >
                      {reverb.type}
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

export default ReverbEffect;

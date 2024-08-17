import React, { useCallback, useMemo } from "react";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import Slider from "components/common/Slider";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";
import { ICategory, IDelay, IEffect } from "types/Music";
import { useAppDispatch } from "hooks/store";
import { deleteEffect, updateEffect } from "store/reducers/padReducer";
import s from "./DelayEffect.module.scss";

interface EffectProps {
  effect: IEffect;
  isPlaying: boolean;
  category: ICategory;
  moveEffect: (effect: IEffect, effect2: IEffect) => void;
}

function isDelay(effect: IEffect): effect is IEffect & { content: IDelay } {
  return effect.type === "Delay" && "delay" in effect.content;
}

function DelayEffect({ effect, isPlaying, category, moveEffect }: EffectProps) {
  const dispatch = useAppDispatch();

  const delayTime = useMemo(() => {
    return category.effects.filter(isDelay).find((eff) => eff.id === effect.id)
      ?.content.delay.delayTime;
  }, [category.effects, effect.id]);

  const feedback = useMemo(() => {
    return category.effects.filter(isDelay).find((eff) => eff.id === effect.id)
      ?.content.delay.feedback;
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
    //   handleDelayOrderChange([effect]);
    // },
  });

  const updateDelay = useCallback(
    (newDelayTime: number, newFeedBack: number) => {
      if (!isPlaying) {
        dispatch(
          updateEffect({
            categoryId: category.id,
            effect,
            values: {
              id: effect.content.id,
              delay: {
                delayTime: newDelayTime,
                feedback: newFeedBack,
              },
            },
          }),
        );
      }
    },
    [isPlaying, category.id, effect],
  );

  const handleDeleteDelay = useCallback(() => {
    if (isPlaying) {
      toast.error("You can't delete reverb while playing");
      return;
    }
    const result = window.confirm("Are you sure you want to delete?");
    if (result) {
      dispatch(deleteEffect({ effectId: effect?.id, categoryId: category.id }));
      toast.success("Everything went well");
    }
  }, [effect?.id, isPlaying]);

  return (
    <div className={s.effect} ref={(element) => drag(drop(element))}>
      <div className={s.effectSettings}>
        <div className={s.effectTitle}>Delay</div>
        <button
          type="button"
          onClick={handleDeleteDelay}
          className={s.effectDelete}
        >
          <CloseSettingsIcon />
        </button>
      </div>
      <div className={s.effectType}>
        <div className={s.effectTypeName}>Delay time</div>
        <Slider
          value={delayTime || 0}
          max={5}
          min={0}
          step={1}
          width={23}
          height={23}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={(value: number) => updateDelay(value, feedback || 0)}
          className={s.slider}
        />
      </div>

      <div className={s.effectType}>
        <div className={s.effectTypeName}>Feedback</div>
        <Slider
          value={feedback || 0}
          max={0.4}
          min={0}
          step={0.1}
          width={25}
          height={25}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={(value: number) => updateDelay(delayTime || 0, value)}
          className={s.slider}
        />
      </div>
    </div>
  );
}

export default DelayEffect;

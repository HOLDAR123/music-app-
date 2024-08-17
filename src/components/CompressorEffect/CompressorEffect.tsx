import React, { useCallback, useMemo } from "react";
import CloseSettingsIcon from "components/icons/CloseSettingsIcon";
import Slider from "components/common/Slider";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";
import { ICategory, ICompressor, IEffect } from "types/Music";
import { useAppDispatch } from "hooks/store";
import { deleteEffect, updateEffect } from "store/reducers/padReducer";
import s from "./CompressorEffect.module.scss";

interface EffectProps {
  effect: IEffect;
  isPlaying: boolean;
  category: ICategory;
  moveEffect: (effect: IEffect, effect2: IEffect) => void;
}

function isCompressor(
  effect: IEffect,
): effect is IEffect & { content: ICompressor } {
  return effect.type === "Compressor" && "compressor" in effect.content;
}
function CompressorEffect({
  effect,
  isPlaying,
  category,
  moveEffect,
}: EffectProps) {
  const dispatch = useAppDispatch();

  const thresholdValue = useMemo(() => {
    return category.effects
      .filter(isCompressor)
      .find((eff) => eff.id === effect.id)?.content.compressor.threshold;
  }, [category.effects, effect.id]);

  const ratioValue = useMemo(() => {
    return category.effects
      .filter(isCompressor)
      .find((eff) => eff.id === effect.id)?.content.compressor.ratio;
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
    //   handleCompressorOrderChange([effect]);
    // },
  });

  const updateCompressor = useCallback(
    (newCompressorRatio: number, newCompressorThreshold: number) => {
      if (!isPlaying) {
        dispatch(
          updateEffect({
            categoryId: category.id,
            effect,
            values: {
              id: effect.content.id,
              compressor: {
                ratio: newCompressorRatio,
                threshold: newCompressorThreshold,
              },
            },
          }),
        );
      }
    },
    [isPlaying, category.id, effect],
  );

  const handleDeleteCompessor = useCallback(() => {
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
        <div className={s.effectTitle}>Compessor</div>
        <button
          type="button"
          onClick={handleDeleteCompessor}
          className={s.effectDelete}
        >
          <CloseSettingsIcon />
        </button>
      </div>
      <div className={s.effectType}>
        <div className={s.effectTypeName}>Ratio</div>
        <Slider
          value={ratioValue || 0}
          max={19}
          min={1}
          step={1}
          width={25}
          height={25}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={(value: number) =>
            updateCompressor(value, thresholdValue || 0)
          }
          className={s.slider}
        />
      </div>

      <div className={s.effectType}>
        <div className={s.effectTypeName}>Threshold</div>
        <Slider
          value={thresholdValue || -60}
          max={0}
          min={-60}
          step={1}
          width={25}
          height={25}
          primary="#FF2667"
          secondary="#5644C9"
          onChange={(value: number) => updateCompressor(ratioValue || 0, value)}
          className={s.slider}
        />
      </div>
    </div>
  );
}

export default CompressorEffect;

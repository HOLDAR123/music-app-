import React from "react";

import ReverbEffect from "components/ReverbEffect";
import FilterEffect from "components/FilterEffect";
import DelayEffect from "components/DelayEffect";
import CompressorEffect from "components/CompressorEffect";
import { ICategory, IEffect } from "types/Music";

interface EffectsContainerProps {
  effect: IEffect;
  isPlaying: boolean;
  category: ICategory;
  moveEffect: (effect: IEffect, effect2: IEffect) => void;
}

function EffectsContainer({
  category,
  effect,
  isPlaying,
  moveEffect,
}: EffectsContainerProps) {
  const renderEffectComponent = () => {
    if (!effect || !effect.type) {
      return null;
    }

    switch (effect.type) {
      case "Reverb": {
        return (
          <ReverbEffect
            effect={effect}
            category={category}
            isPlaying={isPlaying}
            moveEffect={moveEffect}
          />
        );
      }
      case "Filter": {
        return (
          <FilterEffect
            key={effect.id}
            category={category}
            isPlaying={isPlaying}
            effect={effect}
            moveEffect={moveEffect}
          />
        );
      }
      case "Delay": {
        return (
          <DelayEffect
            key={effect.id}
            category={category}
            isPlaying={isPlaying}
            effect={effect}
            moveEffect={moveEffect}
          />
        );
      }
      case "Compressor": {
        return (
          <CompressorEffect
            key={effect.id}
            category={category}
            isPlaying={isPlaying}
            effect={effect}
            moveEffect={moveEffect}
          />
        );
      }
      default:
        return null;
    }
  };

  return <div>{renderEffectComponent()}</div>;
}

export default EffectsContainer;

export interface ICategory {
  id: string;
  name: string;
  isMuted: boolean;
  sounds: ISound[];
  effects: IEffect[];
  averageEffectsValues: {
    wet: number;
    decay: number;
    filterFreq: number;
    delayTime: number;
    feedback: number;
    threshold: number;
    ratio: number;
  };
  type: CategoryType;
}
export interface IReverb {
  id: string;
  reverb: {
    wet: number;
    decay: number;
  };
  type: ReverbType;
}

export interface IFilter {
  id: string;
  filter: {
    filterFreq: number;
  };
  type: FilterType;
}

export interface IDelay {
  id: string;
  delay: {
    delayTime: number;
    feedback: number;
  };
}

export interface IEffect {
  id: string;
  type: EffectType;
  content: IReverb | IFilter | IDelay | ICompressor;
}

export interface ICompressor {
  id: string;
  compressor: {
    threshold: number;
    ratio: number;
  };
}

export const allEffects: EffectType[] = [
  "Reverb",
  "Filter",
  "Delay",
  "Compressor",
];

export type EffectType = "Reverb" | "Filter" | "Delay" | "Compressor";

export type ReverbType =
  | "none"
  | "Ambience"
  | "Room"
  | "Hall"
  | "Cathedral"
  | "Gated"
  | "Custom";

export const allReverbs: ReverbType[] = [
  "none",
  "Ambience",
  "Room",
  "Hall",
  "Cathedral",
  "Gated",
  "Custom",
];

export type CategoryType =
  | "theme"
  | "sfx"
  | "closed_hihat"
  | "drums"
  | "kick"
  | "open_hihat";

export type FilterType =
  | "lowpass"
  | "highpass"
  | "bandpass"
  | "lowshelf"
  | "highshelf"
  | "notch"
  | "allpass"
  | "peaking";

export const allFilters: FilterType[] = [
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "highshelf",
  "notch",
  "allpass",
  "peaking",
];

export const allCategories: CategoryType[] = [
  "theme",
  "sfx",
  "closed_hihat",
  "drums",
  "kick",
  "open_hihat",
];

export interface ISound {
  index: number;
  id: string;
  file: string;
  isSelected: boolean;
  isLoaded: boolean;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  solo: boolean;
  color: string;
  categoryId: string;
  type: CategoryType;
}
export interface IPad {
  id: string;
  color: string;
  imageVariant: string;
  order: number;
  title: string;
  config: {
    isPlaying: boolean;
    moment: number;
    bpm: number;
    volume: number;
    categories: ICategory[];
  };
}

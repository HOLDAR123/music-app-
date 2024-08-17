import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  CategoryType,
  EffectType,
  ICategory,
  ICompressor,
  IDelay,
  IEffect,
  IFilter,
  IPad,
  IReverb,
  ISound,
} from "types/Music";

export const reverbsState: IReverb[] = [
  {
    id: "1",
    type: "Ambience",
    reverb: {
      decay: 3,
      wet: 0.5,
    },
  },
  {
    id: "2",
    type: "Hall",
    reverb: {
      decay: 4,
      wet: 0.6,
    },
  },
  {
    id: "3",
    type: "Cathedral",
    reverb: {
      decay: 7,
      wet: 0.7,
    },
  },
  {
    id: "4",
    type: "Gated",
    reverb: {
      decay: 5,
      wet: 0.8,
    },
  },
  {
    id: "5",
    type: "Room",
    reverb: {
      decay: 1,
      wet: 0.5,
    },
  },
  {
    id: "6",
    type: "Custom",
    reverb: {
      decay: 0.1,
      wet: 0,
    },
  },
];

export const filtersState: IFilter[] = [
  {
    id: "7",
    type: "lowpass",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "8",
    type: "highpass",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "9",
    type: "bandpass",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "10",
    type: "lowshelf",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "11",
    type: "highshelf",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "12",
    type: "notch",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "13",
    type: "allpass",
    filter: {
      filterFreq: 0,
    },
  },
  {
    id: "14",
    type: "peaking",
    filter: {
      filterFreq: 0,
    },
  },
];

interface IEffectState {
  id: string;
  type: EffectType;
}

export const effectsState: IEffectState[] = [
  {
    id: "15",
    type: "Filter",
  },
  {
    id: "16",
    type: "Reverb",
  },
  {
    id: "17",
    type: "Delay",
  },
  {
    id: "18",
    type: "Compressor",
  },
];

const initialState: IPad = {
  id: "",
  imageVariant: "l2",
  order: 0,
  color: "red",
  title: "",
  config: {
    isPlaying: false,
    moment: 0,
    bpm: 90,
    volume: 0,
    categories: [],
  },
};

export const padSlice = createSlice({
  name: "pad",
  initialState,
  reducers: {
    setNewSettings: (
      state,
      action: PayloadAction<{ projects: IPad[]; color: string }>,
    ) => {
      const { color, projects } = action.payload;
      const number = Math.floor(Math.random() * 42) + 1;
      state.id = `padId-${Date.now()}`;
      state.color = color;
      state.order = projects.length + 1;
      state.imageVariant = `l${number}`;
    },
    setIsLoaded: (
      state,
      action: PayloadAction<{ soundId: string; isLoaded: boolean }>,
    ) => {
      const { soundId, isLoaded } = action.payload;

      state.config.categories.forEach((category) => {
        const sound = category.sounds.find((s) => s.id === soundId);
        if (sound) {
          sound.isLoaded = isLoaded;
        }
      });
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.config.volume = action.payload;
    },
    setSelectedSound: (
      state,
      action: PayloadAction<{
        categoryId: string;
        soundId: string;
        isSelected: boolean;
      }>,
    ) => {
      const { categoryId, soundId, isSelected } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const sound = category.sounds.find((snd) => snd.id === soundId);
        if (sound) {
          sound.isSelected = isSelected;
        }
      }
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },

    togglePlay: (state, action: PayloadAction<boolean>) => {
      state.config.isPlaying = !state.config.isPlaying;
      if (action.payload) {
        state.config.isPlaying = false;
      }
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setMoment: (state, action: PayloadAction<number>) => {
      state.config.moment = action.payload;
    },
    setBpm: (state, action: PayloadAction<number>) => {
      state.config.bpm = action.payload;
    },
    reset: (state) => {
      state.config.isPlaying = false;
      state.config.volume = 1;
      state.config.moment = 0;
    },
    randomSound: (
      state,
      action: PayloadAction<{
        categoryId: string;
        soundId: string;
        audioFile: string;
      }>,
    ) => {
      const { categoryId, soundId, audioFile } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const sound = category.sounds.find((snd) => snd.id === soundId);
        if (sound) {
          sound.file = audioFile;
        }
      }
    },
    updateSoundsToCategory: (
      state,
      action: PayloadAction<{
        categoryId: string;
      }>,
    ) => {
      const { categoryId } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        category.sounds = category.sounds.filter(
          (sd) => sd.isSelected === true,
        );
      }
    },

    addRandomSoundToCategory: (
      state,
      action: PayloadAction<{
        categoryId: string;
        audioFile: string;
        color: string;
        type: CategoryType;
      }>,
    ) => {
      const { categoryId, color, audioFile, type } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const newSound: ISound = {
          id: `sound-${Date.now()}`,
          type,
          isLoaded: false,
          isPlaying: false,
          muted: false,
          solo: false,
          isSelected: false,
          volume: 1,
          color,
          index: category.sounds.length + 1,
          categoryId,
          file: audioFile,
        };
        category.sounds.push(newSound);
      }
    },
    addCategory: (
      state,
      action: PayloadAction<{
        type: CategoryType;
      }>,
    ) => {
      const { type } = action.payload;
      const newCategory: ICategory = {
        id: `category-${Date.now()}`,
        type,
        effects: [],
        isMuted: false,
        name: `categoryName-${Date.now()}`,
        averageEffectsValues: {
          wet: 0,
          decay: 0,
          filterFreq: 0,
          delayTime: 0,
          feedback: 0,
          threshold: 0,
          ratio: 0,
        },
        sounds: [],
      };
      state.config.categories.push(newCategory);
    },

    setAverageWetValue: (
      state,
      action: PayloadAction<{ categoryId: string; wetValue: number }>,
    ) => {
      const { categoryId, wetValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.wet = wetValue;
      }
    },

    setAverageDecayValue: (
      state,
      action: PayloadAction<{ categoryId: string; decayValue: number }>,
    ) => {
      const { categoryId, decayValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.decay = decayValue;
      }
    },
    setAverageRatioValue: (
      state,
      action: PayloadAction<{ categoryId: string; ratioValue: number }>,
    ) => {
      const { categoryId, ratioValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.ratio = ratioValue;
      }
    },
    setAverageDelayTimeValue: (
      state,
      action: PayloadAction<{ categoryId: string; delayTimeValue: number }>,
    ) => {
      const { categoryId, delayTimeValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.delayTime = delayTimeValue;
      }
    },
    setAverageFeedbackValue: (
      state,
      action: PayloadAction<{ categoryId: string; feedbackValue: number }>,
    ) => {
      const { categoryId, feedbackValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.feedback = feedbackValue;
      }
    },
    setAverageFilterFreqValue: (
      state,
      action: PayloadAction<{ categoryId: string; filterFreqValue: number }>,
    ) => {
      const { categoryId, filterFreqValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.filterFreq = filterFreqValue;
      }
    },
    setAverageThresholdValue: (
      state,
      action: PayloadAction<{ categoryId: string; thresholdValue: number }>,
    ) => {
      const { categoryId, thresholdValue } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (category) {
        category.averageEffectsValues.threshold = thresholdValue;
      }
    },

    deleteCategory: (state, action: PayloadAction<{ categoryId: string }>) => {
      const { categoryId } = action.payload;
      state.config.categories = state.config.categories.filter(
        (cat) => cat.id !== categoryId,
      );
    },

    deleteSound: (state, action: PayloadAction<{ soundId: string }>) => {
      const { soundId } = action.payload;

      state.config.categories = state.config.categories.map((category) => ({
        ...category,
        sounds: category.sounds.filter((sound) => sound.id !== soundId),
      }));
    },

    toggleCategoryMute: (
      state,
      action: PayloadAction<{ categoryId: string }>,
    ) => {
      const { categoryId } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        category.isMuted = !category.isMuted;
      }
    },
    updateSoundVolume: (
      state,
      action: PayloadAction<{
        categoryId: string;
        soundId: string;
        volume: number;
      }>,
    ) => {
      const { categoryId, soundId, volume } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const sound = category.sounds.find((snd) => snd.id === soundId);
        if (sound) {
          sound.volume = volume;
        }
      }
    },
    toggleSoundMute: (
      state,
      action: PayloadAction<{
        categoryId: string;
        soundId: string;
        muted: boolean;
      }>,
    ) => {
      const { categoryId, soundId, muted } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const sound = category.sounds.find((snd) => snd.id === soundId);
        if (sound) {
          if (muted) {
            sound.muted = false;
          } else {
            sound.muted = true;
          }
        }
      }
    },

    toggleSoundSolo: (
      state,
      action: PayloadAction<{ categoryId: string; soundId: string }>,
    ) => {
      const { categoryId, soundId } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const sound = category.sounds.find((snd) => snd.id === soundId);
        if (sound) {
          sound.solo = !sound.solo;
        }
      }
    },
    toggleSoundPlay: (
      state,
      action: PayloadAction<{ categoryId: string; soundId: string }>,
    ) => {
      const { categoryId, soundId } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        const sound = category.sounds.find((snd) => snd.id === soundId);
        if (sound) {
          sound.isPlaying = !sound.isPlaying;
        }
      }
    },

    addEffect: (
      state,
      action: PayloadAction<{ effect: IEffect; categoryId: string }>,
    ) => {
      const { effect, categoryId } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        category.effects.push(effect);
      }
    },

    deleteEffect: (
      state,
      action: PayloadAction<{ effectId: string; categoryId: string }>,
    ) => {
      const { effectId, categoryId } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        category.effects = category.effects.filter(
          (eff) => eff.id !== effectId,
        );
      }
    },

    updateEffect: (
      state,
      action: PayloadAction<{
        effect: IEffect;
        categoryId: string;
        values: IReverb | ICompressor | IDelay | IFilter;
      }>,
    ) => {
      const { values, categoryId, effect } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        category.effects = category.effects.map((eff) =>
          eff.id === effect.id
            ? {
                ...eff,
                content: values as IReverb | ICompressor | IDelay | IFilter,
              }
            : eff,
        );
      }
    },

    updateEffects: (
      state,
      action: PayloadAction<{
        effects: IEffect[];
        categoryId: string;
      }>,
    ) => {
      const { categoryId, effects } = action.payload;
      const category = state.config.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (category) {
        category.effects = effects;
      }
    },
  },
});

export const {
  reset,
  setNewSettings,
  setVolume,
  togglePlay,
  setMoment,
  setBpm,
  deleteSound,
  deleteCategory,
  addCategory,
  toggleCategoryMute,
  updateSoundVolume,
  toggleSoundMute,
  toggleSoundSolo,
  toggleSoundPlay,
  randomSound,
  addRandomSoundToCategory,
  setTitle,
  setIsLoaded,
  setId,
  updateEffect,
  updateEffects,
  addEffect,
  deleteEffect,
  setAverageDecayValue,
  setAverageDelayTimeValue,
  setAverageFeedbackValue,
  setAverageFilterFreqValue,
  setAverageThresholdValue,
  setAverageRatioValue,
  setAverageWetValue,
  setSelectedSound,
  updateSoundsToCategory,
} = padSlice.actions;

export default padSlice.reducer;

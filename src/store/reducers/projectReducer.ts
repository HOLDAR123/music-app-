import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPad } from "types/Music";

interface ProjectsState {
  projects: IPad[];
}

const initialState: ProjectsState = {
  projects: [],
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setUpConfig: (state, action: PayloadAction<IPad>) => {
      state.projects.push(action.payload);
    },
    updateProjects: (state, action: PayloadAction<IPad[]>) => {
      state.projects = action.payload;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload,
      );
    },
    setVolume: (
      state,
      action: PayloadAction<{ projectId: string; volume: number }>,
    ) => {
      const { projectId, volume } = action.payload;
      const project = state.projects.find((proj) => proj.id === projectId);
      if (project) {
        project.config.volume = volume;
      }
    },
  },
});

export const { setUpConfig, deleteProject, setVolume, updateProjects } =
  projectsSlice.actions;

export default projectsSlice.reducer;

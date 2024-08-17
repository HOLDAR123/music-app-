// import { UserInfo } from 'firebase/auth'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPad } from "types/Music";

interface UserInfo {
  nickname: string;
  password: string;
  email: string;
}

interface AuthState {
  user: UserInfo | null;
  projects: IPad[];
  isAuthInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthInitialized: true,
  projects: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
    },
    authorize: (state) => {
      state.isAuthInitialized = !state.isAuthInitialized;
    },
    saveProject: (state, action: PayloadAction<IPad>) => {
      state.projects.push(action.payload);
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.projects = state.projects.filter((project) => project.id !== id);
    },
  },
});

export const { setUser, authorize, saveProject, deleteProject } =
  authSlice.actions;

export default authSlice.reducer;

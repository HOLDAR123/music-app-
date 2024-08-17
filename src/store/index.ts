import { configureStore } from "@reduxjs/toolkit";
import padReducer from "./reducers/padReducer";
import projectReducer from "./reducers/projectReducer";
import authReducer from "./reducers/authReducer";

const store = configureStore({
  reducer: {
    pad: padReducer,
    project: projectReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;

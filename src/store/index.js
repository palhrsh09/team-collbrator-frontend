import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import teamReducer from "./teamSlice";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
     team: teamReducer,
    tasks: taskReducer,
  },
});
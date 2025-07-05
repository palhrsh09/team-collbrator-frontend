import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import teamReducer from "./teamSlice";
import taskReducer from "./taskSlice";
import socketReducer from "./socketSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
     team: teamReducer,
    tasks: taskReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.instance'],
      },
    }),
});
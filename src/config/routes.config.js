// import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup"
import {Dashboard} from "../pages/Dashboard";
import Projects from "../pages/Project";
import KanbanBoard from "../pages/KanbanBoard";
import TeamOverview from "../pages/TeamOverview";

export const publicRoutes = [
  {
    key: "signup",
    path: "/signup",
    component: Signup,
    meta: {},
  },
  {
    key: "login",
    path: "/",
    component: Login,
    meta: {},
  },
];


export const protectedRoutes = [
  {
    path: '/dashboard',
    component: Dashboard,
    key: 'dashboard',
    allowedRoles: ['MEMBER', 'ADMIN', 'MANAGER'],
  },
  {
    path: '/admin',
    component: Dashboard,
    key: 'admin-panel',
    allowedRoles: ['ADMIN'],
  },
  {
    path: '/projects',
    component: Projects,
    key: 'projects',
    allowedRoles: ['ADMIN', 'MEMBER', 'GUEST', 'MANAGER'],
  },
  {
    path: '/kanban/:projectId',
    component: KanbanBoard,
    key: 'kanban',
    allowedRoles: ['ADMIN', 'MEMBER', 'MANAGER'],
  },
  {
    path: '/team',
    component: TeamOverview,
    key: 'team-overview',
    allowedRoles: ['ADMIN', 'MEMBER', 'GUEST', 'MANAGER'],
  },
];

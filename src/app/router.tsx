import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { Layout } from "./components/layout/Layout";

const Home = lazy(() => import("./pages/Home"));
const ProjectsIndex = lazy(() => import("./pages/projects/ProjectsIndex"));
const ProjectDetail = lazy(() => import("./pages/projects/ProjectDetail"));
const JournalIndex = lazy(() => import("./pages/journal/JournalIndex"));
const JournalDetail = lazy(() => import("./pages/journal/JournalDetail"));
const PlaygroundIndex = lazy(() => import("./pages/playground/PlaygroundIndex"));
const PlaygroundDetail = lazy(() => import("./pages/playground/PlaygroundDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <ProjectsIndex /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "journal", element: <JournalIndex /> },
      { path: "journal/:slug", element: <JournalDetail /> },
      { path: "playground", element: <PlaygroundIndex /> },
      { path: "playground/:slug", element: <PlaygroundDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

import { createHashRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ResumePage from './pages/ResumePage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import AnimePage from './pages/AnimePage';
import PrivacyPage from './pages/PrivacyPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'anime', element: <AnimePage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },
]);

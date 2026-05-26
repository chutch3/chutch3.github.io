import { createHashRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ResumePage from './pages/ResumePage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import AnimePage from './pages/AnimePage';
import PrivacyPage from './pages/PrivacyPage';
import { siteConfig } from '@/config/site.config';

const featureRoutes = [
  ...(siteConfig.features.blogPage
    ? [{ path: 'blog', element: <BlogPage /> }]
    : []),
  ...(siteConfig.features.animePage
    ? [{ path: 'anime', element: <AnimePage /> }]
    : []),
  ...(siteConfig.features.privacyPage
    ? [{ path: 'privacy', element: <PrivacyPage /> }]
    : []),
];

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      ...featureRoutes,
    ],
  },
]);

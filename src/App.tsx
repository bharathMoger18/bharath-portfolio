import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout.tsx';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import { layoutProps } from './siteConfig.ts';

// Everything except Home and 404 is split out of the initial bundle.
const CaseKubeadm = lazy(() => import('./pages/CaseKubeadm.tsx'));
const CaseAws = lazy(() => import('./pages/CaseAws.tsx'));
const Resume = lazy(() => import('./pages/Resume.tsx'));
const Lab = lazy(() => import('./pages/Lab.tsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout {...layoutProps} />}>
        <Route index element={<Home />} />
        <Route path="work/kubeadm" element={<CaseKubeadm />} />
        <Route path="work/aws" element={<CaseAws />} />
        <Route path="resume" element={<Resume />} />
        <Route path="lab" element={<Lab />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

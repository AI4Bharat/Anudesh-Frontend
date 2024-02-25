'use client';
import RootLayout from './layout';
import Home from './ui/pages/home/home';
import {HashRouter, Route, Routes, Navigate} from 'react-router-dom';
import {authenticateUser} from '@/utils/utils';
import Login from './ui/pages/login/login';
import Layout from './ui/Layout';
import Chat from './ui/pages/chat/chat';
import MyOrganization from './ui/pages/organizations/organizations';
import ProjectList from './ui/pages/projects/project';
import Projects from './ui/pages/projects/projectDetails';
import Dataset from './ui/pages/dataset/dataset';
import Workspace from './ui/pages/workspace/workspace';
import WorkspaceSettingTabs
  from './ui/pages/workspace/workspacesetting/setting';
import SignUp from './ui/pages/invite/invite';
import ForgotPassword from './ui/pages/forgot-password/forgot-password';
import Dashboard from './ui/pages/admin/Dashboard';
import ProgressPage from './progress/progress';
import ProfilePage from './profile/profile';
import EditProfile from './ui/pages/edit-profile/edit-profile';
import ChangePassword from './ui/pages/change-password/change-password';
import ProjectSetting from '@/components/Project/ProjectSettings';
import DatasetDetails from '@/components/datasets/DatasetDetails';
import DatasetSettingTabs from '@/components/datasets/DatasetSettingTab';
import AutomateDatasets from '@/components/datasets/AutomateDatasets';
import CreateNewDatasetInstanceAPI
  from '@/components/datasets/CreateNewDatasetInstance';
  import GuestWorkspaces from "./ui/pages/guest-workspaces/guestWorkspace";
import AnnotatePage from './ui/pages/chat/AnnotatePage';
import CreateProject from './new-project/newproject';
export default function Root () {
    /* eslint-disable react-hooks/exhaustive-deps */

  if (typeof window !== 'undefined') {
    const ProtectedRoute = ({user, children}) => {
      if (!authenticateUser ()) {
        return <Navigate to="/login" />;
      }
      return children;
    };

    const ProtectedRouteWrapper = component => {
      return <ProtectedRoute>{component}</ProtectedRoute>;
    };

    return (
      <RootLayout>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/invite/:inviteCode" element={<SignUp />} />
            <Route
              path="/admin"
              element={ProtectedRouteWrapper (
                <Layout component={<Dashboard />} />
              )}
            />
            <Route
              path="/organizations/:orgId"
              element={ProtectedRouteWrapper (
                <Layout component={<MyOrganization />} />
              )}
            />
            <Route
              path="/projects"
              element={ProtectedRouteWrapper (
                <Layout component={<ProjectList />} />
              )}
            />
            <Route
            path="/guest_workspaces"
            element={ProtectedRouteWrapper(<Layout component={<GuestWorkspaces />} />)}
          />
            <Route
              path="projects/:id"
              element={ProtectedRouteWrapper (
                <Layout
                  component={<Projects />}
                  Backbutton={true}
                  backPressNavigationPath={'/projects'}
                />
              )}
            />
            <Route
              path="datasets/:datasetId/datasetsetting"
              element={ProtectedRouteWrapper (
                <Layout component={<DatasetSettingTabs />} Backbutton={true} />
              )}
            />
            <Route
              path="datasets/automate"
              element={ProtectedRouteWrapper (
                <Layout component={<AutomateDatasets />} Backbutton={true} />
              )}
            />
            <Route
              path="new-project/:id"
              element={ProtectedRouteWrapper (
                <Layout component={<CreateProject />} Backbutton={true} />
              )}
            />
            <Route
              path="create-Dataset-Instance-Button"
              element={ProtectedRouteWrapper (
                <Layout
                  component={<CreateNewDatasetInstanceAPI />}
                  Backbutton={true}
                />
              )}
            />
            <Route
              path="projects/:id/projectsetting"
              element={ProtectedRouteWrapper (
                <Layout component={<ProjectSetting />} Backbutton={true} />
              )}
            />
            <Route
              path="projects/:projectId/task/:taskId"
              // path="projects/alltask"
              element={ProtectedRouteWrapper(
                <Layout component={<AnnotatePage />} />
              )}
            />
            <Route
              path="/edit-profile"
              element={ProtectedRouteWrapper (
                <Layout component={<EditProfile />} Backbutton={true} />
              )}
            />
            <Route
              path="/Change-Password"
              element={ProtectedRouteWrapper (
                <Layout component={<ChangePassword />} Backbutton={true} />
              )}
            />
            <Route
              path="datasets"
              element={ProtectedRouteWrapper (
                <Layout component={<Dataset />} />
              )}
            />
            <Route
              path="datasets/:datasetId"
              element={ProtectedRouteWrapper (
                <Layout component={<DatasetDetails />} Backbutton={true} />
              )}
            />
            <Route
              path="workspaces/:id"
              element={ProtectedRouteWrapper (
                <Layout component={<Workspace />} Backbutton={true} />
              )}
            />
            <Route
              path="workspaces/:id/workspacesetting"
              element={ProtectedRouteWrapper (
                <Layout
                  component={<WorkspaceSettingTabs />}
                  Backbutton={true}
                />
              )}
            />

            <Route
              path="/profile/:id"
              element={ProtectedRouteWrapper (
                <Layout component={<ProfilePage />} Backbutton={true} />
              )}
            />
            <Route
              path="/progress/:id"
              element={ProtectedRouteWrapper (
                <Layout component={<ProgressPage />} Backbutton={true} />
              )}
            />
          </Routes>
        </HashRouter>
      </RootLayout>
    );
  }
}
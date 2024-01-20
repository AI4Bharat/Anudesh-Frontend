"use client";
import RootLayout from "./layout"
import Home from "./ui/pages/home/home"
import { HashRouter, Route, Routes, Navigate } from "react-router-dom"
import { authenticateUser } from "@/utils/utils";
import Login from "./ui/pages/login/login";
import Layout from "./ui/Layout";
import MyOrganization from "./ui/pages/organizations/organizations";
import ProjectList from "./ui/pages/projects/project";
import Projects from "./ui/pages/projects/projectDetails";
import Dataset from "./ui/pages/dataset/dataset";
import Workspace from "./ui/pages/workspace/workspace";
import WorkspaceSettingTabs from "./ui/pages/workspace/workspacesetting/setting";
import SignUp from "./ui/pages/invite/invite";

export default function Root() {
  const ProtectedRoute = ({ user, children }) => {
    if (!authenticateUser()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const ProtectedRouteWrapper = (component) => {
    return <ProtectedRoute>{component}</ProtectedRoute>;
  };

  return (
    <RootLayout>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/invite/:inviteCode" element={<SignUp />} />
          <Route
            path="/organizations/:orgId"
            element={ProtectedRouteWrapper(<Layout component={<MyOrganization />} />)}
          />
          <Route
            path="/projects"
            element={ProtectedRouteWrapper(<Layout component={<ProjectList />} />)}
          />
          <Route
            path="projects/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<Projects />} Backbutton={true} backPressNavigationPath={"/projects"} />
            )}
          />
          <Route
            path="datasets"
            element={ProtectedRouteWrapper(
              <Layout component={<Dataset />} />
            )}
          />
          <Route
            path="workspaces/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<Workspace />} Backbutton={true} />
            )}
          />
          <Route
            path="workspaces/:id/workspacesetting"
            element={ProtectedRouteWrapper(
              <Layout component={<WorkspaceSettingTabs />} Backbutton={true} />
            )}
          />
        </Routes>
      </HashRouter>
    </RootLayout>
  )
}  

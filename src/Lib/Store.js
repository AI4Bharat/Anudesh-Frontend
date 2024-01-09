import { configureStore } from '@reduxjs/toolkit'
import getWorkspaceProject from './Features/getWorkspaceProject';
import LoggedInData from './Features/LoggedInData';
import getWorkspaceDetails from './Features/getWorkspaceDetails';
import getWorkspacesAnnotatorsData from './Features/GetWorkspacesAnnotatorsData';
import RemoveWorkspaceMember from './Features/RemoveWorkspaceMember';
import getWorkspaceManagersData from './Features/getWorkspaceManagersData';
import getProjectDomains from './Features/getProjectDomains';
import getWorkspaceProjectReports from './Features/getWorkspaceProjectReports';
import getWorkspaceUserReports from './Features/getWorkspaceUserReports';
import fetchLanguages from './Features/fetchLanguages';
import apiStatus from './Features/apiStatus';
import fetchUsersById from './Features/user/fetchUsersById';
import GetWorkspace from './Features/GetWorkspace';
import getUserAnalytics from './Features/user/getUserAnalytics';
const makeStore = () => {
    return configureStore({
      reducer: {
        apiStatus:apiStatus,
        getWorkspaceProject: getWorkspaceProject,
        fetchLoggedInUserData: LoggedInData,
        getWorkspaceDetails: getWorkspaceDetails,
        getWorkspacesAnnotatorsData:getWorkspacesAnnotatorsData,
        RemoveWorkspaceMember:RemoveWorkspaceMember,
        getWorkspaceManagersData:getWorkspaceManagersData,
        getProjectDomains:getProjectDomains,
        getWorkspaceProjectReports:getWorkspaceProjectReports,
        getWorkspaceUserReports:getWorkspaceUserReports,
        fetchLanguages:fetchLanguages,
        fetchUsersById:fetchUsersById,
        GetWorkspace:GetWorkspace,
        getUserAnalytics:getUserAnalytics,

      },
    });
  };
  
  export const store = makeStore();
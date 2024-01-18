import { configureStore } from '@reduxjs/toolkit'
import getWorkspaceProjectData from './Features/getWorkspaceProjectData';
import getWorkspaceDetails from './Features/getWorkspaceDetails';
import getWorkspacesAnnotatorsData from './Features/getWorkspacesAnnotatorsData';
import RemoveWorkspaceMember from './Features/RemoveWorkspaceMember';
import getWorkspacesManagersData from './Features/getWorkspaceManagersData';
import getProjectDomains from './Features/getProjectDomains';
import getWorkspaceProjectReports from './Features/getWorkspaceProjectReports';
import getWorkspaceUserReports from './Features/getWorkspaceUserReports';
import getLanguages from './Features/fetchLanguages';
import apiStatus from './Features/apiStatus';
import getUserById from './Features/user/getUserById';
import GetWorkspace from './Features/GetWorkspace';
import getUserAnalytics from './Features/user/getUserAnalytics';
import getWorkspaceData from './Features/getWorkspaceData';
import getLoggedInData from './Features/getLoggedInData';
import getOrganizationUsers from './Features/getOrganizationUsers';
import getProjectDetails from './Features/projects/getProjectDetails';
import getProjects from './Features/projects/getProjects';
import GetTasksByProjectId from './Features/projects/GetTasksByProjectId';
import getNextTask from './Features/projects/getNextTask';
import getFindAndReplaceWordsInAnnotation from './Features/projects/getFindAndReplaceWordsInAnnotation';
import getTaskFilter from './Features/projects/getTaskFilter';
import RemoveProjectMember from './Features/projects/RemoveProjectMember';
import ResendUserInvite from './Features/projects/ResendUserInvite';
import GetOrganizationUserReports from './Features/projects/GetOrganizationUserReports';
import GetOrganizationDetailedProjectReports from './Features/projects/GetOrganizationDetailedProjectReports';
import GetOrganizationProjectReports from './Features/projects/GetOrganizationProjectReports';
import SendOrganizationUserReports from './Features/projects/SendOrganizationUserReports';
import domainsReducer from './Features/actions/domains';
import projectsReducer from './Features/actions/projects';
import userReducer from './Features/actions/user';
import getAllTaskData from './Features/projects/getAllTaskData';
const makeStore = () => {
    return configureStore({
      reducer: {
        apiStatus:apiStatus,
        getAllTaskData:getAllTaskData,
        domains: domainsReducer,
        projects: projectsReducer,
        user: userReducer,
        SendOrganizationUserReports:SendOrganizationUserReports,
        GetOrganizationUserReports:GetOrganizationUserReports,
        GetOrganizationDetailedProjectReports:GetOrganizationDetailedProjectReports,
        GetOrganizationProjectReports:GetOrganizationProjectReports,
        getProjects:getProjects,
        getTaskFilter:getTaskFilter,
        ResendUserInvite:ResendUserInvite,
        getNextTask:getNextTask,
        RemoveProjectMember:RemoveProjectMember,
        getFindAndReplaceWordsInAnnotation:getFindAndReplaceWordsInAnnotation,
        GetTasksByProjectId:GetTasksByProjectId,
        getWorkspaceProjectData: getWorkspaceProjectData,
        getLoggedInData: getLoggedInData,
        getWorkspaceDetails: getWorkspaceDetails,
        getWorkspacesAnnotatorsData:getWorkspacesAnnotatorsData,
        RemoveWorkspaceMember:RemoveWorkspaceMember,
        getWorkspacesManagersData:getWorkspacesManagersData,
        getProjectDomains:getProjectDomains,
        getWorkspaceProjectReports:getWorkspaceProjectReports,
        getWorkspaceUserReports:getWorkspaceUserReports,
        getLanguages:getLanguages,
        getUserById:getUserById,
        GetWorkspace:GetWorkspace,
        getUserAnalytics:getUserAnalytics,
        getWorkspaceData:getWorkspaceData,
        getOrganizationUsers:getOrganizationUsers,
        getProjectDetails:getProjectDetails,

      },
    });
  };
  
  export const store = makeStore();
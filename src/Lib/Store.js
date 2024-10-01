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
import GetOrganizationUserReports from './Features/projects/GetOrganizationUserReports';
import GetOrganizationDetailedProjectReports from './Features/projects/GetOrganizationDetailedProjectReports';
import GetOrganizationProjectReports from './Features/projects/GetOrganizationProjectReports';
import SendOrganizationUserReports from './Features/projects/SendOrganizationUserReports';
import domainsReducer from './Features/actions/domains';
import projectsReducer from './Features/actions/projects';
import userReducer from './Features/actions/user';
import getAllTaskData from './Features/projects/getAllTaskData';
import GetScheduledMails from './Features/user/GetScheduledMails';
import getUserAnalytics from './Features/user/getUserAnalytics';
import getRecentTasks from './Features/user/getRecentTasks';
import getUserDetails from './Features/user/getUserDetails';
import getProjectReport from './Features/getProjectReport';
import GetProjectTypeDetails from './Features/projects/GetProjectTypeDetails';
import getDownloadProjectAnnotations from './Features/user/getDownloadProjectAnnotations';
import GetArchiveProject from './Features/projects/GetArchiveProject';
import DownloadJSONProject from './Features/projects/DownloadJSONProject';
import DownloadProjectCsv from './Features/projects/DownloadProjectCsv';
import DownloadProjectTsv from './Features/projects/DownloadProjectTsv';
import GetDatasets from './Features/datasets/GetDatasets';
import GetDatasetType from './Features/datasets/GetDatasetType';
import GetDataitemsById from './Features/datasets/GetDataitemsById';
import getDatasetDetails from './Features/datasets/getDatasetDetails';
import GetDatasetProjects from './Features/datasets/GetDatasetProjects';
import GetDatasetLogs from './Features/datasets/GetDatasetLogs';
import getDatasetProjectReports from './Features/datasets/getDatasetProjectReports';
import GetDatasetDetailedReports from './Features/datasets/GetDatasetDetailedReports';
import getDatasetMembers from './Features/datasets/getDatasetMembers';
import GetIndicTransLanguages from './Features/datasets/GetIndicTransLanguages';
import GetDatasetDownloadCSV from './Features/datasets/GetDatasetDownloadCSV';
import GetDatasetDownloadTSV from './Features/datasets/GetDatasetDownloadTSV';
import GetDatasetDownloadJSON from './Features/datasets/GetDatasetDownloadJSON';
import GetFileTypes from './Features/datasets/GetFileTypes';
import DatasetSearchPopup from './Features/datasets/DatasetSearchPopup';
import searchProjectCard from './Features/searchProjectCard';
import getTaskAnalyticsData from './Features/Analytics/getTaskAnalyticsData';
import getMetaAnalyticsData from './Features/Analytics/getMetaAnalyticsData';
import getGuestWorkspaces from './Features/getGuestWorkspaces';
import getAnnotationsTask from './Features/projects/getAnnotationsTask';
import getTaskDetails from './Features/getTaskDetails';
import GlossarysentenceAPI from './Features/actions/GlossarysentenceAPI';
import AddGlossary from './Features/actions/AddGlossary';
import getDomain from './Features/actions/getDomain';
import EditOrganization from './Features/user/EditOrganization';
import SendWorkspaceUserReports from './Features/projects/SendWorkspaceUserReports';
import WorkspaceUserReports from './Features/projects/WorkspaceUserReports';
import WorkspaceProjectReport from './Features/projects/WorkspaceProjectReport';
import GetExportProjectButton from './Features/datasets/GetExportProjectButton';
import getDatasetByType from './Features/datasets/getDatasetByType';
import wsgetTaskAnalytics from './Features/Analytics/Workspace/wsgetTaskAnalytics';
import wsgetMetaAnalytics from './Features/Analytics/Workspace/wsgetMetaAnalytics';
const makeStore = () => {
    return configureStore({
      reducer: {
        apiStatus:apiStatus,
        wsgetTaskAnalytics:wsgetTaskAnalytics,
        wsgetMetaAnalytics:wsgetMetaAnalytics,
        GetExportProjectButton:GetExportProjectButton,
        getDatasetByType:getDatasetByType,
        WorkspaceProjectReport:WorkspaceProjectReport,
        WorkspaceUserReports:WorkspaceUserReports,
        SendWorkspaceUserReports:SendWorkspaceUserReports,
        EditOrganization:EditOrganization,
        getTaskDetails:getTaskDetails,
        AddGlossary:AddGlossary,
        getDomain:getDomain,
        getAnnotationsTask:getAnnotationsTask,
        GlossarysentenceAPI:GlossarysentenceAPI,
        searchProjectCard:searchProjectCard,
        DatasetSearchPopup:DatasetSearchPopup,
        GetFileTypes:GetFileTypes,
        GetIndicTransLanguages:GetIndicTransLanguages,
        GetDatasetDownloadJSON:GetDatasetDownloadJSON,
        GetDatasetDownloadCSV:GetDatasetDownloadCSV,
        GetDatasetDownloadTSV:GetDatasetDownloadTSV,
        getDatasetMembers:getDatasetMembers,
        GetDatasetDetailedReports:GetDatasetDetailedReports,
        getDatasetProjectReports:getDatasetProjectReports,
        GetDatasetProjects:GetDatasetProjects,
        GetDatasetLogs:GetDatasetLogs,
        getDatasetDetails:getDatasetDetails,
        GetDataitemsById:GetDataitemsById,
        GetDatasetType:GetDatasetType,
        GetDatasets:GetDatasets,
        DownloadJSONProject:DownloadJSONProject,
        DownloadProjectCsv:DownloadProjectCsv,
        DownloadProjectTsv:DownloadProjectTsv,
        GetArchiveProject:GetArchiveProject,
        getDownloadProjectAnnotations:getDownloadProjectAnnotations,
        GetProjectTypeDetails:GetProjectTypeDetails,
        getProjectReport:getProjectReport,
        getUserDetails:getUserDetails,
        getAllTaskData:getAllTaskData,
        getRecentTasks:getRecentTasks,
        getUserAnalytics:getUserAnalytics,
        GetScheduledMails:GetScheduledMails,
        domains: domainsReducer,
        projects: projectsReducer,
        user: userReducer,
        SendOrganizationUserReports:SendOrganizationUserReports,
        GetOrganizationUserReports:GetOrganizationUserReports,
        GetOrganizationDetailedProjectReports:GetOrganizationDetailedProjectReports,
        GetOrganizationProjectReports:GetOrganizationProjectReports,
        getProjects:getProjects,
        getTaskFilter:getTaskFilter,
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
        getWorkspaceData:getWorkspaceData,
        getOrganizationUsers:getOrganizationUsers,
        getProjectDetails:getProjectDetails,
        getTaskAnalyticsData: getTaskAnalyticsData,
        getMetaAnalyticsData: getMetaAnalyticsData,
        getGuestWorkspaces: getGuestWorkspaces,
      },
    });
  };
  
  export const store = makeStore();
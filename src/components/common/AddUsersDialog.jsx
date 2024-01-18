import { AddIcon } from "@mui/icons-material";
import AddAnnotatorsToWorkspaceAPI from "@/app/actions/api/workspace/AddAnnotatorsToWorkspaceAPI";
import AddMembersToProjectAPI from "@/app/actions/api/workspace/AddMembersToProjectAPI";
import AddProjectReviewersAPI from "@/app/actions/api/workspace/AddProjectReviewersAPI";
import AddProjectSuperCheckerAPI from "@/app/actions/api/workspace/AddProjectSuperCheckerAPI";
import AssignManagerToWorkspaceAPI from "@/app/actions/api/workspace/AssignManagerToWorkspaceAPI";
import { fetchOrganizationUsers } from "@/Lib/Features/getOrganizationUsers";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import { fetchWorkspacesAnnotatorsData } from "@/Lib/Features/getWorkspacesAnnotatorsData";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";
import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState,useEffect } from "react";

import addUserTypes from "../../Constants/addUserTypes";
import CustomButton from "./Button";

const DialogHeading = {
  [addUserTypes.ANNOTATOR]: 'Add Annotators',
  [addUserTypes.MANAGER]: 'Assign Manager',
  [addUserTypes.PROJECT_ANNOTATORS]: 'Add Project Annotators',
  [addUserTypes.PROJECT_REVIEWER]: 'Add Project Reviewers',
  [addUserTypes.PROJECT_SUPERCHECKER]: 'Add Project SuperChecker',
}


// fetch all users in the current organization/workspace
const fetchAllUsers = (userType, id, dispatch) => {
  switch (userType) {
    case addUserTypes.PROJECT_ANNOTATORS:
      case addUserTypes.PROJECT_SUPERCHECKER:
    case addUserTypes.PROJECT_REVIEWER:
      dispatch(fetchWorkspacesAnnotatorsData(id))
      break;
    case addUserTypes.ANNOTATOR:
    case addUserTypes.MANAGER:
      dispatch(fetchOrganizationUsers(id))
      break;
    default:
      break;
  }
}

const getAvailableUsers = (userType, projectDetails, workspaceAnnotators, workspaceManagers, orgUsers) => {
  switch (userType) {
    case addUserTypes.PROJECT_ANNOTATORS:
      return workspaceAnnotators
        .filter(
          (workspaceAnnotator) =>
            projectDetails?.annotators.findIndex(
              (projectUser) => projectUser?.id === workspaceAnnotator?.id
            ) === -1
        )
        .map((user) => ({ id: user.id, email: user.email, username: user.username }));
      break;
      case addUserTypes.PROJECT_REVIEWER:
        return workspaceAnnotators
          .filter(
            (workspaceAnnotator) =>
              projectDetails?.annotation_reviewers.findIndex(
                (projectUser) => projectUser?.id === workspaceAnnotator?.id
              ) === -1   && workspaceAnnotator?.role != 1
          ) 
          .map((user) => ({ id: user.id, email: user.email, username: user.username }));
        break;
        case addUserTypes.PROJECT_SUPERCHECKER:
          return workspaceAnnotators
            .filter(
              (workspaceAnnotator) =>
                projectDetails?.review_supercheckers.findIndex(
                  (projectUser) => projectUser?.id === workspaceAnnotator?.id
                ) === -1   && (workspaceAnnotator?.role != 1 && workspaceAnnotator?.role != 2 ) 
            ) 
            .map((user) => ({ id: user.id, email: user.email, username: user.username }));
          break;
    case addUserTypes.ANNOTATOR:
      return orgUsers
        ?.filter(
          (orgUser) =>
            workspaceAnnotators?.findIndex(
              (annotator) => annotator?.id === orgUser?.id
            ) === -1 
        )
        .map((user) => ({ email: user.email, username: user.username, id: user.id }));
      break;
    case addUserTypes.MANAGER:
      return orgUsers
        ?.filter(
          (orgUser) =>
            workspaceManagers?.findIndex(
              (manager) =>  manager?.id === orgUser?.id
            ) === -1  && orgUser?.role != 1 && orgUser?.role != 2 && orgUser?.role != 3
        )
       
        .map((user) => ({ id: user.id, email: user.email, username: user.username }));
      break;
    default:
      break;
  }
}

const handleAddUsers = async (userType, users, id, dispatch) => {
  switch (userType) {
    case addUserTypes.PROJECT_ANNOTATORS:
      const addMembersObj = new AddMembersToProjectAPI(
        id,
        users.map((user) => user.id),
      );
      const res = await fetch(addMembersObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addMembersObj.getBody()),
        headers: addMembersObj.getHeaders().headers,
      });

      const resp_data = await res.json();

      if (res.ok) {
        dispatch(fetchProjectDetails(id))
        return resp_data;
      }
      break;

      case addUserTypes.PROJECT_REVIEWER:
        const addReviewersObj = new AddProjectReviewersAPI(
          id,
          users.map((user) => user.id),
        );
        const reviewerRes = await fetch(addReviewersObj.apiEndPoint(), {
          method: "POST",
          body: JSON.stringify(addReviewersObj.getBody()),
          headers: addReviewersObj.getHeaders().headers,
        });
  
        const reviewerRespData = await reviewerRes.json();
  
        if (reviewerRes.ok) {
          dispatch(fetchProjectDetails(id))
          return reviewerRespData;
        }
        break;
        case addUserTypes.PROJECT_SUPERCHECKER:
        const addsuperCheckerObj = new AddProjectSuperCheckerAPI(
          id,
          users.map((user) => user.id),
        );
        const superCheckerRes = await fetch(addsuperCheckerObj.apiEndPoint(), {
          method: "POST",
          body: JSON.stringify(addsuperCheckerObj.getBody()),
          headers: addsuperCheckerObj.getHeaders().headers,
        });
  
        const superCheckerRespData = await superCheckerRes.json();
  
        if (superCheckerRes.ok) {
          dispatch(fetchProjectDetails(id))
          return superCheckerRespData;
        }
        break;

    case addUserTypes.ANNOTATOR:
      const addAnnotatorsObj = new AddAnnotatorsToWorkspaceAPI(
        id,
        users.map((user) => user.id).join(','),
      );
      const addAnnotatorsRes = await fetch(addAnnotatorsObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addAnnotatorsObj.getBody()),
        headers: addAnnotatorsObj.getHeaders().headers,
      });

      const addAnnotatorsRespData = await addAnnotatorsRes.json();

      if (addAnnotatorsRes.ok) {
        dispatch(fetchWorkspacesAnnotatorsData(id));
        return addAnnotatorsRespData;
      }
      break;

    case addUserTypes.MANAGER:
      const addManagerObj = new AssignManagerToWorkspaceAPI(
        id,
        users.map((user) => user.id),
      );
      const assignManagerRes = await fetch(addManagerObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addManagerObj.getBody()),
        headers: addManagerObj.getHeaders().headers,
      });

      const assignManagerRespData = await assignManagerRes.json();

      if (assignManagerRes.ok) {
        dispatch(fetchWorkspaceDetails(id))
        return assignManagerRespData;
      }
      break;
    default:
      break;
  }
};


const AddUsersDialog = ({
  handleDialogClose,
  isOpen,
  userType,
  id,
}) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const projectDetails = useSelector((state) => state.getProjectDetails?.data);
  const workspaceAnnotators = useSelector((state) => state.getWorkspacesAnnotatorsData?.data);
  // const workspaceManagers = useSelector((state) => state.getWorkspacesManagersData?.data);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails?.data);
  const orgUsers = useSelector((state) => state.getOrganizationUsers?.data);
  const dispatch = useDispatch();
/* eslint-disable react-hooks/exhaustive-deps */

console.log(userType,"dead");
  useEffect(() => {
    let id = '';
    switch (userType) {
      case addUserTypes.PROJECT_ANNOTATORS:
        case addUserTypes.PROJECT_SUPERCHECKER:
      case addUserTypes.PROJECT_REVIEWER:
        id = projectDetails?.workspace_id;
        break;
      case addUserTypes.ANNOTATOR:
      case addUserTypes.MANAGER:
        id = workspaceDetails?.organization;
        break;
      default:
        break;
    }
    if (id) fetchAllUsers(userType, id, dispatch);
  }, [userType, id, projectDetails,dispatch])

  useEffect(() => {
    setAvailableUsers(getAvailableUsers(userType, projectDetails, workspaceAnnotators, workspaceDetails?.managers, orgUsers));
  }, [userType,projectDetails, workspaceAnnotators, workspaceDetails, orgUsers])

  const addBtnClickHandler = async () => {
    setLoading(true);
    const res = await handleAddUsers(userType, selectedUsers, id, dispatch);
    setLoading(false);

    if (res) {
      dialogCloseHandler();
    }
  };

  const dialogCloseHandler = () => {
    handleDialogClose();
  };

  return (
    <Dialog open={isOpen} onClose={dialogCloseHandler} close>
      <DialogTitle style={{ paddingBottom: 0 }}>{DialogHeading[userType]}</DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16} marginBottom={2}>
          Select users to be added.
        </DialogContentText>
        <Autocomplete
          multiple
          limitTags={3}
          onChange={(e, newVal) => setSelectedUsers(newVal)}
          options={availableUsers}
          value={selectedUsers}
          style={{ fontSize: "1rem", paddingTop: 4, paddingBottom: 4 }}
          getOptionLabel={(option) => option.username}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Users..."
              style={{ fontSize: "1rem" }}
              size="small"
              placeholder="Add Users"
            />
          )}
          sx={{ width: "100%" }}
        />
      </DialogContent>
      <DialogActions style={{ padding: 24 }}>
        <Button onClick={dialogCloseHandler} size="small">
          Cancel
        </Button>
        <CustomButton
          startIcon={
            !loading ? (
              <AddIcon />
            ) : (
              <CircularProgress size="0.8rem" color="secondary" />
            )
          }
          onClick={addBtnClickHandler}
          size="small"
          label="Add"
          disabled={loading || selectedUsers === null || selectedUsers?.length === 0}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddUsersDialog;

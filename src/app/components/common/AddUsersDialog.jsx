import { Add } from "@material-ui/icons";
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
import React, { useState } from "react";

import addUserTypes from "../../Constants/addUserTypes";
// import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";
// import AddMembersToProjectAPI from "../../../../redux/actions/api/ProjectDetails/AddMembersToProject";
// import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
// import AddAnnotatorsToWorkspaceAPI from "../../../../redux/actions/api/WorkspaceDetails/AddAnnotatorsToWorkspace";
// import AssignManagerToWorkspaceAPI from "../../../../redux/actions/api/WorkspaceDetails/AssignManagerToWorkspace";
// import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
// import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";
// import AddProjectReviewersAPI from "../../../../redux/actions/api/ProjectDetails/AddProjectReviewers";
// import AddProjectSuperCheckerAPI from "../../../../redux/actions/api/ProjectDetails/AddProjectSuperChecker";
// import APITransport from "../../../../redux/actions/apitransport/apitransport";
import CustomButton from "./Button";

const DialogHeading = {
  [addUserTypes.ANNOTATOR]: 'Add Annotators',
  [addUserTypes.MANAGER]: 'Assign Manager',
  [addUserTypes.PROJECT_ANNOTATORS]: 'Add Project Annotators',
  [addUserTypes.PROJECT_REVIEWER]: 'Add Project Reviewers',
  [addUserTypes.PROJECT_SUPERCHECKER]: 'Add Project SuperChecker',
}




const AddUsersDialog = ({
  handleDialogClose,
  isOpen,
  userType,
  id,
}) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);


 console.log(selectedUsers);

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
              <Add />
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

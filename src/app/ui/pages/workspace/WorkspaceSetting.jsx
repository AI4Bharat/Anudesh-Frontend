import React, { useEffect, useState } from "react";
import CustomButton from "../../../../components/common/Button";
import  "@/styles/Dataset.css";
import CustomizedSnackbars from "../../../../components/common/Snackbar";
import Dialog from "@mui/material/Dialog";
import { Button,Grid } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from '@mui/material/TextField';
import DatasetStyle from "@/styles/dataset";
import { useDispatch,useSelector } from "react-redux";
import LoginAPI from "../../../actions/api/user/Login"
import { useNavigate,useParams } from "react-router-dom";
import DownloadAllProjects from "../../../actions/api/Projects/DownloadAllProjects";
import { fetchArchiveProject } from "../../../../Lib/Features/projects/GetArchiveProject";
import ArchiveWorkspaceAPI from "@/app/actions/api/Projects/GetArchiveProjectAPI";

function WorkspaceSetting(props) {
   /* eslint-disable react-hooks/exhaustive-deps */

  const { onArchiveWorkspace } = props
  const { id } = useParams();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const workspaceDtails = useSelector(state => state.getWorkspaceDetails.data);

  const handleArchiveWorkspace = async () => {
    const projectObj = new ArchiveWorkspaceAPI(id, id);
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: "success",
        variant: "success",
      })
      onArchiveWorkspace()
      // window.location.reload();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }

  }

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      handleArchiveWorkspace();
    } else {
      window.alert("Invalid credentials, please try again");
    }
  };
  const user = useSelector((state) => state.getLoggedInData?.data);
  const handleDownloadProject = async () => {
    const projectObj = new DownloadAllProjects(workspaceDtails.id,user.id);
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      })

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }

  };
  return (
    <div>
      {renderSnackBar()}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {workspaceDtails?.is_archived ? "unarchive" : "archive"}{" "}
            this project?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}
            variant="outlined"
            color="error">Cancel</Button>
          <Button onClick={handleConfirm}
            variant="contained"
            color="error"
            autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <CustomButton
        sx={{ backgroundColor: "#ee6633", "&:hover": { backgroundColor: "#ee6633" } }}
        className={classes.settingsButton}
        onClick={handleClickOpen}
        label={"Archive Workspace"}
        buttonVariant="contained"
        disabled={workspaceDtails?.is_archived}
      />
      <Grid
        items
        xs={12}
        sm={12}
        md={12}
        lg={2}
        xl={2}
        mt={2}
      >
        <CustomButton
      sx={{backgroundColor : "#ffe0b2",color:"black", "&:hover" : {backgroundColor : "#ffe0b2",}}} 
      label={"Download All Projects"}
      className={classes.settingsButton}
        variant="contained"
        onClick={handleDownloadProject}
      />
      </Grid>
    </div>
  )
}
export default WorkspaceSetting;
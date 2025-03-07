import React, { useEffect, useState } from "react";
import CustomButton from "../../../../components/common/Button";
import "@/styles/Dataset.css";
import CustomizedSnackbars from "../../../../components/common/Snackbar";
import Dialog from "@mui/material/Dialog";
import { Button, CircularProgress, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Switch, Typography } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from '@mui/material/TextField';
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import LoginAPI from "../../../actions/api/user/Login"
import {  useParams } from "react-router-dom";
import DownloadAllProjects from "../../../actions/api/Projects/DownloadAllProjects";
import ArchiveWorkspaceAPI from "@/app/actions/api/Projects/GetArchiveProjectAPI";
import { VisibilityOff } from "@mui/icons-material";
import { Visibility } from "@material-ui/icons";
import CreateGuestWorkspace from "@/app/actions/api/Projects/createWorkspace";
import EditWorkspace from "@/app/actions/api/Projects/EditWorkspace";
import EditGuestWorkspace from "@/app/actions/api/Projects/EditGuestWorkspace";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";

function WorkspaceSetting(props) {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { onArchiveWorkspace } = props;
  const { id } = useParams();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newpassword, setnewpassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [shownewpassword, setShownewpassword] = useState(false);
  const [showconfirmpassword, setShowconfirmpassword] = useState(false);
  const [passwordEqual, setPasswordEqual] = useState(true);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  
  const validatePassword = () => {
    const errors = [];
  
    if (newpassword.length > 0) {
      if (newpassword.length < 8) {
        errors.push("This password is too short. It must contain at least 8 characters.");
      }
      
      if (!/[a-z]/.test(newpassword)) {
        errors.push("This password must contain at least one lowercase letter.");
      }
      
      if (!/[A-Z]/.test(newpassword)) {
        errors.push("This password must contain at least one uppercase letter.");
      }
      
      if (!/[0-9]/.test(newpassword)) {
        errors.push("This password must contain at least one number.");
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newpassword)) {
        errors.push("This password must contain at least one special character.");
      }
  
      const commonPasswords = ["password", "12345678", "qwerty", "123456789", "abc123", "newpassword"];
      if (commonPasswords.includes(newpassword)) {
        errors.push("This password is too common.");
      }
    } 
    setPasswordErrors(errors);
    return errors.length === 0;
  };
  useEffect(()=>{
   validatePassword()
   equal()
  },[newpassword,confirmpassword])

  const getWorkspaceDetails = ()=>{
    dispatch(fetchWorkspaceDetails(id));
  }

  useEffect(()=>{
    getWorkspaceDetails()
  },[])

  const equal =()=>{
    if(confirmpassword.length>0){
      setPasswordEqual(newpassword===confirmpassword)
    }
  }
  const workspaceDtails = useSelector(state => state.getWorkspaceDetails.data);
  const [guestWorkspace, setGuestWorkspace] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openToggleDialog, setOpenToggleDialog] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  useEffect(() => {
    if (workspaceDtails) {
      setGuestWorkspace(workspaceDtails?.guest_workspace_display === "Yes" ? true : false);
      setInitialLoading(false)
    }
  }, [workspaceDtails]);

  const handleToggleChange = async() => {
    if (!guestWorkspace) {
      setOpenToggleDialog(true);
    } else {
      const apiObj = new EditWorkspace(id);
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
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
      setGuestWorkspace(false);
      setnewpassword("")
      setconfirmpassword("")
    }
  };
  const handleToggleDialogOpen = () => {
    setOpenToggleDialog(true);
  };

  const handleToggleDialogClose = () => {
    setOpenToggleDialog(false);
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
  };

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
      onArchiveWorkspace();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  }

  const handlenewpassword = (event) => {
    setnewpassword(event.target.value);
  };

  const handleconfirmpassword = (event) => {
    setconfirmpassword(event.target.value);
  };

  const handleTogglenewpasswordVisibility = () => {
    setShownewpassword(!shownewpassword);
  };

  const handleToggleconfirmpasswordVisibility = () => {
    setShowconfirmpassword(!showconfirmpassword);
  };

  const handlePasswordCreate = async() => {
    if (newpassword !== confirmpassword) {
      setPasswordEqual(false);
      return;
    }
    setPasswordEqual(true);
    const apiObj = new CreateGuestWorkspace(id,newpassword);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
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
    setGuestWorkspace(true);
    handleToggleDialogClose();
    setnewpassword("")
    setconfirmpassword("")
  };

  const handlePasswordUpdate = async() => {

    const apiObj = new EditGuestWorkspace(id,newpassword);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      handlePasswordDialogClose();
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      })
    } else {
      handlePasswordDialogClose();
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
    setnewpassword("")
    setconfirmpassword("")
  };


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
    const projectObj = new DownloadAllProjects(workspaceDtails.id, user.id);
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
      {initialLoading && <CircularProgress />}
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
          <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="error" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPasswordDialog}
        onClose={handlePasswordDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" fontWeight={700}>
            Update Password
          </DialogContentText>
          <Grid container spacing={2} display="flex" direction="column">
            <Grid item xs={12}>
              <FormControl sx={{ width: "100%", marginTop: "3%" }} variant="outlined">
                <InputLabel htmlFor="new-password">Enter Password</InputLabel>
                <OutlinedInput
                  id="new-password"
                  type={shownewpassword ? "text" : "password"}
                  value={newpassword}
                  onChange={handlenewpassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglenewpasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {shownewpassword ?  <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Enter Password"
                />
                 {passwordErrors.map((error, index) => (
                  <span key={index} style={{ color: "#d93025",fontSize:"13px" }}>*{error}</span>
                ))}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ width: "100%", marginTop: "3%" }} variant="outlined">
                <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={showconfirmpassword ? "text" : "password"}
                  value={confirmpassword}
                  onChange={handleconfirmpassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleconfirmpasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showconfirmpassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
            {passwordEqual==true ? "" : <span style={{ color: "#d93025",fontSize:"13px" }}>*The passwords don't match</span>}
            </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} variant="outlined" color="error">Cancel</Button>
          <Button onClick={handlePasswordUpdate} variant="contained" color="error" autoFocus disabled={passwordEqual==false||passwordErrors.length>0||!newpassword}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openToggleDialog}
        onClose={handleToggleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" fontWeight={700}>
            Enable Guest Workspace
          </DialogContentText>
          <Grid container spacing={2} display="flex" direction="column">
            <Grid item xs={12}>
              <FormControl sx={{ width: "100%", marginTop: "3%" }} variant="outlined">
                <InputLabel htmlFor="new-password">Enter Password</InputLabel>
                <OutlinedInput
                  id="new-password"
                  type={shownewpassword ? "text" : "password"}
                  value={newpassword}
                  onChange={handlenewpassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglenewpasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {shownewpassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Enter Password"
                />
                 {passwordErrors.map((error, index) => (
                  <span key={index} style={{ color: "#d93025",fontSize:"13px" }}>*{error}</span>
                ))}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ width: "100%", marginTop: "3%" }} variant="outlined">
                <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={showconfirmpassword ? "text" : "password"}
                  value={confirmpassword}
                  onChange={handleconfirmpassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleconfirmpasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showconfirmpassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
            {passwordEqual==true ? "" : <span style={{ color: "#d93025",fontSize:"13px" }}>*The passwords don't match</span>}
           
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDialogClose} variant="outlined" color="error">Cancel</Button>
          <Button onClick={handlePasswordCreate} variant="contained" color="error" autoFocus disabled={passwordEqual==false||passwordErrors.length>0}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={6} display="flex" alignItems="center">
          <Typography variant="h6" marginRight={2}>Guest workspace</Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={guestWorkspace} onChange={handleToggleChange} />}
            />
          </FormGroup>
          {guestWorkspace && (
            <Button variant="outlined" onClick={handlePasswordDialogOpen}>
              Update Password
            </Button>
          )}
        </Grid>
        <Grid item xs={6} display="flex" flexDirection="column" alignItems="flex-end">
          <CustomButton
            sx={{ backgroundColor: "#ee6633", "&:hover": { backgroundColor: "#ee6633" }, marginBottom: 2 }}
            className={classes.settingsButton}
            onClick={handleClickOpen}
            label={"Archive Workspace"}
            buttonVariant="contained"
            disabled={workspaceDtails?.is_archived}
          />
          <CustomButton
            sx={{ backgroundColor: "#ffe0b2", color: "black", "&:hover": { backgroundColor: "#ffe0b2" } }}
            label={"Download All Projects"}
            className={classes.settingsButton}
            variant="contained"
            onClick={handleDownloadProject}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default WorkspaceSetting;

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

function WorkspaceSetting(props) {
   /* eslint-disable react-hooks/exhaustive-deps */

  const { onArchiveWorkspace } = props
  console.log(props, "props")
  
  const [loading, setLoading] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });


  const handleArchiveWorkspace = async () => {
    
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
   
  };
  const handleDownloadProject = async () => {
    
  };
  return (
    <div style={{padding:"0px"}}>
      {renderSnackBar()}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to archive
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
       fullWidth
        sx={{ backgroundColor: "#ee6633", color:"white","&:hover": { backgroundColor: "#ee6633"} }}
        // className="settingsButton"
        onClick={handleClickOpen}
        label={"Archive Workspace"}
        buttonVariant="contained"
        // disabled={workspaceDtails?.is_archived}
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
      sx={{backgroundColor : "#ee6633", "&:hover" : {backgroundColor : "#ee6633",}}} 
      label={"Download All Projects"}
    //   className="settingsButton"
      fullWidth
        variant="contained"
        onClick={handleDownloadProject}
      />
      </Grid>
    </div>
  )
}
export default WorkspaceSetting;
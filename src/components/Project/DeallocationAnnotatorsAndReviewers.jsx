import React, { useState } from "react";
import CustomButton from "@/components/common/Button";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ListItemText from "@mui/material/ListItemText";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import DatasetStyle from "@/styles/dataset";
import { translate } from "@/config/localisation";
import { useDispatch, useSelector } from "react-redux";
import {useParams } from 'react-router-dom';
import { snakeToTitleCase } from "@/utils/utils";
import CustomizedSnackbars from "@/components/common/Snackbar";
import TextField from '@mui/material/TextField';
import LoginAPI from "@/app/actions/api/user/Login";
import DeallocationAnnotatorsAndReviewersAPI from "@/app/actions/api/Dashboard/DeallocationAnnotatorsAndReviewers";
import { useTheme } from "@/context/ThemeContext";


let AnnotationStatus = [
  "unlabeled",
  "skipped",
  "draft",
  "labeled",
  "to_be_revised",
];

let ReviewStatus =  [
    "unreviewed",
    "accepted",
    "accepted_with_minor_changes",
    "accepted_with_major_changes",
    "to_be_revised",
    "draft",
    "skipped",
  ];

  let SuperChecker = ["unvalidated","validated","validated_with_changes","skipped","draft","rejected"];
  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};
export default function DeallocationAnnotatorsAndReviewers() {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const {id} = useParams();
  const { dark } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [radiobutton, setRadiobutton] = useState("annotation");
  const [openDialog, setOpenDialog] = useState(false);
  const[annotatorsUser,setAnnotatorsUser] = useState("")
  const[annotationStatus,setAnnotationStatus] = useState([])
  const[reviewerssUser,setReviewersUser] = useState("")
  const[superCheckersUser,setSuperCheckersUser] = useState("")
  const[reviewStatus,setReviewStatus] = useState([])
  const[superCheckStatus,setSuperCheckStatus] = useState([])
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
});




  const open = Boolean(anchorEl);
  const Id = open ? "simple-popover" : undefined;

  const ProjectDetails = useSelector(state => state.getProjectDetails.data);
  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setAnnotatorsUser("")
    setAnnotationStatus([])
    setReviewersUser("")
    setReviewStatus([])
    setSuperCheckersUser("")
    setSuperCheckStatus([])
  };

  const handleAnnotation = () => {
    setRadiobutton("annotation");
  };
  const handleReview = () => {
    setRadiobutton("review");
  };
  const handlesuperChecker = () => {
    setRadiobutton("superChecker");
  };

  const handleSubmit = () => {
    setAnchorEl(null);
    setOpenDialog(true);
}

const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnnotatorsUser("")
    setAnnotationStatus([])
    setReviewersUser("")
    setReviewStatus([])
    setSuperCheckersUser("")
    setSuperCheckStatus([])
};

const handleChangeAnnotationStatus = (event) => {
    const value = event.target.value;
    setAnnotationStatus(value);
  };

  const handleChangeReviewStatus = (event) =>{
    const value = event.target.value;
    setReviewStatus(value);
  }
  const handleChangeSuperCheckerStatus = (event) =>{
    const value = event.target.value;
    setSuperCheckStatus(value);
  }

  

const handleok = async() => {
    setAnchorEl(null);
    setOpenDialog(false);
    setAnnotatorsUser("")
    setAnnotationStatus([])
    setReviewersUser("")
    setReviewStatus([])
    setSuperCheckersUser("")
    setSuperCheckStatus([])
    const projectObj = new DeallocationAnnotatorsAndReviewersAPI(id,radiobutton,annotatorsUser,reviewerssUser,annotationStatus,reviewStatus,superCheckersUser,superCheckStatus);
    // dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(projectObj.getBody()),
        headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    // setLoading(false);
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
        message={snackbar.message}
      />
    );
  };

  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const handleConfirm = async () => {
    if(radiobutton === "annotation" || radiobutton === "review"){
      const apiObj = new LoginAPI(emailId, password);
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });
      const rsp_data = await res.json();
      if (res.ok) {
        handleok();
      }else{
        window.alert("Invalid credentials, please try again");
      }
    }else if(radiobutton === "superChecker"){
      if(pin === "9327"){
        handleok();
      }else{
        window.alert("Incorrect pin entered");
      }
    }
  };

  return (
    <div>
        {renderSnackBar()}
      <CustomButton
        sx={{
          inlineSize: "max-content",
          borderRadius: 3,
          width: "100%"
        }}
        onClick={handleClickOpen}
        label="Deallocate User Tasks"
        color="error"
      />

      <Popover
                Id={Id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: dark ? "#2a2a2a" : "",
                    color: dark ? "#ececec" : "",
                    border: dark ? "1px solid #3a3a3a" : "",
                    boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.5)" : "",
                  }
                }}
>
        <Grid container className={classes.root}>
          <Grid item style={{ flexGrow: "1", padding: "10px" }}>
            <FormControl sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue="annotation"
              >
                <FormControlLabel
                  value="annotation"
                  control={<Radio />}
                  label="Annotators"
                  onClick={handleAnnotation}
                  sx={{ color: dark ? "#ececec" : "" }}
                />
                <FormControlLabel
                  value="review"
                  control={<Radio />}
                  label="Reviewers"
                  onClick={handleReview}
                  sx={{ color: dark ? "#ececec" : "" }}
                />
                <FormControlLabel
                  value="superChecker"
                  control={<Radio />}
                  label="Super Check"
                  onClick={handlesuperChecker}
                  sx={{ color: dark ? "#ececec" : "" }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        {radiobutton === "annotation" && (
          <>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                  Select User:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={annotatorsUser}
                    onChange={(e) => setAnnotatorsUser(e.target.value)}
                    sx={{ textAlign: "left", color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
    MenuProps={{ ...MenuProps, PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
                  >
                    {ProjectDetails?.annotators?.map((el, i) => {
                      return <MenuItem key={i} value={el.id}>{el.username}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                  Select Annotation Status :
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>

                <Select
                labelId="Select-Task-Statuses"
                multiple
                value={annotationStatus}
                onChange={handleChangeAnnotationStatus}
                renderValue={(annotationStatus) => annotationStatus.join(", ")}
                
                sx={{ textAlign: "left", color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
                MenuProps={{ ...MenuProps, PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
               
              >
                {AnnotationStatus.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    {/* <ListItemIcon>
                      <Checkbox checked={annotationStatus.indexOf(option) > -1} />
                    </ListItemIcon> */}
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
                  
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        {radiobutton === "review" && (
          <>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                  Select User:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={reviewerssUser}
                     onChange={(e) => setReviewersUser(e.target.value)}
                    sx={{ textAlign: "left", color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
                    MenuProps={{ ...MenuProps, PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
                  >
                    {ProjectDetails?.annotation_reviewers.map((el, i) => {
                      return <MenuItem key={i} value={el.id}>{el.username}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                  Select Review Status :
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
                <Select
                labelId="Select-Task-Statuses"
                multiple
                value={reviewStatus}
                onChange={handleChangeReviewStatus}
                renderValue={(reviewStatus) => reviewStatus.join(", ")}
                
                sx={{ textAlign: "left", color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
                 MenuProps={{ ...MenuProps, PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
               
              >
                {ReviewStatus.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    {/* <ListItemIcon>
                      <Checkbox checked={annotationStatus.indexOf(option) > -1} />
                    </ListItemIcon> */}
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}

   {radiobutton === "superChecker" && (
          <>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                  Select User:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={superCheckersUser}
                     onChange={(e) => setSuperCheckersUser(e.target.value)}
                    sx={{ textAlign: "left", color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
                   MenuProps={{ ...MenuProps, PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
                  >
                    {ProjectDetails?.review_supercheckers.map((el, i) => {
                      return <MenuItem key={i} value={el.id}>{el.username}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                  Select Super Check Status :
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth size="small" sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
                <Select
                labelId="Select-Task-Statuses"
                multiple
                value={superCheckStatus}
                onChange={handleChangeSuperCheckerStatus}
                renderValue={(superCheckStatus) => superCheckStatus.join(", ")}
                sx={{ textAlign: "left", color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
               MenuProps={{ ...MenuProps, PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
               
              >
                {SuperChecker.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    {/* <ListItemIcon>
                      <Checkbox checked={annotationStatus.indexOf(option) > -1} />
                    </ListItemIcon> */}
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            {translate("button.clear")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            {translate("button.submit")}
          </Button>
        </Box>
      </Popover>

      <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  PaperProps={{
    sx: {
      backgroundColor: dark ? "#2a2a2a" : "",
      color: dark ? "#ececec" : "",
      border: dark ? "1px solid #3a3a3a" : "",
    }
  }}
>
  <DialogContent sx={{ backgroundColor: dark ? "#2a2a2a" : "" }}>
    <DialogContentText id="alert-dialog-description" sx={{ color: dark ? "#a0a0a0" : "" }}>
      Are you sure want to Deallocate User Tasks ?
    </DialogContentText>
                    {(radiobutton === "annotation" || radiobutton === "review") && <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                            "& .MuiInput-root": { color: dark ? "#ececec" : "" },
                            "& .MuiInput-underline:before": { borderBottomColor: dark ? "#3a3a3a" : "" },
                            "& .MuiInputLabel-root": { color: dark ? "#a0a0a0" : "" },
                          }}
                          />}
                    {radiobutton === "superChecker" && <TextField
                            autoFocus
                            margin="dense"
                            id="pin"
                            label="Pin"
                            type="pin"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setPin(e.target.value)}
                            sx={{
                            "& .MuiInput-root": { color: dark ? "#ececec" : "" },
                            "& .MuiInput-underline:before": { borderBottomColor: dark ? "#3a3a3a" : "" },
                            "& .MuiInputLabel-root": { color: dark ? "#a0a0a0" : "" },
                          }}
                          />}
                          
                </DialogContent>
                <DialogActions sx={{ backgroundColor: dark ? "#2a2a2a" : "", borderTop: dark ? "1px solid #3a3a3a" : "" }}>
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        color="error"
                        size="small"
                        className={classes.clearAllBtn} >
                          Cancel
                    </Button>
                    <Button onClick={handleConfirm}
                        variant="contained"
                        color="error"
                        size="small" className={classes.clearAllBtn} autoFocus >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
    </div>
  );
}

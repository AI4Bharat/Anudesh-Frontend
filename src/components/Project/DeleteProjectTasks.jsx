import React, { useState } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { translate } from "@/config/localisation";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "@/components/common/Snackbar";
import userRole from "@/utils/UserMappedByRole/Roles";
import DeleteProjectTasksAPI from "@/app/actions/api/Projects/DeleteProjectTasksAPI";
import LoginAPI from "@/app/actions/api/user/Login";
import { useTheme } from "@/context/ThemeContext";

export default function DeleteProjectTasks() {
    const classes = DatasetStyle();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { dark } = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [projectTaskStartId, setProjectTaskStartId] = useState("");
    const [projectTaskEndId, setProjectTaskEndId] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [radiobutton, setRadiobutton] = useState(true)
    const [dataIds, setDataIds] = useState("")
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const loggedInUserData = useSelector(
        (state) => state.getLoggedInData?.data
      );
    

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleClearSearch = () => {
        setAnchorEl(null);
        setProjectTaskStartId();
        setProjectTaskEndId();
    };

    const handleDeletebyids = () => {
        setRadiobutton(true)

    }
    const handleDeletebyrange = () => {
        setRadiobutton(false)
    }
    const handledataIds = (e,) => {
        setDataIds(e.target.value);


    }

    let datasetitem = dataIds.split(",")
    var value = datasetitem.map(function (str) {
        return parseInt(str);
    });

    const handleok = async() => {
        setOpenDialog(false);
        setAnchorEl(null);
        setProjectTaskStartId();
        setProjectTaskEndId();
        let projectObj
        const ProjectTaskStartAndEndID = {
            project_task_start_id: parseInt(projectTaskStartId),
            project_task_end_id: parseInt(projectTaskEndId)
        }
        

        const  ProjectTaskIDs = {
            project_task_ids: value
        }

        if (radiobutton === true) {
             projectObj = new DeleteProjectTasksAPI(id, ProjectTaskStartAndEndID)


        } else {
             projectObj = new DeleteProjectTasksAPI(id, ProjectTaskIDs)
        }
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
    }

    const handleSearchSubmit = () => {
        setOpenDialog(true);

    }


    const open = Boolean(anchorEl);
    const Id = open ? 'simple-popover' : undefined;

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
    const handleConfirm = async () => {
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
    };

    return (
        <div >
            {renderSnackBar()}
            <Button
                sx={{
                    inlineSize: "max-content",
                    borderRadius: 3,
                    width: "100%"
                }}
                aria-describedby={Id}
                variant="contained"
                onClick={handleClick}
                disabled ={userRole.WorkspaceManager === loggedInUserData?.role?true:false}
                color="error">
                Delete Project Tasks
            </Button>

           <Popover
                    Id={Id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
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

                  <Grid container className={classes.root} >
                    <Grid item style={{ flexGrow: "1", padding: "10px" }}>
                        <FormControl >
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                defaultValue="deletebyrange"

                            >

                                <FormControlLabel value="deletebyrange" control={<Radio />} label="Delete by Range" onClick={handleDeletebyids} sx={{ color: dark ? "#ececec" : "" }}/>
                                <FormControlLabel value="deletebyids" control={<Radio />} label="Delete by IDs" onClick={handleDeletebyrange} sx={{ color: dark ? "#ececec" : "" }} />

                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
              {radiobutton === true &&
              <>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        p: 1
                    }}
                >

                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={5}
                        xl={5}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                            Project Task Start ID:
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={6}
                        sm={6}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={projectTaskStartId}
                            onChange={(e) => setProjectTaskStartId(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px",
                                    color: dark ? "#ececec" : "",
                                }
                            }}
                            sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: dark ? "#1e1e1e" : "",
                                "& fieldset": { borderColor: dark ? "#3a3a3a" : "" },
                                "&:hover fieldset": { borderColor: dark ? "#fb923c" : "" },
                            }
                            }}
                        />

                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        p: 1
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={5}
                        xl={5}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                            Project Task End ID:
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={6}
                        sm={6}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={projectTaskEndId}
                            onChange={(e) => setProjectTaskEndId(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px",
                                    color: dark ? "#ececec" : "",
                                }
                            }}
                            sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: dark ? "#1e1e1e" : "",
                            "& fieldset": { borderColor: dark ? "#3a3a3a" : "" },
                            "&:hover fieldset": { borderColor: dark ? "#fb923c" : "" },
                        }
                        }}
                        />
                    </Grid>
   
                </Grid>
                </>}
                {radiobutton === false &&
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            p: 1
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={5}
                            xl={5}
                        >
                            <Typography variant="body2" fontWeight='700' label="Required" sx={{ color: dark ? "#ececec" : "" }}>
                            Project Task IDs:
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={6}
                            xl={6}
                            sm={6}
                        >

                            <TextField
                                size="small"
                                variant="outlined"
                                value={dataIds}
                                onChange={handledataIds}
                                inputProps={{
                                    style: {
                                        fontSize: "16px",
                                        color: dark ? "#ececec" : "",
                                    }
                                }}
                                sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: dark ? "#1e1e1e" : "",
                                    "& fieldset": { borderColor: dark ? "#3a3a3a" : "" },
                                    "&:hover fieldset": { borderColor: dark ? "#fb923c" : "" },
                                }
                                }}
                            />
                        </Grid>
                    </Grid>
                }

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                    <Button
                        onClick={handleClearSearch}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button
                        onClick={handleSearchSubmit}
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
      Are you sure want to delete these tasks? Please note this action cannot be undone.
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
      sx={{
        "& .MuiInput-root": { color: dark ? "#ececec" : "" },
        "& .MuiInput-underline:before": { borderBottomColor: dark ? "#3a3a3a" : "" },
        "& .MuiInputLabel-root": { color: dark ? "#a0a0a0" : "" },
      }}
    />
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

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, TextField, FormControl, InputLabel, Input, IconButton, FormHelperText, Typography, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'
import CustomButton from '../../../../components/common/Button'
import { useDispatch, useSelector } from 'react-redux';
import CreateWorkspaceAPI from '../../../actions/api/workspace/CreateWorkspace'
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GetWorkspaceAPI from '../../../actions/api/workspace/GetWorkspaceData';
// import { fetchWorkspaceCreateData } from '@/Lib/Features/getWorkspaceData';
import CustomizedSnackbars from '@/components/common/Snackbar';
import AuthenticateToWorkspaceAPI from '@/app/actions/api/workspace/AuthenticateToWorkspaceAPI';
import CreateGuestWorkspace from '@/app/actions/api/Projects/createWorkspace';
import { useEffect } from 'react';
// import { fetchWorkspaceDetails } from '@/Lib/Features/getWorkspaceDetails';
import { fetchWorkspaceData } from '@/Lib/Features/GetWorkspace';

const AddWorkspaceDialog = ({ isOpen, dialogCloseHandler,orgId}) => {
    const dispatch = useDispatch();
    const [workspaceName, setWorkspaceName] = useState('')
    const [loading, setLoading] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [publicanalytics,setpublicanalytics] = useState(true);
    const [guestWorkspace, setGuestWorkspace] = useState(true);
    // const workspaceData = useSelector((state) => state.GetWorkspace.data);
    const [currentWorkspaceName, setCurrentWorkspaceName] = useState("");
    const [currentWorkspaceId, setWorkspaceCurrentId] = useState("");
    const [passwordEqual, setPasswordEqual] = useState(true);
    const workspaceData1= useSelector((state) => console.log(state));

    const [snackbar, setSnackbarInfo] = useState({
      open: false,
      message: "",
      variant: "success",
    });
    const validatePassword = () => {
      const errors = [];
    
      if (password1.length > 0) {
        if (password1.length < 8) {
          errors.push("This password is too short. It must contain at least 8 characters.");
        }
        
        if (!/[a-z]/.test(password1)) {
          errors.push("This password must contain at least one lowercase letter.");
        }
        
        if (!/[A-Z]/.test(password1)) {
          errors.push("This password must contain at least one uppercase letter.");
        }
        
        if (!/[0-9]/.test(password1)) {
          errors.push("This password must contain at least one number.");
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password1)) {
          errors.push("This password must contain at least one special character.");
        }
    
        const commonPasswords = ["password", "12345678", "qwerty", "123456789", "abc123", "password1"];
        if (commonPasswords.includes(password1)) {
          errors.push("This password is too common.");
        }
      } else {
        errors.push("Password cannot be empty.");
      }
      
      setPasswordErrors(errors);
      return errors.length === 0;
    };
    useEffect(() => {
      validatePassword()
      equal()

  }, [password1,password2]); 
  useEffect(() => {
    dispatch(fetchWorkspaceData());
}, []);   
  const equal =()=>{
    if(password2.length>0){
      setPasswordEqual(password1===password2)
    }
  }
  const handlepublicanalytics = async () => {
        // setLoading(true);
        setpublicanalytics((publicanalytics)=>!publicanalytics)
      };

      const handleguestworkspace = async () => {
        // setLoading(true);
        setGuestWorkspace((guestWorkspace)=>!guestWorkspace)
      };
    const addBtnClickHandler = async (event) => {
        console.log("lll");
        setLoading(true);
        if (!workspaceName) return;

        //  setLoading(true);
        const createWorkspaceObj = new CreateWorkspaceAPI(
            orgId,
            workspaceName,
            publicanalytics
        );
        const token = localStorage.getItem('anudesh_access_token');
        const createWorkspaceRes = await fetch(createWorkspaceObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(createWorkspaceObj),
            headers: {
                Authorization: `JWT ${token}`, 
                'Content-Type': 'application/json', 
              },
        });

        const createWorkspaceRespData = await createWorkspaceRes.json();

        if (createWorkspaceRes.ok) {
          const getWorkspaceApiObj = new GetWorkspaceAPI(); 
          const workspaceDataRes = await fetch(getWorkspaceApiObj.apiEndPoint(), {
              method: "GET",
              headers: {
                  Authorization: `JWT ${token}`,
                  'Content-Type': 'application/json',
              },
          });
          const workspaceData = await workspaceDataRes.json();
  

          const workspaceDetails = workspaceData.find(ws => ws.workspace_name === workspaceName);
          console.log(workspaceDetails,workspaceName);
          if(guestWorkspace){ const apiObj = new CreateGuestWorkspace(workspaceDetails.id,password1);
              const res = await fetch(apiObj.apiEndPoint(), {
                method: "PATCH",
                body: JSON.stringify(apiObj.getBody()),
                headers: apiObj.getHeaders().headers,
              });
              const resp = await res.json();
              setLoading(false);
              if (res.ok) {
                // dispatch(fetchWorkspaceDetails(orgId));
                setSnackbarInfo({
                  open: true,
                  message: "Successfully created Guest Workspace",
                  variant: "success",
                })
              } else {
                setSnackbarInfo({
                  open: true,
                  message: resp?.message,
                  variant: "error",
                })
              }
              setLoading(false);
        }  
      }
        dialogCloseHandler();
        setLoading(false);
        setWorkspaceName('');
        return createWorkspaceRespData;    

    }
    const handlePasswordChange1 = (event) => {
        setPassword1(event.target.value);
        // validatePassword(event.target.value)
        // console.log(event.target.value === password1);
        // setPasswordEqual(event.target.value === password2);    

    };

    const handlePasswordChange2 = (event) => {
        setPassword2(event.target.value);
        // validatePassword(password1)
        // setPasswordEqual(event.target.value === password1);    
      };

    const handleTogglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleTogglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleUserDialogClose = () => {
        setWorkspaceName('');
        dialogCloseHandler();
    }

    const handleTextField=(e)=>{
       setWorkspaceName(e.target.value)   
    }
    console.log(passwordEqual);
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
  
    return (
      <>
      {renderSnackBar()}
        <Dialog open={isOpen} onClose={handleUserDialogClose} close>
            <DialogTitle>Enter workspace details</DialogTitle>
            <DialogContent style={{ paddingTop: 4 }}>
                <TextField placeholder='Enter Workspace Name' label="Workspace Name" fullWidth size='normal' value={workspaceName} onChange={handleTextField} />
                <FormControlLabel
                            control={<Switch color="primary" />}
                            labelPlacement="start"
                            label ="Public Analytics"
                            checked={publicanalytics}
                            onChange={handlepublicanalytics}
                        />
                        
                <FormControlLabel
                            control={<Switch color="primary" />}
                            labelPlacement="start"
                            label ="Guest Workspace"
                            checked={guestWorkspace}
                            onChange={handleguestworkspace}
                            sx={{marginLeft: "35%"}}
                        />
           <div>
      {guestWorkspace && (
        <>
          <FormControl sx={{ width: "100%", marginTop: "3%", marginLeft: "0" }} variant="outlined">
            <InputLabel htmlFor="my-input1">Enter Password</InputLabel>
            <OutlinedInput
              id="my-input1"
              type={showPassword1 ? "text" : "password"}
              value={password1}
              onChange={handlePasswordChange1}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility1}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword1 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Enter Password"
            />
            {passwordErrors.map((error, index) => (
                  <span key={index} style={{ color: "#d93025" ,fontSize:"13px"}}>*{error}</span>
                ))}
          </FormControl>
          <FormControl sx={{ width: "100%", marginTop: "3%", marginLeft: "0" }} variant="outlined">
            <InputLabel htmlFor="my-input2">Confirm Password</InputLabel>
            <OutlinedInput
              id="my-input2"
              type={showPassword2 ? "text" : "password"}
              value={password2}
              onChange={handlePasswordChange2}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility2}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Re-enter Password"
            />
            {passwordEqual==true ? "" : <span style={{ color: "#d93025" }}>The passwords don't match</span>}
          </FormControl>
        </>
      )}
    </div>
            </DialogContent>
            <DialogActions style={{ padding: '0 24px 24px 0' }}>
                <Button onClick={handleUserDialogClose} size="small">
                    Cancel
                </Button>
                
                <CustomButton
                    startIcon={
                        !loading ? (
                            null
                        ) : (
                            <CircularProgress size="0.8rem" color="secondary" />
                        )
                    }
                    onClick={addBtnClickHandler}
                    size="small"
                    label="OK"
                    disabled={loading || !workspaceName || (guestWorkspace && !password1 && !password2)|| passwordErrors.length>0|| passwordEqual==false}
                />  
            </DialogActions>
        </Dialog>
        </>
    )
}

export default AddWorkspaceDialog
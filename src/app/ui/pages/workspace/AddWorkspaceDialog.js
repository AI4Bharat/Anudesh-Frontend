import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, TextField, FormControl, InputLabel, Input, IconButton, FormHelperText, Typography, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'
import CustomButton from '../../../../components/common/Button'
import { useDispatch, useSelector } from 'react-redux';
import CreateWorkspaceAPI from '../../../actions/api/workspace/CreateWorkspace'
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GetWorkspaceAPI from '../../../actions/api/workspace/GetWorkspaceData';
import { fetchWorkspaceCreateData } from '@/Lib/Features/getWorkspaceData';
import CustomizedSnackbars from '@/components/common/Snackbar';
import AuthenticateToWorkspaceAPI from '@/app/actions/api/workspace/AuthenticateToWorkspaceAPI';

const AddWorkspaceDialog = ({ isOpen, dialogCloseHandler}) => {
    const dispatch = useDispatch();
    const [workspaceName, setWorkspaceName] = useState('')
    const [loading, setLoading] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [publicanalytics,setpublicanalytics] = useState(true);
    const [guestWorkspace, setGuestWorkspace] = useState(true);
    const [currentWorkspaceName, setCurrentWorkspaceName] = useState("");
    const [currentWorkspaceId, setWorkspaceCurrentId] = useState("");
    const [passwordEqual, setPasswordEqual] = useState(true);

    const handlepublicanalytics = async () => {
        // setLoading(true);
        setpublicanalytics((publicanalytics)=>!publicanalytics)
      };

      const handleguestworkspace = async () => {
        // setLoading(true);
        setGuestWorkspace((guestWorkspace)=>!guestWorkspace)
      };
    const addBtnClickHandler = async (event) => {
        if(password1 != password2){
            setPasswordEqual(false)
            return;
        }
        setLoading(true);
        if (!workspaceName) return;

        //  setLoading(true);
        const createWorkspaceObj = new CreateWorkspaceAPI(
            1,
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
            dispatch(fetchWorkspaceCreateData(1));
        }
        dialogCloseHandler();
        setLoading(false);
        setWorkspaceName('');
        return createWorkspaceRespData;    

    }
    const handlePasswordChange1 = (event) => {
        setPassword1(event.target.value);
    };

    const handlePasswordChange2 = (event) => {
        setPassword2(event.target.value);
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
    
    return (
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
          <FormControl sx={{ width: "95%", marginTop: "3%", marginLeft: "2.5%" }} variant="outlined">
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
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Enter Password"
            />
          </FormControl>
          <FormControl sx={{ width: "95%", marginTop: "3%", marginLeft: "2.5%" }} variant="outlined">
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
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Re-enter Password"
            />
            {passwordEqual ? "" : <span style={{ color: "#d93025" }}>The passwords don't match</span>}
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
                    disabled={loading || !workspaceName || (guestWorkspace && !password1 && !password2)}
                />  
            </DialogActions>
        </Dialog>
    )
}

export default AddWorkspaceDialog
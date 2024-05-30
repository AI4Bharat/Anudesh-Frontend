import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch, TextField } from '@mui/material'
import React, { useState } from 'react'
import CustomButton from '../../../../components/common/Button'
import { useDispatch, useSelector } from 'react-redux';
import CreateWorkspaceAPI from '../../../actions/api/workspace/CreateWorkspace'
import GetWorkspaceAPI from '../../../actions/api/workspace/GetWorkspaceData';
import { fetchWorkspaceCreateData } from '@/Lib/Features/getWorkspaceData';
const AddWorkspaceDialog = ({ isOpen, dialogCloseHandler}) => {
    const dispatch = useDispatch();
    const [workspaceName, setWorkspaceName] = useState('')
    const [loading, setLoading] = useState(false);

    const [publicanalytics,setpublicanalytics] = useState(true)
   


    const handlepublicanalytics = async () => {
        // setLoading(true);
        setpublicanalytics((publicanalytics)=>!publicanalytics)
      };

    
   
    const addBtnClickHandler = async (event) => {
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
                    disabled={loading || !workspaceName}
                />  
            </DialogActions>
        </Dialog>
    )
}

export default AddWorkspaceDialog
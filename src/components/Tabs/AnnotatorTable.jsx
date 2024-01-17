import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Link from 'next/link';
<<<<<<< HEAD:src/components/Tabs/AnnotatorTable.jsx

// import { useDispatch, useSelector } from 'react-redux';
// import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import CustomButton from "../common/Button";
import { ThemeProvider,Grid, Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import tableTheme from "../../themes/tableTheme";
// import RemoveWorkspaceMemberAPI from "../../../../redux/actions/api/WorkspaceDetails/RemoveWorkspaceMember";
=======
import { useDispatch, useSelector } from 'react-redux';
import GetWorkspacesAnnotatorsDataAPI from "@/app/actions/api/workspace/GetWorkspacesAnnotatorsDataAPI";
import APITransport from "../../../Lib/apiTransport/apitransport";
import UserMappedByRole from "../../../utils/UserMappedByRole";
import CustomButton from "../common/Button";
import { ThemeProvider,Grid, Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import tableTheme from "../../../themes/TableTheme";
import RemoveWorkspaceMemberAPI from "@/app/actions/api/workspace/RemoveWorkspaceMemberAPI";
>>>>>>> efficiency:src/app/components/Tabs/AnnotatorTable.jsx
import Search from "../common/Search";
import RemoveWorkspaceFrozenUserAPI from "@/app/actions/api/workspace/RemoveWorkspaceFrozenUserAPI";
import TextField from '@mui/material/TextField';
import LoginAPI from "@/app/actions/api/user/Login";
import { fetchWorkspacesAnnotatorsData } from "@/Lib/Features/GetWorkspacesAnnotatorsData";


const AnnotatorsTable = (props) => {
    const dispatch = useDispatch();
    const { onRemoveSuccessGetUpdatedMembers } = props;

    const [loading, setLoading] = useState(false);
    // const { id } = useParams();
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const orgId = useSelector(state => state.getWorkspaceProjectData?.data?.[0]?.organization_id);
    // const SearchWorkspaceMembers = useSelector((state) => state.SearchProjectCards.data);


    const workspaceAnnotators = useSelector(state => state.getWorkspacesAnnotatorsData.data);
    const workspaceDtails = useSelector(state=>state.getWorkspaceDetails.data);


    useEffect(() => {
      dispatch(fetchWorkspacesAnnotatorsData(1));
    }, []);
 
    const handleRemoveWorkspaceMember = async (Projectid) => {
        const workspacedata = {
            user_id: Projectid,
        }
        const projectObj = new RemoveWorkspaceMemberAPI(1, workspacedata);
        dispatch(APITransport(projectObj));
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
            onRemoveSuccessGetUpdatedMembers();
        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }

    }

    const handleRemoveFrozenUsers = async (FrozenUserId) => {
        const projectObj = new RemoveWorkspaceFrozenUserAPI(id, { user_id: FrozenUserId });
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
          });
          onRemoveSuccessGetUpdatedMembers();
        } else {
          setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "error",
          });
        }
      };
    

    const pageSearch = () => {

        return workspaceAnnotators.filter((el) => {

                return el;

        })

    }
    const columns = [
        {
            name: "id",
            label: "Id",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display:"excluded",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Email",
            label: "Email",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },
        {
            name: "Role",
            label: "Role",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },


        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
            }
        }];

          

    const data = workspaceAnnotators && workspaceAnnotators.length > 0 ? pageSearch().map((el, i) => {
        const userRole = el.role && UserMappedByRole(el.role)?.element;
        return [
            el.id,
            el.username,
            el.email,
            userRole ? userRole : el.role,
            // userRole ? userRole : el.role,
            // el.role,
            <>
                <Link href={`/profile`} style={{ textDecoration: "none" }}>
                    <CustomButton
                        sx={{ borderRadius: 2, marginRight: 2 }}
                        label="View"
                    />

                </Link>
                <CustomButton
                    sx={{ borderRadius: 2, backgroundColor: "#cf5959",mr:2 }}
                    label="Remove"
                    onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true);}}
                    // disabled={projectlist(el.id)}
                />
                 {/* {projectlist(el.id) &&(
                 <CustomButton
                    sx={{ borderRadius: 2}}
                    label="Add"
                    onClick={() => handleRemoveFrozenUsers(el.id)}
                  />)} */}
            </>
        ]
    }) : [];

    const options = {
        textLabels: {
            body: {
                noMatch: "No records",
            },
            toolbar: {
                search: "Search",
                viewColumns: "View Column",
            },
            pagination: { rowsPerPage: "Rows per page" },
            options: { sortDirection: "desc" },
        },
        // customToolbar: fetchHeaderButton,
        displaySelectToolbar: false,
        fixedHeader: false,
        filterType: "checkbox",
        download: false,
        print: false,
        rowsPerPageOptions: [10, 25, 50, 100],
        // rowsPerPage: PageInfo.count,
        filter: false,
        // page: PageInfo.page,
        viewColumns: false,
        selectableRows: "none",
        search: false,
        jumpToPage: true,
    };

    
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [elEmail, setElEmail] = useState("");
  const [elId, setElId] = useState("");
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
      handleRemoveWorkspaceMember(elId)
      setConfirmationDialog(false);
    }else{
      window.alert("Invalid credentials, please try again");
      console.log(rsp_data);
    }
  };
    return (
        <div>
            <Dialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
              >
                <DialogTitle id="dialog-title">
                  {"Remove Member from Project?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {elEmail} will be removed from this workspace. Please be careful as
                    this action cannot be undone.
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
                  <Button
                    onClick={() => setConfirmationDialog(false)}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            <Grid sx={{mb:1}}>
                <Search />
            </Grid>
            <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    // title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </div>

    )
}

export default AnnotatorsTable;
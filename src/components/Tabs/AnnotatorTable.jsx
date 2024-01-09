import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Link from 'next/link';

// import { useDispatch, useSelector } from 'react-redux';
// import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../utils/UserMappedByRole";
import CustomButton from "../common/Button";
import { ThemeProvider,Grid, Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import tableTheme from "../../themes/tableTheme";
// import RemoveWorkspaceMemberAPI from "../../../../redux/actions/api/WorkspaceDetails/RemoveWorkspaceMember";
import Search from "../common/Search";
// import RemoveWorkspaceFrozenUserAPI from "../../../../redux/actions/api/WorkspaceDetails/RemoveWorkspaceFrozenUser";
import TextField from '@mui/material/TextField';
// import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";

const AnnotatorsTable = (props) => {
    // const dispatch = useDispatch();
    // const { onRemoveSuccessGetUpdatedMembers } = props;

    const [loading, setLoading] = useState(false);
    // const { id } = useParams();
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    // const orgId = useSelector(state => state.getWorkspacesProjectData?.data?.[0]?.organization_id);
    // const SearchWorkspaceMembers = useSelector((state) => state.SearchProjectCards.data);
    // const getWorkspaceAnnotatorsData = () => {

    //     const workspaceObjs = new GetWorkspacesAnnotatorsDataAPI(id);

    //     dispatch(APITransport(workspaceObjs));
    // }

    // const workspaceAnnotators = useSelector(state => state.getWorkspacesAnnotatorsData.data);
    // const workspaceDtails = useSelector(state=>state.getWorkspaceDetails.data);


    // useEffect(() => {
    //     getWorkspaceAnnotatorsData();
    // }, []);
    // const orgId = workspaceAnnotators &&  workspaceAnnotators
    // getWorkspacesProjectData
    // const handleRemoveWorkspaceMember = async (Projectid) => {
    //     const workspacedata = {
    //         user_id: Projectid,
    //     }
    //     const projectObj = new RemoveWorkspaceMemberAPI(id, workspacedata);
    //     // dispatch(APITransport(projectObj));
    //     const res = await fetch(projectObj.apiEndPoint(), {
    //         method: "POST",
    //         body: JSON.stringify(projectObj.getBody()),
    //         headers: projectObj.getHeaders().headers,
    //     });
    //     const resp = await res.json();
    //     setLoading(false);
    //     if (res.ok) {
    //         setSnackbarInfo({
    //             open: true,
    //             message: resp?.message,
    //             variant: "success",
    //         })
    //         onRemoveSuccessGetUpdatedMembers();
    //     } else {
    //         setSnackbarInfo({
    //             open: true,
    //             message: resp?.message,
    //             variant: "error",
    //         })
    //     }

    // }

    // const handleRemoveFrozenUsers = async (FrozenUserId) => {
    //     const projectObj = new RemoveWorkspaceFrozenUserAPI(id, { user_id: FrozenUserId });
    //     const res = await fetch(projectObj.apiEndPoint(), {
    //       method: "POST",
    //       body: JSON.stringify(projectObj.getBody()),
    //       headers: projectObj.getHeaders().headers,
    //     });
    //     const resp = await res.json();
    //     // setLoading(false);
    //     if (res.ok) {
    //       setSnackbarInfo({
    //         open: true,
    //         message: resp?.message,
    //         variant: "success",
    //       });
    //       onRemoveSuccessGetUpdatedMembers();
    //     } else {
    //       setSnackbarInfo({
    //         open: true,
    //         message: resp?.message,
    //         variant: "error",
    //       });
    //     }
    //   };
    
    const workspaceAnnotators= [
        {
            "id": 1,
            "username": "shoonya",
            "email": "shoonya@ai4bharat.org",
            "languages": [],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "Admin",
            "last_name": "AI4B",
            "phone": "",
            "profile_photo": "",
            "role": 6,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "shoonya@ai4bharat.org",
            "date_joined": "2022-04-24T07:40:11Z",
            "participation_type": 3,
            "prefer_cl_ui": false,
            "is_active": true
        },
        {
            "id": 2,
            "username": "shoonya_prediction",
            "email": "prediction@ai4bharat.org",
            "languages": [],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "Shoonya",
            "last_name": "Prediction",
            "phone": "",
            "profile_photo": "",
            "role": 6,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "",
            "date_joined": "2022-04-24T07:40:49Z",
            "participation_type": 3,
            "prefer_cl_ui": false,
            "is_active": true
        },
        {
            "id": 9,
            "username": "Ishvinder",
            "email": "ishvinder@ai4bharat.org",
            "languages": [
                "English",
                "Hindi"
            ],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "Ishvinder",
            "last_name": "Sethi",
            "phone": "",
            "profile_photo": "https://shoonyastoragedevelop.blob.core.windows.net/images/Ishvinder.png",
            "role": 6,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "",
            "date_joined": "2022-04-26T16:27:51Z",
            "participation_type": 3,
            "prefer_cl_ui": false,
            "is_active": true
        },
        {
            "id": 112,
            "username": "test_annotator2",
            "email": "test_annotator2@ai4bharat.org",
            "languages": [
                "English"
            ],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "Demo",
            "last_name": "Annoator 2",
            "phone": "",
            "profile_photo": "",
            "role": 4,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "",
            "date_joined": "2022-05-06T17:05:23Z",
            "participation_type": 3,
            "prefer_cl_ui": true,
            "is_active": true
        },
        {
            "id": 111,
            "username": "test_annotator1",
            "email": "test_annotator1@ai4bharat.org",
            "languages": [],
            "availability_status": 1,
            "enable_mail": true,
            "first_name": "Test Annotator1",
            "last_name": "",
            "phone": "",
            "profile_photo": "",
            "role": 5,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "",
            "date_joined": "2022-05-06T16:44:30Z",
            "participation_type": 3,
            "prefer_cl_ui": true,
            "is_active": true
        },
        {
            "id": 110,
            "username": "test_manager",
            "email": "test_manager@ai4bharat.org",
            "languages": [],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "DummyManager",
            "last_name": "DemoManager",
            "phone": "",
            "profile_photo": "",
            "role": 4,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "",
            "date_joined": "2022-05-06T16:31:07Z",
            "participation_type": 3,
            "prefer_cl_ui": true,
            "is_active": true
        }]
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
import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspacesManagersDataAPI from "../../actions/api/workspace/GetWorkspacesManagersDataAPI"
import {useDispatch,useSelector} from 'react-redux';
import APITransport from "../../../Lib/apiTransport/apitransport"
import CustomButton from "../common/Button";
import { ThemeProvider, Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText } from "@mui/material";
import tableTheme from "../../../themes/TableTheme";
import Link from 'next/link';
import {useRouter} from 'next/navigation'
import RemoveWorkspaceManagerAPI from "../../actions/api/workspace/RemoveWorkspaceManagerAPI"
import CustomizedSnackbars from "../../components/common/Snackbar";
import Search from "../common/Search";
import TextField from '@mui/material/TextField';
import LoginAPI from "@/app/actions/api/user/Login";
const ManagersTable = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });
    const router = useRouter()
    // const {id} = useParams();
    // const orgId = useSelector(state=>state.getWorkspacesProjectData?.data?.[0]?.organization_id);
    const getWorkspaceManagersData = ()=>{
        
        const workspaceObjs = new GetWorkspacesManagersDataAPI(1);
       
        dispatch(APITransport(workspaceObjs));
    }
    
    useEffect(()=>{
        getWorkspaceManagersData();
    },[]);

    const workspaceManagers = useSelector(state=>state.getWorkspaceManagersData.data);
//     const SearchWorkspaceManagers = useSelector((state) => state.SearchProjectCards.data);

const handleRemoveWorkspaceManager = async(userid)=>{
   
        const projectObj = new RemoveWorkspaceManagerAPI(1, {ids:[userid]},);
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
                message: "Successfully Removed",
                variant: "success",
            })
            getWorkspaceManagersData();
        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
    }

// const workspaceManagers = [
//     {
//         "id": 2,
//         "username": "shoonya_prediction",
//         "email": "prediction@ai4bharat.org",
//         "first_name": "Shoonya",
//         "last_name": "Prediction",
//         "role": 6,
//         "has_accepted_invite": false
//     },
//     {
//         "id": 10,
//         "username": "Janki",
//         "email": "jankinawale01@gmail.com",
//         "first_name": "",
//         "last_name": "",
//         "role": 5,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 110,
//         "username": "test_manager",
//         "email": "test_manager@ai4bharat.org",
//         "first_name": "DummyManager",
//         "last_name": "DemoManager",
//         "role": 4,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 111,
//         "username": "test_annotator1",
//         "email": "test_annotator1@ai4bharat.org",
//         "first_name": "Test Annotator1",
//         "last_name": "",
//         "role": 5,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 112,
//         "username": "test_annotator2",
//         "email": "test_annotator2@ai4bharat.org",
//         "first_name": "Demo",
//         "last_name": "Annoator 2",
//         "role": 4,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 190,
//         "username": "GokulNC",
//         "email": "gokulnc@ai4bharat.org",
//         "first_name": "",
//         "last_name": "",
//         "role": 6,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 9,
//         "username": "Ishvinder",
//         "email": "ishvinder@ai4bharat.org",
//         "first_name": "Ishvinder",
//         "last_name": "Sethi",
//         "role": 6,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 520,
//         "username": "Vignesh",
//         "email": "vignesh.vn.nagarajan@gmail.com",
//         "first_name": "",
//         "last_name": "",
//         "role": 4,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 521,
//         "username": "sakshijoshi",
//         "email": "sakshijcom@gmail.com",
//         "first_name": "",
//         "last_name": "",
//         "role": 6,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 523,
//         "username": "AllanPais",
//         "email": "21f1001663@ds.study.iitm.ac.in",
//         "first_name": "",
//         "last_name": "",
//         "role": 3,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 42,
//         "username": "Aparna",
//         "email": "aparna@ai4bharat.org",
//         "first_name": "Aparna",
//         "last_name": "A",
//         "role": 6,
//         "has_accepted_invite": true
//     },
//     {
//         "id": 1,
//         "username": "shoonya",
//         "email": "shoonya@ai4bharat.org",
//         "first_name": "Admin",
//         "last_name": "AI4B",
//         "role": 6,
//         "has_accepted_invite": false
//     }
// ]
    const pageSearch = () => {

        return workspaceManagers.filter((el) => {

            if (SearchWorkspaceManagers == "") {

                return el;
            } else if (
                el.username
                    ?.toLowerCase()
                    .includes(SearchWorkspaceManagers?.toLowerCase())
            ) {

                return el;
            } else if (
                el.email
                    ?.toLowerCase()
                    .includes(SearchWorkspaceManagers?.toLowerCase())
            ) {

                return el;
            }
        })
    }
    const columns = [
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align : "center",
                setCellHeaderProps: sort => ({ style: { height: "70px",  padding: "16px" } }),
            }
        },
        {
            name: "Email",
            label: "Email",
            options: {
                filter: false,
                sort: false,
                align : "center"
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
       
        // const data = [
        //     ["Shoonya User", "user123@tarento.com", 0, ]
        // ];

        const data =  workspaceManagers &&  workspaceManagers.length > 0 ? pageSearch().map((el,i)=>{
            return [
                el.username, 
                el.email,
               <>
                <Link href={`/profile`} style={{ textDecoration: "none" }}>
                    <CustomButton
                        sx={{borderRadius : 2,marginRight: 2}}
                        label = "View"
                        onClick={()=>{router.push(`/profile/`)}}

                    />
                   
                </Link>
                 <CustomButton
                 sx={{borderRadius : 2,backgroundColor:"#cf5959"}}
                 label = "Remove"
                 onClick={()=>{setElId(el.id); setElEmail(el.email); setConfirmationDialog(true);}}
             />
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
            handleRemoveWorkspaceManager(elId);
            setConfirmationDialog(false);
          }else{
            window.alert("Invalid credentials, please try again");
            console.log(rsp_data);
          }
        };

    return (
        <div>
            {renderSnackBar()}
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

export default ManagersTable;
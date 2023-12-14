// MembersTable

import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import CustomButton from "../common/Button";
import UserMappedByRole from "../../../utils/UserMappedByRole";
import { PersonAddAlt } from "@mui/icons-material";
import addUserTypes from "../../Constants/addUserTypes/index";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider, Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText } from "@mui/material";
import tableTheme from "../../../themes/tableTheme";
import CustomizedSnackbars from "../common/Snackbar";
import Search from "../common/Search";
import UserRolesList from "../../../utils/UsersRolesList";;
import userRoles from "../../../utils/Role";
import TextField from '@mui/material/TextField';

const columns = [
  {
    name: "Name",
    label: "Name",
    options: {
      filter: false,
      sort: false,
      align: "center",
      setCellHeaderProps: (sort) => ({
        style: { height: "70px", padding: "16px" },
      }),
    },
  },
  {
    name: "Email",
    label: "Email",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "Role",
    label: "Role",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "Actions",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
    },
  },
];

const options = {
  filterType: "checkbox",
  selectableRows: "none",
  download: false,
  filter: false,
  print: false,
  search: false,
  viewColumns: false,
  jumpToPage: true,
};

const addLabel = {
  organization: "Invite Users to Organization",
  [addUserTypes.PROJECT_ANNOTATORS]: "Add Annotators to Project",
  [addUserTypes.PROJECT_REVIEWER]: "Add Reviewers to Project",
  [addUserTypes.PROJECT_SUPERCHECKER]: "Add SuperChecker to Project",
};


const MembersTable = (props) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  // const { orgId, id } = useParams();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(false);
  const {
    // dataSource,
    hideButton,
    // onRemoveSuccessGetUpdatedMembers,
    reSendButton,
  } = props;
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [btn,setbtn] = useState(null);
  const [value,setvalue] = useState();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userType, setUserType] = useState(Object.keys(UserRolesList)[0]);


  const dataSource= [
    {
        "id": 94,
        "username": "drrsuresha",
        "email": "drrsuresha@gmail.com",
        "first_name": "Dr. Suresha",
        "last_name": "R",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 151,
        "username": "Pramodini Pradhan",
        "email": "pramodinip@gmail.com",
        "first_name": "Pramodini",
        "last_name": "Pradhan",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 72,
        "username": "Srija",
        "email": "srmukh@gmail.com",
        "first_name": "Srija",
        "last_name": "Mukherjee",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 100,
        "username": "Devanga",
        "email": "debangapallav4u@gmail.com",
        "first_name": "Devanga Pallav",
        "last_name": "Saikia",
        "role": 4,
        "has_accepted_invite": true
    },
    {
        "id": 203,
        "username": "saee",
        "email": "saeekodolikar@gmail.com",
        "first_name": "Saee",
        "last_name": "Kodolikar",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 319,
        "username": "AG Datta",
        "email": "translatortel2@gmail.com",
        "first_name": "",
        "last_name": "",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 396,
        "username": "NDM",
        "email": "narayanduttmishra@ai4bharat.org",
        "first_name": "",
        "last_name": "",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 356,
        "username": "Shivakumar Mavali",
        "email": "mavalihere@gmail.com",
        "first_name": "Shivakumar",
        "last_name": "Mavali",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 2090,
        "username": "Shakeel Ahmad",
        "email": "shakeel.ahmad@rekhta.org",
        "first_name": "",
        "last_name": "",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 316,
        "username": "Translator Gujarati - LSB",
        "email": "translatorguj1@gmail.com",
        "first_name": "",
        "last_name": "",
        "role": 2,
        "has_accepted_invite": true
    },
    {
        "id": 139,
        "username": "Vrinda",
        "email": "vrinda0606@gmail.com",
        "first_name": "VRINDA",
        "last_name": "SARKAR",
        "role": 3,
        "has_accepted_invite": true
    },
    {
        "id": 375,
        "username": "Naresh Kapadia",
        "email": "nareshkkapadia@gmail.com",
        "first_name": "Naresh",
        "last_name": "Kapadia",
        "role": 3,
        "has_accepted_invite": true
    },
    {
        "id": 339,
        "username": "Karuna Vempati",
        "email": "karunajk@gmail.com",
        "first_name": "Karuna",
        "last_name": "Vempati",
        "role": 3,
        "has_accepted_invite": true
    },
    {
        "id": 218,
        "username": "JayaSaraswati",
        "email": "jaya.saraswati@gmail.com",
        "first_name": "Jaya",
        "last_name": "Saraswati",
        "role": 4,
        "has_accepted_invite": true
    }]
    const loggedInUserData= {
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
  };
  const pageSearch = () => {
    return dataSource.filter((el) => {

        return el;
    });
  };



  const data =
    dataSource && dataSource.length > 0
      ? pageSearch().map((el, i) => {
          const userRole = el.role && UserMappedByRole(el.role).element;

          return [
            el.username,
            el.email,
            userRole ? userRole : el.role,
            <>
              <CustomButton
                sx={{ p: 1, borderRadius: 2 }}
                onClick={() => {
                  navigate(`/profile/${el.id}`);
                }}
                label={"View"}
              />

              {(userRoles.WorkspaceManager === loggedInUserData?.role || userRoles.OrganizationOwner === loggedInUserData?.role || userRoles.Admin === loggedInUserData?.role && props.type === addUserTypes.PROJECT_ANNOTATORS) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); setMemberOrReviewer("member");}}
                //   disabled={projectlist(el.id)|| ProjectDetails.is_archived}
                />
              )}
              {userRoles.WorkspaceManager === loggedInUserData?.role || userRoles.OrganizationOwner === loggedInUserData?.role || userRoles.Admin === loggedInUserData?.role && (props.type === addUserTypes.PROJECT_REVIEWER) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); setMemberOrReviewer("reviewer");}}
                //   disabled={projectlist(el.id)|| ProjectDetails.is_archived}
                />
              )}
              {userRoles.WorkspaceManager === loggedInUserData?.role || userRoles.OrganizationOwner === loggedInUserData?.role || userRoles.Admin === loggedInUserData?.role && (props.type === addUserTypes.PROJECT_SUPERCHECKER) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); setMemberOrReviewer("superchecker");}}
                //   disabled={projectlist(el.id)|| ProjectDetails.is_archived}
                />
              )}

      

              {reSendButton && (
                <CustomButton
                  sx={{ p: 1, m: 1, borderRadius: 2 }}
                  onClick={() => handleResendUser(el.email)}
                  label={"Resend"}
                />
              )}

              
            </>,
          ];
        })
      : [];
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
  const [pin, setPin] = useState("");
  const [memberOrReviewer, setMemberOrReviewer] = useState("");
  const handleConfirm = async () => {
    if (memberOrReviewer === "member" || memberOrReviewer === "reviewer"){
      const apiObj = new LoginAPI(emailId, password);
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });
      const rsp_data = await res.json();
      if (res.ok) {
        if(memberOrReviewer === "member"){
        handleProjectMember(elId);
      }else if(memberOrReviewer === "reviewer"){
        handleProjectReviewer(elId);
      }
        setConfirmationDialog(false);
      }else{
        window.alert("Invalid credentials, please try again");
        console.log(rsp_data);
      }}
    else if(memberOrReviewer === "superchecker"){
      if(pin === "0104"){
        handleProjectReviewer(elId);
        setConfirmationDialog(false);
      }else{
        window.alert("Incorrect pin entered");
      }
    }
  };
  return (
    <React.Fragment>
      {userRole !== 1 && !hideButton ? (
        <CustomButton
          sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
          startIcon={<PersonAddAlt />}
          label={props.type ? addLabel[props.type] : "Add Users"}
          fullWidth
        />
      ) : null}

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
                    {elEmail} will be removed from this project. Please be careful as
                    this action cannot be undone.
                  </DialogContentText>
                {(memberOrReviewer === "member" || memberOrReviewer === "reviewer") &&
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPassword(e.target.value)}
                  />}
                  {memberOrReviewer === "superchecker" &&
                  <TextField
                    autoFocus
                    margin="dense"
                    id="pin"
                    label="Pin"
                    type="pin"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPin(e.target.value)}
                  />}
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
  
     
      {renderSnackBar()}
        <Grid sx={{ mb: 1 }}>
          <Search />
        </Grid>

      <ThemeProvider theme={tableTheme} sx={{ marginTop: "20px" }}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
          // filter={false}
        />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default MembersTable;

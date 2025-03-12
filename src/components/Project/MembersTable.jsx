import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from 'next/dynamic';
import CustomButton from "../common/Button";
import { useNavigate, useParams } from "react-router-dom";
import UserMappedByRole from "../../utils/UserMappedByRole";
import { PersonAddAlt } from "@mui/icons-material";
import addUserTypes from "../../Constants/addUserTypes/index";
import AddUsersDialog from "../common/AddUsersDialog";
import InviteUsersDialog from "../Project/InviteUsersDialog";
import {
  ThemeProvider,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  MenuItem,
  Select,
  TablePagination,
  Box,
  Skeleton
} from "@mui/material";
import tableTheme from "../../themes/tableTheme";
import CustomizedSnackbars from "../common/Snackbar";
import Search from "../common/Search";
import UserRolesList from "../../utils/UsersRolesList";
import userRoles from "@/utils/UserMappedByRole/Roles";
import TextField from "@mui/material/TextField";
import { fetchRemoveProjectMember } from "@/Lib/Features/projects/RemoveProjectMember";
import RemoveProjectReviewerAPI from "@/app/actions/api/Projects/RemoveProjectReviewerAPI";
import ResendUserInviteAPI, {
  fetchResendUserInvite,
} from "@/app/actions/api/Projects/ResendUserInvite";
import InviteUsersToOrgAPI from "@/app/actions/api/user/InviteUsersToOrgAPI";
import { fetchOrganizationUsers } from "@/Lib/Features/getOrganizationUsers";
import LoginAPI from "@/app/actions/api/user/Login";
import RemoveFrozenUserAPI from "@/app/actions/api/Projects/RemoveFrozenUserAPI";
import RejectManagerSuggestionsAPI from "@/app/actions/api/user/RejectManagerSuggestions";
import ApproveManagerSuggestions from "@/app/actions/api/user/ApproveManagerSuggestions";
import Spinner from "@/components/common/Spinner";
import APITransport from "@/Lib/apiTransport/apitransport";

const MUIDataTable = dynamic(
  () => import('mui-datatables'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        variant="rectangular"
        height={400}
        sx={{
          mx: 2,
          my: 3,
          borderRadius: '4px',
          transform: 'none'
        }}
      />
    )
  }
);

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
  const [displayWidth, setDisplayWidth] = useState(0);
  const { orgId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState();
  const {
    dataSource,
    hideButton,
    onRemoveSuccessGetUpdatedMembers,
    reSendButton,
    showInvitedBy,
    approveButton,
    rejectButton,
    hideViewButton,
  } = props;
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [btn, setbtn] = useState(null);
  const [value, setvalue] = useState();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userType, setUserType] = useState(Object.keys(UserRolesList)[0]);
  const userDetails = useSelector((state) => state.getProjectDetails.data);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const SearchWorkspaceMembers = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);

  useEffect(() => {
      const handleResize = () => {
        setDisplayWidth(window.innerWidth);
      };
  
      if (typeof window !== 'undefined') {
        handleResize();
        window.addEventListener('resize', handleResize);
      }
  
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', handleResize);
        }
      };
    }, []);

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
        setCellProps: () => ({ 
          style: {
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
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
        setCellProps: () => ({ 
          style: {
          padding: "16px",
        } 
        }),
      },
    },
  ];

  if (showInvitedBy) {
    columns.splice(3, 0, {
      name: "Invited By",
      label: "Invited By",
      options: {
        filter: false,
        sort: false,
      },
    });
  }
  const pageSearch = () => {
    return dataSource.filter((el) => {
      if (SearchWorkspaceMembers == "") {
        return el;
      } else if (
        el.username
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      }
    });
  };
  const handleApproveUser = async (userId) => {
    const projectObj = new ApproveManagerSuggestions(userId);

    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
      payload: projectObj.getPayload(),
    });
    const resp = await res.json();

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.detail,
        variant: "error",
      });
    }
  };

  const handleRejectUser = (userId) => {
    const projectObj = new RejectManagerSuggestionsAPI(userId);
    const res = fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
      payload: projectObj.getPayload(),
    });
    res
      .then((res) => res.json())
      .then((resp) => {
        if (res.ok) {
          setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "success",
          });
        } else {
          setSnackbarInfo({
            open: true,
            message: resp?.detail,
            variant: "error",
          });
        }
      });
  };

  useEffect(() => {
    userDetails && setUserRole(userDetails.role);
  }, []);

  const handleUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const handleUserDialogOpen = () => {
    setAddUserDialogOpen(true);
  };

  const handleProjectMember = async (userid) => {
    dispatch(fetchRemoveProjectMember({ projectId: id, projectObj: [userid] }));
    const projectObj = new RemoveProjectReviewerAPI(id, { ids: [userid] });
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
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
  const handleProjectReviewer = async (Projectid) => {
    let projectObj;
    if (props.type === addUserTypes.PROJECT_REVIEWER) {
      projectObj = new RemoveProjectReviewerAPI(
        id,
        { ids: [Projectid] },
        props.type,
      );
    } else if (props.type === addUserTypes.PROJECT_SUPERCHECKER) {
      projectObj = new RemoveProjectReviewerAPI(
        id,
        { ids: [Projectid] },
        props.type,
      );
    }
    // dispatch(APITransport(projectObj));
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

  const handleResendUser = async (email) => {
    const projectObj = new ResendUserInviteAPI((email = [email]));

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
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const addBtnClickHandler = async () => {
    setLoading(true);
    const userRoleNumber = userRoles[userType];
    const userRoleString = userRoleNumber.toString();

    const addMembersObj = new InviteUsersToOrgAPI(
      orgId,
      selectedUsers,
      userRoleString,
    );
    const res = await fetch(addMembersObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(addMembersObj.getBody()),
      headers: addMembersObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      dispatch(fetchOrganizationUsers({ id: orgId }));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    handleUserDialogClose();
    setLoading(false);
    setSelectedUsers([]);
    setSelectedEmails([]);
    setCsvFile(null);
    setbtn(null);
    setUserType(Object.keys(UserRolesList)[0]);
  };
  const handleRemoveFrozenUsers = async (FrozenUserId) => {
    const projectObj = new RemoveFrozenUserAPI(id, { ids: [FrozenUserId] });
    //dispatch(APITransport(projectObj));
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


  const projectlist = (el) => {
    let temp = false;
    ProjectDetails?.frozen_users?.forEach((em) => {
      if (el == em.id) {
        temp = true;
      }
    });
    return temp;
  };
  const data =
    dataSource && dataSource.length > 0
      ? pageSearch().map((el, i) => {
          const userRole = el.role && UserMappedByRole(el.role).element;

          return [
            el.username,
            el.email,
            userRole ? userRole : el.role,
            ...(showInvitedBy ? [el.invited_by] : []),
            <>
              {!hideViewButton && (
                <CustomButton
                  sx={{ m: 1, borderRadius: 2 }}
                  onClick={() => {
                    navigate(`/profile/${el.id}`);
                  }}
                  label={"View"}
                />
              )}

              {(userRoles.WorkspaceManager === loggedInUserData?.role ||
                userRoles.OrganizationOwner === loggedInUserData?.role ||
                (userRoles.Admin === loggedInUserData?.role &&
                  props.type === addUserTypes.PROJECT_ANNOTATORS)) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {
                    setElId(el.id);
                    setElEmail(el.email);
                    setConfirmationDialog(true);
                    setMemberOrReviewer("member");
                  }}
                  disabled={projectlist(el.id) || ProjectDetails.is_archived}
                />
              )}
              {userRoles.WorkspaceManager === loggedInUserData?.role ||
                userRoles.OrganizationOwner === loggedInUserData?.role ||
                (userRoles.Admin === loggedInUserData?.role &&
                  props.type === addUserTypes.PROJECT_REVIEWER && (
                    <CustomButton
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#cf5959",
                        m: 1,
                        height: "40px",
                      }}
                      label="Remove"
                      onClick={() => {
                        setElId(el.id);
                        setElEmail(el.email);
                        setConfirmationDialog(true);
                        setMemberOrReviewer("reviewer");
                      }}
                      disabled={
                        projectlist(el.id) || ProjectDetails.is_archived
                      }
                    />
                  ))}
              {userRoles.WorkspaceManager === loggedInUserData?.role ||
                userRoles.OrganizationOwner === loggedInUserData?.role ||
                (userRoles.Admin === loggedInUserData?.role &&
                  props.type === addUserTypes.PROJECT_SUPERCHECKER && (
                    <CustomButton
                      sx={{
                        borderRadius: 2,
                        backgroundColor: "#cf5959",
                        m: 1,
                        height: "40px",
                      }}
                      label="Remove"
                      onClick={() => {
                        setElId(el.id);
                        setElEmail(el.email);
                        setConfirmationDialog(true);
                        setMemberOrReviewer("superchecker");
                      }}
                      disabled={
                        projectlist(el.id) || ProjectDetails.is_archived
                      }
                    />
                  ))}

              {projectlist(el.id) && (
                <CustomButton
                  sx={{m:1, borderRadius: 2 }}
                  label="Add"
                  onClick={() => handleRemoveFrozenUsers(el.id)}
                  disabled={ProjectDetails.is_archived}
                />
              )}

              {reSendButton && (
                <CustomButton
                  sx={{m:1,  borderRadius: 2 }}
                  onClick={() => handleResendUser(el.email)}
                  label={"Resend"}
                />
              )}

              {approveButton && (
                <CustomButton
                  sx={{  m: 1, borderRadius: 2 }}
                  onClick={() => handleApproveUser(el.id)}
                  label={"Approve"}
                />
              )}
              {rejectButton && (
                <CustomButton
                  sx={{
                    
                    m: 1,
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                  }}
                  color="error"
                  onClick={() => handleRejectUser(el.id)}
                  label={"Reject"}
                />
              )}
            </>,
          ];
        })
      : [];

      const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap", 
              justifyContent: { 
                xs: "space-between", 
                md: "flex-end" 
              }, 
              alignItems: "center",
              padding: "10px",
              gap: { 
                xs: "10px", 
                md: "20px" 
              }, 
            }}
          >
      
            {/* Pagination Controls */}
            <TablePagination
              component="div"
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => changePage(newPage)}
              onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
              sx={{
                "& .MuiTablePagination-actions": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
                marginRight: "10px",
              },
              }}
            />
      
            {/* Jump to Page */}
            <div>
              <label style={{ 
                marginRight: "5px", 
                fontSize:"0.83rem", 
              }}>
              Jump to Page:
              </label>
              <Select
                value={page + 1}
                onChange={(e) => changePage(Number(e.target.value) - 1)}
                sx={{
                  fontSize: "0.8rem",
                  padding: "4px",
                  height: "32px",
                }}
              >
                {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Box>
        );
      };
      
    
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
    responsive: "vertical",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),


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
  const [loading, setLoading] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [elEmail, setElEmail] = useState("");
  const [elId, setElId] = useState("");
  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [memberOrReviewer, setMemberOrReviewer] = useState("");
  const handleConfirm = async () => {
    if (memberOrReviewer === "member" || memberOrReviewer === "reviewer") {
      const apiObj = new LoginAPI(emailId, password);
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });
      const rsp_data = await res.json();
      if (res.ok) {
        if (memberOrReviewer === "member") {
          handleProjectMember(elId);
        } else if (memberOrReviewer === "reviewer") {
          handleProjectReviewer(elId);
        }
        setConfirmationDialog(false);
      } else {
        window.alert("Invalid credentials, please try again");
      }
    } else if (memberOrReviewer === "superchecker") {
      if (pin === "0104") {
        handleProjectReviewer(elId);
        setConfirmationDialog(false);
      } else {
        window.alert("Incorrect pin entered");
      }
    }
  };

  return (
    <React.Fragment>
      {loggedInUserData?.role !== 1 && !hideButton ? (
        <CustomButton
          sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
          startIcon={<PersonAddAlt />}
          label={props.type ? addLabel[props.type] : "Add Users"}
          fullWidth
          onClick={handleUserDialogOpen}
          disabled={
            props.type === addUserTypes.PROJECT_ANNOTATORS ||
            props.type === addUserTypes.PROJECT_REVIEWER ||
            props.type === addUserTypes.PROJECT_SUPERCHECKER
              ? ProjectDetails.is_archived
              : ""
          }
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
          {(memberOrReviewer === "member" ||
            memberOrReviewer === "reviewer") && (
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
          )}
          {memberOrReviewer === "superchecker" && (
            <TextField
              autoFocus
              margin="dense"
              id="pin"
              label="Pin"
              type="pin"
              fullWidth
              variant="standard"
              onChange={(e) => setPin(e.target.value)}
            />
          )}
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

      {props.type === "organization" ? (
        <InviteUsersDialog
          handleDialogClose={handleUserDialogClose}
          isOpen={addUserDialogOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          userType={userType}
          setUserType={setUserType}
          addBtnClickHandler={() => addBtnClickHandler()}
          loading={loading}
          selectedEmails={selectedEmails}
          setSelectedEmails={setSelectedEmails}
          csvFile={csvFile}
          setCsvFile={setCsvFile}
          btn={btn}
          setbtn={setbtn}
          value={value}
          setvalue={setvalue}
        />
      ) : (
        <AddUsersDialog
          handleDialogClose={handleUserDialogClose}
          isOpen={addUserDialogOpen}
          userType={props.type}
          id={id}
        />
      )}
      {renderSnackBar()}
      <Grid sx={{ mt: 2,mb:2 }}>
        <Search />
      </Grid>

      <ThemeProvider theme={tableTheme} sx={{ marginTop: "20px" }}>
        <MUIDataTable
        key={`table-${displayWidth}`}
          title={""}
          data={data}
          columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
          }}
        />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default MembersTable;

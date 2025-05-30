import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import UserMappedByRole from "../../utils/UserMappedByRole";
import CustomButton from "../common/Button";
import { ThemeProvider, Grid, Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText, Box, TablePagination, Select, MenuItem ,Skeleton} from "@mui/material";
import tableTheme from "../../themes/tableTheme";
import RemoveWorkspaceMemberAPI from "@/app/actions/api/workspace/RemoveWorkspaceMemberAPI";
import Search from "../common/Search";
import RemoveWorkspaceFrozenUserAPI from "@/app/actions/api/workspace/RemoveWorkspaceFrozenUserAPI";
import TextField from '@mui/material/TextField';
import LoginAPI from "@/app/actions/api/user/Login";
import { fetchWorkspacesAnnotatorsData } from "../../Lib/Features/getWorkspacesAnnotatorsData";

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

const AnnotatorsTable = (props) => {
  const dispatch = useDispatch();
  const { onRemoveSuccessGetUpdatedMembers } = props;
  const [displayWidth, setDisplayWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const orgId = useSelector(state => state.getWorkspaceProjectData?.data?.[0]?.organization_id);
  const SearchWorkspaceMembers = useSelector((state) => state.searchProjectCard?.searchValue);


  const workspaceAnnotators = useSelector(state => state.getWorkspacesAnnotatorsData.data);
  const workspaceDtails = useSelector(state => state.getWorkspaceDetails.data);
  /* eslint-disable react-hooks/exhaustive-deps */


  useEffect(() => {
    dispatch(fetchWorkspacesAnnotatorsData({ workspaceId: id }));
  }, []);

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

  const handleRemoveWorkspaceMember = async (Projectid) => {
    const workspacedata = {
      user_id: Projectid,
    }
    const projectObj = new RemoveWorkspaceMemberAPI(id, workspacedata);
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

      if (SearchWorkspaceMembers == "") {

        return el;
      } else if (
        el.username
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {

        return el;
      } else if (
        el.email
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {

        return el;
      }


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
        display: "excluded",
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
        align: "center",
        setCellProps: () => ({
          style: {
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
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

  const projectlist = (el) => {
    let temp = false;
    workspaceDtails?.frozen_users?.forEach((em) => {
      if (el == em.id) {
        temp = true;
      }
    });
    return temp;
  };



  const data = workspaceAnnotators && workspaceAnnotators.length > 0 ? pageSearch().map((el, i) => {
    const userRole = el.role && UserMappedByRole(el.role)?.element;
    return [
      el.id,
      el.username,
      el.email,
      userRole ? userRole : el.role,
      <>
        <Link to={`/profile/${el.id}`} style={{ textDecoration: "none" }}>
          <CustomButton
            sx={{ m: 1, borderRadius: 2, marginRight: 2 }}
            label="View"
          />

        </Link>
        <CustomButton
          sx={{ m: 1, borderRadius: 2, backgroundColor: "#cf5959", mr: 2 }}
          label="Remove"
          onClick={() => { setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); }}
          disabled={projectlist(el.id)}
        />
        {projectlist(el.id) && (
          <CustomButton
            sx={{ m: 1, borderRadius: 2 }}
            label="Add"
            onClick={() => handleRemoveFrozenUsers(el.id)}
          />)}
      </>
    ]
  }) : [];
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
            fontSize: "0.83rem",
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
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
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


  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [elEmail, setElEmail] = useState("");
  const [elId, setElId] = useState("");
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
      handleRemoveWorkspaceMember(elId)
      setConfirmationDialog(false);
    } else {
      window.alert("Invalid credentials, please try again");
    }
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
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          key={`table-${displayWidth}`}
          data={data}
          columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
          }}
        />
      </ThemeProvider>
    </div>

  )
}

export default AnnotatorsTable;

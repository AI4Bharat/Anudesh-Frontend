import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import { useNavigate } from "react-router-dom";
import dynamic from 'next/dynamic';
import {
  ThemeProvider,

} from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import TablePagination from '@mui/material/TablePagination';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from "@mui/material/Skeleton";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import tableTheme from "../../themes/tableTheme";
import Search from "../common/Search";
import {
  fetchGuestWorkspaceData,
  addAuthenticatedWorkspace,
} from "@/Lib/Features/getGuestWorkspaces";
import CustomizedSnackbars from "@/components/common/Snackbar";
import AuthenticateToWorkspaceAPI from "@/app/actions/api/workspace/AuthenticateToWorkspaceAPI";

import ProjectList from "@/app/ui/pages/projects/project";
import Spinner from "@/components/common/Spinner";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

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


const GuestWorkspaceTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showManager, showCreatedBy } = props;
  const [open, setOpen] = useState(false);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [currentWorkspaceName, setCurrentWorkspaceName] = useState("");
  const [currentWorkspaceId, setWorkspaceCurrentId] = useState("");
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [filteredProjects, setFilteredProjects] = useState(null);
  const [loading, setLoading] = useState(false);

  const guestWorkspaceData = useSelector(
    (state) => state.getGuestWorkspaces?.data
  );
  const SearchWorkspace = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const authenticatedWorkspaces = useSelector(
    (state) => state.getGuestWorkspaces?.authenticatedWorkspaces
  );

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

  useEffect(() => {
    dispatch(fetchGuestWorkspaceData(currentPageNumber));
  }, [currentPageNumber, dispatch]);

  useEffect(() => {
    dispatch(fetchGuestWorkspaceData(currentPageNumber));
  }, []);

  const apiLoading = useSelector(
    (state) => state.getGuestWorkspaces.status === "loading"
  );

  const handleOpen = (workspace_name, workspace_id) => {
    setPassword("");
    setWorkspaceCurrentId(workspace_id);
    setCurrentWorkspaceName(workspace_name);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmitPassword = async () => {
    const body = {
      workspace_password: password,
    };

    const AuthenticationObj = new AuthenticateToWorkspaceAPI(currentWorkspaceId, body);
    const res = await fetch(AuthenticationObj.apiEndPoint(), {
        method: "PUT",
        body: JSON.stringify(AuthenticationObj.getBody()),
        headers: AuthenticationObj.getHeaders().headers,
    }
    );
    if(!res.ok) {
      handleClose();
      setSnackbarInfo({
        open: true,
        message: "something went wrong",
        variant: "error",
      });    } else {
        handleClose();
      setSnackbarInfo({
        open: true,
        message: "Successfully Authenticated",
        variant: "success",
      });
      dispatch(addAuthenticatedWorkspace(currentWorkspaceId)); 
    }
  };
  const handleViewWorkspace = (workspaceId) => {
    navigate(`/guest_workspaces/${workspaceId}`);
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

  const pageSearch = () => {
    return guestWorkspaceData.filter((el) => {
      if (SearchWorkspace == "") {
        return el;
      } else if (
        el.workspace_name
          ?.toLowerCase()
          .includes(SearchWorkspace?.toLowerCase())
      ) {
        return el;
      } else if (
        el.managers?.some((val) =>
          val.username?.toLowerCase().includes(SearchWorkspace?.toLowerCase()),
        )
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "id",
      label: "Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ 
          style: {
            height: "70px", fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
      },
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({ 
          style: {
            height: "70px", fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
      },
    },
    {
      name: "Manager",
      label: "Manager",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: showManager ? "true" : "exclude",
        setCellProps: () => ({ 
          style: {
            height: "70px", fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
      },
    },
    {
      name: "Created By",
      label: "Created By",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: showCreatedBy ? "true" : "exclude",
        setCellProps: () => ({ 
          style: {
            height: "70px", fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
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
            height: "70px", fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
      },
    },
  ];

  const data =
    guestWorkspaceData && guestWorkspaceData.length > 0
      ? pageSearch().map((el, i) => {
          const isAuthenticated =
          el.is_autheticated || authenticatedWorkspaces.includes(el.id);
          return [
            el.id,
            el.workspace_name,
            el.managers
              .map((manager, index) => {
                return manager.username;
              })
              .join(", "),
            el.created_by && el.created_by.username,
            <CustomButton
            key={i}
            sx={{ borderRadius: 2 }}
            label={isAuthenticated ? "View" : "Authenticate"}
            onClick={
              isAuthenticated
                ? () => handleViewWorkspace(el.id)
                : () => handleOpen(el.workspace_name, el.id)
            }
          />,
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

  return (
    <div>
      {loading || apiLoading ? (
        <Spinner />
      ) : filteredProjects ? (
        <ProjectList data={filteredProjects} />
      ) : (
        <>
      {renderSnackBar()}
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>

      <ThemeProvider theme={tableTheme}>
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
      
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <FormControl>
              <InputLabel htmlFor="my-input">Enter Password</InputLabel>
              <Input
                id="my-input"
                type={showPassword ? "text" : "password"}
                aria-describedby="enter-password"
                value={password}
                onChange={handlePasswordChange}
                endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                }
              />
              <FormHelperText id="enter-password">
                To enter{" "}
                <Typography
                  component="span"
                  fontWeight="bold"
                  fontSize={"12px"}
                >
                  {currentWorkspaceName}
                </Typography>{" "}
                workspace you must type in the password.
              </FormHelperText>
              <CustomButton
                sx={{ borderRadius: 2, marginTop: "2rem" }}
                label="Enter"
                onClick={handleSubmitPassword}
              />
            </FormControl>
          </Box>
        </Fade>
      </Modal>
      </>
      )}
    </div>
  );
};

export default GuestWorkspaceTable;

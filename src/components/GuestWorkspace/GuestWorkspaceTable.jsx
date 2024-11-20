import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import {
  ThemeProvider,
  Grid,
  Modal,
  Fade,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Box,
  Backdrop,
  Typography,
  IconButton,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import tableTheme from "../../themes/tableTheme";
import Search from "../common/Search";
import {
  fetchGuestWorkspaceData,
  addAuthenticatedWorkspace,
} from "@/Lib/Features/getGuestWorkspaces";
import { fetchProjects } from "@/Lib/Features/projects/getProjects";
import CustomizedSnackbars from "@/components/common/Snackbar";
import AuthenticateToWorkspaceAPI from "@/app/actions/api/workspace/AuthenticateToWorkspaceAPI";
import { store } from "@/Lib/Store";
import ProjectList from "@/app/ui/pages/projects/project";
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

const GuestWorkspaceTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showManager, showCreatedBy } = props;
  const [open, setOpen] = useState(false);
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
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalWorkspaces, setTotalWorkspaces] = useState(10);
  const [filteredProjects, setFilteredProjects] = useState(null); // Added state for filtered projects

  // const totalWorkspaceCount = useSelector(state => state.getGuestWorkspace.data.count);

  const guestWorkspaceData = useSelector(
    (state) => state.getGuestWorkspaces?.data
  );
  const SearchWorkspace = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const authenticatedWorkspaces = useSelector(
    (state) => state.getGuestWorkspaces?.authenticatedWorkspaces
  );

  const authenticatedWorkspaces1 = useSelector(
    (state) => console.log(state)
    
  );
  const handleOpen = (workspace_name, workspace_id) => {
    setPassword("");
    setWorkspaceCurrentId(workspace_id);
    setCurrentWorkspaceName(workspace_name);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(fetchGuestWorkspaceData(currentPageNumber));
  }, [currentPageNumber, dispatch]);

  useEffect(() => {
    dispatch(fetchGuestWorkspaceData(currentPageNumber));
  }, []);

  
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
    const resData = await res.json();
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
    dispatch(fetchProjects({ selectedFilters: {}, guestworkspace: true })).then(() => {
      const state = store.getState().getProjects.data || {};
      const includedProjects = state.included_projects || [];
      const excludedProjects = state.excluded_projects || [];
  
      const filteredIncludedProjects = includedProjects.filter(
        (project) => project.workspace_id === workspaceId
      );
      const filteredExcludedProjects = excludedProjects.filter(
        (project) => project.workspace_id === workspaceId
      );
  
      const filteredProjects = {
        included_projects: filteredIncludedProjects,
        excluded_projects: filteredExcludedProjects,
      };
  
      setFilteredProjects(filteredProjects);
      console.log(filteredProjects);
    });
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
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
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
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
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
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
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
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
        }),
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

  const data =
    guestWorkspaceData && guestWorkspaceData.length > 0
      ? pageSearch().map((el, i) => {
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
            label={
              authenticatedWorkspaces.includes(el.id)
                ? "View"
                : "Authenticate"
            }
            onClick={
              authenticatedWorkspaces.includes(el.id)
                ? () => handleViewWorkspace(el.id)
                : () => handleOpen(el.workspace_name, el.id)
            }
          />,
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

  return (
    <div>
            {filteredProjects ? (
        <ProjectList data={filteredProjects} />
      ) : (
        <>
      {renderSnackBar()}
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
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
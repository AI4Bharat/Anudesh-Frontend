import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import GetWorkspaceAPI from "@/app/actions/api/workspace/GetWorkspaceData";
import { Grid, Tooltip, Button, Dialog, DialogTitle, DialogContent, TextField, FormHelperText, Typography, IconButton, InputAdornment, DialogActions } from "@mui/material";
import APITransport from "@/Lib/apiTransport/apitransport";
import tableTheme from "../../themes/tableTheme";
import DatasetStyle from "../../styles/dataset";
import Search from "../common/Search";
// import Link from 'next/link';
import { store } from "@/Lib/Store";
import { setWorkspace } from "@/Lib/Features/GetWorkspace";
import { fetchWorkspaceData } from "@/Lib/Features/GetWorkspace";
import Spinner from "@/components/common/Spinner";
import { fetchProjects } from "@/Lib/Features/projects/getProjects";
import UserMappedByProjectStage from "@/utils/UserMappedByProjectStage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeProvider } from '@mui/material/styles';
import VerifyProject from "@/app/actions/api/Projects/VerifyProject";

const GuestWorkspaceTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const { showManager, showCreatedBy } = props;
  const { id } = useParams();
  const workspaceData = useSelector((state) => state.GetWorkspace.data);
  const [filteredProjects, setFilteredProjects] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', variant: '' });

  const SearchProject = useSelector(
    (state) => state.searchProjectCard?.searchValue,
  );
  const apiLoading = useSelector(
    (state) => state.GetWorkspace.status !== "succeeded",
  );  
  
  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalWorkspaces, setTotalWorkspaces] = useState(10);

  const totalWorkspaceCount = useSelector(
    (state) => state.GetWorkspace.data.count,
  );
  const combinedData = (filteredProjects?.included_projects && filteredProjects?.excluded_projects) ? filteredProjects?.excluded_projects.concat(filteredProjects?.included_projects).sort((a, b) => a.id - b.id) : filteredProjects


  useEffect(() => {
    dispatch(fetchProjects({ selectedFilters: {}, guestworkspace: true })).then(() => {
        const state = store.getState().getProjects.data || {};
        const includedProjects = state.included_projects || [];
        const excludedProjects = state.excluded_projects || [];
          
        const filteredIncludedProjects = includedProjects.filter(
          (project) => project.workspace_id == id
        );
        const filteredExcludedProjects = excludedProjects.filter(
          (project) => project.workspace_id == id
        );
    
        const filteredProjects = {
          included_projects: filteredIncludedProjects,
          excluded_projects: filteredExcludedProjects,
        };
    
        setFilteredProjects(filteredProjects);
        console.log(filteredProjects,"hello",id);
      });
  }, []);

  const pageSearch = () => {
    return combinedData.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.project_type?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id.toString()?.toLowerCase()?.includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.workspace_id
          ?.toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.tgt_language?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        UserMappedByProjectStage(el.project_stage)
          ?.name?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };
  const handleAuthOpen = (project,title) => {
    setSelectedProject(project);
    setOpenAuthDialog(true);
  };
  const handleAuthClose = () => {
    setOpenAuthDialog(false);
    setSelectedProject(null);
    setPassword("");
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordSubmit = async() => {
    console.log(selectedProject?.id);
    const apiObj = new VerifyProject(loggedInUserData?.id,selectedProject?.id,password);
    const res = await fetch(apiObj.apiEndPointAuto(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    // setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      })
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }  
    navigate(`/projects/${selectedProject?.id}`)
    handleAuthClose();
  };

  const columns = [
    {
      name: "Project_id",
      label: "Project Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Project_Title",
      label: "Project Title",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "project_Type",
      label: "Project Type",
      options: {
        filter: false,
        sort: false,
        align: "center",

        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "project_stage",
      label: "Project Stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "tgt_language",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "workspace_id",
      label: "Workspace Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px" },
        }),
      },
    },
  ];
  const data =
    combinedData && combinedData.length > 0
      ? pageSearch().map((el, i) => {
          const userRole =
            el.project_stage &&
            UserMappedByProjectStage(el.project_stage).element;

            const isExcluded = filteredProjects && filteredProjects.excluded_projects && filteredProjects.excluded_projects?.some(
              (excludedProject) => excludedProject.id === el.id
            );
            
    
          return [
            el.id,
            el.title,
            el.project_type,
            userRole ? userRole : el.project_stage,
            el.tgt_language == null ? "-" : el.tgt_language,
            el.workspace_id,
            loggedInUserData?.guest_user && isExcluded ? (
              <CustomButton
                key={i}
                sx={{ borderRadius: 2, marginRight: 2 }}
                label="Authenticate"
                onClick={() => handleAuthOpen(el,el.title)}
              />
            ) : (
              <Link to={`/projects/${el.id}`} style={{ textDecoration: "none" }} key={i}>
                <CustomButton
                  key={i}
                  sx={{ borderRadius: 2, marginRight: 2 }}
                  label="View"
                />
              </Link>
            ),
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
      {/* {apiLoading ? (
        <Spinner />
      ) : ( */}
        <div>
          <Grid sx={{ mb: 1 }}>
            <Search />
          </Grid>
          {filteredProjects && (
            <ThemeProvider theme={tableTheme}>
              <MUIDataTable
                title={""}
                data={data}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          )}
          
        </div>
      {/* )} */}
      <Dialog open={openAuthDialog} onClose={handleAuthClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}

          />
          <FormHelperText id="enter-password">
            To enter {" "}
            <Typography
              component="span"
              fontWeight="bold"
              fontSize={"12px"}
            >
              {selectedProject?.title}
            </Typography>{" "}
            project you must type in the password.
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAuthClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};
export default GuestWorkspaceTable;

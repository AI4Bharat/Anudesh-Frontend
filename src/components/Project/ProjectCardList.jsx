import  {React, useState, useEffect } from "react";
// import Link from 'next/link';
import { ThemeProvider } from '@mui/material/styles';
import MUIDataTable from "mui-datatables";
import CustomButton from "../common/Button";
import { Link } from "react-router-dom";
import { Grid, Tooltip, Button, Dialog, DialogTitle, DialogContent, TextField, FormHelperText, Typography, IconButton, InputAdornment } from "@mui/material";
import tableTheme from "../../themes/tableTheme";
import Search from "../common/Search";
import { useDispatch, useSelector } from "react-redux";
import ProjectFilterList from "../common/ProjectFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserMappedByProjectStage from "../../utils/UserMappedByProjectStage";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import { DialogActions } from "@mui/material";
import VerifyProject from "@/app/actions/api/Projects/VerifyProject";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ProjectCardList = (props) => {
  const { projectData, selectedFilters, setsSelectedFilters } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const loggedInUserData = useSelector(state => state.getLoggedInData?.data);
  const [showPassword, setShowPassword] = useState(false);
  const combinedData = (projectData.included_projects && projectData.excluded_projects) ? projectData.excluded_projects.concat(projectData.included_projects) : projectData

  const SearchProject = useSelector((state) => state.searchProjectCard?.searchValue);

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  


  const handleClose = () => {
    setAnchorEl(null);
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
    const apiObj = new VerifyProject(selectedProject?.id,password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
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
    navigate(`/projects/${el.id}`)
    handleAuthClose();
  };
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
  console.log(combinedData);
  const data =
    combinedData && combinedData.length > 0
      ? pageSearch().map((el, i) => {
          const userRole =
            el.project_stage &&
            UserMappedByProjectStage(el.project_stage).element;

            const isExcluded = projectData && projectData.excluded_projects && projectData.excluded_projects?.some(
              (excludedProject) => excludedProject.id === el.id
            );
    
          return [
            el.id,
            el.title,
            el.project_type,
            userRole ? userRole : el.project_stage,
            el.tgt_language == null ? "-" : el.tgt_language,
            // el.project_mode,
            el.workspace_id,
            loggedInUserData.guest_user && isExcluded ? (
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

  const renderToolBar = () => {
    return (
      <>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
        <Tooltip
      title={
        <span style={{ fontFamily: 'Roboto, sans-serif' }}>
          Filter Table
        </span>
      }
    >
      <FilterListIcon sx={{ color: '#515A5A' }} />
    </Tooltip>
        </Button>
      </>
    );
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
    customToolbar: renderToolBar,
  };

  return (
    <>
      <ThemeProvider theme={tableTheme} sx={{ mt: 4 }}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
      <ProjectFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
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

    </>
  );
};

export default ProjectCardList;
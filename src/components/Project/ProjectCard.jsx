import { Box, Grid,Button,Tooltip,Typography, Dialog, DialogTitle, TextField, FormHelperText, InputAdornment, IconButton, DialogActions, Badge } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProjectCard from "../common/ProjectCard";
import { Link, useNavigate } from "react-router-dom";
import  "../../styles/Dataset.css";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../common/TablePaginationActions";
import Spinner from "../common/Spinner";
import Search from "../common/Search";
// import searchProjectCard from "../../../../redux/actions/api/ProjectDetails/searchProjectCard";
// import Record from "../../../../assets/no-record.svg";
import ProjectFilterList from "../common/ProjectFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserMappedByProjectStage from "../../utils/UserMappedByProjectStage";
import { DialogContent } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import VerifyProject from "@/app/actions/api/Projects/VerifyProject";


const Projectcard = (props) => {
       /* eslint-disable react-hooks/exhaustive-deps */
           /* eslint-disable-next-line react/jsx-key */

  const { projectData, selectedFilters, setsSelectedFilters } = props;
  const classes = DatasetStyle();
  const SearchProject = useSelector((state) => state.searchProjectCard?.searchValue);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const combinedData = (projectData.included_projects && projectData.excluded_projects) ? projectData.excluded_projects.concat(projectData.included_projects) : projectData
  const loggedInUserData = useSelector(state => state.getLoggedInData?.data);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', variant: '' });
  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleAuthOpen = (project, title) => {
    console.log(title);
    setSelectedProject(project);
    setOpenAuthDialog(true);
  };


  const rowChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const handlePasswordSubmit = async () => {
    const apiObj = new VerifyProject(selectedProject?.id, password);
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
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    navigate(`/projects/${selectedProject?.id}`)
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
      }  else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id.toString()?.toLowerCase()?.includes(SearchProject.toLowerCase())
      ) {
        return el;
      }else if (
        el.workspace_id.toString()?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;}
        else if (
          el.tgt_language?.toLowerCase().includes(SearchProject?.toLowerCase())
        ) {
          return el;}
          else if (
            UserMappedByProjectStage(el.project_stage)
              ?.name?.toLowerCase()
              .includes(SearchProject?.toLowerCase())
          ) {
            return el;
          }
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAuthClose = () => {
    setOpenAuthDialog(false);
    setSelectedProject(null);
    setPassword("");
  };

  const areFiltersApplied = (filters) => {
    return Object.values(filters).some((value) => value !== "");
  };

  const filtersApplied = areFiltersApplied(selectedFilters);
  console.log("filtersApplied", filtersApplied);

  return (
    <React.Fragment>
      {/* <Header /> */}
      {/* {loading && <Spinner />} */}
      <Grid sx={{textAlign:"end",margin:"-20px 10px 10px 0px"}}>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
          <Badge
            color="primary"
            variant="dot"
            invisible={!filtersApplied}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
        <Tooltip title={"Filter Table"}>
          <FilterListIcon sx={{ color: "#515A5A" }} />
        </Tooltip>
      </Button>
      </Grid>
      {pageSearch().length > 0 && (
        <Box sx={{ margin: "0 auto", pb: 5 }}>
          {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
          <Grid
            container
            justifyContent={"center"}
            rowSpacing={4}
            spacing={2}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            sx={{ mb: 3 }}
          >
            {pageSearch()
              .map((el, i) => {
                return (
                  <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                    {/* <div onClick={() => handleCardClick(el)}> */}
                      <ProjectCard
                        classAssigned={
                          i % 2 === 0
                            ? classes.projectCardContainer2
                            : classes.projectCardContainer1
                        }
                        projectObj={el}
                        projectData={projectData}
                        handleAuthOpen={handleAuthOpen}
                        index={i}
                      />
                    {/* </div> */}
                  </Grid>
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          </Grid>
          <TablePagination
            component="div"
            count={pageSearch().length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[9, 18, 36, 72, { label: "All", value: -1 }]}
            onRowsPerPageChange={rowChange}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      )}
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
            To enter{" "}
            <Typography component="span" fontWeight="bold" fontSize={"12px"}>
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

    </React.Fragment>
  );
};

export default Projectcard;

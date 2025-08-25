import { React, useState, useEffect } from "react";
// import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ThemeProvider, styled } from '@mui/material/styles';
import CustomButton from "../common/Button";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
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
import InfoIcon from '@mui/icons-material/Info';
import { tooltipClasses } from '@mui/material/Tooltip';
import PullNewBatchAPI from "@/app/actions/api/Projects/PullNewBatchAPI";
import { fetchProjectDetails } from "@/Lib/Features/projects/getProjectDetails";

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

const ProjectCardList = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  /* eslint-disable-next-line react/jsx-key */
  const [loading,setLoading] = useState(false);

  const { projectData, selectedFilters, setsSelectedFilters } = props;
  const [displayWidth, setDisplayWidth] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const loggedInUserData = useSelector(state => state.getLoggedInData?.data);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', variant: '' });
  const combinedData = (projectData.included_projects && projectData.excluded_projects) ? projectData.excluded_projects.concat(projectData.included_projects).sort((a, b) => a.id - b.id) : projectData
  const navigate = useNavigate();
  const SearchProject = useSelector((state) => state.searchProjectCard?.searchValue);
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
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

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAuthOpen = (project, title) => {
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
  const fetchNewTasks = async () => {
    setLoading(true);
    const batchObj = new PullNewBatchAPI(selectedProject?.id, ProjectDetails?.metadata_json?.auto_assign_count)
    const res = await fetch(batchObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(batchObj.getBody()),
      headers: batchObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      if (resp?.message) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
            navigate(`/projects/${selectedProject?.id}`)
            handleAuthClose();
            setLoading(false);

      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
        setLoading(false)
    } 
    
    handleAuthClose();

  };
}
  const handlePasswordSubmit = async() => {
    dispatch(fetchProjectDetails(selectedProject?.id));
    const apiObj = new VerifyProject(loggedInUserData?.id,selectedProject?.id,password);
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
      fetchNewTasks()

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    handleAuthClose();

    } 
  } 

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
      name: "Project_Title",
      label: "Project Title",
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
      name: "project_Type",
      label: "Project Type",
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
      name: "project_stage",
      label: "Project Stage",
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
      name: "tgt_language",
      label: "Target Language",
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
      name: "workspace_id",
      label: "Workspace Id",
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
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
          }
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
              onClick={() => handleAuthOpen(el, el.title)}
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

  const areFiltersApplied = (filters) => {
    return Object.values(filters).some((value) => value !== "");
  };

  const filtersApplied = areFiltersApplied(selectedFilters);

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#e0e0e0',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(12),
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#e0e0e0",
    },
  }));

  const renderToolBar = () => {
    return (
      <div>
        <Button style={{ minWidth: "25px", position: "relative" }} onClick={handleShowFilter}>
          {filtersApplied && <InfoIcon color="primary" fontSize="small" sx={{ position: "absolute", top: -4, right: -4 }} />}
          <CustomTooltip
            title={
              filtersApplied ? (
                <Box style={{ fontFamily: 'Roboto, sans-serif' }} sx={{ padding: '5px', maxWidth: '300px', fontSize: '12px', display: "flex", flexDirection: "column", gap: "5px" }}>
                  {selectedFilters.project_type && <div><strong>Project Type:</strong> {selectedFilters.project_type}</div>}
                  {selectedFilters.project_user_type && <div><strong>Project User Type:</strong> {selectedFilters.project_user_type}</div>}
                  {selectedFilters.archived_projects && <div><strong>Archived Projects:</strong> {selectedFilters.archived_projects}</div>}
                </Box>
              ) : (
                <span style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Filter Table
                </span>
              )
            }
            disableInteractive
          >
            <FilterListIcon sx={{ color: '#515A5A' }} />
          </CustomTooltip>
        </Button>
      </div>
    );
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
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
    <>
    {loading && <Spinner />} 
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

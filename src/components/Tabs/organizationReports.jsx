import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import tableTheme from "../../themes/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ColumnList from "../common/ColumnList";
import Select from "@mui/material/Select";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import "../../styles/Dataset.css";
import DatasetStyle from "@/styles/dataset";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/material/styles";
import { isSameDay, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import CustomizedSnackbars from "../common/Snackbar";
import { fetchProjectDomains } from "@/Lib/Features/getProjectDomains";
import { fetchLanguages } from "@/Lib/Features/fetchLanguages";
import { fetchOrganizationUserReports } from "@/Lib/Features/projects/GetOrganizationUserReports";
import { fetchOrganizationProjectReports } from "@/Lib/Features/projects/GetOrganizationProjectReports";
import { fetchOrganizationDetailedProjectReports } from "@/Lib/Features/projects/GetOrganizationDetailedProjectReports";
import { fetchSendOrganizationUserReports } from "@/Lib/Features/projects/SendOrganizationUserReports";
import CircularProgress from "@mui/material/CircularProgress";

const TruncatedContent = styled(Box)(({ expanded }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 3,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.5em",
  maxHeight: expanded ? "9900px" : "4.5em",
  transition: "max-height 1.8s ease-in-out",
}));

const RowContainer = styled(Box)(({ expanded }) => ({
  cursor: "pointer",
  transition: "all 1.8s ease-in-out",
}));

const ProgressType = [
  "Annotation Stage",
  "Review Stage",
  "Super Check Stage",
  "All Stage",
];
const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

const participationTypesOptions = [
  { value: 1, label: "Full-time" },
  { value: 2, label: "Part-time" },
  { value: 4, label: "Contract-Basis" },
];

const MUIDataTable = dynamic(() => import("mui-datatables"), {
  ssr: false,
  loading: () => (
    <Skeleton
      variant="rectangular"
      height={400}
      sx={{
        mx: 2,
        my: 3,
        borderRadius: "4px",
        transform: "none",
      }}
    />
  ),
});

const OrganizationReports = () => {
  const OrganizationDetails = useSelector(
    (state) => state.getLoggedInData?.data.organization,
  );
  const UserDetails = useSelector((state) => state.getLoggedInData.data);
  const [selectRange, setSelectRange] = useState([
    {
      startDate: new Date(
        Date.parse(UserDetails?.date_joined, "yyyy-MM-ddTHH:mm:ss.SSSZ"),
      ),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [participationTypes, setParticipationTypes] = useState([1, 2, 4]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportRequested, setReportRequested] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [reportTypes, setReportTypes] = useState("Annotator");
  const [radioButton, setRadiobutton] = useState("ProjectReports");
  const [reportfilter, setReportfilter] = useState(["All Stage"]);
  const [projectReportType, setProjectReportType] = useState(1);
  const [statisticsType, setStatisticsType] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const { orgId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const UserReports = useSelector(
    (state) => state.GetOrganizationUserReports.data,
  );
  const ProjectReports = useSelector(
    (state) => state.getOrganizationProjectReports?.data,
  );
  const LanguageChoices = useSelector((state) => state.getLanguages?.data);

  let ProgressTypeValue = "Annotation Stage";
  const filterdata = ProgressType.filter((item) => item !== ProgressTypeValue);
  const FilterProgressType =
    reportTypes === "Reviewer" ? filterdata : ProgressType;
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [userReportsExpandedRow, setUserReportsExpandedRow] = useState(null);
  const [projectReportsExpandedRow, setProjectReportsExpandedRow] =
    useState(null);
  const [projectType, setProjectType] = useState({
    UsersReports: "InstructionDrivenChat",
    ProjectReports: "InstructionDrivenChat",
    PaymentReports: "InstructionDrivenChat",
  });
  const [targetLanguage, setTargetLanguage] = useState({
    UsersReports: "all",
    ProjectReports: "all",
  });
  const [userColumns, setUserColumns] = useState([]);
  const [projectColumns, setProjectColumns] = useState([]);
  const [userSelectedColumns, setUserSelectedColumns] = useState([]);
  const [projectSelectedColumns, setProjectSelectedColumns] = useState([]);
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    dispatch(fetchProjectDomains());
    dispatch(fetchLanguages());
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector(
          ".MuiDataTable-responsiveBase",
        );
        if (tableWrapper) {
          tableWrapper.classList.add("MuiDataTable-vertical");
        }
      }
    };

    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
    }
  }, [ProjectTypes, radioButton]);

  useEffect(() => {
    if (reportRequested) {
      if (UserReports?.length && radioButton === "UsersReports") {
        let tempColumns = [];
        const currentSelectedColumns =
          userSelectedColumns.length === 0
            ? Object.keys(UserReports[0])
            : userSelectedColumns;
        if (userSelectedColumns.length === 0) {
          setUserSelectedColumns(Object.keys(UserReports[0]));
        }

        Object.keys(UserReports[0]).forEach((key) => {
          const isSelectedColumn = currentSelectedColumns.includes(key);
          tempColumns.push({
            name: key,
            label: key,
            options: {
              filter: false,
              sort: true,
              align: "center",
              display: isSelectedColumn ? "true" : "false",
              setCellProps: () => ({
                style: {
                  padding: "16px",
                  minWidth: "250px",
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                },
              }),
              customBodyRender: (value, tableMeta) => {
                const rowIndex = tableMeta.rowIndex;
                const isExpanded = userReportsExpandedRow === rowIndex;
                return (
                  <RowContainer
                    expanded={isExpanded}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserReportsExpandedRow((prevExpanded) =>
                        prevExpanded === rowIndex ? null : rowIndex,
                      );
                    }}
                  >
                    <TruncatedContent expanded={isExpanded}>
                      {value}
                    </TruncatedContent>
                  </RowContainer>
                );
              },
            },
          });
        });
        setUserColumns(tempColumns);
      } else if (ProjectReports?.length && radioButton === "ProjectReports") {
        if (reportRequested && ProjectReports?.length) {
          let tempColumns = [];
          const currentSelectedColumns =
            projectSelectedColumns.length === 0
              ? Object.keys(ProjectReports[0])
              : projectSelectedColumns;
          if (projectSelectedColumns.length === 0) {
            setProjectSelectedColumns(Object.keys(ProjectReports[0]));
          }

          Object.keys(ProjectReports[0]).forEach((key) => {
            const isSelectedColumn = currentSelectedColumns.includes(key);
            tempColumns.push({
              name: key,
              label: key,
              options: {
                filter: false,
                sort: true,
                align: "center",
              },
              display: isSelectedColumn ? "true" : "false",
              setCellProps: () => ({
                style: {
                  padding: "16px",
                  minWidth: "250px",
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                },
              }),
              customBodyRender: (value, tableMeta) => {
                const rowIndex = tableMeta.rowIndex;
                const isExpanded = projectReportsExpandedRow === rowIndex;
                return (
                  <RowContainer
                    expanded={isExpanded}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjectReportsExpandedRow((prevExpanded) =>
                        prevExpanded === rowIndex ? null : rowIndex,
                      );
                    }}
                  >
                    <TruncatedContent expanded={isExpanded}>
                      {value}
                    </TruncatedContent>
                  </RowContainer>
                );
              },
            });
          });
          setProjectColumns(tempColumns);
        }
      }
    } else {
      if (emailRequested && UserReports?.length) {
        setSnackbarInfo({
          open: true,
          message: UserReports.message,
          variant: "success",
        });
        setEmailRequested(false);
      }
      if (emailRequested && ProjectReports?.length) {
        setSnackbarInfo({
          open: true,
          message: ProjectReports.message,
          variant: "success",
        });
        setEmailRequested(false);
      }
      radioButton === "UsersReports" && setUserColumns([]);
      radioButton === "ProjectReports" && setProjectColumns([]);
    }
  }, [
    reportRequested,
    UserReports,
    userReportsExpandedRow,
    ProjectReports,
    projectReportsExpandedRow,
  ]);

  useEffect(() => {
    if (radioButton === "UsersReports") {
      if (userColumns.length > 0 && userSelectedColumns.length > 0) {
        const newCols = userColumns.map((col) => ({
          ...col,
          options: {
            ...col.options,
            display: userSelectedColumns.includes(col.name) ? "true" : "false",
          },
        }));
        if (JSON.stringify(newCols) !== JSON.stringify(userColumns)) {
          setUserColumns(newCols);
        }
      }
    } else if (radioButton === "ProjectReports") {
      if (projectColumns.length > 0 && projectSelectedColumns.length > 0) {
        const newCols = projectColumns.map((col) => ({
          ...col,
          options: {
            ...col.options,
            display: projectSelectedColumns.includes(col.name)
              ? "true"
              : "false",
          },
        }));
        if (JSON.stringify(newCols) !== JSON.stringify(projectColumns)) {
          setProjectColumns(newCols);
        }
      }
    }
  }, [
    radioButton,
    userSelectedColumns,
    userColumns,
    projectSelectedColumns,
    projectColumns,
  ]);

  const renderToolBar = () => {
    return (
      <Box className={classes.ToolbarContainer}>
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
      </Box>
    );
  };

  useEffect(() => {
    console.log("spinner info", showSpinner);
  }, [showSpinner]);
  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
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
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
              {
                marginRight: "10px",
              },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
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
    filterType: "checkbox",
    selectableRows: "none",
    download: true,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
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

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
  };

  const userId = useSelector((state) => state.getLoggedInData.data.id);

  useEffect(() => {
    setLoading(false);
  }, [UserReports, ProjectReports]);
  const handleSubmit = (sendMail) => {
    setLoading(true);
    if (radioButton === "PaymentReports") {
      dispatch(
        fetchSendOrganizationUserReports({
          orgId: orgId,
          userId: UserDetails.id,
          projectType: projectType[radioButton],
          participationTypes: participationTypes,
          fromDate: format(selectRange[0].startDate, "yyyy-MM-dd"),
          toDate: format(selectRange[0].endDate, "yyyy-MM-dd"),
        }),
      );
      setSnackbarInfo({
        open: true,
        message: "Payment Reports will be e-mailed to you shortly",
        variant: "success",
      });
      setLoading(false)
    } else {
      if (sendMail) {
        setReportRequested(false);
        setEmailRequested(true);
      } else {
        setReportRequested(true);
      }
      setShowPicker(false);
      setColumns([]);
      setSelectedColumns([]);
      if (
        radioButton === "UsersReports" &&
        reportTypes === "Annotator" &&
        reportfilter == ""
      ) {
        setSnackbarInfo({
          open: true,
          message: "Please fill Report Filter",
          variant: "error",
        });
      }
      let ReviewData;

      if (
        (reportTypes === "Annotator" || reportTypes === "Reviewer") &&
        reportfilter != "" &&
        radioButton === "UsersReports"
      ) {
        if (reportfilter.toString() == "Annotation Stage") {
          ReviewData = 1;
        } else if (reportfilter.toString() == "Review Stage") {
          ReviewData = 2;
        } else if (reportfilter.toString() == "Super Check Stage") {
          ReviewData = 3;
        }
        dispatch(
          fetchOrganizationUserReports({
            orgId: orgId,
            projectType: projectType[radioButton],
            startDate: format(selectRange[0].startDate, "yyyy-MM-dd"),
            endDate: format(selectRange[0].endDate, "yyyy-MM-dd"),
            reportsType:
              reportTypes === "Annotator"
                ? "annotation"
                : reportTypes === "Reviewer"
                  ? "review"
                  : "supercheck",
            targetLanguage: targetLanguage[radioButton],
            sendMail: sendMail,
            onlyReviewProjects: ReviewData,
          }),
        );
        if (sendMail) {
          setSnackbarInfo({
            open: true,
            message: "Report will be e-mailed to you shortly",
            variant: "success",
          });
        }
      } else if (
        reportTypes === "SuperCheck" ||
        (reportfilter === "All Stage" && radioButton === "UsersReports")
      ) {
        const supercheckObj = {
          orgId: orgId,
          projectType: projectType[radioButton],
          startDate: format(selectRange[0].startDate, "yyyy-MM-dd"),
          endDate: format(selectRange[0].endDate, "yyyy-MM-dd"),
          reportsType: "supercheck",
          targetLanguage: targetLanguage[radioButton],
          sendMail: sendMail,
        };
        dispatch(fetchOrganizationUserReports(supercheckObj));
        if (sendMail) {
          setSnackbarInfo({
            open: true,
            message: "Report will be e-mailed to you shortly",
            variant: "success",
          });
        }
      } else if (radioButton === "ProjectReports") {
        if (projectReportType === 1) {
          dispatch(
            fetchOrganizationProjectReports({
              orgId: orgId,
              projectType: projectType[radioButton],
              targetLanguage: targetLanguage[radioButton],
              userId: userId,
              sendMail: sendMail,
            }),
          );
          if (sendMail) {
            setSnackbarInfo({
              open: true,
              message: "Project Report will be e-mailed to you shortly",
              variant: "success",
            });
          }
        } else if (projectReportType === 2) {
          dispatch(
            fetchOrganizationDetailedProjectReports({
              orgId: Number(orgId),
              projectType: projectType[radioButton],
              userId: userId,
              statistics: statisticsType,
            }),
          );
          setSnackbarInfo({
            open: true,
            message: "Report will be e-mailed to you shortly",
            variant: "success",
          });
        }
      }
    }
  };

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value);
  };

  const handleChangeprojectFilter = (event) => {
    const value = event.target.value;
    setReportfilter(value);
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
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setParticipationTypes(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <React.Fragment>
      {renderSnackBar()}
      <Grid container direction="row" spacing={3} sx={{ mb: 3 }}>
        <Grid container direction="row" spacing={3} sx={{ mt: 1, ml: 1 }}>
          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
            <Typography
              gutterBottom
              component="div"
              sx={{ marginTop: "10px", fontSize: "16px" }}
            >
              Select Report Type :
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginTop: "5px" }}
                value={radioButton}
                onChange={handleChangeReports}
              >
                <FormControlLabel
                  value="UsersReports"
                  control={<Radio />}
                  label="Users Reports"
                />
                <FormControlLabel
                  value="ProjectReports"
                  control={<Radio />}
                  label="Project Reports"
                />
                <FormControlLabel
                  value="PaymentReports"
                  control={<Radio />}
                  label="Payment Reports"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {radioButton === "ProjectReports" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel
                id="project-report-type-label"
                sx={{
                  fontSize: "19px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Type
              </InputLabel>
              <Select
                style={{ zIndex: "0", minWidth: "auto" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                labelId="project-report-type-label"
                id="project-report-type-select"
                value={projectReportType}
                label="Type"
                onChange={(e) => setProjectReportType(e.target.value)}
                fullWidth
              >
                <MenuItem value={1}>High-Level Reports</MenuItem>
                <MenuItem value={2}>Detailed Reports</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="project-type-label" sx={{ fontSize: "19px" }}>
              Project Type
            </InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="project-type-label"
              id="project-type-select"
              value={projectType[radioButton]}
              label="Project Type"
              onChange={(e) => {
                setProjectType((prev) => ({
                  ...prev,
                  [radioButton]: e.target.value,
                }));
              }}
            >
              {projectTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {radioButton === "ProjectReports" && projectReportType === 1 && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="language-label" sx={{ fontSize: "19px" }}>
                Target Language
              </InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={targetLanguage[radioButton]}
                label="Target Language"
                onChange={(e) =>
                  setTargetLanguage((prev) => ({
                    ...prev,
                    [radioButton]: e.target.value,
                  }))
                }
                MenuProps={MenuProps}
              >
                <MenuItem value={"all"}>All languages</MenuItem>
                {LanguageChoices?.language?.map((lang) => (
                  <MenuItem value={lang} key={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {radioButton === "ProjectReports" && projectReportType === 2 && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="statistics-label" sx={{ fontSize: "16px" }}>
                Statistics
              </InputLabel>
              <Select
                labelId="statistics-label"
                id="statistics-select"
                value={statisticsType}
                label="Statistics"
                onChange={(e) => setStatisticsType(e.target.value)}
                MenuProps={MenuProps}
              >
                <MenuItem value={1}>Annotation Statistics</MenuItem>
                <MenuItem value={2}>Meta-Info Statistics</MenuItem>
                <MenuItem value={3}>Complete Statistics</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        {radioButton === "PaymentReports" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="participation-type-label"
                sx={{ fontSize: "19px" }}
              >
                Participation Types
              </InputLabel>
              <Select
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                labelId="participation-type-label"
                id="participation-select"
                value={participationTypes}
                label="Participation Type"
                onChange={handleChange}
                multiple
                renderValue={(selected) =>
                  selected
                    .map(
                      (value) =>
                        participationTypesOptions.find(
                          (option) => option.value === value,
                        ).label,
                    )
                    .join(", ")
                }
              >
                {participationTypesOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <ListItemIcon>
                      <Checkbox
                        checked={participationTypes.indexOf(option.value) > -1}
                      />
                    </ListItemIcon>
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {radioButton === "UsersReports" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-type-label" sx={{ fontSize: "19px" }}>
                {" "}
                Report Type
              </InputLabel>
              <Select
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                labelId="report-type-label"
                id="report-select"
                value={reportTypes}
                label="Report Type"
                onChange={(e) => setReportTypes(e.target.value)}
              >
                <MenuItem value={"Annotator"}>Annotator</MenuItem>
                <MenuItem value={"Reviewer"}>Reviewer</MenuItem>
                <MenuItem value={"SuperCheck"}>Super Checker</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        {radioButton === "UsersReports" && (
          <>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl
                fullWidth
                size="small"
                disabled={
                  reportTypes === "SuperCheck" ||
                  radioButton === "ProjectReports"
                }
              >
                <InputLabel id="project-type-label" sx={{ fontSize: "19px" }}>
                  Projects Filter
                </InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  labelId="project-type-label"
                  id="project-type-select"
                  value={reportfilter}
                  label="Projects Filter"
                  onChange={handleChangeprojectFilter}
                >
                  {FilterProgressType.map((type, index) => (
                    <MenuItem value={type} key={index}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="language-label" sx={{ fontSize: "19px" }}>
                  Target Language
                </InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={targetLanguage[radioButton]}
                  label="Target Language"
                  onChange={(e) =>
                    setTargetLanguage((prev) => ({
                      ...prev,
                      [radioButton]: e.target.value,
                    }))
                  }
                  MenuProps={MenuProps}
                >
                  <MenuItem value={"all"}>All languages</MenuItem>
                  {LanguageChoices?.language?.map((lang) => (
                    <MenuItem value={lang} key={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        {["UsersReports", "PaymentReports"].includes(radioButton) && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              onClick={() => setShowPicker(!showPicker)}
              sx={{ width: "130px" }}
            >
              Pick Dates
            </Button>
          </Grid>
        )}

        {(radioButton === "UsersReports" ||
          (radioButton === "ProjectReports" && projectReportType === 1)) && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleSubmit(false)}
              sx={{ width: "130px" }}
            >
              Submit
            </Button>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(true)}
            sx={{ width: "130px" }}
          >
            E-mail CSV
          </Button>
        </Grid>
      </Grid>
      {showPicker && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card>
            <DateRangePicker
              onChange={handleRangeChange}
              staticRanges={[
                ...defaultStaticRanges,
                {
                  label: "Till Date",
                  range: () => ({
                    startDate: new Date(
                      Date.parse(
                        OrganizationDetails?.created_at,
                        "yyyy-MM-ddTHH:mm:ss.SSSZ",
                      ),
                    ),
                    endDate: new Date(),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  },
                },
              ]}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={selectRange}
              minDate={
                new Date(
                  Date.parse(
                    OrganizationDetails?.created_at,
                    "yyyy-MM-ddTHH:mm:ss.SSSZ",
                  ),
                )
              }
              maxDate={new Date()}
              direction="horizontal"
            />
          </Card>
        </Box>
      )}
      {showSpinner ? (
        <CircularProgress style={{ marginLeft: "50%" }} />
      ) : (
        reportRequested && (
          <ThemeProvider theme={tableTheme}>
            <div ref={tableRef}>
              {loading ? (
                <CircularProgress style={{ marginLeft: "50%" }} />
              ) : isBrowser ? (
                radioButton === "UsersReports" && UserReports?.length ? (
                  <MUIDataTable
                    key={`table-${displayWidth}`}
                    title={"User Reports"}
                    data={UserReports}
                    columns={userColumns.filter((col) =>
                      userSelectedColumns.includes(col.name),
                    )}
                    options={options}
                  />
                ) : radioButton === "ProjectReports" &&
                  ProjectReports?.length > 0 ? (
                  <MUIDataTable
                    key={`table-${displayWidth}`}
                    title={"Projects Reports"}
                    data={ProjectReports}
                    columns={projectColumns.filter((col) =>
                      projectSelectedColumns.includes(col.name),
                    )}
                    options={options}
                  />
                ) : null
              ) : (
                <Skeleton
                  variant="rectangular"
                  height={400}
                  sx={{
                    mx: 2,
                    my: 3,
                    borderRadius: "4px",
                    transform: "none",
                  }}
                />
              )}
            </div>
          </ThemeProvider>
        )
      )}
    </React.Fragment>
  );
};

export default OrganizationReports;

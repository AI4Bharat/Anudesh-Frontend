import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/Dataset.css";
import DatasetStyle from "@/styles/dataset";
import ColumnList from "../common/ColumnList";
import Skeleton from "@mui/material/Skeleton";
import { isSameDay, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useParams } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import tableTheme from "../../themes/tableTheme";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "../../utils/Role";
import { fetchProjectReport } from "@/Lib/Features/getProjectReport";
import { styled } from "@mui/material/styles";

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

const ReportsTable = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { isSuperChecker, isReviewer, isAnnotators } = props;
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const [selectRange, setSelectRange] = useState([
    {
      startDate: new Date(
        Date.parse(ProjectDetails?.created_at, "yyyy-MM-ddTHH:mm:ss.SSSZ"),
      ),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  //   const [reportRequested, setReportRequested] = useState(false);
  const [columns, setColumns] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [displayWidth, setDisplayWidth] = useState(0);
  const ProjectReport = useSelector((state) => state.getProjectReport.data);
  const classes = DatasetStyle();
  const [radiobutton, setRadiobutton] = useState(
    isAnnotators
      ? "AnnotatationReports"
      : isReviewer
        ? "ReviewerReports"
        : "SuperCheckerReports",
  );
  const [expandedRow, setExpandedRow] = useState(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [reportRequested, setReportRequested] = useState({
    AnnotatationReports: false,
    ReviewerReports: false,
    SuperCheckerReports: false,
  });
  const [submitted, setSubmitted] = useState({
    AnnotatationReports: false,
    ReviewerReports: false,
    SuperCheckerReports: false,
  });
  const [reportDataByType, setReportDataByType] = useState({
    AnnotatationReports: [],
    ReviewerReports: [],
    SuperCheckerReports: [],
  });

  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);

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
    if (reportRequested[radiobutton]) {
      setReportDataByType((prevData) => ({
        ...prevData,
        [radiobutton]: ProjectReport || [],
      }));
      setShowSpinner(false);
    }
  }, [ProjectReport, reportRequested, reportRequested]);

  useEffect(() => {
    const currentReportData = reportDataByType[radiobutton];
    if (
      reportRequested[radiobutton] &&
      currentReportData &&
      currentReportData.length > 0
    ) {
      let cols = [];
      Object.keys(currentReportData[0]).forEach((key) => {
        cols.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: false,
            setCellProps: () => ({
              style: {
                fontSize: "16px",
                whiteSpace: "normal",
                minWidth: "150px",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              },
            }),
            customBodyRender: (value, tableMeta) => {
              const rowIndex = tableMeta.rowIndex;
              const isExpanded = expandedRow === rowIndex;
              return (
                <RowContainer
                  expanded={isExpanded}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedRow((prevExpanded) =>
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
      const allColumnNames = cols.map((col) => col.name);
      setColumns(cols);
      if (
        !selectedColumns.length ||
        JSON.stringify(selectedColumns) !== JSON.stringify(allColumnNames)
      ) {
        setSelectedColumns(allColumnNames);
      }
    } else {
      setColumns([]);
      setSelectedColumns([]);
    }
    setShowSpinner(false);
  }, [reportDataByType, radiobutton, expandedRow, reportRequested]);

  useEffect(() => {
    if (columns.length > 0 && selectedColumns.length > 0) {
      const newCols = columns.map((col) => ({
        ...col,
        options: {
          ...col.options,
          display: selectedColumns.includes(col.name) ? "true" : "false",
        },
      }));
      if (JSON.stringify(newCols) !== JSON.stringify(columns)) {
        setColumns(newCols);
      }
    } else if (columns.length > 0 && selectedColumns.length === 0) {
      const newCols = columns.map((col) => ({
        ...col,
        options: {
          ...col.options,
          display: "false",
        },
      }));
      if (JSON.stringify(newCols) !== JSON.stringify(columns)) {
        setColumns(newCols);
      }
    }
  }, [selectedColumns, columns]);

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value);
  };

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
    textLabels: {
      body: {
        noMatch: "No Record Found!",
      },
    },
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

  useEffect(() => {
    reportDataByType[radiobutton]?.length > 0 && setLoading(false);
  }, [reportDataByType]);

  const handleSubmit = async () => {
    setLoading(true);
    let projectObj;
    let reports_type =
      radiobutton === "SuperCheckerReports"
        ? "superchecker_reports"
        : "review_reports";
    setReportRequested((prevState) => ({ ...prevState, [radiobutton]: true }));
    setSubmitted((prevState) => ({ ...prevState, [radiobutton]: true }));
    if (radiobutton === "AnnotatationReports") {
      projectObj = {
        projectId: id,
        startDate: format(selectRange[0].startDate, "yyyy-MM-dd"),
        endDate: format(selectRange[0].endDate, "yyyy-MM-dd"),
      };
    } else if (radiobutton === "ReviewerReports") {
      projectObj = {
        projectId: id,
        startDate: format(selectRange[0].startDate, "yyyy-MM-dd"),
        endDate: format(selectRange[0].endDate, "yyyy-MM-dd"),
        reports_type: reports_type,
      };
    } else if (radiobutton === "SuperCheckerReports") {
      projectObj = {
        projectId: id,
        startDate: format(selectRange[0].startDate, "yyyy-MM-dd"),
        endDate: format(selectRange[0].endDate, "yyyy-MM-dd"),
        reports_type: reports_type,
      };
    }
    dispatch(fetchProjectReport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (resp.message) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }

    setShowPicker(false);
  };

  let frozenUsers = ProjectDetails?.frozen_users?.map((e) => {
    let temp = ProjectReport.find((element) => element.id === e.id);
    if (temp?.ProjectReport) {
      e.ProjectReport = temp.ProjectReport;
    }
    return e;
  });

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

  const currentData = reportDataByType[radiobutton];
  const hasSubmittedCurrent = submitted[radiobutton];
  const isLoadingCurrent =
    showSpinner && reportRequested[radiobutton] && !currentData?.length;

  return (
    <React.Fragment>
      {renderSnackBar()}
      <Grid container direction="row" rowSpacing={2} sx={{ mb: 2 }}>
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
              value={radiobutton}
              onChange={handleChangeReports}
            >
              {(userRole.WorkspaceManager === loggedInUserData?.role ||
                userRole.OrganizationOwner === loggedInUserData?.role ||
                userRole.Admin === loggedInUserData?.role ||
                ProjectDetails?.project_stage === 1 ||
                ProjectDetails?.annotators?.some(
                  (user) => user.id === loggedInUserData.id,
                )) && (
                <FormControlLabel
                  value="AnnotatationReports"
                  control={<Radio />}
                  label="Annotator"
                />
              )}
              {(userRole.WorkspaceManager === loggedInUserData?.role ||
              userRole.OrganizationOwner === loggedInUserData?.role ||
              userRole.Admin === loggedInUserData?.role
                ? ProjectDetails?.project_stage == 2 ||
                  ProjectDetails?.project_stage == 3
                : ProjectDetails?.annotation_reviewers?.some(
                    (reviewer) => reviewer.id === loggedInUserData?.id,
                  )) && (
                <FormControlLabel
                  value="ReviewerReports"
                  control={<Radio />}
                  label="Reviewer"
                />
              )}
              {(userRole.WorkspaceManager === loggedInUserData?.role ||
              userRole.OrganizationOwner === loggedInUserData?.role ||
              userRole.Admin === loggedInUserData?.role
                ? ProjectDetails?.project_stage == 3
                : false ||
                  ProjectDetails?.review_supercheckers?.some(
                    (superchecker) => superchecker.id === loggedInUserData?.id,
                  )) && (
                <FormControlLabel
                  value="SuperCheckerReports"
                  control={<Radio />}
                  label="Super Checker"
                />
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
          <Button
            endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            variant="contained"
            color="primary"
            sx={{ width: "130px", marginTop: "8.5px" }}
            onClick={() => setShowPicker(!showPicker)}
          >
            Pick Dates
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "130px", marginTop: "8.5px" }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      {showPicker && (
        <Box
          sx={{
            mt: 2,
            mb: 2,
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
                        ProjectDetails?.created_at,
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
                    ProjectDetails?.created_at,
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
      <>
        {!(
          userRole.Annotator === loggedInUserData?.role ||
          userRole.Reviewer === loggedInUserData?.role
        ) &&
          frozenUsers.length > 0 && (
            <Typography variant="body2" color="#F8644F">
              * User Inactive
            </Typography>
          )}
        <ThemeProvider theme={tableTheme}>
          {reportRequested[radiobutton] && (
            (loading ? (
              <CircularProgress style={{ marginLeft: "50%" }} />
            ) : isBrowser ? (
              currentData ? (
                <MUIDataTable
                  key={`table-${displayWidth}`}
                  title={
                    radiobutton === "AnnotatationReports"
                      ? "Annotation Report"
                      : radiobutton === "ReviewerReports"
                        ? "Reviewer Report"
                        : "Super Checker Report"
                  }
                  data={currentData}
                  columns={columns.filter((col) =>
                    selectedColumns.includes(col.name),
                  )}
                  options={{
                    ...options,
                    tableBodyHeight: `${
                      typeof window !== "undefined"
                        ? window.innerHeight - 200
                        : 400
                    }px`,
                  }}
                />
              ) : (
                <Grid container justifyContent="center">
                  <Grid item sx={{ mt: "10%" }}>
                    <>No results</>
                  </Grid>
                </Grid>
              )
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
            ))
          )}
        </ThemeProvider>
      </>
    </React.Fragment>
  );
};

export default ReportsTable;

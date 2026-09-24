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
import tableTheme from "../../themes/projectDetailTableTheme";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "../../utils/Role";
import { fetchProjectReport } from "@/Lib/Features/getProjectReport";
import { styled, createTheme } from "@mui/material/styles";

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
                minWidth: displayWidth < 600 ? "120px" : "150px",
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
  }, [reportDataByType, radiobutton, expandedRow, reportRequested, displayWidth]);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          width: "100%",
        }}
      >
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
    setShowSpinner(true);
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

  const reportsTableTheme = createTheme(tableTheme, {
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            padding: "10px 12px !important",
            fontSize: "14px !important",
          },
        },
      },
      MUIDataTableToolbar: {
        styleOverrides: {
          root: {
            display: "flex !important",
            justifyContent: "space-between !important",
            alignItems: "center !important",
            padding: "10px 16px !important",
            minHeight: "64px !important",
            gap: "10px",
            backgroundColor: "#f2f4f6",
            border: "1px solid #E0E0E0",
            borderRadius: "0px",
            "& .MuiIconButton-root": {
              border: "1px solid #ebebeb !important",
              borderRadius: "4px !important",
              backgroundColor: "transparent !important",
              padding: "8px !important",
              width: "40px !important",
              height: "40px !important",
              color: "#ee6633 !important",
            },
            "& .MuiIconButton-root:hover": {
              backgroundColor: "rgba(238, 102, 51, 0.04) !important",
              borderColor: "#ee6633 !important",
            },
            "& .MUIDataTableToolbar-titleText, & h6": {
              fontSize: "18px !important",
              fontFamily: '"Roboto", sans-serif !important',
              fontWeight: "500 !important",
              color: "#5C5C5C !important",
            },
          },
          titleRoot: {
            display: "block !important",
          },
          titleText: {
            fontSize: "18px !important",
            fontFamily: '"Roboto", sans-serif !important',
            fontWeight: "500 !important",
            color: "#5C5C5C !important",
          },
          left: {
            display: "flex !important",
            flex: "0 0 auto",
            alignItems: "center",
            gap: "10px",
          },
          actions: {
            display: "flex !important",
            flex: "0 0 auto",
            alignItems: "center",
            gap: "10px",
            justifyContent: "flex-end",
          },
        },
      },
    },
  });

  return (
    <React.Fragment>
      {renderSnackBar()}

      {/* Section 1: Labels + radio buttons + date picker toggle + submit */}
      <Box
        sx={{
          mb: "0px !important",
          p: 2,
          border: "1px solid #E0E0E0",
          bgcolor: "#FAFAFA",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "4px 0px",
            mb: 0,
            pl: 2,
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: "14px",
              whiteSpace: "nowrap",
              pr: 1,
              py: "10px",
            }}
          >
            Select Report Type:
          </Typography>

          <FormControl sx={{ flex: "1 1 auto", minWidth: 0 }}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0px 16px",
                mt: "5px",
              }}
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
                    sx={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      mr: 0,
                      minWidth: "fit-content",
                    }}
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
                    sx={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      mr: 0,
                      minWidth: "fit-content",
                    }}
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
                    sx={{
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      mr: 0,
                      minWidth: "fit-content",
                    }}
                  />
                )}
            </RadioGroup>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              flexShrink: 0,
              width: { xs: "100%", sm: "auto" },
              pt: "8.5px",
              pl: { sm: 1 },
            }}
          >
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              sx={{ whiteSpace: "nowrap" }}
              onClick={() => setShowPicker(!showPicker)}
            >
              Pick Dates
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ whiteSpace: "nowrap" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>

      {showPicker && (
        <Box
          component="section"
          sx={{
            mb: 2,
            p: 2,
            bgcolor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              flexDirection: displayWidth < 700 ? "column" : "row",
              alignItems: "center",
              px: 1,
            }}
          >
            <Card
              sx={{
                width: "auto",
                maxWidth: "100%",
                overflowX: "auto",
                p: 1,
                mx: "auto",
                '& .rdrCalendarWrapper': {
                  minWidth: displayWidth < 700 ? "320px" : "720px",
                },
                '& .rdrMonths': {
                  display: displayWidth < 700 ? "block" : "flex",
                },
                '& .rdrMonth': {
                  minWidth: displayWidth < 700 ? "100%" : "360px",
                },
              }}
            >
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
                months={displayWidth < 700 ? 1 : 2}
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
                direction={displayWidth < 700 ? "vertical" : "horizontal"}
              />
            </Card>
          </Box>
        </Box>
      )}

      <div style={{ padding: 0, margin: 0 }}>
        {!(
          userRole.Annotator === loggedInUserData?.role ||
          userRole.Reviewer === loggedInUserData?.role
        ) &&
          frozenUsers.length > 0 && (
            <Typography variant="body2" color="#F8644F" sx={{ mb: 1 }}>
              * User Inactive
            </Typography>
          )}
        <ThemeProvider theme={reportsTableTheme}>
          {reportRequested[radiobutton] ? (
            loading ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                Report is loading, please wait...
              </Typography>
            ) : isBrowser ? (
              currentData ? (
                <Box sx={{ p: "0px !important" }}>
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
                      tableBodyHeight: `${typeof window !== "undefined"
                        ? window.innerHeight - 200
                        : 400
                        }px`,
                    }}
                  />
                </Box>
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
            )
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
              Select a report type, pick a date range, then click Submit to display the table.
            </Typography>
          )}
        </ThemeProvider>
      </div>
    </React.Fragment>
  );
};

export default ReportsTable;
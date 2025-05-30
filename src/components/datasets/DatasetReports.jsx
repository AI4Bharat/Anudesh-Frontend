// DatasetReports

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import tableTheme from "@/themes/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DatasetStyle from "@/styles/dataset";
import ColumnList from "../common/ColumnList";
import { MenuProps } from "@/utils/utils";
import CustomizedSnackbars from "@/components/common/Snackbar";
import { fetchProjectDomains } from "@/Lib/Features/getProjectDomains";
import { fetchLanguages } from "@/Lib/Features/fetchLanguages";
import { fetchDatasetProjectReports } from "@/Lib/Features/datasets/getDatasetProjectReports";
import { fetchDatasetDetailedReports } from "@/Lib/Features/datasets/GetDatasetDetailedReports";
import { CircularProgress } from "@mui/material";
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

const DatasetReports = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [language, setLanguage] = useState("all");
  const [columns, setColumns] = useState([]);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportRequested, setReportRequested] = useState(false);
  const classes = DatasetStyle();
  const [loading, setLoading] = useState(false);
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  const DatasetDetails = useSelector((state) => state.getDatasetDetails?.data);
  const ProjectTypes = useSelector((state) => state.getProjectDomains?.data);
  const DatasetReports = useSelector(
    (state) => state.getDatasetProjectReports?.data,
  );
  const LanguageChoices = useSelector((state) => state.getLanguages?.data);
  const [projectReportType, setProjectReportType] = useState(1);
  const [statisticsType, setStatisticsType] = useState(1);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [expandedRow, setExpandedRow] = useState(null);

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

    // Force responsive mode after component mount
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

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchProjectDomains());
    dispatch(fetchLanguages());
  }, []);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      setSelectedType(types[0]);
    }
  }, [ProjectTypes]);

  useEffect(() => {
    if (reportRequested && DatasetReports?.length) {
      let tempColumns = [];
      if (selectedColumns.length === 0) {
        setSelectedColumns(columns);
      }
      Object.keys(DatasetReports[0]).forEach((key) => {
        const isSelectedColumn = selectedColumns.includes(key);
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
            align: "center",
            display: isSelectedColumn ? "true" : "false",
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
            setCellProps: () => ({
              style: {
                height: "70px",
                fontSize: "16px",
                padding: "16px",
                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              },
            }),
          },
        });
      });
      setColumns(tempColumns);
      setReportData(DatasetReports);
    } else {
      setColumns([]);
      setReportData([]);
    }
    setShowSpinner(false);
  }, [DatasetReports, expandedRow]);

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
    }
  }, [selectedColumns, columns]);

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
    textLabels: {
      body: {
        noMatch: "No Record Found",
      },
    },
  };

  const userId = useSelector((state) => state.getLoggedInData?.data.id);

  useEffect(() => {
    setLoading(false);
  }, [reportData]);

  const handleSubmit = () => {
    setLoading(true);
    if (projectReportType === 1) {
      setReportRequested(true);
      const projectReportObj = {
        datasetId: datasetId,
        projectType: selectedType,
        language: language,
      };
      dispatch(fetchDatasetProjectReports(projectReportObj));
      setShowSpinner(true);
    } else if (projectReportType === 2) {
      const projectReportObj = {
        dataId: Number(datasetId),
        projectType: selectedType,
        userId: userId,
        statistics: statisticsType,
      };
      dispatch(fetchDatasetDetailedReports(projectReportObj));
      setSnackbarInfo({
        open: true,
        message: "Detailed Dataset Reports will be e-mailed to you shortly",
        variant: "success",
      });
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
    <React.Fragment>
      {renderSnackBar()}
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          marginBottom: "24px",
        }}
      >
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
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel
              id="project-type-label"
              sx={{ fontSize: "19px", zIndex: 0 }}
            >
              Project Type
            </InputLabel>
            <Select
              labelId="project-type-label"
              id="project-type-select"
              value={selectedType}
              label="Project Type"
              onChange={(e) => setSelectedType(e.target.value)}
              MenuProps={MenuProps}
            >
              {projectTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {projectReportType === 1 && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="language-label"
                sx={{ fontSize: "19px", zIndex: 0 }}
              >
                Target Language
              </InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={language}
                label="Target Language"
                onChange={(e) => setLanguage(e.target.value)}
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
        {projectReportType === 2 && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="statistics-label"
                sx={{ fontSize: "16px", zIndex: 0 }}
              >
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
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "130px" }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      {showSpinner ? (
        <CircularProgress style={{ marginLeft: "50%" }} />
      ) : (
        reportRequested && (
          <ThemeProvider theme={tableTheme}>
            {loading ? (
              <CircularProgress style={{ marginLeft: "50%" }} />
            ) : isBrowser ? (
              <MUIDataTable
                key={`table-${displayWidth}`}
                title={DatasetReports.length > 0 ? "Reports" : ""}
                data={reportData}
                columns={columns.filter((col) =>
                  selectedColumns.includes(col.name),
                )}
                options={options}
              />
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
          </ThemeProvider>
        )
      )}
    </React.Fragment>
  );
};

export default DatasetReports;

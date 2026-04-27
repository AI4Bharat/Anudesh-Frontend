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
import { useTheme } from "@/context/ThemeContext";

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
  const { dark } = useTheme();
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
          backgroundColor: dark ? "#252525" : "",
				borderTop: dark ? "1px solid #3a3a3a" : "",
				color: dark ? "#a0a0a0" : "",
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
    <Box sx={{ backgroundColor: dark ? "#1e1e1e" : "", borderRadius: dark ? "8px" : "", p: dark ? 1 : 0 }}>
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
          <FormControl fullWidth size="small" variant="outlined" sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    },
  }}>
            <InputLabel
              id="project-report-type-label"
              sx={{
                fontSize: "19px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: dark ? "#a0a0a0" : "",
              }}
            >
              Type
            </InputLabel>
            <Select
              style={{ zIndex: "0", minWidth: "auto" }}
              inputProps={{ "aria-label": "Without label" }}
              
              labelId="project-report-type-label"
              id="project-report-type-select"
              value={projectReportType}
              label="Type"
              sx={{
                color: dark ? "#ececec" : "",
                backgroundColor: dark ? "#2a2a2a" : "",
                "& .MuiSvgIcon-root": {
                  color: dark ? "#a0a0a0" : "",
                },
              }}
              MenuProps={{
                ...MenuProps,
                PaperProps: {
                  ...MenuProps?.PaperProps,
                  sx: {
                    ...(MenuProps?.PaperProps?.sx || {}),
                    backgroundColor: dark ? "#2a2a2a" : "",
                    color: dark ? "#ececec" : "",
                    border: dark ? "1px solid #3a3a3a" : "",
                  },
                },
              }}
              onChange={(e) => setProjectReportType(e.target.value)}
              fullWidth
            >
              <MenuItem value={1}>High-Level Reports</MenuItem>
              <MenuItem value={2}>Detailed Reports</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl
  fullWidth
  size="small"
  variant="outlined" 
  sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    },
  }}
>
            <InputLabel
  id="project-type-label"
  sx={{
    fontSize: "19px",
    color: dark ? "#a0a0a0" : "",
  }}
>
              Project Type
            </InputLabel>
           <Select
                labelId="project-type-label"
                id="project-type-select"
                value={selectedType}
                label="Project Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{
                  color: dark ? "#ececec" : "",
                  backgroundColor: dark ? "#2a2a2a" : "",
                  "& .MuiSvgIcon-root": {
                    color: dark ? "#a0a0a0" : "",
                  },
                }}
                MenuProps={{
                  ...MenuProps,
                  PaperProps: {
                    ...MenuProps?.PaperProps,
                    sx: {
                      ...(MenuProps?.PaperProps?.sx || {}),
                      backgroundColor: dark ? "#2a2a2a" : "",
                      color: dark ? "#ececec" : "",
                      border: dark ? "1px solid #3a3a3a" : "",
                    },
                  },
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
        {projectReportType === 1 && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small" variant="outlined"  sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    },
  }}>
              <InputLabel
                id="language-label"
                sx={{ fontSize: "19px", color: dark ? "#a0a0a0" : "",}}
              >
                Target Language
              </InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={language}
                label="Target Language"
                onChange={(e) => setLanguage(e.target.value)}
                sx={{
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiSvgIcon-root": {
      color: dark ? "#a0a0a0" : "",
    },
  }}
  MenuProps={{
    ...MenuProps,
    PaperProps: {
      ...MenuProps?.PaperProps,
      sx: {
        ...(MenuProps?.PaperProps?.sx || {}),
        backgroundColor: dark ? "#2a2a2a" : "",
        color: dark ? "#ececec" : "",
        border: dark ? "1px solid #3a3a3a" : "",
      },
    },
  }}
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
            <FormControl fullWidth size="small" variant="outlined"  sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: dark ? "#3a3a3a" : "",
    },
  }}>
              <InputLabel
                id="statistics-label"
                sx={{ fontSize: "16px",color: dark ? "#a0a0a0" : "", }}
              >
                Statistics
              </InputLabel>
              <Select
                labelId="statistics-label"
                id="statistics-select"
                value={statisticsType}
                label="Statistics"
                onChange={(e) => setStatisticsType(e.target.value)}
                sx={{
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiSvgIcon-root": {
      color: dark ? "#a0a0a0" : "",
    },
  }}
  MenuProps={{
    ...MenuProps,
    PaperProps: {
      ...MenuProps?.PaperProps,
      sx: {
        ...(MenuProps?.PaperProps?.sx || {}),
        backgroundColor: dark ? "#2a2a2a" : "",
        color: dark ? "#ececec" : "",
        border: dark ? "1px solid #3a3a3a" : "",
      },
    },
  }}
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
  <Box sx={{
    ...(dark && {
      "& .MuiPaper-root": { backgroundColor: "#1e1e1e", color: "#ececec", border: "none", boxShadow: "none" },
      "& .MuiToolbar-root": { backgroundColor: "#252525", borderBottom: "1px solid #3a3a3a" },
      "& thead th": { backgroundColor: "#252525", color: "#ececec", fontWeight: 700, borderBottom: "2px solid #3a3a3a" },
      "& tbody td": { color: "#d0d0d0", borderBottom: "1px solid #2e2e2e" },
      "& tbody tr:nth-of-type(odd)": { backgroundColor: "#1e1e1e" },
      "& tbody tr:nth-of-type(even)": { backgroundColor: "#242424" },
      "& tbody tr:hover": { backgroundColor: "rgba(251, 146, 60, 0.08) !important" },
      "& .MuiTypography-root": { color: "#ececec" },
      "& .MuiTablePagination-root": { color: "#a0a0a0", backgroundColor: "#252525", borderTop: "1px solid #3a3a3a" },
      "& .MuiIconButton-root": { color: "#fb923c" },
      "& .MuiSvgIcon-root": { color: "#fb923c" },
      "& .MuiSelect-select": { color: "#ececec" },
    })
  }}>
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
            </Box>
          </ThemeProvider>
        )
      )}
    </Box>
  </React.Fragment>
);
};

export default DatasetReports;

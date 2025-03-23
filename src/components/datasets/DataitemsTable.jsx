import dynamic from "next/dynamic";
import { styled } from "@mui/material/styles";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import tableTheme from "@/themes/tableTheme";
import DatasetStyle from "@/styles/dataset";
import { snakeToTitleCase } from "@/utils/utils";
import ColumnList from "../common/ColumnList";
import SearchIcon from "@mui/icons-material/Search";
import DatasetSearchPopup from "./DatasetSearchPopup";
import Spinner from "@/components/common/Spinner";
import { fetchDataitemsById } from "@/Lib/Features/datasets/GetDataitemsById";
import ReactJson from "react-json-view";
import { CircularProgress } from "@mui/material/CircularProgress";

// Styled component for the cell content with truncation
const TruncatedContent = styled(Box)(({ theme, expanded }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 3,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.5em",
  maxHeight: expanded ? "9900px" : "4.5em",
  transition: "max-height 1.8s ease-in-out",
}));

// Row container with transition
const RowContainer = styled(Box)(({ theme, expanded }) => ({
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

const excludeKeys = [
  "parent_data_id",
  // "metadata_json",
  "instance_id_id",
  "datasetbase_ptr_id",
  "key",
  "instance_id",
  "speakers_json",
  // "conversation_json",
  // "transcribed_json",
  "machine_transcribed_json",
  // "prediction_json",
  "conversation_json",
  "machine_translated_conversation_json",
  "speakers_json",
  "interactions_json",
  "eval_form_json",
  "multiple_interaction_json",
  "unverified_conversation_json",
  "annotation_bboxes",
  "annotation_labels",
  "annotation_transcripts",
];

const JSONViewer = ({ data, initiallyExpanded = false }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  // Parse JSON if it's a string
  let jsonData;
  try {
    jsonData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    return <Box sx={{ p: 1 }}>Invalid JSON</Box>;
  }

  // Check if JSON is empty or null
  if (
    !jsonData ||
    (typeof jsonData === "object" && Object.keys(jsonData).length === 0)
  ) {
    return <Box sx={{ p: 1, color: "text.secondary" }}>Empty data</Box>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "4px",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        sx={{
          position: "absolute",
          top: "2px",
          right: "2px",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
      >
        {expanded ? (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
            />
          </svg>
        )}
      </IconButton>
      <Box
        sx={{
          padding: "8px",
          maxHeight: expanded ? "none" : "100px",
          overflow: "hidden",
          position: "relative",
          "&::after": expanded
            ? {}
            : {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40px",
                background:
                  "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9))",
              },
        }}
      >
        <ReactJson
          src={jsonData}
          theme="bright:inverted"
          collapsed={expanded ? 1 : 2}
          displayDataTypes={false}
          enableClipboard={true}
          name={false}
          style={{
            fontSize: "0.85rem",
            fontFamily: "'Roboto Mono', monospace",
          }}
        />
      </Box>
    </Box>
  );
};

const DataitemsTable = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  const dataitemsList = useSelector((state) => state.GetDataitemsById?.data);
  // const filterdataitemsList =useSelector((state) => state.datasetSearchPopup.data);
  const DatasetDetails = useSelector((state) => state.getDatasetDetails.data);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({});
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [dataitems, setDataitems] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  localStorage.setItem("DataitemsList", JSON.stringify(columns));
  localStorage.setItem("Dataitem", JSON.stringify(dataitemsList));
  const [expandedRow, setExpandedRow] = useState(null);
  const [showSpinner, setShowSpinner] = useState(true);

  const getDataitems = () => {
    const dataObj = {
      instanceIds: datasetId,
      datasetType: DatasetDetails.dataset_type,
      selectedFilters: selectedFilters,
      pageNo: currentPageNumber,
      countPerPage: currentRowPerPage,
    };
    dispatch(fetchDataitemsById(dataObj));
    setShowSpinner(false);
  };

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

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

  // Define your default columns
  const defaultSelectedColumns = [
    "id",
    "prompt",
    "model",
    "output",
    "meta_info_model",
    "meta_info_language",
    "eval_form_output_json",
    "eval_time_taken",
    "interaction_id",
    "no_of_turns",
    "language",
    "time_taken",
    "meta_info_intent",
    "meta_info_domain",
    "meta_info_language",
    "meta_info_structure",
    "instruction_data",
    "no_of_models",
    "datetime",
    "parent_data",
  ];

  useEffect(() => {
    let fetchedItems = dataitemsList?.results;
    setTotalDataitems(dataitemsList?.count);
    fetchedItems = dataitemsList?.results;
    setDataitems(fetchedItems);

    let tempColumns = [];
    let tempSelected = [];
    if (fetchedItems?.length) {
      Object.keys(fetchedItems[0]).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          const isDefaultColumn = selectedColumns.length > 0 ? selectedColumns.includes(key) : defaultSelectedColumns.includes(key);

          // Check if the column contains JSON data
          const isJsonColumn =
            key === "eval_form_output_json" ||
            key === "metadata_json" ||
            key === "prediction_json" ||
            key === "ocr_prediction_json" ||
            key === "transcribed_json" ||
            key === "draft_data_json" ||
            key === "ocr_transcribed_json";

          if (isJsonColumn) {
            tempColumns.push({
              name: key,
              label: snakeToTitleCase(key),
              options: {
                filter: false,
                sort: false,
                display: isDefaultColumn ? "true" : "false",
                viewColumns: true,
                align: "center",
                customHeadLabelRender: customColumnHead,
                customBodyRender: (value) => {
                  if (!value) return null;
                  return (
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: "250px",
                        maxWidth: "500px",
                        m: 1,
                        border: "1px solid rgba(224, 224, 224, 1)",
                        borderRadius: "4px",
                        backgroundColor: "rgba(250, 250, 250, 0.9)",
                      }}
                    >
                      <JSONViewer data={value} />
                    </Box>
                  );
                },
              },
            });
          } else {
            // Keep the original code for non-JSON columns
            tempColumns.push({
              name: key,
              label: snakeToTitleCase(key),
              options: {
                filter: false,
                sort: false,
                display: isDefaultColumn ? "true" : "false",
                viewColumns: true,
                align: "center",
                customHeadLabelRender: customColumnHead,
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
          }

          if (isDefaultColumn) {
            tempSelected.push(key);
          }
        }
      });
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);
  }, [dataitemsList]);

  useEffect(() => {
    let fetchedItems = dataitemsList?.results;
    let tempColumns = [];

    if (fetchedItems?.length) {
      Object.keys(fetchedItems[0]).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          const isSelectedColumn = selectedColumns.includes(key);

          // Check if the column contains JSON data
          const isJsonColumn =
            key === "eval_form_output_json" ||
            key === "metadata_json" ||
            key === "prediction_json" ||
            key === "ocr_prediction_json" ||
            key === "transcribed_json" ||
            key === "draft_data_json" ||
            key === "ocr_transcribed_json";

          if (isJsonColumn) {
            tempColumns.push({
              name: key,
              label: snakeToTitleCase(key),
              options: {
                filter: false,
                sort: false,
                display: isSelectedColumn ? "true" : "false",
                viewColumns: true,
                align: "center",
                customHeadLabelRender: customColumnHead,
                customBodyRender: (value) => {
                  if (!value) return null;

                  return (
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: "250px",
                        maxWidth: "500px",
                        m: 1,
                        border: "1px solid rgba(224, 224, 224, 1)",
                        borderRadius: "4px",
                        backgroundColor: "rgba(250, 250, 250, 0.9)",
                      }}
                    >
                      <JSONViewer data={value} />
                    </Box>
                  );
                },
              },
            });
          } else {
            // Keep the original code for non-JSON columns
            tempColumns.push({
              name: key,
              label: snakeToTitleCase(key),
              options: {
                filter: false,
                sort: false,
                display: isSelectedColumn ? "true" : "false",
                viewColumns: true,
                align: "center",
                customHeadLabelRender: customColumnHead,
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
          }
        }
      });
    }
    setColumns(tempColumns);
  }, [expandedRow]);

  useEffect(() => {
    setShowSpinner(true);
    getDataitems();
  }, [currentPageNumber, currentRowPerPage, selectedFilters]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
  }, [selectedColumns]);

  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };
  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "5px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
        <IconButton
          sx={{ borderRadius: "100%" }}
          onClick={(e) => handleShowSearch(col.name, e)}
        >
          <SearchIcon id={col.name + "_btn"} />
        </IconButton>
      </Box>
    );
  };

  const renderToolBar = () => {
    return (
      <Grid container spacing={0} md={12}>
        <Grid
          item
          xs={8}
          sm={8}
          md={12}
          lg={12}
          xl={12}
          className={classes.filterToolbarContainer}
        >
          <Grid container direction="row" justifyContent={"flex-end"}>
            <ColumnList
              columns={columns}
              setColumns={setSelectedColumns}
              selectedColumns={selectedColumns}
            />
          </Grid>
        </Grid>
      </Grid>
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
    count: totalDataitems,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100, 200, 500, 1000, 2000, 4000, 8000],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "currentRowPerPage",
        displayRows: "OF",
      },
    },
    onChangePage: (currentPage) => {
      setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentRowPerPage(rowPerPageCount);
    },
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    textLabels: {
      body: {
        noMatch: "No records ",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: {
        rowsPerPage: "Rows per page",
      },
      options: { sortDirection: "desc" },
    },
    jumpToPage: true,
    serverSide: true,
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
    rowHover: false, // Disable default row hover as we handle it in our custom component
    onRowClick: null,
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          key={`table-${displayWidth}`}
          title={""}
          data={dataitems}
          columns={columns}
          options={{
            ...options,
            tableBodyHeight: `${
              typeof window !== "undefined" ? window.innerHeight - 200 : 400
            }px`,
          }}
        />
      </ThemeProvider>
      {searchOpen && (
        <DatasetSearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
        />
      )}
      {loading && <Spinner />}
    </>
  );
};

export default DataitemsTable;

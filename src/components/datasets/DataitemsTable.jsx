import dynamic from 'next/dynamic';
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import tableTheme from "@/themes/tableTheme";
import DatasetStyle from "@/styles/dataset";
import { snakeToTitleCase } from "@/utils/utils";
import ColumnList from "../common/ColumnList";
import SearchIcon from '@mui/icons-material/Search';
import DatasetSearchPopup from './DatasetSearchPopup';
import Spinner from "@/components/common/Spinner";
import { fetchDataitemsById } from "@/Lib/Features/datasets/GetDataitemsById";

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

const DataitemsTable = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  const dataitemsList = useSelector((state) => state.GetDataitemsById?.data);
  // const filterdataitemsList =useSelector((state) => state.datasetSearchPopup.data);
  const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
  const apiLoading = useSelector(state => state.apiStatus.loading);
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

  const getDataitems = () => {
    const dataObj = ({
      instanceIds: datasetId,
      datasetType: DatasetDetails.dataset_type,
      selectedFilters: selectedFilters,
      pageNo: currentPageNumber,
      countPerPage: currentRowPerPage
    }
    );
    dispatch(fetchDataitemsById(dataObj));
  };

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

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
          tempColumns.push({
            name: key,
            label: snakeToTitleCase(key),
            options: {
              filter: false,
              sort: false,
              align: "center",
              customHeadLabelRender: customColumnHead,
              customBodyRender: (value) => {
                if ((key == "metadata_json" || key == "prediction_json" || key == "ocr_prediction_json" || key == "transcribed_json" || key == "draft_data_json" || key == "ocr_transcribed_json") && value !== null) {
                  const data = JSON.stringify(value)
                  const metadata = data.replace(/\\/g, "");
                  return metadata;
                } else if (key == "eval_form_output_json") {
                  return JSON.stringify(value);
                }
                else {
                  return value;
                }
              },
            },
          });
          tempSelected.push(key);
        }
      });
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);


  }, [dataitemsList])


  useEffect(() => {
    getDataitems();
  }, [currentPageNumber, currentRowPerPage, selectedFilters]);

  useEffect(() => {
    const newCols = columns.map(col => {
      col.options.display = selectedColumns.includes(col.name) ? "true" : "false";
      return col;
    });
    setColumns(newCols);

  }, [selectedColumns]);



  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);

  }
  const handleSearchClose = () => {
    setSearchAnchor(null);
  }

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
        <IconButton sx={{ borderRadius: "100%" }} onClick={(e) => handleShowSearch(col.name, e)}>
          <SearchIcon id={col.name + "_btn"} />
        </IconButton>
      </Box>
    );
  }

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
            tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
          }}
        />
      </ThemeProvider>
      {searchOpen && <DatasetSearchPopup
        open={searchOpen}
        anchorEl={searchAnchor}
        handleClose={handleSearchClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
        searchedCol={searchedCol}
      />}
      {loading && <Spinner />}
    </>

  );
};

export default DataitemsTable;

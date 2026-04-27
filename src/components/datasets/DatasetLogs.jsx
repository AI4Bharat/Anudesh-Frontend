import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import tableTheme from "@/themes/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Spinner from "@/components/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { addMonths, parse } from 'date-fns';
import { DateRangePicker } from "react-date-range";
import { snakeToTitleCase } from "@/utils/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { fetchDatasetLogs } from "@/Lib/Features/datasets/GetDatasetLogs";
import { styled } from "@mui/material/styles";
import { useTheme } from "@/context/ThemeContext";


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

const RowContainer = styled(Box)(({ theme, expanded }) => ({
  cursor: "pointer",
  transition: "all 1.8s ease-in-out",
}));

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

const DatasetLogs = (props) => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const { datasetId } = props;
  const dispatch = useDispatch();
  const { dark } = useTheme();
  const [displayWidth, setDisplayWidth] = useState(0);
  const DatasetLogs = useSelector((state) => state.GetDatasetLogs?.data);
  const [taskName, setTaskName] = useState("projects.tasks.export_project_in_place");
  const [columns, setColumns] = useState([]);
  const [datasetLogs, setDatasetLogs] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectRange, setSelectRange] = useState([{
    startDate: addMonths(new Date(), -3),
    endDate: new Date(),
    key: "selection"
  }]);
  const [expandedRow, setExpandedRow] = useState(null);

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

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    if (DatasetLogs?.length) {
      let tempLogs = JSON.parse(JSON.stringify(DatasetLogs));
      tempLogs = tempLogs.filter((log) => {
        const date = parse(log.date, 'dd-MM-yyyy', new Date());
        return date >= selection.startDate && date <= selection.endDate;
      });
      setDatasetLogs(tempLogs);
    }
  };

  useEffect(() => {
    const apiObj = ({ instanceId: datasetId, taskName: taskName });
    dispatch(fetchDatasetLogs(apiObj));
    setShowSpinner(true);
    setSelectRange([{
      startDate: addMonths(new Date(), -3),
      endDate: new Date(),
      key: "selection"
    }]);
  }, [taskName]);

  useEffect(() => {
    if (DatasetLogs?.length) {
      let tempColumns = [];
      Object.keys(DatasetLogs[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: key === 'status',
            sort: false,
            align: "center",
            setCellProps: () => ({ style: { width: 200, maxWidth: 400 } }),
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
      setColumns(tempColumns);
      setDatasetLogs(DatasetLogs);
    } else {
      setColumns([]);
      setDatasetLogs([]);
    }
    setShowSpinner(false);
  }, [DatasetLogs, expandedRow]);

  const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
    return (
     <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: { xs: "space-between", md: "flex-end" },
    alignItems: "center",
    padding: "10px",
    gap: { xs: "10px", md: "20px" },
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
  color: dark ? "#a0a0a0" : "",
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
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" },
    "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" },
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
    filterType: 'checkbox',
    selectableRows: "none",
    download: false,
    filter: true,
    print: false,
    search: false,
    viewColumns: true,
    jumpToPage: true,
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
  <React.Fragment>
    <Box sx={{ backgroundColor: dark ? "#1e1e1e" : "", borderRadius: dark ? "8px" : "", p: dark ? 1 : 0 }}>
    <Grid
      container
      direction="row"
      spacing={3}
      sx={{
        marginBottom: "24px",
      }}
    >

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small" variant="outlined"  sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
  <InputLabel
  id="task-type-filter-label"
  sx={{
    fontSize: "16px",
    color: dark ? "#a0a0a0" : ""
  }}
>
  Filter by Task Type
</InputLabel>
  <Select
  labelId="task-type-filter-label"
  id="task-type-filter"
  value={taskName}
  label="Filter by Task Type"   // ✅ THIS is required for notch
  onChange={(e) => setTaskName(e.target.value)}
  sx={{
    fontSize: "16px",
    color: dark ? "#ececec" : "",
    backgroundColor: dark ? "#2a2a2a" : "",
    "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" }
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: dark ? "#2a2a2a" : "",
        color: dark ? "#ececec" : "",
        border: dark ? "1px solid #3a3a3a" : ""
      }
    }
  }}
>
              {['dataset.tasks.upload_data_to_data_instance', 'projects.tasks.export_project_new_record', 'projects.tasks.export_project_in_place'].map((el, i) => (
                <MenuItem key={i} value={el}>{el}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            variant="contained"
            color="primary"
            onClick={() => setShowPicker(!showPicker)}
          >
            Pick Dates
          </Button>
        </Grid>
        {showPicker && <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
          <Card>
            <DateRangePicker
              onChange={handleRangeChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              ranges={selectRange}
              maxDate={new Date()}
              direction="horizontal"
            />
          </Card>
        </Box>} */}
      </Grid>
      {showSpinner ? <Spinner /> : (
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
      "& .MuiCheckbox-root": { color: "#fb923c" },
    })
  }}>
    <MUIDataTable
      key={`table-${displayWidth}`}
      title={""}
      data={datasetLogs}
      columns={columns}
      options={{
        ...options,
        tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
      }}
    />
  </Box>
</ThemeProvider>)
      }
    </Box>
  </React.Fragment>
);
};

export default DatasetLogs;

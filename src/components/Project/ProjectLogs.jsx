import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import {
  ThemeProvider,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";
import CustomizedSnackbars from "../common/Snackbar";
import { addMonths, parse } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { useParams } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { snakeToTitleCase } from "@/utils/utils";
import tableTheme from "@/themes/tableTheme";
import Spinner from "@/components/common/Spinner";
import GetProjectLogsAPI from "@/app/actions/api/Projects/getProjectLogsAPI";
import { styled } from "@mui/material/styles";


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


const ProjectLogs = () => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const { id } = useParams();
  const [taskName, setTaskName] = useState(
    "projects.tasks.export_project_in_place",
  );
  const [displayWidth, setDisplayWidth] = useState(0);
  const [columns, setColumns] = useState([]);
  const [projectLogs, setProjectLogs] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectRange, setSelectRange] = useState([
    {
      startDate: addMonths(new Date(), -3),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [allLogs, setAllLogs] = useState([]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    if (allLogs.length) {
      let tempLogs = JSON.parse(JSON.stringify(allLogs));
      tempLogs = tempLogs.filter((log) => {
        const date = parse(log.date, "dd-MM-yyyy", new Date());
        return date >= selection.startDate && date <= selection.endDate;
      });
      setProjectLogs(tempLogs);
    }
  };

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
    getProjectLogs();
    setSelectRange([
      {
        startDate: addMonths(new Date(), -3),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  }, [taskName]);

  const getProjectLogs = () => {
    setLoading(true);
    const apiObj = new GetProjectLogsAPI(id, taskName);
    fetch(apiObj.apiEndPoint(), {
      method: "GET",
      headers: apiObj.getHeaders().headers,
    })
      .then(async (res) => {
        setLoading(false);
        if (res.status == 204) {
          setSnackbarInfo({
            open: true,
            message: "No content Available",
            variant: "error",
          })
          return [];
        } else {
          return await res.json()
        };
      })
      .then((res) => {
        setAllLogs(res);
      })
      .catch();
  };

  useEffect(() => {
    if (allLogs.length) {
      let tempColumns = [];
      Object.keys(allLogs[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: key === "status",
            sort: false,
            align: "center",
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
      setProjectLogs(allLogs);
    } else {
      setColumns([]);
      setProjectLogs([]);
    }
  }, [allLogs, expandedRow]);
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
    filterType: "checkbox",
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
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="task-type-filter-label" sx={{ fontSize: "16px" }}>
              Filter by Task Type
            </InputLabel>
            <Select
              labelId="task-type-filter-label"
              id="task-type-filter"
              value={taskName}
              label="Filter by Task Type"
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
              sx={{ fontSize: "16px" }}
            >
              {[
                "projects.tasks.add_new_data_items_into_project",
                "projects.tasks.create_parameters_for_task_creation",
                "projects.tasks.export_project_in_place",
                "projects.tasks.pull_new_data_items_into_project",
                "projects.tasks.export_project_new_record",
              ].map((el, i) => (
                <MenuItem key={i} value={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <Button
            endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            variant="contained"
            color="primary"
            onClick={() => setShowPicker(!showPicker)}
            fullWidth
          >
            Pick Dates
          </Button>
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
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={selectRange}
                maxDate={new Date()}
                direction="horizontal"
              />
            </Card>
          </Box>
        )}
      </Grid>
      {loading ? (
        <Spinner />
      ) : (
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            key={`table-${displayWidth}`}
            title={""}
            data={projectLogs}
            columns={columns}
            options={{
              ...options,
              tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
            }}
          />
        </ThemeProvider>
      )}
    </React.Fragment>
  );
};

export default ProjectLogs;

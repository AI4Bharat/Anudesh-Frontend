import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Button,Card, FormControl, Grid, InputLabel, MenuItem, Select, ThemeProvider } from "@mui/material";
import { addMonths, parse } from 'date-fns/esm';
import { DateRangePicker } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import tableTheme from "../../themes/tableTheme";
import Spinner from "../components/common/Spinner";

const ProjectLogs = () => {
  const [taskName, setTaskName] = useState("projects.tasks.export_project_in_place"); 
  const [columns, setColumns] = useState([]);
  const [projectLogs, setProjectLogs] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectRange, setSelectRange] = useState([{
    startDate: addMonths(new Date(), -3),
    endDate: new Date(),
    key: "selection"
  }]);
  const [allLogs, setAllLogs] = useState([]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
  
    let tempLogs = [...projectLogs]; 
    tempLogs = tempLogs.filter((log) => {
      const date = parse(log.date, 'dd-MM-yyyy', new Date());
      return date >= selection.startDate && date <= selection.endDate;
    });
    setProjectLogs(tempLogs);
  };


  useEffect(() => {
    if (allLogs.length) {
      let tempColumns = [];
      Object.keys(allLogs[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: key === 'status',
            sort: false,
            align: "center"
          },
        });
      });
      setColumns(tempColumns);
      setProjectLogs(allLogs);
    } else {
      setColumns([]);
      setProjectLogs([]);
    }
  }, [allLogs]);

  const options = {
    filterType: 'checkbox',
    selectableRows: "none",
    download: false,
    filter: true,
    print: false,
    search: false,
    viewColumns: true,
    jumpToPage: true,
  };

  return (
    <>
      <Grid container direction="row" spacing={3} sx={{ marginBottom: "24px" }}>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="task-type-filter-label" sx={{fontSize: "16px"}}>Filter by Task Type</InputLabel>
            <Select
      labelId="task-type-filter-label"
      id="task-type-filter"
      value={taskName}
      label="Filter by Task Type"
      onChange={handleTaskChange}
      sx={{ fontSize: "16px" }}
    >
      {[
        'projects.tasks.add_new_data_items_into_project',
        'projects.tasks.create_parameters_for_task_creation',
        'projects.tasks.export_project_in_place',
        'projects.tasks.pull_new_data_items_into_project',
        'projects.tasks.export_project_new_record'
      ].map((el, i) => (
        <MenuItem key={i} value={el}>
          {el}
        </MenuItem>
      ))}
    </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button 
            endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />} 
            variant="contained" 
            color="primary" 
            onClick={() => setShowPicker(!showPicker)}
          >
            Pick Dates
          </Button>
        </Grid>
        {showPicker && <Box sx={{mt: 2, display: "flex", justifyContent: "center", width: "100%"}}>
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
          </Box>}
      </Grid>
      {loading ? <Spinner /> : 
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={""}
            data={projectLogs}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      }
    </>
  );
};

export default ProjectLogs;



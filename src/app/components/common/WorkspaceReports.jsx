// WorkspaceReports

import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Card,
  Box,
  Button,
  Grid,
  ThemeProvider,
  Radio, Typography,
} from "@mui/material";
import tableTheme from "../../../themes/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useParams } from "react-router-dom";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../common/ColumnList";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import { MenuProps } from "../../../../utils/utils";
import CustomizedSnackbars from "./Snackbar";

const ProgressType = [{ name: "Annotation Stage", value: 1 }, { name: "Review Stage", value: 2 }, { name: "Super Check Stage", value: 3 }, { name: "All Stage", value: "AllStage" }]

const WorkspaceReports = () => {
  
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [participationTypes, setParticipationTypes] = useState([1, 2, 4]);
  const [radioButton, setRadioButton] = useState("project");
  const [language, setLanguage] = useState("all");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportRequested, setReportRequested] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [projectType, setProjectType] = useState("AnnotatationReports");
  const [reportfilter, setReportfilter] = useState("AllStage");
  const [projectReportType, setProjectReportType] = useState(1);
  const [statisticsType, setStatisticsType] = useState(1);

  const classes = DatasetStyle();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
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
        <Grid
          container
          direction="row"
          spacing={3}
          sx={{ mt: 1, ml: 1 }}
        >

          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}  >
            <Typography gutterBottom component="div" sx={{ marginTop: "10px", fontSize: "16px", }}>
              Select Report Type :
            </Typography>
          </Grid >
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}  >
            <FormControl>

              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginTop: "5px" }}
                value={radioButton}
                // onChange={handleChangeReports}

              >
                <FormControlLabel value="user" control={<Radio />} label="Users Reports" />
                <FormControlLabel value="project" control={<Radio />} label="Project Reports" />
                <FormControlLabel value="payment" control={<Radio />} label="Payment Reports" />
              </RadioGroup>
            </FormControl>
          </Grid >
        </Grid >
        {radioButton === "project" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="project-report-type-label" sx={{ fontSize: "16px" }}>Type</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              // MenuProps={MenuProps}
              labelId="project-report-type-type-label"
              id="project-report-type-select"
              value={projectReportType}
              label="Project Report Type"
              onChange={(e) => setProjectReportType(e.target.value)}
            >
              <MenuItem value={1}>High-Level Reports</MenuItem>
              <MenuItem value={2}>Detailed Reports</MenuItem>
            </Select>
          </FormControl>
        </Grid>}

        {(radioButton !== "project") && <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="report-type-label" sx={{ fontSize: "16px" }}>
              Report Type
            </InputLabel>
            <Select
              labelId="report-type-label"
              id="report-select"
              value={projectType}
              label="Report Type"
              onChange={(e) => setProjectType(e.target.value)}
              MenuProps={MenuProps}
            >
              <MenuItem value={"AnnotatationReports"}>Annotator</MenuItem>
              <MenuItem value={"ReviewerReports"}>Reviewer</MenuItem>
              <MenuItem value={"SuperCheckerReports"}>Super Checker</MenuItem>
            </Select>
          </FormControl>
        </Grid>}
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
              Project Type
            </InputLabel>
            <Select
              labelId="project-type-label"
              id="project-type-select"
              value={selectedType}
              label="Project Type"
              onChange={(e) => setSelectedType(e.target.value)}
            >
           
            </Select>
          </FormControl>
        </Grid>
        {radioButton === "user" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small" disabled={projectType === "SuperCheckerReports"} >
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Projects Filter</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              // MenuProps={MenuProps}
              labelId="project-type-label"
              id="project-type-select"
              value={reportfilter}
              label="Projects Filter"
              onChange={handleChangeprojectFilter}
            >
              {FilterProgressType.map((type, index) => (
                <MenuItem value={type.value} key={index}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>}
        {(radioButton !== "payment") && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-label" sx={{ fontSize: "16px" }}>
              Target Language
            </InputLabel>
            <Select
              labelId="language-label"
              id="language-select"
              value={language}
              label="Target Language"
              onChange={(e) => setLanguage(e.target.value)}
              // MenuProps={MenuProps}
            >
              <MenuItem value={"all"}>All languages</MenuItem>
              {/* {LanguageChoices.language?.map((lang) => (
                <MenuItem value={lang} key={lang}>
                  {lang}
                </MenuItem>
              ))} */}
            </Select>
          </FormControl>
        </Grid>}
        {(radioButton === "project" && projectReportType === 2) &&  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="statistics-label" sx={{ fontSize: "16px" }}>Statistics</InputLabel>
            <Select
              labelId="statistics-label"
              id="statistics-select"
              value={statisticsType}
              label="Statistics"
              onChange={(e) => setStatisticsType(e.target.value)}
              // MenuProps={MenuProps}
            >
            <MenuItem value={1}>Annotation Statistics</MenuItem>
            <MenuItem value={2}>Meta-Info Statistics</MenuItem>
            <MenuItem value={3}>Complete Statistics</MenuItem>
          </Select>
          </FormControl>
        </Grid>}
        {radioButton === "payment" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="participation-type-label" sx={{ fontSize: "16px" }}>Participation Types</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              // MenuProps={MenuProps}
              labelId="participation-type-label"
              id="participation-select"
              value={participationTypes}
              label="Participation Type"
              onChange={(e) => setParticipationTypes(e.target.value)}
              multiple
            >
              <MenuItem value={1}>Full-time</MenuItem>
              <MenuItem value={2}>Part-time</MenuItem>
              <MenuItem value={4}>Contract-Basis</MenuItem>
            </Select>
          </FormControl>
        </Grid>}
        {(radioButton === "user" || radioButton === "payment") &&
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              sx={{ width: "130px" }}
              onClick={() => setShowPicker(!showPicker)}
            >
              Pick Dates
            </Button>
          </Grid>
        }

        {(radioButton==="user" || (radioButton==="project" && projectReportType === 1)) && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleDateSubmit(false)}
            sx={{ width: "130px" }}
          >
            Submit
          </Button>
        </Grid>}
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleDateSubmit(true)}
            sx={{ width: "130px" }}
          >
            E-mail CSV
          </Button>
        </Grid>
      </Grid>
      {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
        <Card>
          <DateRangePicker
            // onChange={handleRangeChange}
            staticRanges={[
              ...defaultStaticRanges,
              {
                label: "Till Date",
                range: () => ({
                  startDate: new Date(Date.parse(WorkspaceDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                  endDate: new Date(),
                }),
                isSelected(range) {
                  const definedRange = this.range();
                  return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                  );
                }
              },
            ]}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={selectRange}
            minDate={new Date(Date.parse(WorkspaceDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
            maxDate={new Date()}
            direction="horizontal"
          />
        </Card>
      </Box>}
      {showSpinner ? <div></div> : reportRequested && (
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={ProjectReports.length > 0 ? "Reports" : ""}
            data={reportData}
            columns={columns.filter((col) => selectedColumns.includes(col.name))}
            options={options}
          />
        </ThemeProvider>)
      }
      {/* <Grid
          container
          justifyContent="center"
        >
          <Grid item sx={{mt:"10%"}}>
            {showSpinner ? <div></div> : (
              !reportData?.length && submitted && <>No results</>
            )}
          </Grid>
        </Grid> */}
    </React.Fragment>
  );
};

export default WorkspaceReports;

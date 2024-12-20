// OrganizationReports

import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Button, Grid, ThemeProvider, Card, Radio, Typography, FormGroup, Checkbox, ListItemText, ListItemIcon, Paper } from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import tableTheme from "../../themes/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ColumnList from "../common/ColumnList";
import Select from "@mui/material/Select";
import { useParams } from 'react-router-dom';
import  "../../styles/Dataset.css";
import DatasetStyle from "@/styles/dataset";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from '@mui/material/styles';
import { addDays } from 'date-fns';
import { isSameDay, format } from 'date-fns';
import {useDispatch,useSelector} from "react-redux"
import CustomizedSnackbars from "../common/Snackbar";
import { fetchProjectDomains } from "@/Lib/Features/getProjectDomains";
import { fetchLanguages } from "@/Lib/Features/fetchLanguages";
import { fetchOrganizationUserReports } from "@/Lib/Features/projects/GetOrganizationUserReports";
import { fetchOrganizationProjectReports } from "@/Lib/Features/projects/GetOrganizationProjectReports";
import { fetchOrganizationDetailedProjectReports } from "@/Lib/Features/projects/GetOrganizationDetailedProjectReports";
import { fetchSendOrganizationUserReports } from "@/Lib/Features/projects/SendOrganizationUserReports";
import {CircularProgress} from "@mui/material";

const ProgressType = ["Annotation Stage", "Review Stage", "Super Check Stage", "All Stage"]
const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
};

const participationTypesOptions = [
  { value: 1, label: "Full-time" },
  { value: 2, label: "Part-time" },
  { value: 4, label: "Contract-Basis" }
];


const OrganizationReports = () => {
  const OrganizationDetails = useSelector(state => state.getLoggedInData?.data.organization);
  const UserDetails = useSelector(state => state.getLoggedInData.data);
  const [selectRange, setSelectRange] = useState([{
    startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
    endDate: new Date(),
    key: "selection"
  }]);
  // const [rangeValue, setRangeValue] = useState([format(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'), Date.now()]);
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [participationTypes, setParticipationTypes] = useState([1, 2, 4]);
  const [selectedType, setSelectedType] = useState("");
  const [reportType, setReportType] = useState("project");
  const [targetLanguage, setTargetLanguage] = useState("all");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportRequested, setReportRequested] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [reportTypes, setReportTypes] = useState("Annotator");
  const [radiobutton, setRadiobutton] = useState("ProjectReports");
  const [reportfilter, setReportfilter] = useState(["All Stage"]);
  const [projectReportType, setProjectReportType] = useState(1);
  const [statisticsType, setStatisticsType] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  
  const { orgId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const UserReports = useSelector((state) => state.GetOrganizationUserReports.data);
  const ProjectReports = useSelector((state) => state.getOrganizationProjectReports?.data);
  const SuperCheck = useSelector((state) => state.getOrganizationAnnotatorQuality?.data);
  const LanguageChoices = useSelector((state) => state.getLanguages?.data);

  let ProgressTypeValue = "Annotation Stage"
  const filterdata = ProgressType.filter(item => item !== ProgressTypeValue)
  const FilterProgressType = reportTypes === "Reviewer" ? filterdata : ProgressType
/* eslint-disable react-hooks/exhaustive-deps */

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
      setSelectedType(types[3]);
    }
  }, [ProjectTypes, radiobutton]);

  // useEffect(() => {
  //   if (radiobutton === "ProjectReports") {
  //     setProjectTypes([
  //      "ModelOutputEvaluvation",
  //      "ModelInteractionEvaluvation",
  //      "InstructionDrivenChat",
  //     ]);
  //     setSelectedType("InstructionDrivenChat");
      
  //   } 
  // }, [ProjectTypes, radiobutton]);

  // useEffect(() => {
  //   if (radiobutton === "UsersReports") {
  //     setProjectTypes([
  //      "ModelOutputEvaluvation",
  //      "ModelInteractionEvaluvation",
  //      "InstructionDrivenChat",
  //      "MultipleInteractionEvaluation",
  //     ]);
  //     setSelectedType("InstructionDrivenChat");
      
  //   } 
  // }, [ProjectTypes, radiobutton]);
 

  useEffect(() => {
    if (reportRequested && UserReports?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(UserReports[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
            align: "center",
          },
        });
        tempSelected.push(key);
      });
      setColumns(tempColumns);
      setReportData(UserReports);
      setSelectedColumns(tempSelected);
    } else {
      if(emailRequested){
          setSnackbarInfo({
            open: true,
            message: UserReports.message,
            variant: "success",
          })
          setEmailRequested(false);
        }
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
    }
    setShowSpinner(false);
  }, [UserReports]);

  useEffect(() => {
    if (reportRequested && ProjectReports?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(ProjectReports[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
            align: "center",
          },
        });
        tempSelected.push(key);
      });
      setColumns(tempColumns);
      setReportData(ProjectReports);
      setSelectedColumns(tempSelected);
    } else {
      if(emailRequested){
        setSnackbarInfo({
          open: true,
          message: ProjectReports.message,
          variant: "success",
        })
        setEmailRequested(false);
      }
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
    }
    setShowSpinner(false);
  }, [ProjectReports]);

  // useEffect(() => {
  //   if (reportRequested && SuperCheck?.length) {
  //     let tempColumns = [];
  //     let tempSelected = [];
  //     Object.keys(SuperCheck[0]).forEach((key) => {
  //       tempColumns.push({
  //         name: key,
  //         label: key,
  //         options: {
  //           filter: false,
  //           sort: true,
  //           align: "center",
  //         },
  //       });
  //       tempSelected.push(key);
  //     });
  //     setColumns(tempColumns);
  //     setReportData(SuperCheck);
  //     setSelectedColumns(tempSelected);
  //   } else {
  //     setColumns([]);
  //     setReportData([]);
  //     setSelectedColumns([]);
  //   }
  //   setShowSpinner(false);
  // }, [SuperCheck]);
  
  const renderToolBar = () => {
    return (
      <Box
        //className={classes.filterToolbarContainer}
        className={classes.ToolbarContainer}
      >
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
      </Box>
    )
  }


  const options = {
    filterType: 'checkbox',
    selectableRows: "none",
    download: true,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
  };


  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
  };

  const userId = useSelector((state) => state.getLoggedInData.data.id);

  const handleSubmit = (sendMail) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false); 
    },1000)
    if (radiobutton === "PaymentReports") {
    
      dispatch(fetchSendOrganizationUserReports({orgId:orgId,
        userId:UserDetails.id,
        projectType:selectedType,
        participationTypes:participationTypes,
        fromDate:format(selectRange[0].startDate, 'yyyy-MM-dd'),
        toDate:format(selectRange[0].endDate, 'yyyy-MM-dd')}));
      setSnackbarInfo({
        open: true,
        message: "Payment Reports will be e-mailed to you shortly",
        variant: "success",
      })
    }
    else {
      if(sendMail){
        setReportRequested(false);
        setEmailRequested(true);
      }else{
        setReportRequested(true);
      }
      setShowSpinner(true);
      setShowPicker(false);
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
      if (radiobutton === "UsersReports" && reportTypes === "Annotator" && reportfilter == "") {
        setSnackbarInfo({
          open: true,
          message: "Please fill Report Filter",
          variant: "error",
        })
      }
      let ReviewData ;

      if ((reportTypes === "Annotator" || reportTypes === "Reviewer") && reportfilter != "" && radiobutton === "UsersReports") {

        if (reportfilter.toString() == "Annotation Stage") {
          ReviewData=1
        } else if (reportfilter.toString() == "Review Stage") {
          ReviewData=2
        } else if (reportfilter.toString() == "Super Check Stage") {
          ReviewData=3
        }
        dispatch(fetchOrganizationUserReports({orgId:orgId,
          projectType:selectedType,
          startDate:format(selectRange[0].startDate, 'yyyy-MM-dd'),
          endDate:format(selectRange[0].endDate, 'yyyy-MM-dd'),
          reportsType:reportTypes === "Annotator" ? "annotation" : reportTypes === "Reviewer" ? "review" : "supercheck",
          targetLanguage:targetLanguage,
          sendMail:sendMail,
          onlyReviewProjects:ReviewData}));
      } else if ((reportTypes === "SuperCheck" || reportfilter === "All Stage" && radiobutton === "UsersReports")) {
        const supercheckObj = ({orgId:orgId,
          projectType:selectedType,
          startDate:format(selectRange[0].startDate, 'yyyy-MM-dd'),
          endDate:format(selectRange[0].endDate, 'yyyy-MM-dd'),
          reportsType:"supercheck",
          targetLanguage:targetLanguage,
          sendMail:sendMail});
        dispatch(fetchOrganizationUserReports(supercheckObj));
      }
      else if (radiobutton === "ProjectReports") {
        if(projectReportType === 1){
        dispatch(fetchOrganizationProjectReports({orgId:orgId,
          projectType:selectedType,
          targetLanguage:targetLanguage,
          userId:userId,
          sendMail:sendMail}));
        setSnackbarInfo({
          open: true,
          message: "Project Report will be e-mailed to you shortly",
          variant: "success",
        })
      }else if(projectReportType === 2){
        dispatch(fetchOrganizationDetailedProjectReports( {orgId:Number(orgId),
          projectType:selectedType,
          userId:userId,
          statistics:statisticsType}));
        setSnackbarInfo({
          open: true,
          message: "Report will be e-mailed to you shortly",
          variant: "success",
        })
      }
    }
    }
  };

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value)
  }

  const handleChangeprojectFilter = (event) => {
    const value = event.target.value;
    setReportfilter(value);
  }
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
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setParticipationTypes(
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  return (
    <React.Fragment>
      {renderSnackBar()}
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{ mb: 3 }}
      >
        <Grid
          container
          direction="row"
          spacing={3}
          sx={{ mt: 1, ml: 1 }}
        >

          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}  >
            <Typography gutterBottom component="div" sx={{ marginTop: "10px", fontSize: "16px" }}>
              Select Report Type :
            </Typography>
          </Grid >
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}  >
            <FormControl >

              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginTop: "5px" }}
                value={radiobutton}
                onChange={handleChangeReports}

              >
                <FormControlLabel value="UsersReports" control={<Radio />} label="Users Reports" />
                <FormControlLabel value="ProjectReports" control={<Radio />} label="Project Reports" />
                <FormControlLabel value="PaymentReports" control={<Radio />} label="Payment Reports" />
              </RadioGroup>
            </FormControl>
          </Grid >
        </Grid>

        {radiobutton === "ProjectReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <FormControl fullWidth size="small" variant="outlined">
      <InputLabel
        id="project-report-type-label"
        sx={{ fontSize: "19px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >Type</InputLabel>
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
        </Grid>}
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small" >
            <InputLabel id="project-type-label" sx={{ fontSize: "19px" }}>Project Type</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="project-type-label"
              id="project-type-select"
              value={selectedType}
              label="Project Type"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {projectTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {(radiobutton === "ProjectReports" && projectReportType === 1) &&  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="language-label" sx={{ fontSize: "19px" }}>Target Language</InputLabel>
          <Select
            labelId="language-label"
            id="language-select"
            value={targetLanguage}
            label="Target Language"
            onChange={(e) => setTargetLanguage(e.target.value)}
            MenuProps={MenuProps}
          >
            <MenuItem value={"all"}>All languages</MenuItem>
            {LanguageChoices?.language?.map((lang) => (
              <MenuItem value={lang} key={lang}>
                {lang}
              </MenuItem>))}
          </Select>
        </FormControl>
      </Grid>}
      {(radiobutton === "ProjectReports" && projectReportType === 2) &&  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="statistics-label" sx={{ fontSize: "16px" }}>Statistics</InputLabel>
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
      </Grid>}
        {radiobutton === "PaymentReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <FormControl fullWidth size="small">
      <InputLabel id="participation-type-label" sx={{ fontSize: "19px" }}>Participation Types</InputLabel>
      <Select
        style={{ zIndex: "0" }}
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={MenuProps}
        labelId="participation-type-label"
        id="participation-select"
        value={participationTypes}
        label="Participation Type"
        onChange={handleChange}
        multiple
        renderValue={(selected) => selected.map(value => participationTypesOptions.find(option => option.value === value).label).join(', ')}
      >
        {participationTypesOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon>
              <Checkbox checked={participationTypes.indexOf(option.value) > -1} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
        </Grid>}
        {radiobutton === "UsersReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="report-type-label" sx={{ fontSize: "19px" }}> Report Type</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="report-type-label"
              id="report-select"
              value={reportTypes}
              label="Report Type"
              onChange={(e) => setReportTypes(e.target.value)}
            >
              <MenuItem value={"Annotator"}>Annotator</MenuItem>
              <MenuItem value={"Reviewer"}>Reviewer</MenuItem>
              <MenuItem value={"SuperCheck"}>Super Checker</MenuItem>
            </Select>
          </FormControl>
        </Grid>}
        {radiobutton === "UsersReports" && <><Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small" disabled={reportTypes === "SuperCheck" || radiobutton === "ProjectReports"} >
            <InputLabel id="project-type-label" sx={{ fontSize: "19px" }}>Projects Filter</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="project-type-label"
              id="project-type-select"
              value={reportfilter}
              label="Projects Filter"
              onChange={handleChangeprojectFilter}
            >
              {FilterProgressType.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="language-label" sx={{ fontSize: "19px" }}>Target Language</InputLabel>
          <Select
            labelId="language-label"
            id="language-select"
            value={targetLanguage}
            label="Target Language"
            onChange={(e) => setTargetLanguage(e.target.value)}
            MenuProps={MenuProps}
          >
            <MenuItem value={"all"}>All languages</MenuItem>
            {LanguageChoices?.language?.map((lang) => (
              <MenuItem value={lang} key={lang}>
                {lang}
              </MenuItem>))}
          </Select>
        </FormControl>
      </Grid>
      </>}

        {["UsersReports", "PaymentReports"].includes(radiobutton) &&
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              onClick={() => setShowPicker(!showPicker)}
              sx={{ width: "130px" }}
            >
              Pick Dates
            </Button>
          </Grid>
        }

        {(radiobutton==="UsersReports"|| (radiobutton==="ProjectReports" && projectReportType === 1)) && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(false)}
            sx={{ width: "130px" }}
          >
            Submit
          </Button>
        </Grid>}
      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(true)}
            sx={{ width: "130px" }}
          >
            E-mail CSV
          </Button>
        </Grid>
      </Grid>
      {showPicker && <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
        <Card>
          <DateRangePicker
            onChange={handleRangeChange}
            staticRanges={[
              ...defaultStaticRanges,
              {
                label: "Till Date",
                range: () => ({
                  startDate: new Date(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
            minDate={new Date(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
            maxDate={new Date()}
            direction="horizontal"
          />
        </Card>
      </Box>}
      {loading ? <CircularProgress style={{marginLeft: "50%"}} /> : reportRequested && (
        
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={ProjectReports?.length > 0 ? "Reports" : ""}
            data={reportData}
            columns={columns.filter((col) => selectedColumns.includes(col.name))}
            options={options}
          />
        </ThemeProvider>)
      }
      {/*<Grid
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

export default OrganizationReports;

import {
    Button,
    Grid,
    ThemeProvider,
    Typography,
    Select,
    Box,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CircularProgress,
    RadioGroup,
    FormControlLabel,
    Radio,
    TablePagination,
  } from "@mui/material";
  import tableTheme from "../../themes/tableTheme";
  import themeDefault from "../../themes/theme";
  import React, { useEffect, useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  // import Snackbar from "../common/Snackbar";
  // import {
  //   addDays,
  //   addWeeks,
  //   format,
  //   lastDayOfWeek,
  //   startOfMonth,
  //   startOfWeek,
  // } from "date-fns";
//   import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
  import MUIDataTable from "mui-datatables";
  import  "../../styles/Dataset.css";
  import DatasetStyle from "../../styles/dataset";
  import ColumnList from "../common/ColumnList";
  import CustomizedSnackbars from "../common/Snackbar";
  import { isSameDay, format } from 'date-fns';
  import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
  import { DateRangePicker, defaultStaticRanges } from "react-date-range";
  import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
  import ArrowRightIcon from "@mui/icons-material/ArrowRight";
  import { useParams } from "react-router-dom";
  import Spinner from "../../components/common/Spinner";
  import { MenuProps } from "../../utils/utils";
import { fetchProjectDomains } from "@/Lib/Features/getProjectDomains";
import { fetchUserAnalytics } from "@/Lib/Features/user/getUserAnalytics";



  const   MyProgress = () => {
     /* eslint-disable react-hooks/exhaustive-deps */
     const { id } = useParams();
    const UserDetails = useSelector((state) => state.getLoggedInData.data);
    const [selectRange, setSelectRange] = useState([{
      startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
      endDate: new Date(),
      key: "selection"
    }]);
    const [showPicker, setShowPicker] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [radiobutton, setRadiobutton] = useState("AnnotatationReports");
    const [workspaces, setWorkspaces] = useState([]);
    const [totalsummary, setTotalsummary] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);

    const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    const Workspaces = useSelector((state) => state.GetWorkspace.data);
    const UserAnalytics = useSelector((state) => state.getUserAnalytics.data.project_summary);
    const UserAnalyticstotalsummary = useSelector((state) => state.getUserAnalytics.data.total_summary);
    const UserAnalyticstotalsummary1 = useSelector((state) => console.log(state));
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const dispatch = useDispatch();
  /* eslint-disable react-hooks/exhaustive-deps */

    const classes = DatasetStyle();
    useEffect(() => {
      dispatch(fetchProjectDomains());
      // const workspacesObj = new GetWorkspacesAPI(1, 9999);
      // dispatch(APITransport(workspacesObj));
  
    }, []);
    useEffect(() => {
      setLoading(apiLoading);
    }, [apiLoading])

    // useEffect(() => {
    //   if (radiobutton === "AnnotatationReports") {
    //     setProjectTypes([
    //      "ModelOutputEvaluvation",
    //      "ModelInteractionEvaluvation",
    //      "InstructionDrivenChat",
    //     ]);
    //     setSelectedType("InstructionDrivenChat");
        
    //   } 
    // }, [projectTypes, radiobutton]);

    
  
  
    // useEffect(() => {
    //   if (UserDetails && Workspaces?.results) {
    //     let workspacesList = [];
    //     Workspaces.results.forEach((item) => {
    //       workspacesList.push({ id: item.id, name: item.workspace_name });
    //     });
    //     setWorkspaces(workspacesList);
    //     setSelectedWorkspaces(workspacesList.map(item => item.id))
    //     setSelectedType("ContextualTranslationEditing");
    //   }
    // }, [UserDetails, Workspaces]);
  
    useEffect(() => {
      if (ProjectTypes) {
        let types = [];
        Object.keys(ProjectTypes).forEach((key) => {
          let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
          types.push(...subTypes);
        });
        setProjectTypes(types);
        // if (!selectedType && types.length) {
        //   setSelectedType(types[3]); 
        // }
        types?.length && setSelectedType(types[2]);
      }
    }, [ProjectTypes]);
  
    useEffect(() => {
      if (UserAnalytics?.message) {
        setSnackbarText(UserAnalytics?.message);
        showSnackbar();
        return;
      }
      if (UserAnalytics?.length) {
        let tempColumns = [];
        let tempSelected = [];
        Object.keys(UserAnalytics[0]).forEach((key) => {
          tempColumns.push({
            name: key,
            label: key,
            options: {
              filter: false,
              sort: false,
              align: "center",
            },
          });
          tempSelected.push(key);
        });
        setColumns(tempColumns);
        setReportData(UserAnalytics);
        setSelectedColumns(tempSelected);
      } else {
        setColumns([]);
        setReportData([]);
        setSelectedColumns([]);
      }
      setShowSpinner(false);
    }, [UserAnalytics]);
  
    const handleRangeChange = (ranges) => {
      const { selection } = ranges;
      if (selection.endDate > new Date()) selection.endDate = new Date();
      setSelectRange([selection]);
    };
  
    const handleProgressSubmit = () => {
      setShowPicker(false);
      setSubmitted(true);
      const reviewdata = {
        user_id: id,
        project_type: selectedType,
        reports_type: radiobutton === "AnnotatationReports" ? "annotation" : radiobutton === "ReviewerReports" ? "review" : "supercheck",
        start_date: format(selectRange[0].startDate, 'yyyy-MM-dd'),
        end_date: format(selectRange[0].endDate, 'yyyy-MM-dd'),
  
      }
      dispatch(fetchUserAnalytics({progressObj:reviewdata}));
      // setShowSpinner(true);
      setTotalsummary(true)
  
    };
    const showSnackbar = () => {
      setSnackbarOpen(true);
    };
  
    const closeSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setSnackbarOpen(false);
    };
  
    const handleChangeReports = (e) => {
      setRadiobutton(e.target.value)
    }
  
  
    const renderToolBar = () => {
      return (
        <Box className="filterToolbarContainer">
          <ColumnList
            columns={columns}
            setColumns={setSelectedColumns}
            selectedColumns={selectedColumns}
          />
        </Box>
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
              fontSize:"0.83rem", 
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
    
  
    const tableOptions = {
      filterType: "checkbox",
      selectableRows: "none",
      download: false,
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
  
    };
    const tableOptionstotalSummary = {
      filterType: "checkbox",
      selectableRows: "none",
      download: false,
      filter: false,
      print: false,
      search: false,
      viewColumns: false,
      jumpToPage: true,
      customToolbar: renderToolBar,
    };
    const selectedTypeWithDefault = selectedType || "InstructionDrivenChat";
    return (
      <ThemeProvider theme={themeDefault}>
        {/* <Header /> */}
        {loading && <Spinner />}
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          // sx={{ marginLeft: "50px" }}
        >
          <Grid >
            <Typography gutterBottom component="div" sx={{ marginTop: "15px", fontSize: "16px" }}>
              Select Report Type :
            </Typography>
          </Grid>
          <FormControl>
  
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{ marginTop: "10px", marginLeft: "20px" }}
              value={radiobutton}
              onChange={handleChangeReports}
  
            >
              <FormControlLabel value="AnnotatationReports" control={<Radio />} label="Annotator" />
              <FormControlLabel value="ReviewerReports" control={<Radio />} label="Reviewer" />
              <FormControlLabel value="SuperCheckerReports" control={<Radio />} label="Super Checker" />
  
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
  
          <Grid container columnSpacing={4} rowSpacing={2} mt={1} mb={1} justifyContent="flex-start">
  
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
                  Project Type
                </InputLabel>
                <Select
                  labelId="project-type-label"
                  id="project-type-select"
                  defaultValue="InstructionDrivenChat"
                  value={selectedTypeWithDefault}
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
            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
              <Button
                endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color="primary"
                sx={{width:"130px"}}
                onClick={() => setShowPicker(!showPicker)}
              >
                Pick Dates
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleProgressSubmit}
                sx={{width:"130px"}}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
            <Card sx={{ overflowX: "scroll" }}>
              <DateRangePicker
                onChange={handleRangeChange}
                staticRanges={[
                  ...defaultStaticRanges,
                  {
                    label: "Till Date",
                    range: () => ({
                      startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
                minDate={new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
                maxDate={new Date()}
                direction="horizontal"
              />
  
            </Card>
  
  
          </Box>}
          {radiobutton === "AnnotatationReports" && totalsummary && <Grid
            container
            direction="row"
            sx={{ mb: 3, mt: 2 }}
          >
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="h6">Total Summary </Typography>
  
            </Grid>
  
            <Grid
              container
              alignItems="center"
              direction="row"
  
            >
              <Typography variant="subtitle1">Annotated Tasks : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Annotated Tasks"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
  
  
            >
              <Typography variant="subtitle1">Average Annotation Time (In Seconds) : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Avg Annotation Time (sec)"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Word Count : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Word Count"]}</Typography>
            </Grid>
          </Grid>
          }
        
  
          {radiobutton === "ReviewerReports" && totalsummary && <Grid
            container
            alignItems="center"
            direction="row"
            sx={{ mb: 3, mt: 2 }}
  
          >
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="h6">Total Summary </Typography>
  
            </Grid>
  
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Reviewed Tasks : </Typography>
              <Typography variant="body2" className="TotalSummarydata" >{UserAnalyticstotalsummary?.at(0)?.["Reviewed Tasks"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Average Review Time (In Seconds) : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Avg Review Time (sec)"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Word Count : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Word Count"]}</Typography>
            </Grid>
          </Grid>}
          {radiobutton === "SuperCheckerReports" && totalsummary && <Grid
            container
            alignItems="center"
            direction="row"
            sx={{ mb: 3, mt: 2 }}
  
          >
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="h6">Total Summary </Typography>
  
            </Grid>
  
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Super Checker Tasks : </Typography>
              <Typography variant="body2" className="TotalSummarydata" >{UserAnalyticstotalsummary?.at(0)?.["SuperChecked Tasks"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Average Super Checker Time (In Seconds) : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Avg SuperCheck Time (sec)"]}</Typography>
            </Grid>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
  
            >
              <Typography variant="subtitle1">Word Count : </Typography>
              <Typography variant="body2" className="TotalSummarydata">{UserAnalyticstotalsummary?.at(0)?.["Word Count"]}</Typography>
            </Grid>
          </Grid>}
          {UserAnalytics?.length > 0 ? (
            <ThemeProvider theme={tableTheme}>
              <MUIDataTable
               title={radiobutton==="AnnotatationReports"? "Annotation Report" :radiobutton==="ReviewerReports"? "Reviewer Report":"Super Checker Report"}
                data={reportData}
                columns={columns.filter((col) => selectedColumns.includes(col.name))}
                options={tableOptions}
              />
            </ThemeProvider>
          ) : <Grid
            container
            justifyContent="center"
          >
            <Grid item sx={{ mt: "10%" }}>
              {showSpinner ? <CircularProgress color="primary" size={50} /> : (
                !reportData?.length && submitted && <>No results</>
              )}
            </Grid>
          </Grid>
          }
        </Grid>
        <CustomizedSnackbars message={snackbarText} open={snackbarOpen} hide={2000} handleClose={closeSnackbar} anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }} variant="error" />
      </ThemeProvider>
    );
  };
  
  export default MyProgress;
  

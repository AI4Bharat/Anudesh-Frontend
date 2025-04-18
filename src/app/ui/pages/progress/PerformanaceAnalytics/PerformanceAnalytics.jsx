import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, 
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Grid,
  Select,
  Box,
  MenuItem,
  Radio,
  InputLabel,
  FormControl,
  Card,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from '@mui/material/CircularProgress';
import { MenuProps } from "@/utils/utils";
import { DateRangePicker } from "react-date-range";
import {
  addDays,
  isSameDay,
  format
} from "date-fns";
import { modifiedStaticRanges } from "@/utils/Date_Range/getDateRangeFormat";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";
import PerformanceAnalyticsAPI from "@/app/actions/api/Progress/PerformanceAnalytics";
import { fetchDomains } from "@/Lib/Features/actions/domains";
import {fetchLanguages} from "@/Lib/Features/fetchLanguages";
import CustomizedSnackbars from "@/components/common/Snackbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // 1. Register Filler plugin
);
ChartJS.register(CategoryScale);

const ProgressType = [{ ProgressTypename: "daily" }, { ProgressTypename: "weekly" }, { ProgressTypename: "monthly" }, { ProgressTypename: "yearly" }]
const AudioTypes = ["AcousticNormalisedTranscriptionEditing", "AudioSegmentation", "AudioTranscription", "AudioTranscriptionEditing"]

const footer = (tooltipItems) => {
  let sum = 0;
  tooltipItems.forEach(function (tooltipItem) {
    sum += tooltipItem.parsed.y;
  });
  return "Sum: " + sum;
};

const labelChart = function (context) {
  let label = context.dataset.label || "";
  let dataVal = context.parsed.y;
};
const options = {
  responsive: true,
  tension: 0.2,
  scales: {
    x: {
      grid: {
        display: false,
      },
      display: true,
      title: {
        display: true,
        text: "Date Range",
        color: "black",
        font: {
          family: "Roboto",
          size: 16,
          weight: "bold",
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
    },
    y: {
      stacked: true,
      display: true,
      title: {
        display: true,
        text: "Compleated Count",
        color: "#black",
        font: {
          family: "Roboto",
          size: 16,
          style: "normal",
          weight: "bold",
          lineHeight: 1.2,
          paddingBottom: "100px",
        },
        padding: { top: 20, left: 0, right: 0, bottom: 20 },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
    },
    tooltip: {
      callbacks: {
        footer: footer,
        label: labelChart,
      },
    },
  },
};

export default function PerformanceAnalytics() {
     /* eslint-disable react-hooks/exhaustive-deps */

  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [radiobutton, setRadiobutton] = useState("Annotation");
  const [metaInfo, setMetaInfo] = useState(false);
  const [selectedType, setSelectedType] = useState("InstructionDrivenChat");
  const [projectTypes, setProjectTypes] = useState([]);
  const [language, setLanguage] = useState("Hindi");
  const [showPicker, setShowPicker] = useState(false);
  const [baseperiod, setBaseperiod] = useState("daily")
  const [performanceAnalyticsTasksData, setPerformanceAnalyticsTasksData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  

  const ref = useRef();
  var now = new Date();
  var currentYear = now.getFullYear();
  const [baseperiodDatepicker, setBaseperiodDatepicker] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.getLoggedInData.data);
  const ProjectTypes = useSelector((state) => state.domains.domains);
  const LanguageChoices = useSelector((state) => state.getLanguages.data);

  useEffect(() => {
    dispatch(fetchDomains());
    dispatch(fetchLanguages());
  }, []);

  // useEffect(() => {
  //   if (radiobutton === "annotation") {
  //     setProjectTypes([
  //      "ModelOutputEvaluvation",
  //      "ModelInteractionEvaluvation",
  //      "InstructionDrivenChat",
  //     ]);
  //     setSelectedType("InstructionDrivenChat");
      
  //   } 
  // }, [ProjectTypes, radiobutton]);

  // useEffect(() => {
  //   if (radiobutton === "Review") {
  //     setProjectTypes([
  //      "ModelOutputEvaluvation",
  //      "ModelInteractionEvaluvation",
  //      "InstructionDrivenChat",
  //     ]);
  //     setSelectedType("InstructionDrivenChat");
      
  //   } 
  // }, [ProjectTypes, radiobutton]);

  // useEffect(() => {
  //   if (radiobutton === "Supercheck") {
  //     setProjectTypes([
  //      "ModelOutputEvaluvation",
  //      "ModelInteractionEvaluvation",
  //      "InstructionDrivenChat",
  //     ]);
  //     setSelectedType("InstructionDrivenChat");
      
  //   } 
  // }, [ProjectTypes, radiobutton]);

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value);
  };

  const handleCloseDatepicker = (e) => {
    setShowPicker(!showPicker);
  };

  const handleSubmit = async () => {
    console.log(selectedType);
    setShowPicker(false)
    setLoading(true);
    metaInfo?
    AudioTypes.includes(selectedType)?
    options["scales"]["y"]["title"]["text"]="Compleated Audio Duration(Hrs)":
    options["scales"]["y"]["title"]["text"]="Compleated Word Count":
    options["scales"]["y"]["title"]["text"]="Compleated Tasks Count"
    const OrgId = typeof(userDetails?.organization?.id) === Number?userDetails?.organization?.id : 1
    const payload = {
      project_type: selectedType,
      periodical_type: baseperiod,
      language : language,
      start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
      end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'), 
      ...(radiobutton==="Review" && {reviewer_reports:true})    ,
      ...(radiobutton==="Supercheck" && {supercheck_reports:true})
      };
    const performanceAnalyticsAPIObj = new PerformanceAnalyticsAPI(payload, OrgId, metaInfo);
    await axios.post(performanceAnalyticsAPIObj.apiEndPoint(), performanceAnalyticsAPIObj.getBody(), performanceAnalyticsAPIObj.getHeaders())
    .then(response => {
        if (response.statusText === "OK") {
        setPerformanceAnalyticsTasksData(response.data);
        setTimeout(() => {
          setLoading(false); 
        },1000)
        // setLoading(false);
        } else {
          setTimeout(() => {
            setLoading(false); 
          },1000)
        //setLoading(false);
        setPerformanceAnalyticsTasksData([])
        }
    })

    
    .catch(err => {
      setTimeout(() => {
        setLoading(false); 
      },1000)
        //setLoading(false);
        setPerformanceAnalyticsTasksData([])
    })
  };
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleProgressType = (e) => {
    setBaseperiod(e.target.value)
  }

  const handleAnalyticsData = () => {
    let labels = [];
    let entries = [];
    for (let i of performanceAnalyticsTasksData) {
      labels.push(i["date_range"]);
      if (metaInfo && AudioTypes.includes(selectedType)){
        let t = i["data"][0]["periodical_aud_duration"]
        t = t.split(':')
        let hoursInDecimal=parseFloat(parseInt(t[0], 10) + parseInt(t[1], 10)/60 + parseInt(t[2], 10)/3600);
        entries.push(hoursInDecimal)
      }
      else if (metaInfo){
        entries.push(i["data"][0]["periodical_word_count"]);
      }
      else{
        entries.push(i["data"][0]["periodical_tasks_count"]);
      }
    }

    setChartData({
      labels: labels,
      datasets: [
        {
          label: `${metaInfo?"Word Counts":"Task Count"}`,
          data: entries,
          backgroundColor: "rgba(255, 0, 0)",
          fill: {
            target: "origin", // 3. Set the fill options
            above: "rgba(255, 0, 0, 0.3)",
          },
        },
      ],
    });
  };

  useEffect(() => {
    handleAnalyticsData();
  }, [performanceAnalyticsTasksData]);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      types?.length && setSelectedType(types[3]);
    }
  }, [ProjectTypes]);



  return (
    <>
      <Grid container direction="row" spacing={0} sx={{ mb: 1, ml: 1 }}>
        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
          <Typography
            gutterBottom
            component="div"
            sx={{ marginTop: "10px", fontSize: "16px" }}
          >
            Select Report Type :
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{ marginTop: "5px" }}
              value={radiobutton}
              onChange={handleChangeReports}
            >
              <FormControlLabel
                value="Annotation"
                control={<Radio />}
                label="Annotation"
              />
              <FormControlLabel
                value="Review"
                control={<Radio />}
                label="Review"
              />
              <FormControlLabel
                value="Supercheck"
                control={<Radio />}
                label="Supercheck"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid container mb={4}>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            xl={3}
            sx={{ display: "flex", mt: 1 }}
          >
            <Typography
              gutterBottom
              component="div"
              sx={{ fontSize: "16px", mt: 1 }}
            >
              Meta-info based stats:
            </Typography>
            <Checkbox
              onChange={(e) => setMetaInfo(e.target.checked)}
              checked={metaInfo}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px", zIndex: 0 }}>
                    Base period {""}
                  </InputLabel>
                  <Select
                    labelId="project-type-label"
                    id="project-type-select"
                    label="Base period"
                    value={baseperiod}
                    onChange={handleProgressType}
                  >
                    {ProgressType.map((item, index) => (
                        <MenuItem key={index} value={item.ProgressTypename} sx={{ textTransform: "capitalize"}}>{item.ProgressTypename}</MenuItem>  
                    ))}
                  </Select>
                </FormControl>
          </Grid> */}
        </Grid>

        <Grid container columnSpacing={3} rowSpacing={2} mb={1}>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="language-label" sx={{ fontSize: "19px", zIndex: 0 }}>
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
                {/* <MenuItem value={"all"}>All languages</MenuItem> */}
                {LanguageChoices?.language?.map((lang) => (
                  <MenuItem value={lang} key={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" sx={{ fontSize: "19px", zIndex: 0 }}>
                  Plot Range {""}
                  </InputLabel>
                  <Select
                    labelId="project-type-label"
                    id="project-type-select"
                    label="Plot Range"
                    value={baseperiod}
                    onChange={handleProgressType}
                    sx={{ textTransform: "capitalize"}}
                  >
                    {ProgressType.map((item, index) => (
                        <MenuItem key={index} value={item.ProgressTypename} sx={{ textTransform: "capitalize"}}>{item.ProgressTypename}</MenuItem>  
                    ))}
                  </Select>
                </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "19px", zIndex: 0 }}
              >
                Project Type {""}
                {/* {
                    <LightTooltip
                        arrow
                        placement="top"
                        title={translate("tooltip.ProjectType")}>
                        <InfoIcon
                        fontSize="medium"
                        />
                    </LightTooltip>
                    } */}
              </InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedType}
                label="Project Type"
                sx={{ padding: "1px" }}
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
        <div style={{display: "flex"}}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <div>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              onClick={handleCloseDatepicker}
              sx={{
                backgroundColor: "rgba(243, 156, 18)",
                "&:hover": { backgroundColor: "rgba(243, 156, 18 )" },
                marginLeft: "20px",
                marginTop: "18px",
                width: "150px",
                flexShrink: 0,
              }}
            >
              Pick Dates
            </Button>
            </div>
          </Grid>
          </div>
          {/* <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ width: "130px" }}
            >
              Submit
            </Button>
          </Grid> */}
        </Grid>
        <Grid container mt={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ width: "130px" }}
            >
              Submit
            </Button>
          </Grid>
        {showPicker && (
          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
            ref={ref}
          >
            <Card sx={{ overflowX: "scroll" }}>
              <DateRangePicker
                // ranges={[selectionRange]}
                // onChange={handleSelect}
                onChange={(item) => setBaseperiodDatepicker([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                showMonthAndYearPickers={true}
                months={2}
                ranges={baseperiodDatepicker}
                direction="horizontal"
                preventSnapRefocus={true}
                weekStartsOn={1}
                inputRanges={[]}
                staticRanges={[
                  ...modifiedStaticRanges,
                  {
                    label: "This Year",
                    range: () => ({
                      startDate: new Date(
                        Date.parse(currentYear, "yyyy-MM-ddTHH:mm:ss.SSSZ")
                      ),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "Last Year",
                    range: () => ({
                      startDate: new Date(
                        Date.parse(currentYear - 1, "yyyy-MM-ddTHH:mm:ss.SSSZ")
                      ),
                      endDate: new Date(
                        Date.parse(currentYear, "yyyy-MM-ddTHH:mm:ss.SSSZ")
                      ),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                ].filter((staticRange)=>staticRange.label!=="Today" && staticRange.label!=="Yesterday")}
              />
            </Card>
          </Box>
        )}
        {/* </Grid> */}
      </Grid>
      {loading && <Box sx={{ display: 'flex',justifyContent: "center",width: "100%" }}><CircularProgress /></Box>}
      {performanceAnalyticsTasksData?.length && !loading?<Line data={chartData} options={options} />:<div></div> }

      <CustomizedSnackbars
        message={snackbarMessage}
        open={snackbarOpen}
        hide={2000}
        handleClose={closeSnackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        variant="error"
      />
    </>
  );
}

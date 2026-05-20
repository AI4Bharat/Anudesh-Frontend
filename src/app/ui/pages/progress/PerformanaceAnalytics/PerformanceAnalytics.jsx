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



  /* ── Premium style tokens ── */
  const sxCard = {
    background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', p: { xs: 2, sm: 3 }, mb: 3,
  };
  const sxSel = {
    borderRadius: '10px', fontSize: '0.875rem',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316', borderWidth: '1.5px' },
  };
  const sxLbl = { fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563', zIndex: 0 };

  return (
    <>
      <Box sx={sxCard}>
        {/* Report Type */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={12} md={2}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1a1a2e' }}>
              Report Type
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={10}>
            <FormControl>
              <RadioGroup row value={radiobutton} onChange={handleChangeReports}>
                {['Annotation', 'Review', 'Supercheck'].map((val) => (
                  <FormControlLabel key={val} value={val} label={val}
                    control={<Radio sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#f97316' } }} />}
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8125rem', color: '#4b5563' } }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Meta-info */}
        <Grid container sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563' }}>
              Meta-info based stats:
            </Typography>
            <Checkbox
              sx={{ ml: 1, color: '#cbd5e1', '&.Mui-checked': { color: '#f97316' } }}
              onChange={(e) => setMetaInfo(e.target.checked)}
              checked={metaInfo}
            />
          </Grid>
        </Grid>

        {/* Dropdowns Row */}
        <Grid container columnSpacing={2.5} rowSpacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="perf-language-label" sx={sxLbl}>Target Language</InputLabel>
              <Select labelId="perf-language-label" value={language} label="Target Language"
                onChange={(e) => setLanguage(e.target.value)} MenuProps={MenuProps} sx={sxSel}>
                {LanguageChoices?.language?.map((lang) => (
                  <MenuItem value={lang} key={lang} sx={{ fontSize: '0.8125rem' }}>{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="perf-plot-range" sx={sxLbl}>Plot Range</InputLabel>
              <Select labelId="perf-plot-range" label="Plot Range" value={baseperiod}
                onChange={handleProgressType} sx={{ ...sxSel, textTransform: 'capitalize' }}>
                {ProgressType.map((item, index) => (
                  <MenuItem key={index} value={item.ProgressTypename}
                    sx={{ textTransform: "capitalize", fontSize: '0.8125rem' }}>{item.ProgressTypename}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="perf-project-type" sx={sxLbl}>Project Type</InputLabel>
              <Select labelId="perf-project-type" value={selectedType} label="Project Type"
                sx={sxSel} onChange={(e) => setSelectedType(e.target.value)} MenuProps={MenuProps}>
                {projectTypes.map((type, index) => (
                  <MenuItem value={type} key={index} sx={{ fontSize: '0.8125rem' }}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              onClick={handleCloseDatepicker}
              sx={{
                borderRadius: '10px', textTransform: 'none', fontWeight: 600,
                fontSize: '0.8125rem', px: 2.5, height: '40px',
                backgroundColor: '#f97316', boxShadow: 'none',
                '&:hover': { backgroundColor: '#ea580c', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
              }}
            >
              Pick Dates
            </Button>
          </Grid>
        </Grid>

        {/* Submit */}
        <Box sx={{ mt: 1 }}>
          <Button fullWidth={false} variant="contained" onClick={handleSubmit} sx={{
            borderRadius: '10px', textTransform: 'none', fontWeight: 600,
            fontSize: '0.8125rem', px: 3, height: '40px', boxShadow: 'none',
            '&:hover': { boxShadow: '0 2px 8px rgba(249,115,22,0.25)' },
          }}>
            Submit
          </Button>
        </Box>

        {/* Date Picker */}
        {showPicker && (
          <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }} ref={ref}>
            <Card sx={{ overflowX: "scroll", borderRadius: '12px !important', border: '1px solid #e2e8f0 !important' }}>
              <DateRangePicker
                onChange={(item) => setBaseperiodDatepicker([item.selection])}
                showSelectionPreview={true} moveRangeOnFirstSelection={false}
                showMonthAndYearPickers={true} months={2} ranges={baseperiodDatepicker}
                direction="horizontal" preventSnapRefocus={true}
                weekStartsOn={1} inputRanges={[]}
                staticRanges={[
                  ...modifiedStaticRanges,
                  { label: "This Year", range: () => ({ startDate: new Date(Date.parse(currentYear, "yyyy-MM-ddTHH:mm:ss.SSSZ")), endDate: new Date() }),
                    isSelected(range) { const d = this.range(); return isSameDay(range.startDate, d.startDate) && isSameDay(range.endDate, d.endDate); } },
                  { label: "Last Year", range: () => ({ startDate: new Date(Date.parse(currentYear - 1, "yyyy-MM-ddTHH:mm:ss.SSSZ")), endDate: new Date(Date.parse(currentYear, "yyyy-MM-ddTHH:mm:ss.SSSZ")) }),
                    isSelected(range) { const d = this.range(); return isSameDay(range.startDate, d.startDate) && isSameDay(range.endDate, d.endDate); } },
                ].filter((s) => s.label !== "Today" && s.label !== "Yesterday")}
              />
            </Card>
          </Box>
        )}
      </Box>

      {/* Chart */}
      {loading && <Box sx={{ display: 'flex', justifyContent: "center", width: "100%", py: 4 }}><CircularProgress sx={{ color: '#f97316' }} /></Box>}
      {performanceAnalyticsTasksData?.length && !loading ? (
        <Box sx={{
          background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', p: { xs: 2, sm: 3 },
        }}>
          <Line data={chartData} options={options} />
        </Box>
      ) : <div></div>}

      <CustomizedSnackbars
        message={snackbarMessage}
        open={snackbarOpen}
        hide={2000}
        handleClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        variant="error"
      />
    </>
  );
}


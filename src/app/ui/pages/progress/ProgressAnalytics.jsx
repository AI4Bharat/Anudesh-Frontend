import { Button, Grid, ThemeProvider, Select, Box, MenuItem, Radio, InputLabel, FormControl, Card, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import CustomButton from "@/components/common/Button";
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector, useDispatch } from "react-redux";
import themeDefault from "@/themes/theme";
import DatasetStyle from "@/styles/dataset";
import PeriodicalTasks from "@/app/actions/api/Progress/PeriodicalTasks";
import CumulativeTasksAPI from "@/app/actions/api/Progress/CumulativeTasks";
import LightTooltip from '@/components/common/Tooltip';
import { translate } from "@/config/localisation";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import InfoIcon from '@mui/icons-material/Info';
import { Bar } from 'react-chartjs-2';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { addDays, isSameDay, format, minutesToSeconds, hoursToSeconds, secondsToHours } from "date-fns";
import { DateRangePicker, } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import colorsData from "@/utils/Colors_JSON/Colors_JSON";
import axios from "axios";
import html2canvas from 'html2canvas';
import  { modifiedStaticRanges } from "@/utils/Date_Range/getDateRangeFormat";
import { MenuProps } from "@/utils/utils";
import { jsPDF } from "jspdf";
import { fetchDomains } from "@/Lib/Features/actions/domains";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
ChartJS.register(CategoryScale);

const footer = (tooltipItems) => {
  let sum = 0;
  tooltipItems.forEach(function (tooltipItem) {
    sum += tooltipItem.parsed.y;
  });
  return 'Sum: ' + sum;
};

const labelChart = function (context) {
  let label = context.dataset.label || '';
  let dataVal = context.parsed.y;

  if (dataVal && dataVal !== 0 && dataVal !== null) {
    label += " : " + new Intl.NumberFormat('en-US').format(dataVal);
  } else {
    label = ""
  }
  return label;
};
const getWidth = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth;
  }
};

const width = getWidth();

const categoryPercentage = width < 600 ? 0.2 : width < 900 ? 0.5 : 0.6;
const barPercentage = width < 600 ? 0.3 : width < 900 ? 0.6 : 0.7;
const chartHeight = width < 600 ? "300px" : width < 900 ? "350px" : "400px";
const rotationAngle = width < 600 ? 90 : 45; // No rotation for small screens
const fontSize = width < 600 ? 10 : 12;
const chartWidth = width < 600 ? "1200px" : "100%"; // Wider width for small screens


const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "x",
  scales: {
    x: {
      categoryPercentage,
      barPercentage,
      ticks: {
        maxRotation: rotationAngle,
        minRotation: rotationAngle,
        autoSkip: false,
      },
      grid: {
        display: false,
      },
      display: true,
      title: {
        display: true,
        text: 'Language',
        color: 'black',
        font: {
          family: 'Roboto',
          size: fontSize,
          weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
    },
    y: {
      beginAtZero: true,
      stacked: true,
      display: true,
      title: {
        display: true,
        text: '# Annotations Completed ',
        color: '#black',
        font: {
          family: 'Roboto',
          size: 16,
          style: 'normal',
          weight: 'bold',
          lineHeight: 1.2,
          paddingBottom: "100px",
        },
        padding: { top: 20, left: 0, right: 0, bottom: 20 }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
    },
    tooltip: {
      callbacks: {
        footer: footer,
        label: labelChart
      },

    }
  },
};

const TooltipData = [{ name: "Progress chart based on one data selection" }, { name: "Compares progress of two different data selections" }]
const ProgressTypedata = [{ title: "Complete progress for annotations done till date" }, { title: "Yearly stacked progress in selected span of years" }, { title: "Monthly stacked progress in selected span of months" }, { title: "Weekly stacked progress in selected span of weeks" }]
const ChartType = [{ chartTypename: "Individual" }, { chartTypename: "Comparison" }]
const ProgressType = [{ ProgressTypename: "Cumulative" }, { ProgressTypename: "yearly" }, { ProgressTypename: "monthly" }, { ProgressTypename: "weekly" }]
const availableChartType = { Individual: "Individual", Comparison: "Comparison" }

function ProgressList() {
  /* eslint-disable react-hooks/exhaustive-deps */
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const ref = useRef()
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [chartTypes, setChartTypes] = useState("Individual")
  const [baseperiod, setBaseperiod] = useState("Cumulative")
  const [metaInfo, setMetaInfo] = useState(false);
  const [showBarChar, setShowBarChar] = useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const [showPickers, setShowPickers] = useState(false);
  const [comparisonperiod, setComparisonperiod] = useState("monthly");
  const [monthvalue, setmonthvalue] = useState([])
  const [weekvalue, setweekvalue] = useState([])
  const [loading, setLoading] = useState(false);
  const [yearvalue, setyearvalue] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [SVGChartData, setSVGChartData] = useState([]);
  const [radiobutton, setRadiobutton] = useState("Annotation");
  const [baseperiodDatepicker, setBaseperiodDatepicker] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [comparisonperiodDatepicker, setComparisonperiodDatepicker] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [options, setOptions] = useState(defaultOptions);
  const ProjectTypes = useSelector((state) => state.domains.domains);
  const ProjectTypes1 = useSelector((state) => console.log(state));

  const userDetails = useSelector((state) => state.getLoggedInData.data);

  const [CumulativeTasksData, setCumulativeTasksData] = useState([]);
  const [PeriodicalTasksData, setPeriodicalTasksData] = useState([]);
  const [SecondaryPeriodicalTasksData, setSecondaryPeriodicalTasksData] = useState([]);

  useEffect(() => {
    if (PeriodicalTasksData.length > 0) {
      if (PeriodicalTasksData[0].month_number > 0) {
        setmonthvalue(PeriodicalTasksData[0])
      }
      else if (PeriodicalTasksData[0].week_number > 0) {
        setweekvalue(PeriodicalTasksData[0])
      }
      else if (PeriodicalTasksData[0].year_number > 0) {
        setyearvalue(PeriodicalTasksData[0])
      }
    }
  }, [PeriodicalTasksData])

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

  useEffect(() => {
    if (radiobutton === "Annotation") {
      setProjectTypes([
        "ModelOutputEvaluvation",
        "ModelInteractionEvaluation",
        "InstructionDrivenChat",
      ]);
      setSelectedType("InstructionDrivenChat");

    }
  }, [ProjectTypes, radiobutton]);




  useEffect(() => {
    dispatch(fetchDomains());
  }, []);

  const getCumulativeTasksData = async (payload, OrgId) => {
    // setLoading(true);
    const cumulativeTasksAPIObj = new CumulativeTasksAPI(payload, OrgId, metaInfo);
    await axios.post(cumulativeTasksAPIObj.apiEndPoint(), cumulativeTasksAPIObj.getBody(), cumulativeTasksAPIObj.getHeaders())
      .then(response => {
        if (response.statusText === "OK") {
          setCumulativeTasksData(response.data);
          // setLoading(false);
        } else {
          // setLoading(false);
        }
      })
      .catch(err => {
        // setLoading(false);
      })
  }

  const getPeriodicalTasksData = async (payload, OrgId) => {
    // setLoading(true);
    const periodicalTasksAPIObj = new PeriodicalTasks(payload, OrgId, metaInfo);
    await axios.post(periodicalTasksAPIObj.apiEndPoint(), periodicalTasksAPIObj.getBody(), periodicalTasksAPIObj.getHeaders())
      .then(response => {
        if (response.statusText === "OK") {
          setPeriodicalTasksData(response.data);
          // setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      })
  }

  const getSecondaryPeriodicalTasksData = async (payload, OrgId) => {
    setLoading(true);
    const periodicalTasksAPIObj = new PeriodicalTasks(payload, OrgId, metaInfo);
    await axios.post(periodicalTasksAPIObj.apiEndPoint(), periodicalTasksAPIObj.getBody(), periodicalTasksAPIObj.getHeaders())
      .then(response => {
        if (response.statusText === "OK") {
          setSecondaryPeriodicalTasksData(response.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      })
  }

  const handleChartType = (e) => {
    setChartTypes(e.target.value)
  }
  const handleSubmit = async () => {
    setShowBarChar(false);
    if (metaInfo) {
      if (!selectedType.includes("Audio") && !selectedType.includes("Acoustic")) {
        setOptions({
          ...defaultOptions,
          scales: {
            ...defaultOptions.scales,
            y: {
              ...defaultOptions.scales.y,
              title: {
                ...defaultOptions.scales.y.title,
                text: '# Words Completed',
              },
            }
          },
        });
      }
      else {
        setOptions({
          ...defaultOptions,
          scales: {
            ...defaultOptions.scales,
            y: {
              ...defaultOptions.scales.y,
              title: {
                ...defaultOptions.scales.y.title,
                text: '# Audio Duration Transcribed',
              },
              ticks: {
                ...defaultOptions.scales.y.ticks,
                callback: function (value) {
                  if (Math.floor(value) === value)
                    return secondsToHours(value) + new Date(value * 1000).toISOString().substring(13, 19);
                }
              }
            }
          },
          plugins: {
            ...defaultOptions.plugins,
            tooltip: {
              ...defaultOptions.plugins.tooltip,
              callbacks: {
                ...defaultOptions.plugins.tooltip.callbacks,
                label: function (context) {
                  let label = context.dataset.label || '';
                  return label + " : " + context.dataset.time[context.dataIndex];
                },
                footer: (tooltipItems) => {
                  let sum = 0;
                  tooltipItems.forEach(function (tooltipItem) {
                    sum += tooltipItem.parsed.y;
                  });
                  return 'Sum: ' + secondsToHours(sum) + new Date(sum * 1000).toISOString().substring(13, 19);
                }
              }
            }
          }
        });
      }
    } else {
      setOptions({ ...defaultOptions });
    }

    const OrgId = typeof (userDetails?.organization?.id) === Number ? userDetails?.organization?.id : 1
    setShowPicker(false);
    setShowPickers(false);
    // setLoading(true);

    const Cumulativedata = {
      project_type: selectedType,
      ...(radiobutton === "Review" && { reviewer_reports: true }),
      ...(radiobutton === "Supercheck" && { supercheck_reports: true })

    };
    const individualPeriodicaldata = {
      project_type: selectedType,
      periodical_type: baseperiod,
      start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
      end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
      ...(radiobutton === "Review" && { reviewer_reports: true }),
      ...(radiobutton === "Supercheck" && { supercheck_reports: true })
    };

    if (chartTypes === availableChartType.Individual) {

      if (baseperiod === "Cumulative") {
        await getCumulativeTasksData(Cumulativedata, OrgId);
        // const progressObj = new CumulativeTasksAPI(Cumulativedata, OrgId);
        // dispatch(APITransport(progressObj))
      }
      else {
        await getPeriodicalTasksData(individualPeriodicaldata, OrgId)
        // const progressObj = new PeriodicalTasks(individualPeriodicaldata, OrgId);
        // dispatch(APITransport(progressObj));
      }


    }
    else {

      if (comparisonperiod === "Cumulative" && baseperiod === "Cumulative") {

        await getCumulativeTasksData(Cumulativedata, OrgId);

      } else if (comparisonperiod !== "Cumulative" && baseperiod === "Cumulative") {

        const Periodicaldata = {
          project_type: selectedType,
          periodical_type: comparisonperiod,
          start_date: format(comparisonperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(comparisonperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton === "Review" && { reviewer_reports: true }),
          ...(radiobutton === "Supercheck" && { supercheck_reports: true })
        };
        await getPeriodicalTasksData(Periodicaldata, OrgId);
        await getCumulativeTasksData(Cumulativedata, OrgId);

      } else if (comparisonperiod === "Cumulative" && baseperiod !== "Cumulative") {
        const individualPeriodicaldata = {
          project_type: selectedType,
          periodical_type: baseperiod,
          start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton === "Review" && { reviewer_reports: true }),
          ...(radiobutton === "Supercheck" && { supercheck_reports: true })
        };
        await getPeriodicalTasksData(individualPeriodicaldata, OrgId);
        await getCumulativeTasksData(Cumulativedata, OrgId);
      } else {
        const basePeriodicalPayload = {
          project_type: selectedType,
          periodical_type: baseperiod,
          start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton === "Review" && { reviewer_reports: true }),
          ...(radiobutton === "Supercheck" && { supercheck_reports: true })
        };
        const comparisonPeriodicalPayload = {
          project_type: selectedType,
          periodical_type: comparisonperiod,
          start_date: format(comparisonperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(comparisonperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton === "Review" && { reviewer_reports: true }),
          ...(radiobutton === "Supercheck" && { supercheck_reports: true })
        };

        await getPeriodicalTasksData(basePeriodicalPayload, OrgId);
        await getSecondaryPeriodicalTasksData(comparisonPeriodicalPayload, OrgId);

      }
    }
    await handleSwitchBarChartShow();

  }

  const handleSwitchBarChartShow = async () => {
    setShowBarChar(true);
  }

  const handleProgressType = (e) => {
    setBaseperiod(e.target.value)

  }
  const handledatecomparisionprogress = () => {
    setShowPickers(!showPickers)
  }

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value)
  }
  const handleDateRangePicker = (item) => {
    setComparisonperiodDatepicker([item.selection])
  }
  const handleComparisonProgressType = (e) => {
    setComparisonperiod(e.target.value)

  }

  const handleCloseDatepicker = (e) => {
    setShowPicker(!showPicker)
  }

  const keyPress = (e) => {
    if (e.code === "Escape" && setShowPicker(false)) {
      handleCloseDatepicker();
    }
    if (e.code === "Escape" && setShowPickers(false)) {
      handledatecomparisionprogress();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    return () => {
      window.removeEventListener("keydown", keyPress);
    }
  }, [keyPress]);

  const formatDateRangeChartLabel = (dataRangeStr) => {
    let dateRangeArr = dataRangeStr.split("To");
    let newDateRangeArr = [];
    // newDateRangeArr.join
    dateRangeArr?.map((el, i) => {
      let trimmedCurrentDate = el.trim();
      newDateRangeArr.push(trimmedCurrentDate.split("-")[2] + "/" + trimmedCurrentDate.split("-")[1] + "/" + trimmedCurrentDate.split("-")[0]);
    })

    return newDateRangeArr.join(" To ");
  }


  useEffect(() => {
    const checkIfClickedOutside = e => {

      if (showPicker && ref.current && !ref.current.contains(e.target)) {
        setShowPicker(false)
      }
      if (showPickers && ref.current && !ref.current.contains(e.target)) {
        setShowPickers(false)
      }

    }
    if (typeof window !== 'undefined') {
      document.addEventListener("mousedown", checkIfClickedOutside)

    }
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("mousedown", checkIfClickedOutside)

      }
    }
  }, [showPicker, showPickers])

  useEffect(() => {
    const getCumulativeMetaInfo = (e) => {
      let val;
      if (metaInfo) {
        if (selectedType.includes("Audio") || selectedType.includes("Acoustic")) {
          let [hours, minutes, seconds] = e.cumulative_aud_duration.split(":");
          val = hoursToSeconds(hours) + minutesToSeconds(minutes) + parseInt(seconds);
        } else {
          val = e.cumulative_word_count;
        }
      }
      else val = e.cumulative_tasks_count;
      return val;
    };

    const getPeriodicalMetaInfo = (e) => {
      let val;
      if (metaInfo) {
        if (selectedType.includes("Audio") || selectedType.includes("Acoustic")) {
          let [hours, minutes, seconds] = e.periodical_aud_duration.split(":");
          val = hoursToSeconds(hours) + minutesToSeconds(minutes) + parseInt(seconds);
        } else {
          val = e.periodical_word_count;
        }
      }
      else val = e.periodical_tasks_count;
      return val;
    };

    let chData;
    let svgChData;
    if (chartTypes === availableChartType.Individual) {
      if (baseperiod === "Cumulative") {
        svgChData = CumulativeTasksData.map((el, i) => {
          return {
            name: el.language,
            value: getCumulativeMetaInfo(el),
          }
        })
        const labels = CumulativeTasksData && CumulativeTasksData.map((el, i) => el.language)
        chData = {
          labels,
          datasets: [
            {
              label: baseperiod,
              data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
              time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
              stack: "stack 0",
              borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
              borderColor: "white",
              backgroundColor: colorsData.orange[0].color,
              barThickness: 25,
            },
          ],

        };
      } else {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        svgChData = PeriodicalTasksData.map((el, i) => {
          return {
            name: el.date_range,
            value: el.data,
          }
        })
        chData = {
          labels,
          datasets:
            PeriodicalTasksData?.map((el, i) => {
              return {
                label: formatDateRangeChartLabel(el.date_range),
                data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
                time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
                stack: "stack 0",
                borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
                borderColor: "white",
                backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(33, 100%, 48%, 0.05)',
                barThickness: 20,
              }
            }),

        };
      }

    } else {

      if (baseperiod !== "Cumulative" && comparisonperiod !== "Cumulative" && baseperiod === comparisonperiod) {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 0",
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderColor: "white",
            backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(120, 128%, 25%, 0.05)',
            barThickness: 20,
          }
        });

        const SecondaryPeriodicalTasksDataset = SecondaryPeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && selectedType.includes("Audio")) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 1",
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderColor: "white",
            backgroundColor: colorsData.green[i] ? colorsData.green[i].color : 'hsla(33, 100%, 48%, 0.05)',
            barThickness: 20,
          }
        });
        chData = {
          labels,
          datasets: PeriodicalTasksDataset.concat(SecondaryPeriodicalTasksDataset),
        };
      } else if (baseperiod !== "Cumulative" && comparisonperiod !== "Cumulative" && baseperiod != comparisonperiod) {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 0",
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderColor: "white",
            backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(33, 100%, 48%, 0.05)',
            barThickness: 20,
          }
        });

        const SecondaryPeriodicalTasksDataset = SecondaryPeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 1",
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderColor: "white",
            backgroundColor: colorsData.green[i] ? colorsData.green[i].color : 'hsla(120, 128%, 25%, 0.05)',
            barThickness: 20,
          }
        });
        chData = {
          labels,
          datasets: PeriodicalTasksDataset.concat(SecondaryPeriodicalTasksDataset),
        };

      } else if (baseperiod !== "Cumulative" && comparisonperiod === "Cumulative") {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 0",
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderColor: "white",
            backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(33, 100%, 48%, 0.05)',
            barThickness: 20,
          }
        });

        const cumulativeTasksDataset = {
          label: comparisonperiod,
          data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
          time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
          stack: "stack 1",
          borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
          borderColor: "white",
          backgroundColor: colorsData.green[0].color,
          barThickness: 20,
        }
        // CumulativeTasksData.map((e) => (e.cumulative_tasks_count));

        chData = {
          labels,
          datasets: PeriodicalTasksDataset.concat(cumulativeTasksDataset),
        };

      } else if (baseperiod === "Cumulative" && comparisonperiod !== "Cumulative") {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);

        const cumulativeTasksDataset = [{
          label: baseperiod,
          data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
          time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
          stack: "stack 0",
          borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
          borderColor: "white",
          backgroundColor: colorsData.orange[0].color,
          barThickness: 20,
        }]

        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 1",
            borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
            borderColor: "white",
            backgroundColor: colorsData.green[i] ? colorsData.green[i].color : 'hsla(120, 128%, 25%, 0.05)',
            barThickness: 20,
          }
        });
        chData = {
          labels,
          datasets: cumulativeTasksDataset.concat(PeriodicalTasksDataset),
        };
      } else {

        //const labels = baseperiod === "Cumulative" ? CumulativeTasksData.map((e) => (e.language)) : baseperiod === "weekly" ? weekvalue?.data?.map((e) => e.language) : baseperiod === "monthly" ? monthvalue?.data?.map((e) => e.language) : yearvalue?.data?.map((e) => e.language)
        const labels = CumulativeTasksData && CumulativeTasksData.map((el, i) => el.language)
        // const labels = progressTypes === "Cumulative" ? CumulativeTasksData.map((e) => (e.language)) : progressTypes === "weekly" ? weekvalue?.data?.map((e) => e.language) : progressTypes === "monthly" ? monthvalue?.data?.map((e) => e.language) : yearvalue?.data?.map((e) => e.language)

        chData = {
          labels,
          datasets: [

            {
              label: baseperiod,
              data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
              time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
              stack: "stack 0",
              borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
              borderColor: "white",
              backgroundColor: colorsData.orange[0].color,
              barThickness: 20,
            },
            {

              label: comparisonperiod,
              data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
              time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
              stack: "stack 1",
              borderWidth: { top: 2, left: 0, right: 0, bottom: 0 },
              borderColor: "white",
              backgroundColor: colorsData.green[0].color,
              barThickness: 20,
            },

          ],

        };

      }

    }
    setChartData(chData);
    setSVGChartData(svgChData);
  }, [PeriodicalTasksData, SecondaryPeriodicalTasksData, CumulativeTasksData])


  var now = new Date()
  var currentYear = now.getFullYear()



  const ToolTipdata1 = TooltipData.map((el, i) => el.name);

  const downloadReportClick = (type) => {
    if (typeof window !== 'undefined') {
      const srcElement = document.getElementById('chart-container');
      html2canvas(srcElement)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          if (type === "img") {
            let anchorEle = document.createElement("a");
            anchorEle.href = imgData;
            anchorEle.download = "Image.png";
            anchorEle.click();
          } else if (type === "pdf") {
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 10, 10, 180, 150);
            // pdf.output('dataurlnewwindow');
            pdf.save("download.pdf");
          }
        })
    }
  }

  /* ── Premium style tokens ── */
  const sxCard = {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    p: { xs: 2, sm: 3 },
    mb: 3,
    width: '100%',
    minHeight: 400,
  };
  const sxSelect = {
    borderRadius: '10px',
    fontSize: '0.875rem',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f97316', borderWidth: '1.5px' },
  };
  const sxLabel = { fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563' };
  const sxBtn = {
    borderRadius: '10px', textTransform: 'none', fontWeight: 600,
    fontSize: '0.8125rem', px: 3, height: '40px', boxShadow: 'none',
    '&:hover': { boxShadow: '0 2px 8px rgba(249,115,22,0.25)' },
  };
  const sxDateBtn = (color) => ({
    borderRadius: '10px', textTransform: 'none', fontWeight: 600,
    fontSize: '0.8125rem', px: 2.5, height: '40px',
    backgroundColor: color, boxShadow: 'none',
    '&:hover': { backgroundColor: color, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
  });

  return (
    <ThemeProvider theme={themeDefault}>
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

        {/* Meta-info checkbox */}
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
              <InputLabel id="adv-analytics-type" sx={sxLabel}>
                Analytics Type{" "}
                <LightTooltip arrow placement="top" title={translate("tooltip.AnalyticsType")}>
                  <InfoIcon sx={{ color: '#9ca3af', fontSize: '16px' }} />
                </LightTooltip>
              </InputLabel>
              <Select labelId="adv-analytics-type" label="Analytics Type" value={chartTypes} onChange={handleChartType} sx={sxSelect}>
                {ChartType.map((item, index) => (
                  <LightTooltip title={TooltipData[index].name} key={index} placement="left" arrow>
                    <MenuItem value={item.chartTypename} sx={{ fontSize: '0.8125rem' }}>{item.chartTypename}</MenuItem>
                  </LightTooltip>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="adv-project-type" sx={sxLabel}>
                Project Type{" "}
                <LightTooltip arrow placement="top" title={translate("tooltip.ProjectType")}>
                  <InfoIcon sx={{ color: '#9ca3af', fontSize: '16px' }} />
                </LightTooltip>
              </InputLabel>
              <Select labelId="adv-project-type" label="Project Type" value={selectedType} sx={sxSelect}
                onChange={(e) => setSelectedType(e.target.value)} MenuProps={MenuProps}>
                {projectTypes.map((type, index) => (
                  <MenuItem value={type} key={index} sx={{ fontSize: '0.8125rem' }}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Period Controls */}
        <Grid container columnSpacing={2} rowSpacing={2} sx={{ mb: 1 }}>
          {(chartTypes === availableChartType.Individual || chartTypes === availableChartType.Comparison) &&
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="adv-base-period" sx={{ ...sxLabel, color: '#ea580c' }}>
                  Base period{" "}
                  <LightTooltip arrow placement="top" title={translate("tooltip.Baseperiod")}>
                    <InfoIcon sx={{ color: '#9ca3af', fontSize: '16px' }} />
                  </LightTooltip>
                </InputLabel>
                <Select labelId="adv-base-period" label="Base period" value={baseperiod} onChange={handleProgressType} sx={sxSelect}>
                  {ProgressType.map((item, index) => (
                    <LightTooltip title={ProgressTypedata[index].title} key={index} placement="left" arrow>
                      <MenuItem value={item.ProgressTypename} sx={{ textTransform: "capitalize", fontSize: '0.8125rem' }}>{item.ProgressTypename}</MenuItem>
                    </LightTooltip>
                  ))}
                </Select>
              </FormControl>
            </Grid>}

          {!(baseperiod === "Cumulative" || chartTypes === "") &&
            <Grid item xs="auto">
              <Button endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained" onClick={handleCloseDatepicker} sx={sxDateBtn('#f97316')}>
                Pick Dates
              </Button>
            </Grid>}

          {chartTypes === availableChartType.Comparison &&
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="adv-comparison-period" sx={{ ...sxLabel, color: '#16a34a' }}>
                  Comparison Period{" "}
                  <LightTooltip arrow placement="top" title={translate("tooltip.ComparisonPeriod")}>
                    <InfoIcon sx={{ color: '#9ca3af', fontSize: '16px' }} />
                  </LightTooltip>
                </InputLabel>
                <Select labelId="adv-comparison-period" label="Comparison Period" value={comparisonperiod}
                  onChange={handleComparisonProgressType} sx={sxSelect}>
                  {ProgressType.map((item, index) => (
                    <LightTooltip title={ProgressTypedata[index].title} key={index} placement="right" arrow>
                      <MenuItem value={item.ProgressTypename} sx={{ textTransform: "capitalize", fontSize: '0.8125rem' }}>{item.ProgressTypename}</MenuItem>
                    </LightTooltip>
                  ))}
                </Select>
              </FormControl>
            </Grid>}

          {!(comparisonperiod === "Cumulative" || chartTypes === "" || chartTypes === availableChartType.Individual) &&
            <Grid item xs="auto">
              <Button endIcon={showPickers ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained" onClick={handledatecomparisionprogress} sx={sxDateBtn('#16a34a')}>
                Pick Dates
              </Button>
            </Grid>}
        </Grid>

        {/* Submit */}
        <Box sx={{ mt: 2.5 }}>
          <CustomButton label="Submit" sx={sxBtn} onClick={handleSubmit}
            disabled={(baseperiod || comparisonperiod) ? false : true} />
        </Box>

        {/* Date Pickers */}
        {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }} ref={ref}>
          <Card sx={{ overflowX: "scroll", borderRadius: '12px !important', border: '1px solid #e2e8f0 !important' }}>
            <DateRangePicker
              onChange={item => setBaseperiodDatepicker([item.selection])}
              weekStartsOn={1} inputRanges={[]}
              staticRanges={[
                ...modifiedStaticRanges,
                { label: "This Year", range: () => ({ startDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ')), endDate: new Date() }),
                  isSelected(range) { const d = this.range(); return isSameDay(range.startDate, d.startDate) && isSameDay(range.endDate, d.endDate); } },
                { label: "Last Year", range: () => ({ startDate: new Date(Date.parse(currentYear - 1, 'yyyy-MM-ddTHH:mm:ss.SSSZ')), endDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ')) }),
                  isSelected(range) { const d = this.range(); return isSameDay(range.startDate, d.startDate) && isSameDay(range.endDate, d.endDate); } },
              ]}
              showSelectionPreview={true} moveRangeOnFirstSelection={false}
              showMonthAndYearPickers={true} months={2} ranges={baseperiodDatepicker}
              direction="horizontal" preventSnapRefocus={true}
            />
          </Card>
        </Box>}

        {showPickers && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }} ref={ref}>
          <Card sx={{ overflowX: "scroll", borderRadius: '12px !important', border: '1px solid #e2e8f0 !important' }}>
            <DateRangePicker
              onChange={handleDateRangePicker} item
              weekStartsOn={1} inputRanges={[]}
              staticRanges={[
                ...modifiedStaticRanges,
                { label: "This Year", range: () => ({ startDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ')), endDate: new Date() }),
                  isSelected(range) { const d = this.range(); return isSameDay(range.startDate, d.startDate) && isSameDay(range.endDate, d.endDate); } },
                { label: "Last Year", range: () => ({ startDate: new Date(Date.parse(currentYear - 1, 'yyyy-MM-ddTHH:mm:ss.SSSZ')), endDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ') - 86400000) }),
                  isSelected(range) { const d = this.range(); return isSameDay(range.startDate, d.startDate) && isSameDay(range.endDate, d.endDate); } },
              ]}
              showSelectionPreview={true} moveRangeOnFirstSelection={false}
              showMonthAndYearPickers={true} months={2} ranges={comparisonperiodDatepicker}
              direction="horizontal" preventSnapRefocus={true}
            />
          </Card>
        </Box>}

        {/* Chart Output */}
        {showBarChar &&
          <>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 3, mb: 2, flexWrap: 'wrap' }}>
              <Button onClick={() => downloadReportClick("pdf")} sx={{
                ...sxBtn, backgroundColor: '#f8fafc', color: '#4b5563', border: '1px solid #e2e8f0',
                '&:hover': { backgroundColor: '#f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
              }}>Download PDF</Button>
              <Button onClick={() => downloadReportClick("img")} sx={{
                ...sxBtn, backgroundColor: '#f8fafc', color: '#4b5563', border: '1px solid #e2e8f0',
                '&:hover': { backgroundColor: '#f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
              }}>Download Image</Button>
            </Box>
            <Box sx={{
              overflow: "auto", width: "100%", p: 1,
              borderRadius: '12px', border: '1px solid #e5e7eb', background: '#fafafa',
            }}>
              <div id="chart-container" style={{ width: chartWidth, height: chartHeight }}>
                <Bar options={options} data={chartData} />
              </div>
            </Box>
          </>
        }
      </Box>
    </ThemeProvider>
  )
}
export default ProgressList;
// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams, useNavigate,useLocation } from "react-router-dom";
// import GetTasksByProjectIdAPI from "../../../../redux/actions/api/Tasks/GetTasksByProjectId";
import CustomButton from "../common/Button";
// import APITransport from "../../../../redux/actions/apitransport/apitransport";
// import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  ThemeProvider,
} from "@mui/material";
import tableTheme from "../../../themes/tableTheme";
import DatasetStyle from "../../../styles/Dataset";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterList from "./FilterList";
// import PullNewBatchAPI from "../../../../redux/actions/api/Tasks/PullNewBatch";
// import PullNewReviewBatchAPI from "../../../../redux/actions/api/Tasks/PullNewReviewBatch";
// import GetNextTaskAPI from "../../../../redux/actions/api/Tasks/GetNextTask";
// import DeallocateTasksAPI from "../../../../redux/actions/api/Tasks/DeallocateTasks";
// import DeallocateReviewTasksAPI from "../../../../redux/actions/api/Tasks/DeallocateReviewTasks";
// import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
// import SetTaskFilter from "../../../../redux/actions/Tasks/SetTaskFilter";
import CustomizedSnackbars from "../../components/common/Snackbar";
import SearchIcon from "@mui/icons-material/Search";
import SearchPopup from "./SearchPopup";
// import { snakeToTitleCase } from "../../../../utils/utils";
import ColumnList from "../common/ColumnList";
import Spinner from "../../components/common/Spinner";
import OutlinedTextField from "../common/OutlinedTextField";
// import FindAndReplaceDialog from "../../component/common/FindAndReplaceDialog"
// import FindAndReplaceWordsInAnnotationAPI from "../../../../redux/actions/api/ProjectDetails/FindAndReplaceWordsinAnnotation";
import roles from "../../../utils/Role";
import TextField from '@mui/material/TextField';
// import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";


const excludeSearch = ["status", "actions", "output_text"];
// const excludeCols = ["context", "input_language", "output_language", "language",
// "conversation_json", "source_conversation_json", "machine_translated_conversation_json", "speakers_json"
//  ];
const excludeCols = [
  "context",
  "input_language",
  "output_language",
  "conversation_json",
  "source_conversation_json",
  "machine_translated_conversation_json",
  "speakers_json",
  "language",
  "audio_url",
  "speaker_0_details",
  "speaker_1_details",
  "machine_transcribed_json",
  "unverified_conversation_json",
  "prediction_json",
  "ocr_prediction_json",
];

const TaskTable = (props) => {
  const classes = DatasetStyle();
  const id = 2279

  const taskList = [{
    "total_count": 9,
    "result": [
        {
            "id": 3606408,
            "data": {
                "image_url": "https://drive.google.com/uc?id=18g1J8nqTgSyXdm9cLvml4Z-chAqlzhkM&export=download",
                "ocr_prediction_json": [
                    {
                        "x": 40.19867549668874,
                        "y": 59.12347239780868,
                        "text": "URITE OF ",
                        "width": 12.71523178807947,
                        "height": 2.8234302570585754,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 44.30463576158941,
                        "y": 68.52085967130215,
                        "text": "43 AM ",
                        "width": 4.23841059602649,
                        "height": 4.972608512431521,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 56.688741721854306,
                        "y": 8.175305520438265,
                        "text": "ৰহদৈ লিগিৰী ",
                        "width": 27.28476821192053,
                        "height": 4.256215760640539,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 54.37086092715232,
                        "y": 54.656552886641386,
                        "text": "LIBRARY ",
                        "width": 8.874172185430464,
                        "height": 4.9304677623261695,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 67.28476821192054,
                        "y": 59.29203539823009,
                        "text": "SERVICES ",
                        "width": 2.781456953642384,
                        "height": 7.9224610198061525,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 51.05960264900662,
                        "y": 71.47071217867678,
                        "text": "QUWAHATI ",
                        "width": 14.370860927152318,
                        "height": 0.0,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    }
                ]
            },
            "project_id_id": 2279,
            "input_data_id": 12517921,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606409,
            "data": {
                "image_url": "https://drive.google.com/uc?id=1sbXR3uGOa19Y8JomUYDmsOsDVLuE22PH&export=download",
                "ocr_prediction_json": []
            },
            "project_id_id": 2279,
            "input_data_id": 12517922,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606411,
            "data": {
                "image_url": "https://drive.google.com/uc?id=1XJB8HjTnV4yFif0dwqubjg6LF5GOrTWe&export=download",
                "ocr_prediction_json": []
            },
            "project_id_id": 2279,
            "input_data_id": 12517924,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606412,
            "data": {
                "image_url": "https://drive.google.com/uc?id=18CTpomTUZfQiYZovBb-gt0DlwOCxlRMc&export=download",
                "ocr_prediction_json": [
                    {
                        "x": 12.185430463576159,
                        "y": 9.734513274336283,
                        "text": "ৰহদৈ লিগিৰী ",
                        "width": 75.16556291390728,
                        "height": 11.925832279814582,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 53.24503311258278,
                        "y": 23.935946059839868,
                        "text": "ৰজনীকান্ত বৰদলৈ ",
                        "width": 33.37748344370861,
                        "height": 3.8769490096923724,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 65.03311258278146,
                        "y": 30.678466076696164,
                        "text": "সাহিত্য - প্রকাশ ",
                        "width": 20.662251655629138,
                        "height": 5.3097345132743365,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 62.980132450331126,
                        "y": 35.693215339233035,
                        "text": "ট্রিবিউন বিল্ডিংছ গুৱাহাটী -৩ ",
                        "width": 23.973509933774835,
                        "height": 6.447534766118837,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    }
                ]
            },
            "project_id_id": 2279,
            "input_data_id": 12517925,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606413,
            "data": {
                "image_url": "https://drive.google.com/uc?id=1Zkgb3kq3PAzF3vzQBS1up0t3DdAPitVA&export=download",
                "ocr_prediction_json": [
                    {
                        "x": 18.807947019867548,
                        "y": 22.5031605562579,
                        "text": "चिऊ - प्रकाश ",
                        "width": 12.781456953642383,
                        "height": 1.8120522545301307,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.72185430463576,
                        "y": 15.423514538558786,
                        "text": "RAHDOI LIGIREE ",
                        "width": 17.549668874172188,
                        "height": 1.4749262536873156,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.98675496688742,
                        "y": 19.426885798567213,
                        "text": "A historical novel written by Late Rajani Kanta Bardoloi and published by Sahitya - Prakash , Tribune Buildings , Guwahati - 781003 , and Price Rs . 25.00 ( Rupees Twenty five only ) ",
                        "width": 45.29801324503311,
                        "height": 8.175305520438265,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.12582781456954,
                        "y": 30.425621576064053,
                        "text": "* প্রকাশক : ",
                        "width": 11.589403973509933,
                        "height": 1.4749262536873156,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 43.841059602649004,
                        "y": 32.4062368310156,
                        "text": "সাহিত্য - প্ৰকাশ ৷৷ ট্রিবিউন বিল্ডিংছ ৷৷ গুৱাহাটী -৭৮১০০৩ ",
                        "width": 35.894039735099334,
                        "height": 4.593341761483354,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.920529801324506,
                        "y": 40.24441635061104,
                        "text": "* ",
                        "width": 0.1986754966887417,
                        "height": 0.7163927517909818,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 44.03973509933775,
                        "y": 39.78086809945217,
                        "text": "পুনৰ মুদ্ৰণ : ",
                        "width": 12.51655629139073,
                        "height": 1.5170670037926675,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 59.40397350993377,
                        "y": 39.57016434892541,
                        "text": "১৯৪৯ খ্রীঃ ",
                        "width": 8.80794701986755,
                        "height": 1.34850400337126,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 55.76158940397351,
                        "y": 41.97218710493047,
                        "text": ": ১৯৭৩ খ্রীঃ ",
                        "width": 12.781456953642383,
                        "height": 1.5592077538980194,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 56.35761589403974,
                        "y": 44.45849136114623,
                        "text": ": ১৯৮৭ খ্রীঃ ",
                        "width": 12.119205298013245,
                        "height": 1.4749262536873156,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 50.993377483443716,
                        "y": 43.02570585756427,
                        "text": "\" \" ",
                        "width": 1.1920529801324504,
                        "height": 0.4635482511588706,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.85430463576159,
                        "y": 49.05183312262958,
                        "text": "* ",
                        "width": 0.8609271523178808,
                        "height": 0.67425200168563,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 44.23841059602649,
                        "y": 48.88327012220818,
                        "text": "মূল্য ৷৷ ২৫০০ ( পঁচিশ টকা ) মাত্র । ",
                        "width": 34.03973509933775,
                        "height": 1.7277707543194267,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.72185430463576,
                        "y": 52.21238938053098,
                        "text": "* প্রচ্ছদপট অঙ্কন : ",
                        "width": 17.483443708609272,
                        "height": 1.8541930046354824,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 42.8476821192053,
                        "y": 54.740834386852086,
                        "text": "¦ ত্ৰৈলে৷ক্য দত্ত ",
                        "width": 13.245033112582782,
                        "height": 2.0648967551622417,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 41.72185430463576,
                        "y": 59.08133164770333,
                        "text": "* শূদ্ৰক : ",
                        "width": 8.543046357615895,
                        "height": 1.685630004214075,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 44.23841059602649,
                        "y": 60.97766540244416,
                        "text": "ট্রিবিউন প্ৰেছ ৷৷ গুৱাহাটী -৭৮১০০৩ ৷॥ ",
                        "width": 35.76158940397351,
                        "height": 1.8541930046354824,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    }
                ]
            },
            "project_id_id": 2279,
            "input_data_id": 12517926,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606414,
            "data": {
                "image_url": "https://drive.google.com/uc?id=1YAoBc5DvVn8wDzBivoWHKt92l38LW46q&export=download",
                "ocr_prediction_json": [
                    {
                        "x": 47.549668874172184,
                        "y": 33.417614833544036,
                        "text": "উচৰ্গা ",
                        "width": 9.536423841059603,
                        "height": 3.329119258322798,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 16.95364238410596,
                        "y": 39.907290349768225,
                        "text": "অকালতে ১৯২৮ খৃষ্টাব্দব জানুৱাৰী মাহত শদিয়াত আমা - ডিম ৷ ছুটি ল’বা - ছোৱালী এবি পতিব আগতে আমাক সকলোকে কন্দুৱাই বৈকুণ্ঠী হোৱা মোৰ পৰম সাদৰী সৰু - মাজিউ জীযাবী ৺মুণালিনী আইটীব নামত এই পুথি উচৰ্গা কৰিলোঁ । ",
                        "width": 66.02649006622516,
                        "height": 10.53518752633797,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 17.218543046357617,
                        "y": 51.07458912768648,
                        "text": "বাছ ৷ ! ককাযেব দুজন আৰ নিচেই গৰুভাষের জনব লগত মিলি - জুলি স্ববগব ফুল স্বৰগতে থাকিবি । কালপ্রাপ্ত হলে আমিও যাম আৰু তাত তহঁতক লগ পামগৈ । ",
                        "width": 65.69536423841059,
                        "height": 7.374631268436578,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 59.60264900662252,
                        "y": 61.7361989043405,
                        "text": "ৰজনীকান্ত বৰদলৈ ",
                        "width": 23.509933774834437,
                        "height": 2.8234302570585754,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    }
                ]
            },
            "project_id_id": 2279,
            "input_data_id": 12517927,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606415,
            "data": {
                "image_url": "https://drive.google.com/uc?id=15NCuEI3mMwINczeg0M5NbZiNALaGrbfg&export=download",
                "ocr_prediction_json": []
            },
            "project_id_id": 2279,
            "input_data_id": 12517928,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606416,
            "data": {
                "image_url": "https://drive.google.com/uc?id=1qXjZDIRKADFeBRzRmAVLwibjlsZOPXQ4&export=download",
                "ocr_prediction_json": [
                    {
                        "x": 30.728476821192054,
                        "y": 25.747998314369998,
                        "text": "ৰহদৈ লিগিৰী ",
                        "width": 39.0728476821192,
                        "height": 3.034134007585335,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 45.96026490066225,
                        "y": 34.42899283607248,
                        "text": "প্রথম অধ ",
                        "width": 8.67549668874172,
                        "height": 1.643489254108723,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 48.079470198675494,
                        "y": 38.81163084702908,
                        "text": "ৰহদৈ ",
                        "width": 6.622516556291391,
                        "height": 2.359882005899705,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 13.311258278145695,
                        "y": 50.526759376316896,
                        "text": "আমাৰ ৰহদৈ লিগিৰীৰ ঘৰ উজনীৰ মাজুলীত থকা কমলাবাৰী গাঁৱত আছিল । সেই সময়ত অর্থাৎ মানৰ দিনৰ আগেয়ে গাঁওখনত এশ কি ছকুৰি ঘৰ কোঁচ , কলিতা , বামুণ , স্ত , কাটনি ইত্যাদি জাতিৰ মানুহ আছিল । ৰহদৈৰ বাপেকৰ নাম ৰতিকান্ত , মাকৰ নাম কমলা । তেওঁবিনাক সোণাৰি কলিতা জাতিৰ মধ্যবিত্ত অৱস্থাৰ মানুহ আছিল । ",
                        "width": 74.2384105960265,
                        "height": 11.335861778339655,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 13.37748344370861,
                        "y": 63.25326590813316,
                        "text": "ৰহদৈ মাক - বাপেকৰ একেক্মণী জীয়াৰী আছিল । তাইৰ তলত মাথোন এটা ভায়েক আছিল । সম্পতিৰ ভিতৰত তেওঁবিলাকৰ ছদ্মনী মান গাইগৰু আৰু এটা গলধন বৰা মতা ম'হ আছিল । গাই কেইজনীৰ গাখীৰ খাইছিল ; গলধন ধৰা হ'টোৰে ৰতিকান্তে কমলাবাৰী সত্ৰৰ লাখেৰাজ মাটি তিনিপুৰামান গা খাটনিলৈ লৈ তাত আহধান , সৰিয়হ , মাহ , মুগ , শাক , পাচলি ইত্যাদি খেতি - বাতি কৰি লুখেৰে ৰাইছিল । মাটি বৰ সাৰুৱা , সেইদেখি শস্য বৰ ভাল হৈছিল । সেইকালভ আধিকাদিৰ দৰে মানুহৰ নাহ - বিদাহ বা কানি • চিগাৰেট , ",
                        "width": 74.70198675496688,
                        "height": 18.120522545301306,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 13.57615894039735,
                        "y": 83.22798145806996,
                        "text": "কানি ইংৰাজে অনবদেশ লৰৰ পৰাহে প্রচলন হৈছে । বেনভলাতে পোন - এ ইংৰাজৰ কোনোবা বাবাঠা নে হিন্দুস্থানী চিপাহীৰ পৰাছে হেনো witীরা মানুহে লৈ খেতি কৰি  ৈিি।ে वर्धनাসে  ানিতওৈ চিােেট ना अर्को না । कৈি ब ৰিছে । ज ndar अ ভि খেৰে খ वर्ग ল e f ঘোষ । হৈ উৰিব লাগিছে পাক চিগাৰেট এপি মানুহ খোৱা - পিছাত যে দুখীয়া ভার । ",
                        "width": 73.64238410596028,
                        "height": 9.313105773282764,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    }
                ]
            },
            "project_id_id": 2279,
            "input_data_id": 12517929,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        },
        {
            "id": 3606417,
            "data": {
                "image_url": "https://drive.google.com/uc?id=1FQeVkSBtaxEDvPIKr2DteDl97xm87pxt&export=download",
                "ocr_prediction_json": [
                    {
                        "x": 41.324503311258276,
                        "y": 6.531816266329541,
                        "text": "ৰহদৈ লিগিৰী ",
                        "width": 14.966887417218544,
                        "height": 2.107037505267594,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 79.27152317880794,
                        "y": 11.883691529709228,
                        "text": "; ",
                        "width": 0.9271523178807948,
                        "height": 1.8963337547408345,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 83.24503311258277,
                        "y": 11.546565528866413,
                        "text": "সেই ",
                        "width": 4.635761589403973,
                        "height": 1.643489254108723,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 11.258278145695364,
                        "y": 10.998735777496838,
                        "text": "ভাং ইত্যাদি ৰাগীয়াল ৰন্ধ খোৱা বৰ অভ্যাস নাছিল কাৰণে খোৱ ৷ পিন্ধাত কাৰে ৷ দুখ কষ্ট নাছিল । মাছ , পছ প্রায় সকলোৰে মাৰি কাটি ব | নদীয়ালৰপৰ ৷ ধানলৈ সলাই লৈ ৰাইছিল । ৰহদৈয়ে ৰহদৈয়ে দিনৰ ভাগত ম'হটে ৷ চৰাই লৈ ফুৰিছিল ; পুৰা গধূলি মাকৰ ওচৰত তাত ৰবলৈ , ভাত ৰান্ধিবলৈ শিকিছিল । ভায়েকে গক কেইজনী চাৰিছিল । মাকে খেতিৰ কামত বাপেকক সহায় কৰাৰ উপৰিও সকলোকে ৰান্ধি - বাঢ়ি ধুৱাইছিল , আৰু বই - কাটি পিন্ধাইছিল । মুঠৰ ওপৰতে গৃহস্থিখন লুখৰ আছিল । ৰহদৈৰ মাক ৰাপেকৰ ভিতৰত কোনো দিন দনধৰিয়াল হোৱা দেখা বা গুনাও নগৈছিল । উভয়ে ধৰ্ম্মত মতি ৰাখি পুৱ ৷ গধূলি চাৰিউটি প্রাণীয়ে নাম প্রসঙ্গ কৰি , কৰি - ধৰি খাই মেলি সুখেৰে জীৱন কটাইছিল । ",
                        "width": 76.55629139072848,
                        "height": 26.801517067003793,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 40.66225165562914,
                        "y": 56.38432364096081,
                        "text": "দ্বিতীয় অধ্যায় ",
                        "width": 15.2317880794702,
                        "height": 2.2334597555836493,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 43.907284768211916,
                        "y": 61.23050990307628,
                        "text": "দয়াৰাম ",
                        "width": 9.13907284768212,
                        "height": 1.643489254108723,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    },
                    {
                        "x": 12.71523178807947,
                        "y": 67.38305941845765,
                        "text": "তেওঁবিলাকৰ ঘৰৰপৰা অলপ আঁতৰত সেই গাঁৱতে ধনীৰাম নামেৰে এজন সেই জাতিৰে ধন - চহকী মানুহ আছিল । ধনীৰাম কমলাবাৰী সত্ৰৰ সেৱক আছিল আৰু আঢ়াৱন্ত আৰু তাৰ লগে লগে ভক্তিমন্ত হোৱাৰ কাৰণে সত্ৰৰপৰ ৷ মেধি বাব পাইছিল । ধনীৰামৰ প্ৰথম পক্ষৰ তিৰোতা গৰাকীয়ে আমাৰ দয়াৰাম নামৰ এই ল'ৰাটো এৰি গাভৰু কালতে জীৱন - শীলা সামৰিছিল । দয়াৰামৰ মাক মৰাৰ ৰছৰেকৰ পাচত ধনীৰামে হুভদ্র ৷ নামৰ আৰু এগৰাকী তিৰোত ৷ বিয়া কৰাই সেই ভিৰোতাৰ গৰ্ভত দুটি ল'ৰা আৰু এজনী ছোৱালী জন্ম'ই সুখেৰে কাল কটাইছিল । বাপেকৰ গৰু - ম'হ , মাটি - বাৰি , ধন - সোণ ঢেৰ থকা স্থলতো দয়াৰাম সৰুৰেপৰা মন - দুখীয়া আছিল । মাক - মৰা ল'ৰা মন তৃধীয়া হবৰে কথা , তাতে যদি মাহীয়েকৰণৰ | এফেবা সদ্ব্যবহাৰ ",
                        "width": 75.82781456953643,
                        "height": 26.38010956595027,
                        "labels": [
                            "Body"
                        ],
                        "rotation": 0,
                        "original_width": 1510,
                        "original_height": 2373
                    }
                ]
            },
            "project_id_id": 2279,
            "input_data_id": 12517930,
            "output_data_id": null,
            "correct_annotation_id": null,
            "review_user_id": null,
            "super_check_user_id": null,
            "task_status": "incomplete",
            "metadata_json": null,
            "revision_loop_count": {
                "review_count": 0,
                "super_check_count": 0
            },
            "annotation_status": "unlabeled",
            "user_mail": "shoonya@ai4bharat.org"
        }
    ]
}]
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [OpenFindAndReplaceDialog, setOpenFindAndReplaceDialog] = useState(false);

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  // const getProjectUsers = useSelector(
  //   (state) => state.getProjectDetails.data.annotators
  // );
const getProjectUsers = [
  {
      "id": 1,
      "username": "shoonya",
      "email": "shoonya@ai4bharat.org",
      "languages": [],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "Admin",
      "last_name": "AI4B",
      "phone": "",
      "profile_photo": "",
      "role": 6,
      "organization": {
          "id": 1,
          "title": "AI4Bharat",
          "email_domain_name": "ai4bharat.org",
          "created_by": {
              "username": "shoonya",
              "email": "shoonya@ai4bharat.org",
              "first_name": "Admin",
              "last_name": "AI4B",
              "role": 6
          },
          "created_at": "2022-04-24T13:11:30.339610Z"
      },
      "unverified_email": "shoonya@ai4bharat.org",
      "date_joined": "2022-04-24T07:40:11Z",
      "participation_type": 3,
      "prefer_cl_ui": false,
      "is_active": true
  }
]
  // const getProjectReviewers = useSelector(
  //   (state) => state.getProjectDetails.data.annotation_reviewers
  // );
  // const TaskFilter = useSelector((state) => state.setTaskFilter.data);
  // const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  // const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const TaskFilter = {"filters"
    : 
    {"annotation_status": "unlabeled", "req_user": -1},
    "id"
    : 
    2279,
    "type"
    : 
    "annotation"}
  const ProjectDetails = {
    "id": 2279,
    "title": "test ocr ce 2",
    "description": "test",
    "created_by": null,
    "is_archived": false,
    "is_published": true,
    "annotators": [
        {
            "id": 1,
            "username": "shoonya",
            "email": "shoonya@ai4bharat.org",
            "languages": [],
            "availability_status": 1,
            "enable_mail": false,
            "first_name": "Admin",
            "last_name": "AI4B",
            "phone": "",
            "profile_photo": "",
            "role": 6,
            "organization": {
                "id": 1,
                "title": "AI4Bharat",
                "email_domain_name": "ai4bharat.org",
                "created_by": {
                    "username": "shoonya",
                    "email": "shoonya@ai4bharat.org",
                    "first_name": "Admin",
                    "last_name": "AI4B",
                    "role": 6
                },
                "created_at": "2022-04-24T13:11:30.339610Z"
            },
            "unverified_email": "shoonya@ai4bharat.org",
            "date_joined": "2022-04-24T07:40:11Z",
            "participation_type": 3,
            "prefer_cl_ui": false,
            "is_active": true
        }
    ],
    "annotation_reviewers": [],
    "review_supercheckers": [],
    "frozen_users": [],
    "workspace_id": 1,
    "organization_id": 1,
    "filter_string": null,
    "sampling_mode": "f",
    "sampling_parameters_json": {},
    "project_type": "OCRSegmentCategorizationEditing",
    "label_config": "<View>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n  \n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    \n    <Label value=\"title\" background=\"green\" name=\"title\" className=\"ignore_assertion\"/>\n    <Label value=\"text\" background=\"blue\" name=\"text\" className=\"ignore_assertion\"/>\n    <Label value=\"image\" background=\"red\" name=\"image\" className=\"ignore_assertion\"/>\n    <Label value=\"unord-list\" background=\"yellow\" name=\"unord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"ord-list\" background=\"black\" name=\"ord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"placeholder\" background=\"orange\" name=\"placeholder\" className=\"ignore_assertion\"/>\n    <Label value=\"table\" background=\"violet\" name=\"table\" className=\"ignore_assertion\"/>\n    <Label value=\"dateline\" background=\"cyan\" name=\"dateline\" className=\"ignore_assertion\"/>\n    <Label value=\"byline\" background=\"brown\" name=\"byline\" className=\"ignore_assertion\"/>\n    <Label value=\"page-number\" background=\"purple\" name=\"page-number\" className=\"ignore_assertion\"/>\n    <Label value=\"footer\" background=\"indigo\" name=\"footer\" className=\"ignore_assertion\"/>\n    <Label value=\"footnote\" background=\"pink\" name=\"footnote\" className=\"ignore_assertion\"/>\n    <Label value=\"header\" background=\"olive\" name=\"header\" className=\"ignore_assertion\"/>\n    <Label value=\"social-media-handle\" background=\"aqua\" name=\"social-media-handle\" className=\"ignore_assertion\"/>\n    <Label value=\"website-link\" background=\"teal\" name=\"website-link\" className=\"ignore_assertion\"/>\n    <Label value=\"caption\" background=\"maroon\" name=\"caption\" className=\"ignore_assertion\"/>\n    <Label value=\"table-header\" background=\"aquamarine\" name=\"table-header\" className=\"ignore_assertion\"/>\n    \n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"title\" name=\"title_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"h1\" className=\"ignore_assertion\"/>\n    <Choice value=\"h2\" className=\"ignore_assertion\"/>\n    <Choice value=\"h3\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"text\" name=\"text_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"paragraph\" className=\"ignore_assertion\"/>\n    <Choice value=\"foreign-language-text\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"image\" name=\"image_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"img\" className=\"ignore_assertion\"/>\n    <Choice value=\"logo\" className=\"ignore_assertion\"/>\n    <Choice value=\"formula\" className=\"ignore_assertion\"/>\n    <Choice value=\"equation\" className=\"ignore_assertion\"/>\n    <Choice value=\"bg-img\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"placeholder\" name=\"placeholder_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"placeholder-txt\" className=\"ignore_assertion\"/>\n    <Choice value=\"placeholder-img\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"caption\" name=\"caption_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"fig-caption\" className=\"ignore_assertion\"/>\n    <Choice value=\"table-caption\" className=\"ignore_assertion\"/>\n  </Choices>\n    \n</View>\n\n\n",
    "variable_parameters": {},
    "project_mode": "Annotation",
    "required_annotators_per_task": 1,
    "tasks_pull_count_per_batch": 10,
    "max_pending_tasks_per_user": 60,
    "src_language": null,
    "tgt_language": null,
    "created_at": "2023-12-06T06:37:58.364413Z",
    "project_stage": 1,
    "revision_loop_count": 3,
    "k_value": 100,
    "metadata_json": null,
    "datasets": [
        {
            "instance_id": 295,
            "instance_name": "Test OCR"
        }
    ],
    "status": "Published",
    "task_creation_status": "Tasks Creation Process Successful",
    "last_project_export_status": "Success",
    "last_project_export_date": "Synchronously Completed. No Date.",
    "last_project_export_time": "Synchronously Completed. No Time.",
    "last_pull_status": "Success",
    "last_pull_date": "Synchronously Completed. No Date.",
    "last_pull_time": "Synchronously Completed. No Time.",
    "last_pull_result": "No result.",
    "unassigned_task_count": 29,
    "labeled_task_count": 0,
    "reviewed_task_count": 0
}
const userDetails= {
  "id": 1,
  "username": "shoonya",
  "email": "shoonya@ai4bharat.org",
  "languages": [],
  "availability_status": 1,
  "enable_mail": false,
  "first_name": "Admin",
  "last_name": "AI4B",
  "phone": "",
  "profile_photo": "",
  "role": 6,
  "organization": {
      "id": 1,
      "title": "AI4Bharat",
      "email_domain_name": "ai4bharat.org",
      "created_by": {
          "username": "shoonya",
          "email": "shoonya@ai4bharat.org",
          "first_name": "Admin",
          "last_name": "AI4B",
          "role": 6
      },
      "created_at": "2022-04-24T13:11:30.339610Z"
  },
  "unverified_email": "shoonya@ai4bharat.org",
  "date_joined": "2022-04-24T07:40:11Z",
  "participation_type": 3,
  "prefer_cl_ui": false,
  "is_active": true
};

 const loggedInUserData= {
  "id": 1,
  "username": "shoonya",
  "email": "shoonya@ai4bharat.org",
  "languages": [],
  "availability_status": 1,
  "enable_mail": false,
  "first_name": "Admin",
  "last_name": "AI4B",
  "phone": "",
  "profile_photo": "",
  "role": 2,
  "organization": {
      "id": 1,
      "title": "AI4Bharat",
      "email_domain_name": "ai4bharat.org",
      "created_by": {
          "username": "shoonya",
          "email": "shoonya@ai4bharat.org",
          "first_name": "Admin",
          "last_name": "AI4B",
          "role": 6
      },
      "created_at": "2022-04-24T13:11:30.339610Z"
  },
  "unverified_email": "shoonya@ai4bharat.org",
  "date_joined": "2022-04-24T07:40:11Z",
  "participation_type": 3,
  "prefer_cl_ui": false,
  "is_active": true
}
  const filterData = {
    Status: ((ProjectDetails.project_stage == 2||ProjectDetails.project_stage == 3) || ProjectDetails?.annotation_reviewers?.some((reviewer) => reviewer.id === userDetails?.id))

      ? props.type === "annotation"
        ? ["unlabeled", "skipped", "draft", "labeled", "to_be_revised"]
        : [
          "unreviewed",
          "accepted",
          "accepted_with_minor_changes",
          "accepted_with_major_changes",
          "to_be_revised",
          "draft",
          "skipped",
          "rejected",
        ]
      : ["unlabeled", "skipped", "labeled", "draft"],
    Annotators:
      ProjectDetails?.annotators?.length > 0
        ? ProjectDetails?.annotators?.map((el, i) => {
          return {
            label: el.username,
            value: el.id,
          };
        })
        : [],

    Reviewers:
      ProjectDetails?.annotation_reviewers?.length > 0
        ? ProjectDetails?.annotation_reviewers.map((el, i) => {
          return {
            label: el.username,
            value: el.id,
          };
        })
        : [],
  };
  const [pull, setpull] = useState("All");
  const pullvalue = (pull == 'Pulled By reviewer' || pull == 'Pulled By SuperChecker') ? false :
    (pull == 'Not Pulled By reviewer' || pull == 'Not Pulled By SuperChecker') ? true :
      ''
  const [selectedFilters, setsSelectedFilters] = useState(
    props.type === "annotation"
      ? TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
        ? TaskFilter.filters
        : { annotation_status: filterData.Status[0] , req_user: -1 }
      : TaskFilter && TaskFilter.id === id && TaskFilter.type === props.type
        ? TaskFilter.filters
        : { review_status: filterData.Status[0], req_user: -1 }
  );
  // const NextTask = useSelector((state) => state?.getNextTask?.data);
  const NextTask ={};
  const [tasks, setTasks] = useState([]);
  const [pullSize, setPullSize] = useState(
    ProjectDetails.tasks_pull_count_per_batch * 0.5
  );
  const [pullDisabled, setPullDisabled] = useState("");
  const [deallocateDisabled, setDeallocateDisabled] = useState("");
  // const apiLoading = useSelector((state) => state.apiStatus.loading);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [deallocateDialog, setDeallocateDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [labellingStarted, setLabellingStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  // const getTaskListData = () => {
  //   const taskObj = new GetTasksByProjectIdAPI(
  //     id,
  //     currentPageNumber,
  //     currentRowPerPage,
  //     selectedFilters,
  //     props.type,
  //     pullvalue,
  //     pull
  //   );
  //   dispatch(APITransport(taskObj));
  // };


  const fetchNewTasks = async () => {
    const batchObj =
      props.type === "annotation"
        ? new PullNewBatchAPI(id, Math.round(pullSize))
        : new PullNewReviewBatchAPI(id, Math.round(pullSize));
    const res = await fetch(batchObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(batchObj.getBody()),
      headers: batchObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      if (
        ((props.type === "annotation" &&
          selectedFilters.annotation_status === "unlabeled") ||
          (props.type === "review" &&
            selectedFilters.review_status === "unreviewed")) &&
        currentPageNumber === 1
      ) {
        getTaskListData();
      } else {
        setsSelectedFilters({
          ...selectedFilters,
          task_status: props.type === "annotation" ? "unlabeled" : "labeled",
        });
        setCurrentPageNumber(1);
      }
      const projectObj = new GetProjectDetailsAPI(id);
      dispatch(APITransport(projectObj));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const unassignTasks = async () => {
    setDeallocateDialog(false);
    if (props.ProjectDetails.project_type === "AcousticNormalisedTranscriptionEditing") {
      setSnackbarInfo({
        open: true,
        message: 'The task de-allocation has been disabled for your project',
        variant: "error",
      });
      return 
    }
    const deallocateObj =
      props.type === "annotation"
        ? new DeallocateTasksAPI(id, selectedFilters.annotation_status)
        : new DeallocateReviewTasksAPI(id, selectedFilters.review_status);
    const res = await fetch(deallocateObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(deallocateObj.getBody()),
      headers: deallocateObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      getTaskListData();
      setTimeout(() => {
        //window.location.reload();
      }, 1000);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };
  // console.log(selectedFilters);
  const labelAllTasks = () => {
    let search_filters = Object?.keys(selectedFilters)
      .filter((key) => key?.startsWith("search_"))
      .reduce((acc, curr) => {
        acc[curr] = selectedFilters[curr];
        return acc;
      }, {});

    const datavalue = {
      annotation_status: selectedFilters?.annotation_status,
      mode: "annotation",
      ...(props.type === "review" && {
        mode: "review",
        annotation_status: selectedFilters?.review_status,
      }),
    };

    const getNextTaskObj = new GetNextTaskAPI(id, datavalue, null, props.type);
    dispatch(APITransport(getNextTaskObj));
    setLabellingStarted(true);
  };

 
  const totalTaskCount=9
  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };

  const handleOpenFindAndReplace =  () => {
    setOpenFindAndReplaceDialog(true)
  };

  const handleSubmitFindAndReplace = async () =>{
    const ReplaceData = {
      user_id: userDetails.id,
      project_id: id,
      task_status:
        props.type === "annotation"
          ? selectedFilters.annotation_status
          : selectedFilters.review_status,
      annotation_type: props.type === "annotation" ? "annotation" : "review",
      find_words: find,
      replace_words: replace,
    };
    const AnnotationObj = new FindAndReplaceWordsInAnnotationAPI(
      id,
      ReplaceData
    );
    dispatch(APITransport(AnnotationObj));
    const res = await fetch(AnnotationObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(AnnotationObj.getBody()),
      headers: AnnotationObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    }
  }

  // useEffect(() => {
  //   localStorage.setItem("Stage", props.type);
  // },[]);
  
  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "10px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
        {!excludeSearch.includes(col.name) && (
          <IconButton
            sx={{ borderRadius: "100%" }}
            onClick={(e) => handleShowSearch(col.name, e)}
          >
            <SearchIcon id={col.name + "_btn"} />
          </IconButton>
        )}
      </Box>
    );
  };

  // useEffect(() => {
  //   setLoading(apiLoading);
  // }, [apiLoading]);

  // useEffect(() => {
  //   getTaskListData();
  // }, [currentPageNumber, currentRowPerPage]);

  // useEffect(() => {
  //   dispatch(SetTaskFilter(id, selectedFilters, props.type));
  //   if (currentPageNumber !== 1) {
  //     setCurrentPageNumber(1);
  //   } else {
  //     getTaskListData();
  //   }
  //   localStorage.setItem(
  //     "labellingMode",
  //     props.type === "annotation"
  //       ? selectedFilters.annotation_status
  //       : selectedFilters.review_status
  //   );
  // }, [selectedFilters]);
  // useEffect(() => {
  //   if (taskList?.length > 0 && taskList[0]?.data) {
  //     const data = taskList.map((el) => {
  //       const email = props.type === "review" ? el.annotator_mail : "";
  //       let row = [el.id, ...(!!email ? [el.annotator_mail] : [])];
  //       row.push(
  //         ...Object.keys(el.data)
  //           .filter((key) => !excludeCols.includes(key))
  //           .map((key) => el.data[key])
  //       );
  //       props.type === "annotation" &&
  //         taskList[0].annotation_status &&
  //         row.push(el.annotation_status);
  //       props.type === "review" &&
  //         taskList[0].review_status &&
  //         row.push(el.review_status);
  //       props.type === "annotation" &&
  //         row.push(
  //           <Link
  //             to={ProjectDetails?.project_type?.includes("Acoustic")
  //             ? `AudioTranscriptionLandingPage/${el.id}` : `task/${el.id}`} className={classes.link}>
  //             <CustomButton
  //               onClick={() => {
  //                 console.log("task id === ", el.id);
  //                 localStorage.removeItem("labelAll");
  //               }}
  //               disabled={ ProjectDetails.is_archived }
  //               sx={{ p: 1, borderRadius: 2 }}
  //               label={
  //                 <Typography sx={{ color: "#FFFFFF" }} variant="body2">
  //                   {(props.type === "annotation" && ProjectDetails?.annotators?.some((a) => a.id === userDetails?.id)) ?
  //                     (ProjectDetails.project_mode === "Annotation"
  //                       ? "Annotate"
  //                       : "Edit")
  //                     : "View"
  //                   }
  //                 </Typography>
  //               }
  //             />
  //           </Link>
  //         );
  //       props.type === "review" &&
  //         row.push(
  //           <Link
  //             to={ProjectDetails?.project_type?.includes("Acoustic")
  //             ? `ReviewAudioTranscriptionLandingPage/${el.id}` : `review/${el.id}`} className={classes.link}>
  //             <CustomButton
  //               disabled={ ProjectDetails.is_archived}
  //               onClick={() => {
  //                 console.log("task id === ", el.id);
  //                 localStorage.removeItem("labelAll");
  //               }}
  //               sx={{ p: 1, borderRadius: 2 }}
  //               label={
  //                 <Typography sx={{ color: "#FFFFFF" }} variant="body2">
  //                   Review
  //                 </Typography>
  //               }
  //             />
  //           </Link>
  //         );
  //       return row;
  //     });
      // let colList = ["id"];
      // colList.push(...Object.keys(taskList[0].data).filter(el => !excludeCols.includes(el) && !el.includes("_json")));

  //     const annotatorEmail = taskList[0]?.hasOwnProperty("annotator_mail")
  //     const email = props.type === "review" && annotatorEmail ? "Annotator Email" : "";
  //     let colList = ["id", ...(!!email ? [email] : [])];
  //     colList.push(
  //       ...Object.keys(taskList[0].data).filter(
  //         (el) => !excludeCols.includes(el)
  //       )
  //     );
  //     taskList[0].task_status && colList.push("status");
  //     colList.push("actions");
  //     const cols = colList.map((col) => {
  //       return {
  //         name: col,
  //         label: snakeToTitleCase(col),
  //         options: {
  //           filter: false,
  //           sort: false,
  //           align: "center",
  //           customHeadLabelRender: customColumnHead,
  //         },
  //       };
  //     });
  //     console.log("colss", cols);
  //     setColumns(cols);
  //     setSelectedColumns(colList);
  //     setTasks(data);
  //     console.log(colList, "colListcolList");
  //   } else {
  //     setTasks([]);
  //   }
  // }, [taskList, ProjectDetails]);

  // useEffect(() => {
  //   const newCols = columns.map((col) => {
  //     col.options.display = selectedColumns.includes(col.name)
  //       ? "true"
  //       : "false";
  //     return col;
  //   });
  //   setColumns(newCols);
  //   console.log("columnss", newCols);
  // }, [selectedColumns]);

  // useEffect(() => {
  //   if (ProjectDetails) {
  //     if (props.type === "review" && ProjectDetails.labeled_task_count === 0 ||  ProjectDetails.is_archived )
  //       setPullDisabled("No more unassigned tasks in this project");
  //     else if (pullDisabled === "No more unassigned tasks in this project")
  //       setPullDisabled("");
  //   }
  // }, [ProjectDetails.labeled_task_count]);

  // useEffect(() => {
  //   if (ProjectDetails) {
  //     if (
  //       props.type === "annotation" &&
  //       ProjectDetails.unassigned_task_count === 0 || ProjectDetails.is_archived
  //     )
  //       setPullDisabled("No more unassigned tasks in this project");
  //     else if (pullDisabled === "No more unassigned tasks in this project")
  //       setPullDisabled("");

  //     ProjectDetails.frozen_users?.forEach((user) => {
  //       if (user.id === userDetails?.id)
  //         setPullDisabled("You're no more a part of this project");
  //       else if (pullDisabled === "You're no more a part of this project")
  //         setPullDisabled("");
  //     });
  //     setPullSize(ProjectDetails.tasks_pull_count_per_batch * 0.5);
  //   }
  // }, [
  //   ProjectDetails.unassigned_task_count,
  //   ProjectDetails.frozen_users,
  //   ProjectDetails.tasks_pull_count_per_batch,
  //   userDetails,
  // ]);

  // useEffect(() => {
  //   if (
  //     totalTaskCount &&
  //     ((props.type === "annotation" &&
  //       selectedFilters.annotation_status === "unlabeled") ||
  //       (props.type === "review" &&
  //         selectedFilters.review_status === "unreviewed")) &&
  //     totalTaskCount >= ProjectDetails?.max_pending_tasks_per_user &&
  //     Object.keys(selectedFilters).filter((key) =>
  //       key.startsWith("search_")
  //     ) === []
  //   ) {
  //     setPullDisabled(
  //       `You have too many ${
  //         props.type === "annotation"
  //         ? selectedFilters.annotation_status
  //         : selectedFilters.review_status
  //       } tasks`
  //     );
  //   } else if (
  //     pullDisabled === "You have too many unlabeled tasks" ||
  //     pullDisabled === "You have too many labeled tasks"
  //   ) {
  //     setPullDisabled("");
  //   }
  // }, [
  //   totalTaskCount,
  //   ProjectDetails.max_pending_tasks_per_user,
  //   selectedFilters,
  // ]);

  // useEffect(() => {
  //   if (
  //     ((props.type === "annotation" &&
  //       selectedFilters.annotation_status === "unlabeled") ||
  //       (props.type === "review" &&
  //         selectedFilters.review_status === "unreviewed")) &&
  //     totalTaskCount === 0 ||   ProjectDetails.is_archived
  //   ) {
  //     setDeallocateDisabled("No more tasks to deallocate");
  //   } else if (deallocateDisabled === "No more tasks to deallocate") {
  //     setDeallocateDisabled("");
  //   }
  // }, [totalTaskCount, selectedFilters,ProjectDetails]);

  // useEffect(() => {
  //   if (ProjectDetails?.project_type?.includes("Acoustic")) {
  //     if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
  //       navigate(
  //         `/projects/${id}/${props.type === "annotation" ? "AudioTranscriptionLandingPage" : "ReviewAudioTranscriptionLandingPage"}/${
  //           NextTask?.id
  //         }`
  //       );
  //     }
  //   }else{
  //     if (labellingStarted && Object?.keys(NextTask)?.length > 0) {
  //       navigate(
  //         `/projects/${id}/${props.type === "annotation" ? "task" : "review"}/${
  //         NextTask?.id
  //         }`
  //       );
  //     }
  //   }
  //   //TODO: display no more tasks message
  // }, [NextTask]);

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseFindAndReplace =()=>{
    setOpenFindAndReplaceDialog(false)
  }

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  const renderToolBar = () => {
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        

        {props.type === "annotation" &&
          (roles?.WorkspaceManager === userDetails?.role || roles?.OrganizationOwner === userDetails?.role || roles?.Admin === userDetails?.role )  &&
          !getProjectUsers?.some(
            (annotator) => annotator.id === userDetails?.id
          ) && !getProjectReviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          ) && ! ProjectDetails?.review_supercheckers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          )&& (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="annotator-filter-label"
                sx={{
                  fontSize: "16px",
                  position: "inherit",
                  top: "23px",
                  left: "-20px",
                }}
              >
                Filter by Annotator
              </InputLabel>
              <Select
                labelId="annotator-filter-label"
                id="annotator-filter"
                value={selectedFilters.req_user}
                label="Filter by Annotator"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value={-1}>All</MenuItem>
                {filterData.Annotators.map((el, i) => (
                  <MenuItem key={i} value={el.value}>{el.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        {props.type === "review" &&
          (roles?.WorkspaceManager === userDetails?.role || roles?.OrganizationOwner === userDetails?.role || roles?.Admin === userDetails?.role ) &&
          !getProjectUsers?.some(
            (annotator) => annotator.id === userDetails?.id
          ) && !getProjectReviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          ) && ! ProjectDetails?.review_supercheckers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          )&&  (
            <FormControl size="small" sx={{ width: "30%", minWidth: "100px" }}>
              <InputLabel
                id="reviewer-filter-label"
                sx={{
                  fontSize: "16px",
                  position: "inherit",
                  top: "23px",
                  left: "-25px",
                }}
              >
                Filter by Reviewer
              </InputLabel>
              <Select
                labelId="reviewer-filter-label"
                id="reviewer-filter"
                value={selectedFilters.req_user}
                label="Filter by Reviewer"
                onChange={(e) =>
                  setsSelectedFilters({
                    ...selectedFilters,
                    req_user: e.target.value,
                  })
                }
                sx={{ fontSize: "16px" }}
              >
                <MenuItem value="">All</MenuItem>
                {filterData.Reviewers?.map((el, i) => (
                  <MenuItem key={i}  value={el.value}>{el.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
        <Tooltip title="Filter Table">
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
      </Box>
    );
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
        autoHideDuration={2000}
      />
    );
  };

  const options = {
    count: totalTaskCount,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100],
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
      setCurrentPageNumber(1);
      setCurrentRowPerPage(rowPerPageCount);
      console.log("rowPerPageCount", rowPerPageCount);
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
  };


  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      unassignTasks();
    }else{
      window.alert("Invalid credentials, please try again");
      console.log(rsp_data);
    }
  };
  
  return (
    <div>
      {((props.type === "annotation" &&
        ProjectDetails?.annotators?.some(
          (annotation) => annotation.id === userDetails?.id
        )) ||
        (props.type === "review" &&
          ProjectDetails?.annotation_reviewers?.some(
            (reviewer) => reviewer.id === userDetails?.id
          ))) &&
        (ProjectDetails.project_mode === "Annotation" ? (
          ProjectDetails.is_published ? (
            <Grid container direction="row" spacing={2} sx={{ mb: 2 }}>
              {((props.type === "annotation" &&
                selectedFilters.annotation_status === "unlabeled") ||
                selectedFilters.annotation_status === "draft" ||
                selectedFilters.annotation_status === "skipped" ||
                (props.type === "review" &&
                  selectedFilters.review_status === "unreviewed") ||
                selectedFilters.review_status === "draft" ||
                selectedFilters.review_status === "skipped") && (
                  <Grid item xs={12} sm={12} md={3}>
                    <Tooltip title={deallocateDisabled }>
                      <Box>
                        <CustomButton
                          sx={{
                            p: 1,
                            width: "100%",
                            borderRadius: 2,
                            margin: "auto",
                          }}
                          label={"De-allocate Tasks"}
                          onClick={() => setDeallocateDialog(true)}
                          disabled={deallocateDisabled }
                          color={"warning"}
                        />
                      </Box>
                    </Tooltip>
                  </Grid>
                )}
              <Dialog
                open={deallocateDialog}
                onClose={() => setDeallocateDialog(false)}
                aria-labelledby="deallocate-dialog-title"
                aria-describedby="deallocate-dialog-description"
              >
                <DialogTitle id="deallocate-dialog-title">
                  {"De-allocate Tasks?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    All{" "}
                    <snap style={{ color: "#1DA3CE" }}>
                      {props.type === "annotation"
                        ? selectedFilters.annotation_status
                        : selectedFilters.review_status}{" "}
                      tasks
                    </snap>{" "}
                    will be de-allocated from this project. Please be careful as
                    this action cannot be undone.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setDeallocateDialog(false)}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
              <Grid
                item
                xs={4}
                sm={4}
                md={
                  (props.type === "annotation" &&
                    selectedFilters.annotation_status === "unlabeled") ||
                    selectedFilters.annotation_status === "draft" ||
                    selectedFilters.annotation_status === "skipped" ||
                    (props.type === "review" &&
                      selectedFilters.review_status === "unreviewed") ||
                    selectedFilters.review_status === "draft" ||
                    selectedFilters.review_status === "skipped"
                    ? 2
                    : 3
                }
              >
                <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel id="pull-select-label" sx={{ fontSize: "16px" }}>
                    Pull Size
                  </InputLabel>
                  <Select
                    labelId="pull-select-label"
                    id="pull-select"
                    value={pullSize}
                    // defaultValue={5}
                    label="Pull Size"
                    onChange={(e) => setPullSize(e.target.value)}
                    disabled={pullDisabled}
                    sx={{ fontSize: "16px" }}
                  >
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch * 0.5}
                    >
                      {Math.round(
                        ProjectDetails?.tasks_pull_count_per_batch * 0.5
                      )}
                    </MenuItem>
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch}
                    >
                      {ProjectDetails?.tasks_pull_count_per_batch}
                    </MenuItem>
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch * 1.5}
                    >
                      {Math.round(
                        ProjectDetails?.tasks_pull_count_per_batch * 1.5
                      )}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                md={
                  (props.type === "annotation" &&
                    selectedFilters.annotation_status === "unlabeled") ||
                    selectedFilters.annotation_status === "draft" ||
                    selectedFilters.annotation_status === "skipped" ||
                    (props.type === "review" &&
                      selectedFilters.review_status === "unreviewed") ||
                    selectedFilters.review_status === "draft" ||
                    selectedFilters.review_status === "skipped"
                    ? 3
                    : 4
                }
              >
                <Tooltip title={pullDisabled}>
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        width: "100%",
                        borderRadius: 2,
                        margin: "auto",
                      }}
                      label={"Pull New Batch"}
                      disabled={pullDisabled}
                      onClick={fetchNewTasks}
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={
                  (props.type === "annotation" &&
                    selectedFilters.annotation_status === "unlabeled") ||
                    selectedFilters.annotation_status === "draft" ||
                    selectedFilters.annotation_status === "skipped" ||
                    (props.type === "review" &&
                      selectedFilters.review_status === "unreviewed") ||
                    selectedFilters.review_status === "draft" ||
                    selectedFilters.review_status === "skipped"
                    ? 4
                    : 5
                }
              >
                <Tooltip
                  title={
                    totalTaskCount === 0
                      ? props.type === "annotation"
                        ? "No more tasks to label"
                        : "No more tasks to review"
                      : ""
                  }
                >
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        margin: "auto",
                        width: "100%",
                      }}
                      label={
                        props.type === "annotation"
                          ? "Start Labelling Now"
                          : "Start reviewing now"
                      }
                      onClick={labelAllTasks}
                      disabled={totalTaskCount === 0 ||  ProjectDetails.is_archived }
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          ) : (
            <Button
              type="primary"
              style={{
                width: "100%",
                marginBottom: "1%",
                marginRight: "1%",
                marginTop: "1%",
              }}
            >
              Disabled
            </Button>
          )
        ) : (
          <CustomButton
            sx={{
              p: 1,
              width: "98%",
              borderRadius: 2,
              mb: 3,
              ml: "1%",
              mr: "1%",
              mt: "1%",
            }}
            label={"Add New Item"}
          />
        ))}
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={tasks}
          columns={columns}
          options={options}
        // filter={false}
        />
      </ThemeProvider>
      {searchOpen && (
        <SearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
        />
      )}
      {popoverOpen && (
        <FilterList
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filterStatusData={filterData}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          pull={pull}
          setpull={setpull}
          pullvalue={pullvalue}
        />
      )}
     

      {renderSnackBar()}
      {loading && <Spinner />}
    </div>
  );
};

export default TaskTable;

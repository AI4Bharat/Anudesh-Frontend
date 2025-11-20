"use client";

import React, { useEffect, useState } from "react";
import { parse } from "csv-parse/sync";
import dynamic from "next/dynamic";
import { Parser } from "json2csv";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "@/utils/utils";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  createProject,
  setPasswordForProject,
} from "@/Lib/Features/actions/projects";
import { useNavigate } from "react-router-dom";
import ColumnList from "@/components/common/ColumnList";
import { snakeToTitleCase } from "@/utils/utils";
import OutlinedTextField from "@/components/common/OutlinedTextField";
import Button from "@/components/common/Button";
import MenuItems from "@/components/common/MenuItems";
import "../../styles/Dataset.css";
import themeDefault from "@/themes/theme";
import tableTheme from "@/themes/tableTheme";
import { fetchDomains } from "@/Lib/Features/actions/domains";
import { fetchDatasetByType } from "@/Lib/Features/datasets/getDatasetByType";
import { fetchDatasetSearchPopup } from "@/Lib/Features/datasets/DatasetSearchPopup";
import { fetchLanguages } from "@/Lib/Features/fetchLanguages";
import { fetchDataitemsById } from "@/Lib/Features/datasets/GetDataitemsById";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { sampleQuestion, sampleMultipleLLMIDCPQuestion } from "./sampleQue";
import { fixed_Models, languageModelOptions } from "./models";
import { styled } from "@mui/styles";
import { Tooltip } from "@mui/material";
import { InfoOutlined } from "@material-ui/icons";
import { resetForm, saveProjectFormData } from "@/Lib/Features/projects/projectFormSlice";

const isNum = (str) => {
  var reg = new RegExp("^[0-9]*$");
  return reg.test(String(str));
};

const projectStage = [
  { name: "Annotation Stage", value: 1 },
  { name: "Review Stage", value: 2 },
  { name: "Super-Check Stage", value: 3 },
];

const CreateAnnotationsAutomatically = [
  { name: "None", value: "none" },
  { name: "Annotation", value: "annotation" },
  { name: "Review", value: "review" },
  { name: "Supercheck", value: "supercheck" },
];

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

const MUIDataTable = dynamic(() => import("mui-datatables"), {
  ssr: false,
  loading: () => (
    <Skeleton
      variant="rectangular"
      height={400}
      sx={{
        mx: 2,
        my: 3,
        borderRadius: "4px",
        transform: "none",
      }}
    />
  ),
});

const CreateProject = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const { id } = useParams();
    const formData1 = useSelector((state) => console.log(state)
    );
        const formData = useSelector((state) =>state.projectFormSlice.formData
    );


  const [displayWidth, setDisplayWidth] = useState(0);
  const ProjectDomains = useSelector((state) => state.domains?.domains);
  const DatasetInstances = useSelector((state) => state.getDatasetByType.data);
  const LanguageChoices = useSelector(
    (state) => state.getLanguages.data?.language,
  );
  const DataItems = useSelector((state) => state.GetDataitemsById.data);
  const NewProject = useSelector((state) => state.projects.newProject?.res);
  const UserData = useSelector((state) => state.getLoggedInData.data);
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [domains, setDomains] = useState([]);
  const [projectTypes, setProjectTypes] = useState(null);
  const [datasetTypes, setDatasetTypes] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [fixedModels, setFixedModels] = useState(fixed_Models); 
  const [samplingMode, setSamplingMode] = useState(null);
  const [random, setRandom] = useState("");
  const [batchSize, setBatchSize] = useState();
  const [batchNumber, setBatchNumber] = useState([]);
  const [samplingParameters, setSamplingParameters] = useState(null);
  const [selectedInstances, setSelectedInstances] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedAnnotatorsNum, setSelectedAnnotatorsNum] = useState(1);
  const [filterString, setFilterString] = useState(null);
  const filteredProjectStage =
    selectedAnnotatorsNum > 1
      ? projectStage.filter((stage) => stage.value !== 3)
      : projectStage;

  const workspaceDtails = useSelector(
    (state) => state.getWorkspaceDetails.data,
  );
  const [singleModelResponse, setSingleModelResponse] = useState(false);

  const [taskReviews, setTaskReviews] = useState(1);
  const [columns, setColumns] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [is_published, setIsPublished] = useState(false);
  const [conceal, setconceal] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({});
  const [createannotationsAutomatically, setsCreateannotationsAutomatically] =
    useState("none");
  const [passwordForProjects, setPasswordForProjects] = useState("");
  const [shownewpassword, setShowNewPassword] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [jsonInput, setJsonInput] = useState();
  const [questionsJSON, setQuestionsJSON] = useState();
  const [isModelSelectionEnabled, setIsModelSelectionEnabled] = useState(true);
  const [selectedLanguageModels, setSelectedLanguageModels] = useState(fixedModels);
  const [numSelectedModels, setNumSelectedModels] = useState(fixedModels.length);
  const [defaultValue, setDefaultValue] = useState(0);

  const handleTextareaChange = (event) => {
    setDefaultValue(event.target.value);
  };
    const saveToRedux = () => {
    dispatch(saveProjectFormData({
      title,
      description,
      selectedDomain,
      selectedType,
      sourceLanguage,
      targetLanguage,
      selectedInstances,
      confirmed,
      samplingMode,
      random,
      batchSize,
      batchNumber,
      selectedAnnotatorsNum,
      taskReviews,
      createannotationsAutomatically,
      is_published,
      conceal,
      jsonInput,
      isModelSelectionEnabled,
      selectedLanguageModels,
      fixedModels,
      numSelectedModels,
      defaultValue
    }));
  };

  useEffect(() => {
    saveToRedux();
  }, [
    title, description, selectedDomain, selectedType, sourceLanguage, targetLanguage,
    selectedInstances, confirmed, samplingMode, random, batchSize, batchNumber,
    selectedAnnotatorsNum, taskReviews, createannotationsAutomatically, is_published, conceal, jsonInput, isModelSelectionEnabled, selectedLanguageModels,
    fixedModels, numSelectedModels, defaultValue
  ]);
    useEffect(() => {
    setTitle(formData.title);
    setDescription(formData.description);
    setSelectedDomain(formData.selectedDomain);
    setSelectedType(formData.selectedType);
    setSourceLanguage(formData.sourceLanguage);
    setTargetLanguage(formData.targetLanguage);
    setSelectedInstances(formData.selectedInstances);
    setConfirmed(formData.confirmed);
    setSamplingMode(formData.samplingMode);
    setRandom(formData.random);
    setBatchSize(formData.batchSize);
    setBatchNumber(formData.batchNumber);
    setSelectedAnnotatorsNum(formData.selectedAnnotatorsNum);
    setTaskReviews(formData.taskReviews);
    setsCreateannotationsAutomatically(formData.createannotationsAutomatically);
    setIsPublished(formData.is_published);
    setconceal(formData.conceal);
    setJsonInput(formData.jsonInput);
    setIsModelSelectionEnabled(formData.isModelSelectionEnabled);
    setSelectedLanguageModels(formData.selectedLanguageModels);
    setFixedModels(formData.fixedModels);
    setNumSelectedModels(formData.numSelectedModels);
    setDefaultValue(formData.defaultValue);
  }, []);

  // Clear form function
  const clearFormState = () => {
    dispatch(resetForm());
    // Reset local state
    setTitle('');
    setDescription('');
    setSelectedDomain('');
    setSelectedType('');
    setSourceLanguage('');
    setTargetLanguage('');
    setSelectedInstances([]);
    setConfirmed(false);
    setSamplingMode(null);
    setRandom('');
    setBatchSize('');
    setBatchNumber([]);
    setSelectedAnnotatorsNum(1);
    setTaskReviews(1);
    setsCreateannotationsAutomatically('none');
    setIsPublished(false);
    setPasswordForProjects('');
    setconceal(false);
    setJsonInput('');
    setIsModelSelectionEnabled(true);
    setSelectedLanguageModels(fixed_Models);
    setFixedModels(fixed_Models);
    setNumSelectedModels();
    setDefaultValue(0);
  };

  useEffect(() => {
    if (selectedType === "MultipleLLMInstructionDrivenChat") {
      setJsonInput(JSON.stringify(sampleMultipleLLMIDCPQuestion, null, 2));
      setQuestionsJSON(sampleMultipleLLMIDCPQuestion);
    } else {
      setJsonInput(JSON.stringify(sampleQuestion, null, 2));
      setQuestionsJSON(sampleQuestion);
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedLanguageModels.length < numSelectedModels) {
    setNumSelectedModels(Math.max(fixedModels.length, selectedLanguageModels.length));
  }
  
  if (numSelectedModels < fixedModels.length) {
    setNumSelectedModels(fixedModels.length);
  }

  }, [selectedLanguageModels, numSelectedModels,fixedModels.length]);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const handleJsonInputChange = (event) => {
    const input = event.target.value;
    setJsonInput(input);
    try {
      const parsedInput = JSON.parse(input);
      if (
        Array.isArray(parsedInput) &&
        parsedInput.every((item) => typeof item === "object" && item !== null)
      ) {
        setQuestionsJSON(parsedInput);
      }
    } catch (error) {
      console.error("Invalid JSON input");
    }
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        const [expandedRow, setExpandedRow] = useState(null);
        try {
          const csvJson = convertCsvToJson(csvData);
          setJsonInput(JSON.stringify(csvJson, null, 2));
          setQuestionsJSON(csvJson);
        } catch (error) {
          console.error("Error parsing CSV:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const convertCsvToJson = (csvData) => {
    const records = parse(csvData, {
      columns: true, // Treat first row as headers
      skip_empty_lines: true, // Skip empty lines
      cast: true, // Automatically cast values
      on_record: (record) => {
        const arrayColumns = ["rating_scale_list", "input_selections_list"];

        arrayColumns.forEach((column) => {
          if (
            record[column] &&
            record[column].startsWith("[") &&
            record[column].endsWith("]")
          ) {
            try {
              record[column] = JSON.parse(record[column].replace(/""/g, '"'));
            } catch (e) {
              // If parsing fails, keep the original value
            }
          }
        });
        return record;
      },
    });

    return records;
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  const excludeKeys = [
    "parent_data_id",
    "instance_id_id",
    "datasetbase_ptr_id",
    "key",
    "instance_id",
    "labse_score",
    "interactions_json",
    "eval_form_json",
    "multiple_interaction_json",
    "parent_data",
    "id",
    "rating",
  ];

  const getWorkspaceDetails = () => {
    dispatch(fetchWorkspaceDetails(id));
  };

  useEffect(() => {
    getWorkspaceDetails();
  }, []);

  useEffect(() => {
    dispatch(fetchDomains());
  }, []);
  const onSelectDomain = (value) => {
    setSelectedDomain(value);
  };

  const handleChangeIsPublished = (event) => {
    setIsPublished(event.target.checked);
  };
  const handleChangeconceal = (event) => {
    setconceal(event.target.checked);
  };

  useEffect(() => {
    setTotalDataitems(DataItems.count);
    let fetchedItems = DataItems.results;
    setTableData(fetchedItems);
    let tempColumns = [];
    if (selectedColumns?.length === 0) {
      columns?.length > 0
        ? setSelectedColumns(columns)
        : fetchedItems?.length > 0 &&
        setSelectedColumns(Object.keys(fetchedItems[0]));
    }

    if (fetchedItems?.length > 0) {
      Object.keys(fetchedItems[0]).forEach((keys) => {
        const isSelectedColumn = selectedColumns?.includes(keys);
        if (!excludeKeys?.includes(keys)) {
          tempColumns.push({
            name: keys,
            label: snakeToTitleCase(keys),
            options: {
              filter: false,
              sort: false,
              align: "center",
              display: isSelectedColumn ? "true" : "false",
              setCellProps: () => ({
                style: {
                  height: "70px",
                  fontSize: "16px",
                  padding: "16px",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                },
              }),
              customHeadLabelRender: customColumnHead,
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
                      {[
                        "metadata_json",
                        "prediction_json",
                        "ocr_prediction_json",
                        "transcribed_json",
                        "draft_data_json",
                        "ocr_transcribed_json",
                      ]?.includes(keys) && value !== null
                        ? JSON.stringify(value).replace(/\\/g, "")
                        : value}
                    </TruncatedContent>
                  </RowContainer>
                );
              },
            },
          });
        }
      });
    }
    setColumns(tempColumns);
  }, [DataItems, expandedRow]);

  useEffect(() => {
    if (columns?.length > 0 && selectedColumns?.length > 0) {
      const newCols = columns?.map((col) => ({
        ...col,
        options: {
          ...col.options,
          display: selectedColumns.includes(col.name) ? "true" : "false",
        },
      }));
      if (JSON.stringify(newCols) !== JSON.stringify(columns)) {
        setColumns(newCols);
      }
    }
  }, [selectedColumns, columns]);

  useEffect(() => {
    if (LanguageChoices && LanguageChoices?.length > 0) {
      let temp = [];
      LanguageChoices.forEach((element) => {
        temp.push({
          name: element,
          value: element,
        });
      });
      setLanguageOptions(temp);
    }
  }, [LanguageChoices]);

  useEffect(() => {
    if (UserData) {
      const tempDomains = [];
      const tempTypes = {};
      const tempDatasetTypes = {};
      const tempColumnFields = {};
      for (const domain in ProjectDomains) {
        tempDomains.push(domain);
        const tempTypesArr = [];
        for (const project_type in ProjectDomains[domain]["project_types"]) {
          tempTypesArr.push(project_type);
          if (
            ProjectDomains[domain]["project_types"][project_type][
            "input_dataset"
            ]
          ) {
            tempDatasetTypes[project_type] =
              ProjectDomains[domain]["project_types"][project_type][
              "input_dataset"
              ]["class"];
            tempColumnFields[project_type] =
              ProjectDomains[domain]["project_types"][project_type][
              "input_dataset"
              ]["fields"];
          }
        }
        tempTypes[domain] = tempTypesArr;
      }
      setDomains(
        tempDomains?.map((key) => {
          return {
            name: key,
            value: key,
          };
        }),
      );
      setProjectTypes(tempTypes);
      setDatasetTypes(tempDatasetTypes);
    }
  }, [ProjectDomains]);

  const handleRandomChange = (e) => {
    setRandom(e.target.value);
    setSamplingParameters(
      e.target.value ? { fraction: parseFloat(e.target.value / 100) } : null,
    );
  };
  useEffect(() => {
    if (batchSize && batchNumber) {
      setSamplingParameters({
        batch_size: batchSize,
        batch_number: new Function("return [" + [batchNumber] + "]")(),
      });
    } else {
      setSamplingParameters(null);
    }
  }, [batchSize, batchNumber]);

  const handleTogglenewpasswordVisibility = () => {
    setShowNewPassword(!shownewpassword);
  };

  const onSelectProjectType = (value) => {
    setSelectedType(value);
    dispatch(fetchDatasetByType(datasetTypes[value]));
  };
  useEffect(() => {
    setSelectedType("");
    setSamplingParameters(null);
    setConfirmed(false);
    dispatch(fetchLanguages());
    setTableData([]);
    setCurrentPageNumber(1);
    setCurrentRowPerPage(10);
  }, [selectedDomain]);

  useEffect(() => {
    let tempInstanceIds = {};
    for (const instance in DatasetInstances) {
      tempInstanceIds[DatasetInstances[instance]["instance_id"]] =
        DatasetInstances[instance]["instance_name"];
    }
    setInstanceIds(tempInstanceIds);
  }, [DatasetInstances]);
  const handleCreateProject = async () => {
      const autoAssignCount = parseInt(defaultValue);

  let baseMetadata = {};
  if (selectedType === "MultipleLLMInstructionDrivenChat") {
    baseMetadata = {
            enable_preference_selection: isModelSelectionEnabled,
            questions_json: questionsJSON,
            models_set: selectedLanguageModels,
            fixed_models: fixedModels,
            num_models: numSelectedModels,
                        single_model_response:singleModelResponse

    };
  } else {
    baseMetadata = questionsJSON;
  }

  if (workspaceDtails?.guest_workspace_display === "Yes") {
    baseMetadata = {
      ...baseMetadata,
      auto_assign_count: autoAssignCount
    };
  }

    const newProject = {
      title: title,
      description: description,
      created_by: UserData?.id,
      is_archived: false,
      is_published: false,
      users: [UserData?.id],
      workspace_id: id,
      organization_id: UserData?.organization?.id,
      project_type: selectedType,
      src_language: sourceLanguage,
      tgt_language: targetLanguage,
      dataset_id: selectedInstances,
      label_config: "string",
      sampling_mode: samplingMode,
      sampling_parameters_json: samplingParameters,
      batch_size: batchSize,
      batch_number: batchNumber,
      filter_string: filterString,
      project_stage: taskReviews,
      required_annotators_per_task: selectedAnnotatorsNum,
      automatic_annotation_creation_mode: createannotationsAutomatically,
      is_published: is_published,
      password: passwordForProjects,
      metadata_json:baseMetadata,
      conceal: conceal,
    };
    if (sourceLanguage) newProject["src_language"] = sourceLanguage;
    if (targetLanguage) newProject["tgt_language"] = targetLanguage;
    dispatch(createProject(newProject));
  };

  const setPasswordForNewProject = async (projectId) => {
    try {   
      dispatch(
        setPasswordForProject({ projectId, password: passwordForProjects }),
      );
    } catch (error) {
      console.error("Error setting password for project:", error);
    }
    clearFormState()
  };

  useEffect(() => {
    if (NewProject?.id) {
      navigate(`/projects/${NewProject.id}`, { replace: true });
      window.location.reload();

      if (NewProject?.id) {
        const projectId = NewProject?.id;
        setPasswordForNewProject(projectId);
      }
    }
  }, [NewProject]);
  useEffect(() => {
    getsearchdataitems();
  }, [currentPageNumber, currentRowPerPage, selectedFilters]);

  const getsearchdataitems = () => {
    const searchPopupdata = {
      instance_ids: selectedInstances,
      search_keys: selectedFilters,
    };
    dispatch(fetchDatasetSearchPopup(searchPopupdata));
  };

  const onSelectInstances = (e) => {
    setSelectedInstances(e.target.value);
    setSamplingMode(null);
    setSamplingParameters(null);
  };

  const handleReviewToggle = async (e) => {
    setTaskReviews(e.target.value);
  };

  const handleChangeInstances = () => {
    setConfirmed(false);
    setTableData([]);
    setCurrentPageNumber(1);
    setCurrentRowPerPage(10);
    setSamplingMode(null);
    setSamplingParameters(null);
  };

  const getDataItems = () => {
    const dataObj = {
      instanceIds: selectedInstances,
      datasetType: datasetTypes[selectedType],
      selectedFilters: selectedFilters,
      pageNo: currentPageNumber,
      countPerPage: currentRowPerPage,
    };
    dispatch(fetchDataitemsById(dataObj));
  };

  const onSelectSamplingMode = (value) => {
    setSamplingMode(value);
    if (value === "f") {
      setSamplingParameters({});
    }
  };
  const onConfirmSelections = () => {
    setConfirmed(true);
    getDataItems();
  };

  const handleChangeCreateAnnotationsAutomatically = (e) => {
    setsCreateannotationsAutomatically(e.target.value);
  };

  useEffect(() => {
    if (selectedInstances && datasetTypes) {
      getDataItems();
    }
  }, [currentPageNumber, currentRowPerPage]);

  const downloadCsv = () => {
    try {
      const json = JSON.parse(jsonInput); // Ensure this is valid JSON

      if (json?.length === 0) {
        return;
      }

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(json);

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error converting JSON to CSV", error);
    }
  };
  const replacer = (key, value) => (value === null ? "" : value);

  const renderToolBar = () => {
    return (
      <Grid container spacing={0} md={12}>
        <Grid
          item
          xs={8}
          sm={8}
          md={12}
          lg={12}
          xl={12}
          className="filterToolbarContainer"
        >
          <Grid container direction="row" justifyContent={"flex-end"}>
            <ColumnList
              columns={columns}
              setColumns={setSelectedColumns}
              selectedColumns={selectedColumns}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const customColumnHead = (col) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "5px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
      </Box>
    );
  };
  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
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
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
            {
              marginRight: "10px",
            },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
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
    count: totalDataitems,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100],
    onChangePage: (currentPage) => {
      setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentRowPerPage(rowPerPageCount);
    },
    selectableRows: "none",
    download: false,
    search: false,
    filter: false,
    print: false,
    viewColumns: false,
    textLabels: {
      body: {
        noMatch: "No records ",
      },
      toolbar: {
        viewColumns: "View Column",
      },
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "Rows per page",
        displayRows: "OF",
      },
      options: { sortDirection: "desc" },
    },
    jumpToPage: true,
    serverSide: true,
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

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid container direction="row" sx={{ width: "100%" }}>
        <Card className="workspaceCard">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ pb: "6rem" }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
              <Typography variant="h2" gutterBottom component="div">
                Create a Project
              </Typography>
              <Button
                label={"Clear Form"}
                onClick={clearFormState}
                variant="outlined"
                color="primary"
                sx={{ height: 'fit-content' }}
              />
            </Grid>

            <Card sx={{ p: 1, mb: 1 }}>

              <Grid container spacing={1} p={1}>
                <Grid item xs={12} md={6}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Project Title<span style={{ color: "#d93025" ,fontSize:"20px"}}>*</span>:<Tooltip 
                  title="Title of the project." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <OutlinedTextField
                        fullWidth
                        size="small"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter project title"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Description Field */}
                <Grid item xs={12} md={6}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Project Description<span style={{ color: "#d93025",fontSize:"20px" }}>*</span>:<Tooltip 
                  title="Provide a detailed description of the project's objectives and scope." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <OutlinedTextField
                        fullWidth
                        size="small"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter project description"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>{domains && (
              <Card sx={{ p: 1, mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Project Configuration
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  {/* Category Field */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', flexDirection:"column" }}>
                      <Typography variant="body2" sx={{  mr: 1, fontWeight: 'bold' }}>
                        Category<span style={{ color: "#d93025" ,fontSize:"20px"}}>*</span>:<Tooltip 
                  title="Select the domain or category that best describes your project's focus area." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <MenuItems
                          menuOptions={domains}
                          handleChange={onSelectDomain}
                          value={selectedDomain}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Project Type Field */}
                  <Grid item xs={12} md={3} >
                    <Box sx={{ display: 'flex',flexDirection:"column" }}>
                      <Typography variant="body2" sx={{  mr: 1, fontWeight: 'bold' }}>
                        Project Type<span style={{ color: "#d93025" ,fontSize:"20px"}}>*</span>:<Tooltip 
                  title="Choose the type of project workflow that matches your annotation needs." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <MenuItems
                          menuOptions={selectedDomain ? projectTypes[selectedDomain]?.map((key) => ({
                            name: key,
                            value: key,
                          })) : []}
                          handleChange={onSelectProjectType}
                          value={selectedType}
                          size="small"
                          disabled={!selectedDomain}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Source Language Field */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex',flexDirection:"column" }}>
                      <Typography variant="body2" sx={{ mr: 1, fontWeight: 'normal',color:"#454545)" }}>
                        Source
                        Language:<Tooltip 
                  title="Select the original language of the data you'll be working with." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={sourceLanguage}
                            onChange={(e) => setSourceLanguage(e.target.value)}
                            MenuProps={MenuProps}
                            disabled={!selectedDomain}
                          >
                            {languageOptions?.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Target Language Field */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', flexDirection:"column" }}>
                      <Typography variant="body2" sx={{  mr: 1, fontWeight: 'normal' }}>
                        Target Language:<Tooltip 
                  title="Select the target language for translation or multilingual projects" 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            MenuProps={MenuProps}
                            disabled={!selectedDomain}
                          >
                            {languageOptions?.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            )}
            {selectedType === "MultipleLLMInstructionDrivenChat" && selectedDomain === "Chat" && (
              <Card sx={{ p: 1, mb: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Chat Configuration
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  {/* Toggle on the left */}
                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: 'grey.50', borderRadius: 1, height: '100%' }}>
                      <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 'bold', mr: 1 }}>
                        Enable Feedback Form<span style={{ color: "#d93025",fontSize:"20px" }}>*</span><Tooltip 
                  title="Enable or disable the feedback collection form for chat interactions." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Switch
                        checked={isModelSelectionEnabled}
                        onChange={(e) => setIsModelSelectionEnabled(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </Grid>

                  {/* Language Models Selection */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex',flexDirection:"column" }}>
                      <Typography variant="body2" sx={{ minWidth: '50px', mr: 1, fontWeight: "bold" }}>
                        Models<span style={{ color: "#d93025" ,fontSize:"20px"}}>*</span>:<Tooltip 
                  title="Select the language models to be used in the chat interactions." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            multiple
                            value={selectedLanguageModels}
                            onChange={(e) => setSelectedLanguageModels(e.target.value)}
                            renderValue={(selected) => (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected?.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                    size="small"
                                    deleteIcon={
                                      value !== "Sarvam" && value !== "Ai4B" ? (
                                        <CancelIcon
                                          onMouseDown={(event) => event.stopPropagation()}
                                        />
                                      ) : undefined
                                    }
                                    onDelete={
                                      value !== "Sarvam" && value !== "Ai4B"
                                        ? () => {
                                          setSelectedLanguageModels(
                                            selectedLanguageModels.filter(
                                              (instance) => instance !== value,
                                            ),
                                          );
                                        }
                                        : undefined
                                    }
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {languageModelOptions?.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Fixed Models Selection */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex',flexDirection:"column" }}>
                      <Typography variant="body2" sx={{ minWidth: '85px', mr: 1, fontWeight: "bold" }}>
                        Fixed Models:<Tooltip 
                  title="Select models that will always be included in the chat interactions." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            multiple
                            value={fixedModels}
                            onChange={(e) => {
                              if (e.target.value.length > 0) {
                                setFixedModels(e.target.value);
                              }
                            }}
                            renderValue={(selected) => (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                    size="small"
                                    deleteIcon={
                                      <CancelIcon onMouseDown={(event) => event.stopPropagation()} />
                                    }
                                    onDelete={() => {
                                      if (selected.length > 1) {
                                        setFixedModels(selected.filter((model) => model !== value));
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                            disabled={selectedLanguageModels.length === 0}
                          >
                            {selectedLanguageModels.map((model) => (
                              <MenuItem key={model} value={model}>
                                {model}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>
                  {selectedType === "MultipleLLMInstructionDrivenChat" &&
                    selectedDomain === "Chat" && selectedLanguageModels.length >= fixedModels.length ? (

                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex',flexDirection:"column" }}>
                      <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
                          No of models to Activate:
                          <span style={{ color: "#d93025" }}>*</span> :
                          <Tooltip 
                  title="Number of models to Activate for Multi-Model Chat Support." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                  </Tooltip>
                        </Typography>
                        <FormControl fullWidth  size="small">
                          <Select
                            value={numSelectedModels}
                            onChange={(e) => setNumSelectedModels(e.target.value)}
                            MenuProps={MenuProps}
                          >
                            {Array.from(
                              { length: selectedLanguageModels.length - fixedModels.length + 1 },
            (_, i) => fixedModels.length + i,

                            ).map((num) => (
                              <MenuItem key={num} value={num}>
                                {num}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                      </Box>
                    </Grid>
                  ) : null}

                </Grid>
              </Card>
            )}
            {/* {selectedType === "MultipleLLMInstructionDrivenChat" &&
              selectedDomain === "Chat" && selectedLanguageModels.length >= fixedModels.length ? (
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{
                  paddingTop: "10px",
                }}
              >
                <Typography>
                  Number of models to Activate for Multi-Model Chat Support:
                  <span style={{ color: "#d93025" }}>*</span> :
                </Typography>
                <FormControl fullWidth sx={{ marginTop: "10px" }}>
                  <Select
                    value={numSelectedModels}
                    onChange={(e) => setNumSelectedModels(e.target.value)}
                    MenuProps={MenuProps}
                  >
                    {Array.from(
                      { length: selectedLanguageModels.length - 1 },
                      (_, i) => i + 2,
                    ).map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null} */}
            {instanceIds && (
              <>
                {selectedType && Object.keys(instanceIds)?.length > 0 && (
                        <Card sx={{ p: 2, mb: 2, border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Dataset Configuration
        </Typography>


                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: '180px', mr: 2, fontWeight: "bold" }}>
                            Select sources to fetch data from <span style={{ color: "#d93025",fontSize:"20px" }}>*</span>:<Tooltip 
                  title="Choose the data sources you want to include in your project. You can select multiple sources from the available options." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                          </Typography>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <FormControl fullWidth disabled={confirmed} size="small">
                              <Select
                                multiple
                                value={selectedInstances}
                                onChange={onSelectInstances}
                                renderValue={(selected) => (
                                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((key) => (
                                      <Chip
                                        key={key}
                                        label={instanceIds[key]}
                                        size="small"
                                        deleteIcon={
                                          <CancelIcon
                                            onMouseDown={(event) => event.stopPropagation()}
                                          />
                                        }
                                        onDelete={
                                          confirmed
                                            ? undefined
                                            : () => {
                                              setSelectedInstances(
                                                selectedInstances.filter(
                                                  (instance) => instance !== key,
                                                ),
                                              );
                                            }
                                        }
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                {Object.keys(instanceIds).map((key) => (
                                  <MenuItem key={instanceIds[key]} value={key}>
                                    {instanceIds[key]}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Buttons on the same row */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {selectedInstances?.length > 0 && (
                            <>
                              <Button
                                onClick={onConfirmSelections}
                                label={"Confirm Selections"}
                                disabled={confirmed}
                                size="small"
                              />
                              <Button
                                onClick={handleChangeInstances}
                                label={"Change Sources"}
                                disabled={!confirmed}
                                variant="outlined"
                                size="small"
                              />
                            </>
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                  </Card>
                )}
              </>
            )}
            {selectedType && selectedInstances?.length > 0 && confirmed && (
              <>
                <Grid
                  item
                  className="projectsettingGrid"
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div" variant="body2" sx={{ fontWeight: "bold" }}>
                    Dataset Preview:
                  </Typography>
                </Grid>
                <Grid
                  item
                  className="projectsettingGrid"
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <ThemeProvider theme={tableTheme}>
                    <MUIDataTable
                      key={`table-${displayWidth}`}
                      title={""}
                      data={tableData}
                      columns={columns.filter((column) =>
                        selectedColumns?.includes(column.name),
                      )}
                      options={{
                        ...options,
                        tableBodyHeight: `${typeof window !== "undefined"
                          ? window.innerHeight - 200
                          : 400
                          }px`,
                      }}
                    />
                  </ThemeProvider>
                </Grid>
                <Card sx={{ p: 1, mb: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: "bold" }}>
                    Sampling & Configuration
                  </Typography>

                  <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12} md={6} lg={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold", mr: 1 }}>
                          Sampling Type<span style={{ color: "#d93025" ,fontSize:"20px"}}>*</span>:<Tooltip 
                  title="Sampling Mode of the dataset for the project - Random, Batch or Full." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                        </Typography>
                        <MenuItems
                          menuOptions={["Random", "Full", "Batch"].map((mode) => {
                            return {
                              name: mode,
                              value: mode[0].toLowerCase(),
                            };
                          })}
                          handleChange={onSelectSamplingMode}
                          defaultValue=""
                          size="small"
                        />
                      </Box>
                    </Grid>

                    {/* Filter String - Always visible */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: "normal" }}>
                          Filter String:<Tooltip 
                  title="Filter string for filtering data for project." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                        </Typography>
                        <OutlinedTextField
                          fullWidth
                          size="small"
                          value={filterString}
                          onChange={(e) => {
                            setFilterString(e.target.value);
                          }}
                          placeholder="Enter filter criteria"
                        />
                      </Box>
                    </Grid>

                    {/* Sampling Percentage - Only visible when samplingMode is "r" */}
                    {samplingMode === "r" && (
                      <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
                            Sampling Percentage:<Tooltip 
                  title="Choose the data sources you want to include in your project. You can select multiple sources from the available options." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                          </Typography>
                          <OutlinedTextField
                            fullWidth
                            size="small"
                            value={random}
                            onChange={handleRandomChange}
                            type="number"
                            inputProps={{ min: 0, max: 100 }}
                          />
                        </Box>
                      </Grid>
                    )}

                    {/* Batch Size - Only visible when samplingMode is "b" */}
                    {samplingMode === "b" && (
                      <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
                            Batch Size:<Tooltip 
                  title="" 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                          </Typography>
                          <OutlinedTextField
                            fullWidth
                            size="small"
                            type="number"
                            value={batchSize}
                            onChange={(e) =>
                              isNum(e.target.value) &&
                              setBatchSize(Number(e.target.value) || e.target.value)
                            }
                            inputProps={{ min: 1 }}
                          />
                        </Box>
                      </Grid>
                    )}

                    {/* Batch Number - Only visible when samplingMode is "b" */}
                    {samplingMode === "b" && (
                      <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
                            Batch Number:<Tooltip 
                  title="Choose the data sources you want to include in your project. You can select multiple sources from the available options." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                          </Typography>
                          <OutlinedTextField
                            fullWidth
                            size="small"
                            value={batchNumber}
                            onChange={(e) => setBatchNumber(e.target.value)}
                          />
                        </Box>
                      </Grid>
                    )}

                    {/* Annotators Per Task - Only visible when samplingParameters exists */}
                    {samplingParameters && (
                      <Grid item xs={12} md={6} lg={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
                            Annotators Per Task :<Tooltip 
                  title="No. of annotators required for each task." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                          </Typography>
                          <OutlinedTextField
                            fullWidth
                            size="small"
                            value={selectedAnnotatorsNum}
                            onChange={(e) => setSelectedAnnotatorsNum(e.target.value)}
                            type="number"
                            inputProps={{ min: 1 }}
                          />
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>

                <Card sx={{ p: 1, mb: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                    Project Settings
                  </Typography>

                  <Grid container spacing={2} padding={1}>
                    {/* Project Stage */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Box sx={{ display: 'flex',flexDirection:"column" }}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: "normal", mr: 1 }}>
                          Project Stage:<Tooltip 
                  title="Select the workflow stage for your project (Annotation, Review, or Super-Check)." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={taskReviews}
                            onChange={handleReviewToggle}
                          >
                            {filteredProjectStage.map((type, index) => (
                              <MenuItem value={type.value} key={index}>
                                {type.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    {/* Create Annotations Automatically */}
                    <Grid item xs={12} md={6} lg={3}>
                      <Box sx={{ display: 'flex' ,flexDirection:"column"}}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: "normal", mr: 1 }}>
                          Auto Create Annotations:<Tooltip 
                  title="Choose whether to automatically create annotations at different stages of the workflow." 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={createannotationsAutomatically}
                            onChange={handleChangeCreateAnnotationsAutomatically}
                          >
                            {CreateAnnotationsAutomatically.map((type, index) => (
                              <MenuItem value={type.value} key={index}>
                                {type.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>


                    {(selectedType === "ModelInteractionEvaluation" ||
                      selectedType === "MultipleInteractionEvaluation" ||
                      selectedType === "MultipleLLMInstructionDrivenChat") && (
                        <Grid item xs={12}>
                          <Box sx={{ p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" gutterBottom fontWeight="bold">
                              Upload or Paste Evaluation JSON<span style={{ color: "#d93025" ,fontSize:"20px"}}>*</span><Tooltip 
                  title="Paste JSON data to configure the evaluation form" 
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{  color: 'primary.main' }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Single Model Response</Typography>
          <Switch
            checked={singleModelResponse}
            onChange={(e) => setSingleModelResponse(e.target.checked)}
            size="small"
          />
        </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvUpload}
                              />

                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <TextField
                                  variant="outlined"
                                  multiline
                                  rows={4}
                                  value={jsonInput}
                                  onChange={handleJsonInputChange}
                                  fullWidth
                                  size="small"
                                  fontSize="8px"
                                />
                                <IconButton
                                  onClick={downloadCsv}
                                  aria-label="download CSV"
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                >
                                  <ArrowCircleDownIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                          
                        </Grid>
                      )}
                    
                  </Grid>
                </Card>
              </>
            )}
            {selectedType && selectedInstances?.length > 0 && confirmed && (
              <>
                {/* Guest Workspace Settings Card */}
                {workspaceDtails?.guest_workspace_display === "Yes" && (
                  <Card sx={{ p: 2, mb: 2, border: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Guest Workspace Settings
                      </Typography>
                    </Box>

                    <Grid container spacing={2} alignItems="center">
                      {/* Password Field */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: '100px', fontWeight: "normal" }}>
                            Password:                                <Tooltip title="Set a Password for guest user.">
                                  <IconButton size="small" sx={{ color: 'primary.main', ml: 0.5 }}>
                                    <InfoOutlined fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                          </Typography>
                          <Box sx={{ flexGrow: 1 }}>
                            <OutlinedTextField
                              fullWidth
                              size="small"
                              value={passwordForProjects}
                              type={shownewpassword ? "text" : "password"}
                              onChange={(e) => setPasswordForProjects(e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={handleTogglenewpasswordVisibility}
                                      edge="end"
                                      size="small"
                                    >
                                      {shownewpassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      {/* Auto Assign Count Field */}
                      <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: '120px', fontWeight: "normal" }}>
                            Auto Assign:                                <Tooltip title="Auto Assign count of task for users.">
                                  <IconButton size="small" sx={{ color: 'primary.main', ml: 0.5 }}>
                                    <InfoOutlined fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                          </Typography>
                          <OutlinedTextField
                            fullWidth
                            size="small"
                            type="number"
                            value={defaultValue}
                            onChange={handleTextareaChange}
                            inputProps={{ min: 1, max: 100 }}
                          />
                        </Box>
                      </Grid>

                      {/* Toggle Switches */}
                      <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={is_published}
                                onChange={handleChangeIsPublished}
                                color="primary"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Publish
                                <Tooltip title="To publish the project">
                                  <IconButton size="small" sx={{ color: 'primary.main', ml: 0.5 }}>
                                    <InfoOutlined fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            }
                          />

                          <FormControlLabel
                            control={
                              <Switch
                                checked={conceal}
                                onChange={handleChangeconceal}
                                color="primary"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Hide Details                                <Tooltip title="To hide annotator,reviewer and superchecker details.">
                                  <IconButton size="small" sx={{ color: 'primary.main', ml: 0.5 }}>
                                    <InfoOutlined fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                              </Box>
                            }
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                )}
              </>
            )}
            <Grid
              item
              className="projectsettingGrid"
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >

            </Grid>

            <Grid
              className="projectsettingGrid"
              style={{}}
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
            >
              <Button
                style={{ margin: "0px 20px 0px 0px" }}
                label={"Create Project"}
                onClick={handleCreateProject}
                disabled={
                  title &&
                    description &&
                    selectedDomain &&
                    selectedType &&
                    selectedInstances &&
                    domains &&
                    samplingMode &&
                    (selectedType === "ModelInteractionEvaluation" || "multipleInteractionEvaluation"
                      ? questionsJSON?.length > 0
                      : true)
                    ? false
                    : true
                }
              />
              <Button
                label={"Cancel"}
                onClick={() => navigate(`/workspaces/${id}`)}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12} />
          </Grid>
        </Card>{" "}
      </Grid>
    </ThemeProvider>
  );
};

export default CreateProject;
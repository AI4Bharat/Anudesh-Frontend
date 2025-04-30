"use client";

import React, { useEffect, useState } from "react";
import { parse } from "csv-parse/sync";
import dynamic from 'next/dynamic';
import { Parser } from "json2csv";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import  Box  from "@mui/material/Box";
import {ThemeProvider} from "@mui/material";
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
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "@/utils/utils";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
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
import DatasetSearchPopup from "@/components/datasets/DatasetSearchPopup";
import { fetchDataitemsById } from "@/Lib/Features/datasets/GetDataitemsById";
import { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import sampleQuestion from "./sampleQue";
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

const CreateProject = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

  const dispatch = useDispatch();
  const { id } = useParams();
  //const { workspaceId } = useParams();
  const [displayWidth, setDisplayWidth] = useState(0);
  const ProjectDomains = useSelector((state) => state.domains?.domains);
  const DatasetInstances = useSelector((state) => state.getDatasetByType.data);
  // const DatasetFields = useSelector((state) => state.getDatasetFields.data);
  const LanguageChoices = useSelector(
    (state) => state.getLanguages.data?.language,
  );
  const DataItems = useSelector((state) => state.GetDataitemsById.data);
  const NewProject = useSelector((state) => state.projects.newProject?.res);
  const UserData = useSelector((state) => state.getLoggedInData.data);
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [projectTypes, setProjectTypes] = useState(null);
  const [datasetTypes, setDatasetTypes] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);
  const [columnFields, setColumnFields] = useState(null);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [searchedCol, setSearchedCol] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
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
  const [taskReviews, setTaskReviews] = useState(1);
  //Table related state variables
  const [columns, setColumns] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [is_published, setIsPublished] = useState(false);
  const [conceal, setconceal] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({});
  const [createannotationsAutomatically, setsCreateannotationsAutomatically] =
    useState("none");
  const [passwordForProjects, setPasswordForProjects] = useState("");
  const [shownewpassword, setShowNewPassword] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sampleQuestion));
  const [questionsJSON, setQuestionsJSON] = useState(sampleQuestion);

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
      } else {
        console.error("Input is not a valid array of objects");
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
        // Handle array-like values for specific columns
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

  useEffect(() => {
    console.log("questionsJSON:", questionsJSON);
    console.log("typeof questionsJSON:", typeof questionsJSON);
    console.log("Array.isArray(questionsJSON):", Array.isArray(questionsJSON));
  }, [questionsJSON]);

  console.log("questions json: " + typeof questionsJSON);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      parseCSV(file);
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split("\n").filter((line) => line.trim() !== "");
      const headers = lines[0].split(",").map((header) => header.trim());

      const jsonData = lines.slice(1).map((line) => {
        const values = [];
        let insideArray = false;
        let insideQuotes = false;
        let currentVal = "";
        let escape = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === "\\" && !escape) {
            escape = true;
            continue;
          }

          if (char === '"') {
            insideQuotes = !insideQuotes;
          }

          if (char === "[") {
            insideArray = true;
          } else if (char === "]") {
            insideArray = false;
          }

          if (char === "," && !insideArray && !insideQuotes && !escape) {
            let value = currentVal.trim();
            if (
              value.startsWith('"') &&
              value.endsWith('"') &&
              !value.startsWith('""')
            ) {
              value = value.slice(1, -1);
            }
            if (value.startsWith("[") && value.endsWith("]")) {
              value = value.replace(/""/g, '"');
              try {
                values.push(JSON.parse(value));
              } catch {
                values.push(value);
              }
            } else {
              value = value.replace(/\\"/g, '"');
              if (
                value.toLowerCase() === "true" ||
                value.toLowerCase() === "false"
              ) {
                values.push(value.toLowerCase() === "true");
              } else {
                values.push(value);
              }
            }
            currentVal = "";
          } else {
            currentVal += char;
            escape = false;
          }
        }

        let lastValue = currentVal.trim();
        if (
          lastValue.startsWith('"') &&
          lastValue.endsWith('"') &&
          !lastValue.startsWith('""')
        ) {
          lastValue = lastValue.slice(1, -1);
        }
        if (lastValue.startsWith("[") && lastValue.endsWith("]")) {
          lastValue = lastValue.replace(/""/g, '"');
          try {
            values.push(JSON.parse(lastValue));
          } catch {
            values.push(lastValue);
          }
        } else {
          lastValue = lastValue.replace(/\\"/g, '"');
          if (
            lastValue.toLowerCase() === "true" ||
            lastValue.toLowerCase() === "false"
          ) {
            values.push(lastValue.toLowerCase() === "true");
          } else {
            values.push(lastValue);
          }
        }

        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

      if (
        Array.isArray(jsonData) &&
        jsonData.every((item) => typeof item === "object" && item !== null)
      ) {
        console.log("Parsed JSON Data is an array of objects:", jsonData);
        setQuestionsJSON(jsonData);
      } else {
        console.error("Parsed JSON Data is not an array of objects");
      }
      if (Array.isArray(questionsJSON)) {
        console.log("questionsJSON is an array");
        if (
          questionsJSON.every(
            (item) => typeof item === "object" && item !== null,
          )
        ) {
          console.log("questionsJSON is an array of objects");
        } else {
          console.log("questionsJSON is not an array of objects");
        }
      } else {
        console.log("questionsJSON is not an array");
      }
    };

    reader.readAsText(file);
  };

  if (questionsJSON[0]?.mandatory) console.log("this is true");
  else console.log("this is false");
  /* eslint-disable react-hooks/exhaustive-deps */
  const searchOpen = Boolean(searchAnchor);
  const excludeKeys = [
    "parent_data_id",
    // "metadata_json",
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

  //Fetch and display Project Domains
  useEffect(() => {
    // if(ProjectDomains.status !== "succeeded")
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
    let tempSelected = [];
    if (fetchedItems?.length) {
      Object.keys(fetchedItems[0]).forEach((keys) => {
        if (!excludeKeys.includes(keys)) {
          tempColumns.push({
            name: keys,
            label: snakeToTitleCase(keys),
            options: {
              filter: false,
              sort: false,
              align: "center",
              setCellProps: () => ({
                style: {
                  height: "70px", fontSize: "16px",
                  padding: "16px",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }
              }),
              customHeadLabelRender: customColumnHead,
              customBodyRender: (value) => {
                if (
                  (keys == "metadata_json" ||
                    keys == "prediction_json" ||
                    keys == "ocr_prediction_json" ||
                    keys == "transcribed_json" ||
                    keys == "draft_data_json" ||
                    keys == "ocr_transcribed_json") &&
                  value !== null
                ) {
                  const data = JSON.stringify(value);
                  const metadata = data.replace(/\\/g, "");
                  return metadata;
                } else {
                  return value;
                }
              },
            },
          });
          tempSelected.push(keys);
        }
      });
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);
  }, [DataItems]);

  useEffect(() => {
    if (LanguageChoices && LanguageChoices.length > 0) {
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
      // let tempVariableParameters = {};
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
        tempDomains.map((key) => {
          return {
            name: key,
            value: key,
          };
        }),
      );
      // setVariableParameters(tempVariableParameters);
      setProjectTypes(tempTypes);
      setDatasetTypes(tempDatasetTypes);
      setColumnFields(tempColumnFields);
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

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };

  useEffect(() => {
    let tempInstanceIds = {};
    for (const instance in DatasetInstances) {
      tempInstanceIds[DatasetInstances[instance]["instance_id"]] =
        DatasetInstances[instance]["instance_name"];
    }
    setInstanceIds(tempInstanceIds);
  }, [DatasetInstances]);
  const handleCreateProject = async () => {
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
      // variable_parameters: selectedVariableParameters,
      filter_string: filterString,
      project_stage: taskReviews,
      required_annotators_per_task: selectedAnnotatorsNum,
      automatic_annotation_creation_mode: createannotationsAutomatically,
      is_published: is_published,
      password: passwordForProjects,
      metadata_json: questionsJSON,
      conceal: conceal
    };
    console.log(newProject);

    if (sourceLanguage) newProject["src_language"] = sourceLanguage;
    if (targetLanguage) newProject["tgt_language"] = targetLanguage;

    dispatch(createProject(newProject));
  };

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
    // variable_parameters: selectedVariableParameters,
    filter_string: filterString,
    project_stage: taskReviews,
    required_annotators_per_task: selectedAnnotatorsNum,
    automatic_annotation_creation_mode: createannotationsAutomatically,
    is_published: is_published,
    password: passwordForProjects,
    metadata_json: questionsJSON,
    conceal: conceal
  };
  console.log(newProject);

  const setPasswordForNewProject = async (projectId) => {
    try {
      console.log("Project id: " + projectId);
      console.log("password: " + passwordForProjects);
      dispatch(
        setPasswordForProject({ projectId, password: passwordForProjects }),
      );
    } catch (error) {
      console.error("Error setting password for project:", error);
    }
  };

  useEffect(() => {
    if (NewProject?.id) {
      navigate(`/projects/${NewProject.id}`, { replace: true });
      window.location.reload();

      if (NewProject?.id) {
        const projectId = NewProject?.id;
        console.log("Project ID:", projectId);
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
  const sample = useSelector((state) => console.log(state));

  const downloadCsv = () => {
    try {
      const json = JSON.parse(jsonInput); // Ensure this is valid JSON

      if (json.length === 0) {
        console.error("Empty JSON data");
        return;
      }

      // Configure `json2csv` parser options if necessary
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(json);

      // Create a CSV blob
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      // Create a link to download the CSV
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();

      // Cleanup
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
        <IconButton
          sx={{ borderRadius: "100%" }}
          onClick={(e) => handleShowSearch(col.name, e)}
        >
          <SearchIcon id={col.name + "_btn"} />
        </IconButton>
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
    count: totalDataitems,
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
      setCurrentRowPerPage(rowPerPageCount);
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
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Create a Project
              </Typography>
            </Grid>

            <Grid container direction="row">
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className="projectsettingGrid"
              >
                <Typography gutterBottom component="div" label="Required">
                  Title<span style={{ color: "#d93025" }}>*</span> :
                </Typography>
              </Grid>
              <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
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
              <Typography gutterBottom component="div">
                Description<span style={{ color: "#d93025" }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {domains && (
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
                  <Typography gutterBottom component="div">
                    Select a Category to Work in
                    <span style={{ color: "#d93025" }}>*</span> :
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={domains}
                    handleChange={onSelectDomain}
                    value={selectedDomain}
                  />
                </Grid>
              </>
            )}

            {selectedDomain && (
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
                  <Typography gutterBottom component="div">
                    Select a Project Type{" "}
                    <span style={{ color: "#d93025" }}>*</span> :
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={projectTypes[selectedDomain].map((key) => {
                      return {
                        name: key,
                        value: key,
                      };
                    })}
                    handleChange={onSelectProjectType}
                    value={selectedType}
                  />
                </Grid>
              </>
            )}

            {/* {selectedType &&
              variableParameters?.[selectedType]?.variable_parameters !==
              undefined && (
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
                    <Typography gutterBottom component="div">
                      Variable Parameters:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                    <OutlinedTextField
                      fullWidth
                      value={variable_Parameters_lang}
                      onChange={(e) =>
                        setVariable_Parameters_lang(e.target.value)
                      }
                    />
                  </Grid>
                </>
              )} */}
            {selectedDomain && (
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
                  <Typography gutterBottom component="div">
                    Source Language:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <FormControl fullWidth>
                    <Select
                      fullWidth
                      labelId="select-Language"
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      style={{ zIndex: "0" }}
                      inputProps={{ "aria-label": "Without label" }}
                      MenuProps={MenuProps}
                    >
                      {languageOptions?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  <Typography gutterBottom component="div">
                    Target Language:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <FormControl fullWidth>
                    <Select
                      fullWidth
                      labelId="select-Language"
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      style={{ zIndex: "0" }}
                      inputProps={{ "aria-label": "Without label" }}
                      MenuProps={MenuProps}
                    >
                      {languageOptions?.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {instanceIds && (
              <>
                {selectedType && Object.keys(instanceIds).length > 0 && (
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
                      <Typography gutterBottom component="div">
                        Select sources to fetch data from{" "}
                        <span style={{ color: "#d93025" }}>*</span> :
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                      <FormControl
                        fullWidth
                        sx={{ minWidth: 120 }}
                        disabled={confirmed}
                      >
                        <Select
                          fullWidth
                          style={{ zIndex: "0" }}
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={MenuProps}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          onChange={onSelectInstances}
                          value={selectedInstances}
                          multiple={true}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((key) => (
                                <Chip
                                  key={key}
                                  label={instanceIds[key]}
                                  deleteIcon={
                                    <CancelIcon
                                      onMouseDown={(event) =>
                                        event.stopPropagation()
                                      }
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
                        >
                          {Object.keys(instanceIds).map((key) => (
                            <MenuItem key={instanceIds[key]} value={key}>
                              {instanceIds[key]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sm={12}
                      sx={{ margin: "20px 0px 10px 0px" }}
                    >
                      {selectedInstances.length > 0 && (
                        <>
                          <Button
                            onClick={onConfirmSelections}
                            style={{ margin: "0px 20px 0px 0px" }}
                            label={"Confirm Selections"}
                            disabled={confirmed}
                          />
                          <Button
                            onClick={handleChangeInstances}
                            label={"Change Sources"}
                            disabled={!confirmed}
                          />
                        </>
                      )}
                    </Grid>
                  </>
                )}
              </>
            )}
            {selectedType && selectedInstances.length > 0 && confirmed && (
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
                  <Typography gutterBottom component="div">
                    Dataset Rows:
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
                        selectedColumns.includes(column.name),
                      )}
                      options={{
                        ...options,
                        tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
                      }}
                    />
                  </ThemeProvider>
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
                  <Typography gutterBottom component="div">
                    Select Sampling Type
                    <span style={{ color: "#d93025" }}>*</span> :
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={["Random", "Full", "Batch"].map((mode) => {
                      return {
                        name: mode,
                        value: mode[0].toLowerCase(),
                      };
                    })}
                    handleChange={onSelectSamplingMode}
                    defaultValue=""
                  />
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
                  <Typography gutterBottom component="div">
                    Filter String:
                  </Typography>
                </Grid>

                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <OutlinedTextField
                    fullWidth
                    value={filterString}
                    onChange={(e) => {
                      setFilterString(e.target.value);
                    }}
                  />
                </Grid>
              </>
            )}
            {samplingMode === "r" && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="projectsettingGrid"
                >
                  <Typography gutterBottom component="div" label="Required">
                    Sampling Percentage:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    value={random}
                    onChange={handleRandomChange}
                  />
                </Grid>
              </>
            )}
            {samplingMode === "b" && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="projectsettingGrid"
                >
                  <Typography gutterBottom component="div" label="Required">
                    Enter Batch size:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    type="number"
                    inputProps={{ type: "number" }}
                    value={batchSize}
                    onChange={(e) =>
                      isNum(e.target.value) &&
                      setBatchSize(Number(e.target.value) || e.target.value)
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="projectsettingGrid"
                >
                  <Typography gutterBottom component="div" label="Required">
                    Enter Batch Number:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    // type="number"
                    // inputProps={{ type: "number" }}
                    value={batchNumber}
                    onChange={(e) =>
                      // isNum(e.target.value) &&
                      setBatchNumber(e.target.value)
                    }
                  />
                </Grid>
              </>
            )}
            {samplingParameters && (
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
                  <Typography gutterBottom component="div" label="Required">
                    Annotators Per Task:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <OutlinedTextField
                    fullWidth
                    value={selectedAnnotatorsNum}
                    onChange={(e) => setSelectedAnnotatorsNum(e.target.value)}
                  />
                </Grid>
              </>
            )}
            {confirmed && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="projectsettingGrid"
                >
                  <Typography gutterBottom component="div" label="Required">
                    Project Stage:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <FormControl fullWidth className="formControl">
                    <Select
                      labelId="task-Reviews-label"
                      id="task-Reviews-select"
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
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="projectsettingGrid"
                >
                  <Typography gutterBottom component="div" label="Required">
                    Create Annotations Automatically:
                  </Typography>
                </Grid>
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                  <FormControl fullWidth className="formControl">
                    <Select
                      labelId="task-Reviews-label"
                      id="task-Reviews-select"
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
                </Grid>
                {selectedType === "ModelInteractionEvaluation" ||
                  selectedType === "MultipleInteractionEvaluation" ? (
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography gutterBottom component="div" label="Required">
                      Upload CSV or Paste JSON
                      <span style={{ color: "#d93025" }}>*</span> :
                    </Typography>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      style={{ marginBottom: "20px" }}
                    />

                    <Grid
                      container
                      item
                      xs={12}
                      style={{ marginTop: "20px", alignItems: "center" }}
                    >
                      <TextField
                        variant="outlined"
                        multiline
                        rows={4}
                        value={jsonInput}
                        onChange={handleJsonInputChange}
                        style={{ flex: 1, marginRight: "10px" }}
                      />
                      <IconButton
                        onClick={downloadCsv}
                        style={{ marginLeft: "10px" }}
                        aria-label="download CSV"
                      >
                        <ArrowCircleDownIcon />{" "}
                        {/* Replace this with your download icon component */}
                      </IconButton>
                    </Grid>
                  </Grid>
                ) : null}
                {workspaceDtails?.guest_workspace_display === "Yes" ? (
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
                      <Typography gutterBottom component="div">
                        Set a password:
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                      <OutlinedTextField
                        fullWidth
                        value={passwordForProjects}
                        type={shownewpassword ? "text" : "password"}
                        onChange={(e) => {
                          setPasswordForProjects(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglenewpasswordVisibility}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {shownewpassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ) : null}

                {workspaceDtails?.guest_workspace_display === "Yes" ? (
                  <Grid container direction="row" alignItems="center">
                    <Typography gutterBottom components="div">
                      Publish Project :
                    </Typography>
                    <Switch
                      checked={is_published}
                      onChange={handleChangeIsPublished}
                      inputProps={{ "aria-label": "controlled" }}
                      sx={{ mt: 2, ml: 2, mb: 2 }}
                    />
                  </Grid>
                ) : null
                }
                <Grid container direction="row" alignItems="center">
                  <Typography gutterBottom components="div">
                    Hide Details :
                  </Typography>
                  <Switch
                    checked={conceal}
                    onChange={handleChangeconceal}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ mt: 2, ml: 2, mb: 2 }}
                  />
                </Grid>

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
              <Typography gutterBottom component="div">
                Finalize Project
              </Typography>
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
                    (selectedType === "ModelInteractionEvaluation"
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
      {searchOpen && (
        <DatasetSearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
        />
      )}
    </ThemeProvider>
  );
};

export default CreateProject;

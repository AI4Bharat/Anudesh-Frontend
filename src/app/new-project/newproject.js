'use client'

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import MUIDataTable from "mui-datatables";
import {
  Box,
  Chip,
  Grid,
  ThemeProvider,
  Typography,
  Card,
  IconButton,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { MenuProps } from "@/utils/utils";
import { createProject } from "@/Lib/Features/actions/projects";
import { useNavigate } from "react-router-dom";
import ColumnList from "@/components/common/ColumnList";
import OutlinedTextField from "@/components/common/OutlinedTextField";
import Button from "@/components/common/Button";
import MenuItems from "@/components/common/MenuItems";
import  "@/styles/Dataset.css";
import themeDefault from "@/themes/theme";
import tableTheme from "@/themes/tableTheme";
import { fetchDomains } from "@/Lib/Features/actions/domains";
import { fetchDatasetByType } from "@/Lib/Features/datasets/getDatasetByType";
import { fetchDatasetSearchPopup } from "@/Lib/Features/datasets/DatasetSearchPopup";
import {fetchLanguages} from "@/Lib/Features/fetchLanguages";
import DatasetSearchPopup from "@/components/datasets/DatasetSearchPopup";

const isNum = (str) => {
  var reg = new RegExp("^[0-9]*$");
  return reg.test(String(str));
};

const projectStage = [
  { name: "Annotation Stage", value: 1 },
  { name: "Review Stage", value: 2 },
  { name: "Super-Check Stage", value: 3 }
];

const CreateAnnotationsAutomatically = [
  { name: "None", value: "none" },
  { name: "Annotation", value: "annotation" },
  { name: "Review", value: "review" },
  { name: "Supercheck", value: "supercheck" }
];


const CreateProject = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  
  //remove this line:
  const workspaceId = 1;
  //and uncomment this after implementing dynamic routes:
  //const { workspaceId } = useParams();

  const ProjectDomains = useSelector(state => state.domains?.domains);
  const ProjectDomains1 = useSelector(state => console.log(state));
  const DatasetInstances = useSelector((state) => state.getDatasetByType.data);
  // const DatasetFields = useSelector((state) => state.getDatasetFields.data);
  const LanguageChoices = useSelector((state) => state.getLanguages.data?.language);
  const DataItems = useSelector((state) => state.GetDataitemsById.data);
  const NewProject = useSelector(state => state.projects.newProject);
  const UserData = useSelector(state => state.getLoggedInData.data);
  const navigate = useNavigate();

  const [domains, setDomains] = useState([]);
  const [projectTypes, setProjectTypes] = useState(null);
  const [datasetTypes, setDatasetTypes] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);
  const [columnFields, setColumnFields] = useState(null);
  const [variableParameters, setVariableParameters] = useState(null);
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
  const [selectedVariableParameters, setSelectedVariableParameters] = useState(
    []
  );
  const [taskReviews, setTaskReviews] = useState(1);
  const [variable_Parameters_lang, setVariable_Parameters_lang] = useState("");
  //Table related state variables
  const [columns, setColumns] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [selectedFilters, setsSelectedFilters] = useState({});
  const [createannotationsAutomatically, setsCreateannotationsAutomatically] = useState("none");
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
    "parent_data",
    "id",
    "rating",
  ];

  //Fetch and display Project Domains
  useEffect(() => {
    // if(ProjectDomains.status !== "succeeded")
      dispatch(fetchDomains());
  }, []);
  const onSelectDomain = (value) => {
    setSelectedDomain(value);
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
              customHeadLabelRender: customColumnHead,
              customBodyRender: (value) => {
                if ((keys == "metadata_json" || keys == "prediction_json" || keys == "ocr_prediction_json" || keys == "transcribed_json" || keys == "draft_data_json" || keys == "ocr_transcribed_json") && value !== null) {
                  const data = JSON.stringify(value)
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
      let tempVariableParameters = {};
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
          let temp =
            ProjectDomains[domain]["project_types"][project_type][
            "output_dataset"
            ]["fields"]["variable_parameters"];
          if (temp) {
            tempVariableParameters[project_type] = {
              variable_parameters: temp,
              output_dataset:
                ProjectDomains[domain]["project_types"][project_type][
                "output_dataset"
                ]["class"],
            };
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
        })
      );
      setVariableParameters(tempVariableParameters);
      setProjectTypes(tempTypes);
      setDatasetTypes(tempDatasetTypes);
      setColumnFields(tempColumnFields);
    }
  }, [ProjectDomains]);

  const handleRandomChange = (e) => {
    setRandom(e.target.value);
    setSamplingParameters(
      e.target.value ? { fraction: parseFloat(e.target.value / 100) } : null
    );
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

  const handleCreateProject = () => {
    const data = {
      title: title,
      description: description,
      project_type: selectedType,
      src_language: sourceLanguage,
      tgt_language: targetLanguage,
      dataset_id: selectedInstances,
      sampling_mode: samplingMode,
      sampling_parameters_json: samplingParameters,
      variable_parameters: selectedVariableParameters,
      filter_string: filterString,
      project_stage: taskReviews,
      required_annotators_per_task: selectedAnnotatorsNum,
      automatic_annotation_creation_mode: createannotationsAutomatically,
    };
    dispatch(createProject(data));
  };

  useEffect(() => {
    if (NewProject.id) {
      navigate(`/projects/${NewProject.id}`, { replace: true });
      window.location.reload();
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
    const dataObj = (
      selectedInstances,
      datasetTypes[selectedType],
      selectedFilters,
      currentPageNumber,
      currentRowPerPage
    );
    dispatch(fetchDatasetByType(dataObj));
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
    setsCreateannotationsAutomatically(e.target.value)
  }

  useEffect(() => {
    if (selectedInstances && datasetTypes) {
      getDataItems();
    }
  }, [currentPageNumber, currentRowPerPage]);
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
  };

  return (
    <ThemeProvider theme={themeDefault}>

      <Grid container direction="row">
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
                  Title:
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
                Description:
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
                    Select a Category to Work in:
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
                    Select a Project Type:
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

            {selectedType &&
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
                        Select sources to fetch data from:
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
                                            (instance) => instance !== key
                                          )
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
                      title={""}
                      data={tableData}
                      columns={columns.filter((column) =>
                        selectedColumns.includes(column.name)

                      )}
                      options={options}
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
                    Select Sampling Type:
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
                      {projectStage.map((type, index) => (
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
                    selectedVariableParameters
                    ? false
                    : true
                }
              />
              <Button
                label={"Cancel"}
                onClick={() => navigate(`/workspaces/${workspaceId}`)}
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

'use client'
import {
    Box,
    Chip,
    Grid,
    ThemeProvider,
    Typography,
    Card,
    IconButton,
    InputLabel,
  } from "@mui/material";
  import tableTheme from "../../themes/TableTheme";
  import CancelIcon from "@mui/icons-material/Cancel";
  import React, { useEffect, useState } from "react";
  import themeDefault from "../../themes/theme";
  import Button from "../components/common/Button";
  import ColumnList from "../components/common/ColumnList";
  import OutlinedTextField from "../components/common/OutlinedTextField";
  import DatasetStyle from "../../styles/Dataset";
  import MenuItem from "@mui/material/MenuItem";
  import FormControl from "@mui/material/FormControl";
  import Select from "@mui/material/Select";
  import MUIDataTable from "mui-datatables";
  import MenuItems from "../components/common/MenuItems";
  import CustomizedSnackbars from "../components/common/Snackbar";
  import Spinner from "../components/common/Spinner";
  import FormControlLabel from "@mui/material/FormControlLabel";
  import Switch from "@mui/material/Switch";
  import SearchIcon from "@mui/icons-material/Search";
  // import DatasetSearchPopup from "../../container/Dataset/DatasetSearchPopup";
  // import DatasetSearchPopupAPI from "../../../../redux/actions/api/Dataset/DatasetSearchPopup";
  // import { MenuProps } from "../../../../utils/utils";
  
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
  
  const AnnotationProject = (props) => {

    const classes = DatasetStyle();

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
    const [acousticEnabledStage, setAcousticEnabledStage] = useState(null);
  
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
      // "conversation_json",
      "machine_translated_conversation_json",
      "speakers_json",
      // "transcribed_json",
      "conversation_json",
      // "prediction_json",
      "machine_transcribed_json",
      "unverified_conversation_json",
      "annotation_bboxes",
      "annotation_labels",
      "annotation_transcripts",
    ];
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
            className={classes.filterToolbarContainer}
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
          <Card className={classes.workspaceCard}>
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
                  className={classes.projectsettingGrid}
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
                className={classes.projectsettingGrid}
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
                    className={classes.projectsettingGrid}
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

                    />
                  </Grid>
                </>
              )}
  
              {selectedDomain && (
                <>
                  <Grid
                    className={classes.projectsettingGrid}
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
                      className={classes.projectsettingGrid}
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
              {(selectedDomain === "Translation" ||
                selectedDomain === "Conversation") &&
                (selectedType === "TranslationEditing" ||
                  selectedType === "SemanticTextualSimilarity" ||
                  selectedType === "ContextualTranslationEditing" ||
                  selectedType === "ConversationTranslation" ||
                  selectedType === "ConversationTranslationEditing") && (
                  <>
                    <Grid
                      className={classes.projectsettingGrid}
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
                      className={classes.projectsettingGrid}
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
  
              {(selectedDomain === "Monolingual" ||
                selectedDomain === "Translation" ||
                selectedDomain === "Audio") &&
                (selectedType === "SentenceSplitting" ||
                  selectedType === "ContextualSentenceVerification" ||
                  selectedType === "MonolingualTranslation" ||
                  selectedType === "SingleSpeakerAudioTranscriptionEditing" ||
                  selectedType === "AudioTranscription" ||
                  selectedType === "AudioSegmentation" ||
                  selectedType === "AudioTranscriptionEditing" ||
                  selectedType === "AcousticNormalisedTranscriptionEditing") && (
                  <>
                    <Grid
                      className={classes.projectsettingGrid}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <Typography gutterBottom component="div">
                        {selectedType === "SingleSpeakerAudioTranscriptionEditing"
                          ? "Language:"
                          : "Target Language:"}
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
                  {selectedVariableParameters.map((parameter, index) => (
                    <>
                      {selectedType === "Conversation" &&
                        (selectedType === "ContextualTranslationEditing" ||
                          selectedType === "ConversationTranslation") && (
                          <Grid
                            className={classes.projectsettingGrid}
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                          >
                            <Typography gutterBottom component="div">
                              {processNameString(parameter["name"])}:
                            </Typography>
                          </Grid>
                        )}
                      <Grid
                        className={classes.projectsettingGrid}
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                      >
                        {parameter?.data["choices"] !== undefined ? (
                          <>
                            {selectedType === "Conversation" &&
                              (selectedType === "ContextualTranslationEditing" ||
                                selectedType === "ConversationTranslation") && (
                                <MenuItems
                                  menuOptions={parameter?.data["choices"].map(
                                    (element) => {
                                      return {
                                        name: element[0],
                                        value: element[0],
                                      };
                                    }
                                  )}
                                  value={
                                    selectedVariableParameters[index]["value"]
                                  }
                                  handleChange={(e) =>
                                    handleVariableParametersChange(
                                      parameter["name"],
                                      e
                                    )
                                  }
                                ></MenuItems>
                              )}
                          </>
                        ) : (
                          <>
                            {parameter.data["name"] === "DecimalField" ||
                              parameter.data["name"] === "IntegerField" ? (
                              <OutlinedTextField
                                fullWidth
                                defaultValue={
                                  selectedVariableParameters[index]["value"]
                                }
                                handleChange={(e) =>
                                  handleVariableParametersChange(
                                    parameter["name"],
                                    e
                                  )
                                }
                                inputProps={{
                                  step: 1,
                                  min: 0,
                                  max: 99999,
                                  type: "number",
                                }}
                              />
                            ) : (
                              <OutlinedTextField
                                fullWidth
                                value={selectedVariableParameters[index]["value"]}
                                onChange={(e) =>
                                  handleVariableParametersChange(
                                    parameter["name"],
                                    e
                                  )
                                }
                              />
                            )}
                          </>
                        )}
                      </Grid>
                    </>
                  ))}
                  {selectedType && Object.keys(instanceIds).length > 0 && (
                    <>
                      <Grid
                        className={classes.projectsettingGrid}
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
                    className={classes.projectsettingGrid}
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
                    className={classes.projectsettingGrid}
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
                    className={classes.projectsettingGrid}
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
                    className={classes.projectsettingGrid}
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
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={classes.projectsettingGrid}
                  >
                    <Typography gutterBottom component="div" label="Required">
                      Sampling Percentage:
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                    <OutlinedTextField
                      fullWidth
                      value={random}
                    />
                  </Grid>
                </>
              )}
              {samplingMode === "b" && (
                <>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={classes.projectsettingGrid}
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
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={classes.projectsettingGrid}
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
                    className={classes.projectsettingGrid}
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
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={classes.projectsettingGrid}
                  >
                    <Typography gutterBottom component="div" label="Required">
                      Project Stage:
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                    <FormControl fullWidth className={classes.formControl}>
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
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={classes.projectsettingGrid}
                  >
                    <Typography gutterBottom component="div" label="Required">
                      Create Annotations Automatically:
                    </Typography>
                  </Grid>
                  <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                    <FormControl fullWidth className={classes.formControl}>
                      <Select
                        labelId="task-Reviews-label"
                        id="task-Reviews-select"
                        value={createannotationsAutomatically}
                      >
                        {CreateAnnotationsAutomatically.map((type, index) => (
                          <MenuItem value={type.value} key={index}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {selectedType === "AcousticNormalisedTranscriptionEditing" && <>
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className={classes.projectsettingGrid}
                    >
                      <Typography gutterBottom component="div" label="Required">
                        Acoustic Enabled Stage:
                      </Typography>
                    </Grid>
                    <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                      <FormControl fullWidth className={classes.formControl}>
                        <Select
                          labelId="acoustic-label"
                          id="acoustic-select"
                          value={acousticEnabledStage}
                          onChange={(e) => setAcousticEnabledStage(e.target.value)}
                        >
                          {projectStage.map((type, index) => (
                            <MenuItem value={type.value} key={index}>
                              {type.name.split(/(?<=^\S+)\s/)[0]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>}
                </>
              )}
  
              <Grid
                className={classes.projectsettingGrid}
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
                className={classes.projectsettingGrid}
                style={{}}
                item
                xs={12}
                md={12}
                lg={12}
                xl={12}
                sm={12}
              >
                {/* {title !== "" && selectedType !== "" && ( */}
                <Button
                  style={{ margin: "0px 20px 0px 0px" }}
                  label={"Create Project"}
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
                {/* )}  */}
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
  
  export default AnnotationProject;
  
import React, { useState, useEffect } from 'react';
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Spinner from "@/components/common/Spinner";
import Snackbar from "@/components/common/Snackbar";
import DatasetStyle from "@/styles/dataset";
import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MenuItems from "@/components/common/MenuItems";
import { MenuProps } from "@/utils/utils";
import themeDefault from "@/themes/theme";
import { fetchDatasetByType } from '@/Lib/Features/datasets/getDatasetByType';
import { fetchDataitemsById } from '@/Lib/Features/datasets/GetDataitemsById';
import aiModel from '@/app/actions/api/dataset/aiModel';


const PopulateAiModel = () => {
        /* eslint-disable react-hooks/exhaustive-deps */

  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);

  const [srcDatasetTypes, setSrcDatasetTypes] = useState([]);
  const [srcDatasetType, setSrcDatasetType] = useState('');
  const [translationModel, setTranslationModel] = useState('');
  const [srcInstances, setSrcInstances] = useState([]);
  const [field, setfield] = useState([]);
  const [Field,setField] = useState([]);
  const [srcInstance, setSrcInstance] = useState('');
  // const [instance, setinstance] = useState("");
  // const [org_id, setorg_id] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: '' });

  // const Fields = ["draft_data_json", "input_language", "output_language", "input_text", "output_text", "machine_translation", "context", "labse_score", "rating", "domain", "parent_data", "instance_id"];

  const loggedInUserData = useSelector((state) => state.getLoggedInData.data);
  const DatasetInstances = useSelector((state) => state.getDatasetByType?.data);
  const DatasetTypes = useSelector((state) => state.GetDatasetType?.data);
  const dataitemsList = useSelector((state) => state.GetDataitemsById?.data);

 
  const handleChangeAutomatemissingitems = (event) => {
    setChecked(event.target.checked);
  };
  const handleTransModelChange = (value) => {
    setTranslationModel(value);
//     setLanguages([]);
//     if (value === 1) {
//       if (!LanguageChoicesIndicTrans?.supported_languages)
//         setSnackbarState({ open: true, message: "Error fetching language list", variant: "error" })
//       else setLanguageChoices(LanguageChoicesIndicTrans?.supported_languages.map(lang => {
//         return {
//           name: lang,
//           value: lang
//         }
//       }));
//     } else {
//       if (!LanguageChoicesAll)
//         setSnackbarState({ open: true, message: "Error fetching language list", variant: "error" })
//       else setLanguageChoices(LanguageChoicesAll.map(lang => {
//         return {
//           name: lang[0],
//           value: lang[0]
//         }
//       }));
//     }
  };

  useEffect(() => {
    if (DatasetTypes && DatasetTypes.length > 0) {
      let temp = [];
      DatasetTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element,
          disabled: (element !== "Instruction" && element !=="Interaction" )
        });
      });
      setSrcDatasetTypes(temp);
      temp = [];
      DatasetTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element,
          disabled: (srcDatasetType === "SentenceText" ? element !== "TranslationPair" : (element !== "Instruction" && element !=="Interaction" ))
        });
      });
    }
  }, [DatasetTypes, srcDatasetType]);

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setfield(
//       typeof value === 'string' ? value.split(',') : value,
//     );
//   };
  useEffect(() => {
    setLoading(false);
    if (dataitemsList?.results?.length > 0) {
        let values = Object.keys(dataitemsList.results[0]) 
        setField(values)
    }
  }, [dataitemsList]);



  useEffect(() => {
    setLoading(false);
    if (DatasetInstances?.length > 0) {
      if (DatasetInstances[0].dataset_type === srcDatasetType)
        setSrcInstances(DatasetInstances)
    }
  }, [DatasetInstances]);

  

  const handleSrcDatasetTypeChange = (value) => {
    setSrcDatasetType(value);
    setLoading(true);
    dispatch(fetchDatasetByType(value));
  };

  const handleField =(value)=>{
    setSrcInstance(value);
    setLoading(true);
    dispatch(fetchDataitemsById({instanceIds:value,datasetType:srcDatasetType}));
  }
  // console.log(srcDatasetType,srcInstances,DatasetInstances,loading);


  const handleConfirm = async () => {
    setLoading(true);
    const org_id = await (DatasetInstances.filter((items) => {
      return items.instance_id === srcInstance
    })[0].organisation_id);

    let apiObj;
    
    srcDatasetType === "Interaction" && ( apiObj = new aiModel(srcInstance, translationModel, org_id, checked,srcDatasetType))
    srcDatasetType === "Instruction" && (apiObj = new aiModel(srcInstance, translationModel, org_id, checked,srcDatasetType))
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      setLoading(false);
      if (!res.ok) throw await res.json();
      else return await res.json();
    }).then((res) => {
      setSnackbarState({ open: true, message: res.message, variant: "success" });
    }).catch((err) => {
      setSnackbarState({ open: true, message: err.message, variant: "error" });
    });
    setSrcDatasetType('');
    setSrcInstance('');
    setTranslationModel('');
  }


  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid container direction="row"  paddingTop={3}>
        {/* <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            > */}
              <Typography variant="h6" gutterBottom component="div">
              Populate Predictions from AI Model
              </Typography>
            {/* </Grid> */}
            <Grid className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}>
            </Grid>
            <Typography gutterBottom component="div">
              Select dataset type:
            </Typography>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <MenuItems
                menuOptions={srcDatasetTypes}
                handleChange={handleSrcDatasetTypeChange}
                value={srcDatasetType}
              />
            </Grid>
            {srcDatasetType && srcInstances.length > 0 && <>
              <Grid
                className={classes.projectsettingGrid}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <Typography gutterBottom component="div">
                  Source dataset instance:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth >
                  <Select
                    labelId="project-type-label"
                    id="project-type-select"
                    value={srcInstance}
                    onChange={(e)=>handleField(e.target.value)}
                    MenuProps={MenuProps}
                  >
                    {srcInstances.map((type, index) => (
                      <MenuItem value={type.instance_id} key={index}>
                        {type.instance_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>}
            {srcInstance != '' && <>
              <Grid
                className={classes.projectsettingGrid}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <Typography gutterBottom component="div">
                  Choice of translation model:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <MenuItems
                  menuOptions={[srcDatasetType === "Interaction" && {
                    name: "Google vision",
                    value: "google"
                  }, srcDatasetType === "Instruction" && {
                    name: "Google vision",
                    value: "google"
                  }
                 
                ]}
                  handleChange={handleTransModelChange}
                  value={translationModel}
                />
              </Grid>
            </>}
            {/* <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Select Field:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={field}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(',')}
                  MenuProps={MenuProps}
                >
                  {Field.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={field.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid> */}
            <Grid container direction="row" width={850}>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
            >
              <Typography gutterBottom component="div">
              Automate missing items only:
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} lg={5} xl={5} sm={12} >
            <Switch
              checked={checked}
              onChange={handleChangeAutomatemissingitems}
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{mt:2}}
             />
            </Grid>
            </Grid>
            <Grid
              style={{}}
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 3 }}
            >
              <Button
                style={{ margin: "0px 20px 0px 0px" }}
                label={"Confirm"}
                onClick={handleConfirm}
              disabled={(srcInstance=="" || translationModel =="" || srcDatasetType=="") ? true : false}
              />
              <Button
                label={"Cancel"}
              onClick={() => navigate(`/datasets/`)}
              />
            </Grid>
          </Grid>
          
        {/* </Card>
      </Grid> */}
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        hide={2000}
      />

    </ThemeProvider>

  );
};

export default PopulateAiModel;
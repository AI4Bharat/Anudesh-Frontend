import {
  Box,
  Card,
  Grid,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  MenuItem,
  FormControl,
  Select
} from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "@/themes/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/common/Button";
import OutlinedTextField from "@/components/common/OutlinedTextField";
import Spinner from "@/components/common/Spinner";
import CustomizedSnackbars  from "@/components/common/Snackbar";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import MenuItems from "@/components/common/MenuItems"
import { fetchDatasetType } from "@/Lib/Features/datasets/GetDatasetType";
import CreateNewDatasetInstanceAPI from "@/app/actions/api/dataset/CreateNewDatasetInstance";

const CollectionProject = (props) => {
        /* eslint-disable react-hooks/exhaustive-deps */

  const { id } = useParams();
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [instance_Name, setInstance_Name] = useState("")
  const [parent_Instance_Id, setParent_Instance_Id] = useState(null)
  const [instance_Description, setInstance_Description] = useState("")
  const [organisation_Id, setOrganisation_Id] = useState("")
  const [users, setUsers] = useState("")
  const [datasettype, setDatasettype] = useState("");
  const [type, setType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: "", variant: ""});
  const [errors, setErrors] = useState({});


  const loggedInUserData = useSelector(
    (state) => state.getLoggedInData.data
  );

  useEffect(() => {
    setUsers([loggedInUserData.id])
  },[])
 
  const handleCreate = () => {
    setLoading(true);
    setErrors({});
    const CreateDatasetInstance = {
      instance_name: instance_Name,
      parent_instance_id: parent_Instance_Id,
      instance_description: instance_Description,
      dataset_type: datasettype,
      organisation_id: organisation_Id,
      users: users,
    }
    const apiObj = new CreateNewDatasetInstanceAPI(CreateDatasetInstance);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      if (!res.ok) throw await res.json();
      else return await res.json();
    }).then((res) => {
      setLoading(false);
      navigate(`/datasets/${res.instance_id}`);
    }).catch((err) => {
      setErrors(err);
      setSnackbarState({ open: true, message: "Failed to create dataset instance", variant: "error" });
      setLoading(false);
    });
  }

  const datasetType = useSelector(state => state.GetDatasetType.data);

  const getProjectDetails = () => {
    dispatch(fetchDatasetType(id));
  }

  useEffect(() => {
    getProjectDetails();

  }, []);

  useEffect(() => {
    if (datasetType && datasetType.length > 0) {
      let temp = [];
      datasetType.forEach((element) => {
        temp.push({
        
          name: element,
          value: element,

        });
      });
      setType(temp);
    }
  }, [datasetType]);

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
          open={snackbarState.open}
          handleClose={() => setSnackbarState({ open: false, message: "", variant: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          variant={snackbarState.variant}
          message={snackbarState.message}
      />
    );
};

  return (
    <ThemeProvider theme={themeDefault}>
      {/* <Header /> */}
      {/* <Grid
                  container
                  direction='row'
                  justifyContent='left'
                  alignItems='left'
  
  
              >
                  <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                  > */}

      <Grid container direction="row"  >
        {loading && <Spinner /> }
        <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom components="div">
              Create New Dataset Instance
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
              <Typography gutterBottom components="div">
                Instance_Name *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={instance_Name}
                onChange={(e) => setInstance_Name(e.target.value)}
                required
                helperText={errors.instance_name ? errors.instance_name : ""}
                error={errors.instance_name ? true : false}
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
              <Typography gutterBottom components="div">
                Parent_Instance_Id:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={parent_Instance_Id}
                onChange={(e) => setParent_Instance_Id(e.target.value)}
                helperText={errors.parent_instance_id ? errors.parent_instance_id : ""}
                error={errors.parent_instance_id ? true : false}
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
              <Typography gutterBottom components="div">
                Instance_Description:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={instance_Description}
                onChange={(e) => setInstance_Description(e.target.value)}
                helperText={errors.instance_description ? errors.instance_description : ""}
                error={errors.instance_description ? true : false}
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
              <Typography gutterBottom components="div">
                Dataset_Type *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
            <FormControl fullWidth sx={{ minWidth: 120 }} >
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  onChange={(e) => setDatasettype(e.target.value)}
                  value={datasettype}
                  helperText={errors.dataset_type ? errors.dataset_type : ""}
                  error={errors.dataset_type ? true : false}  
                  sx={{ fontSize: "14px" }}
                >
                  {type.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.name}
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
              <Typography gutterBottom components="div">
                Organisation_Id *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={organisation_Id}
                onChange={(e) => setOrganisation_Id(e.target.value)}
                helperText={errors.organisation_id ? errors.organisation_id : ""}
                error={errors.organisation_id ? true : false}
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
              <Typography gutterBottom components="div">
                User *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                helperText={errors.users ? errors.users : ""}
                error={errors.users ? true : false}
              />
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
              sx={{ mt: 3 }}
            >

              <Button
                style={{ margin: "0px 20px 0px 0px" }}
                label={"Confirm"}
                onClick={handleCreate}
                disabled={ ( instance_Name && datasettype && organisation_Id  ) ? false : true}

              />

              <Button
                label={"Cancel"}
                onClick={() => navigate(`/datasets/`)}
              />
            </Grid>
            {renderSnackBar()}
          </Grid>
        </Card>
      </Grid>

      {/* </Grid>
              </Grid> */}
    </ThemeProvider>
  );
};

export default CollectionProject;

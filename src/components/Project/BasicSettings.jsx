
import { ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import themeDefault from '@/themes/theme'
import { useNavigate, useParams } from 'react-router-dom';
import OutlinedTextField from "../common/OutlinedTextField";
import DatasetStyle from "@/styles/dataset";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../common/Button";
import CustomizedSnackbars from "../common/Snackbar";
import Spinner from "../common/Spinner";
import {fetchLanguages} from "@/Lib/Features/fetchLanguages";
import GetSaveButtonAPI from "@/app/actions/api/Projects/getSaveButtonAPI";
import getWorkspaceDetails, { fetchWorkspaceDetails } from "@/Lib/Features/getWorkspaceDetails";
import { FetchLoggedInUserData } from "@/Lib/Features/getLoggedInData";


const BasicSettings = (props) => {
         /* eslint-disable react-hooks/exhaustive-deps */

    const {ProjectDetails } = props;

    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [showLanguage, setShowLanguage] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [languageOptions, setLanguageOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const loggedInUserData = useSelector(state => state.getLoggedInData?.data); //retrieved the id of the current signedin user
    const workspaceManagers = useSelector(state=>(state.getWorkspaceDetails.data.managers));

    const isManager = workspaceManagers?.some(manager => manager.id === loggedInUserData.id);

    const getWorkspaceDetails = ()=>{
        dispatch(fetchWorkspaceDetails(ProjectDetails?.workspace_id));
      }
     
      
      useEffect(()=>{
        getWorkspaceDetails();
      },[]);
    console.log(loggedInUserData.id);
    const getLoggedInUserData = () => {
        dispatch(FetchLoggedInUserData("me"));
      };

      useEffect(() => {
        getLoggedInUserData();
      }, []);
    

    useEffect(() => {
        // if (ProjectDetails.project_type === "MonolingualTranslation" ||ProjectDetails.project_type === "SemanticTextualSimilarity" || ProjectDetails.project_type === "TranslationEditing" || ProjectDetails.project_type === "ContextualTranslationEditing"|| ProjectDetails.project_type==="SingleSpeakerAudioTranscriptionEditing") {
            getLanguageChoices();
            setShowLanguage(true);
        // }

    }, [ProjectDetails]);



    useEffect(() => {
        setNewDetails({
            title: ProjectDetails.title,
            description: ProjectDetails.description,
            max_pending_tasks_per_user: ProjectDetails.max_pending_tasks_per_user,
            tasks_pull_count_per_batch: ProjectDetails.tasks_pull_count_per_batch,
            max_tasks_per_user: ProjectDetails.max_tasks_per_user,
        });
        setTargetLanguage(ProjectDetails?.tgt_language)
        setSourceLanguage(ProjectDetails?.src_language)
    }, [ProjectDetails]);
    const LanguageChoices = useSelector((state) => state.getLanguages.data.language);
   
    const getLanguageChoices = () => {
        dispatch(fetchLanguages());
    };

    useEffect(() => {
        if (LanguageChoices && LanguageChoices.length > 0) {
            let temp = [];
            LanguageChoices.forEach((element) => {
                temp.push(element
                    //     {
                    //     name: element[0],
                    //     value: element[0],
                    // }
                );
            });
            setLanguageOptions(temp);
        }
    }, [LanguageChoices]);



    const handleSave = async () => {

        const sendData = {
            title: newDetails.title,
            description: newDetails.description,
            tgt_language: targetLanguage,
            src_language: sourceLanguage,
            project_type: ProjectDetails.project_type,
            // project_mode: ProjectDetails.project_mode,
            users: ProjectDetails.users,
            annotation_reviewers: ProjectDetails.annotation_reviewers,
            max_pending_tasks_per_user: newDetails.max_pending_tasks_per_user,
            tasks_pull_count_per_batch: newDetails.tasks_pull_count_per_batch,
            max_tasks_per_user: newDetails.max_tasks_per_user,
        }
        console.log(sendData);
        const projectObj = new GetSaveButtonAPI(id, sendData);
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "PUT",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: "success",
                variant: "success",
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }

    }

    function snakeToTitleCase(str) {
        return str.split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }
    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])

    const handleProjectName = (event) => {

        event.preventDefault();
        setNewDetails((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    // const handleCancel = ()=>{
    //     // setSourceLanguage(ProjectDetails?.tgt_language)
    //     // setTargetLanguage(ProjectDetails?.src_language)
    // }

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };
    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            {loading && <Spinner />}
            <Grid>
                {renderSnackBar()}

            </Grid>

            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        // justifyContent: "space-between",
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Project Name
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={9}
                        xl={9}
                        sm={12}
                    >
                        <OutlinedTextField
                            fullWidth
                            name="title"
                            InputProps={{ style: { fontSize: "14px", width: { xs: "100%", sm: "500px" } } }}
                            value={newDetails?.title}
                            onChange={handleProjectName} />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        // justifyContent: "space-between",
                        mt: 2
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >

                        <Typography variant="body2" fontWeight='700'>
                            Project Description
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={9}
                        xl={9}
                        sm={12}

                    >
                        <OutlinedTextField
                            fullWidth
                            name="description"
                            InputProps={{ style: { fontSize: "14px", width: { xs: "100%", sm: "500px" } } }}
                            value={newDetails?.description}
                            onChange={handleProjectName}
                        />
                    </Grid>
                </Grid>
            
                    <>
                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                // justifyContent: "space-between",
                                mt: 2
                            }}
                        >
                            {ProjectDetails.project_type !== "ContextualSentenceVerification"||ProjectDetails.project_type==="SingleSpeakerAudioTranscriptionEditing" &&
                            <>
                                <Grid
                                    items
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={2}
                                    xl={2}
                                >
                                    <Typography variant="body2" fontWeight='700' label="Required">
                                        Source Language
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    lg={9}
                                    xl={9}
                                    sm={12}
                                >
                                    <Autocomplete
                                        onChange={(e, newVal) => setSourceLanguage(newVal)}
                                        options={languageOptions}
                                        value={sourceLanguage}
                                        style={{ fontSize: "14px", width: { xs: "100%", sm: "500px" } }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                inputProps={{ ...params.inputProps, style: { fontSize: "14px" } }}
                                                placeholder="Enter source language"
                                            />
                                        )}
                                    />
                                </Grid>
                            </>
                        }
                        </Grid>
                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                // justifyContent: "space-between",
                                mt: 2
                            }}
                        >
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={2}
                                xl={2}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                {ProjectDetails.project_type==="SingleSpeakerAudioTranscriptionEditing"?  "Language" :"Target Language"}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={9}
                                xl={9}
                                sm={12}
                            >
                                <Autocomplete
                                    onChange={(e, newVal) => setTargetLanguage(newVal)}
                                    options={languageOptions}
                                    value={targetLanguage}
                                    style={{ fontSize: "14px", width: { xs: "100%", sm: "500px" } }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{ ...params.inputProps, style: { fontSize: "14px" } }}
                                            placeholder={ProjectDetails.project_type==="SingleSpeakerAudioTranscriptionEditing" ?"Enter language":"Enter target language"}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>
                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                mt: 2
                            }}
                        >
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={2}
                                xl={2}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                    Max Pending Tasks Per User
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={9}
                                xl={9}
                                sm={12}
                            >
                                <OutlinedTextField
                                    fullWidth
                                    name="max_pending_tasks_per_user"
                                    InputProps={{ step: 1, min: 0, max: 99999, type: 'number', style: { fontSize: "14px", width: { xs: "100%", sm: "500px" } } }}
                                    value={newDetails?.max_pending_tasks_per_user}
                                    onChange={handleProjectName} />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                mt: 2
                            }}
                        >
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={2}
                                xl={2}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                    Tasks Pull Count Per Batch
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={9}
                                xl={9}
                                sm={12}
                            >
                                <OutlinedTextField
                                    fullWidth
                                    name="tasks_pull_count_per_batch"
                                    InputProps={{ step: 1, min: 0, max: 99999, type: 'number', style: { fontSize: "14px", width: { xs: "100%", sm: "500px" } } }}
                                    value={newDetails?.tasks_pull_count_per_batch}
                                    onChange={handleProjectName} />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                mt: 2
                            }}
                        >
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={2}
                                xl={2}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                Max Tasks Per User
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={9}
                                xl={9}
                                sm={12}
                            >
                                <OutlinedTextField
                                    fullWidth
                                    name="max_tasks_per_user"
                                    InputProps={{ step: 1, min: 0, max: 99999, type: 'number', style: { fontSize: "14px", width: { xs: "100%", sm: "500px" }, readOnly: !isManager } }}
                                    
                                    value={newDetails?.max_tasks_per_user}
                                    onChange={handleProjectName} />
                            </Grid>
                        </Grid>
                    </>
                <Grid
                    container
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sm={12}
                    sx={{
                        // justifyContent: "center",
                        mt:5,
                        display: 'flex',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        gap: 2

                    }}
                >
                    <CustomButton sx={{ inlineSize: "max-content", width: { xs: "100%", sm: "200px" } }}
                        onClick={() => navigate(-1)}
                        // onClick={handleCancel}
                        label="Cancel" />
                    <CustomButton sx={{ inlineSize: "max-content", width: { xs: "100%", sm: "200px" } }}
                        onClick={handleSave}
                        label="Save" />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicSettings;
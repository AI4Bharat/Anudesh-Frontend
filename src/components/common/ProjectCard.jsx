import * as React from "react";
import Typography from "@mui/material/Typography";
import  Grid from "@mui/material/Grid";
import themeDefault from "../../themes/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import  "../../styles/Dataset.css";
import UserMappedByProjectStage from "../../utils/UserMappedByProjectStage";
import { useSelector } from "react-redux";


const ProjectCard = (props) => {
  
  const loggedInUserData = useSelector(state => state.getLoggedInData?.data);

  let navigate = useNavigate();
  let { id } = useParams();
  const { projectObj ,projectData,handleAuthOpen} = props;

  const handleCardClick = (el) => {
    console.log(projectObj);
    const isExcluded = projectData && projectData.excluded_projects && projectData.excluded_projects?.some(
      (excludedProject) => excludedProject.id === el.id
    )
    console.log(loggedInUserData?.guest_user,isExcluded,projectObj);

    if (loggedInUserData?.guest_user==true && isExcluded==true) {
      handleAuthOpen(el, el.title);
    } else {
      navigate(`/projects/${el.id}`);
    }
  };


  const userRole =projectObj.project_stage && UserMappedByProjectStage(projectObj.project_stage).name;
  return (
    <>
    <div onClick={() => handleCardClick(projectObj)}>

      <Grid
        elevation={2}
        className={props.classAssigned}
        sx={{
          minHeight: 250,
          cursor: "pointer",
          borderRadius: 5,
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            background: "#FFD981",
            p: 1,
            borderRadius: 5,
            width: "fit-content",
          }}
        >
          {projectObj.project_mode}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            textAlign: "center",
            color: "secondary.contrastText",
            backgroundColor: "primary.contrastText",
            borderRadius: 3,
            pt: 1,
            pb: 1,
            minHeight: 64,
            alignItems: "center",
            display: "grid",
          }}
        >
          {projectObj.title}
        </Typography>
        <Grid
          container
          direction="row"
          sx={{ mt: 1, mb: 2 }}
          spacing={3}
          columnSpacing={{ xs: 6, sm: 6, md: 6 }}
        >
          <Grid item sx={{ width: "230px" }}>
            <Typography variant="lightText">Type</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.project_type}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="lightText">Project ID</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.id}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="lightText"> Project Stage</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {userRole ? userRole :projectObj.project_stage}
            </Typography>
          </Grid>
          <Grid item  sx={{pl:0}}>
            <Typography variant="lightText">Target Language</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.tgt_language === null ?"-":projectObj.tgt_language}
            </Typography>
          </Grid>
          <Grid item >
            <Typography variant="lightText">Workspace Id</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.workspace_id}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    {/* </Link> */}
    </div>
    </>
  );
};

export default ProjectCard;

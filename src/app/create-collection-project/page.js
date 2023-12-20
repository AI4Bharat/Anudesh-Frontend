'use client'
import {
    Box,
    Card,
    Grid,
    Tab,
    Tabs,
    ThemeProvider,
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import themeDefault from "../../themes/theme";
  import Button from "../components/common/Button";
  import OutlinedTextField from "../components/common/OutlinedTextField";
  import DatasetStyle from "../../styles/Dataset";
  import MenuItems from "../components/common/MenuItems";

  const CollectionProject = (props) => {

    const classes = DatasetStyle();

  
    const [domains, setDomains] = useState([]);
    const [projectTypes, setProjectTypes] = useState(null);
  
    //Form related state variables
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedType, setSelectedType] = useState("");
  
    return (
      <ThemeProvider theme={themeDefault}>
    
                  
        <Grid container direction="row"  >
        <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Create a Project
              </Typography>
            </Grid>
  
            <Grid container direction="row">
              <Grid
                items
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
              items
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
                  items
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
                <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth

                />
              </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
             
                </Grid>
              </>
            )}
  
            {selectedDomain && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  items
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
  
            <Grid
              className={classes.projectsettingGrid}
              items
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
              {title !== "" && selectedType !== "" && (
                <Button
                  style={{ margin: "0px 20px 0px 0px" }}
                  label={"Create Project"}
                  onClick={handleCreateProject}
                />
              )}
              <Button
                label={"Cancel"}
                onClick={() => navigate(`/workspaces/${id}`)}
              />
            </Grid>
          </Grid>
          </Card>
        </Grid>
    
      </ThemeProvider>
    );
  };
  
  export default CollectionProject;
  
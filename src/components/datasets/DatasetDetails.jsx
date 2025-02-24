import {useState} from 'react';
import { Box, Card, Grid, ThemeProvider, Typography, Tabs, Tab ,IconButton, Tooltip} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import themeDefault from '@/themes/theme'
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { translate } from "@/config/localisation";
import TabPanel from '../common/TabPanel';
import MembersTable from '../Project/MembersTable';
import userRole from "@/utils/Role";
import DatasetProjectsTable from './DatasetProjectsTable';
import DataitemsTable from './DataitemsTable';
import DatasetLogs from './DatasetLogs';
import DatasetReports from './DatasetReports';
import { fetchDatasetDetails } from '@/Lib/Features/datasets/getDatasetDetails';
import { fetchDatasetMembers } from '@/Lib/Features/datasets/getDatasetMembers';
import DatasetDescription from './DatasetDescription';

const DatasetDetails = () => {
  /* eslint-disable react-hooks/exhaustive-deps */

    const { datasetId } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);
    const [datasetData, setDatasetData] = useState(
        [
            { name: "Dataset ID", value: null },
            { name: "Description", value: null },
            { name: "dataset Type", value: null },    
        ]
    )

    const dispatch = useDispatch();
    let navigate = useNavigate();
    const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
    const DatasetMembers = useSelector((state) => state.getDatasetMembers.data);
    const userDetails = useSelector((state) => state.getLoggedInData.data);
    
    useEffect(() => {
		dispatch(fetchDatasetDetails((datasetId)));
		dispatch(fetchDatasetMembers((datasetId)));
	}, [dispatch, datasetId]);
    useEffect(() => {
       
        setDatasetData([
            {
                name: "Dataset ID",
                value: DatasetDetails.instance_id
            },
            {
                name: "Description",
                value: DatasetDetails.instance_description
                
            },
            {
                name: "Datset Type",
                value: DatasetDetails.dataset_type
            },
          
           
        ])
    }, [DatasetDetails.instance_id]);

    const handleOpenSettings = () => {
        // navigate(`/projects/${id}/projectsetting`);
        navigate(`datasetsetting`)
    }

    return (
      <ThemeProvider theme={themeDefault}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            sx={{
              width: "100%",
              padding: 5,
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mb: 3,
                flexWrap: "nowrap",
              }}
            >
              <Grid item xs={9}>
                <Typography variant="h3">
                  {DatasetDetails.instance_name}
                </Typography>
              </Grid>

              {(userRole.Annotator !== userDetails?.role ||
                userRole.Reviewer !== userDetails?.role ||
                userRole.SuperChecker !== userDetails?.role) && (
                <Grid item xs={3} container justifyContent="flex-end">
                  <Tooltip
                    title={
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "0.7rem",
                        }}
                      >
                        {translate("label.showProjectSettings")}
                      </Typography>
                    }
                  >
                    <IconButton onClick={handleOpenSettings}>
                      <SettingsOutlinedIcon
                        color="primary.dark"
                        fontSize="large"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ mb: 2, mt: 3 }}
            >
              <Grid container spacing={2}>
                {datasetData?.map((des, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={i}>
                    <DatasetDescription
                      key={i}
                      name={des.name}
                      value={des.value}
                      index={i}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Box>
              <Tabs
                value={selectedTab}
                onChange={(_event, value) => setSelectedTab(value)}
                aria-label="nav tabs example"
                TabIndicatorProps={{ style: { backgroundColor: "#FD7F23 " } }}
              >
                <Tab
                  label={translate("label.datasets")}
                  sx={{ fontSize: 16, fontWeight: "700" }}
                />
                <Tab
                  label={translate("label.members")}
                  sx={{ fontSize: 16, fontWeight: "700" }}
                />
                <Tab
                  label={translate("label.projects")}
                  sx={{ fontSize: 16, fontWeight: "700" }}
                />
                <Tab
                  label={translate("label.logs")}
                  sx={{ fontSize: 16, fontWeight: "700" }}
                />
                <Tab
                  label={translate("label.reports")}
                  sx={{ fontSize: 16, fontWeight: "700" }}
                />
              </Tabs>
            </Box>
            <TabPanel value={selectedTab} index={0}>
              <DataitemsTable />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <MembersTable dataSource={DatasetMembers} hideButton />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <DatasetProjectsTable datasetId={datasetId} />
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              <DatasetLogs datasetId={datasetId} />
            </TabPanel>
            <TabPanel value={selectedTab} index={4}>
              <DatasetReports datasetId={datasetId} />
            </TabPanel>
          </Card>
        </Grid>
      </ThemeProvider>
    );
}

export default DatasetDetails;
import { useState } from 'react';
import { Box, Card, Grid, ThemeProvider, Typography, Tabs, Tab, IconButton, Tooltip } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import themeDefault from '@/themes/theme'
import { useParams, useNavigate } from "react-router-dom";
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
import Spinner from '../common/Spinner';

const DatasetDetails = () => {
    /* eslint-disable react-hooks/exhaustive-deps */

    const { datasetId } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);
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
    const apiLoading = useSelector((state) => state.apiStatus.loading);

    useEffect(() => {
        dispatch(fetchDatasetDetails((datasetId)));
        dispatch(fetchDatasetMembers((datasetId)));
    }, [dispatch, datasetId]);

    useEffect(() => {
		dispatch(APITransport(new GetDatasetDetailsAPI(datasetId)));
		dispatch(APITransport(new GetDatasetMembersAPI(datasetId)));
	}, [datasetId,loading]);
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

    useEffect(() => {
        setLoading(apiLoading);
      }, [apiLoading]);

    const handleOpenSettings = () => {
        // navigate(`/projects/${id}/projectsetting`);
        navigate(`datasetsetting`)
    }

    return (
        <ThemeProvider theme={themeDefault}>
          {loading && <Spinner />}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Card
                    sx={{
                        // width: window.innerWidth * 0.8,
                        width: '100%',
                        padding: 5,
                    }}
                >
                    {/* <Typography variant="h3">
                        {DatasetDetails.instance_name}
                    </Typography> */}
                    <Grid
                        container
                        direction='row'
                        justifyContent='center'
                        alignItems='center'
                        sx={{ mb: 3 }}
                    >
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Typography variant="h3">{DatasetDetails.instance_name}</Typography>
                        </Grid>

                        {(userRole.Annotator !== userDetails?.role || userRole.Reviewer !== userDetails?.role || userRole.SuperChecker !== userDetails?.role) && <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Tooltip
                                    title={
                                        <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: "0.7rem" }}>
                                            {translate("label.showProjectSettings")}
                                        </Typography>
                                    }
                                >
                                    <IconButton onClick={handleOpenSettings} sx={{ marginLeft: "140px" }}>
                                        <SettingsOutlinedIcon color="primary.dark" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>}

                    </Grid>
                    {/* <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2,
                            paddingBottom: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Instance ID :</Typography>
                        <Typography variant="body2" >{DatasetDetails.instance_id}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingBottom: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Dataset Type :</Typography>
                        <Typography variant="body2" >{DatasetDetails.dataset_type}</Typography>
                    </Grid>
                    {DatasetDetails.instance_description && <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        // sx={{
                        //     paddingTop: 2
                        // }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Description :</Typography>
                        <Typography variant="body2" >{DatasetDetails.instance_description}</Typography>
                    </Grid>} */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 2, mt: 3 }}>
                        <Grid container spacing={2}>
                            {datasetData?.map((des, i) => (
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4} key={i}>
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
                    <Box >
                        <Tabs value={selectedTab} onChange={(_event, value) => setSelectedTab(value)} aria-label="nav tabs example" variant="scrollable" TabIndicatorProps={{ style: { backgroundColor: "#FD7F23 " } }}>
                            <Tab label={translate("label.datasets")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.projects")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.logs")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.reports")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            {/* <Tab label={translate("label.settings")} sx={{ fontSize: 16, fontWeight: '700' }} /> */}
                        </Tabs>
                    </Box>
                    <TabPanel value={selectedTab} index={0}>
                        <DataitemsTable />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={1}>
                        <MembersTable dataSource={DatasetMembers} type="dataset"/>
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
                    {/* <TabPanel value={selectedTab} index={4}>
                        <DatasetSettings datasetId={datasetId} />
                    </TabPanel> */}
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default DatasetDetails;
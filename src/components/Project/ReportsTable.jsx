// ReportsTable

import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Button, Grid, CircularProgress, Card, Radio, Typography, ThemeProvider } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import { useDispatch, useSelector } from "react-redux";
import  "../../styles/Dataset.css";
import ColumnList from '../common/ColumnList';

import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import tableTheme from "../../themes/tableTheme";
import themeDefault from "../../themes/theme";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "../../utils/Role";


const ReportsTable = (props) => {
    const {isSuperChecker,isReviewer,isAnnotators}=props
    const [showPicker, setShowPicker] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [reportRequested, setReportRequested] = useState(false);
    const [columns, setColumns] = useState([]);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });



    const ProjectReport = [];
    
    const [radiobutton, setRadiobutton] = useState(isAnnotators?"AnnotatationReports":isReviewer?"ReviewerReports":"SuperCheckerReports");
    const [submitted, setSubmitted] = useState(false);
    const ProjectDetails = {
        "id": 2279,
        "title": "test ocr ce 2",
        "description": "test",
        "created_by": null,
        "is_archived": false,
        "is_published": true,
        "annotators": [
            {
                "id": 1,
                "username": "shoonya",
                "email": "shoonya@ai4bharat.org",
                "languages": [],
                "availability_status": 1,
                "enable_mail": false,
                "first_name": "Admin",
                "last_name": "AI4B",
                "phone": "",
                "profile_photo": "",
                "role": 6,
                "organization": {
                    "id": 1,
                    "title": "AI4Bharat",
                    "email_domain_name": "ai4bharat.org",
                    "created_by": {
                        "username": "shoonya",
                        "email": "shoonya@ai4bharat.org",
                        "first_name": "Admin",
                        "last_name": "AI4B",
                        "role": 6
                    },
                    "created_at": "2022-04-24T13:11:30.339610Z"
                },
                "unverified_email": "shoonya@ai4bharat.org",
                "date_joined": "2022-04-24T07:40:11Z",
                "participation_type": 3,
                "prefer_cl_ui": false,
                "is_active": true
            }
        ],
        "annotation_reviewers": [],
        "review_supercheckers": [],
        "frozen_users": [],
        "workspace_id": 1,
        "organization_id": 1,
        "filter_string": null,
        "sampling_mode": "f",
        "sampling_parameters_json": {},
        "project_type": "OCRSegmentCategorizationEditing",
        "label_config": "<View>\n  <Image name=\"image_url\" value=\"$image_url\"/>\n  \n  <Labels name=\"annotation_labels\" toName=\"image_url\" className=\"ignore_assertion\">\n    \n    <Label value=\"title\" background=\"green\" name=\"title\" className=\"ignore_assertion\"/>\n    <Label value=\"text\" background=\"blue\" name=\"text\" className=\"ignore_assertion\"/>\n    <Label value=\"image\" background=\"red\" name=\"image\" className=\"ignore_assertion\"/>\n    <Label value=\"unord-list\" background=\"yellow\" name=\"unord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"ord-list\" background=\"black\" name=\"ord-list\" className=\"ignore_assertion\"/>\n    <Label value=\"placeholder\" background=\"orange\" name=\"placeholder\" className=\"ignore_assertion\"/>\n    <Label value=\"table\" background=\"violet\" name=\"table\" className=\"ignore_assertion\"/>\n    <Label value=\"dateline\" background=\"cyan\" name=\"dateline\" className=\"ignore_assertion\"/>\n    <Label value=\"byline\" background=\"brown\" name=\"byline\" className=\"ignore_assertion\"/>\n    <Label value=\"page-number\" background=\"purple\" name=\"page-number\" className=\"ignore_assertion\"/>\n    <Label value=\"footer\" background=\"indigo\" name=\"footer\" className=\"ignore_assertion\"/>\n    <Label value=\"footnote\" background=\"pink\" name=\"footnote\" className=\"ignore_assertion\"/>\n    <Label value=\"header\" background=\"olive\" name=\"header\" className=\"ignore_assertion\"/>\n    <Label value=\"social-media-handle\" background=\"aqua\" name=\"social-media-handle\" className=\"ignore_assertion\"/>\n    <Label value=\"website-link\" background=\"teal\" name=\"website-link\" className=\"ignore_assertion\"/>\n    <Label value=\"caption\" background=\"maroon\" name=\"caption\" className=\"ignore_assertion\"/>\n    <Label value=\"table-header\" background=\"aquamarine\" name=\"table-header\" className=\"ignore_assertion\"/>\n    \n  </Labels>\n\n  <Rectangle name=\"annotation_bboxes\" toName=\"image_url\" strokeWidth=\"3\" className=\"ignore_assertion\"/>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"title\" name=\"title_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"h1\" className=\"ignore_assertion\"/>\n    <Choice value=\"h2\" className=\"ignore_assertion\"/>\n    <Choice value=\"h3\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"text\" name=\"text_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"paragraph\" className=\"ignore_assertion\"/>\n    <Choice value=\"foreign-language-text\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"image\" name=\"image_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"img\" className=\"ignore_assertion\"/>\n    <Choice value=\"logo\" className=\"ignore_assertion\"/>\n    <Choice value=\"formula\" className=\"ignore_assertion\"/>\n    <Choice value=\"equation\" className=\"ignore_assertion\"/>\n    <Choice value=\"bg-img\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"placeholder\" name=\"placeholder_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"placeholder-txt\" className=\"ignore_assertion\"/>\n    <Choice value=\"placeholder-img\" className=\"ignore_assertion\"/>\n  </Choices>\n  \n  <Choices visibleWhen=\"region-selected\" required=\"true\" whenTagName=\"annotation_labels\" whenLabelValue=\"caption\" name=\"caption_opts\" toName=\"image_url\" className=\"ignore_assertion\">\n  \t<Choice value=\"fig-caption\" className=\"ignore_assertion\"/>\n    <Choice value=\"table-caption\" className=\"ignore_assertion\"/>\n  </Choices>\n    \n</View>\n\n\n",
        "variable_parameters": {},
        "project_mode": "Annotation",
        "required_annotators_per_task": 1,
        "tasks_pull_count_per_batch": 10,
        "max_pending_tasks_per_user": 60,
        "src_language": null,
        "tgt_language": null,
        "created_at": "2023-12-06T06:37:58.364413Z",
        "project_stage": 1,
        "revision_loop_count": 3,
        "k_value": 100,
        "metadata_json": null,
        "datasets": [
            {
                "instance_id": 295,
                "instance_name": "Test OCR"
            }
        ],
        "status": "Published",
        "task_creation_status": "Tasks Creation Process Successful",
        "last_project_export_status": "Success",
        "last_project_export_date": "Synchronously Completed. No Date.",
        "last_project_export_time": "Synchronously Completed. No Time.",
        "last_pull_status": "Success",
        "last_pull_date": "Synchronously Completed. No Date.",
        "last_pull_time": "Synchronously Completed. No Time.",
        "last_pull_result": "No result.",
        "unassigned_task_count": 29,
        "labeled_task_count": 0,
        "reviewed_task_count": 0
    }
    const userDetails= {
      "id": 1,
      "username": "shoonya",
      "email": "shoonya@ai4bharat.org",
      "languages": [],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "Admin",
      "last_name": "AI4B",
      "phone": "",
      "profile_photo": "",
      "role": 6,
      "organization": {
          "id": 1,
          "title": "AI4Bharat",
          "email_domain_name": "ai4bharat.org",
          "created_by": {
              "username": "shoonya",
              "email": "shoonya@ai4bharat.org",
              "first_name": "Admin",
              "last_name": "AI4B",
              "role": 6
          },
          "created_at": "2022-04-24T13:11:30.339610Z"
      },
      "unverified_email": "shoonya@ai4bharat.org",
      "date_joined": "2022-04-24T07:40:11Z",
      "participation_type": 3,
      "prefer_cl_ui": false,
      "is_active": true
    };
    
     const loggedInUserData= {
      "id": 1,
      "username": "shoonya",
      "email": "shoonya@ai4bharat.org",
      "languages": [],
      "availability_status": 1,
      "enable_mail": false,
      "first_name": "Admin",
      "last_name": "AI4B",
      "phone": "",
      "profile_photo": "",
      "role": 2,
      "organization": {
          "id": 1,
          "title": "AI4Bharat",
          "email_domain_name": "ai4bharat.org",
          "created_by": {
              "username": "shoonya",
              "email": "shoonya@ai4bharat.org",
              "first_name": "Admin",
              "last_name": "AI4B",
              "role": 6
          },
          "created_at": "2022-04-24T13:11:30.339610Z"
      },
      "unverified_email": "shoonya@ai4bharat.org",
      "date_joined": "2022-04-24T07:40:11Z",
      "participation_type": 3,
      "prefer_cl_ui": false,
      "is_active": true
    }
    const [selectRange, setSelectRange] = useState([{
        startDate: new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
        endDate: new Date(),
        key: "selection"
    }]);

    const handleChangeReports = (e) => {
        setRadiobutton(e.target.value)
    }


    const renderToolBar = () => {
        const buttonSXStyle = { borderRadius: 2, margin: 2 }
        return (

            <Box className="ToolbarContainer">
                <ColumnList
                    columns={columns}
                    setColumns={setSelectedColumns}
                    selectedColumns={selectedColumns}
                />

            </Box>
        )
    }




    const options = {
        filterType: 'checkbox',
        selectableRows: "none",
        download: true,
        filter: false,
        print: false,
        search: false,
        viewColumns: false,
        jumpToPage: true,
        customToolbar: renderToolBar,
        textLabels: {
            body: {
                noMatch: 'No Record Found!'
            },
        },


    };

    const handleRangeChange = (ranges) => {
        const { selection } = ranges;
        if (selection.endDate > new Date()) selection.endDate = new Date();
        setSelectRange([selection]);
    };

    const handleSubmit = async () => {
        let projectObj;
        let reports_type = radiobutton === "SuperCheckerReports" ? "superchecker_reports" : "review_reports"
        setReportRequested(true);
        setSubmitted(true);

        if (radiobutton === "AnnotatationReports") {
            projectObj = new GetProjectReportAPI(id, format(selectRange[0].startDate, 'yyyy-MM-dd'), format(selectRange[0].endDate, 'yyyy-MM-dd'));
        }
        else if (radiobutton === "ReviewerReports") {
            projectObj = new GetProjectReportAPI(id, format(selectRange[0].startDate, 'yyyy-MM-dd'), format(selectRange[0].endDate, 'yyyy-MM-dd'), reports_type);
        }
        else if (radiobutton === "SuperCheckerReports") {
            projectObj = new GetProjectReportAPI(id, format(selectRange[0].startDate, 'yyyy-MM-dd'), format(selectRange[0].endDate, 'yyyy-MM-dd'), reports_type);
        }
        dispatch(APITransport(projectObj));
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        console.log(resp, "resp")
        if (resp.message) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })


        }

        setShowPicker(false)

    }

    let frozenUsers = ProjectDetails?.frozen_users?.map((e,) => {
        let temp = ProjectReport.find(element => element.id === e.id)
        if (temp?.ProjectReport) {
            e.ProjectReport = temp.ProjectReport;
        }
        return e;
    })


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
        <React.Fragment>
            {renderSnackBar()}
            <Grid container direction="row" rowSpacing={2} sx={{ mb: 2, }}>
                <Grid item xs={12} sm={12} md={3} lg={2} xl={2}  >
                    <Typography gutterBottom component="div" sx={{ marginTop: "10px", fontSize: "16px", }}>
                        Select Report Type :
                    </Typography>
                </Grid >
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}  >
                    <FormControl >

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{ marginTop: "5px" }}
                            value={radiobutton}
                            onChange={handleChangeReports}

                        >
                            {(userRole.WorkspaceManager === loggedInUserData?.role ||
                                userRole.OrganizationOwner === loggedInUserData?.role ||
                                userRole.Admin === loggedInUserData?.role || ProjectDetails?.project_stage === 1 ||
                                ProjectDetails?.annotators?.some((user) => user.id === loggedInUserData.id)) && <FormControlLabel value="AnnotatationReports" control={<Radio />} label="Annotator" />}
                            {((userRole.WorkspaceManager === loggedInUserData?.role ||
                                userRole.OrganizationOwner === loggedInUserData?.role ||
                                userRole.Admin === loggedInUserData?.role) ? (ProjectDetails?.project_stage == 2 || ProjectDetails?.project_stage == 3) : 
                            ProjectDetails?.annotation_reviewers?.some(
                                (reviewer) => reviewer.id === loggedInUserData?.id
                            )) && <FormControlLabel value="ReviewerReports" control={<Radio />} label="Reviewer" />}
                            {((userRole.WorkspaceManager === loggedInUserData?.role ||
                                userRole.OrganizationOwner === loggedInUserData?.role ||
                                userRole.Admin === loggedInUserData?.role) ? ProjectDetails?.project_stage == 3 : false ||
                            ProjectDetails?.review_supercheckers?.some(
                                (superchecker) => superchecker.id === loggedInUserData?.id
                            )) && <FormControlLabel value="SuperCheckerReports" control={<Radio />} label="Super Checker" />}
                        </RadioGroup>
                    </FormControl>
                </Grid >
                <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                    <Button
                        endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                        variant="contained"
                        color="primary"
                        sx={{ width: "130px" }}
                        onClick={() => setShowPicker(!showPicker)}
                    >
                        Pick Dates
                    </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ width: "130px" }}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
            {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
                <Card>
                    <DateRangePicker
                        onChange={handleRangeChange}
                        staticRanges={[
                            ...defaultStaticRanges,
                            {
                                label: "Till Date",
                                range: () => ({
                                    startDate: new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                                    endDate: new Date(),
                                }),
                                isSelected(range) {
                                    const definedRange = this.range();
                                    return (
                                        isSameDay(range.startDate, definedRange.startDate) &&
                                        isSameDay(range.endDate, definedRange.endDate)
                                    );
                                }
                            },
                        ]}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={selectRange}
                        minDate={new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
                        maxDate={new Date()}
                        direction="horizontal"

                    />
                </Card>
            </Box>}
            {ProjectReport?.length > 0 ? (
                <>
                    {!(userRole.Annotator === loggedInUserData?.role || userRole.Reviewer === loggedInUserData?.role) && frozenUsers.length > 0 && (
                        <Typography variant="body2" color="#F8644F">* User Inactive</Typography>)}
                    <ThemeProvider theme={tableTheme}>
                        {
                            showSpinner ? <CircularProgress sx={{ mx: "auto", display: "block" }} /> : reportRequested && (
                                <MUIDataTable
                                    title={radiobutton === "AnnotatationReports" ? "Annotation Report" : (radiobutton === "ReviewerReports" ? "Reviewer Report" : "Super Checker Report")}
                                    data={ProjectReport}
                                    columns={columns.filter(col => selectedColumns.includes(col.name))}
                                    options={options}
                                />
                            )
                        }

                    </ThemeProvider>
                </>
            ) :

                <Grid
                    container
                    justifyContent="center"
                >
                    <Grid item sx={{ mt: "10%" }}>
                        {showSpinner ? <CircularProgress color="primary" size={50} /> : (
                            !ProjectReport?.length && submitted && <>No results</>
                        )}
                    </Grid>
                </Grid>
            }
        </React.Fragment>
    )
}

export default ReportsTable;
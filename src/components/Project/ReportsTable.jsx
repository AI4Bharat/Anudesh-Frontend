// ReportsTable

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Grid, CircularProgress, Card, Radio, Typography, ThemeProvider, TablePagination, Select, MenuItem } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from "react-redux";
import "../../styles/Dataset.css";
import DatasetStyle from '@/styles/dataset';
import ColumnList from '../common/ColumnList';
import Skeleton from "@mui/material/Skeleton";
import { isSameDay, format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import tableTheme from "../../themes/tableTheme";
import themeDefault from "../../themes/theme";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "../../utils/Role";
import GetProjectReportAPI from '@/app/actions/api/Projects/GetProjectReportAPI';
import { fetchProjectReport } from '@/Lib/Features/getProjectReport';

const MUIDataTable = dynamic(
    () => import('mui-datatables'),
    {
        ssr: false,
        loading: () => (
            <Skeleton
                variant="rectangular"
                height={400}
                sx={{
                    mx: 2,
                    my: 3,
                    borderRadius: '4px',
                    transform: 'none'
                }}
            />
        )
    }
);

const ReportsTable = (props) => {
    /* eslint-disable react-hooks/exhaustive-deps */

    const { isSuperChecker, isReviewer, isAnnotators } = props
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const [selectRange, setSelectRange] = useState([{
        startDate: new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
        endDate: new Date(),
        key: "selection"
    }]);
    // const [rangeValue, setRangeValue] = useState([format(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'), Date.now()]);
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

    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [displayWidth, setDisplayWidth] = useState(0);
    const ProjectReport = useSelector(state => state.getProjectReport.data);
    const classes = DatasetStyle();
    const [radiobutton, setRadiobutton] = useState(isAnnotators ? "AnnotatationReports" : isReviewer ? "ReviewerReports" : "SuperCheckerReports");
    const [submitted, setSubmitted] = useState(false);
    const [title, setTitle] = useState('');

    const loggedInUserData = useSelector(
        (state) => state.getLoggedInData.data
    );


    useEffect(() => {
        const handleResize = () => {
            setDisplayWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            handleResize();
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);


    useEffect(() => {
        if (reportRequested && ProjectReport?.length > 0) {
            let cols = [];
            let selected = [];
            Object.keys(ProjectReport[0]).forEach((key) => {
                cols.push({
                    name: key,
                    label: key,
                    options: {
                        filter: false,
                        sort: false,
                        setCellProps: () => ({
                            style: {
                                fontSize: "16px",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                            }
                        }),
                    }
                })
                selected.push(key);
            });
            setSelectedColumns(selected);
            setColumns(cols);
        } else {
            setColumns([]);
            setSelectedColumns([]);
        }
        setShowSpinner(false);
    }, [ProjectReport]);


    const handleChangeReports = (e) => {
        setRadiobutton(e.target.value)
    }


    const renderToolBar = () => {
        const buttonSXStyle = { borderRadius: 2, margin: 2 }
        return (

            <Box className={classes.ToolbarContainer}>
                <ColumnList
                    columns={columns}
                    setColumns={setSelectedColumns}
                    selectedColumns={selectedColumns}
                />

            </Box>
        )
    }



    const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: {
                        xs: "space-between",
                        md: "flex-end"
                    },
                    alignItems: "center",
                    padding: "10px",
                    gap: {
                        xs: "10px",
                        md: "20px"
                    },
                }}
            >

                {/* Pagination Controls */}
                <TablePagination
                    component="div"
                    count={count}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, newPage) => changePage(newPage)}
                    onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
                    sx={{
                        "& .MuiTablePagination-actions": {
                            marginLeft: "0px",
                        },
                        "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
                            marginRight: "10px",
                        },
                    }}
                />

                {/* Jump to Page */}
                <div>
                    <label style={{
                        marginRight: "5px",
                        fontSize: "0.83rem",
                    }}>
                        Jump to Page:
                    </label>
                    <Select
                        value={page + 1}
                        onChange={(e) => changePage(Number(e.target.value) - 1)}
                        sx={{
                            fontSize: "0.8rem",
                            padding: "4px",
                            height: "32px",
                        }}
                    >
                        {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
                            <MenuItem key={i} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </Box>
        );
    };

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
        responsive: "vertical",
        customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
            <CustomFooter
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                changeRowsPerPage={changeRowsPerPage}
                changePage={changePage}
            />
        ),


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
        setLoading(true);
        setTitle(radiobutton === "AnnotatationReports" ? "Annotation Report" : (radiobutton === "ReviewerReports" ? "Reviewer Report" : "Super Checker Report"))
        setTimeout(() => {
            setLoading(false)
        }, 1000);
        if (radiobutton === "AnnotatationReports") {
            projectObj = ({ projectId: id, startDate: format(selectRange[0].startDate, 'yyyy-MM-dd'), endDate: format(selectRange[0].endDate, 'yyyy-MM-dd') });
        }
        else if (radiobutton === "ReviewerReports") {
            projectObj = ({ projectId: id, startDate: format(selectRange[0].startDate, 'yyyy-MM-dd'), endDate: format(selectRange[0].endDate, 'yyyy-MM-dd'), reports_type: reports_type });
        }
        else if (radiobutton === "SuperCheckerReports") {
            projectObj = ({ projectId: id, startDate: format(selectRange[0].startDate, 'yyyy-MM-dd'), endDate: format(selectRange[0].endDate, 'yyyy-MM-dd'), reports_type: reports_type });
        }
        // projectId, startDate, endDate,reports_type
        dispatch(fetchProjectReport(projectObj));
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
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
                        sx={{ width: "130px", marginTop: "8.5px" }}
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
                        sx={{ width: "130px", marginTop: "8.5px" }}
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
                            loading ? <CircularProgress style={{ marginLeft: "50%" }} /> : reportRequested && (
                                <MUIDataTable
                                    key={`table-${displayWidth}`}
                                    title={title}
                                    data={ProjectReport}
                                    columns={columns.filter(col => selectedColumns.includes(col.name))}
                                    options={{
                                        ...options,
                                        tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 200 : 400}px`
                                    }}
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
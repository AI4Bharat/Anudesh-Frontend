import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../common/Button'
// import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
// import WorkspaceTable from "../common/WorkspaceTable";
// import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
// import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { ThemeProvider, Grid } from "@mui/material";
import tableTheme from "../../../themes/tableTheme";
import DatasetStyle from "../../../styles/Dataset";
import Search from "../common/Search";
import Link from 'next/link';



const WorkspaceTable = (props) => {
    const classes = DatasetStyle();
    // const dispatch = useDispatch();
    const { showManager, showCreatedBy } = props;
    // const workspaceData = useSelector(state => state.GetWorkspace.data);
    // const SearchWorkspace = useSelector((state) => state.SearchProjectCards.data);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [totalWorkspaces, setTotalWorkspaces] = useState(10);

    // const totalWorkspaceCount = useSelector(state => state.GetWorkspace.data.count);

    // const getWorkspaceData = () => {
    //     const workspaceObj = new GetWorkspaceAPI(currentPageNumber);
    //     dispatch(APITransport(workspaceObj));
    // }

    // useEffect(() => {
    //     getWorkspaceData();
    //     // console.log("fired now")
    // }, [currentPageNumber]);

    // // useEffect(() => {
    // //     getWorkspaceData();
    // // }, [currentRowPerPage]);

    // useEffect(() => {
    //     getWorkspaceData();
    // }, []);

    const pageSearch = () => {

        return workspaceData.filter((el) => {

            // if (SearchWorkspace == "") {

            //     return el;
            // } else if (
            //     el.workspace_name
            //         ?.toLowerCase()
            //         .includes(SearchWorkspace?.toLowerCase())
            // ) {

            //     return el;
            // }
            // else if (
            //     el.managers?.some(val => val.username
            //         ?.toLowerCase().includes(SearchWorkspace?.toLowerCase()) ))           
                    
            //      {

                return el;
            // }
        })

    }

    const workspaceData = [{ "id": 1, "workspace_name": "workspace 1", "managers": [{ "username": "manager 1" }, { "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 1" } },
    { "id": 2, "workspace_name": "workspace 2", "managers": [{ "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 2" } },
    { "id": 3, "workspace_name": "workspace 3", "managers": [{ "username": "manager 1" }, { "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 3" } },
    { "id": 4, "workspace_name": "workspace 4", "managers": [{ "username": "manager 1" }, { "username": "manager 3" }], "created_by": { "username": "Admin 4" } },
    { "id": 5, "workspace_name": "workspace 5", "managers": [{ "username": "manager 1" }, { "username": "manager 3" }], "created_by": { "username": "Admin 5" } },
    { "id": 6, "workspace_name": "workspace 6", "managers": [{ "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 6" } }]
  
   
    const columns = [
        {
            name: "id",
            label: "Id",
            options: {
                filter: false,
                sort: false,
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Manager",
            label: "Manager",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display: showManager ? "true" : "exclude",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Created By",
            label: "Created By",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display: showCreatedBy ? "true" : "exclude",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
            }
        }];
      
    const data = workspaceData && workspaceData.length > 0 ?pageSearch().map((el, i) => {
        return [
            el.id,
            el.workspace_name,
            el.managers.map((manager, index) => {
                return manager.username
            }).join(", "),
            el.created_by && el.created_by.username,
            <Link key={i} href={`/workspace`} style={{ textDecoration: "none" }}>
                <CustomButton
                    sx={{ borderRadius: 2 }}
                    label="View"
                />
            </Link>
        ]
    })  : [];

    const options = {
        textLabels: {
            body: {
                noMatch: "No records",
            },
            toolbar: {
                search: "Search",
                viewColumns: "View Column",
            },
            pagination: { rowsPerPage: "Rows per page" },
            options: { sortDirection: "desc" },
        },
        // customToolbar: fetchHeaderButton,
        displaySelectToolbar: false,
        fixedHeader: false,
        filterType: "checkbox",
        download: false,
        print: false,
        rowsPerPageOptions: [10, 25, 50, 100],
        // rowsPerPage: PageInfo.count,
        filter: false,
        // page: PageInfo.page,
        viewColumns: false,
        selectableRows: "none",
        search: false,
        jumpToPage: true,
    };


    return (
        <div>
            <Grid sx={{ mb: 1 }}>
                <Search />
            </Grid>
            {workspaceData && <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>}
        </div>
    )
}

export default WorkspaceTable;
'use client';
import { Button, Grid, Typography, Card, Tab, Tabs, Box } from "@mui/material"
import { useState } from 'react'
import DatasetStyle from "@/styles/Dataset";
import MUIDataTable from "mui-datatables";
import CustomButton from "../components/common/Button";
import Link from "next/link";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Organization() {

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = DatasetStyle();
  const CustomButton = ({ label, buttonVariant, color, disabled = false, ...rest }) => (
    <Button {...rest} variant={buttonVariant ? buttonVariant : "contained"} color={color ? color : "primary"} disabled={disabled}>
      {label}
    </Button>
  );


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
        display: "true",
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
        display: "true",
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

  const workspaceData = [{ "id": 1, "workspace_name": "workspace 1", "managers": [{ "username": "manager 1" }, { "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 1" } },
  { "id": 2, "workspace_name": "workspace 2", "managers": [{ "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 2" } },
  { "id": 3, "workspace_name": "workspace 3", "managers": [{ "username": "manager 1" }, { "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 3" } },
  { "id": 4, "workspace_name": "workspace 4", "managers": [{ "username": "manager 1" }, { "username": "manager 3" }], "created_by": { "username": "Admin 4" } },
  { "id": 5, "workspace_name": "workspace 5", "managers": [{ "username": "manager 1" }, { "username": "manager 3" }], "created_by": { "username": "Admin 5" } },
  { "id": 6, "workspace_name": "workspace 6", "managers": [{ "username": "manager 2" }, { "username": "manager 3" }], "created_by": { "username": "Admin 6" } }]

  const pageSearch = () => {
    return workspaceData.filter((el) => {
      return el;
    })

  }
  const data = workspaceData && workspaceData.length > 0 ? pageSearch().map((el, i) => {
    return [
      el.id,
      el.workspace_name,
      el.managers.map((manager) => {
        return manager.username
      }).join(", "),
      el.created_by && el.created_by.username,
      <Link key={i} href={`/workspaces/${el.id}`} style={{ textDecoration: "none" }}>
        <CustomButton
          sx={{ borderRadius: 2 }}
          label="View"
        />
      </Link>
    ]
  }) : [];

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          AI4Bharat
        </Typography>

        <Typography variant="body1" gutterBottom component="div">
          Created by : Anudesh
        </Typography>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Workspaces"
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
            <Tab
              label="Members"
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
            <Tab
              label="Invites"
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
            <Tab
              label="Reports"
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
            <Tab
              label="Organization Settings"
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
          </Tabs>
        </Box>
        <TabPanel
          value={value}
          index={0}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <CustomButton
            label="Add New Workspace"
            sx={{ width: "100%", mb: 2 }}
          />
          {/* <Grid sx={{ mb: 1 }}>
                <Search />
            </Grid> */}
          <MUIDataTable
            title={""}
            data={data}
            columns={columns}
            options={options}
          />
        </TabPanel>
      </Card>
    </Grid>
  )
}

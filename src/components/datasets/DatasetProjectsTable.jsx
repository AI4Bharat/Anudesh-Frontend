import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import CustomButton from "@/components/common/Button";
import CustomizedSnackbars from "@/components/common/Snackbar"
import Spinner from "@/components/common/Spinner";
import MUIDataTable from "mui-datatables";
import Search from "@/components/common/Search";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";


import { ThemeProvider } from "@mui/material";
import tableTheme from "@/themes/tableTheme";
import { fetchDatasetProjects } from "@/Lib/Features/datasets/GetDatasetProjects";
import GetExportProjectButtonAPI from "@/app/actions/api/Projects/GetExportProjectButtonAPI";
import GetPullNewDataAPI from "@/app/actions/api/Projects/GetPullNewDataAPI";
import { fetchExportProjectButton } from "@/Lib/Features/datasets/GetExportProjectButton";

const columns = [
	{
		name: "id",
		label: "Id",
		options: {
			filter: false,
			sort: false,
			align: "center",
			setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
		},
	},
	{
		name: "title",
		label: "Title",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "last_project_export_status",
		label: "Last Project Export Status",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "last_project_export_date",
		label: "Last Project Export Date",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "last_project_export_time",
		label: "Last Project Export Time",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "actions",
		label: "Actions",
		options: {
			sort: false,
			filter: false,
			align: "center",
			setCellProps: () => ({ 
				style: {
				padding: "16px",
				whiteSpace: "normal", 
				overflowWrap: "break-word",
				wordBreak: "break-word",  
			  } 
			  }),
		},
	},
];

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
            fontSize:"0.83rem", 
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
	filterType: "checkbox",
	selectableRows: "none",
	download: false,
	filter: false,
	print: false,
	search: false,
	viewColumns: false,
	jumpToPage: true,
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

export default function DatasetProjectsTable({ datasetId }) {
  /* eslint-disable react-hooks/exhaustive-deps */
  const dispatch = useDispatch();
	const datasetProjects = useSelector((state) =>
		state.GetDatasetProjects?.data);

	const [snackbar, setSnackbarInfo] = useState({
		open: false,
		message: "",
		variant: "success",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(fetchDatasetProjects(datasetId));
	}, [ datasetId]);

	const getExportProjectButton = async (project) => {
		setLoading(true);
		const projectObj1 = project.project_type === "InstructionDrivenChat" ?
			({projectId:project.id, datasetId:project.dataset_id[0]}) : ({projectId:project.id});
		const projectObj = project.project_type === "InstructionDrivenChat" ?
			new GetExportProjectButtonAPI(project.id, project.dataset_id[0]) : new GetExportProjectButtonAPI(project.id);
		dispatch(fetchExportProjectButton(projectObj1));
		const res = await fetch(projectObj.apiEndPoint(), {
			method: "POST",
			body: JSON.stringify(projectObj.getBody()),
			headers: projectObj.getHeaders().headers,
		});
		const resp = await res.json();
		setLoading(false);
		if (res.ok) {
			setSnackbarInfo({
				open: true,
				message: resp?.message,
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
	const SearchWorkspaceMembers = useSelector(
		(state) => state.SearchProjectCard?.searchValue
	  );
  const pageSearch = () => {
    return datasetProjects.filter((el) => {
		console.log(SearchWorkspaceMembers);
      if (SearchWorkspaceMembers == ""||SearchWorkspaceMembers==undefined) {
        return el;
      } else if (
        el.title
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
		
        return el;
	  }
    //   } else if (
    //     el.email?.toLowerCase().includes(SearchWorkspaceMembers?.toLowerCase())
    //   ) {
    //     return el;
    //   }
    });
  };



	const getPullNewDataAPI = async (project) => {
		const projectObj = new GetPullNewDataAPI(project.id);
		//dispatch(APITransport(projectObj));
		const res = await fetch(projectObj.apiEndPoint(), {
			method: "POST",
			body: JSON.stringify(projectObj.getBody()),
			headers: projectObj.getHeaders().headers,
		});
		const resp = await res.json();
		setLoading(false);
		if (res.ok) {
			setSnackbarInfo({
				open: true,
				message: resp?.message,
				variant: "success",
			});
		} else {
			setSnackbarInfo({
				open: true,
				message: resp?.message,
				variant: "error",
			});
		}
	};
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

	const data = datasetProjects? pageSearch().map((project) => ({
			...project,
			actions: () => (
				<>
					<Link
						to={`/projects/${project.id}`}
						style={{ textDecoration: "none" }}
					>
						<CustomButton sx={{ m:1,borderRadius: 2 }} label="View" />
					</Link>
					<CustomButton sx={{ m:1,borderRadius: 2, height: 37 }} onClick={() => getExportProjectButton(project)} label="Export" />
					<CustomButton sx={{ m:1,borderRadius: 2 }} onClick={() => getPullNewDataAPI(project)} label="Pull New Data Items" />
				</>
			),
		})):[]
    // )
console.log(data);
	return (
		<>
			<ThemeProvider theme={tableTheme}>
				{loading && <Spinner />}
				<Grid>
					{renderSnackBar()}
				</Grid>
				<Grid sx={{ mb: 1 }}>
					<Search />
				</Grid>
				<MUIDataTable
					columns={columns}
					options={options}
					data={data}
				/>
			</ThemeProvider>
		</>
	);
}

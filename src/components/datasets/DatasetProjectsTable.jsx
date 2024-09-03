import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import CustomButton from "@/components/common/Button";
import CustomizedSnackbars from "@/components/common/Snackbar"
import Spinner from "@/components/common/Spinner";
import MUIDataTable from "mui-datatables";
import Search from "@/components/common/Search";


import { Grid, Stack, ThemeProvider } from "@mui/material";
import tableTheme from "@/themes/tableTheme";
import { width } from "@mui/system";
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
		},
	},
];


const options = {
	filterType: "checkbox",
	selectableRows: "none",
	download: false,
	filter: false,
	print: false,
	search: false,
	viewColumns: false,
	jumpToPage: true,
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
				<Stack direction="row" spacing={2}>
					<Link
						to={`/projects/${project.id}`}
						style={{ textDecoration: "none" }}
					>
						<CustomButton sx={{ borderRadius: 2 }} label="View" />
					</Link>
					<CustomButton sx={{ borderRadius: 2, height: 37 }} onClick={() => getExportProjectButton(project)} label="Export" />
					<CustomButton sx={{ borderRadius: 2 }} onClick={() => getPullNewDataAPI(project)} label="Pull New Data Items" />
				</Stack>
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

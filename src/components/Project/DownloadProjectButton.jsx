import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from 'react-router-dom';
import CustomizedSnackbars from "@/components/common/Snackbar";
import userRole from "@/utils/UserMappedByRole/Roles";
import { fetchDownloadCSVProject } from "@/Lib/Features/projects/DownloadProjectCsv";
import { fetchDownloadTSVProject } from "@/Lib/Features/projects/DownloadProjectTsv";
import { fetchDownloadJSONProject } from "@/Lib/Features/projects/DownloadJSONProject";

const StyledMenu = styled((props) => (
  <Menu
    elevation={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,


  },
}));


function DownloadProjectButton(props) {
  const { taskStatus,SetTask,downloadMetadataToggle} = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [downloadres, setdownloadres] = useState(false);
  const [loading, setLoading] = useState(false);
 const[taskValue ,setTaskValue]= useState(taskStatus)
  const apiLoading = useSelector(state => state.apiStatus.loading);
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const dispatch = useDispatch();
  let csvLink = React.createRef()
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInData?.data
  );
  const loggedInUserData1 = useSelector(
    (state) =>console.log(state)
  );


  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading])


  // const getDownloadProject = async () => {
  //   const projectObj = new DownloadProjectButtonAPI(id);

  //   dispatch(APITransport(projectObj));

  // }
  // let DownloadProject =  useSelector(state => state.downloadProjectButton.data);


  // const DownloadJSONProject = async () => {
  //   const projectObj = new DownloadJSONProjectAPI(id);

  //   dispatch(APITransport(projectObj));

  // }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleDownloadJSONProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    const projectObj = ({projectId:id,taskStatus:taskStatus,downloadMetadataToggle:downloadMetadataToggle});
    dispatch(fetchDownloadJSONProject(projectObj));
    // const res = await fetch(projectObj.apiEndPoint(), {
    //   method: "POST",
    //   body: JSON.stringify(projectObj.getBody()),
    //   headers: projectObj.getHeaders().headers,
    // });
    // const resp = await res.json();
    // setLoading(false);
    // if (res.ok) {
    //   setSnackbarInfo({
    //     open: true,
    //     message: "success",
    //     variant: "success",
    //   })

    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   })
    // }
   
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSVProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    setLoading(true)
    const projectObj = ({projectId:id,taskStatus:taskStatus,downloadMetadataToggle:downloadMetadataToggle});
    dispatch(fetchDownloadCSVProject(projectObj));
    // const res = await fetch(projectObj.apiEndPoint(), {
    //   method: "POST",
    //   body: JSON.stringify(projectObj.getBody()),
    //   headers: projectObj.getHeaders().headers,
    // });
    // const resp = await res.json();
    // setLoading(false);
    // if (res.ok) {
    //   setSnackbarInfo({
    //     open: true,
    //     message: "success",
    //     variant: "success",
    //   })

    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   })
    // }
   
  };

  const handleDownloadTSVProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    setLoading(true)
    const projectObj = ({projectId:id,taskStatus:taskStatus,downloadMetadataToggle:downloadMetadataToggle});
    dispatch(fetchDownloadTSVProject(projectObj));
    // const res = await fetch(projectObj.apiEndPoint(), {
    //   method: "POST",
    //   body: JSON.stringify(projectObj.getBody()),
    //   headers: projectObj.getHeaders().headers,
    // });
    // const resp = await res.json();
    // setLoading(false);
    // if (res.ok) {
    //   setSnackbarInfo({
    //     open: true,
    //     message: "success",
    //     variant: "success",
    //   })

    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   })
    // }
    
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
  return (
    <div>
      {renderSnackBar()}
      <Button
        sx={{ inlineSize: "max-content", borderRadius: 3, width: "100%" }}
        id="demo-customized-button"
        // aria-controls={open ? 'demo-customized-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disabled= {taskStatus.length > 0 && userRole.WorkspaceManager !== loggedInUserData?.role? false: true } 
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Download Project
      </Button>
      <StyledMenu
        sytle={{ width: "20px" }}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        <MenuItem onClick={handleDownloadCSVProject}>
          CSV
        </MenuItem>
        <MenuItem onClick={handleDownloadTSVProject}>
          TSV
        </MenuItem>
        <MenuItem onClick={handleDownloadJSONProject} >
          JSON
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
export default DownloadProjectButton;
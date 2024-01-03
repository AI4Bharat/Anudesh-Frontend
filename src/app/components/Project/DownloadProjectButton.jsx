import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomizedSnackbars from "../common/Snackbar";

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
  const[taskValue ,setTaskValue]= useState(taskStatus);
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleDownloadJSONProject = async () => {
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSVProject = async () => {
    setLoading(true)
  };

  const handleDownloadTSVProject = async () => {
    setLoading(true)
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
        sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2,width:"300px" }}
        id="demo-customized-button"
        variant="contained"
        disabled= {taskStatus.length > 0 ? false: true } 
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
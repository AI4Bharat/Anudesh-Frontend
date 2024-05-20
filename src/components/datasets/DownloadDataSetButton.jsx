import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {CircularProgress} from "@mui/material";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomizedSnackbars from "@/components/common/Snackbar";
import GetDatasetDownloadJSON, { fetchDatasetDownloadJSON } from "@/Lib/Features/datasets/GetDatasetDownloadJSON";
import { fetchDatasetDownloadCSV } from "@/Lib/Features/datasets/GetDatasetDownloadCSV";
import { fetchDatasetDownloadTSV } from "@/Lib/Features/datasets/GetDatasetDownloadTSV";
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


function DownloadDatasetButton(props) {
        /* eslint-disable react-hooks/exhaustive-deps */

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiLoading = useSelector(state => state.apiStatus.loading);
  const downloadCSV = useSelector((state) => state.getDatasetDownloadCSV?.data);
  const downloadJSON = useSelector((state) => state.getDatasetDownloadJSON?.data);
  const downloadTSV = useSelector((state) => state.getDatasetDownloadTSV?.data);
  const open = Boolean(anchorEl);
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  let csvLink = React.createRef()
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    setLoading(false);
  }, [downloadCSV,downloadJSON,downloadTSV])


 
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleDownloadJSONDataset = async () => {
    setLoading(true);
    const projectObj = (datasetId);
    dispatch(fetchDatasetDownloadJSON(projectObj));
    setAnchorEl(null);
    setTimeout(() => {
      setLoading(false); 
    }, 1000);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSVDataset = async () => {
    setLoading(true);
    dispatch(fetchDatasetDownloadCSV((datasetId)));
    setAnchorEl(null);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  const handleDownloadTSVDataset = async () => {
    setLoading(true);
    dispatch(fetchDatasetDownloadTSV((datasetId)));
    setAnchorEl(null);
    setTimeout(() => {
      setLoading(false); 
    }, 1000);
  }
 
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

      {loading ? (
						<CircularProgress />
					) : (<>
      <Button
        sx={{  p: 2, borderRadius: 5,width:"190px" }}
        id="demo-customized-button"
        // aria-controls={open ? 'demo-customized-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Download DataSet
      </Button>
      <StyledMenu
        sytle={{ width: "px" }}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        <MenuItem onClick={handleDownloadCSVDataset}>
          CSV
        </MenuItem>
        <MenuItem onClick={handleDownloadTSVDataset}>
          TSV
        </MenuItem>
        <MenuItem onClick={handleDownloadJSONDataset} >
          JSON
        </MenuItem>
      </StyledMenu>
      </>
      	)}
    </div>
  );
}
export default DownloadDatasetButton;
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import CustomizedSnackbars from "@/components/common/Snackbar";
import userRole from "@/utils/UserMappedByRole/Roles";

import { fetchDownloadCSVProject } from "@/Lib/Features/projects/DownloadProjectCsv";
import { fetchDownloadTSVProject } from "@/Lib/Features/projects/DownloadProjectTsv";
import { fetchDownloadJSONProject } from "@/Lib/Features/projects/DownloadJSONProject";


const StyledMenu = styled((props) => (
  <Menu
    elevation={3}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 220,
  },
}));

function EmailProjectFile(props) {
  const { taskStatus, downloadMetadataToggle } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();

  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInData?.data
  );

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

 
  const triggerEmailExport = (type) => {
    if (loading) return;

    const payload = {
      projectId: id,
      taskStatus,
      downloadMetadataToggle,
      email: true, 
    };

    if (type === "CSV") dispatch(fetchDownloadCSVProject(payload));
    if (type === "TSV") dispatch(fetchDownloadTSVProject(payload));
    if (type === "JSON") dispatch(fetchDownloadJSONProject(payload));

    setSnackbarInfo({
      open: true,
      message: "📧 Export will be sent to your registered email",
      variant: "success",
    });

    handleClose();
  };

  
  const renderSnackBar = () => (
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

  
  return (
    <div>
      {renderSnackBar()}

      <Button
        sx={{ inlineSize: "max-content", borderRadius: 3, width: "100%" }}
        variant="contained"
        disabled={
          taskStatus.length > 0 &&
          userRole.WorkspaceManager !== loggedInUserData?.role
            ? false
            : true
        }
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Email Project Export
      </Button>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          disabled={loading}
          onClick={() => triggerEmailExport("CSV")}
        >
          Email CSV
        </MenuItem>

        <MenuItem
          disabled={loading}
          onClick={() => triggerEmailExport("TSV")}
        >
          Email TSV
        </MenuItem>

        <MenuItem
          disabled={loading}
          onClick={() => triggerEmailExport("JSON")}
        >
          Email JSON
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

export default EmailProjectFile;
import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import configs from "../../config/config";

export default function UnassignedReviewSummaryPopup() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Extract project ID from the current URL
  const getProjectIdFromURL = () => {
    try {
      const urlPart = window.location.hash || window.location.pathname;
      const match = urlPart.match(/projects\/(\d+)/);
      if (match && match[1]) return match[1];
      return null;
    } catch (e) {
      console.error("Error getting projectId from URL:", e);
      return null;
    }
  };

  const handleClickOpen = async () => {
    const projectId = getProjectIdFromURL();

    if (!projectId) {
      setError("Project ID not found in the URL.");
      setOpen(true);
      return;
    }

    setLoading(true);
    setError("");
    setOpen(true);

    try {
      const token = localStorage.getItem("anudesh_access_token");

      const response = await fetch(
        `${configs.BASE_URL_AUTO}task/unassigned-review-summary/?project_id=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Unassigned Review Summary:", result);

      if (Array.isArray(result) && result.length > 0) {
        setData(result);
      } else if (result && typeof result === "object" && result.data) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch unassigned review summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setData([]);
    setError("");
  };

  return (
    <>
      <Tooltip title="View Unassigned Review Summary">
        <IconButton onClick={handleClickOpen}>
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Unassigned Review Summary</DialogTitle>
        <DialogContent>
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 20 }}
            >
              <CircularProgress />
            </div>
          ) : error ? (
            <div style={{ color: "red", textAlign: "center" }}>{error}</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              No unassigned review tasks found.
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Annotator Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Unassigned Count</strong>
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.annotator_email || "—"}</TableCell>
                    <TableCell>{item.unassigned_count ?? 0}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
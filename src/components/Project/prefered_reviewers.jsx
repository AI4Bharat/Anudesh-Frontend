import React, { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import configs from "../../config/config";

const TasksSupercheckTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Extract projectId from URL (/projects/1011)
  const getProjectIdFromURL = () => {
    const urlPart = window.location.hash || window.location.pathname;
    const match = urlPart.match(/projects\/(\d+)/);
    return match && match[1] ? match[1] : null;
  };

  // ✅ Fetch reviewers with unassigned supercheck tasks
  const fetchMembers = async () => {
    const projectId = getProjectIdFromURL();
    if (!projectId) return alert("❌ Project ID not found in URL.");

    setLoading(true);
    try {
      const token = localStorage.getItem("anudesh_access_token");
      const response = await fetch(
        `${configs.BASE_URL_AUTO}task/unassigned-supercheck-summary/?project_id=${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log("📦 Supercheck API Response:", result);
      setMembers(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Error fetching reviewers:", error);
      alert("Failed to load reviewers list.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open dialog and fetch data
  const handleOpen = () => {
    setOpenDialog(true);
    fetchMembers();
  };

  const handleClose = () => setOpenDialog(false);

  // ✅ Checkbox toggle
  const handleCheckboxChange = (id) => {
    setSelectedReviewers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Save preferred reviewers
  const handleSave = async () => {
    const projectId = getProjectIdFromURL();
    if (!projectId) return alert("❌ Project ID not found.");

    const token = localStorage.getItem("anudesh_access_token");
    const endpoint = `${configs.BASE_URL_AUTO}users/account/save-preferred-reviewers/`;

    const bodyData = {
      project_id: projectId,
      reviewer_ids: selectedReviewers,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      console.log("✅ Save response:", result);
      alert(result?.message || "Preferred reviewers saved successfully!");
      handleClose();
    } catch (error) {
      console.error("Error saving preferred reviewers:", error);
      alert("Failed to save preferred reviewers.");
    }
  };

  return (
    <div>
      {/* 👥 Person Icon button */}
      <div className="flex items-center justify-between mb-3">
        <Tooltip title="Unassigned Reviewer's Task Summary">
          <IconButton color="primary" onClick={handleOpen}>
            <PeopleAltIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* 💬 Dialog Box */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Unassigned Reviewer's Summary</DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "auto" }} />
          ) : members.length === 0 ? (
            <div style={{ textAlign: "center" }}>No reviewers found.</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Reviewer Email</TableCell>
                  <TableCell>Unassigned Tasks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((m, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedReviewers.includes(m.reviewer_id)}
                        onChange={() => handleCheckboxChange(m.reviewer_id)}
                      />
                    </TableCell>
                    <TableCell>{m.reviewer_email || "—"}</TableCell>
                    <TableCell>{m.unassigned_count ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Preferred Reviewers
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TasksSupercheckTable;
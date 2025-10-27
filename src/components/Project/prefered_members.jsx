import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import configs from "../../config/config";

const ReviewTasksTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [annotatorSelection, setAnnotatorSelection] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Extract projectId from URL (/projects/1011)
  const getProjectIdFromURL = () => {
    const urlPart = window.location.hash || window.location.pathname;
    const match = urlPart.match(/projects\/(\d+)/);
    return match && match[1] ? match[1] : null;
  };

  // ✅ Fetch annotators data
  const fetchMembers = async () => {
    const projectId = getProjectIdFromURL();
    if (!projectId) return alert("❌ Project ID not found in URL.");
    setLoading(true);
    try {
      const token = localStorage.getItem("anudesh_access_token");
      const response = await fetch(
        `${configs.BASE_URL_AUTO}/task/unassigned-review-summary/?project_id=${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      const result = await response.json();
      console.log("📦 API Response:", result);
      setMembers(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      alert("Failed to load annotators list.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpenDialog(true);
    fetchMembers();
  };

  const handleClose = () => setOpenDialog(false);

  // ✅ Checkbox toggle
  const handleCheckboxChange = (id) => {
    setAnnotatorSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Save preferred annotators
  const handleSave = async () => {
    const projectId = getProjectIdFromURL();
    if (!projectId) return alert("❌ Project ID not found.");
    const token = localStorage.getItem("anudesh_access_token");
    const endpoint = `${configs.BASE_URL_AUTO}/users/account/save-preferred-annotators/`;
    const bodyData = {
      project_id: projectId,
      annotator_ids: annotatorSelection,
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
      alert(result?.message || "Preferred annotators saved successfully!");
      handleClose();
    } catch (error) {
      console.error("Error saving preferred annotators:", error);
      alert("Failed to save preferred annotators.");
    }
  };

  return (
    <div>
      {/* 👥 People Icon trigger */}
      <div className="flex items-center justify-between mb-3">
        <Tooltip title="Unassigned Annotator's Task Summary">
          <IconButton color="primary" onClick={handleOpen}>
            <PeopleAltIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* 💬 Dialog Box */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Unassigned Annotator's Task Summary</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "auto" }} />
          ) : members.length === 0 ? (
            <div style={{ textAlign: "center" }}>No annotators found.</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Annotator</TableCell>
                  <TableCell>
                      {m.annotator_username ? m.annotator_username : (m.annotator_email || "—")}
                    </TableCell>
                  <TableCell>Unassigned Tasks</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {members.map((m, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={annotatorSelection.includes(m.annotator_id)}
                        onChange={() => handleCheckboxChange(m.annotator_id)}
                      />
                    </TableCell>
                    <TableCell>
                      {m.annotator_username || m.annotator_email || "—"}
                    </TableCell>
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
            Save Preferred Annotators
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewTasksTable;

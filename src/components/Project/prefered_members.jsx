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
import { useTheme } from "@/context/ThemeContext";

const ReviewTasksTable = () => {
  const { dark } = useTheme();
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

  // Fetch existing preferred annotators from user profile
  const fetchExistingPreferences = async () => {
    try {
      const token = localStorage.getItem("anudesh_access_token");
      const response = await fetch(
        `${configs.BASE_URL_AUTO}/users/account/me/fetch/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      if (!response.ok) return null;
      const userData = await response.json();
      const projectId = getProjectIdFromURL();
      const projectPrefs = userData?.preferred_task_by_json?.preferred_annotators;
      // If this projectId has never been saved, treat as "no prefs"
      if (!projectPrefs || !(String(projectId) in projectPrefs)) return null;
      const ids = projectPrefs[String(projectId)] || [];
      console.log(" Existing preferred annotators:", ids);
      return { ids, savedBefore: true };
    } catch (error) {
      console.error("Error fetching existing preferences:", error);
      return null;
    }
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
      const membersData = Array.isArray(result) ? result : result.data || [];
      setMembers(membersData);
      return membersData;
    } catch (error) {
      console.error("Error fetching members:", error);
      alert("Failed to load annotators list.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpenDialog(true);
    const projectId = getProjectIdFromURL();
    if (!projectId) return alert("❌ Project ID not found in URL.");

    const [membersResult, existingPrefs] = await Promise.all([
      fetchMembers(),
      fetchExistingPreferences(),
    ]);

    const allCurrentIds = (membersResult || []).map((m) => m.annotator_id);

    if (!existingPrefs || !existingPrefs.savedBefore) {
      // First time: select all and auto-save
      setAnnotatorSelection(allCurrentIds);
      if (allCurrentIds.length > 0) {
        const token = localStorage.getItem("anudesh_access_token");
        try {
          await fetch(
            `${configs.BASE_URL_AUTO}/users/account/save-preferred-annotators/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${token}`,
              },
              body: JSON.stringify({
                project_id: projectId,
                annotator_ids: allCurrentIds,
              }),
            }
          );
          window.dispatchEvent(new Event("preferredAnnotatorsUpdated"));
        } catch (_) { }
      }
      return;
    }

    // Restore saved prefs
    const savedIds = existingPrefs.ids;
    const validSavedIds = savedIds.filter((id) => allCurrentIds.includes(id));
    setAnnotatorSelection(validSavedIds);
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
      window.dispatchEvent(new Event("preferredAnnotatorsUpdated"));
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
<Dialog
  open={openDialog}
  onClose={handleClose}
  fullWidth
  maxWidth="sm"
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: dark ? "#2a2a2a" : "",
      color: dark ? "#ececec" : "",
      border: dark ? "1px solid #3a3a3a" : "",
    }
  }}
>
  <DialogTitle
    sx={{ color: dark ? "#ececec" : "" }}
  >
    Unassigned Annotator's Task Summary
  </DialogTitle>

  <DialogContent
    dividers
    sx={{
      backgroundColor: dark ? "#2a2a2a" : ""
    }}
  >
          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "auto" }} />
          ) : members.length === 0 ? (
            <div style={{ textAlign: "center", color: dark ? "#a0a0a0" : "" }}>No annotators found.</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ "& .MuiTableCell-head": { backgroundColor: dark ? "#252525" : "", color: dark ? "#ececec" : "", borderBottom: dark ? "2px solid #3a3a3a" : "" } }}>
                  <TableCell>
                    <Tooltip title="Select/Deselect All">
                      <Checkbox
                        checked={
                          members.length > 0 &&
                          members.every((m) => annotatorSelection.includes(m.annotator_id))
                        }
                        indeterminate={
                          members.some((m) => annotatorSelection.includes(m.annotator_id)) &&
                          !members.every((m) => annotatorSelection.includes(m.annotator_id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAnnotatorSelection(members.map((m) => m.annotator_id));
                          } else {
                            setAnnotatorSelection([]);
                          }
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>Annotator</TableCell>
                  <TableCell>Unassigned Tasks</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
               {members.map((m, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ "& .MuiTableCell-body": { color: dark ? "#d0d0d0" : "", borderBottom: dark ? "1px solid #2e2e2e" : "" }, "&:hover": { backgroundColor: dark ? "rgba(251, 146, 60, 0.08)" : "" } }}
                  >
                      <TableCell>
                        <Checkbox
                          checked={annotatorSelection.includes(m.annotator_id)}
                          onChange={() => handleCheckboxChange(m.annotator_id)}
                        />
                      </TableCell>
                      <TableCell>{m.annotator_username ? m.annotator_username : (m.annotator_email || "—")}</TableCell>
                      <TableCell>{m.unassigned_count ?? 0}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions sx={{ backgroundColor: dark ? "#2a2a2a" : "", borderTop: dark ? "1px solid #3a3a3a" : "" }}>
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

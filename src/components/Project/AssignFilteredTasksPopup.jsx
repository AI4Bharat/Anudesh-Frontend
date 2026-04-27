import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
  Tooltip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import configs from "../../config/config";
import { useTheme } from "@/context/ThemeContext";

export default function AssignFilteredTasksPopup() {
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnnotators, setSelectedAnnotators] = useState([]);
  const [numTasks, setNumTasks] = useState(5); // ✅ Default to 5

  // ✅ Extract project ID from URL
  const getProjectIdFromURL = () => {
    try {
      const urlPart = window.location.hash || window.location.pathname;
      const match = urlPart.match(/projects\/(\d+)/);
      return match && match[1] ? match[1] : null;
    } catch (e) {
      console.error("Error getting projectId from URL:", e);
      return null;
    }
  };

  // ✅ Fetch unassigned review summary data
  const handleClickOpen = async () => {
    const projectId = getProjectIdFromURL();
    if (!projectId) {
      setError("Project ID not found in the URL.");
      setOpen(true);
      return;
    }

    setOpen(true);
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("anudesh_access_token");
      const response = await fetch(
        `${configs.BASE_URL_AUTO}task/unassigned-review-summary/?project_id=${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );

      const result = await response.json();
      const parsedData = Array.isArray(result)
        ? result
        : result.data || [];

      setData(parsedData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch unassigned review summary.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Close popup
  const handleClose = () => {
    setOpen(false);
    setData([]);
    setError("");
    setSelectedAnnotators([]);
  };

  // ✅ Handle checkbox toggle
  const handleAnnotatorToggle = (userId) => {
    setSelectedAnnotators((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // ✅ Assign selected annotator tasks
  const handleAssignTasks = async () => {
    const projectId = getProjectIdFromURL();
    if (!projectId) {
      alert("Project ID not found.");
      return;
    }
    if (selectedAnnotators.length === 0) {
      alert("Please select at least one annotator before assigning tasks.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("anudesh_access_token");
      const response = await fetch(
        `${configs.BASE_URL_AUTO}projects/${projectId}/assign_new_review_tasks/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({
            user_ids: selectedAnnotators,
            num_tasks: numTasks, // ✅ user-selected value
          }),
        }
      );

      const result = await response.json();
      console.log("Assign tasks response:", result);
      alert(result?.message || "Tasks assigned successfully!");
      handleClose();
    } catch (err) {
      console.error("Error assigning tasks:", err);
      alert("Failed to assign tasks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Assign Filtered Tasks">
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ p: 1, borderRadius: 2 }}
          >
            Assign Filtered Tasks 
          </Button>
        </Box>
      </Tooltip>

      <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      backgroundColor: dark ? "#2a2a2a" : "",
      color: dark ? "#ececec" : "",
      border: dark ? "1px solid #3a3a3a" : "",
    }
  }}
>
  <DialogTitle sx={{ color: dark ? "#ececec" : "", backgroundColor: dark ? "#2a2a2a" : "" }}>Assign Filtered Tasks</DialogTitle>
  <DialogContent sx={{ backgroundColor: dark ? "#2a2a2a" : "" }}>
          {loading ? (
            <CircularProgress style={{ display: "block", margin: "auto" }} />
          ) : error ? (
            <div style={{ color: "red", textAlign: "center" }}>{error}</div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: "center", color: dark ? "#a0a0a0" : "" }}>
              No unassigned review tasks found.
            </div>
          ) : (
            <>
              <Table>
              <TableHead>
                <TableRow sx={{ "& .MuiTableCell-head": { backgroundColor: dark ? "#252525" : "", color: dark ? "#ececec" : "", borderBottom: dark ? "2px solid #3a3a3a" : "" } }}>
                  <TableCell>Select</TableCell>
                  <TableCell>Annotator Email</TableCell>
                  <TableCell>Unassigned Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index} sx={{ "& .MuiTableCell-body": { color: dark ? "#d0d0d0" : "", borderBottom: dark ? "1px solid #2e2e2e" : "" }, "&:hover": { backgroundColor: dark ? "rgba(251, 146, 60, 0.08)" : "" } }}>
                    <TableCell>
                        <Checkbox
                          checked={selectedAnnotators.includes(item.annotator_id)}
                          onChange={() =>
                            handleAnnotatorToggle(item.annotator_id)
                          }
                        />
                      </TableCell>
                      <TableCell>{item.annotator_email || "—"}</TableCell>
                      <TableCell>{item.unassigned_count ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* ✅ Task count selector */}
              <FormControl sx={{ mt: 2, minWidth: 150, "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
                <InputLabel id="num-tasks-label" sx={{ color: dark ? "#a0a0a0" : "" }}>Number of Tasks</InputLabel>
                <Select
                  labelId="num-tasks-label"
                  value={numTasks}
                  label="Number of Tasks"
                  onChange={(e) => setNumTasks(e.target.value)}
                  sx={{ color: dark ? "#ececec" : "", backgroundColor: dark ? "#1e1e1e" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
                  MenuProps={{ PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignTasks}
                sx={{ mt: 2, ml: 2 }}
                disabled={selectedAnnotators.length === 0 || loading}
              >
                {loading ? "Assigning..." : "Assign Selected Tasks"}
              </Button>
            </>
          )}
        </DialogContent>

       <DialogActions sx={{ backgroundColor: dark ? "#2a2a2a" : "", borderTop: dark ? "1px solid #3a3a3a" : "" }}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
} from '@mui/material';
import axios from 'axios';

const AssignMembersDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState({
    project_ids: [],
    user_emails: '',
    user_role: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      user_emails: formData.user_emails
        .split(',')
        .map((email) => email.trim()),
      user_role: formData.user_role,
      project_ids: formData.project_ids.map((id) => parseInt(id.trim())),
    };

    setLoading(true);

    try {
      const res = await axios.post('/assign_members_to_projects/', payload);
      setResponseMessage(res.data.message || 'Users assigned successfully');
      handleClose();
    } catch (err) {
      setResponseMessage(
        err.response?.data?.message || 'Error assigning users'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#ee6633',
            color: '#fff',
            width: '100%',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#ee6633',
            },
          }}
        >
          Assign Members to Projects
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Members</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="project_ids"
                label="Project IDs (comma-separated) *"
                variant="outlined"
                margin="dense"
                value={formData.project_ids.join(',')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    project_ids: e.target.value
                      .split(',')
                      .map((id) => id.trim()),
                  }))
                }
                required
              />

              <TextField
                fullWidth
                name="user_emails"
                label="User Emails (comma-separated) *"
                variant="outlined"
                margin="dense"
                value={formData.user_emails}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                select
                name="user_role"
                label="Role *"
                variant="outlined"
                margin="dense"
                value={formData.user_role}
                onChange={handleChange}
                required
              >
                <MenuItem value="annotator">Annotator</MenuItem>
                <MenuItem value="reviewer">Reviewer</MenuItem>
                <MenuItem value="super_checker">Superchecker</MenuItem>
              </TextField>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#ee6633', color: '#fff' }}
            disabled={loading}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignMembersDialog;
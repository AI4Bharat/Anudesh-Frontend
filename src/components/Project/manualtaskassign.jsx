import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AllocateTasksDialog = ({ userRole, loggedInUserData, ProjectDetails }) => {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: id || '',  // ✅ directly initialized here
    taskIDs: '',
    userID: '',
    allocation_type: '',
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        taskIDs: formData.taskIDs.split(',').map((id) => id.trim()),
        allocation_type: parseInt(formData.allocation_type),
      };

      const response = await axios.post('/projects/allocate_tasks', payload);
      setResponseMessage(response.data.message || 'Tasks allocated successfully');
      handleClose();
    } catch (error) {
      setResponseMessage(error.response?.data?.error || 'Error allocating tasks');
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
              p: 2,
              borderRadius: 2,
              ml: 2,
              width: '300px',
              textTransform: 'none',
              fontWeight: 'bold',
              mb: 2,
              '&:hover': {
                backgroundColor: '#ee6633',
              },
            }}
            
          >
            Allocate Tasks
          </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Allocate Tasks</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {/* <TextField
              fullWidth
              name="project_id"
              label="Project ID"
              variant="outlined"
              margin="dense"
              value={formData.id || id}
              disabled
            /> */}
            <TextField
              fullWidth
              name="taskIDs"
              label="Task IDs (comma-separated) *"
              variant="outlined"
              margin="dense"
              value={formData.taskIDs}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              name="userID"
              label="User ID *"
              variant="outlined"
              margin="dense"
              value={formData.userID}
              onChange={handleChange}
              required
            />
            <TextField
              select
              fullWidth
              name="allocation_type"
              label="Allocation Type *"
              variant="outlined"
              margin="dense"
              value={formData.allocation_type}
              onChange={handleChange}
              required
            >
              <MenuItem value={1}>Annotation</MenuItem>
              <MenuItem value={2}>Review</MenuItem>
              <MenuItem value={3}>Supercheck</MenuItem>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#ee6633', color: '#fff' }}>
            Allocate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllocateTasksDialog;
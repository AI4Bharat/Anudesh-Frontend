import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CustomButton from "@/components/common/Button";
import { ACTIVE_LLM_MODELS } from "@/app/new-project/models";

const UpdateInactiveModelsDialog = ({ open, handleClose, projectId, setSnackbarInfo }) => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleUpdateClick = () => {
        if (!selectedModel) {
            setSnackbarInfo({
                open: true,
                message: "Please select a model.",
                variant: "error",
            });
            return;
        }
        setConfirmOpen(true);
    };

    const proceedWithUpdate = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${projectId}/update_idc_tasks_model/`, {
                method: "POST",
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${localStorage.getItem('anudesh_access_token')}`
                },
                body: JSON.stringify({ new_model: selectedModel }),
            });
            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                setSnackbarInfo({
                    open: true,
                    message: data.message || "Tasks successfully updated",
                    variant: "success",
                });
                handleClose();
            } else {
                setSnackbarInfo({
                    open: true,
                    message: data.message || data.detail || "Update failed",
                    variant: "error",
                });
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            setSnackbarInfo({
                open: true,
                message: "An error occurred while updating the tasks",
                variant: "error",
            });
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Bulk Update Models for Unlabeled Tasks</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Select an active model to replace inactive models in all unlabeled tasks for this project.
                    </DialogContentText>
                    <Autocomplete
                        options={ACTIVE_LLM_MODELS}
                        value={selectedModel}
                        onChange={(event, newValue) => setSelectedModel(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Active Model" variant="outlined" />}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <CustomButton onClick={handleClose} label="Cancel" sx={{ mr: 1 }} />
                    <CustomButton onClick={handleUpdateClick} label={loading ? "Updating..." : "Update"} disabled={loading} />
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <DialogContentText color="error">
                        This action can't be undone. Are you sure you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <CustomButton onClick={() => setConfirmOpen(false)} label="Cancel" sx={{ mr: 1 }} />
                    <CustomButton onClick={proceedWithUpdate} label="Confirm" />
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UpdateInactiveModelsDialog;

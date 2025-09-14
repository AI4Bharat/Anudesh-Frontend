import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Box, IconButton, useTheme, ThemeProvider, createTheme
} from '@mui/material';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#FF6B6B',
        },
        secondary: {
            main: '#FFC107',
        },
        background: {
            default: '#f9f9f9',
            paper: '#ffffff',
        },
        text: {
            primary: '#121212',
            secondary: '#555555',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const CapabilityIcon = ({ active, children }) => (
    <IconButton size="small" sx={{ color: active ? 'text.primary' : 'rgba(255, 255, 255, 0.3)', pointerEvents: 'none' }}>
        {children}
    </IconButton>
);

const ModelSelectorDialog = ({ open, onClose, modelsData, selectedValue, onValueChange }) => {
    const handleSelect = (modelId) => {
        onValueChange(modelId);
        onClose();
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        maxHeight: '600px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                <DialogContent dividers sx={{ p: 0 }}>
                    <List>
                        {modelsData.map((group) => (
                            <React.Fragment key={group.provider}>
                                <Typography variant="overline" sx={{ px: 2, pt:1, display: 'block', textAlign: 'center' }}>
                                    {group.provider}
                                </Typography>
                                {group.models.map((model) => (
                                    <ListItemButton
                                        key={model.id}
                                        selected={selectedValue === model.id}
                                        onClick={() => handleSelect(model.id)}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            borderRadius: 2,
                                            mx: 1,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 107, 107, 0.3)',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>{model.icon}</ListItemIcon>
                                        <ListItemText
                                            primary={model.name}
                                            // secondary={model.description}
                                            primaryTypographyProps={{ fontWeight: 'bold' }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CapabilityIcon active={model.capabilities.image}><CameraAltOutlinedIcon fontSize="small" /></CapabilityIcon>
                                            <CapabilityIcon active={model.capabilities.voice}><MicNoneOutlinedIcon fontSize="small" /></CapabilityIcon>
                                            <CapabilityIcon active={model.capabilities.reasoning}><CloudQueueIcon fontSize="small" /></CapabilityIcon>
                                        </Box>
                                    </ListItemButton>
                                ))}
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export default ModelSelectorDialog;

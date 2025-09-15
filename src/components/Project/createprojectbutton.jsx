import React, { useState } from "react";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import configs from "../../config/config";
import UserRolesList from "@/utils/UserMappedByRole/UserRolesList";
import Spinner from "@/components/common/Spinner";


const CreateProjectDropdown = ({ userRole }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const mappedUserRole = typeof userRole === "number" ? UserRolesList[userRole] : userRole;

    if (mappedUserRole !== "Admin" && mappedUserRole !== "OrganizationOwner") {
        return null;
    }

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
        setLoadingWorkspaces(true);

        try {
            // Direct API call instead of GetWorkspaceAPI
            const res = await fetch(`${configs.BASE_URL_AUTO}/workspaces/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${localStorage.getItem('anudesh_access_token')}`
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setWorkspaces(data || []);
        } catch (error) {
            console.error("❌ Error fetching workspaces", error);
            setWorkspaces([]);
        } finally {
            setLoadingWorkspaces(false);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (workspace) => {
        navigate(`/new-project/${workspace.id}`, {
            state: { workspace },
        });
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                sx={{ borderRadius: 2, mb: 2 }}
            >
                Create Project
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {loadingWorkspaces ? (
                    <MenuItem disabled 
                      sx={{
                        justifyContent: 'center',
                        p: 1,
                        opacity: 1,
                        "&.Mui-disabled": {
                            opacity: 1,
                        },
                     }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%", }}>
                            <div style={{all: "unset", transform: "scale(0.4)", }}>
                                <Spinner />
                            </div>
                        </Box>
                    </MenuItem>
                ) : workspaces.length > 0 ? (
                    workspaces.map((ws) => (
                        <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
                            {ws.workspace_name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No workspaces found</MenuItem>
                )}
            </Menu>
        </>
    );
};

export default CreateProjectDropdown;

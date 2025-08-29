// import React, { useState } from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
// import { useSelector } from "react-redux";

// const CreateProjectDropdown = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   // Get workspace data from redux (already fetched in your code)
//   const workspaceData = useSelector((state) => state.GetWorkspace.data);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (workspace) => {
//     console.log("Selected workspace:", workspace);
//     // 👉 Here you can navigate or call API to create project in this workspace
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Button 
//         variant="contained" 
//         color="primary"
//         onClick={handleClick}
//         sx={{ borderRadius: 2, mb: 2 }}
//       >
//         Create Project
//       </Button>

//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//       >
//         {workspaceData?.length > 0 ? (
//           workspaceData.map((ws) => (
//             <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
//               {ws.workspace_name}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No workspaces found</MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// export default CreateProjectDropdown;


// import React, { useState } from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const CreateProjectDropdown = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   // Get workspace data from redux
//   const workspaceData = useSelector((state) => state.GetWorkspace.data);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (workspace) => {
//     // Redirect to project creation page with workspaceId
//     navigate(`/projects/create?workspaceId=${workspace.id}`);
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Button 
//         variant="contained" 
//         color="primary"
//         onClick={handleClick}
//         sx={{ borderRadius: 2, mb: 2 }}
//       >
//         Create Project
//       </Button>

//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//       >
//         {workspaceData?.length > 0 ? (
//           workspaceData.map((ws) => (
//             <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
//               {ws.workspace_name}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No workspaces found</MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// export default CreateProjectDropdown;


// import React, { useState } from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const CreateProjectDropdown = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   // Get workspace data from redux
//   const workspaceData = useSelector((state) => state.GetWorkspace.data);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (workspace) => {
//     // Redirect to /new-project/:id
//     navigate(`/new-project/${workspace.id}`);
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Button 
//         variant="contained" 
//         color="primary"
//         onClick={handleClick}
//         sx={{ borderRadius: 2, mb: 2 }}
//       >
//         Create Project
//       </Button>

//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//       >
//         {workspaceData?.length > 0 ? (
//           workspaceData.map((ws) => (
//             <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
//               {ws.workspace_name}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No workspaces found</MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// export default CreateProjectDropdown;


// import React, { useState } from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import GetWorkspaceAPI from "@/app/actions/api/workspace/GetWorkspaceData";

// const CreateProjectDropdown = ({ workspaceData }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = async (workspace) => {
//     try {
//       // Hit the API to get latest workspace details
//       const apiObj = new GetWorkspaceAPI();
//       const response = await apiObj.call(); // assuming API class has call() method
//       const allWorkspaces = apiObj.getPayload();

//       // Find selected workspace details
//       const selected = allWorkspaces.find((w) => w.id === workspace.id);

//       // Redirect with state (workspace details)
//       navigate(`/new-project/${workspace.id}`, {
//         state: { workspace: selected },
//       });
//     } catch (error) {
//       console.error("Error fetching workspace details", error);
//     } finally {
//       setAnchorEl(null);
//     }
//   };

//   return (
//     <>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleClick}
//         sx={{ borderRadius: 2, mb: 2 }}
//       >
//         Create Project
//       </Button>

//       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//         {workspaceData?.length > 0 ? (
//           workspaceData.map((ws) => (
//             <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
//               {ws.workspace_name}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No workspaces found</MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// export default CreateProjectDropdown;



// import React, { useState } from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import GetWorkspaceAPI from "@/app/actions/api/workspace/GetWorkspaceData";

// const CreateProjectDropdown = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [workspaces, setWorkspaces] = useState([]);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   const handleClick = async (event) => {
//     setAnchorEl(event.currentTarget);

//     try {
//       // call API to fetch workspaces
//       const apiObj = new GetWorkspaceAPI();
//       const response = await apiObj.call(); // your API class should expose .call()
//       const allWorkspaces = apiObj.getPayload();
//       setWorkspaces(allWorkspaces || []);
//     } catch (error) {
//       console.error("❌ Error fetching workspaces", error);
//     }
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (workspace) => {
//     navigate(`/new-project/${workspace.id}`, {
//       state: { workspace },
//     });
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleClick}
//         sx={{ borderRadius: 2, mb: 2 }}
//       >
//         Create Project
//       </Button>

//       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//         {workspaces.length > 0 ? (
//           workspaces.map((ws) => (
//             <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
//               {ws.workspace_name}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No workspaces found</MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// export default CreateProjectDropdown;


import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateProjectDropdown = ({ workspaceData }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);

        try {
            // Direct API call instead of GetWorkspaceAPI
            const res = await fetch("http://127.0.0.1:8000/workspaces/", {
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
                {workspaces.length > 0 ? (
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

// import React, { useState, useEffect } from "react";
// import {
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   CircularProgress,
// } from "@mui/material";
// import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // 👈 icon for annotator selection
// import axios from "axios";
// import configs from "../../config/config"; // your API base URL

// const ReviewTasksTable = () => {
//   const [openAnnotatorDialog, setOpenAnnotatorDialog] = useState(false);
//   const [annotators, setAnnotators] = useState([]);
//   const [selectedAnnotators, setSelectedAnnotators] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🧠 Fetch available annotators + default preferred annotators
//   useEffect(() => {
//     const fetchAnnotators = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${configs.BASE_URL}/users/annotators_list/`);
//         const userRes = await axios.get(`${configs.BASE_URL}/users/me/`);
//         const preferred = userRes.data.preferred_task_by_json?.preferred_annotators || [];

//         setAnnotators(res.data);
//         setSelectedAnnotators(preferred);
//       } catch (err) {
//         console.error("Error fetching annotators:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAnnotators();
//   }, []);

//   const handleCheckboxChange = (id) => {
//     if (selectedAnnotators.includes(id)) {
//       setSelectedAnnotators(selectedAnnotators.filter((x) => x !== id));
//     } else {
//       setSelectedAnnotators([...selectedAnnotators, id]);
//     }
//   };

//   const handleSaveAnnotators = () => {
//     setOpenAnnotatorDialog(false);
//     console.log("✅ Selected annotators:", selectedAnnotators);

//     // You can persist it to backend:
//     // axios.patch(`${configs.BASE_URL}/users/me/`, {
//     //   preferred_task_by_json: { preferred_annotators: selectedAnnotators },
//     // });
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-xl font-semibold">Review Tasks</h2>
//         <Tooltip title="Select Annotators">
//           <IconButton color="primary" onClick={() => setOpenAnnotatorDialog(true)}>
//             <PeopleAltIcon />
//           </IconButton>
//         </Tooltip>
//       </div>

//       {/* ✅ Annotator Selection Dialog */}
//       <Dialog
//         open={openAnnotatorDialog}
//         onClose={() => setOpenAnnotatorDialog(false)}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>Select Annotators</DialogTitle>
//         <DialogContent dividers>
//           {loading ? (
//             <CircularProgress size={24} />
//           ) : (
//             annotators.map((annotator) => (
//               <FormControlLabel
//                 key={annotator.id}
//                 control={
//                   <Checkbox
//                     checked={selectedAnnotators.includes(annotator.id)}
//                     onChange={() => handleCheckboxChange(annotator.id)}
//                   />
//                 }
//                 label={`${annotator.full_name} (${annotator.email})`}
//               />
//             ))
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenAnnotatorDialog(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSaveAnnotators}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* 🧱 Your existing review task table component would go here */}
//     </div>
//   );
// };

// export default ReviewTasksTable;


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
  FormControlLabel,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // 👥 icon for annotator selection

const ReviewTasksTable = () => {
  const [openAnnotatorDialog, setOpenAnnotatorDialog] = useState(false);

  // 🧩 Dummy annotators list
  const annotators = [
    { id: 1, full_name: "Amit Sharma", email: "amit@example.com" },
    { id: 2, full_name: "Priya Verma", email: "priya@example.com" },
    { id: 3, full_name: "Ravi Mehta", email: "ravi@example.com" },
    { id: 4, full_name: "Neha Singh", email: "neha@example.com" },
  ];

  // 🎯 Dummy preferred annotators (default selected)
  const [selectedAnnotators, setSelectedAnnotators] = useState([1, 3]);

  // ✅ Toggle selection
  const handleCheckboxChange = (id) => {
    setSelectedAnnotators((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ On save
  const handleSaveAnnotators = () => {
    setOpenAnnotatorDialog(false);
    console.log("✅ Selected annotators:", selectedAnnotators);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {/* <h2 className="text-xl font-semibold">Review Tasks</h2> */}

        {/* 👥 Annotator selection icon */}
        <Tooltip title="Select Annotators">
          <IconButton color="primary" onClick={() => setOpenAnnotatorDialog(true)}>
            <PeopleAltIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* ✅ Annotator Selection Dialog */}
      <Dialog
        open={openAnnotatorDialog}
        onClose={() => setOpenAnnotatorDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select Annotators</DialogTitle>
        <DialogContent dividers>
          {annotators.map((annotator) => (
            <FormControlLabel
              key={annotator.id}
              control={
                <Checkbox
                  checked={selectedAnnotators.includes(annotator.id)}
                  onChange={() => handleCheckboxChange(annotator.id)}
                />
              }
              label={`${annotator.full_name} (${annotator.email})`}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnnotatorDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAnnotators}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🧱 Placeholder for your existing review tasks table */}
      {/* <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
        <p>📋 Review tasks table will appear here.</p>
      </div> */}
    </div>
  );
};

export default ReviewTasksTable;

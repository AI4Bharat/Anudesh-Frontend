import React from "react";
import WorkspaceTable from "./WorkspaceTable";

const Workspaces = () => {
    
    return(
        <WorkspaceTable 
          showManager={true} 
          showCreatedBy={true} 
        />
    )
}

export default Workspaces;
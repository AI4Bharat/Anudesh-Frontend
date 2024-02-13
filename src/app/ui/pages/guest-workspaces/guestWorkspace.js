import React from "react";
import GuestWorkspaceTable from "@/components/GuestWorkspace/GuestWorkspaceTable";

const GuestWorkspaces = () => {
    
    return(
        <GuestWorkspaceTable 
          showManager={true} 
          showCreatedBy={true} 
        />
    )
}

export default GuestWorkspaces;
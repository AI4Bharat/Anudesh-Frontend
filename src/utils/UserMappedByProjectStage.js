import { Typography } from "@mui/material"

const UserMappedByProjectStage = (roleId) => {
    if(roleId == 1){
        return {id: roleId, name : "Annotation", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(0, 102, 51  ,0.2)", color:"rgb(0, 102, 51)", borderRadius : 2, fontWeight: 600 }}>Annotation</Typography>}
    } else if(roleId == 2){
        return {id: roleId, name : "Review", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(204, 0, 0  ,0.2)", color:"rgb(204, 0, 0)", borderRadius : 2, fontWeight: 600 }}>Review</Typography>}
    } else if(roleId == 3){
        return {id: roleId, name : "Supercheck", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(204, 204, 0  ,0.1)", color:"rgb(0, 153, 0)", borderRadius : 2, fontWeight: 600 }}>Supercheck</Typography>}
    }

}

export default UserMappedByProjectStage;

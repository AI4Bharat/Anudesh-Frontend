import * as React from 'react';
import { useTheme } from "@/context/ThemeContext";
import Typography from '@mui/material/Typography';
import  Grid  from '@mui/material/Grid';
import { Link } from 'react-router-dom';

const DatasetCard = (props) => {
const { dark } = useTheme();
    const { datasetObj } = props
    console.log(datasetObj.instance_id);
    return (
        <Link to={`/datasets/${datasetObj.instance_id}`} style={{ textDecoration: "none" }}>
            <Grid
                elevation={2}
                className={props.classAssigned}
                sx={{
                    minHeight: 225,
                    cursor: "pointer",
                    borderRadius: 5,
                    p: 2,
                    backgroundColor: dark ? "#2a2a2a" : "",
                    border: dark ? "1px solid #3a3a3a" : "",
                    transition: "all 0.2s ease",
                    "&:hover": dark ? { border: "1px solid #fb923c", boxShadow: "0 2px 12px rgba(251,146,60,0.15)" } : {},
                }}
                >
                <Typography
  variant="h5"
  sx={{ mt: 4, textAlign: "center", color: dark ? "#ececec" : "secondary.contrastText", backgroundColor: dark ? "#3a3a3a" : "primary.contrastText", borderRadius: 3, pt: 1, pb: 1, fontSize:"1.125rem"}}
>{datasetObj.instance_name}
</Typography>
                <Grid
                    container
                    direction="row"
                    justifyContent={"space-around"}
                    sx={{mt:1, mb:2}}
                    spacing={3}
                    columnSpacing={{xs: 10, sm: 10, md: 10}}
                >
                    <Grid
                        item
                    >
                        <Typography variant="lightText">Type</Typography>
                        <Typography variant="body2" sx={{ color: "primary.contrastText", mt : 0.5, fontWeight : "500" }}>{datasetObj.dataset_type}</Typography>
                    </Grid>
                    <Grid
                        item
                    >
                        <Typography variant="lightText" sx={{ color: dark ? "#a0a0a0" : "" }}>Dataset ID</Typography>
<Typography variant="body2" sx={{ color: dark ? "#ececec" : "primary.contrastText", mt : 0.5, fontWeight : "500"}}>{datasetObj.instance_id}</Typography>
                    </Grid>
                </Grid>
                
                {/* <Typography variant="lightText">Description</Typography>
                <Typography variant="body2" sx={{ color: "primary.contrastText" }}>{datasetObj.instance_description}</Typography> */}

                {/* <Typography variant="body2" sx={{ mt: 2, ml: 5, color: "primary.contrastText" }}>{datasetObj.instance_description}</Typography> */}
                {/* <Divider sx={{ mt: 7 }} variant="inset" /> */}

            </Grid>
        </Link>
    )
}

export default DatasetCard;
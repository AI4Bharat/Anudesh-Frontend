
import DatasetStyle from "@/styles/dataset";
import {

    ThemeProvider
} from '@mui/material';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ImageArray from '@/utils/getModelIcons';
import React from "react";
import themeDefault from "@/themes/theme";
import { useTheme } from "@/context/ThemeContext";

const DatasetDescription = (props) => {
      /* eslint-disable react-hooks/exhaustive-deps */

    const { name, value, index } = props;

    // const history = useHistory();

    const classes = DatasetStyle();
    const { dark } = useTheme();
    return (
        <ThemeProvider theme={themeDefault}>

<Card style={{ minHeight: '100px', maxHeight: '100px', backgroundColor: dark ? "#2a2a2a" : ImageArray[index].color, display: 'flex', border: dark ? "1px solid #3a3a3a" : "" }}>   
             <Grid container >
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={{ display: 'flex', marginTop: "21px", justifyContent: 'center', }}>
                    <div className={classes.descCardIcon} style={{ color: dark ? "#fb923c" : ImageArray[index].iconColor, backgroundColor: dark ? "#2a2a2a" : ImageArray[index].color }}>
                        {ImageArray[index].imageUrl}
                    </div>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9} style={{ display: 'flex', marginTop: "5px" }} >
                    <CardContent>
                        <Typography component="div" variant="subtitle2" style={{ marginBottom: '0px', paddingLeft: "0px", fontFamily: "Rowdies", fontWeight: "bold", color: dark ? "#a0a0a0" : "" }}>
                        {name}
                        </Typography>
                        <Typography variant="body2" color={dark ? "#ececec" : "black"} className={classes.modelValue}>
                        {value}
                        </Typography> 
                    </CardContent>
                    {/* </Box> */}
                </Grid>
            </Grid>
        </Card>
        </ThemeProvider>
    )
}
export default DatasetDescription;
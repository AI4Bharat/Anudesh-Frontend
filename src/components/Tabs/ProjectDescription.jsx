
import  "../../styles/Dataset.css";
import {
    Grid,
    Link,
    Typography,
    Card,
    Box,
    CardMedia,
    CardContent,
    ThemeProvider
} from '@mui/material';
import ImageArray from '../../utils/getModelIcons';
import React, { useEffect, useState } from "react";
import tableTheme from "../../themes/tableTheme";
import themeDefault from "../../themes/theme";

const ProjectDescription = (props) => {
    const { name, value, index } = props;

    // const history = useHistory();

    
    return (
        <ThemeProvider theme={themeDefault}>

<Card  style={{ minHeight: '100px', maxHeight: '100px', backgroundColor: ImageArray[index].color ,display: 'flex'}}>
            <Grid container >
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={{ display: 'flex', marginTop: "21px", justifyContent: 'center', }}>
                    <div className="descCardIcon" style={{  color: ImageArray[index].iconColor, backgroundColor: ImageArray[index].color }}>
                        {ImageArray[index].imageUrl}
                    </div>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9} style={{ display: 'flex', marginTop: "5px" }} >
                    <CardContent>
                        <Typography component="div" variant="subtitle2" style={{ marginBottom: '0px' ,paddingLeft:"0px", fontFamily:'Rowdies', fontWeight: "bold" }} >
                            {name}
                        </Typography  >
                            <Typography variant="body2" color="black" className="modelValue" fontFamily="Roboto, sans-serif">
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
export default ProjectDescription;
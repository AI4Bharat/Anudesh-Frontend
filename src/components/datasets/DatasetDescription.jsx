
import DatasetStyle from "@/styles/dataset";
import { useHistory, useParams } from 'react-router';
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
import ImageArray from '@/utils/getModelIcons';
import React, { useEffect, useState } from "react";
import tableTheme from "@/themes/tableTheme";
import themeDefault from "@/themes/theme";

const DatasetDescription = (props) => {
      /* eslint-disable react-hooks/exhaustive-deps */

    const { name, value, index } = props;

    // const history = useHistory();

    const classes = DatasetStyle();
    return (
        <ThemeProvider theme={themeDefault}>

<Card  style={{ minHeight: '100px', maxHeight: '100px',backgroundColor: ImageArray[index].color ,display: 'flex'}}>
            <Grid container >
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={{ display: 'flex', marginTop: "21px", justifyContent: 'center', }}>
                    <div className={classes.descCardIcon} style={{  color: ImageArray[index].iconColor, backgroundColor: ImageArray[index].color }}>
                        {ImageArray[index].imageUrl}
                    </div>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9} style={{ display: 'flex', marginTop: "5px" }} >
                    <CardContent>
                        <Typography component="div" variant="subtitle2" style={{ marginBottom: '0px' ,paddingLeft:"0px", fontFamily: "Roboto, sans-serif", fontWeight: "bold" }} >
                            {name}
                        </Typography  >
                            <Typography variant="body2" color="black" className={classes.modelValue} >
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
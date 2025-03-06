import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

const ResponsiveChartContainer = (props) => {
    const matches = useMediaQuery('only screen and (max-width: 700px)');
    
    if (matches) {
        return <Box style={{ overflowX: "scroll" }}>
            {props.children}
        </Box>
    } else {
        return <ResponsiveContainer width={"100%"} height={600}>
            {props.children}
        </ResponsiveContainer>
    }
}

export default ResponsiveChartContainer;
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

const ResponsiveChartContainer = (props) => {
    const isMobile = useMediaQuery('(max-width: 700px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    
    // Scale height down on smaller screens so the chart doesn't take up the whole viewport vertically
    const chartHeight = isMobile ? 380 : isTablet ? 450 : 550;
    
    if (isMobile) {
        return (
            <Box sx={{ overflowX: "auto", width: "100%", pb: 1, mt: 2 }}>
                <Box sx={{ minWidth: "600px", height: chartHeight }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {props.children}
                    </ResponsiveContainer>
                </Box>
            </Box>
        );
    } else {
        return (
            <Box sx={{ width: "100%", height: chartHeight, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {props.children}
                </ResponsiveContainer>
            </Box>
        );
    }
}

export default ResponsiveChartContainer;
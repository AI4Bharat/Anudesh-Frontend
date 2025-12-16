import React from "react";
import { Popover, Box, Button } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { modifiedStaticRanges } from "@/utils/Date_Range/getDateRangeFormat";

const TimeRangeFilter = ({
  calenderOpen,
  calenderAnchor,
  handleCalenderClose,
  selectRange,
  handleRangeChange,
  dateTimeFormat,
  handleDateTimeFormat,
  clearFilter,
  applyFilter,
}) => {
  
  return (
    <Popover
      open={calenderOpen}
      anchorEl={calenderAnchor}
      onClose={handleCalenderClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "550px",
          overflowX: "auto",
        }}
      >
        <DateRangePicker
          onChange={handleRangeChange}
          staticRanges={modifiedStaticRanges}
          ranges={selectRange}
          months={2}
          maxDate={new Date()}
          direction="horizontal"
          displayMode="date"
        />
      </Box>
      <Box sx={{ p: 2, display: "flex", justifyContent: "end", gap: 2 }}>
        <Button
          onClick={handleDateTimeFormat}
          variant="outlined"
          color="primary"
        >
          {dateTimeFormat ? "DATE" : "DATE TIME"}
        </Button>
        <Button onClick={clearFilter} variant="outlined" color="primary">
          Clear
        </Button>
        <Button onClick={applyFilter} variant="contained" color="primary">
          Apply
        </Button>
      </Box>
    </Popover>
  );
};

export default TimeRangeFilter;
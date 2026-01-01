import React from "react";
import { Popover, Box, Button } from "@mui/material";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import { isSameDay } from "date-fns";
import { useSelector } from "react-redux";

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

  const UserDetails = useSelector((state) => state.getLoggedInData.data);
  
  return (
    <Popover
      open={calenderOpen}
      anchorEl={calenderAnchor}
      onClose={handleCalenderClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "500px",
          overflowX: "auto",
        }}
      >
        <DateRangePicker
          onChange={handleRangeChange}
          staticRanges={[
            ...defaultStaticRanges,
            {
              label: "Till Date",
              range: () => ({
                startDate: new Date(
                  Date.parse(
                          UserDetails?.date_joined,
                          "yyyy-MM-ddTHH:mm:ss.SSSZ",
                        ),
                ),
                endDate: new Date(),
              }),
              isSelected(range) {
                const definedRange = this.range();
                return (
                  isSameDay(range.startDate, definedRange.startDate) &&
                  isSameDay(range.endDate, definedRange.endDate)
                );
              },
            }
          ]}
          ranges={selectRange}
          months={1}
          maxDate={new Date()}
          direction="horizontal"
          displayMode="date"
        />
      </Box>
      <Box sx={{ p: 0.5, display: "flex", justifyContent: "end", gap: 2 }}>
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
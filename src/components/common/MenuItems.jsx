import * as React from "react";
import { useTheme } from "@/context/ThemeContext";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function MenuItems(props) {
  const [selectmenu, setselectmen] = React.useState("");
  const { dark } = useTheme();
  const handleChange = (event) => {
    props.handleChange(event.target.value);
    setselectmen(event.target.value);
  };
  return (
    <div>
      <FormControl fullWidth sx={{ minWidth: 120, "& .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "#3a3a3a" : "" } }}>
  <Select
    labelId="demo-simple-select-standard-label"
    id="demo-simple-select-standard"
    value={props.value}
    onChange={handleChange}
    sx={{ fontSize: "14px", color: dark ? "#ececec" : "", backgroundColor: dark ? "#2a2a2a" : "", "& .MuiSvgIcon-root": { color: dark ? "#a0a0a0" : "" } }}
    MenuProps={{ PaperProps: { sx: { backgroundColor: dark ? "#2a2a2a" : "", color: dark ? "#ececec" : "", border: dark ? "1px solid #3a3a3a" : "" } } }}
  >
          {props.menuOptions?.map((menu) => {
            return (
              <MenuItem
                disabled={menu.disabled}
                key={menu.value}
                value={menu.value}
              >
                {" "}
                {menu.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}

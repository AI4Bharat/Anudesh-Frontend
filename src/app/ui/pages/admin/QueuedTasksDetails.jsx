import React, { useState, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';
import APITransport from "@/Lib/apiTransport/apitransport"
import { useDispatch, useSelector } from "react-redux";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import tableTheme from "@/themes/tableTheme";
import CustomizedSnackbars from "@/components/common/Snackbar";
import Spinner from "@/components/common/Spinner";
import Skeleton from "@mui/material/Skeleton";
import GetQueuedTaskDetailsAPI from "@/Lib/Features/getQueuedTaskDetails";

const MUIDataTable = dynamic(
  () => import('mui-datatables'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        variant="rectangular"
        height={400}
        sx={{
          mx: 2,
          my: 3,
          borderRadius: '4px',
          transform: 'none'
        }}
      />
    )
  }
);

/* eslint-disable react-hooks/exhaustive-deps */

// ─── State badge colours ──────────────────────────────────────────────────────
const STATE_COLORS = {
  SUCCESS:  { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  FAILURE:  { bg: "#ffebee", color: "#c62828", border: "#ef9a9a" },
  STARTED:  { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  PENDING:  { bg: "#fff8e1", color: "#e65100", border: "#ffcc80" },
  RECEIVED: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
  REVOKED:  { bg: "#fafafa", color: "#424242", border: "#bdbdbd" },
};

function StateBadge({ state }) {
  const s = (state || "").toUpperCase();
  const colors = STATE_COLORS[s] || { bg: "#f5f5f5", color: "#424242", border: "#e0e0e0" };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          px: 1.5,
          py: 0.4,
          borderRadius: "12px",
          fontSize: "0.73rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          background: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          whiteSpace: "nowrap",
        }}
      >
        {state || "—"}
      </Box>
    </Box>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Flower returns tracebacks as JSON strings where \n is a literal two-character
// sequence (backslash + n). Normalize to real newlines so split/display works.
function normalizeTb(raw) {
  if (!raw) return "";
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

// Parse a Python traceback string into typed segments for color-coded rendering.
function parsePythonTraceback(raw) {
  const lines = normalizeTb(raw).split("\n");
  const segments = [];
  let i = 0;

  // Matches any Python exception line, including:
  //   Exception('...')          ← bare Exception
  //   ValueError: bad input     ← built-in XxxError / XxxException
  //   django.core.X: msg        ← module-qualified
  //   KeyboardInterrupt         ← no suffix needed
  const EXCEPTION_RE = /^(?:(?:[A-Za-z_][\w.]*\.)?(?:[A-Za-z_][\w]*(?:Error|Exception|Warning|Interrupt|Exit))|Exception|KeyboardInterrupt|SystemExit|GeneratorExit|StopIteration|AssertionError)[:\s(]/;

  while (i < lines.length) {
    const line    = lines[i];
    const trimmed = line.trim();

    if (/^Traceback \(most recent call last\):/.test(trimmed)) {
      segments.push({ kind: "header", text: line });
      i++;
    } else if (trimmed.startsWith("File ")) {
      segments.push({ kind: "file", text: line });
      i++;
      // Next non-empty, non-File line is the source code line
      if (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trim().startsWith("File ") &&
        !/^Traceback/.test(lines[i].trim())
      ) {
        segments.push({ kind: "code", text: lines[i] });
        i++;
      }
    } else if (EXCEPTION_RE.test(trimmed)) {
      // Gather continuation lines (indented or part of a multi-line exception msg)
      let errorText = line;
      i++;
      while (
        i < lines.length &&
        lines[i] !== "" &&
        !lines[i].trim().startsWith("File ") &&
        !/^Traceback/.test(lines[i].trim())
      ) {
        errorText += "\n" + lines[i];
        i++;
      }
      segments.push({ kind: "error", text: errorText });
    } else {
      segments.push({ kind: "plain", text: line });
      i++;
    }
  }

  // Mark the last "code" segment as "culprit" — where it actually crashed
  for (let j = segments.length - 1; j >= 0; j--) {
    if (segments[j].kind === "code") {
      segments[j] = { ...segments[j], kind: "culprit" };
      break;
    }
  }
  return segments;
}

const SEGMENT_STYLES = {
  header:  { color: "#90caf9", fontStyle: "italic" },
  file:    { color: "#82aaff" },
  code:    { color: "#b0bec5" },
  culprit: {
    color: "#ffd54f",
    fontWeight: 700,
    background: "rgba(255,213,79,0.09)",
    borderLeft: "3px solid #ffd54f",
    paddingLeft: "8px",
    marginLeft: "-11px",
    borderRadius: "2px",
    display: "block",
  },
  error:   { color: "#ff8a80", fontWeight: 700 },
  plain:   { color: "#e0e0e0" },
};

// ─── Traceback Modal ──────────────────────────────────────────────────────────
function TracebackModal({ open, onClose, traceback, exception, taskName }) {
  const [copied, setCopied] = useState(false);

  const ERROR_PREVIEW_LINES = 3;

  const cleanTraceback = React.useMemo(() => normalizeTb(traceback), [traceback]);
  const tbSegments     = React.useMemo(() => parsePythonTraceback(cleanTraceback), [cleanTraceback]);
  const [errorExpanded, setErrorExpanded] = useState(false);

  // Reset when a new traceback opens
  React.useEffect(() => { setErrorExpanded(false); }, [cleanTraceback]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanTraceback || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          background: "#1a1a2e",
          color: "#e0e0e0",
          maxHeight: "82vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#16213e",
          borderBottom: "1px solid #0f3460",
          py: 1.5,
          px: 2.5,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#e94560", mb: 0.2 }}>
            Task Failure Details
          </Typography>
          {taskName && (
            <Typography variant="caption" sx={{ color: "#90caf9", fontFamily: "monospace" }}>
              {taskName}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton onClick={handleCopy} size="small" sx={{ color: copied ? "#66bb6a" : "#90caf9" }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ color: "#90caf9" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {cleanTraceback ? (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              px: 2.5,
              py: 2,
            }}
          >
            {/* Header row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: "#90caf9", fontWeight: 700, letterSpacing: "0.08em" }}
              >
                TRACEBACK
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  background: "rgba(255,213,79,0.1)",
                  border: "1px solid rgba(255,213,79,0.3)",
                  borderRadius: "6px",
                  px: 1,
                  py: 0.3,
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#ffd54f", flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: "#ffd54f", fontSize: "0.68rem" }}>
                  highlighted = crash point
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "#546e7a", ml: "auto" }}>
                {tbSegments.length} lines
              </Typography>
            </Box>

            {/* Code block — all frames visible; exception tail is expandable */}
            <Box
              component="pre"
              sx={{
                margin: 0,
                fontFamily: "'Fira Code','Cascadia Code','Consolas',monospace",
                fontSize: "0.78rem",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#0d1117",
                borderRadius: "8px",
                p: 2,
                pl: "18px",
                border: "1px solid #1f2937",
              }}
            >
              {tbSegments.map((seg, i) => {
                if (seg.kind !== "error") {
                  return (
                    <span key={i} style={{ display: "block", ...SEGMENT_STYLES[seg.kind] }}>
                      {seg.text || "\u00A0"}
                    </span>
                  );
                }

                // ── Error segment: truncate by characters so a single long
                //    line (no \n) is also capped correctly.
                // Each ~120 chars ≈ one visual row in the dialog at 0.78rem.
                const CHARS_PER_VISUAL_LINE = 120;
                const CHAR_LIMIT = ERROR_PREVIEW_LINES * CHARS_PER_VISUAL_LINE;

                const fullText    = seg.text;
                const hasMore     = fullText.length > CHAR_LIMIT;
                const visibleText = errorExpanded
                  ? fullText
                  : fullText.slice(0, CHAR_LIMIT).trimEnd();
                const hiddenChars = fullText.length - CHAR_LIMIT;

                return (
                  <span key={i} style={{ display: "block" }}>
                    {/* Visible portion of the exception */}
                    <span style={{ display: "block", ...SEGMENT_STYLES.error }}>
                      {visibleText || "\u00A0"}
                      {/* inline ellipsis when collapsed */}
                      {hasMore && !errorExpanded && (
                        <span style={{ color: "#546e7a", fontWeight: 400 }}>…</span>
                      )}
                    </span>

                    {/* Expand / collapse toggle */}
                    {hasMore && (
                      <span
                        onClick={() => setErrorExpanded((v) => !v)}
                        style={{
                          display: "inline-block",
                          marginTop: "2px",
                          fontSize: "0.72rem",
                          color: "#64b5f6",
                          fontWeight: 600,
                          cursor: "pointer",
                          userSelect: "none",
                          fontFamily: "inherit",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {errorExpanded
                          ? "\u2191 collapse exception"
                          : `\u25BE ${hiddenChars} more chars — show full exception`}
                      </span>
                    )}
                  </span>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography sx={{ color: "#757575" }}>
              No traceback data available.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ background: "#16213e", borderTop: "1px solid #0f3460", px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} size="small" variant="outlined" sx={{ color: "#90caf9", borderColor: "#0f3460" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── State filter chips ───────────────────────────────────────────────────────
const STATE_FILTERS = [
  { label: "All",     value: "",         icon: <AllInclusiveIcon sx={{ fontSize: 15 }} /> },
  { label: "Success", value: "SUCCESS",  icon: <CheckCircleIcon sx={{ fontSize: 15 }} /> },
  { label: "Failure", value: "FAILURE",  icon: <ErrorIcon sx={{ fontSize: 15 }} /> },
  { label: "Started", value: "STARTED",  icon: <HourglassTopIcon sx={{ fontSize: 15 }} /> },
];

// ─── Main component ───────────────────────────────────────────────────────────
const QueuedTasksDetails = () => {
  const dispatch = useDispatch();

  const [snackbar, setSnackbarInfo] = useState({ open: false, message: "", variant: "success" });
  const [queuedTaskData, setQueuedTaskData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [displayWidth, setDisplayWidth] = useState(0);

  // Filters (local state — no redux dependency for these)
  const [nameFilter, setNameFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  // Traceback modal
  const [traceModal, setTraceModal] = useState({ open: false, traceback: "", exception: "", taskName: "" });

  const UserDetail = useSelector((state) => state.getQueuedTaskDetails?.data);
  const apiLoading = useSelector((state) => state.apiStatus.loading);

  // Derived list of unique task names for the filter dropdown
  const uniqueNames = React.useMemo(() => {
    const names = [...new Set(queuedTaskData.map((t) => t.name).filter(Boolean))].sort();
    return names;
  }, [queuedTaskData]);

  // Fetch on mount
  useEffect(() => {
    const fetchQueuedTasks = async () => {
      const apiInstance = new GetQueuedTaskDetailsAPI();
      const action = await apiInstance.call();
      dispatch(action);
    };
    fetchQueuedTasks();
    dispatch(APITransport(new GetQueuedTaskDetailsAPI()));
  }, [dispatch]);

  // Format raw data
  useEffect(() => {
    let formatted = [];
    if (UserDetail) {
      formatted = Object.keys(UserDetail).map((key) => {
        const el = UserDetail[key];
        return {
          uuid:      el.uuid,
          name:      el.name,
          state:     el.state,
          args:      el.args,
          kwargs:    el.kwargs,
          exception: el.exception,
          traceback: el.traceback,
        };
      });
    }
    setQueuedTaskData(formatted);
  }, [UserDetail]);

  // Apply filters whenever source data or filter values change
  useEffect(() => {
    let filtered = queuedTaskData;

    if (stateFilter) {
      filtered = filtered.filter((t) => (t.state || "").toUpperCase() === stateFilter);
    }

    if (nameFilter) {
      filtered = filtered.filter((t) => t.name === nameFilter);
    }

    if (nameSearch.trim()) {
      const q = nameSearch.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.state?.toLowerCase().includes(q) ||
          String(t.args || "").toLowerCase().includes(q) ||
          String(t.kwargs || "").toLowerCase().includes(q)
      );
    }

    setTableData(filtered);
  }, [queuedTaskData, stateFilter, nameFilter, nameSearch]);

  const openTraceModal = useCallback((row) => {
    setTraceModal({
      open: true,
      traceback: row.traceback || "",
      exception: row.exception || "",
      taskName: row.name || "",
    });
  }, []);

  // ─── Column definitions ───────────────────────────────────────────────────
  const columns = [
    {
      name: "uuid",
      label: "Id",
      options: { display: false, filter: false, sort: false },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({ style: { padding: "12px 16px", minWidth: 200 } }),
        customBodyRender: (value) => (
          <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
            {value || "—"}
          </Typography>
        ),
      },
    },
    {
      name: "state",
      label: "State",
      options: {
        filter: false,
        sort: true,
        setCellProps: () => ({
          style: {
            padding: "12px 16px",
            verticalAlign: "middle",
            minWidth: "100px",
          },
        }),
        customBodyRender: (value) => <StateBadge state={value} />,
      },
    },
    {
      name: "args",
      label: "Args",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({
          style: { padding: "12px 16px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" },
        }),
        customBodyRender: (value) => (
          <Tooltip title={String(value || "")} placement="top">
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 180,
                cursor: value ? "pointer" : "default",
              }}
            >
              {value || "—"}
            </Typography>
          </Tooltip>
        ),
      },
    },
    {
      name: "kwargs",
      label: "KwArgs",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({
          style: { padding: "12px 16px", maxWidth: 200 },
        }),
        customBodyRender: (value) => (
          <Tooltip title={String(value || "")} placement="top">
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 180,
                cursor: value ? "pointer" : "default",
              }}
            >
              {value || "—"}
            </Typography>
          </Tooltip>
        ),
      },
    },
    {
      name: "exception",
      label: "Exception",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({ style: { padding: "12px 16px", maxWidth: 220 } }),
        customBodyRender: (value) =>
          value ? (
            <Typography
              variant="body2"
              sx={{
                color: "#c62828",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 200,
              }}
              title={value}
            >
              {value}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: "#9e9e9e", fontSize: "0.75rem" }}>—</Typography>
          ),
      },
    },
    {
      name: "traceback",
      label: "Traceback",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({ style: { padding: "12px 16px" } }),
        customBodyRender: (value, tableMeta) => {
          const hasTrace = value || tableMeta?.rowData?.[6];
          const hasException = tableMeta?.rowData?.[5];
          if (!hasTrace && !hasException) {
            return <Typography variant="body2" sx={{ color: "#9e9e9e", fontSize: "0.75rem" }}>—</Typography>;
          }
          return (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                const row = {
                  uuid:      tableMeta?.rowData?.[0],
                  name:      tableMeta?.rowData?.[1],
                  state:     tableMeta?.rowData?.[2],
                  args:      tableMeta?.rowData?.[3],
                  kwargs:    tableMeta?.rowData?.[4],
                  exception: tableMeta?.rowData?.[5],
                  traceback: value,
                };
                openTraceModal(row);
              }}
              sx={{
                fontSize: "0.72rem",
                textTransform: "none",
                borderRadius: "8px",
                py: 0.3,
                px: 1.2,
                borderColor: "#ef9a9a",
                color: "#c62828",
                "&:hover": { background: "#ffebee", borderColor: "#c62828" },
              }}
            >
              View Traceback
            </Button>
          );
        },
      },
    },
  ];

  // ─── Custom footer ────────────────────────────────────────────────────────
  const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: { xs: "space-between", md: "flex-end" },
        alignItems: "center",
        padding: "10px",
        gap: { xs: "10px", md: "20px" },
      }}
    >
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => changePage(newPage)}
        onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
        sx={{
          "& .MuiTablePagination-actions": { marginLeft: "0px" },
          "& .MuiInputBase-root.MuiTablePagination-input": { marginRight: "10px" },
        }}
      />
      <div>
        <label style={{ marginRight: "5px", fontSize: "0.83rem" }}>Jump to Page:</label>
        <Select
          value={page + 1}
          onChange={(e) => changePage(Number(e.target.value) - 1)}
          sx={{ fontSize: "0.8rem", height: "32px" }}
        >
          {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
            <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
      </div>
    </Box>
  );

  const options = {
    textLabels: {
      body: { noMatch: "No records" },
      toolbar: { search: "Search", viewColumns: "View Column" },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
    responsive: "vertical",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
  };

  const renderSnackBar = () => (
    <CustomizedSnackbars
      open={snackbar.open}
      handleClose={() => setSnackbarInfo({ open: false, message: "", variant: "" })}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant={snackbar.variant}
      message={snackbar.message}
    />
  );

  return (
    <div>
      {renderSnackBar()}
      {apiLoading && <Spinner />}

      {/* ── Filter bar ─────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: 2,
          alignItems: "center",
          position: "relative",
          zIndex: 0,
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* Text search */}
        <TextField
          size="small"
          placeholder="Search tasks…"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 230 }}
        />

        {/* Name filter dropdown */}
        <FormControl size="small" sx={{ minWidth: 260 }}>
          <InputLabel id="name-filter-label" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FilterListIcon sx={{ fontSize: 14, mr: 0.5 }} /> Filter by Name
          </InputLabel>
          <Select
            labelId="name-filter-label"
            value={nameFilter}
            label="Filter by Name"
            onChange={(e) => setNameFilter(e.target.value)}
          >
            <MenuItem value=""><em>All Tasks</em></MenuItem>
            {uniqueNames.map((n) => (
              <MenuItem key={n} value={n} sx={{ fontSize: "0.82rem" }}>{n}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* State chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}>
          {STATE_FILTERS.map((sf) => {
            const active = stateFilter === sf.value;
            const colors = sf.value ? STATE_COLORS[sf.value] : null;
            return (
              <Chip
                key={sf.value}
                icon={sf.icon}
                label={sf.label}
                onClick={() => setStateFilter(sf.value)}
                size="small"
                variant={active ? "filled" : "outlined"}
                sx={{
                  fontWeight: active ? 700 : 400,
                  background: active && colors ? colors.bg : undefined,
                  color: active && colors ? colors.color : undefined,
                  borderColor: active && colors ? colors.border : undefined,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  "&:hover": {
                    background: colors ? colors.bg : "#f5f5f5",
                    borderColor: colors ? colors.border : undefined,
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Summary counts */}
        <Box sx={{ ml: "auto", display: "flex", gap: 1.5, alignItems: "center" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Showing <strong>{tableData.length}</strong> of <strong>{queuedTaskData.length}</strong> tasks
          </Typography>
          {(nameFilter || stateFilter || nameSearch) && (
            <Button
              size="small"
              variant="text"
              color="inherit"
              sx={{ fontSize: "0.73rem", textTransform: "none", color: "#1565c0" }}
              onClick={() => { setNameFilter(""); setStateFilter(""); setNameSearch(""); }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </Box>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <ThemeProvider theme={tableTheme}>
        {tableData.length ? (
          <MUIDataTable
            key={`table-${displayWidth}`}
            title="Queued Task Details"
            data={tableData}
            columns={columns}
            options={{
              ...options,
              tableBodyHeight: `${typeof window !== 'undefined' ? window.innerHeight - 260 : 400}px`,
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', gap: '2em', alignItems: 'center', justifyContent: 'center', mt: 6 }}>
            {!apiLoading && (
              <Typography color="text.secondary">
                {nameFilter || stateFilter || nameSearch
                  ? "No tasks match the current filters."
                  : "No Queued Tasks to Display"}
              </Typography>
            )}
          </Box>
        )}
      </ThemeProvider>

      {/* ── Traceback Modal ─────────────────────────────────────────────────── */}
      <TracebackModal
        open={traceModal.open}
        onClose={() => setTraceModal((p) => ({ ...p, open: false }))}
        traceback={traceModal.traceback}
        exception={traceModal.exception}
        taskName={traceModal.taskName}
      />
    </div>
  );
};

export default QueuedTasksDetails;

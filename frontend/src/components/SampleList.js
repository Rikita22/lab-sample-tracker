import React, {useEffect, useState} from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Chip,
    Button,
    Stack,
    Checkbox,
    TableContainer,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert, Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import API from "../api";

function SampleList() {
    const [samples, setSamples] = useState([]);
    const [selectedSamples, setSelectedSamples] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const samplesPerPage = 5;

    // Fetches all samples
    const fetchSamples = async () => {
        try {
            const res = await API.get("/samples");
            setSamples(res.data);
        } catch (err) {
            console.error("Error fetching samples:", err);
        }
    };

    useEffect(() => {
        fetchSamples();
    }, []);

    // Helper functions
    const formatDate = (dateString) =>
        dateString ? new Date(dateString).toISOString().split("T")[0] : "-";

    const getStatusChip = (status) => {
        switch (status) {
            case "Created":
                return (
                    <Chip
                        label="Created"
                        sx={{backgroundColor: "#4caf50", color: "white"}}
                    />
                );
            case "In Progress":
                return (
                    <Chip
                        label="In Progress"
                        sx={{backgroundColor: "#ffb300", color: "black"}}
                    />
                );
            case "Completed":
                return (
                    <Chip
                        label="Completed"
                        sx={{backgroundColor: "#2196f3", color: "white"}}
                    />
                );
            default:
                return <Chip label={status}/>;
        }
    };

    const handleSelect = (sample) => {
        const isSelected = selectedSamples.includes(sample.sampleId);
        setSelectedSamples(
            isSelected
                ? selectedSamples.filter((id) => id !== sample.sampleId)
                : [...selectedSamples, sample.sampleId]
        );
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await API.put(`/samples/${id}/status?status=${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteSample = async (id) => {
        try {
            await API.delete(`/samples/${id}`);
        } catch (error) {
            console.error("Error deleting sample:", error);
        }
    };

    // Centralized batch action handler
    const handleBatchAction = async (actionType) => {
        if (selectedSamples.length === 0) {
            setSnackbar({
                open: true,
                message: "Please select at least one sample.",
                severity: "warning",
            });
            return;
        }

        let invalidSamples = [];
        let actionPerformed = false;

        for (let id of selectedSamples) {
            const sample = samples.find((s) => s.sampleId === id);
            if (!sample) continue;

            if (actionType === "start") {
                if (sample.status === "Created") {
                    await updateStatus(id, "In Progress");
                    actionPerformed = true;
                } else {
                    invalidSamples.push(`${id} (${sample.status})`);
                }
            }

            if (actionType === "complete") {
                if (sample.status === "In Progress") {
                    await updateStatus(id, "Completed");
                    actionPerformed = true;
                } else {
                    invalidSamples.push(`${id} (${sample.status})`);
                }
            }

            if (actionType === "delete") {
                if (sample.status === "Completed") {
                    await deleteSample(id);
                    actionPerformed = true;
                } else {
                    invalidSamples.push(`${id} (${sample.status})`);
                }
            }
        }

        // Snackbar messages
        if (invalidSamples.length > 0) {
            setSnackbar({
                open: true,
                message: `⚠ Cannot perform "${actionType}" on: ${invalidSamples.join(
                    ", "
                )}`,
                severity: "warning",
            });
        } else if (actionPerformed) {
            setSnackbar({
                open: true,
                message:
                    actionType === "start"
                        ? "Selected samples started successfully!"
                        : actionType === "complete"
                            ? "Selected samples marked completed!"
                            : "Selected samples deleted successfully!",
                severity: "success",
            });
        }

        setSelectedSamples([]);
        await fetchSamples();
    };

    const filteredSamples = samples.filter((sample) => {
        const matchesSearch =
            sample.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sample.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sample.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "All" || sample.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    //pagination Logic
    const indexOfLastSample = currentPage * samplesPerPage;
    const indexOfFirstSample = indexOfLastSample - samplesPerPage;
    const currentSamples = filteredSamples.slice(
        indexOfFirstSample,
        indexOfLastSample
    );
    const totalPages = Math.ceil(filteredSamples.length / samplesPerPage);

    const handlePageChange = (event, value) => setCurrentPage(value);
    return (
        <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
            <Paper sx={{p: 4, width: "95%"}}>
                <Typography variant="h5" gutterBottom>
                    Samples List
                </Typography>

                {/* Search, Filter & Action Buttons */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{mb: 2, flexWrap: "wrap"}}
                >

                    {/* Left side — Search + Filter */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{flexGrow: 1}}>
                        <TextField
                            label="Search"
                            placeholder="Search by ID, Description, or Requester"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),

                            }}
                            sx={{width: "55ch"}} // 👈 narrower search bar
                        />

                        <FormControl sx={{minWidth: 160}} size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                label="Status"
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Created">Created</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Right side — Action Buttons */}
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => handleBatchAction("start")}
                            sx={{minWidth: 100}}
                        >Start</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleBatchAction("complete")}
                            sx={{minWidth: 100}}
                        >Complete
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon/>}
                            onClick={() => handleBatchAction("delete")}
                            sx={{minWidth: 100}}
                        >Delete
                        </Button>
                    </Stack>
                </Stack>


                {/* Samples Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell><b>Sample ID</b></TableCell>
                                <TableCell><b>Description</b></TableCell>
                                <TableCell><b>Requested By</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentSamples.map((sample) => (
                                <TableRow key={sample.sampleId}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedSamples.includes(sample.sampleId)}
                                            onChange={() => handleSelect(sample)}
                                        />
                                    </TableCell>
                                    <TableCell>{sample.sampleId}</TableCell>
                                    <TableCell>{sample.description}</TableCell>
                                    <TableCell>{sample.requestedBy}</TableCell>
                                    <TableCell>{getStatusChip(sample.status)}</TableCell>
                                    <TableCell>{formatDate(sample.createdDate)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {totalPages > 1 && (
                    <Stack alignItems="center" sx={{mt: 3}}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                        />
                    </Stack>)}
            </Paper>

            {/* Snackbar Feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default SampleList;
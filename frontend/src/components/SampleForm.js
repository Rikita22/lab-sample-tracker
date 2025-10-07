import React, {useState} from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, InputLabel, Select, FormControl, MenuItem,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import API from "../api";

function SampleForm() {
    const navigate = useNavigate();

    const [sample, setSample] = useState({
        sampleId: "(Auto)",
        description: "",
        requestedBy: "",
        status: "Created",
    });

    const [createdSampleId, setCreatedSampleId] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setSample({...sample, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(false);

        //Validation
        if (!sample.requestedBy.trim()) {
            setDialogMessage("Requested By cannot be empty!");
            setIsSuccess(false);
            setDialogOpen(true);
            return;
        }

        if (!sample.description.trim()) {
            setDialogMessage("Description cannot be empty!");
            setIsSuccess(false);
            setDialogOpen(true);
            return;
        }
        const count = quantity ? parseInt(quantity) : 1;

        try {
            // Only sends necessary fields
            const payload = {
                description: sample.description,
                requestedBy: sample.requestedBy,
                status: "Created",
            };
            const createdIds = [];

            for (let i = 0; i < count; i++) {
                const response = await API.post("/samples", payload);
                createdIds.push(response.data.sampleId);
            }

            setCreatedSampleId(createdIds);
            setDialogMessage(count === 1 ? `Sample ${createdIds[0]} created successfully!` : `${count} samples created successfully!`);
            setIsSuccess(true);
            setDialogOpen(true);

            // Resets form
            setSample({
                sampleId: "(Auto)",
                description: "",
                requestedBy: "",
                status: "Created",
            });
            setQuantity("");
        } catch (error) {
            console.error("Error creating sample:", error);
            setDialogMessage("Failed to create sample. Please try again.");
            setIsSuccess(false);
            setDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSubmitted(false)

        if (isSuccess) {
            // Redirects to home
            navigate("/home");
        } else {
            // Stays on the same form (Create Sample)
            navigate("/create");
        }
    };

    return (
        <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
            <Paper sx={{p: 4, width: 400}}>
                <Typography variant="h5" gutterBottom>
                    Create New Sample
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {/* Sample ID (Read-only) */}
                        <TextField
                            label="Sample ID"
                            name="sampleId"
                            value={createdSampleId || "(Auto)"}
                            InputProps={{
                                readOnly: true,
                            }}
                            helperText="This will be auto-generated on save"
                        />

                        {/* Description (Required) */}
                        <TextField
                            label="Description"
                            name="description"
                            error={submitted && !sample.description.trim()}
                            value={sample.description}
                            onChange={handleChange}
                            helperText={
                                submitted && !sample.requestedBy.trim()
                                    ? "Description cannot be empty"
                                    : ""
                            }
                            required
                        />

                        {/* Requested By (Required) */}
                        <TextField
                            label="Requested By"
                            name="requestedBy"
                            value={sample.requestedBy}
                            onChange={handleChange}
                            required
                            error={submitted && !sample.requestedBy.trim()}
                            helperText={
                                submitted && !sample.requestedBy.trim()
                                    ? "Requested By field cannot be empty"
                                    : ""
                            }
                        />

                        {/* Status (Read-only) */}
                        <TextField
                            label="Status"
                            name="status"
                            value={sample.status}
                            InputProps={{
                                readOnly: true,
                            }}
                            helperText="Status is set to 'Created' automatically"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Number of Samples</InputLabel>
                            <Select
                                value={quantity}
                                label="Number of Samples"
                                onChange={(e) => setQuantity(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Default (1)</em>
                                </MenuItem>
                                {[...Array(10).keys()].map((i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button type="submit" variant="contained" color="primary">
                            Save Sample{quantity && quantity > 1 ? "s" : ""}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Success/Error Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>
                    {isSuccess ? "✅ Success" : "❌ Error"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SampleForm;
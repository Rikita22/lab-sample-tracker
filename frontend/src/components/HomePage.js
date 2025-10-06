
import React from "react";
import { Button, Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                height: "calc(100vh - 64px)",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Stack spacing={4} alignItems="center">
                <Typography variant="h4" gutterBottom>
                    Welcome to Lab Sample Tracker
                </Typography>

                <Stack direction="row" spacing={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/create")}
                    >
                        Create Sample
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/list")}
                    >
                        View Samples
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default HomePage;
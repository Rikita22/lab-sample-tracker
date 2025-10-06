import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../redux/authSlice";

function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {

            // Calls backend login endpoint (implemented in Spring Boot)

            const res = await API.post("http://localhost:8081/api/auth/login", credentials);
            const token = res.data.token;
            const username= credentials.username;

            // Saves token for future API calls
            localStorage.setItem("token", token);
            dispatch(loginSuccess({username,token}));

            navigate("/home");

        } catch (err) {
            setError("Invalid username or password");
        }

    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
                <Typography variant="h5" gutterBottom>Lab Sample Tracker - Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        margin="normal"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={credentials.password}
                        onChange={handleChange}
                    />

                    {error && (<Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >Login</Button>
                </form>
            </Paper>
        </Box>

    );

}

export default LoginPage;


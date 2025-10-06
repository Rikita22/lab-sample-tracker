import React from 'react';
import { AppBar, Toolbar, Typography,Menu, Button, Avatar, Popover,Box,Stack, Divider } from '@mui/material';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './labvantageLogo.png';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../redux/authSlice";


function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username= useSelector(state => state.auth.user);
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickUser = (event) => setAnchorEl(event.currentTarget);
    const handleCloseUser = () => setAnchorEl(null);

    const handleSignOut = () => {
        dispatch(logout());
        navigate("/");
    };

    const openUser = Boolean(anchorEl);
    const id = openUser ? 'user-popover' : undefined;

    return (
        <>
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar>
                {/* Left: Logo + Title */}
                <img src={logo} alt="Logo" style={{ width: 120, marginRight: 16 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Lab Sample Tracker
                </Typography>

                {/* Navigation Buttons */}
                {location.pathname!== "/home" && (<Button color="inherit" onClick={() => navigate("/home")}>
                    Home
                </Button>)}

                {/* User Profile */}
                <Button onClick={handleClickUser}>
                    <Avatar alt="User Avatar" src="" />
                </Button>
                <Menu
                    id={id}
                    open={openUser}
                    anchorEl={anchorEl}
                    onClose={handleCloseUser}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

                >

                    <div style={{ padding: 16, minWidth: 200 }}>
                        <Typography variant="subtitle1">
                            {username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {username}@lims.com
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Button onClick={handleSignOut} color="error" fullWidth>
                            Sign Out
                        </Button>
                    </div>
                </Menu>
            </Toolbar>
        </AppBar>
            </>
    );
}

export default Header;
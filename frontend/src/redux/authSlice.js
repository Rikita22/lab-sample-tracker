import {createSlice} from "@reduxjs/toolkit";

const initialState = {

    user: localStorage.getItem("username") || null,

    token: localStorage.getItem("token") || null,

    isAuthenticated: !!localStorage.getItem("token"),

};

const authSlice = createSlice({

    name: "auth", initialState,

    reducers: {

        loginSuccess: (state, action) => {

            state.user = action.payload.username;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("username", state.user);
            localStorage.setItem("token", state.token);

        },

        logout: (state) => {

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            },

    },

});

export const {loginSuccess, logout} = authSlice.actions;

export default authSlice.reducer;


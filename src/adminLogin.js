import React from "react";
import { useEffect, useState } from 'react';
import "./styles.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import jwt_decode from "jwt-decode";

const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#ff8a00',
        },
        neutral: {
            main: '#ffffff',
            contrastText: '#ff8a00',
        },
    },
});

function AdminLoginPage() {
    const navigate = useNavigate();
    const clientID = "834809423110-fg16i98bh4h8uvoguvjsf5srrkabvsbq.apps.googleusercontent.com";
    const [loginMessage, setMessage] = useState("");

    async function handleResponse(response) {
        var userObject = jwt_decode(response.credential);
        const email = userObject.email;
        await fetch('http://127.0.0.1:5000/check_admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
            })
        })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {

                if (data.found === true) {
                    navigate('/admin', { replace: true, state: { email: email } })
                }
                else {
                    setMessage("Login Failed. Please contact the PlexTech executive team if the issue persists.");
                }
            });
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: clientID,
            callback: handleResponse,
        });

        google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            { theme: "outline", size: "large" },
        )
    }, []);

    return (
        <>
            <ThemeProvider theme={theme}>
                <div>
                    <h2>This is an admin-only page.</h2>
                    <h4>Please log in first to continue.</h4>
                </div>
                <div id="signInDiv"></div>
                <Button style={{ "display": "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={() => { navigate('/') }}
                    className="navHome">Return Home</Button>
                <div>
                    <p>{loginMessage}</p>
                </div>
            </ThemeProvider>
        </>
    )
}

export default AdminLoginPage;
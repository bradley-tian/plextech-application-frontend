import React from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

function Privacy() {
    const navigate = useNavigate();
    return (
        <>
            <ThemeProvider theme={theme}>
                <div>
                    <h2>PlexTech Application Platform - Privacy Policy</h2>
                    <p>By applying to PlexTech, you agree to disclose your email address, your full name, and other school-related information.<br/>
                    None of this information will be used for purposes other than recruitment deliberations, and all records will be permanently deleted after the application period.<br/>
                    For any further inquiries, please contact us at info@plextech.berkeley.edu.</p>
                </div>
                <Button style={{ "display": "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={() => {navigate('/')}}
                    className="navHome">Return Home</Button>
            </ThemeProvider>

        </>
    )
}

export default Privacy;
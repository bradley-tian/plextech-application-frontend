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

function SuccessPage() {
    const navigate = useNavigate();
    return (
        <>
            <ThemeProvider theme={theme}>
                <div>
                    <h2>Thank you for your applying to PlexTech!</h2>
                    <h4>We will reach out to you very soon.</h4>
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

export default SuccessPage;
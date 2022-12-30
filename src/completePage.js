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

function CompletionPage() {
    const navigate = useNavigate();
    return (
        <>
            <ThemeProvider theme={theme}>
                <div>
                    <h2>Good work!</h2>
                    <h4>You have finished grading your assigned portion.</h4>
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

export default CompletionPage;
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

function InterviewComplete() {
    const navigate = useNavigate();
    return (
        <>
            <ThemeProvider theme={theme}>
                <div className='form-field'>
                    <div>
                        <h4>Thank you for submitting your interview review.</h4>
                    </div>
                    <Button style={{ "display": "flex" }}
                        variant="contained"
                        color="neutral"
                        onClick={() => { navigate('/interview') }}
                        className="navHome">Submit Another Review</Button>
                    <Button style={{ "display": "flex" }}
                        variant="contained"
                        color="neutral"
                        onClick={() => { navigate('/') }}
                        className="navHome">Return Home</Button>
                </div>
            </ThemeProvider>

        </>
    )
}

export default InterviewComplete;
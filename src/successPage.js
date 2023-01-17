import React from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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
    const { state } = useLocation();
    const [UID, setUID] = useState('');

    useEffect(() => {
        if (state === null) {
            navigate('/apply');
        } else {
            if (state.UID === null) {
                navigate('/apply');
            } else {
                setUID(state.UID);
            }
        }
    }, [])

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className='form-field'>
                    <div>
                        <h2>Thank you for your applying to PlexTech!</h2>
                        <h4>We will reach out to you very soon.</h4>
                        <br />
                        <h3 style={{ 'color': "black" }}>Your Applicant ID:</h3>
                        <h4 style={{ 'color': "#ff8a00" }}>{UID}</h4>
                        <h6>Please keep this ID in a safe place; you will not be able to access it later. <br/> Should you need to contact us regarding your application, please refer to this ID.</h6>
                    </div>
                    <br/>
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

export default SuccessPage;
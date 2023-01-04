import React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PlexTechLogo from './PlexTechLogo.png'
import "./styles.css"

function Home() {

    const navigate = useNavigate();

    const navToApplication = () => {
        navigate("/apply");
    }

    const navToGrading = () => {
        navigate("/member-login");
    }

    const navToAdmin = () => {
        navigate("/admin-login");
    }

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

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="home-container">
                    <h2 style={{display: 'inline-flex',}}>Welcome to the PlexTech Application Platform!</h2>
                    <img src={PlexTechLogo} alt="plextech logo" style={{ display: 'inline-flex', width: '35px', left: '85%', top: '12%', position: 'absolute', }}/>
                    <h4>If you are an applicant, please proceed to the application form.</h4>
                    <div className="home">

                        <Button style={{
                            "font-family": "DM Sans",
                        }}
                            className='first'
                            onClick={navToApplication}
                            variant="contained"
                            color="neutral"
                        >Application Form</Button>

                        <button onClick={navToGrading}>Grading Interface</button>
                        <button onClick={navToAdmin}>Admin Console</button>
                    </div>
                </div>
            </ThemeProvider>
            <footer>
                <p className="copyright">Copyright © 2023 PlexTech All Rights Reserved.</p>
            </footer>
        </>

    );
};

export default Home;
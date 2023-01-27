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
            secondary: {
                main: '#808080'
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
                    <img src={PlexTechLogo} alt="plextech logo" style={{ display: 'block', width: '35px', left: '85%', top: '12%', }} />
                    <h2 style={{ display: 'block' }}>Welcome to the PlexTech Application Platform!</h2>
                    <h4>If you are an applicant, please proceed to the application form.</h4>
                    <h4 style={{color: 'red'}}>Applications due today, 12:00PM (Noon)!</h4>
                    <div className="home">

                        <Button style={{
                            "fontFamily": "DM Sans",
                            "marginBottom": "2rem",
                            "display": "block",
                        }}
                            className='first'
                            onClick={navToApplication}
                            variant="contained"
                            color="neutral"
                        >Application Form</Button>

                        <Button style={{
                            "fontFamily": "DM Sans",
                            "marginBottom": "2rem",
                            "display": "block",
                            "marginRight": '0.5%',
                        }}
                            className='homeBtn'
                            onClick={navToGrading}
                            variant="outlined"
                            color="secondary"
                        >Grading Interface</Button>

                        <Button style={{
                            "fontFamily": "DM Sans",
                            "marginBottom": "2rem",
                            "display": "block",
                            "marginRight": '0.5%',
                        }}
                            className='homeBtn'
                            onClick={navToAdmin}
                            variant="outlined"
                            color="secondary"
                        >Admin Console</Button>
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
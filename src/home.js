import React from 'react';
import { useNavigate } from "react-router-dom";
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

    return (
        <div className="home-container">
            <h1>Welcome to the PlexTech Application Platform.</h1>
            <h4>If you are an applicant, please proceed to the application form.</h4>
            <div className="home">
                <button className='first' onClick={navToApplication}>Application Form</button>
                <button className='second' onClick={navToGrading}>Grading Interface</button>
                <button className='third' onClick={navToAdmin}>Admin Console</button>
            </div>
        </div>
    );
};

export default Home;
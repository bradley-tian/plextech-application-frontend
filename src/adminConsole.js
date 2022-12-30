import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import "./styles.css";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { ExportToCsv } from 'export-to-csv';

function AdminConsole() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const [graderMessage, setGraderMessage] = useState("");
    const [graders, setGraders] = useState([]);
    const [action1, setAction1] = useState('add');

    const theme = createTheme({
        status: {
            danger: "#e53e3e",
        },
        palette: {
            primary: {
                main: "#ff8a00",
            },
            neutral: {
                main: "#ffffff",
                contrastText: "#ff8a00",
            },
        },
    });


    async function fetchGraderData() {
        await fetch("https://plextech-application-backend-production.up.railway.app/get_graders", {
            method: 'GET',
        })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {
                const graders = [];
                for (let [key, value] of Object.entries(data)) {
                    graders.push([key, value.email]);
                }
                setGraders(graders);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        async function checkUser(value) {
            await fetch('https://plextech-application-backend-production.up.railway.app/check_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: value.email,
                })
            })
                .then((response) => {
                    return (response.json());
                })
                .then((data) => {
                    if (data.found === false) {
                        navigate('/admin-login');
                    }
                });
        };

        if (state === null) {
            navigate('/admin-login');
        } else {
            checkUser(state);
        }

        fetchGraderData();
    }, []);

    useEffect(() => {
        fetchGraderData();
    }, [graderMessage]);

    const [analyticData, setAnalyticData] = useState({
        count: "N/A",
        freshmen: "N/A",
        sophomore: "N/A",
        junior: "N/A",
        senior: "N/A",
        male: "N/A",
        female: "N/A",
        other: "N/A",
    })

    function Analytics() {
        async function loadAnalytics() {
            await fetch("https://plextech-application-backend-production.up.railway.app/analytics", {
                method: 'GET',
            })
                .then((response) => {
                    return (response.json());
                })
                .then((data) => {
                    setAnalyticData(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

        return (
            <>
                <ul>
                    <li>Total Application Count: {analyticData.count}</li>
                    <li>Freshmen: {analyticData.freshmen} ({((analyticData.freshmen / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Sophomore: {analyticData.sophomore} ({((analyticData.sophomore / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Junior: {analyticData.junior} ({((analyticData.junior / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Senior: {analyticData.senior} ({((analyticData.senior / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Male: {analyticData.male} ({((analyticData.male / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Female: {analyticData.female} ({((analyticData.female / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Other Genders: {analyticData.other} ({((analyticData.other / analyticData.count) * 100).toFixed(2)}%)</li>
                </ul>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={loadAnalytics}
                    className="loadAnalytics"
                >Load Analytics</Button>
            </>
        )
    }

    const [assignments, setAssignments] = useState({})

    function Assignment() {

        async function assignGraders() {
            await fetch("https://plextech-application-backend-production.up.railway.app/assign_graders", {
                method: 'GET',
            })
                .then((response) => {
                    return (response.json());
                })
                .then((data) => {
                    setAssignments(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

        return (
            <>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={assignGraders}
                    className="assignGraders"
                >Auto Assign Graders</Button>

                <h4>Current Assignments</h4>
                <div>
                  {Object.keys(assignments).map(key => {
                    return (
                      <div>
                        <h6>{key}</h6>
                        <ul>
                          {assignments[key].map(value => (
                            <li key={value}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
            </>
        );
    }

    function Results() {

        let csvURL = '';
        async function exportResults() {
            await fetch('https://plextech-application-backend-production.up.railway.app/export_results', {
                method: 'GET',
            })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {
                const options = { 
                    fieldSeparator: ',',
                    quoteStrings: '"',
                    decimalSeparator: '.',
                    showLabels: true, 
                    showTitle: true,
                    title: 'Grading Results',
                    useTextFile: false,
                    useBom: true,
                  };
                const csvExport = new ExportToCsv(options);
                csvExport.generateCsv(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
        return (
            <>
            <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={exportResults}
                    className="exportResults"
                    href={csvURL}
                    download
                >Export Results as CSV File</Button>
            </>
        )
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <span>
                    <Button
                        style={{ display: "flex" }}
                        variant="contained"
                        color="neutral"
                        onClick={() => { navigate('/') }}
                        className="navHome"
                    >Return Home</Button>

                    <h1 style={{ display: "flex" }}>
                        PlexTech Administrator Console
                    </h1>
                </span>

                {/* Grader Control */}
                <Formik
                    initialValues={{
                        email: "",
                    }}
                    onSubmit={async (values) => {
                        if (action1 === "add") {
                            await fetch('https://plextech-application-backend-production.up.railway.app/add_grader', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: values.email,
                                })
                            }).then(() => {
                                setGraderMessage("Successfully added grader " + values.email + ".")
                            });
                        } else if (action1 === "remove") {
                            await fetch('https://plextech-application-backend-production.up.railway.app/remove_grader', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: values.email,
                                })
                            }).then(() => {
                                setGraderMessage("Successfully removed grader " + values.email + ".")
                            });
                        }
                    }}
                >
                    {formik => (
                        <div className='admin-console'>
                            <div>
                                <h2>Grader Control</h2>
                                <h4>Current Graders:</h4>
                                <ul>
                                    {
                                        graders.map(grader => {
                                            return (
                                                <li key={grader[0]}>{grader[1]}</li>
                                            )
                                        })
                                    }
                                </ul>
                                <p>{graderMessage}</p>

                                <form onSubmit={formik.handleSubmit}>
                                    <label htmlFor="lastName">Grader Email</label>
                                    <input
                                        id="email"
                                        type="text"
                                        {...formik.getFieldProps('email')} />

                                    <label htmlFor="rating1">
                                        What do you want to do with this grader?
                                    </label>
                                    <select className="dropbtn" name="action1" value={action1} onChange={(event) => { setAction1(event.target.value) }}>
                                        <option value="" disabled={true}>Select an action:</option>
                                        <option value="add">add grader</option>
                                        <option value="remove">remove grader</option>
                                    </select>
                                    <div style={{ marginTop: '2rem' }}>
                                        <Button type="submit"
                                            variant="contained"
                                            color="neutral"
                                            fontWeight="Bold"
                                            style={{ "marginBottom": "50px" }}
                                        >Submit</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </Formik>

                <div className='horizontal-box'>
                    <h2>Application Analytics</h2>
                    <Analytics />
                </div>

                <div className='horizontal-box'>
                    <h2>Grader Assignment Control</h2>
                    <p>Note: Please ensure that all graders are finalized before performing this action.</p>
                    <Assignment />
                </div>

                <div className='horizontal-box'>
                    <h2>Grading Results</h2>
                    <Results />
                </div>
                <br />
            </ThemeProvider>
        </>
    )
}

export default AdminConsole;
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import "./styles.css";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { ExportToCsv } from 'export-to-csv';

function AdminConsole() {

    const URL = process.env.REACT_APP_API_URL;
    const { state } = useLocation();
    const navigate = useNavigate();
    const [graderMessage, setGraderMessage] = useState("");
    const [CSVMessage, setCSVMessage] = useState("");
    const [CSVMessage2, setCSVMessage2] = useState("");
    const [CSVMessage3, setCSVMessage3] = useState("");
    const [graders, setGraders] = useState([]);
    const [action1, setAction1] = useState('add');
    const [results, setResults] = useState([]);
    const [applications, setApplications] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [incomplete, setIncomplete] = useState([]);
    const [assignmentsCleared, setAssignmentsCleared] = useState([]);


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
        await fetch(`${URL}/get_graders`, {
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

    //Refresh boot-up procedures
    useEffect(() => {
        async function checkUser(value) {
            await fetch(`${URL}/check_admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
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
        loadAnalytics();
        getResults();
        getApplications();
        getEvaluations();
        getIncomplete();
        setAssignmentsCleared(false)
    }, []);

    useEffect(() => {
        fetchGraderData();
    }, [graderMessage]);

    const [analyticData, setAnalyticData] = useState({
        count: "N/A",
        freshman: "N/A",
        sophomore: "N/A",
        junior: "N/A",
        senior: "N/A",
        male: "N/A",
        female: "N/A",
        other: "N/A",
    })

    async function loadAnalytics() {
        await fetch(`${URL}/analytics`, {
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

    function Analytics() {

        return (
            <>
                <ul>
                    <li>Total Application Count: {analyticData.count}</li>
                    <br />
                    <li>Grade</li>
                    <br />
                    <li>Freshmen: {analyticData.freshman} ({((analyticData.freshman / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Sophomore: {analyticData.sophomore} ({((analyticData.sophomore / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Junior: {analyticData.junior} ({((analyticData.junior / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Senior: {analyticData.senior} ({((analyticData.senior / analyticData.count) * 100).toFixed(2)}%)</li>
                    <br />
                    <li>Gender</li>
                    <br />
                    <li>Male: {analyticData.male} ({((analyticData.male / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Female: {analyticData.female} ({((analyticData.female / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Other Genders: {analyticData.other} ({((analyticData.other / analyticData.count) * 100).toFixed(2)}%)</li>
                    <br />
                    <li>Ethnicity</li>
                    <br />
                    <li>American Indian: {analyticData.American_Indian} ({((analyticData.American_Indian / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Asian: {analyticData.Asian} ({((analyticData.Asian / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Black: {analyticData.Black} ({((analyticData.Black / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>White: {analyticData.White} ({((analyticData.White / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Middle Eastern: {analyticData.Middle_Eastern} ({((analyticData.Middle_Eastern / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Pacific Islander: {analyticData.Pacific_Islander} ({((analyticData.Pacific_Islander / analyticData.count) * 100).toFixed(2)}%)</li>
                </ul>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={loadAnalytics}
                    className="loadAnalytics"
                >Refresh Analytics</Button>
            </>
        )
    }

    const [assignments, setAssignments] = useState({})

    async function assignGraders() {
        await fetch(`${URL}/assign_graders`, {
            method: 'GET',
        })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {
                setAssignments(data);
                console.log(`Successfully retrieved ${Object.keys(data).length} assignments.`)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async function clearAssignments() {
        await fetch(`${URL}/clear_assignments`, {
            method: 'DELETE',
        })
            .then(() => {
                setAssignmentsCleared(true);
            });
    }

    function Assignment() {

        return (
            <>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={assignGraders}
                    className="assignGraders"
                >Assign Graders / View Assignments</Button>
                <br />
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={clearAssignments}
                    className="clearAssignments"
                >Clear All Assignments</Button>
                {assignmentsCleared ? <p>Cleared all assignments</p> : <></>}
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

    async function getResults() {
        await fetch(`${URL}/export_results`, {
            method: 'GET',
        })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {
                if (data.length === 0) {
                    setCSVMessage("There are currently no reviews.");
                } else {
                    setResults(data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function exportResults() {
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
        csvExport.generateCsv(results);
    }

    function Results() {
        return (
            <>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={exportResults}
                    className="exportResults"
                    download
                >Export Results as CSV File</Button>
                <p>{CSVMessage}</p>
            </>
        )
    }

    async function getApplications() {
        await fetch(`${URL}/export_applications`, {
            method: 'GET',
        })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {
                if (data.length === 0) {
                    setCSVMessage2("There are currently no applications.");
                } else {
                    setApplications(data)
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function exportApplications() {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Applications',
            useTextFile: false,
            useBom: true,
        };
        const csvExport = new ExportToCsv(options);
        csvExport.generateCsv(applications);
    }

    function Applications() {
        return (
            <>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={exportApplications}
                    className="exportApplications"
                    download
                >Export Applications as CSV File</Button>
                <p>{CSVMessage2}</p>
            </>
        )
    }

    async function getEvaluations() {
        await fetch(`${URL}/evaluate_results`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then((response) => {
                return (response.json());
            })
            .then((data) => {
                if (data.length === 0) {
                    setCSVMessage3("There are currently no reviews.");
                } else {
                    setEvaluations(data)
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function exportEvaluations() {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Evaluations',
            useTextFile: false,
            useBom: true,
        };
        const csvExport = new ExportToCsv(options);
        csvExport.generateCsv(evaluations);
    }

    function Evaluations() {
        return (
            <>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={exportEvaluations}
                    className="exportEvaluations"
                    download
                >Export Evaluations as CSV File</Button>
                <p>{CSVMessage3}</p>
            </>
        )
    }

    const [adminKey, setAdminKey] = useState('');
    const [flushMessage, setFlushMessage] = useState('');
    async function flushDatabase() {
        if (adminKey === 'plextechpermission') {
            await fetch(`${URL}/flush_database`, {
                method: 'GET',
            })
                .then(() => {
                    setFlushMessage('Database successfully cleared.');
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } else {
            setFlushMessage('Incorrect admin key.')
        }
    }

    async function getIncomplete() {
        await fetch(`${URL}/check_progress`, {
            method: 'GET',
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setIncomplete(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className='form-field'>
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
                                await fetch(`${URL}/add_grader`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        email: values.email,
                                    })
                                }).then(() => {
                                    setGraderMessage("Successfully added grader " + values.email + ".")
                                });
                            } else if (action1 === "remove") {
                                await fetch(`${URL}/remove_grader`, {
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

                    <div className='horizontal-box'>
                        <h2>Applications</h2>
                        <Applications />
                    </div>

                    <div className='horizontal-box'>
                        <h2>Normalized Evaluations</h2>
                        <Evaluations />
                    </div>

                    <div className='horizontal-box'>
                        <h2>Progress Check</h2>
                        <p>Any grader who has not completed their assignments will be listed here.</p>
                        {incomplete.map(
                            (message) => (message.map((word) => <p>{word + " "}</p>))
                        )}
                    </div>

                    <div className="horizontal-box">
                        <h2>DANGER: Database Operations</h2>
                        <label>Enter admin key to proceed:</label>
                        <input
                            type='text'
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            style={{ marginBottom: "2rem" }}
                        ></input>
                        <Button
                            style={{ display: "flex" }}
                            variant="contained"
                            color="neutral"
                            onClick={flushDatabase}
                            className="flushDatabase"
                        >Flush Database</Button>
                        <p>{flushMessage}</p>
                    </div>
                </div>
                <br />
            </ThemeProvider>
        </>
    )
}

export default AdminConsole;

// Post Op Interface Test 2
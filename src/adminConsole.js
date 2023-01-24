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
    const [CSVMessage, setCSVMessage] = useState("");
    const [CSVMessage2, setCSVMessage2] = useState("");
    const [CSVMessage3, setCSVMessage3] = useState("");
    const [graders, setGraders] = useState([]);
    const [action1, setAction1] = useState('add');
    const [results, setResults] = useState([]);
    const [applications, setApplications] = useState([]);
    const [evaluations, setEvaluations] = useState([]);

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
        loadResultAnalytics();
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

    function Analytics() {

        return (
            <>
                <ul>
                    <li>Total Application Count: {analyticData.count}</li>
                    <br/>
                    <li>Grade</li>
                    <br/>
                    <li>Freshmen: {analyticData.freshmen} ({((analyticData.freshmen / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Sophomore: {analyticData.sophomore} ({((analyticData.sophomore / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Junior: {analyticData.junior} ({((analyticData.junior / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Senior: {analyticData.senior} ({((analyticData.senior / analyticData.count) * 100).toFixed(2)}%)</li>
                    <br/>
                    <li>Gender</li>
                    <br/>
                    <li>Male: {analyticData.male} ({((analyticData.male / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Female: {analyticData.female} ({((analyticData.female / analyticData.count) * 100).toFixed(2)}%)</li>
                    <li>Other Genders: {analyticData.other} ({((analyticData.other / analyticData.count) * 100).toFixed(2)}%)</li>
                    <br/>
                    <li>Ethnicity</li>
                    <br/>
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

    function Assignment() {

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

    async function getResults() {
        await fetch('https://plextech-application-backend-production.up.railway.app/export_results', {
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
        await fetch('https://plextech-application-backend-production.up.railway.app/export_applications', {
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
        await fetch('http://127.0.0.1:5000/evaluate_results', {
            method: 'GET',
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

    const [resultAnalytics, setResultAnalytics] = useState({});

    function loadResultAnalytics() {
        const reviews = results.slice(1);

        console.log(reviews)

        const judgments = {};
        for (let grader of graders) {
            judgments[grader[1]] = {
                'rating0': [0],
                'rating1': [0],
                'rating2': [0],
                'rating3': [0],
            };
        }

        for (let review of reviews) {
            judgments[review['grader']]['rating0'].push(parseInt(review['rating0']));
            judgments[review['grader']]['rating1'].push(parseInt(review['rating1']));
            judgments[review['grader']]['rating2'].push(parseInt(review['rating2']));
            judgments[review['grader']]['rating3'].push(parseInt(review['rating3']));
        }

        for (let g of Object.keys(judgments)) {
            const count = judgments[g]['rating0'].length - 1
            judgments[g]['rating0'] = (judgments[g]['rating0'].reduce((a, b) => a + b) / count).toFixed(2);
            judgments[g]['rating1'] = (judgments[g]['rating1'].reduce((a, b) => a + b) / count).toFixed(2);
            judgments[g]['rating2'] = (judgments[g]['rating2'].reduce((a, b) => a + b) / count).toFixed(2);
            judgments[g]['rating3'] = (judgments[g]['rating3'].reduce((a, b) => a + b) / count).toFixed(2);
        }

        setResultAnalytics(judgments);
    }

    function ResultsAnalytics() {

        const keys = ['rating0', 'rating1', 'rating2', 'rating3'];

        return (
            <>
                <h4>Grader Rating Averages</h4>
                <div>

                    {keys.map(key => {
                        return (
                            <div>
                                <h6>{key}</h6>
                                <ul>
                                    {Object.keys(resultAnalytics).map(grader => (
                                        <li>{grader}: {resultAnalytics[grader][key]}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                <Button
                    style={{ display: "flex" }}
                    variant="contained"
                    color="neutral"
                    onClick={loadResultAnalytics}
                    className="loadResultAnalytics"
                >Refresh Results Analytics</Button>
            </>
        )
    }

    const [adminKey, setAdminKey] = useState('');
    const [flushMessage, setFlushMessage] = useState('');
    async function flushDatabase() {
        if (adminKey === 'plextechpermission') {
            await fetch("https://plextech-application-backend-production.up.railway.app/flush_database", {
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

                    <div className='horizontal-box'>
                        <h2>Applications</h2>
                        <Applications />
                    </div>

                    <div className='horizontal-box'>
                        <h2>Normalized Evaluations</h2>
                        <Evaluations />
                    </div>

                    <div className='horizontal-box'>
                        <h2>Result Analytics</h2>
                        <ResultsAnalytics />
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
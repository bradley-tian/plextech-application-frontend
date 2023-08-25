import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import "./styles.css";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

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

const GraderForm = () => {
  const navigate = useNavigate();
  const [userInfo, setData] = useState([{
    timestamp: "Loading applicants, please stand by...",
    firstName: "",
    lastName: "",
    resume: "",
    role: "",
    answer1: "",
    answer2: "",
    commitments: "",
    year: "",
    major: "",
    gender: "",
    linkedin: "N/A",
    website: "N/A",
    race: "",
  }]);

  const [resCommit, setResCommit] = useState("1");
  const [resLead, setResLead] = useState("1");
  const [resTech, setResTech] = useState("1");

  const [initiative, setInitiative] = useState("1");
  const [problem, setProblem] = useState("1");
  const [ansCommit, setAnsCommit] = useState("1");
  const [impact, setImpact] = useState("1");
  const [passion, setPassion] = useState("1");
  const [excellence, setExcellence] = useState("1");
  const [commitment, setcommitment] = useState("1");

  const [comment0, setComment0] = useState('');
  const [comment1, setComment1] = useState('');
  const [comment2, setComment2] = useState('');
  const [comment3, setComment3] = useState('');
  const [comment4, setComment4] = useState('');
  const [loadingMessage, setLoading] = useState('');
  const [essaySubmitted, setEssaySubmitted] = useState(false);
  const resumeRef = useRef(null);

  const navToHome = () => {
    navigate("/");
  };

  useEffect(
    () => {
      if (essaySubmitted) {
        resumeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, [essaySubmitted]
  );

  const { state } = useLocation();

  //Load Applicant Data
  async function fetchData() {
    let url = `${process.env.REACT_APP_API_URL}/get_applicant/` + state.email
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        return (response.json());
      })
      .then((data) => {

        function base64ToArrayBuffer(data) {
          var binaryString = window.atob(data);
          var binaryLen = binaryString.length;
          var byteArray = new Uint8Array(binaryLen);
          for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            byteArray[i] = ascii;
          }
          return byteArray;
        };

        const applicantData = []
        if (data.length === 0) {
          navigate('/complete')
        }

        for (let applicant of data) {
          var arrayBuffer = base64ToArrayBuffer(applicant.resume.slice(28));
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          const resumeURL = URL.createObjectURL(blob);

          applicantData.push({
            timestamp: applicant.time_created,
            firstName: applicant.first_name,
            lastName: applicant.last_name,
            resume: resumeURL,
            roles: applicant.desired_roles,
            answer1: applicant.answer1,
            answer2: applicant.answer2,
            answer3: applicant.answer3,
            commitments: applicant.commitments,
            year: applicant.year,
            major: applicant.major,
            gender: applicant.gender,
            race: applicant.race,
            linkedin: applicant.linkedin,
            website: applicant.website,
          })
        }
        setData(applicantData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  //Mounting Calls
  useEffect(() => {

    //Authentication Check
    async function checkUser(value) {
      await fetch(`${process.env.REACT_APP_API_URL}/check_grader`, {
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
            navigate('/member-login');
          }
        });
    };

    if (state === null) {
      navigate('/member-login');
    } else {
      checkUser(state);
    }

    fetchData();
    setLoading('');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className='form-field'>
        <Formik
          initialValues={{
            timestamp: userInfo[0].timestamp,
            firstName: userInfo[0].firstName,
            lastName: userInfo[0].lastName,
            resume: userInfo[0].resumeURL,
            roles: userInfo[0].roles,
            answer1: userInfo[0].answer1,
            answer2: userInfo[0].answer2,
            answer3: userInfo[0].answer3,
            commitments: userInfo[0].commitments,
            major: userInfo[0].major,
            year: userInfo[0].year,
            gender: userInfo[0].gender,
          }}
          onSubmit={async () => {
            setLoading('Submitting your application; please wait...');
            await fetch(`${process.env.REACT_APP_API_URL}/add_review`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({

                grader: state.email,
                comment0: comment0,
                resCommit: resCommit,
                resLead: resLead,
                resTech: resTech,
                comment1: comment1,
                initiative: initiative,
                problem: problem,
                comemnt2: comment2,
                ansCommit: ansCommit,
                impact: impact,
                comment3: comment3,
                passion: passion,
                excellence: excellence,
                comment4: comment4,
                commitment: commitment,
                applicantID: userInfo[0].timestamp,
              }),
            })
              .then(() => {
                let newData = userInfo;
                newData.shift();
                if (newData.length === 0) {
                  navigate('/complete')
                }
                setData(newData);
                window.scrollTo(0, 0);

                setResCommit('1');
                setResLead('1');
                setResTech('1');
                setInitiative('1');
                setProblem('1');
                setAnsCommit('1');
                setImpact('1');
                setPassion('1');
                setExcellence('1');
                setcommitment('1');
                setComment0('');
                setComment1('');
                setComment2('');
                setComment3('');
                setComment4('');
              });
          }}
        >
          {(formik) => (
            <div>
              <span>
                <Button
                  style={{ display: "flex" }}
                  variant="contained"
                  color="neutral"
                  onClick={navToHome}
                  className="navHome"
                >Return Home</Button>

                <h1 style={{ display: "flex" }}>
                  PlexTech Grader Portal
                </h1>
              </span>

              <div>
                <h4>
                  For each applicant, please provide the corresponding ratings and leave concise
                  comments for every response.
                </h4>

                <form onSubmit={formik.handleSubmit}>

                  <label htmlFor="timestamp">Applicant ID</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].timestamp != typeof undefined ? userInfo[0].timestamp : 'N/A'}</p>
                  </div>

                  <label htmlFor="firstName">First Name</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].firstName}</p>
                  </div>

                  <label htmlFor="lastName">Last Name</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].lastName}</p>
                  </div>

                  <label htmlFor="graduationYear">Graduation Year</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].year}</p>
                  </div>

                  <label htmlFor="major">Major</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].major}</p>
                  </div>

                  {/* Not shown because we eliminated DE&I factors in application reviews */}
                  {/* <label htmlFor="gender">Gender</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].gender}</p>
                  </div>

                  <label htmlFor="race">Demographics</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].race != typeof undefined ? userInfo[0].race : 'N/A'}</p>
                  </div> */}

                  <label htmlFor="website">Personal Website</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].website != typeof undefined ? userInfo[0].website : 'None'}</p>
                  </div>

                  <label htmlFor="linkedin">LinkedIn</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].linkedin != typeof undefined ? userInfo[0].linkedin : 'None'}</p>
                  </div>

                  <label htmlFor="roles">Desired roles</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].roles != typeof undefined ? userInfo[0].roles : "Not Specified"}</p>
                  </div>

                  {
                    essaySubmitted
                      ? <></>
                      : <>
                        {/* Essay Question 1 */}
                        <div className="horizontal-box">
                          <h4 style={{ color: '#ec6f34' }}>Question 1</h4>
                          <label htmlFor="answer1">
                            Why do you want to join PlexTech?
                          </label>
                          <p>{userInfo[0].answer1}</p>

                          <label htmlFor="comment1">Comment</label>

                          <textarea
                            className="commentHeight"
                            id="comment1"
                            type="text"
                            wrap="soft"
                            value={comment1}
                            onChange={(event) => { setComment1(event.target.value) }}
                          />

                          <label htmlFor="res">
                            How well does the applicant demonstrate their ability to take on initiatives?
                          </label>
                          <select className="dropbtn" name="initiative" value={initiative} onChange={(event) => { setInitiative(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No trace at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Clear signs of unique initiatives taken)</option>
                          </select>

                          <label htmlFor="res">
                            How well does the applicant demonstrate their problem-solving abilities?
                          </label>
                          <select className="dropbtn" name="problem" value={problem} onChange={(event) => { setProblem(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No trace at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Clear, impressive description of problem-solving processes)</option>
                          </select>
                        </div>

                        <br />

                        {/* Essay Question 2 */}
                        <div className="horizontal-box">
                          <h4 style={{ color: '#ec6f34' }}>Question 2</h4>
                          <label htmlFor="essay2">
                            Tell us about a community that's especially important to you.
                          </label>
                          <p>{userInfo[0].answer2}</p>

                          <label htmlFor="comment2">Comment</label>
                          <textarea
                            className="commentHeight"
                            id="comment2"
                            type="text"
                            wrap="soft"
                            value={comment2}
                            onChange={(event) => { setComment2(event.target.value) }}
                          />

                          <label htmlFor="answer2Rating">
                            How well does the applicant demonstrate their ability to commit to a community?
                          </label>
                          <select className="dropbtn" name="commitment" value={ansCommit} onChange={(event) => { setAnsCommit(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (Not at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Exhibiting strong willingness to commit to a community)</option>
                          </select>

                          <label htmlFor="answer2Rating">
                            To what extent has the applicant impacted their community?
                          </label>
                          <select className="dropbtn" name="impact" value={impact} onChange={(event) => { setImpact(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No sign at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Significant impacts to the community)</option>
                          </select>
                        </div>

                        <br />

                        {/* Essay Question 3 */}
                        <div className="horizontal-box">
                          <h4 style={{ color: '#ec6f34' }}>Question 3</h4>
                          <label htmlFor="essay3">
                            Tell us about a time when you "hacked a system."
                          </label>
                          <p>{userInfo[0].answer3}</p>

                          <label htmlFor="comment3">Comment</label>
                          <textarea
                            className="commentHeight"
                            id="comment3"
                            type="text"
                            wrap="soft"
                            value={comment3}
                            onChange={(event) => { setComment3(event.target.value) }}
                          />

                          <label htmlFor="answer3Rating">
                            How well does the applicant exhibit a sense of passion for learning and solving problems?
                          </label>
                          <select className="dropbtn" name="passion" value={passion} onChange={(event) => { setPassion(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No sign at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (An avid passion is exhibited)</option>
                          </select>

                          <label htmlFor="answer3Rating">
                            To what extent did the applicant go above and beyond in their project?
                          </label>
                          <select className="dropbtn" name="passion" value={excellence} onChange={(event) => { setExcellence(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No sign at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Impressive excellence is shown)</option>
                          </select>
                        </div>

                        <br />

                        {/* Time Commitments */}
                        <div className="horizontal-box">
                          <h4 style={{ color: '#ec6f34' }}>Time Commitments</h4>
                          <p>{userInfo[0].commitments}</p>

                          <label htmlFor="comment4">Comment</label>
                          <textarea
                            className="commentHeight"
                            id="comment4"
                            type="text"
                            wrap="soft"
                            value={comment4}
                            onChange={(event) => { setComment4(event.target.value) }}
                          />

                          <label htmlFor="commitment">
                            Do the applicant's commitments seem concerning (WAY too many clubs, insane unit count, etc.)?
                          </label>
                          <select className="dropbtn" name="commitment" value={commitment} onChange={(event) => { setcommitment(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={3}>Not at all</option>
                            <option value={2}>Could be a problem</option>
                            <option value={1}>RED FLAG</option>
                          </select>
                        </div>

                        <br />

                        <p>
                          Please confirm your essay reviews before moving onto the next section. You cannot go back and edit your current responses beyond this point.
                        </p>

                        <div className='horizontal-box'>
                          <Button
                            onClick={() => {
                              setEssaySubmitted(true);
                            }}
                            variant="contained"
                            color="neutral"
                            fontWeight="Bold"
                          >
                            Confirm Essay Reviews
                          </Button>
                        </div>

                      </>
                  }
                  <br ref={resumeRef} />

                  {
                    essaySubmitted
                      ? <>
                        <h4 style={{ color: '#ec6f34' }}>Resume/CV</h4>

                        {/* Resume */}
                        <div className="horizontal-box">
                          <iframe src={userInfo[0].resume} />
                          <label htmlFor="comment0">Comment</label>
                          <textarea
                            className="commentHeight"
                            id="comment0"
                            type="text"
                            wrap="soft"
                            value={comment0}
                            onChange={(event) => { setComment0(event.target.value) }}
                          />

                          <label htmlFor="resCom">
                            Do experiences in the applicant's resume exhibit consistency and commitment?
                          </label>
                          <select className="dropbtn" name="resCommit" value={resCommit} onChange={(event) => { setResCommit(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (Not at all)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (A perfect amount)</option>
                          </select>

                          <label htmlFor="res">
                            What quality of leadership experiences does the applicant's resume display?
                          </label>
                          <select className="dropbtn" name="resLead" value={resLead} onChange={(event) => { setResLead(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No leadership experience)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Major leadership experiences)</option>
                          </select>

                          <label htmlFor="res">
                            What kind of technical experience (don't need to be CS-related: bio, engineering, math, etc.) does the applicant's resume display?
                          </label>
                          <select className="dropbtn" name="resTech" value={resTech} onChange={(event) => { setResTech(event.target.value) }}>
                            <option value="" disabled={true}>Choose a rating:</option>
                            <option value={1}>1 (No technical experience)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (Significant technical experiences)</option>
                          </select>
                        </div>
                      </>
                      : <></>
                  }

                  <br />

                  {/* Submit Button */}
                  <div className='horizontal-box'>
                    <Button
                      type="submit"
                      variant="contained"
                      color="neutral"
                      fontWeight="Bold"
                    >
                      Submit
                    </Button>
                  </div>
                  <p>{loadingMessage}</p>
                </form>
              </div>
            </div>
          )
          }
        </Formik >
      </div >
      <br />
    </ThemeProvider >
  );
};

export default GraderForm;

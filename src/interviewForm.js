import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import "./styles.css";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';

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

const InterviewForm = () => {
  const navigate = useNavigate();
  const [userInfo, setData] = useState([{
    timestamp: "Loading applicants, please stand by...",
    firstName: "",
    lastName: "",
    resume: "",
    role: "",
    answer1: "",
    answer2: "",
    r0s: "",
    year: "",
    major: "",
    gender: "",
    linkedin: "N/A",
    website: "N/A",
    race: "",
  }]);

  const [r1, setR1] = useState("1");
  const [r2, setR2] = useState("1");
  const [r3, setR3] = useState("1");

  const [r4, setR4] = useState("1");
  const [r5, setR5] = useState("1");
  const [r6, setR6] = useState("1");
  const [r7, setR7] = useState("1");
  const [r8, setR8] = useState("1");
  const [r9, setR9] = useState("1");
  const [r0, setr0] = useState("1");

  const [comment0, setComment0] = useState('');
  const [comment1, setComment1] = useState('');
  const [comment2, setComment2] = useState('');
  const [comment3, setComment3] = useState('');
  const [comment4, setComment4] = useState('');
  const [loadingMessage, setLoading] = useState('');
  const [essaySubmitted, setEssaySubmitted] = useState(false);
  const resumeRef = useRef(null);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);

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

  useEffect(
    () => {
      setLoading("");
    }, [completed]
  )

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

        setTotal(data.length);

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
            navigate('/interview-login');
          }
        });
    };

    if (state === null) {
      navigate('/interview-login');
    } else {
      checkUser(state);
    }

    // fetchData();
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
            setLoading('Submitting your review; please wait...');
            await fetch(`${process.env.REACT_APP_API_URL}/add_interview_review`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({

                grader: state.email,
                comment0: comment0,
                r1: r1,
                r2: r2,
                r3: r3,
                comment1: comment1,
                r4: r4,
                r5: r5,
                comemnt2: comment2,
                r6: r6,
                r7: r7,
                comment3: comment3,
                r8: r8,
                r9: r9,
                comment4: comment4,
                r0: r0,
                applicantID: userInfo[0].timestamp,
              }),
            })
              .then(() => {
                navigate('/interview-complete');
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
                  PlexTech Interview Portal
                </h1>
              </span>

              <div>
                <h4>
                  Please look up the interviewee below.
                </h4>

                <form onSubmit={formik.handleSubmit}>

                  <div className="horizontal-box">
                    <label htmlFor="first-name">First Name</label>
                    <input
                      id="last-name"
                      type="text"
                      {...formik.getFieldProps('first-name')} />
                    <label htmlFor="last-name">Last Name</label>
                    <input
                      id="last-name"
                      type="text"
                      {...formik.getFieldProps('last-name')} />
                  </div>

                  <label htmlFor="timestamp">Applicant ID</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].timestamp != typeof undefined ? userInfo[0].timestamp : 'N/A'}</p>
                  </div>

                  <label htmlFor="graduationYear">Graduation Year</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].year}</p>
                  </div>

                  <label htmlFor="major">Major</label>
                  <div className="horizontal-box">
                    <p>{userInfo[0].major}</p>
                  </div>

                  <label htmlFor="roles">Desired roles</label>
                  <div className="horizontal-box">
                    <p>{typeof userInfo[0].roles != typeof undefined ? userInfo[0].roles : "Not Specified"}</p>
                  </div>

                  <>
                    {/* Essay Question 1 */}
                    <div className="horizontal-box">
                      <h4 style={{ color: '#ec6f34' }}>Background Information</h4>
                      <label htmlFor="res">
                        How much coding experience does the interviewee have?
                      </label>
                      <select className="dropbtn" name="r4" value={r4} onChange={(event) => { setR4(event.target.value) }}>
                        <option value="" disabled={true}>Choose an option:</option>
                        <option value={1}>Taken 61B or higher</option>
                        <option value={2}>Taken 61A or equivalent</option>
                        <option value={3}>Concurrently taking 61A</option>
                        <option value={4}>Some experiences from high school</option>
                        <option value={5}>No prior experience</option>
                      </select>
                      <label htmlFor="comment0">
                        Describe the interviewee's coding experience in 1-2 sentences.
                      </label>
                      <textarea
                        className="commentHeight"
                        id="comment0"
                        type="text"
                        wrap="soft"
                        value={comment0}
                        onChange={(event) => { setComment0(event.target.value) }}
                      />
                    </div>

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
                        To what degree does the applicant demonstrate leadership skills in their community?
                      </label>
                      <select className="dropbtn" name="leadership" value={r6} onChange={(event) => { setR6(event.target.value) }}>
                        <option value="" disabled={true}>Choose a rating:</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>

                      <label htmlFor="answer2Rating">
                        How well does the applicant show commitment to their community?
                      </label>
                      <select className="dropbtn" name="r7" value={r7} onChange={(event) => { setR7(event.target.value) }}>
                        <option value="" disabled={true}>Choose a rating:</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
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
                        To what degree does the applicant demonstrate creativity in their endeavor?
                      </label>
                      <select className="dropbtn" name="r8" value={r8} onChange={(event) => { setR8(event.target.value) }}>
                        <option value="" disabled={true}>Choose a rating:</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>

                      <label htmlFor="answer3Rating">
                        To what degree does the applicant demonstrate passion for learning in their endeavor?
                      </label>
                      <select className="dropbtn" name="r9" value={r9} onChange={(event) => { setR9(event.target.value) }}>
                        <option value="" disabled={true}>Choose a rating:</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>

                    <br />

                    {/* Time R0s */}
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

                      <label htmlFor="r0">
                        Do the applicant's time commitments seem concerning (WAY too many clubs, insane unit count, etc.)?
                      </label>
                      <select className="dropbtn" name="r0" value={r0} onChange={(event) => { setr0(event.target.value) }}>
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

                  <br ref={resumeRef} />

                  {/* Submit Button */}
                  {
                    essaySubmitted ? <div className='horizontal-box'>
                      <Button
                        type="submit"
                        variant="contained"
                        color="neutral"
                        fontWeight="Bold"
                      >
                        Submit
                      </Button>
                    </div> : <></>
                  }
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

export default InterviewForm;
import React, { useState, useEffect } from "react";
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
    timestamp: "(ERROR) No applicant is assigned to this grader.",
    firstName: "",
    lastName: "",
    resume: "",
    answer1: "",
    answer2: "",
    commitments: "",
    year: "",
    major: "",
    gender: "",
  }]);
  const [rating0, setRating0] = useState("1");
  const [rating1, setRating1] = useState("1");
  const [rating2, setRating2] = useState("1");
  const [rating3, setRating3] = useState("1");
  const [comment0, setComment0] = useState('');
  const [comment1, setComment1] = useState('');
  const [comment2, setComment2] = useState('');
  const [comment3, setComment3] = useState('');

  const navToHome = () => {
    navigate("/");
  };

  const { state } = useLocation();

  //Load Applicant Data
  async function fetchData() {
    let url = "https://plextech-application-backend-production.up.railway.app/get_applicant/" + state.email
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
            answer1: applicant.answer1,
            answer2: applicant.answer2,
            commitments: applicant.commitments,
            year: applicant.year,
            major: applicant.major,
            gender: applicant.gender,
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
      await fetch('https://plextech-application-backend-production.up.railway.app/check_grader', {
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
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Formik
        initialValues={{
          timestamp: userInfo[0].timestamp,
          firstName: userInfo[0].firstName,
          lastName: userInfo[0].lastName,
          resume: userInfo[0].resumeURL,
          answer1: userInfo[0].answer1,
          answer2: userInfo[0].answer2,
          commitments: userInfo[0].commitments,
          major: userInfo[0].major,
          year: userInfo[0].year,
          gender: userInfo[0].gender,
        }}
        onSubmit={async () => {
          await fetch('https://plextech-application-backend-production.up.railway.app/add_review', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              grader: state.email,
              comment0: comment0,
              rating0: rating0,
              comment1: comment1,
              rating1: rating1,
              comemnt2: comment2,
              rating2: rating2,
              comment3: comment3,
              rating3: rating3,
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
              setRating0('1');
              setRating1('1');
              setRating2('1');
              setRating3('1');
              setComment0('');
              setComment1('');
              setComment2('');
              setComment3('');
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
                For each applicant, please provide a rating and leave thorough
                comments for every essay question.
              </h4>

              <form onSubmit={formik.handleSubmit}>

                <label htmlFor="timestamp">Timestamp</label>
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

                <label htmlFor="gender">Gender</label>
                <div className="horizontal-box">
                  <p>{userInfo[0].gender}</p>
                </div>

                <label htmlFor="resume">Resume/CV</label>

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

                  <label htmlFor="rating0">
                    Overall resume quality:
                  </label>
                  <select className="dropbtn" name="rating0" value={rating0} onChange={(event) => { setRating0(event.target.value) }}>
                    <option value="" disabled={true}>Choose a rating:</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                {/* Essay Question 1 */}
                <div className="horizontal-box">
                  <label htmlFor="answer1">
                    Long Answer: Why PlexTech?
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

                  <label htmlFor="rating1">
                    Choose a rating for this essay question:
                  </label>
                  <select className="dropbtn" name="rating1" value={rating1} onChange={(event) => { setRating1(event.target.value) }}>
                    <option value="" disabled={true}>Choose a rating:</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                {/* Essay Question 2 */}
                <div className="horizontal-box">
                  <label htmlFor="essay2">
                    Long Answer: A Story about Yourself
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

                  <label htmlFor="rating2">
                    Choose a rating for this essay question:
                  </label>
                  <select className="dropbtn" name="rating2" value={rating2} onChange={(event) => { setRating2(event.target.value) }}>
                    <option value="" disabled={true}>Choose a rating:</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                {/* Time Commitments */}
                <div className="horizontal-box">
                  <label htmlFor="commitments">
                    Time Commitments
                  </label>
                  <p>{userInfo[0].commitments}</p>

                  <label htmlFor="comment3">Comment</label>
                  <textarea
                    className="commentHeight"
                    id="comment3"
                    type="text"
                    wrap="soft"
                    value={comment3}
                    onChange={(event) => { setComment3(event.target.value) }}
                  />

                  <label htmlFor="rating3">
                    Choose a rating for this essay question:
                  </label>
                  <select className="dropbtn" name="rating3" value={rating3} onChange={(event) => { setRating3(event.target.value) }}>
                    <option value="" disabled={true}>Choose a rating:</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        )}
      </Formik>
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
      <br />
    </ThemeProvider>
  );
};

export default GraderForm;

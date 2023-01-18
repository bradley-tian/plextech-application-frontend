import React from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import "./styles.css";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import PlexTechLogo from './PlexTechLogo.png'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//Theme Configuration
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

//Role Selector Configuration
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const roles = [
  'Member',
  'Curriculum Instructor',
];

function getStyles(role, roles, theme) {
  return {
    fontWeight:
      roles.indexOf(role) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function RoleSelector(props) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    props.setRoles(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <FormControl id='roleSelector' sx={{ m: 1, width: '70%' }}>
        <label id="desiredRoles">Intended Roles (Select all that apply)</label>
        <Select
          labelId="roles"
          id="roles"
          multiple
          value={props.roles}
          onChange={handleChange}
          input={<OutlinedInput label="Role" />}
          MenuProps={MenuProps}
        >
          {roles.map((role) => (
            <MenuItem
              key={role}
              value={role}
              style={getStyles(role, roles, theme)}
            >
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>


  );
}


const ApplicationForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState([]);
  const [resume, setResume] = React.useState('');
  const [year, setYear] = React.useState('2023');
  const [gender, setGender] = React.useState('');
  const [loadingMessage, setLoading] = React.useState('');
  const [roleMessage, setRoleMessage] = React.useState('');
  const [resumeMessage, setResumeMessage] = React.useState('');

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async function saveResume(event) {
    const file = event.target.files[0];
    const base64 = await getBase64(file);
    if (base64.length > 5242880) {
      setResumeMessage('Max file size is 5MB.')
    } else {
      setResume(base64);
    }
  }

  const navToHome = () => {
    navigate("/");
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div>
          <ThemeProvider theme={theme}>

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                timestamp: Date.now(),
                desiredRoles: [],
                answer1: '',
                answer2: '',
                answer3: '',
                commitments: '',
                major: '',
                gender: '',
              }}
              validationSchema={
                Yup.object(
                  {
                    firstName: Yup.string().required('Required'),
                    lastName: Yup.string().required('Required'),
                    email: Yup.string().required('Required'),
                    answer1: Yup.string().required('Required').max(1000, 'Response must not exceed 1000 characters.'),
                    answer2: Yup.string().required('Required').max(1000, 'Response must not exceed 1000 characters.'),
                    answer3: Yup.string().required('Required').max(1000, 'Response must not exceed 1000 characters.'),
                    commitments: Yup.string().required('Required'),
                    major: Yup.string().required('Required'),
                  }
                )
              }
              onSubmit={async (values) => {
                if (role.length === 0) {
                  setRoleMessage('required')
                }
                if (resume.length === 0) {
                  setResumeMessage('required')
                }
                if (gender === '') {
                  setGender(values.gender);
                }
                else {
                  setLoading('Submitting your application; please wait...')
                  await fetch('https://plextech-application-backend-production.up.railway.app/add_applicant', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                      first_name: values.firstName,
                      last_name: values.lastName,
                      email: values.email,
                      time_created: values.timestamp,
                      desired_roles: values.desiredRoles,
                      resume: resume,
                      answer1: values.answer1,
                      answer2: values.answer2,
                      answer3: values.answer3,
                      commitments: values.commitments,
                      year: year,
                      major: values.major,
                      gender: gender,
                      assigned_to: [],
                      graded_by: [],
                    })
                  }).then((response) => {
                    if (response.ok) {
                      navigate('/success', { replace: true, state: { UID: values.timestamp } });
                    } else {
                      fetch('https://plextech-application-backend-production.up.railway.app/report_error',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({
                          first_name: values.firstName,
                          last_name: values.lastName,
                          email: values.email,
                          time_created: values.timestamp,
                        })
                      });
                      setLoading('An error occurred while submitting your application; please contact us if the error persists.')
                    }
                  });
                }
              }}
            >
              {formik => (
                <div className='form-field'>
                  <span>
                    <div style={{ justifyContent: "right", display: "flex" }}>
                      <div>
                        <Button style={{
                          "display": "flex", "fontFamily": "DM Sans",
                        }}
                          variant="contained"
                          color="neutral"
                          onClick={navToHome}
                          className="navHome">Return Home</Button>
                      </div>
                    </div>



                  </span>

                  <div>
                    <div className="title-headers">
                      <img src={PlexTechLogo} alt="react logo" style={{ width: '80px', }} />
                      <h1>PlexTech Application - Spring 2023</h1>

                      <br />
                      <h4>Thank you for your interest in PlexTech!<br />Please fill out the information below and we will get back to you soon. </h4>
                      <p>All applications submitted are final; duplicates will not be accepted.</p>

                    </div>


                    <form onSubmit={formik.handleSubmit}>

                      {/* First Name */}
                      <div className="horizontal-box">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          id="firstName"
                          type="text"
                          {...formik.getFieldProps('firstName')} />
                        {formik.touched.firstName && formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
                      </div>

                      {/* Last Name */}
                      <div className="horizontal-box">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          {...formik.getFieldProps('lastName')} />
                        {formik.touched.lastName && formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
                      </div>

                      {/* Email */}
                      <div className="horizontal-box">
                        <label htmlFor="email">Berkeley Email</label>
                        <input
                          id="email"
                          type="text"
                          {...formik.getFieldProps('email')} />
                        {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
                      </div>

                      {/* Year */}
                      <div className="horizontal-box">
                        <label htmlFor="graduationYear">Graduation Year</label>
                        <select className="dropbtn" name="year" value={year} onChange={(event) => { setYear(event.target.value) }}>
                          <option value="" disabled={true}>Choose your graduation year:</option>
                          <option value={"2023"}>2023</option>
                          <option value={"2024"}>2024</option>
                          <option value={"2025"}>2025</option>
                          <option value={"2026"}>2026</option>
                        </select>
                      </div>

                      <div className="horizontal-box">
                        {/* Major */}
                        <label htmlFor="major">Major</label>
                        <input
                          id="major"
                          type="text"
                          {...formik.getFieldProps('major')} />
                        {formik.touched.major && formik.errors.major ? <div>{formik.errors.major}</div> : null}
                      </div>

                      <div className="horizontal-box">
                        {/* Gender */}
                        <label htmlFor="gender">Gender</label>
                        <select className="dropbtn" name="gender" value={gender} onChange={(event) => { setGender(event.target.value) }}>
                          <option value="" disabled={true}>Please select: </option>
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                          <option value={"Other"}>Other</option>
                        </select>

                        <label htmlFor="gender">(If selected 'Other,' please specify below:)</label>
                        <input
                          id="gender"
                          type="text"
                          {...formik.getFieldProps('gender')} />
                      </div>

                      {/* Desired Roles */}
                      <div className="horizontal-box">
                        <RoleSelector id='desiredRoles' roles={role} setRoles={setRole} />
                        <p>{roleMessage}</p>
                      </div>

                      {/* Resume Upload */}
                      <div className="horizontal-box">
                        <label htmlFor="resume">Resume / CV</label>
                        <p>Please limit your resume to one page.</p>
                        <input
                          type='file'
                          accept='application/pdf'
                          onChange={saveResume}
                        />
                        <p>{resumeMessage}</p>
                      </div>

                      {/* Long Answer 1 */}
                      <div className="horizontal-box">
                        <label htmlFor="answer1">Describe how you have taken advantage of a significant opportunity or worked to overcome a barrier you have faced.</label>
                        <p>(~200 words)</p>
                        <textarea
                          id='answer1'
                          type='text'
                          {...formik.getFieldProps('answer1')} />
                        {formik.touched.answer1 && formik.errors.answer1 ? <div>{formik.errors.answer1}</div> : null}

                      </div>

                      {/* Long Answer 2 */}
                      <div className="horizontal-box">
                        <label htmlFor="answer2">Tell us about a community that’s especially important to you: how did you contribute to this community, and what makes it so inspiring? </label>
                        <p>(~200 words)</p>
                        <textarea
                          id='answer2'
                          type='text'
                          {...formik.getFieldProps('answer2')} />
                        {formik.touched.answer2 && formik.errors.answer2 ? <div>{formik.errors.answer2}</div> : null}
                      </div>

                      {/* Long Answer 3 */}
                      <div className="horizontal-box">
                        <label htmlFor="answer3">Discuss a technical (not necessarily CS-related; could be robotics, graphic design, etc.) project you’ve worked on in the past.</label>
                        <p>(~200 words)</p>
                        <textarea
                          id='answer3'
                          type='text'
                          {...formik.getFieldProps('answer3')} />
                        {formik.touched.answer3 && formik.errors.answer3 ? <div>{formik.errors.answer3}</div> : null}
                      </div>

                      {/* EC Commitments */}
                      <div className="horizontal-box">
                        <label htmlFor="commitments">Please tell us about your commitments this semester.</label>
                        <p>(Example: CS61A: xx hours)</p>
                        <textarea
                          id='commitments'
                          type='text'
                          {...formik.getFieldProps('commitments')} />
                        {formik.touched.commitments && formik.errors.commitments ? <div>{formik.errors.commitments}</div> : null}
                      </div>

                      {/* Timestamp */}
                      <div className="horizontal-box">
                        <label htmlFor="timestamp" style={{ "color": "#ff8a00" }}>Your Application ID</label>
                        <p>Please save this ID and refer to it should you need to contact us regarding your application.</p>
                        <input
                          id="timestamp"
                          name="timestamp"
                          type="text"
                          readOnly
                          value={formik.values.timestamp} />
                      </div>

                      {/* Submit Button */}
                      <div>
                        <Button type="submit"
                          variant="contained"
                          color="neutral"
                          fontWeight="Bold"
                          style={{ "marginBottom": "50px" }}
                        >Submit</Button>
                      </div>
                      <p>{loadingMessage}</p>
                      <p className="copyright">Copyright © 2023 PlexTech All Rights Reserved.</p>
                    </form>
                  </div>
                </div>
              )}
            </Formik>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
import React from "react";
import { Formik } from "formik";
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
  const [race, setRace] = React.useState('');

  const [loadingMessage, setLoading] = React.useState('');

  const [firstNameMessage, setFirst] = React.useState('');
  const [lastNameMessage, setLast] = React.useState('');
  const [emailMessage, setEmail] = React.useState('');
  const [phoneMessage, setPhone] = React.useState('');
  const [majorMessage, setMajor] = React.useState('');
  const [roleMessage, setRoleMessage] = React.useState('');
  const [resumeMessage, setResumeMessage] = React.useState('');
  const [raceMessage, setRaceMessage] = React.useState('');
  const [answer1Message, set1] = React.useState('');
  const [answer2Message, set2] = React.useState('');
  const [answer3Message, set3] = React.useState('');
  const [commitmentMessage, setCommitment] = React.useState('');


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
                phone: '',
                linkedin: '',
                website: '',
                timestamp: Date.now(),
                desiredRoles: [],
                answer1: '',
                answer2: '',
                answer3: '',
                commitments: '',
                major: '',
                gender: '',
                race: '',
              }}

              onSubmit={async (values) => {
                let flagged = false;
                if (values.firstName === '') {
                  setFirst('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (values.lastName === '') {
                  setLast('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (values.email === '') {
                  setEmail('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (values.phone === '') {
                  setPhone('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (values.major === '') {
                  setMajor('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (values.answer1 === '') {
                  set1('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                } else if (values.answer1.length > 1500) {
                  set1('Your answer must not exceed 1500 characters.')
                  flagged = true;
                  if (loadingMessage !== 'Please fill out the required fields above.') {
                    setLoading('Please modify the fields above to meet requirements.');
                  }
                }
                if (values.answer2 === '') {
                  set2('required');
                  flagged = true;
                } else if (values.answer2.length > 1500) {
                  set2('Your answer must not exceed 1500 characters.');
                  flagged = true;
                  if (loadingMessage !== 'Please fill out the required fields above.') {
                    setLoading('Please modify the fields above to meet requirements.');
                  }
                }
                if (values.answer3 === '') {
                  set3('required');
                  flagged = true;
                } else if (values.answer3.length > 1500) {
                  set3('Your answer must not exceed 1500 characters.');
                  flagged = true;
                  if (loadingMessage !== 'Please fill out the required fields above.') {
                    setLoading('Please modify the fields above to meet requirements.');
                  }
                }
                if (values.commitments === '') {
                  setCommitment('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (role.length === 0) {
                  setRoleMessage('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (resume.length === 0) {
                  setResumeMessage('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (race === '') {
                  setRaceMessage('required');
                  setLoading('Please fill out the required fields above.');
                  flagged = true;
                }
                if (gender === '') {
                  setGender(values.gender);
                }
                if (flagged === false) {
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
                      phone: values.phone,
                      time_created: values.timestamp,
                      desired_roles: role,
                      resume: resume,
                      linkedin: values.linkedin,
                      website: values.website,
                      answer1: values.answer1,
                      answer2: values.answer2,
                      answer3: values.answer3,
                      commitments: values.commitments,
                      year: year,
                      major: values.major,
                      gender: gender,
                      race: race,
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
                            phone: values.phone,
                            time_created: values.timestamp,
                          })
                        });
                      setLoading('An error occurred while submitting your application; please contact us at plextech@berkeley.edu if the error persists.')
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
                        <p className='warning'>{firstNameMessage}</p>
                      </div>

                      {/* Last Name */}
                      <div className="horizontal-box">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          {...formik.getFieldProps('lastName')} />
                        <p className='warning'>{lastNameMessage}</p>
                      </div>

                      {/* Email */}
                      <div className="horizontal-box">
                        <label htmlFor="email">Berkeley Email</label>
                        <input
                          id="email"
                          type="text"
                          {...formik.getFieldProps('email')} />
                        <p className='warning'>{emailMessage}</p>
                      </div>

                      {/* Phone */}
                      <div className="horizontal-box">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          id="phone"
                          type="text"
                          {...formik.getFieldProps('phone')} />
                        <p className='warning'>{phoneMessage}</p>
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
                        <p className='warning'>{majorMessage}</p>
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

                      { /* Demographics */}
                      <div>
                        <label htmlFor="race">
                          Your Demographic Background
                        </label>
                        <select className="dropbtn" name="race" value={race} onChange={(event) => { setRace(event.target.value) }}>
                          <option value="" disabled={true}>Select from below:</option>
                          <option value={"American Indian or Alaska Native"}>American Indian or Alaska Native</option>
                          <option value={"Asian (including Indian subcontinent and Philippines origin)"}>Asian (including Indian subcontinent and Philippines origin)</option>
                          <option value={"Black or African American"}>Black or African American</option>
                          <option value={"White"}>White</option>
                          <option value={"Hispanic or Latino"}>Hispanic or Latino</option>
                          <option value={"Middle Eastern"}>Middle Eastern</option>
                          <option value={"Native American or Other Pacific Islander"}>Native American or Other Pacific Islander</option>
                          <option value={"Prefer not to answer"}>Prefer not to answer</option>
                        </select>
                        <p className='warning'>{raceMessage}</p>
                      </div>

                      {/* Desired Roles */}
                      <div className="horizontal-box">
                        <RoleSelector id='desiredRoles' roles={role} setRoles={setRole} />
                        <p className='warning'>{roleMessage}</p>
                      </div>

                      {/* Resume Upload */}
                      <div className="horizontal-box">
                        <label htmlFor="resume">Resume / CV</label>
                        <p>Please limit your resume to a one-page PDF document.</p>
                        <input
                          type='file'
                          accept='application/pdf'
                          onChange={saveResume}
                        />
                        <p className="warning">{resumeMessage}</p>
                      </div>

                      {/* LinkedIn */}
                      <div className="horizontal-box">
                        <label htmlFor="linkedin">LinkedIn Profile (optional)</label>
                        <input
                          id="linkedin"
                          type="text"
                          {...formik.getFieldProps('linkedin')} />
                      </div>

                      {/* LinkedIn */}
                      <div className="horizontal-box">
                        <label htmlFor="website">Personal Website (optional)</label>
                        <input
                          id="website"
                          type="text"
                          {...formik.getFieldProps('website')} />
                      </div>

                      {/* Long Answer 1 */}
                      <div className="horizontal-box">
                        <label htmlFor="answer1">Describe how you have taken advantage of a significant opportunity or worked to overcome a barrier you have faced.</label>
                        <p>(~200 words)</p>
                        <textarea
                          id='answer1'
                          type='text'
                          {...formik.getFieldProps('answer1')} />
                        <p className='warning'>{answer1Message}</p>

                      </div>

                      {/* Long Answer 2 */}
                      <div className="horizontal-box">
                        <label htmlFor="answer2">Tell us about a community that’s especially important to you: how did you contribute to this community, and what makes it so inspiring? </label>
                        <p>(~200 words)</p>
                        <textarea
                          id='answer2'
                          type='text'
                          {...formik.getFieldProps('answer2')} />
                        <p className='warning'>{answer2Message}</p>
                      </div>

                      {/* Long Answer 3 */}
                      <div className="horizontal-box">
                        <label htmlFor="answer3">Discuss a technical (not necessarily CS-related; could be robotics, graphic design, etc.) project you’ve worked on in the past.</label>
                        <p>(~200 words)</p>
                        <textarea
                          id='answer3'
                          type='text'
                          {...formik.getFieldProps('answer3')} />
                        <p className='warning'>{answer3Message}</p>
                      </div>

                      {/* EC Commitments */}
                      <div className="horizontal-box">
                        <label htmlFor="commitments">Please tell us about your commitments this semester.</label>
                        <p>(Example: CS61A: xx hours)</p>
                        <textarea
                          id='commitments'
                          type='text'
                          {...formik.getFieldProps('commitments')} />
                        <p className='warning'>{commitmentMessage}</p>
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
                        <p className='warning'>{loadingMessage}</p>
                      </div>
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
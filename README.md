# PlexTech Applicant Portal - Frontend

Welcome to the frontend application of the PlexTech applicant portal. 
This readme only provides a high-level overview of the entire project; for more details, refer to comments within each component file.

This project primarily consists of three components - the application form, the grading interface, and the administrator console, with the last two being reserved for PlexTech members only. 

For the backend repository, please visit [this link](https://github.com/bradley-tian/plextech-application-backend).

## Application Form

For more details, refer to applicationForm.js. 

This form contains standard applicant questions - name, contacts, year, major, demographics, etc., a resume drop (PDF format, 5MB max), three essay questions, and extra space for time commitments. Upon deploying each semester, the hot-swappable information at the top of the file - graduation year, names, etc. - must be updated accordingly. In addition, content switches in app.js and home.js must be updated per each beginning/end of the recruitment window to start/end applications.

To change the essay question prompts, refer to the Administrator Console.

## Grading Interface

For more details, refer to graderForm.js.

This interface is used by PlexTech members to conduct the initial review of all applications. For each aspect of the application, the grader will evaluate the applicant based on a scale of 1-4. In addition, they will also comment the reasons for their judgement. 

For curriculum student roles, a majority of emphasis is placed on the applicant's essay responses as opposed to their resume. For more technically demanding roles, the resume may be assigned a heavier weight. To minimize resume bias in grading, for each applicant, the essay responses will be evaluated first, and only then will the applicant's resume be visible for evaluation. 

For more information on application distribution between members as well as evaluation metrics, please visit the backend repository. 

## Administrator Console

For more details, refer to adminConsole.js.

This interface facilitates all logistic operations, such as the management of member rosters, the consolidation of applicant statistics, the distribution of applications to graders, and the editing of essay question prompts. The administrator console handles most complexities of interacting with important information. 

## Security

The grading interface and administrator console are member-only and require user login. Please note that attempts on path attacks, XSS, injections, TOCTTOU, and other form of attacks are prevented with countermeasures; in addition, these actions will be logged for review. 

## Rights of Use and Inquiries

The PlexTech Applicant Portal is for the use of PlexTech Technology Consulting only. For business-related inquiries, please contact us at info@plextech.berkeley.edu.

2022-2024 Bradley (Yihan) Tian and PlexTech Technology Consulting All Rights Reserved.

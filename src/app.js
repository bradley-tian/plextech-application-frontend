import Home from './home';
import ApplicationForm from './applicationForm';
import InterviewForm from './interviewForm';
import InterviewComplete from './interviewComplete';
import GradingInterface from './graderForm';
import SuccessPage from './successPage';
import CompletionPage from './completePage';
import MemberLoginPage from './memberLogin';
import AdminLoginPage from './adminLogin';
import AdminConsole from './adminConsole';
import Privacy from './privacyPolicy';
import FunnyDog from './funnyDog';
import InterviewLoginPage from './interviewLogin';

import { Routes, Route } from "react-router-dom"

function App() {
    return (
        <div className = 'App'>
            <Routes>
                <Route path='/' element={<Home/>}/>

                {/* Switch this route on/off to open/close applications */}
                {/* <Route path='apply' element={<ApplicationForm/>}/> */}

                <Route path='grading' element={<GradingInterface email=""/>}/>
                <Route path='interview' element={<InterviewForm/>}/>
                <Route path='success' element={<SuccessPage/>}/>
                <Route path='complete' element={<CompletionPage/>}/>
                <Route path='interview-complete' element={<CompletionPage/>}/>
                <Route path='interview-login' element={<InterviewLoginPage/>}/>
                <Route path='member-login' element={<MemberLoginPage/>}/>
                <Route path='admin-login' element={<AdminLoginPage/>}/>
                <Route path='admin' element={<AdminConsole/>}/>
                <Route path='privacy-policy' element={<Privacy/>}/>
                <Route path='funny-dog' element={<FunnyDog/>}/>
            </Routes>
        </div>
    );
};

export default App;
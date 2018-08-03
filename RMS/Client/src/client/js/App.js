import React, { Component } from 'react';
import { Router, Route, IndexRoute,browserHistory } from 'react-router';
import Shell from './Shell';
import InterviewScheduleHome from './InterviewScheduleHome';
import InterviewScheduleRecord from './InterviewScheduleRecord';
import InterviewScheduleFormWrapper from './InterviewScheduleFormWrapper';
import QuestionHome from './QuestionHome';
import QuestionRecord from './QuestionRecord';
import QuestionFormWrapper from './QuestionFormWrapper';
import InterviewScheduleReport from './InterviewScheduleReport';
import PersonWiseInterviewReport from './PersonWiseInterviewReport';
import QuestionView from './QuestionView';
import UserRecord from './UserRecord';
import QuestionCategoryRecord from './QuestionCategoryRecord';
import Login from './Login';
import LogOut from './LogOut';
import ForgetPassword from './ForgetPassword'
import ChangePassword from './ChangePassword';
import UserFormWrapper from './UserFormWrapper';
import QuestionCategoryFormWrapper from './QuestionCategoryFormWrapper';
import UserHome from './UserHome';
import QuestionCategoryHome from './QuestionCategoryHome';
import MonthlyReport from './MonthlyReport';

function requireAuth(nextState, replace) {
  if (!localStorage.ls_userSession) {
    replace({
      pathname: '/login'
    })
  }
}

function CheckSession(nextState, replace) {
  if (localStorage.ls_userSession) {
    replace({
      pathname: '/interviewees'
    })
  }
}

const App = () => {
    return (
      <Router history={browserHistory}>
          <Route path='/' component={Shell}>
              <IndexRoute component={Login} onEnter={CheckSession}/>
              <Route path='/interviewees' component={InterviewScheduleHome} onEnter={requireAuth}/>
              <Route path='interviewee' component={InterviewScheduleRecord} onEnter={requireAuth}>
                  <Route path=':interviewId/edit' component={InterviewScheduleFormWrapper} onEnter={requireAuth}/>
                  <Route path=':interviewId/Questions' component={QuestionView} onEnter={requireAuth}/>
              </Route>
              //// Question route
              <Route path='/questions' component={QuestionHome} onEnter={requireAuth} />
              <Route path='question' component={QuestionRecord}>
                <Route path=':questionId/edit' component={QuestionFormWrapper} onEnter={requireAuth}/>
              </Route>
              //// User route
              <Route path='/users' component={UserHome} onEnter={requireAuth} />
              <Route path='user' component={UserRecord}>
                <Route path=':userId/edit' component={UserFormWrapper} onEnter={requireAuth}/>
              </Route>

              //// Question category route
              <Route path='/questioncategories' component={QuestionCategoryHome} onEnter={requireAuth} />
              <Route path='questioncategory' component={QuestionCategoryRecord}>
                <Route path=':questioncategoryId/edit' component={QuestionCategoryFormWrapper} onEnter={requireAuth}/>
              </Route>

              <Route path='reports' component={InterviewScheduleReport} onEnter={requireAuth} />
              <Route path='personWiseInterviewReport' component={PersonWiseInterviewReport} onEnter={requireAuth} />
              <Route path='MonthlyReport' component={MonthlyReport} onEnter={requireAuth} />
              <Route path='login' component={Login} onEnter={CheckSession} />
              <Route path='changePassword' component={ChangePassword} onEnter={requireAuth}/>
              <Route path='forgetPassword' component={ForgetPassword} onEnter={CheckSession}/>
              <Route path='logout' component={LogOut}/>

              <Route path='*' component={InterviewScheduleHome}/> /// When navigate to the undefined route, This will navigate to the Home page of the Interview.
          </Route>
      </Router>
    );
};

export default App;
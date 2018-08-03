import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';
import { browserHistory } from 'react-router';

var interviewScheduleActions = {
    errorHandler(error, type) {
        let errorMessage = '';
        if(error != undefined && error.status === 401) {
          AppDispatcher.dispatch({
              actionType: constants.REQUEST_LOGOFF_USER,
          });

          browserHistory.push('/login');
        }
        else {
            AppDispatcher.dispatch({
                type: type,
                payload: errorMessage
            });
        }
    },
    addNewItem(interviewScheduleValues) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const interviewData = {
          FirstName: interviewScheduleValues.FirstName,
          LastName: interviewScheduleValues.LastName,
          PhoneNumber: interviewScheduleValues.PhoneNumber,
          AlternatePhoneNumber: interviewScheduleValues.AlternatePhoneNumber,
          EmailId: interviewScheduleValues.EmailId,
          ScheduleDate: interviewScheduleValues.ScheduleDate,
          ScheduleTime: interviewScheduleValues.ScheduleTime,
          PositionName: interviewScheduleValues.PositionName,
          Experience: interviewScheduleValues.Experience,
          ModeofInterview: interviewScheduleValues.ModeofInterview,
          InterviewStatusId: interviewScheduleValues.InterviewStatusId,
          ToEmail: interviewScheduleValues.ToEmail,
          CCEmail: interviewScheduleValues.CCEmail,
          IsActive: interviewScheduleValues.IsActive,
          Resume: interviewScheduleValues.Resume,
          IsInvoiced : interviewScheduleValues.IsInvoiced,
          IsArchived : interviewScheduleValues.IsArchived
        };
        axios({
            url: appConstants.INTERVIEWSCHEDULE,
            data: {
              ...interviewData
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interviews) {
            AppDispatcher.dispatch({
                actionType: constants.ADD_NEW_INTERVIEWSCHEDULE,
                text: interviews.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllInterviews: function () {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWSCHEDULE,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interviews) {
            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
            AppDispatcher.dispatch({
                actionType: constants.GET_ALL_INTERVIEWS,
                text: interviews.data
            });
        })
        .catch((error) => {
            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
            this.errorHandler(error.response, '')
        });
    },
    monthlyInterviews: function (month, year) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const interviewParams = {
          Month: month,
          Year: year
        };
        axios({
            url: appConstants.MONTHLYINTERVIEWS,
            data: {
                ...interviewParams
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interviews) {
            AppDispatcher.dispatch({
                actionType: constants.GET_MONTHLYINTERVIEWS,
                text: interviews.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getByIdInterview: function (interviewId) {      
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWSCHEDULE + '/' + interviewId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interview) {          
            AppDispatcher.dispatch({
                actionType: constants.GET_INTERVIEW_BY_ID,
                text: interview.data[0]
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    resultById: function (interviewId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWRESULT + '/' + interviewId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interview) {
            AppDispatcher.dispatch({
                actionType: constants.GET_RESULT_BY_ID,
                text: interview.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    updateItem: function (interviewScheduleValues) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWSCHEDULE,
            data: interviewScheduleValues,
            method: 'PUT',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interviews) {
              AppDispatcher.dispatch({
                  actionType: constants.UPDATE_INTERVIEWSCHEDULE,
                  text: interviews.data
              });

              document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        })
        .catch((error) => {
            this.errorHandler(error.response, '')
        });
    },
    deleteItem: function (interviewId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWSCHEDULE + '/' + interviewId,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interviews) {
            AppDispatcher.dispatch({
                actionType: constants.DELETE_INTERVIEWSCHEDULE,
                text: interviewId
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    deleteMultiple(interviews) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        for (var i=0; i<interviews.length; i++)
        {
            axios({
                url: appConstants.INTERVIEWSCHEDULE + '/' + interviews[i],
                method: 'DELETE',
                crossOrigin: true,
                headers: {
                    'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                }
            })
            .then(function () {
                AppDispatcher.dispatch({
                    actionType: constants.DELETE_MULTIPLE_INTERVIEWSCHEDULE,
                    text: interviews
                });

                document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
            });
        }
    }
};

module.exports = interviewScheduleActions;
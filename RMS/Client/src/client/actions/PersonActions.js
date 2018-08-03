import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var personActions = {
    getAllPersons() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.GET_PERSON,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': 'Bearer ' + localStorage.jwt
            }
        })
        .then(function (interviews) {
            AppDispatcher.dispatch({
                actionType: appConstants.GET_PERSON,
                text: interviews.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getPersonById(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.GET_PERSONBYID + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (interviews) {
            AppDispatcher.dispatch({
                actionType: appConstants.GET_PERSONBYID,
                text: interviews.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getInterviewSchedule(params) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const interviewParams = {
          fromDate: params.fromDate,
          toDate: params.toDate,
          toEmail: params.toEmail
        };
        axios({
            url: appConstants.GET_INTERVIEWSCHEDULE,
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
                actionType: appConstants.GET_INTERVIEWSCHEDULE,
                text: interviews.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getPersonWiseInterviewCount(params) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const interviewParams = {
          toEmail: params.toEmail,
          interviewStatus: params.interviewStatus
        };
        axios({
            url: appConstants.GET_PERSONWISEINTERVIEWCOUNT,
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
                actionType: appConstants.GET_PERSONWISEINTERVIEWCOUNT,
                text: interviews.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = personActions;
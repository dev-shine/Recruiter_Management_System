import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var InterviewStatusActions = {
    getInterviewStatus() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWSTATUS,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': 'Bearer ' + localStorage.jwt
            }
        })
        .then(function (result) {
            AppDispatcher.dispatch({
                actionType: constants.GET_ALL_INTERVIEWSTATUS,
                text: result.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = InterviewStatusActions;
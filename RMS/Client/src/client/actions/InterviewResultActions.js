import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var InterviewResultActions = {
    getAllResult() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.INTERVIEWRESULT,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (result) {
            AppDispatcher.dispatch({
                actionType: constants.GET_ALL_INTERVIEWRESULT,
                text: result.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = InterviewResultActions;
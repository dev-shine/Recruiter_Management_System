import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var questionActions = {
    questionGetAll() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (questions) {
            AppDispatcher.dispatch({
                actionType: appConstants.QUESTIONGETALL,
                text: questions.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    questionGetById(questionId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.GET_QUESTIONBYID + '/' + questionId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (question) {
            AppDispatcher.dispatch({
                actionType: appConstants.GET_QUESTIONBYID,
                text: question.data[0]
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    questionInsert(question) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const questionData = {
          question: question.Question,
          questionCategoryId: question.QuestionCategoryId,
          isActive: question.IsActive,
          sortOrder: question.SortOrder
        };
        axios({
            url: appConstants.QUESTIONINSERT,
            data: {
                ...questionData
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (question) {
            AppDispatcher.dispatch({
                actionType: appConstants.QUESTIONINSERT,
                text: question.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    questionUpdate(question) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONUPDATE,
            method: 'PUT',
            data: question,
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (question) {
            AppDispatcher.dispatch({
                actionType: appConstants.QUESTIONUPDATE,
                text: question.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    questionDelete(questionId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONDELETE + '/' + questionId,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (questions) {
          AppDispatcher.dispatch({
              actionType: appConstants.QUESTIONDELETE,
              text: questionId
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    addNewItem(answerValues) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTION,
            data: {
                answerValues: answerValues
            },
            method: 'POST',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (answer) {
            AppDispatcher.dispatch({
                actionType: constants.NEW_QUESTIONS,
                text: answerValues
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    findByIdFromAnswer(id) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTION + '/' + id,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (answer) {
            AppDispatcher.dispatch({
                actionType: constants.ANSWER_FIND_BY_ID,
                text: answer.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllAnswer() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.GET_ANSWER,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (answer) {
            AppDispatcher.dispatch({
                actionType: constants.GET_ALL_ANSWER,
                text: answer.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllQuestionAndResponseData(interviewId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.GETALL_QUESTIONANDRESPONSE + '/' + interviewId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (response) {
            AppDispatcher.dispatch({
                actionType: appConstants.GETALL_QUESTIONANDRESPONSE,
                text: response.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = questionActions;
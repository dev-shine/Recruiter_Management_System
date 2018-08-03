import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import assign from 'object-assign';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

var _store = {
    question: [],
    questions: [],
    questionCategory: [],
    questionInsertStatus: [],
    questionUpdateStatus: [],
    answerObject: [],
    answers: [],
    response: []
};

function setValues (questions) {
    _store.questions = questions;
}

function setQuestionById (question) {
    _store.question = question;
}

function setAnswerObject (answerObject) {
    _store.answerObject = answerObject;
}

function setAnswers(answers)
{
    _store.answers = answers;
}

function setAllQuestionAndResponseData(responseData) {
    _store.response = responseData;
}

var questionStore = assign({}, EventEmitter.prototype, {
    items: [],
    returnStore: function () {
        return _store.questions;
    },
    getQuestions: function() {
        return _store.questions;
    },
    getQuestionById: function() {
        return _store.question;
    },
    getQuestionInsertStatus : function()
    {
        return _store.questionInsertStatus;
    },
    getQuestionUpdateStatus : function()
    {
        return _store.questionUpdateStatus;
    },
    questionInsertHandler: function (inputValues) {
        _store.questionInsertStatus = inputValues.Status;
        delete inputValues['Status'];
            if(_store.questionInsertStatus === constants.LBL_OK)
            {
                inputValues['RowNumber'] = _store.questions.length + 1;
                _store.questions.push(inputValues);
            }
    },
    questionUpdateHandler: function (inputValues) {
        _store.questionUpdateStatus = inputValues.Status;
        delete inputValues['Status'];
        if(_store.questionUpdateStatus === constants.LBL_OK)
        {
          var index = this.find(inputValues.QuestionId);
          inputValues.QuestionId = parseInt(inputValues.QuestionId);
          inputValues['RowNumber'] = index + 1;
          _store.questions[index] = inputValues;
        }
    },
    questionDeleteHandler: function (questionId) {
        var index = this.find(questionId);
        _store.questions.splice(index, 1);
    },
    find: function(id) {
        var found = undefined;
         _store.questions.some(function(questions, i) {
            if (questions.QuestionId === id)
            {
                found = i;
            }
        });

        return found;
    },
    AnswerfindById: function () {
        return _store.answerObject;
    },
    AnswerGetALL: function () {
        return _store.answers;
    },
    getAllQuestionAndResponseData() {
        return _store.response;
    },
    addNewItemHandler: function (inputValues) {
        _store.questions.push(inputValues);
    },
    emitChange: function () {
        this.emit('change');
    },
    addChangeListener: function(callback) {
        this.on('change', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }
});

questionStore.dispatchToken = AppDispatcher.register(function (payload) {
    var action = payload;
    switch (action.actionType) {
        case appConstants.QUESTIONGETALL:
            setValues(action.text);
            questionStore.emitChange();
        break;
        case appConstants.GET_QUESTIONBYID:
            setQuestionById(action.text);
            questionStore.emitChange();
        break;
        case appConstants.QUESTIONINSERT:
            questionStore.questionInsertHandler(action.text);
            questionStore.emitChange();
        break;
        case appConstants.QUESTIONUPDATE:
            questionStore.questionUpdateHandler(action.text);
            questionStore.emitChange();
          break;
        case appConstants.QUESTIONDELETE:
            questionStore.questionDeleteHandler(action.text);
            questionStore.emitChange();
        break;
        case constants.GET_ALL_QUESTIONS:
            setValues(action.text);
            questionStore.emitChange();
        break;
        case constants.NEW_QUESTIONS:
            questionStore.addNewItemHandler(action.text);
            questionStore.emitChange();
        break;
        case constants.ANSWER_FIND_BY_ID:
            setAnswerObject(action.text);
            questionStore.emitChange();
        break;
        case constants.GET_ALL_ANSWER:
            setAnswers(action.text);
            questionStore.emitChange();
        break;
        case appConstants.GETALL_QUESTIONANDRESPONSE:
            setAllQuestionAndResponseData(action.text);
            questionStore.emitChange();
        break;
        default:
            return true;
    }

    return true;
});

module.exports = questionStore;
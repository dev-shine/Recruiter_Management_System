import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import assign from 'object-assign';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';

var _store = {
  interviews: [],
  interview:[],
  result: [],
  isMailSend: false,
  mailType: 0,
  interviewStatus: [],
  interviewInsertStatus : '',
  interviewUpdateStatus : '',
  monthlyInterview: []
};

function setInterviewsCollection (interviews) {
  _store.interviews = interviews;
}

function setmonthlyInterviewCollection (monthlyInterview) {
  _store.monthlyInterview = monthlyInterview;
}

function setInterviewObject (interview) {
  _store.interview = interview;
}

function setResult (result) {
  _store.result = result;
}

var listStore = assign({}, EventEmitter.prototype, {
  items: [],
  returnStore: function () {
    return _store.interviews;
  },
  getInterviewById: function () {
      return _store.interview;
  },
  getResultId: function () {
    return _store.result;
  },
  getMonthlyInterview: function () {
    return _store.monthlyInterview;
  },
  interviewScheduleConfirmation: function () {
    return _store.interviewStatus;
  },
  sendMailHandler : function (sendmailFlag, status){
    _store.mailCount = sendmailFlag;
    _store.isMailSend = true;
    _store.status = status;
  },
  getEmailFlag : function (sendmailFlag){
    let mailStatus = {
      isMailSend :_store.isMailSend,
      mailCount :   _store.mailCount,
      status: _store.status
    }

    return mailStatus;
  },
  getInsertStatus : function()
  {
    return _store.interviewInsertStatus;
  },
  getUpdateStatus : function()
  {
    return _store.interviewUpdateStatus;
  },
  addNewItemHandler: function (inputValues) {
    _store.interviewInsertStatus = inputValues.status;
    delete inputValues['status'];

    if(_store.interviewInsertStatus === constants.LBL_OK)
    {
        inputValues['RowNumber'] = _store.interviews.length + 1;
        _store.interviews.push(inputValues);
    }
  },
  updateItemHandler: function (inputValues) {
    _store.interviewUpdateStatus = inputValues.status;
    delete inputValues['status'];
    if(_store.interviewUpdateStatus === constants.LBL_OK)
    {
     var index = this.find(inputValues.InterviewId);
     inputValues.InterviewId = parseInt(inputValues.InterviewId);
     inputValues['RowNumber'] = index + 1;
     _store.interviews[index] = inputValues;
    }
  },
  updateReportSharedHandler: function (inputValues, status) {
    var index = this.find(inputValues.InterviewId);
    inputValues.InterviewId = parseInt(inputValues.InterviewId);
    inputValues['RowNumber'] = index + 1;
    _store.interviews[index] = inputValues;
    _store.status = status;
 },
  deleteItemHandler(interviewId) {
    var index = this.find(interviewId);
    _store.interviews.splice(index, 1);
  },
    deleteMultipleHandler(interviewId) {
        for (var i=0; i<interviewId.length; i++)
        {
            var index = this.find(interviewId[i]);
            if (index != undefined){
                _store.interviews.splice(index, 1);
            }
        }
    },
  find: function(id) {
    var found = undefined;
     _store.interviews.some(function(interviews, i) {
      if(interviews.InterviewId === id)
      {found = i;}
    });
    return found;
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

listStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case constants.GET_ALL_INTERVIEWS:
      setInterviewsCollection(action.text);
      listStore.emitChange();
      break;
    case constants.GET_MONTHLYINTERVIEWS:
      setmonthlyInterviewCollection(action.text);
      listStore.emitChange();
      break;
    case constants.GET_INTERVIEW_BY_ID:
      setInterviewObject(action.text);
      listStore.emitChange();
      break;
    case constants.GET_RESULT_BY_ID:
      setResult(action.text);
      listStore.emitChange();
    break;
    case constants.ADD_NEW_INTERVIEWSCHEDULE:
      listStore.addNewItemHandler(action.text);
      listStore.emitChange();
      break;
    case constants.UPDATE_INTERVIEWSCHEDULE:
      listStore.updateItemHandler(action.text);
      listStore.emitChange();
      break;
    case constants.DELETE_INTERVIEWSCHEDULE:
      listStore.deleteItemHandler(action.text);
      listStore.emitChange();
      break;
    case constants.DELETE_MULTIPLE_INTERVIEWSCHEDULE:
        listStore.deleteMultipleHandler(action.text);
        listStore.emitChange();
        break;
    case constants.SEND_MAIL:
      listStore.sendMailHandler(action.text, action.status);
      listStore.emitChange();
      break;
    case appConstants.UPDATE_REPORTSHARED:
      listStore.updateReportSharedHandler(action.text, action.status);
      listStore.emitChange();
      break;
    default:
      return true;
  }

  return true;
});

module.exports = listStore;
import EventEmitter from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';

// Store
var _store = {
  person: [],
  persons: [],
  interviews: []
};

// Set data in the store
function setInterviews (interviews) {
  _store.interviews = interviews;
}

function setPersons (persons) {
  _store.persons = persons;
}

function setPerson (person) {
  _store.person = person;
}

function setPersonWiseInterviewCount (interviews) {
  _store.personWiseInterview = interviews;
}

var listStore = assign({}, EventEmitter.prototype, {
  getInterviews: function () {
    return _store.interviews;
  },
  getPersons: function () {
    return _store.persons;
  },
  getPerson: function () {
    return _store.person;
  },
  getPersonWiseInterviewCount: function () {
    return _store.personWiseInterview;
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
    case appConstants.GET_PERSON:
      setPersons(action.text);
      listStore.emitChange();
      break;
    case appConstants.GET_PERSONBYID:
      setPerson(action.text);
      listStore.emitChange();
    break;
    case appConstants.GET_INTERVIEWSCHEDULE:
      setInterviews(action.text);
      listStore.emitChange();
    break;
    case appConstants.GET_PERSONWISEINTERVIEWCOUNT:
      setPersonWiseInterviewCount(action.text);
      listStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = listStore;
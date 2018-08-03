import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import assign from 'object-assign';
import constants from '../constants/Constants';

var _store = {
  status: []
};

function setValues (status) {
  _store.status = status;
}

var interviewStatusStore = assign({}, EventEmitter.prototype, {
  items: [],

  returnStore: function () {
    return _store.status;
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

interviewStatusStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case constants.GET_ALL_INTERVIEWSTATUS:
      setValues(action.text);
      interviewStatusStore.emitChange();
    break;
    default:
      return true;
  }
  return true;
});

module.exports = interviewStatusStore;
import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import assign from 'object-assign';
import constants from '../constants/Constants';

var _store = {
    result: []
};

function setValues (result) {
  _store.result = result;
}

var interviewResultStore = assign({}, EventEmitter.prototype, {
  items: [],

  returnStore: function () {
    return _store.result;
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

interviewResultStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case constants.GET_ALL_INTERVIEWRESULT:
      setValues(action.text);
      interviewResultStore.emitChange();
    break;
    default:
      return true;
  }
  return true;
});

module.exports = interviewResultStore;
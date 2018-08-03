import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import assign from 'object-assign';
import constants from '../constants/Constants';

var _store = {
  users: [],
  user:[],
  changePasswordStatus:[],
  forgotPasswordStatus:[],
  userInsertStatus:[]
};

function setUsersCollection (users) {
  _store.users = users;
}

function setChangePasswordStatus (changePasswordStatus) {
  _store.changePasswordStatus = changePasswordStatus;
}

function setforgotPasswordStatus (forgotPasswordStatus) {
  _store.forgotPasswordStatus = forgotPasswordStatus;
}
function setUserObject (user) {
  _store.user = user;
}

var userStore = assign({}, EventEmitter.prototype, {
  items: [],

  constructor() {
    this._user = null;
    this._loginStatus = null;
    this._jwt = null;
  },

  returnStore: function () {
    return _store.users;
  },
  getUserById: function () {
    return _store.user;
  },
  getInsertStatus : function()
  {
    return _store.userInsertStatus;
  },
  changePaswordConfirmation: function () {
    return _store.changePasswordStatus;
  },
  forogotPaswordConfirmation: function () {
    return _store.forgotPasswordStatus;
  },
  getResultId: function () {
    return _store.result;
  },
  loginConfirmation: function () {
    return this._loginStatus;
  },
  jwt: function () {
      return this._jwt;
  },
  addNewItemHandler: function (inputValues) {
    _store.userInsertStatus = inputValues.status;
    delete inputValues['status'];
      if(_store.userInsertStatus === constants.LBL_OK)
      {
        inputValues['RowNumber'] = _store.users.length + 1;
        _store.users.push(inputValues);
      }
  },

  updateItemHandler: function (inputValues) {
     var index = this.find(inputValues.UserId);
     inputValues.UserId = parseInt(inputValues.UserId);
     if(index === undefined) return this.triggerFailToTakeAction();
     inputValues['RowNumber'] = index + 1;
     _store.users[index] = inputValues;
  },

  deleteItemHandler: function (userId) {
    var index = this.find(userId);
    if(index === undefined) return this.triggerFailToTakeAction();
    _store.users.splice(index, 1);
  },

  find: function(id) {
    var found = undefined;
     _store.users.some(function(users, i) {
      if(users.UserId === id)
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

userStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case constants.GET_ALL_USERS:
      setUsersCollection(action.text);
      userStore.emitChange();
      break;
    case constants.GET_USER_BY_ID:
      setUserObject(action.text);
      userStore.emitChange();
      break;
    case constants.ADD_NEW_USER:
      userStore.addNewItemHandler(action.text);
      userStore.emitChange();
      break;
    case constants.UPDATE_USER:
      userStore.updateItemHandler(action.text);
      userStore.emitChange();
      break;
    case constants.DELETE_USER:
      userStore.deleteItemHandler(action.text);
      userStore.emitChange();
      break;
    case constants.REQUEST_LOGIN_USER_SUCCESS:
      userStore._user = action.text.UserName;
      userStore._loginStatus = action.text.status;
      localStorage.setItem('ls_userSession', action.text.UserEmail);
      localStorage.setItem('ls_userId', action.text.UserId);
      localStorage.setItem('ls_userName', action.text.Name);
      this._error = null;
      this._jwt = action.jwt;
      localStorage.setItem('jwt', action.jwt);
      userStore.emitChange();
      break;
    case constants.REQUEST_LOGIN_USER_ERROR:
      userStore._loginStatus = action.text.status;
      userStore._user = null;
      userStore.emitChange();
      break;
    case constants.REQUEST_LOGOFF_USER:
      userStore._user = null;
      userStore._loginStatus = null;
      localStorage.removeItem('ls_userSession');
      localStorage.removeItem('ls_userName');
      localStorage.removeItem('ls_userId');
      this._error = null;
      this._jwt = null;
      localStorage.removeItem('jwt');
      userStore.emitChange();
      break;
    case constants.REQUEST_CHANGEPASSWORD_SUCCESS:
      setChangePasswordStatus(action.text.status);
      userStore.emitChange();
      break;
    case constants.REQUEST_CHANGEPASSWORD_ERROR:
      setChangePasswordStatus(action.text.status);
      userStore.emitChange();
      break;
    case constants.REQUEST_FORGOTPASSWORD_SUCCESS:
      setforgotPasswordStatus(action.text.status);
      userStore.emitChange();
      break;
    case constants.REQUEST_FORGOTPASSWORD_ERROR:
      setforgotPasswordStatus(action.text.status);
      userStore.emitChange();
      break;
    default:
      return true;
  }

  return true;
});

module.exports = userStore;
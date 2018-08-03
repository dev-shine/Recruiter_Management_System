import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import assign from 'object-assign';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import { browserHistory } from 'react-router';

var _store = {
  questioncategories: [],
  activeCategories: [],
  questionCategory:[],
  categoryInsertStatus:[],
  categoryUpdateStatus:[],
  categoryDeleteStatus:[],
};

function setCategoryCollection (questioncategories) {
  _store.questioncategories = questioncategories;
}

function setActiveCategoryCollection (activeCategories) {
  _store.activeCategories = activeCategories;
}

function setAllActiveCategories (activeCategoriesAll) {
    _store.activeCategoriesAll = activeCategoriesAll;
}

function setCategoryObject (questionCategory) {
  _store.questionCategory = questionCategory;
}

function setQuestionCategories (questionCategories) {
    _store.questionCategory = questionCategories;
}

var questionCategoryStore = assign({}, EventEmitter.prototype, {
  items: [],
  constructor() {
    this._questionCategory = null;
    this._loginStatus = null;
    this._jwt = null;
  },
  returnStore: function () {
    return _store.questioncategories;
  },
  getAllActiveCategories(){
      return _store.activeCategoriesAll;
  },
  activeCategory: function(){
    return _store.activeCategories;
  },
  getQuestionCategoryById: function () {
    return _store.questionCategory;
  },
  getInsertStatus : function()
  {
    return _store.categoryInsertStatus;
  },
  getUpdateStatus : function()
  {
    return _store.categoryUpdateStatus;
  },

  getDeleteStatus : function()
  {
    return _store.categoryDeleteStatus;
  },
  getResultId: function () {
    return _store.result;
  },
  getQuestionCategories: function() {
      return _store.questionCategory;
  },
  addNewItemHandler: function (inputValues) {
    _store.categoryInsertStatus = inputValues.Status;
    delete inputValues['status'];
      if(_store.categoryInsertStatus === constants.LBL_OK)
      {
        inputValues['RowNumber'] = _store.questioncategories.length + 1;
        _store.questioncategories.push(inputValues);
      }
  },
  updateItemHandler: function (inputValues) {
    _store.categoryUpdateStatus = inputValues.Status;
    delete inputValues['status'];
    if(_store.categoryUpdateStatus === constants.LBL_OK)
    {
     var index = this.find(inputValues.QuestionCategoryId);
     inputValues.QuestionCategoryId = parseInt(inputValues.QuestionCategoryId);
     inputValues['RowNumber'] = index + 1;
     _store.questioncategories[index] = inputValues;
   }
  },
  deleteItemHandler: function (inputValues) {
    _store.categoryDeleteStatus = inputValues.status
    delete inputValues['status'];
    if(_store.categoryDeleteStatus === constants.LBL_OK)
    {
      var index = this.find(inputValues.questionCategoryId);
      _store.questioncategories.splice(index, 1);
    }
  },
  find: function(id) {
    var found = undefined;
     _store.questioncategories.some(function(questioncategories, i) {
      if(questioncategories.QuestionCategoryId === id)
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

questionCategoryStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload;
  switch (action.actionType) {
    case constants.GET_ALL_QUESTIONCATEGORIES:
      setCategoryCollection(action.text);
      questionCategoryStore.emitChange();
      break;
    case constants.GET_ACTIVE_QUESTIONCATEGORIES:
      setActiveCategoryCollection(action.text);
      questionCategoryStore.emitChange();
      break;
    case constants.GET_QUESTIONCATEGORY_BY_ID:
      setCategoryObject(action.text);
      questionCategoryStore.emitChange();
      break;
    case constants.ADD_NEW_QUESTIONCATEGORY:
      questionCategoryStore.addNewItemHandler(action.text);
      questionCategoryStore.emitChange();
      break;
    case constants.UPDATE_QUESTIONCATEGORY:
      questionCategoryStore.updateItemHandler(action.text);
      questionCategoryStore.emitChange();
      break;
    case constants.DELETE_QUESTIONCATEGORY:
      questionCategoryStore.deleteItemHandler(action.text);
      questionCategoryStore.emitChange();
      break;
    case appConstants.QUESTIONCATEGORYGETALL:
        setQuestionCategories(action.text);
        questionCategoryStore.emitChange();
        break;
    case appConstants.QUESTIONCATEGORYACTIVEGETALL:
        setAllActiveCategories(action.text);
        questionCategoryStore.emitChange();
    break;
    default:
      return true;
  }

  return true;
});

module.exports = questionCategoryStore;
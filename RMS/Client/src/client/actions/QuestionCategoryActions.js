import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';

var QuestionCategoryActions = {
    addNewItem(categoryValues) {
      document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
      const questionCategoryData = {
        QuestionCategoryName: categoryValues.QuestionCategoryName,
        DisplayName: categoryValues.DisplayName,
        SortOrder: categoryValues.SortOrder,
        IsActive: categoryValues.IsActive
      };
      axios({
          url: appConstants.QUESTIONCATEGORY,
          data: {
            ...questionCategoryData
          },
          method: 'POST',
          crossOrigin: true,
          headers: {
              'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
          }
      })
      .then(function (categories) {
          AppDispatcher.dispatch({
            actionType: constants.ADD_NEW_QUESTIONCATEGORY,
            text: categories.data
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
      });
    },
    getAllCategories() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORY,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (categories) {
          AppDispatcher.dispatch({
            actionType: constants.GET_ALL_QUESTIONCATEGORIES,
            text: categories.data
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getActiveCategories(interviewId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORYACTIVE + '/' + interviewId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (categories) {
          AppDispatcher.dispatch({
            actionType: constants.GET_ACTIVE_QUESTIONCATEGORIES,
            text: categories.data
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getByIdCategory(categoryId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORY + '/' + categoryId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (category) {
          AppDispatcher.dispatch({
            actionType: constants.GET_QUESTIONCATEGORY_BY_ID,
            text: category.data[0]
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    updateItem(categoryValues) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORY,
            method: 'PUT',
            data: categoryValues,
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (categories) {
              AppDispatcher.dispatch({
                actionType: constants.UPDATE_QUESTIONCATEGORY,
                text: categories.data
              });

              document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    deleteItem(questionCategoryId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORY + '/' +  questionCategoryId,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (categories) {
            categories.data['questionCategoryId'] = questionCategoryId;
            AppDispatcher.dispatch({
              actionType: constants.DELETE_QUESTIONCATEGORY,
              text: categories.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    questionCategoryGetAll() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORYGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (questionCategory) {
            AppDispatcher.dispatch({
                actionType: appConstants.QUESTIONCATEGORYGETALL,
                text: questionCategory.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllActiveCategories() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.QUESTIONCATEGORYACTIVEGETALL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (activeCategories) {
            AppDispatcher.dispatch({
                actionType: appConstants.QUESTIONCATEGORYACTIVEGETALL,
                text: activeCategories.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = QuestionCategoryActions;
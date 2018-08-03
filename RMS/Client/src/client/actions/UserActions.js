import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';
import { browserHistory } from 'react-router';

var UserActions = {
    loginUser: (credentials) => {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const userData = {
          Email: credentials.Email,
          Password: credentials.Password
        };
        axios({
            url: appConstants.LOGIN_DETAILS,
            data: {
              ...userData
            },
            method: 'POST',
            crossOrigin: true
        })
        .then(function (loginResponse) {
            if (loginResponse.statusText == constants.LBL_OK_RESPONSE)
            {
                if (loginResponse.data[0].status == constants.LBL_OK)
                {
                    loginResponse.data[0]['UserEmail'] = credentials.Email;
                    AppDispatcher.dispatch({
                        actionType: constants.REQUEST_LOGIN_USER_SUCCESS,
                        text: loginResponse.data[0],
                        jwt: loginResponse.data[1]
                    });
                }
                else {
                    AppDispatcher.dispatch({
                        actionType: constants.REQUEST_LOGIN_USER_ERROR,
                        text: loginResponse.data[0]
                    });
                }
            }

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    logOutUser: () => {
        AppDispatcher.dispatch({
            actionType: constants.REQUEST_LOGOFF_USER,
        });
    },
    changePassword: (OldPassword, NewPassword, Email) => {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        Email = localStorage.getItem('ls_userSession');
        const userData = {
          OldPassword: OldPassword,
          NewPassword: NewPassword,
          Email: Email
        };
        axios({
            url: appConstants.CHANGE_PASSWORD,
            method: 'POST',
            data: {
                ...userData
            },
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (loginResponse) {
            if (loginResponse.statusText == constants.LBL_OK_RESPONSE)
            {
                if(loginResponse.data.status == constants.LBL_OK)
                {
                    AppDispatcher.dispatch({
                        actionType: constants.REQUEST_CHANGEPASSWORD_SUCCESS,
                        text: loginResponse.data
                    });
                }
                else {
                    AppDispatcher.dispatch({
                        actionType: constants.REQUEST_CHANGEPASSWORD_ERROR,
                        text: loginResponse.data
                    });
                }
            }

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    ForgotPassword : (userDetails) => {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios.post(appConstants.FORGOT_PASSWORD, { Email: userDetails.Email })
        .then(function (loginResponse) {
            if (loginResponse.statusText == constants.LBL_OK_RESPONSE)
            {
                if(loginResponse.data.status == constants.LBL_OK)
                {
                    AppDispatcher.dispatch({
                        actionType: constants.REQUEST_FORGOTPASSWORD_SUCCESS,
                        text: loginResponse.data
                    });
                }
                else {
                    AppDispatcher.dispatch({
                        actionType: constants.REQUEST_FORGOTPASSWORD_ERROR,
                        text: loginResponse.data
                    });
                }
            }

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    addNewItem(userValues) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const userData = {
          FirstName: userValues.FirstName,
          LastName: userValues.LastName,
          ContactNumber: userValues.ContactNumber,
          Email: userValues.Email,
          Password: userValues.Password,
          IsActive: userValues.IsActive
        };
        axios({
            url: appConstants.USER_APIURL,
            method: 'POST',
            data: {
                ...userData
            },
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (users) {
            AppDispatcher.dispatch({
                actionType: constants.ADD_NEW_USER,
                text: users.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getAllUsers() {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_APIURL,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (users) {
            AppDispatcher.dispatch({
                actionType: constants.GET_ALL_USERS,
                text: users.data
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    getByIdUser(userId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_APIURL + '/' + userId,
            method: 'GET',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (user) {
          AppDispatcher.dispatch({
            actionType: constants.GET_USER_BY_ID,
            text: user.data
          });

          document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    updateItem(userValues) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        const userData = {
          FirstName: userValues.FirstName,
          LastName: userValues.LastName,
          ContactNumber: userValues.ContactNumber,
          IsActive: userValues.IsActive,
          UserId: userValues.UserId
        };
        axios({
            url: appConstants.USER_APIURL,
            method: 'PUT',
            data: userValues,
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (users) {
              AppDispatcher.dispatch({
                actionType: constants.UPDATE_USER,
                text: users.data
              });

              document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    },
    deleteItem(userId) {
        document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
        axios({
            url: appConstants.USER_APIURL + '/' + userId,
            method: 'DELETE',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        })
        .then(function (users) {
            AppDispatcher.dispatch({
                actionType: constants.DELETE_USER,
                text: userId
            });

            document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
        });
    }
};

module.exports = UserActions;
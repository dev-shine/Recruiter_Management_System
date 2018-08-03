import React from 'react';
import { NotificationManager } from 'react-notifications';
import UserActions from './../actions/UserActions';
import UserStore from '../stores/UserStore';
import { browserHistory } from 'react-router';
import './components/loginJquery.js';
import './../../assets/styles/loginstyle.css';
import constants from '../constants/Constants';
var userData = [];

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = { userRecord: [] };
        this.saveHandler = this.saveHandler.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
    }
    componentDidMount() {
        UserStore.addChangeListener(this.onLogin);
    }
    componentWillUnmount() {
        UserStore.removeChangeListener(this.onLogin);
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
         UserActions.loginUser(this.state.userRecord);
        }
    }
    onLogin() {
        this.setState({
            LoginStatus: UserStore.loginConfirmation()
        });
        if (this.state.LoginStatus === constants.LBL_OK) {
            browserHistory.push('/interviewees')
        }
        else if (this.state.LoginStatus === constants.LBL_INACTIVE) {
            NotificationManager.error(constants.USER_STATUS_MESSAGE, '', 3000)
        }
        else {
            NotificationManager.error(constants.INVALID_EMAIL_MESSAGE, '', 3000)
        }
    }
    showFormErrors() {
        const inputs = document.querySelectorAll('input[name]');
        let isFormValid = true;
        inputs.forEach(input => {
            input.classList.add('active');
            const isInputValid = this.showInputError(input.name);
            if (!isInputValid) {
              isFormValid = false;
            }
        });

        return isFormValid;
    }
    showInputError(refName) {
        let validity;
        validity = this.refs[refName].validity;
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        const isPassword = refName === constants.PASSWORD;
        if (!validity.valid)
        {
          if (validity.valueMissing) {
              error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
          }
          else if (validity.typeMismatch) {
              error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
          }
          else if (isPassword && validity.patternMismatch) {
              error.textContent = constants.PWD_LENGTH_MESSAGE + ` ${label}`;
          }

          return false;
        }

        error.textContent = '';
        return true;
    }
    handleChange(event) {
        userData[event.target.name] = event.target.value;
        this.setState({userRecord : userData});
    }
    render() {
        return (
            <div className='login'>
                <hgroup>
                    <h2>{ constants.SIGNIN_HEADER }</h2>
                </hgroup>
                <form id={constants.LBL_FORGOTPASSWORDFORM}>
                    <div>
                        <label id={constants.EMAILLABEL}>{ constants.EMAIL }</label>
                    </div>
                    <div className='groupLoginForm'>
                        <input className='form-control' type='email' name={constants.EMAIL} ref={constants.EMAIL} value={this.state.userRecord.Email ? this.state.userRecord.Email : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.EMAILERROR} />
                    </div>

                    <div>
                        <label id={constants.PASSWORD_LABEL}>{ constants.PASSWORD }</label>
                    </div>
                    <div className='groupLoginForm'>
                        <input className='form-control' type='password' name={constants.PASSWORD} ref={constants.PASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={this.state.userRecord.Password ? this.state.userRecord.Password : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_PASSWORDERROR} />
                    </div>
                    <button className='button btn-primary' onClick={ this.saveHandler }>{ constants.LOGIN }</button>
                    <a href='/ForgetPassword' className='marginForgotLink65P'>{ constants.FORGOTPASSWORD }</a>
                </form>
            </div>
        );
    }
}
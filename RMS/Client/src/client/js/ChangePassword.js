import React from 'react';
import { NotificationManager } from 'react-notifications';
import UserActions from './../actions/UserActions';
import UserStore from '../stores/UserStore';
import { browserHistory } from 'react-router';
import constants from '../constants/Constants';
var userData = [];

export default class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = { passwordDetails: [], changePasswordStatus: '' };
        this.saveHandler = this.saveHandler.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changePasswordChange = this.changePasswordChange.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
    }
    componentDidMount() {
        UserStore.addChangeListener(this.changePasswordChange);
    }
    componentWillUnmount() {
        UserStore.removeChangeListener(this.changePasswordChange);
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            UserActions.changePassword(this.state.passwordDetails.oldpassword, this.state.passwordDetails.password);
        }
    }
    onCancel(){
        browserHistory.goBack();
    }
    handleChange(event) {
        userData[event.target.name] = event.target.value;
        this.setState({passwordDetails : userData});
    }
    changePasswordChange() {
        this.setState({ changePasswordStatus: UserStore.changePaswordConfirmation() }, function() {
            if (this.state.changePasswordStatus == constants.LBL_OK)
            {
                window.location.href = '/logout' ;
            }
            else {
                NotificationManager.error(constants.REQUIRED_OLDPWD_MESSAGE, '', 3000)
            }
        });
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
        const isOldPassword = refName === constants.TXT_OLDPASSWORD;
        const isPassword = refName === constants.TXT_PASSWORD;
        const isConfirmPassword = refName === constants.TXT_CONFIRMPASSWORD;

        if (isConfirmPassword) {
          if (this.refs.password.value !== '' && this.refs.password.value !== this.refs.confirmPassword.value) {
            this.refs.confirmPassword.setCustomValidity(constants.MATCH_PASSWORD_MESSAGE);
          } else {
            this.refs.confirmPassword.setCustomValidity('');
          }
        }

        if (!validity.valid) {
          if (validity.valueMissing) {
              error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
          } else if (( isPassword || isOldPassword || isConfirmPassword) && validity.patternMismatch) {
              error.textContent = constants.PWD_LENGTH_MESSAGE;
          } else if (isConfirmPassword && validity.customError) {
            error.textContent = constants.MATCH_PASSWORD_MESSAGE;
          }

          return false;
        }

        error.textContent = '';
        return true;
    }
    render() {
        return (
          <div>
          <hgroup>
              <h2>{ constants.CHANGEPASSWORD }</h2>
          </hgroup>
            <div className='changePasswordBox'>
                <div className='groupLoginForm'>
                    <div>
                        <label id={constants.LBL_OLDPASSWORD} className='control-label'>{ constants.OLDPASSWORD }</label>
                    </div>
                    <div >
                        <input className='form-control' type='password' name={constants.TXT_OLDPASSWORD} ref={constants.TXT_OLDPASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' onChange={this.handleChange} autoFocus required />
                        <div className='error' id={constants.LBL_OLDPASSWORD_ERROR} />
                    </div>
                </div>
                <div className='groupLoginForm'>
                  <div ref={constants.LBL_PASSWORD}>
                      <label id={constants.PASSWORDLABEL} className='control-label'>{ constants.NEWPASSWORD }</label>
                  </div>
                  <div ref={constants.INPUT_PASSWORD}>
                      <input className='form-control' type='password' name={constants.TXT_PASSWORD} ref={constants.TXT_PASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' onChange={this.handleChange} required />
                      <div className='error' id={constants.LBL_PASSWORD_ERROR} />
                  </div>
                </div>
                <div className='groupLoginForm'>
                    <div ref={constants.LBL_CONFIRM_PASSWORD}>
                        <label id={constants.LBL_CONFIRM_PASSWORD_LABEL} className='control-label'>{ constants.CONFIRMPASSWORD }</label>
                    </div>
                    <div ref={constants.INPUT_CONFIRMPASSWORD}>
                        <input className='form-control' type='password' name={constants.TXT_CONFIRMPASSWORD} ref={constants.TXT_CONFIRMPASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_CONFIRMPASSWORD_ERROR} />
                    </div>
                </div>
                  <button className='twoButton buttonBlue' onClick={ this.saveHandler }>{ constants.SUBMIT }</button>
                  <button className='twoButton2 marginLeft8P' onClick={ this.onCancel }>{ constants.CANCEL }</button>
            </div>
        </div>
        );
    }
}

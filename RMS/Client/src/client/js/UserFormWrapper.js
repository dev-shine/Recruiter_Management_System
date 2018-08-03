import React from 'react';
import UserForm from './UserForm';
import { NotificationManager } from 'react-notifications';
import { browserHistory } from 'react-router';
import constants from '../constants/Constants';

export default class UserFormWrapper extends React.Component {
    constructor() {
        super();
        this.state = { interviewStatus: [] };
        this.updateNotification = this.updateNotification.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savedHandler = this.savedHandler.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
    }
    updateNotification () {
        return {
            success : NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000)
        };
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            this.refs.form.save();
        }
    }
    savedHandler() {
        browserHistory.push('/users')
        this.updateNotification();
    }
    onCancelClick() {
        browserHistory.push('/users')
    }
    showFormErrors() {
      const inputs = document.querySelectorAll('input[name]:not(.password)');
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
        validity = this.refs.form.refs[refName].validity;
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        const isContactNumber = refName === constants.TXT_CONTACTNUMBER;
        const isPassword = refName === constants.PASSWORD;
        const isConfirmPassword = refName === constants.TEXTBOX_CONFIRMPASSWORD;
        const isEmail = refName === constants.EMAIL;
        if (isConfirmPassword) {
             if (this.refs.form.refs.Password.value !== '' && this.refs.form.refs.Password.value !== this.refs.form.refs.ConfirmPassword.value) {
                this.refs.form.refs.ConfirmPassword.setCustomValidity(constants.MATCH_PASSWORD_MESSAGE);
             }
             else {
                this.refs.form.refs.ConfirmPassword.setCustomValidity('');
             }
        }

        if (!validity.valid) {
            if (validity.valueMissing) {
                error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
            }
            else if (validity.typeMismatch) {
                error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
            }
            else if ((isEmail || isContactNumber || isPassword || isConfirmPassword) && validity.patternMismatch) {
                error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
            }
            else if (isConfirmPassword && validity.customError) {
                error.textContent = constants.MATCH_PASSWORD_MESSAGE
            }

            return false;
        }

        error.textContent = '';
        return true;
  }
  render() {
      return (
          <div className='slds-m-around--medium modelWidth40 col-md-3 col-md-offset-3'>
              <UserForm ref='form' user={this.props.users} onSaved={ this.savedHandler } />
              <button className='btn marginBtn floatRight' onClick={ this.onCancelClick }>{ constants.CANCEL }</button>
              <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight MarginLeft1Per' onClick={ this.saveHandler }>{ constants.UPDATE }</button>
          </div>
      );
  }
}
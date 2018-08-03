import React from 'react';
import UserForm from './UserForm';
import constants from '../constants/Constants';

export default class UserFormWindow extends React.Component {
    constructor() {
        super();
        this.saveHandler = this.saveHandler.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            this.refs.form.save();
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
        validity = this.refs.form.refs[refName].validity;
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        const isContactNumber = refName === constants.TXT_CONTACTNUMBER;
        const isPassword = refName === constants.PASSWORD;
        const isconfirmpassword = refName === constants.TEXTBOX_CONFIRMPASSWORD;
        const isEmailId = refName === constants.EMAIL;
        if (isconfirmpassword) {
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
            else if ((isContactNumber || isEmailId) && validity.patternMismatch) {
                error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
            }
            else if ((isPassword || isconfirmpassword) && validity.patternMismatch) {
                error.textContent = constants.PWD_LENGTH_MESSAGE
            }
            else if (isconfirmpassword && validity.customError) {
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
                <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
                    <div className='slds-modal__container modelWidth40'>
                        <div className='slds-modal__header'>
                            <h4 className='slds-text-heading--medium header'>{ constants.NEWUSER }</h4>
                        </div>
                        <div className='slds-modal__content'>
                            <UserForm onchangeListner={this.props.onchangeListner} ref='form' onSaved={this.props.onSaved} />
                        </div>
                        <div className='slds-modal__footer'>
                            <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand' onClick={this.saveHandler}>{ constants.SAVE }</button>
                            <button className='btn MarginLeft1Per' onClick={this.props.onCancel}>{ constants.CANCEL }</button>
                        </div>
                    </div>
                </div>
                <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
            </div>
        );
    }
}
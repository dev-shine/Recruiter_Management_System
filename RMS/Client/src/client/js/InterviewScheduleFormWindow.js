import React from 'react';
import InterviewScheduleForm from './InterviewScheduleForm';
import constants from '../constants/Constants';

export default class InterviewScheduleFormWindow extends React.Component {
    constructor() {
        super();
        this.saveHandler = this.saveHandler.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.showSelectError = this.showSelectError.bind(this);
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            this.refs.form.save();
        }
    }
    showFormErrors() {
        const inputs = document.querySelectorAll('input[name]:not(.resumeClass)');
        let isFormValid = true;
        inputs.forEach(input => {
            input.classList.add('active');
            const isInputValid = this.showInputError(input.name);
            if (!isInputValid) {
                isFormValid = false;
            }
        });

        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            const isSelectValid = this.showSelectError(select.id, select);
            if (!isSelectValid) {
                select.classList.add('BorderRed');
                isFormValid = false;
            }
        });

        return isFormValid;
    }
    showInputError(refName) {
        let validity;
        if (refName === constants.TXT_SCHEDULEDATE)
        {
            validity = this.refs.form.refs[constants.TXT_SCHEDULEDATE].refs.input.refs.input.validity;
        }
        else {
            validity = this.refs.form.refs[refName].validity;
        }

        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        const isPhoneNumber = refName === constants.TXT_PHONENUMBER;
        const isEmailId = refName === constants.TXT_EMAILID;
        const isAlternatePhoneNumber = refName === constants.TXT_ALTERNATENUMBER;

        if (isAlternatePhoneNumber) {
          if (this.refs.form.refs.PhoneNumber.value !== '' && (this.refs.form.refs.PhoneNumber.value === this.refs.form.refs.AlternatePhoneNumber.value)) {
            this.refs.form.refs.AlternatePhoneNumber.setCustomValidity(constants.ALTERNATENUMBER_MESSAGE);
          } else {
            this.refs.form.refs.AlternatePhoneNumber.setCustomValidity('');
          }
        }

        if (!validity.valid) {
            if (validity.valueMissing) {
                if (refName === constants.RESUME) {
                    error.textContent = constants.REQUIRED_FILE_MESSAGE;
                }
                else {
                    error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
                }
            }
            else if (validity.typeMismatch) {
                error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
            }
            else if ((isPhoneNumber || isAlternatePhoneNumber || isEmailId) && validity.patternMismatch) {
                error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
            }
            else if (isAlternatePhoneNumber && validity.customError) {
                error.textContent = constants.ALTERNATENUMBER_MESSAGE
            }

            return false;
        }

        error.textContent = '';
        return true;
    }
    showSelectError(refName, control) {
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        if (control.selectedOptions[0].value === '0') {
            if (error.textContent === '') {
                error.textContent = constants.SELECT_MESSAGE + ` ${label}`;
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
                    <div className='slds-modal__container'>
                        <div className='slds-modal__header'>
                            <h4 className='slds-text-heading--medium header'>{ constants.NEWINTERVIEWEE }</h4>
                        </div>
                        <div className='slds-modal__content'>
                            <InterviewScheduleForm interviewStatus={this.props.interviewStatus} person={this.props.person} onchangeListner={this.props.onchangeListner} ref='form' onSaved={this.props.onSaved} />
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
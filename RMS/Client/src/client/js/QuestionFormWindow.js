import React from 'react';
import QuestionForm from './QuestionForm';
import constants from '../constants/Constants';

export default class QuestionFormWindow extends React.Component {
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
        let isFormValid = true;
        const textarea = document.querySelectorAll('textarea[name]');
        textarea.forEach(input => {
            const isTextareaValid = this.showInputError(input.name);
            if (!isTextareaValid) {
                input.classList.add('BorderRed');
                isFormValid = false;
            }
        });

        const inputs = document.querySelectorAll('input[name]');
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
        validity = this.refs.form.refs[refName].validity;
        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);

        if (!validity.valid) {
            if (validity.valueMissing) {
                error.textContent =  constants.REQUIRED_MESSAGE + ` ${label}`;
            }
            else if (validity.patternMismatch) {
                if (refName === constants.TXT_SORTORDER) {
                    error.textContent = constants.SORTORDER_MESSAGE
                }
                else {
                    error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
                }
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
                    <div className='slds-modal__container modelWidth40'>
                        <div className='slds-modal__header'>
                            <h4 className='slds-text-heading--medium header'>{ constants.NEW_QUESTION }</h4>
                        </div>
                        <div className='slds-modal__content'>
                            <QuestionForm ref='form' questionCategory={ this.props.questionCategory } onchangeListner={ this.props.onchangeListner } onSaved={ this.props.onSaved } />
                        </div>
                        <div className='slds-modal__footer'>
                            <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand' onClick={ this.saveHandler }>{ constants.SAVE }</button>
                            <button className='btn MarginLeft1Per' onClick={ this.props.onCancel }>{ constants.CANCEL }</button>
                        </div>
                    </div>
                </div>
                <div className='slds-modal-backdrop slds-modal-backdrop--open'></div>
            </div>
        );
    }
}
import React from 'react';
import QuestionCategoryForm from './QuestionCategoryForm';
import constants from '../constants/Constants';

export default class QuestionCategoryFormWindow extends React.Component {
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
        if (!validity.valid) {
            if (validity.valueMissing) {
                error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
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
    render() {
        return (
            <div>
                <div aria-hidden='false' role='dialog' className='slds-modal slds-fade-in-open'>
                    <div className='slds-modal__container modelWidth40'>
                        <div className='slds-modal__header'>
                            <h4 className='slds-text-heading--medium header'>{ constants.NEW_QUESTIONCATEGORY }</h4>
                        </div>
                        <div className='slds-modal__content'>
                            <QuestionCategoryForm onchangeListner={this.props.onchangeListner} ref='form' onSaved={this.props.onSaved} />
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
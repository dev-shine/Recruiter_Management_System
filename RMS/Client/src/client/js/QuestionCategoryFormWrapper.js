import React from 'react';
import QuestionCategoryForm from './QuestionCategoryForm';
import { NotificationManager } from 'react-notifications';
import { browserHistory } from 'react-router';
import QuestionCategoryStore from './../stores/QuestionCategoryStore';
import constants from '../constants/Constants';

export default class QuestionCategoryFormWrapper extends React.Component {
    constructor() {
        super();
        this.state = { isUpdate : false };
        this.onUpdateChange = this.onUpdateChange.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savedHandler = this.savedHandler.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
    }
    componentWillMount() {
        QuestionCategoryStore.addChangeListener(this.onUpdateChange);
    }
    componentWillUnmount() {
        QuestionCategoryStore.removeChangeListener(this.onUpdateChange);
    }
    onUpdateChange() {
        if (this.state.isUpdate)
        {
            this.setState({ categoryUpdateStatus: QuestionCategoryStore.getUpdateStatus() }, function() {
                this.setState({ isUpdate: false });
                if (this.state.categoryUpdateStatus === constants.LBL_CONFLICT)
                {
                    this.props.router.push('/questioncategories')
                    setTimeout(() => NotificationManager.error(constants.QUESTIONCATEGORY_EXIST, '', 2000), 1000);
                }
                else if (this.state.categoryUpdateStatus === constants.LBL_OK)
                {
                    this.props.router.push('/questioncategories')
                    setTimeout(() => NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000), 1000);
                }
            });
        }
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            this.refs.form.save();
        }
    }
    savedHandler() {
        this.setState({ isUpdate: true });
    }
    onCancelClick() {
        browserHistory.push('/questioncategories');
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
         if (!validity.valid) {
           if (validity.valueMissing) {
              error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
           }
           else if (validity.patternMismatch) {
               if (refName ===  constants.TXT_SORTORDER) {
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
            <div className='slds-m-around--medium modelWidth40 col-md-3 col-md-offset-3'>
                <QuestionCategoryForm ref='form' questioncategory={this.props.questioncategories} onSaved={ this.savedHandler } />
                <button className='btn marginBtn floatRight' onClick={ this.onCancelClick }>{ constants.CANCEL }</button>
                <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight MarginLeft1Per' onClick={ this.saveHandler }>{ constants.UPDATE }</button>
            </div>
        );
    }
}
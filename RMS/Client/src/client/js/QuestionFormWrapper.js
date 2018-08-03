import React from 'react';
import QuestionForm from './QuestionForm';
import { browserHistory } from 'react-router';
import { NotificationManager} from 'react-notifications';
import questionStore from './../stores/QuestionStore';
import questionCategoryStore from './../stores/QuestionCategoryStore';
import questionCategoryActions from './../actions/QuestionCategoryActions';
import constants from '../constants/Constants';

export default class QuestionFormWrapper extends React.Component {
    constructor() {
        super();
        this.state = { questionCategory: [], isUpdate: false };
        this.onChange = this.onChange.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savedHandler = this.savedHandler.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.showSelectError = this.showSelectError.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
    }
    componentWillMount() {
        questionCategoryStore.addChangeListener(this.onChange);
        questionStore.addChangeListener(this.onUpdateChange);
        questionCategoryActions.getAllActiveCategories();
    }
    componentWillUnmount() {
        questionCategoryStore.removeChangeListener(this.onChange);
        questionStore.removeChangeListener(this.onUpdateChange);
    }
    onChange() {
        this.setState({
            questionCategory: questionCategoryStore.getAllActiveCategories()
        });
    }
    onUpdateChange() {
        if (this.state.isUpdate)
        {
            this.setState({
                questionUpdateStatus : questionStore.getQuestionUpdateStatus()
            }, function() {
                  this.setState({ isUpdate: false });
                  if (this.state.questionUpdateStatus === constants.CONFLICT) {
                      this.props.router.push('/questions')
                      setTimeout(() => NotificationManager.error(constants.QUESTION_EXIST, '', 2000), 1000);
                  }
                  else if (this.state.questionUpdateStatus === constants.LBL_OK) {
                      this.props.router.push('/questions')
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
    onCancelClick() {
        browserHistory.push('/questions')
    }
    render() {
        return (
            <div className='slds-m-around--medium modelWidth40 col-md-offset-3'>
                <QuestionForm ref='form' question={ this.props.question } questionCategory={ this.state.questionCategory } onSaved={ this.savedHandler } />
                <button className='btn marginBtn MarginLeft1Per floatRight' onClick={ this.onCancelClick }>{ constants.CANCEL }</button>
                <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight' onClick={ this.saveHandler }>{ constants.UPDATE }</button>
            </div>
        );
    }
}
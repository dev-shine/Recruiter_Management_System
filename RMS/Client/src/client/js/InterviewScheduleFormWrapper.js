import React from 'react';
import InterviewScheduleForm from './InterviewScheduleForm';
import { browserHistory } from 'react-router';
import { NotificationManager} from 'react-notifications';
import constants from '../constants/Constants';
import interviewScheduleStore from './../stores/InterviewScheduleStore';
import InterviewStatusStore from './../stores/InterviewStatusStore';
import InterviewStatusActions from './../actions/InterviewStatusActions';
import personAction from './../actions/PersonActions';
import personStore from '../stores/PersonStore';

export default class InterviewScheduleFormWrapper extends React.Component {
    constructor() {
        super();
        this.state = { interviewStatus: [], person: [] };
        this.onChange = this.onChange.bind(this);
        this.onUpdateChange = this.onUpdateChange.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savedHandler = this.savedHandler.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.showSelectError = this.showSelectError.bind(this);
    }
    componentWillMount() {
        interviewScheduleStore.addChangeListener(this.onUpdateChange);
        InterviewStatusStore.addChangeListener(this.onChange);
        InterviewStatusActions.getInterviewStatus();
        personStore.addChangeListener(this.onChange);
        personAction.getAllPersons();
    }
    componentWillUnmount() {
         InterviewStatusStore.removeChangeListener(this.onChange);
         interviewScheduleStore.removeChangeListener(this.onUpdateChange);
         personStore.removeChangeListener(this.onChange);
    }
    onChange() {
        this.setState({
            interviewStatus: InterviewStatusStore.returnStore(),
            person: personStore.getPersons()
        });
    }
    onUpdateChange() {
        this.setState({ interviewUpdateStatus: interviewScheduleStore.getUpdateStatus() }, function() {
            if (this.state.interviewUpdateStatus === constants.CONFLICT) {
                this.props.router.push('/interviewees')
                setTimeout(() => NotificationManager.error(constants.INTERVIEW_EXIST, '', 2000), 1000);
            }
            else if (this.state.interviewUpdateStatus === constants.LBL_OK) {
                this.props.router.push('/interviewees')
                setTimeout(() => NotificationManager.success(constants.UPDATE_SUCCESS_MESSAGE, '', 2000), 1000);
            }
        });
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            this.refs.form.save();
        }
    }
    savedHandler() {
    }
    onCancelClick() {
        browserHistory.push('/interviewees');
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
        if(refName === constants.TXT_SCHEDULEDATE)
        {
            validity = this.refs.form.refs[constants.TXT_SCHEDULEDATE].refs.input.refs.input.validity;
        }
        else {
            validity = this.refs.form.refs[refName].validity;
        }

        const label = document.getElementById(`${refName}Label`).textContent;
        const error = document.getElementById(`${refName}Error`);
        const isPhoneNumber = refName === constants.TXT_PHONENUMBER;
        const isAlternatePhoneNumber = refName === constants.TXT_ALTERNATENUMBER;
        const isEmailId = refName === constants.TXT_EMAILID;
        if (isAlternatePhoneNumber) {
            if (this.refs.form.refs.PhoneNumber.value !== '' && this.refs.form.refs.PhoneNumber.value === this.refs.form.refs.AlternatePhoneNumber.value) {
                this.refs.form.refs.AlternatePhoneNumber.setCustomValidity(constants.ALTERNATENUMBER_MESSAGE);
            }
            else {
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
            if (error.textContent === ''){
                error.textContent = constants.SELECT_MESSAGE + ` ${label}`;
            }

            return false;
        }

        error.textContent = '';
        return true;
    }
    render() {
        return (
            <div className='slds-m-around--medium'>
                <InterviewScheduleForm ref='form' interview={this.props.interview} interviewStatus={this.state.interviewStatus} onchangeListner={this.props.onchangeListner} person={ this.state.person } onSaved={ this.savedHandler } />
                <button className='btn MarginLeft1Per floatRight' onClick={ this.onCancelClick }>{ constants.CANCEL }</button>
                <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight' onClick={ this.saveHandler }>{ constants.UPDATE }</button>
            </div>
        );
    }
}
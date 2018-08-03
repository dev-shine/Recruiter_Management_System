import React from 'react';
import { NotificationManager } from 'react-notifications';
import UserActions from './../actions/UserActions';
import {browserHistory} from 'react-router';
import './components/loginJquery.js';
import constants from '../constants/Constants';
import UserStore from './../stores/UserStore';
var data = [];

export default class UserRegistration extends React.Component {
    constructor() {
        super();
        this.state = { list: [], IsActive: true, userRecord: [] };
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.save = this.save.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.numericOnly = this.numericOnly.bind(this);
        this.alphaOnly = this.alphaOnly.bind(this);
    }
    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
    }
    handleChange(event) {
        data[event.target.name] = event.target.value;
        this.setState({ userRecord : data });
    }
    onChange() {
        this.setState({ userInsertStatus : UserStore.getInsertStatus() }, function() {
           if (this.state.userInsertStatus === constants.CONFLICT) {
               browserHistory.push('/')
               setTimeout(() => NotificationManager.error(constants.EMAIL_EXIST_MESSAGE, '', 2000), 1000);
           }
           else if (this.state.userInsertStatus === constants.LBL_OK)
           {
               browserHistory.push('/')
               setTimeout(() => NotificationManager.success(constants.REGISTERUSER_SUCCESS_MESSAGE, '', 2000), 1000);
           }
         });
    }
    onCancelClick() {
        browserHistory.push('/login')
    }
    save() {
        let obj = this.state.userRecord;
        obj['IsActive'] = true;
        this.setState({userRecord : obj});
        if (this.showFormErrors()) {
            UserActions.addNewItem(this.state.userRecord);
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
        const isConfirmPassword = refName === constants.CONFIRM_PASSWORD;
        if (isConfirmPassword) {
           if (this.refs.Password.value !== '' && this.refs.Password.value !== this.refs.Confirmpassword.value) {
              this.refs.Confirmpassword.setCustomValidity(constants.MATCH_PASSWORD_MESSAGE);
           }
           else {
              this.refs.Confirmpassword.setCustomValidity('');
           }
        }

        if (!validity.valid) {
           if (validity.valueMissing) {
               error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
           }
           else if (validity.patternMismatch) {
              if (refName === constants.EMAIL) {
                  error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
              }
           }
           else if (validity.typeMismatch) {
              error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
           }
           else if ((isPassword || isConfirmPassword) && validity.patternMismatch) {
              error.textContent = constants.PWD_LENGTH_MESSAGE
           }
           else if (isConfirmPassword && validity.customError) {
              error.textContent = constants.MATCH_PASSWORD_MESSAGE
           }

           return false;
        }

        error.textContent = '';
        return true;
    }
    numericOnly(e) {
        const re = /[0-9]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }
    alphaOnly(e) {
        const re = /[a-zA-Z]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }
    render() {
        if (this.props.user !== undefined && this.props.user.length !== 0) {
            if (this.props.user.UserId) {
                var lblPassword = this.refs.lblPassword;
                var lblcnfPassword = this.refs.lblcnfPassword;
                var inputPassword = this.refs.inputPassword;
                var inputcnfPassword = this.refs.inputcnfPassword;
                lblPassword.classList.add('displayNone');
                lblcnfPassword.classList.add('displayNone');
                inputPassword.classList.add('displayNone');
                inputcnfPassword.classList.add('displayNone');
            }
        }
        return (
            <div>
                <hgroup className='group'>
                    <h2>{ constants.SIGNUP_HEADER }</h2>
                </hgroup>
                <div id='regForm'>
                    <div id={constants.REGISTER_FORM} className='form-group col-md-offset-4 col-md-6'>
                        <div className='groupRegForm col-md-12'>
                            <div className='col-md-3 Padding0PxForDiv'>
                                <label id={constants.LBL_FIRSTNAME} className='control-label'>{ constants.FIRSTNAME }</label>
                            </div>
                            <div className='col-md-6 Padding0PxForDiv'>
                                <input className='form-control' type='text' name={constants.TXT_FIRSTNAME} ref={constants.TXT_FIRSTNAME} onKeyPress={(e) => this.alphaOnly(e)} value={this.state.userRecord.FirstName ? this.state.userRecord.FirstName : ''} onChange={this.handleChange} autoFocus required />
                                <div className='error' id={constants.LBL_FIRSTNAME_ERROR} />
                            </div>
                        </div >
                        <div className='groupRegForm col-md-12'>
                            <div className='col-md-3 Padding0PxForDiv'>
                                <label id={constants.LBL_LASTNAME} className='control-label'>{ constants.LASTNAME }</label>
                            </div>
                            <div className='col-md-6 Padding0PxForDiv'>
                                <input className='form-control' type='text' name={constants.TXT_LASTNAME} ref={constants.TXT_LASTNAME} onKeyPress={(e) => this.alphaOnly(e)} value={this.state.userRecord.LastName ? this.state.userRecord.LastName : ''} onChange={this.handleChange} required />
                                <div className='error' id={constants.LBL_LASTNAME_ERROR} />
                            </div>
                        </div>
                        <div className='groupRegForm col-md-12'>
                            <div className='col-md-3 Padding0PxForDiv'>
                                <label id={constants.LBL_CONTACTNUMBER} className='control-label'>{ constants.CONTACTNUMBER }</label>
                            </div>
                            <div className='col-md-6 Padding0PxForDiv'>
                                <input className='form-control' type='text' name={constants.TXT_CONTACTNUMBER} ref={constants.TXT_CONTACTNUMBER} onKeyPress={(e) => this.numericOnly(e)} pattern='^\d{10}$' value={this.state.userRecord.ContactNumber ? this.state.userRecord.ContactNumber : ''} onChange={this.handleChange} required />
                                <div className='error' id={constants.LBL_CONTACTNUMBER_ERROR} />
                            </div>
                        </div>
                        <div className='groupRegForm col-md-12'>
                            <div className='col-md-3 Padding0PxForDiv'>
                                <label id={constants.EMAILLABEL} className='control-label'>{ constants.EMAIL }</label>
                            </div>
                            <div className='col-md-6 Padding0PxForDiv'>
                                <input className='form-control' type='email' name={constants.EMAIL} ref={constants.EMAIL} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" value={this.state.userRecord.Email ? this.state.userRecord.Email : ''} onChange={this.handleChange} required />
                                <div className='error' id={constants.EMAILERROR} />
                            </div>
                        </div>
                        <div className='groupRegForm col-md-12'>
                            <div className='col-md-3 Padding0PxForDiv'>
                                <label id={constants.PASSWORD_LABEL} className='control-label'>{ constants.PASSWORD }</label>
                            </div>
                            <div className='col-md-6 Padding0PxForDiv' ref='inputPassword'>
                                <input className='form-control' type='password' name={constants.PASSWORD} ref={constants.PASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={this.state.userRecord.Password ? this.state.userRecord.Password : ''} onChange={this.handleChange} required />
                                <div className='error' id={constants.LBL_PASSWORDERROR} />
                            </div>
                        </div>
                        <div className='group col-md-12'>
                            <div className='col-md-3 Padding0PxForDiv' ref={constants.LBL_CONFIRM_PASSWORD}>
                                <label id={constants.CONFIRM_PASSWORD_LABEL} className='control-label'>{ constants.CONFIRMPASSWORD }</label>
                            </div>
                            <div className='col-md-6 Padding0PxForDiv' ref={constants.INPUT_CONFIRMPASSWORD}>
                                <input className='form-control' type='password' name={constants.CONFIRM_PASSWORD} ref={constants.CONFIRM_PASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={this.state.userRecord.Confirmpassword ? this.state.userRecord.Confirmpassword : ''} onChange={this.handleChange} required />
                                <div className='error' id={constants.CONFIRM_PASSWORD_ERROR} />
                            </div>
                        </div>
                        <div className='groupRegForm col-md-9'>
                            <button className='btn MarginLeft1Per floatRight' onClick={this.onCancelClick}>{ constants.CANCEL }</button>
                            <button className='btn btn-primary slds-button floatRight' onClick={ this.save }>{ constants.SUBMIT }</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
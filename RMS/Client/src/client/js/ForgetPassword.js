import React from 'react';
import { NotificationManager } from 'react-notifications';
import UserActions from './../actions/UserActions';
import UserStore from '../stores/UserStore';
import { browserHistory } from 'react-router';
import constants from '../constants/Constants';
var userData = [];

export default class ForgetPassword extends React.Component {
    constructor() {
        super();
        this.state = { userRecord: [] };
        this.saveHandler = this.saveHandler.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
    }
    componentDidMount() {
        UserStore.addChangeListener(this.onForgotPassword);
    }
    componentWillUnmount() {
        UserStore.removeChangeListener(this.onForgotPassword);
    }
    saveHandler(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            UserActions.ForgotPassword(this.state.userRecord);
        }
    }
    onCancel(){
        browserHistory.goBack();
    }
    onForgotPassword() {
        this.setState({ ForogotPaswordStatus: UserStore.forogotPaswordConfirmation() });
        if (this.state.ForogotPaswordStatus == constants.LBL_OK) {
            browserHistory.push('/login')
            setTimeout(() => NotificationManager.success(constants.PWD_SEND_MESSAGE, '', 2000), 1000);
        }
        else {
            NotificationManager.error(constants.USER_STATUS_MESSAGE, '', 3000)
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
        if (!validity.valid)
        {
            if (validity.valueMissing) {
                error.textContent = constants.REQUIRED_MESSAGE + ` ${label}`;
            }
            else if (validity.typeMismatch) {
                error.textContent = constants.VALIDITY_MESSAGE + ` ${label}`;
            }

            return false;
        }

        error.textContent = '';
        return true;
    }
    handleChange(event) {
        userData[event.target.name] = event.target.value;
        this.setState({userRecord : userData});
    }
    render() {
        return (
            <div className='login'>
                <hgroup>
                    <h2>{ constants.FORGOTPASSWORD }</h2>
                </hgroup>
                <form id={constants.LBL_FORGOTPASSWORDFORM}>
                    <div className='form-group'>
                        <label id={constants.EMAILLABEL} className='control-label'>{ constants.EMAIL }</label>
                    </div>
                    <div className='groupLoginForm'>
                        <input className='form-control' type='email' name={constants.EMAIL} ref={constants.EMAIL} value={this.state.userRecord.Email ? this.state.userRecord.Email : ''} onChange={this.handleChange} autoFocus required />
                        <div className='error' id={constants.EMAILERROR} />
                    </div>
                    <button className='twoButton button btn-primary' onClick={ this.saveHandler }>{ constants.SUBMIT }</button>
                    <button className='twoButton2 marginLeft8P' onClick={ this.onCancel }>{ constants.CANCEL }</button>
                </form>
            </div>
        );
    }
}
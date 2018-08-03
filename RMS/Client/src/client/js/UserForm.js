import React from 'react';
import UserActions from './../actions/UserActions';
import constants from '../constants/Constants';
var userData = [];
let checkbox;

export default class UserForm extends React.Component {
    constructor() {
        super();
        this.state = { list : [], userRecord: [] };
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.changeIsActive = this.changeIsActive.bind(this);
        this.numericOnly = this.numericOnly.bind(this);
        this.alphaOnly = this.alphaOnly.bind(this);
        this.prevent = this.prevent.bind(this);
    }
    componentDidMount() {
        userData = [];
        userData['IsActive'] = true;
        this.setState({ userRecord: userData });
    }
    componentWillReceiveProps(props) {
        let user = props.user;
        this.setState(user);
        this.setState({ userRecord: props.user }, function() {
            userData = this.state.userRecord;
        });
    }
    handleChange(event) {
        userData[event.target.name] = event.target.value;
        this.setState({ userRecord : userData });
    }
    save() {
        if (this.state.UserId)
        {
            UserActions.updateItem(this.state.userRecord);
            if (this.props.onSaved){
                this.props.onSaved();
            }
        }
        else {
            UserActions.addNewItem(this.state.userRecord);
            if (this.props.onSaved) {
                this.props.onSaved(constants.LBL_OK);
            }
        }
    }
    changeIsActive(e) {
        userData['IsActive'] = e.target.checked;
        this.setState({ userRecord : userData });
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
    prevent(e) {
        if (e.key === '<' || e.key === '>') {
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
                var lblEmail = this.refs.lblEmail;
                var inputEmail = this.refs.inputEmail;
                lblPassword.classList.add('displayNone');
                lblcnfPassword.classList.add('displayNone');
                inputPassword.classList.add('displayNone');
                inputcnfPassword.classList.add('displayNone');
                lblEmail.classList.add('displayNone');
                inputEmail.classList.add('displayNone');
            }
        }

        if (this.props.user !== undefined && this.props.user.length !== 0) {
            checkbox = (<input type='checkbox'  checked={this.props.user.IsActive} onChange={this.changeIsActive} />)
        }
        else {
            if (this.state.userRecord !== undefined) {
                if (this.state.userRecord.IsActive === true) {
                    checkbox = (<input type='checkbox' checked={true} onChange={this.changeIsActive} />)
                }
                else {
                    checkbox = (<input type='checkbox' checked={false}  onChange={this.changeIsActive} />)
                }
            }
        }
        return (
          <div className='form-group col-md-12'>
              <div className='col-md-3'>
                  <label id={constants.LBL_FIRSTNAME} className='control-label'>{ constants.FIRSTNAME }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_FIRSTNAME} ref={constants.TXT_FIRSTNAME} onKeyPress={(e) => this.alphaOnly(e)} value={this.state.userRecord.FirstName ? this.state.userRecord.FirstName : ''} onChange={this.handleChange} autoFocus required />
                  <div className='error' id={constants.LBL_FIRSTNAME_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label id={constants.LBL_LASTNAME} className='control-label'>{ constants.LASTNAME }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_LASTNAME} ref={constants.TXT_LASTNAME} onKeyPress={(e) => this.alphaOnly(e)} value={this.state.userRecord.LastName ? this.state.userRecord.LastName : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.LBL_LASTNAME_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label id={constants.LBL_CONTACTNUMBER} className='control-label'>{ constants.CONTACTNUMBER }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_CONTACTNUMBER} ref={constants.TXT_CONTACTNUMBER} onKeyPress={(e) => this.numericOnly(e)} pattern='^\d{10}$' value={this.state.userRecord.ContactNumber ? this.state.userRecord.ContactNumber : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.LBL_CONTACTNUMBER_ERROR} />
              </div>

              <div className='col-md-3' ref='lblEmail'>
                  <label id={constants.EMAILLABEL} className='control-label'>{ constants.EMAIL }</label>
              </div>
              <div className='col-md-9 form-group' ref='inputEmail'>
                  <input className='form-control password' type='email' name={constants.EMAIL} ref={constants.EMAIL} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" value={this.state.userRecord.Email ? this.state.userRecord.Email : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.EMAILERROR} />
              </div>

              <div className='col-md-3' ref='lblPassword' >
                  <label id={constants.PASSWORD_LABEL} className='control-label'>{ constants.PASSWORD }</label>
              </div>
              <div className='col-md-9 form-group' ref={constants.INPUT_PASSWORD}>
                  <input className='form-control password' type='password' name={constants.PASSWORD} ref={constants.PASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={this.state.userRecord.Password ? this.state.userRecord.Password : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.LBL_PASSWORDERROR} />
              </div>

              <div className='col-md-3' ref={constants.LBL_CONFIRM_PASSWORD}>
                  <label id={constants.CONFIRM_PASSWORDLABEL} className='control-label'>{ constants.CONFIRMPASSWORD }</label>
              </div>
              <div className='col-md-9 form-group ' ref={constants.INPUT_CONFIRMPASSWORD}>
                  <input className='form-control password' type='password' name={constants.TEXTBOX_CONFIRMPASSWORD} ref={constants.TEXTBOX_CONFIRMPASSWORD} pattern='[a-zA-Z0-9@#$%^&*]{8,}$' value={this.state.userRecord.ConfirmPassword ? this.state.userRecord.ConfirmPassword : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.LBL_CONFIRM_PASSWORD_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label className='control-label'>{ constants.STATUS }</label>
              </div>
              <div className='col-md-9 form-group'>
                  {checkbox}
              </div>
          </div>
        );
    }
}
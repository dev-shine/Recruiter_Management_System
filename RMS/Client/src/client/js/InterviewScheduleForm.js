import React from 'react';
import moment from 'moment';
import Ddl from'./components/Ddl';
import Dropdown from 'react-dropdown-multiselect';
import DatePicker from 'react-datepicker';
import { NotificationManager } from 'react-notifications';
import personAction from './../actions/PersonActions';
import personStore from '../stores/PersonStore';
import interviewScheduleAction from './../actions/InterviewScheduleActions';
import constants from '../constants/Constants';
import _ from 'lodash';
import appConstants from './../constants/AppConstants';
import axios from 'axios';
var interviewData = [];
let checkbox;
let isInvoicedCheckbox;
let isArchivedCheckbox;

export default class InterviewScheduleForm extends React.Component {
    constructor() {
        super();
        this.state = { list : [], interviewRecord: [] };
        this.save = this.save.bind(this);
        this.onChangeForCCMail = this.onChangeForCCMail.bind(this);
        this.changeInterviewStatus = this.changeInterviewStatus.bind(this);
        this.changeToEmail = this.changeToEmail.bind(this);
        this.changeIsActive = this.changeIsActive.bind(this);
        this.changeIsInvoiced = this.changeIsInvoiced.bind(this);
        this.changeIsArchived = this.changeIsArchived.bind(this);
        this.changeCCMail = this.changeCCMail.bind(this);
        this.changeScheduleDate = this.changeScheduleDate.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
        this.handleFileSubmit = this.handleFileSubmit.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.numericOnly = this.numericOnly.bind(this);
        this.alphaOnly = this.alphaOnly.bind(this);
        this.prevent = this.prevent.bind(this);
        this.resumeRemoveHandler = this.resumeRemoveHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        interviewData = [];
        interviewData['IsActive'] = true;
        this.setState({ interviewRecord: interviewData });
        personStore.addChangeListener(this.onChangeForCCMail);
    }
    componentWillUnmount() {
        personStore.removeChangeListener(this.onChangeForCCMail);
    }
    componentWillReceiveProps(props) {
        let interview = props.interview;
        let personValue = [];
        let personCCList = []
        let ccList = [];
        this.setState(interview);
        this.setState({ interviewRecord: props.interview });
        interviewData = this.state.interviewRecord;
        if (interview !== undefined && interview.length !== 0) {
            if (interview.CCEmail !== '' && interview.CCMailsId !== null) {
                personValue = interview.CCEmail.split(',');
                ccList = interview.CCMailsId.split(',')
                for (var ccIndex = 0; ccIndex < this.props.person.length; ccIndex++) {
                    for (var personIndex = 0; personIndex < ccList.length; personIndex++) {
                        if (ccList[personIndex] === this.props.person[ccIndex].PersonId) {
                            personCCList.push(this.props.person[ccIndex]);
                        }
                    }
                }
            }

            this.setState({ list: personCCList});
            let personList = [];
            var persons = this.state.list;
            if (persons.length > 0) {
                for (var index = 0; index < persons.length; index++) {
                    for (var personIndex = 0; personIndex < personValue.length; personIndex++) {
                        if (personValue[personIndex] === persons[index].PersonId) {
                            personList.push(persons[index]);
                        }
                    }
                }

                this.setState({ ccPersonList : personList });
            }
        }
    }
    save() {
        if (this.state.InterviewId)
        {
            interviewScheduleAction.updateItem(this.state.interviewRecord);
            if (this.props.onSaved) {
              this.props.onSaved();
            }
        }
        else {
            interviewScheduleAction.addNewItem(this.state.interviewRecord);
            if (this.props.onSaved) {
                this.props.onSaved(constants.LBL_OK);
            }
        }
    }
    onChangeForCCMail() {
        this.setState({ list: personStore.getPerson() })
    }
    changeInterviewStatus(e) {
        interviewData['InterviewStatusId'] = e;
        this.setState({ interviewRecord : interviewData });
    }
    changeToEmail(e) {
        interviewData['ToEmail'] = e;
        interviewData['CCEmail'] = '';
        this.setState({ interviewRecord: interviewData });
        this.setState({ ccPersonList: [] });
        personAction.getPersonById(e);
    }
    changeIsActive(e) {
        interviewData['IsActive'] = e.target.checked;
        this.setState({ interviewRecord: interviewData });
    }
    changeIsInvoiced(e) {
        interviewData['IsInvoiced'] = e.target.checked;
        this.setState({ interviewRecord: interviewData });
    }
    changeIsArchived(e) {
        interviewData['IsArchived'] = e.target.checked;
        this.setState({ interviewRecord: interviewData });
    }
    changeCCMail(options) {
        this.setState({ ccPersonList : undefined });
        var output = [];
        _.map(options, function(option) {
            output = output.concat([option.PersonId]);
        });
        var ccMail = output.join(',');
        interviewData['CCEmail'] = ccMail;
        this.setState({ interviewRecord : interviewData })
    }
    changeScheduleDate(e) {
        interviewData['ScheduleDate'] = e;
        this.setState({interviewRecord : interviewData});
    }
    removeNotification() {
        return {
            success: NotificationManager.success(constants.FILE_REMOVE_MESSAGE, '', 3000)
        };
    }
    handleFileSubmit(e) {
        e.preventDefault();
        if (this.showFormErrors()) {
            const _this = this;
            this.setState({ processing: true });
            document.dispatchEvent(new Event(constants.LBL_STARTWAITING));
            axios({
                url: appConstants.IMAGEUPLOAD,
                method: 'post',
                data: {
                    data_uri: this.state.data_uri,
                    filename: this.state.Resume,
                    filepath: this.state.filepath,
                    filetype: this.state.filetype
                },
                dataType: 'json',
                crossOrigin: true,
                headers: {
                  'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                }
            }).then(function(status) {
                document.dispatchEvent(new Event(constants.LBL_STOPWAITING));
                NotificationManager.success(constants.FILE_UPLOAD_MESSAGE, '', 3000)
            });

            interviewData['Resume'] = this.state.Resume;
            this.setState({interviewRecord : interviewData});
        }
    }
    showFormErrors() {
        const inputs = document.querySelectorAll('input[name*="Resume"]');
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
        const error = document.getElementById(`${refName}Error`);
        if (!validity.valid) {
            if (validity.valueMissing) {
                error.textContent = constants.REQUIRED_FILE_MESSAGE
            }

            return false;
        }

        error.textContent = '';
        return true;
    }
    handleFile(e) {
        const reader = new FileReader();
        const file = e.target.files[0];
        const value =e.target.value;
        var tmppath = URL.createObjectURL(e.target.files[0]);
        console.log(value);
        var fullFileName = e.target.files[0].name;
        var parts = fullFileName.split('.');
        var ticks = (new Date() * 10000) + 621355968000000000;
        var fileName = parts[0] + ticks + '.' + parts[1];
        reader.onload = (upload) => {
            this.setState({
                data_uri: upload.target.result,
                filepath: value,
                Resume: fileName,
                filetype: file.type
            });
        }

        reader.readAsDataURL(file);
    }
    if (uploaded_uri) {
        var uploaded = (
          <div>
              <h4>Image uploaded!</h4>
              <img className='image-preview' src={this.state.uploaded_uri} alt='' />
              <pre className='image-link-box'>{this.state.uploaded_uri}</pre>
          </div>
      )
    }
    if (processing) {
        processing = 'Processing image, hang tight'
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
    resumeRemoveHandler() {
        const _this = this;
        axios({
            url: appConstants.IMAGEREMOVE,
            method: 'post',
            interviewData: {
                ResumeName: this.props.interview.Resume,
                InterviewId: this.props.interview.InterviewId
            },
            dataType: 'json',
            crossOrigin: true,
            headers: {
                'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
            }
        });
        interviewData['Resume'] = undefined;
        this.setState({interviewRecord : interviewData});
        setTimeout(() => this.removeNotification(), 300);
        var divFormObject = this.refs.divForm;
        var divButtonObject = this.refs.divButton;
        divButtonObject.classList.add('displayNone');
        divFormObject.classList.remove('displayNone');
    }
    handleChange(event) {
        interviewData[event.target.name] = event.target.value;
        this.setState({ interviewRecord : interviewData });
    }
    render() {
        var classForm = '';
        var classButton = '';
        if (this.props.interview !== undefined) {
            const resumeValue = this.props.interview.Resume;
            if (resumeValue === undefined || resumeValue === null) {
                classButton = 'displayNone';
            }
            else {
                classForm = 'displayNone';
            }
        }
        else {
            classButton = 'displayNone';
        }

        if (this.props.interview !== undefined && this.props.interview.length !== 0)
        {
            checkbox = (<input type='checkbox' checked={this.props.interview.IsActive} onChange={this.changeIsActive} />)
        }
        else
        {
            if (this.state.interviewRecord.IsActive === true)
            {
                checkbox = (<input type='checkbox' checked={true} onChange={this.changeIsActive} />)
            }
            else
            {
                checkbox = (<input type='checkbox' checked={false} onChange={this.changeIsActive} />)
            }
        }

        if (this.props.interview !== undefined && this.props.interview.length !== 0)
        {
            isInvoicedCheckbox = (<input type='checkbox' checked={this.props.interview.IsInvoiced} onChange={this.changeIsInvoiced} />)
        }
        else
        {
            if (this.state.interviewRecord.IsInvoiced === true)
            {
                isInvoicedCheckbox = (<input type='checkbox' checked={true} onChange={this.changeIsInvoiced} />)
            }
            else
            {
                isInvoicedCheckbox = (<input type='checkbox' checked={false} onChange={this.changeIsInvoiced} />)
            }
        }

        if (this.props.interview !== undefined && this.props.interview.length !== 0)
        {
            isArchivedCheckbox = (<input type='checkbox' checked={this.props.interview.IsArchived} onChange={this.changeIsArchived} />)
        }
        else
        {
            if (this.state.interviewRecord.IsArchived === true)
            {
                isArchivedCheckbox = (<input type='checkbox' checked={true} onChange={this.changeIsArchived} />)
            }
            else
            {
                isArchivedCheckbox = (<input type='checkbox' checked={false} onChange={this.changeIsArchived} />)
            }
        }

        return (
            <div className='form-group col-md-12'>
                <div className='col-md-6'>
                    <div className='col-md-3'>
                        <label id={constants.LBL_FIRSTNAME} className='control-label'>{ constants.FIRSTNAME }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='text' name={constants.TXT_FIRSTNAME} ref={constants.TXT_FIRSTNAME} onKeyPress={(e) => this.alphaOnly(e)} value={this.state.interviewRecord.FirstName ? this.state.interviewRecord.FirstName : ''} onChange={this.handleChange} autoFocus required />
                        <div className='error' id={constants.LBL_FIRSTNAME_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_LASTNAME} className='control-label'>{ constants.LASTNAME }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='text' name={constants.TXT_LASTNAME} ref={constants.TXT_LASTNAME} onKeyPress={(e) => this.alphaOnly(e)} value={this.state.interviewRecord.LastName ? this.state.interviewRecord.LastName : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_LASTNAME_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_PHONENUMBER} className='control-label'>{ constants.PHONENUMBER }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='text' name={constants.TXT_PHONENUMBER} ref={constants.TXT_PHONENUMBER} onKeyPress={(e) => this.numericOnly(e)} pattern='^\d{10}$' value={this.state.interviewRecord.PhoneNumber ? this.state.interviewRecord.PhoneNumber : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_PHONENUMBER_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_ALTERNATENUMBER} className='control-label'>{ constants.ALTERNATENUMBER }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='text' name={constants.TXT_ALTERNATENUMBER} ref={constants.TXT_ALTERNATENUMBER} onKeyPress={(e) => this.numericOnly(e)} pattern='^\d{10}$' value={this.state.interviewRecord.AlternatePhoneNumber ? this.state.interviewRecord.AlternatePhoneNumber : ''} onChange={this.handleChange} />
                        <div className='error' id={constants.LBL_ALTERNATENUMBER_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_EMAILID} className='control-label'>{ constants.EMAIL }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='email' name={constants.TXT_EMAILID} ref={constants.TXT_EMAILID} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" onKeyPress={(e) => this.prevent(e)} value={this.state.interviewRecord.EmailId ? this.state.interviewRecord.EmailId : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_EMAILID_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_SCHEDULEDATE}>{ constants.SCHEDULEDATE }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <DatePicker className='form-control' name={constants.TXT_SCHEDULEDATE} ref={constants.TXT_SCHEDULEDATE} dateFormat='DD/MM/YYYY' minDate={moment()} selected={this.state.interviewRecord.ScheduleDate ? moment(this.state.interviewRecord.ScheduleDate) : ''}
                            onChange={this.changeScheduleDate} required />
                        <div className='error' id={constants.LBL_SCHEDULEDATE_ERROR} />
                    </div>

                    <div className='col-md-3'>
                      <label id={constants.LBL_SCHEDULETIME} >{ constants.SCHEDULETIME }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='time' name={constants.TXT_SCHEDULETIME} ref={constants.TXT_SCHEDULETIME} value={this.state.interviewRecord.ScheduleTime ? this.state.interviewRecord.ScheduleTime : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_SCHEDULETIME_ERROR} />
                    </div>
                    <div className='col-md-3 '>
                        <label id={constants.LBL_POSITIONNAME} className='control-label'>{ constants.POSITION }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='text' name={constants.TXT_POSITIONNAME} ref={constants.TXT_POSITIONNAME} onKeyPress={(e) => this.prevent(e)} value={this.state.interviewRecord.PositionName ? this.state.interviewRecord.PositionName : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_POSITIONNAME_ERROR} />
                    </div>

                </div>

                <div className='col-md-6'>
                <div className='col-md-3'>
                    <label id={constants.LBL_EXPERIENCE} className='control-label'>{ constants.EXPERIENCE_YEARS }</label>
                </div>
                <div className='col-md-9 form-group'>
                    <input className='form-control' type='text' name={constants.TXT_EXPERIENCE} ref={constants.TXT_EXPERIENCE} onKeyPress={(e) => this.prevent(e)} value={this.state.interviewRecord.Experience ? this.state.interviewRecord.Experience : ''} onChange={this.handleChange} required />
                    <div className='error' id={constants.LBL_EXPERIENCE_ERROR} />
                </div>
                    <div className='col-md-3'>
                        <label id={constants.LBL_MODEOFINTERVIEW} className='control-label'>{ constants.INTERVIEWMODE }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <input className='form-control' type='text' name={constants.TXT_MODEOFINTERVIEW} ref={constants.TXT_MODEOFINTERVIEW} onKeyPress={(e) => this.prevent(e)} value={this.state.interviewRecord.ModeofInterview ? this.state.interviewRecord.ModeofInterview : ''} onChange={this.handleChange} required />
                        <div className='error' id={constants.LBL_MODEOFINTERVIEW_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_INTERVIEWSTATUS} className='control-label'>{ constants.INTERVIEWSTATUS }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <Ddl id={constants.DDL_INTERVIEWSTATUS} options={this.props.interviewStatus} value={this.state.interviewRecord.InterviewStatusId} onValueChange={this.changeInterviewStatus}
                            labelField='interviewstatus' valueField='interviewstatusid' />
                        <div className='error' id={constants.LBL_INTERVIEWSTATUS_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_TOEMAIL} className='control-label'>{ constants.TOEMAIL }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <Ddl id={constants.DDL_TOEMAIL} options={this.props.person} value={this.state.interviewRecord.ToEmail} labelField='PersonName' onValueChange={this.changeToEmail} valueField='PersonId' />
                        <div className='error' id={constants.LBL_TOEMAIL_ERROR} />
                    </div>

                    <div className='col-md-3'>
                        <label className='control-label'>{ constants.CCEMAIL }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <Dropdown options={this.state.list} onChange={this.changeCCMail} value={this.state.ccPersonList} placeholder={constants.DROPDOWN_PLACEHOLDER} />
                    </div>

                    <div className='col-md-3'>
                        <label id={constants.LBL_RESUME} className='control-label'>{ constants.RESUME }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        <div className={classForm} id={constants.DIV_FORM} ref={constants.DIV_FORM}>
                            <form encType='multipart/form-data'>
                                <div className='col-md-10 PaddingLeft0Px'>
                                    <input className='form-control resumeClass' type='file' name={constants.RESUME} ref={constants.RESUME} onChange={this.handleFile} required/>
                                    <div className='error' id={constants.LBL_RESUME_ERROR} />
                                </div>
                                <div className='col-md-2 PaddingLeft0Px'>
                                    <input className='btn btn-primary' onClick={this.handleFileSubmit} type='submit' value={ constants.UPLOADFILE } />
                                </div>
                            </form>
                        </div>
                        <div className={classButton} id={constants.DIV_BUTTON} ref={constants.DIV_BUTTON}>
                            <input className='btn btn-danger' onClick={this.resumeRemoveHandler} type='submit' value={ constants.REMOVERESUME } />
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <label className='control-label'>{ constants.STATUS }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        {checkbox}
                    </div>
                    <div className='col-md-3'>
                        <label className='control-label'>{ constants.ISINVOICED }</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        {isInvoicedCheckbox}
                    </div>

                    <div className='col-md-3'>
                        <label className='control-label'>{constants.ISARCHIVED}</label>
                    </div>
                    <div className='col-md-9 form-group'>
                        {isArchivedCheckbox}
                    </div>
                </div>
            </div>
        );
    }
}
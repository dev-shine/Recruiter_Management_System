import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { confirm } from './components/Confirm';
import { NotificationManager } from 'react-notifications';
import interviewScheduleAction from './../actions/InterviewScheduleActions';
import interviewScheduleStore from './../stores/InterviewScheduleStore';
import EmailActions from './../actions/EmailActions';
import $ from 'jquery';
import appConstants from './../constants/AppConstants';
import constants from '../constants/Constants';

//// Edit link component
const LinkEditComponent = (props) => {
    var urlEdit = 'interviewee/' + props.rowData.InterviewId + '/edit';
    return (
        <a href={urlEdit}><center><span className='glyphicon glyphicon-edit'></span></center></a>
    );
};

//// Email link component
const LinkEmailComponent = (props) => {
    var urlEmail = 'mailto:' + props.rowData.EmailId;
    return (
        <a href={urlEmail}>{props.rowData.EmailId}</a>
    );
};

//// Phone link component
const LinkPhoneComponent = (props) => {
    var urlPhone = 'tel:' + props.rowData.PhoneNumber;
    return (
        <a href={urlPhone}>{props.rowData.PhoneNumber}</a>
    );
};

// Delete link component
const LinkDeleteComponent = (props) => {
    const deleteNotification = () => {
        return {
            success: NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 3000)
        };
    };
    const deleteHandler = () => {
      confirm(constants.DELETE_CONFIRMATION).then(() => {
          interviewScheduleAction.deleteItem(props.rowData.InterviewId);
          deleteNotification();
      });
    };
    return (
        <div>
            <a href='#' onClick={deleteHandler}><center><span className='glyphicon glyphicon-remove'></span></center></a>
        </div>
    );
};

// Send mail link component
const LinkSendmailComponent = (props) => {
    const sendMailHandler = () => {
        EmailActions.sendMail(props.rowData);
    };
    if (props.IsMailSent === constants.LBL_TRUE) {
        return (
            <a href='#' onClick={sendMailHandler}><center><span className='glyphicon glyphicon-send colorGreen'></span></center></a>
        );
    }
    else {
        return (
            <a href='#' onClick={sendMailHandler}><center><span className='glyphicon glyphicon-send'></span></center></a>
        );
    }
};

// Resume download link component
const LinkResumeComponent = (props) => {
    const resumeDownloadHandler = () => {
        window.open(appConstants.RESUMEDOWNLOAD + props.rowData['InterviewId']);
    }
    return (
      <a href={appConstants.RESUMEDOWNLOAD + props.rowData['InterviewId']} download='resume.pdf'><center><span className='glyphicon glyphicon-save'></span></center></a>
    );
};

// Question link component
const LinkQuestionComponent = (props) => {
    var urlQuestionForm = 'interviewee/' + props.rowData.InterviewId + '/Questions';
    return (
        <a href={urlQuestionForm}><center><span className='glyphicon glyphicon-question-sign'></span></center></a>
    );
};

// Edit method
function linkEditData(cell, row) {
    return (
        <LinkEditComponent rowData={ row } />
    );
}
function linkEmailData(cell, row) {
    return (
        <LinkEmailComponent rowData={ row } />
    );
}
function linkPhoneData(cell, row) {
    return (
        <LinkPhoneComponent rowData={ row } />
    );
}

// Delete method
function linkDeleteData(cell, row) {
    return (
        <LinkDeleteComponent rowData={ row } />
    );
}

// Send mail method
function linkSendMailData(cell, row) {
    if (row.IsActive === constants.LBL_ACTIVE) {
        if (row.ReportShared === constants.LBL_NO) {
            return (
                <LinkSendmailComponent rowData={ row } IsMailSent={ constants.LBL_FALSE } />
            );
        }
        else {
            return (
                <LinkSendmailComponent rowData={ row } IsMailSent={ constants.LBL_TRUE } />
            );
        }
    }
}

// Resume download method
function linkResumeData(cell, row) {
    if (row.Resume !== null) {
        return (
            <LinkResumeComponent rowData={ row } />
        );
    }
}

// Question form method
function linkQuestionData(cell, row) {
    return (
        <LinkQuestionComponent rowData={ row } />
    );
}

function myDateFormatter(dateParam) {
    var fetchedDate = new Date(dateParam);
    var day = fetchedDate.getDate();
    var month = fetchedDate.getMonth() + 1;
    var year = fetchedDate.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    var date = day + '/' + month + '/' + year;
    return date;
}

export default class InterviewScheduleList extends React.Component {
    constructor() {
        super();
        this.state = { globalArray: [], emailStatus: [] };
        this.onChange = this.onChange.bind(this);
        this.linkHandler = this.linkHandler.bind(this);
        this.sendCompositeMailNotification = this.sendCompositeMailNotification.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.handleRowSelect = this.handleRowSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.dateFormatter = this.dateFormatter.bind(this);
    }
    componentDidMount() {
        interviewScheduleStore.addChangeListener(this.onChange);
        $('.btn-group.btn-group-sm').removeClass('btn-group');
    }
    componentWillUnmount() {
        interviewScheduleStore.removeChangeListener(this.onChange);
    }
    onChange() {
        this.setState({
              globalArray: [],
              emailStatus : interviewScheduleStore.getEmailFlag()
        }, function() {
            if (this.state.emailStatus.isMailSend && this.state.emailStatus.status === 2)
            {
                if (this.state.emailStatus.mailCount === 1)
                {
                    NotificationManager.success(constants.SINGLE_MESSAGE_SENT_SUCCESSFUL, '', 3000);
                }
                else
                {
                    NotificationManager.success(constants.MULTIPLE_MESSAGE_SENT_SUCCESSFUL, '', 3000);
                }
            }
          });
    }
    renderShowsTotal(start, to, total) {
        if (total !== 0) {
            return (
                <p style={ { color: 'blue' } }>
                    From { start } to { to }, total records { total }&nbsp;&nbsp;
                </p>
            );
        }
    }
    linkHandler(interview) {
          window.location.href = 'interviewee/' + interview.InterviewId + '/edit';
    }
    sendCompositeMailNotification() {
        return {
            success : NotificationManager.success(constants.MULTIPLE_MESSAGE_SENT_SUCCESSFUL, '', 3000)
        };
    }
    saveHandler() {
        if (this.state.globalArray.length > 0) {
            EmailActions.sendCompositeMails(this.state.globalArray,this.props.interviews);
        }
        else {
            NotificationManager.warning(constants.INTERVIEW_SELECTION, '', 3000)
        }
    }
    deleteHandler() {
        if (this.state.globalArray.length > 0) {
            if (this.state.globalArray.length === 1)
            {
                interviewScheduleAction.deleteItem(this.state.globalArray[0]);
                NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 3000)
            }
            else {
                interviewScheduleAction.deleteMultiple(this.state.globalArray);
                NotificationManager.success(constants.MULTIPLE_DELETE_SUCCESS_MESSAGE, '', 3000)
            }
        }
        else {
            NotificationManager.warning(constants.INTERVIEW_SELECTION, '', 3000)
        }
    }
    handleRowSelect(row, isSelected, e) {
        var array : [];
        if (isSelected) {
            array = this.state.globalArray;
            array.push(row.InterviewId);
            this.setState(array);
        }
        else {
          array = this.state.globalArray;
          var i = array.indexOf(row.InterviewId);
          if (i !== -1) {
          	 array.splice(i, 1);
          }

          this.setState(array);
        }
    }
    handleSelectAll(isSelected, rows) {
        var array : [];
        if (isSelected) {
            for (var index = 0; index < rows.length; index++) {
                array = this.state.globalArray;
                array.push(rows[index].InterviewId);
            }

            this.setState(array);
        }
        else {
            for (var i = 0; i < rows.length; i++) {
                array = this.state.globalArray;
                var interviewData = array.indexOf(rows[i].InterviewId);
                if (interviewData !== -1) {
                    array.splice(interviewData, 1);
                }
            }

            this.setState(array);
            this.setState({ globalArray: array });
        }
    }
    dateFormatter(cell, row) {
        var scheduleDatewithLongFormat = (new Date(cell)).toString();
        return myDateFormatter(scheduleDatewithLongFormat);
    }
    render() {
        const selectRowProp = {
            mode: 'checkbox',
            columnWidth: '29px',
            clickToSelect: false,
            bgColor: 'lightblue',
            onSelect: this.handleRowSelect,
            onSelectAll: this.handleSelectAll
        };
        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [{
              text: '5', value: 5
            }, {
              text: '10', value: 10
            }, {
              text: 'All', value: this.props.interviews.length
            }], // you can change the dropdown list for size per page
            sizePerPage: 10,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 3,  // the pagination bar size.
            prePage: 'Prev', // Previous page button text
            nextPage: 'Next', // Next page button text
            firstPage: 'First', // First page button text
            lastPage: 'Last', // Last page button text
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            hideSizePerPage: true // You can hide the dropdown for sizePerPage
        };
        return (
            <div>
                <button className='btn btn-primary sendMailButton' onClick={ this.saveHandler }>{ constants.SEND_EMAILS }</button>
                <button className='btn btn-primary sendMailButton' onClick={ this.deleteHandler }>{ constants.DELETE }</button>
                <BootstrapTable className='InterviewGrid' data={ this.props.interviews } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER } selectRow={ selectRowProp }>
                    <TableHeaderColumn isKey hidden dataField='RowNumber' width='30' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' dataFormat={ linkEditData } width='40' headerAlign='center'>{ constants.EDIT }</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData } width='40' headerAlign='center'>{ constants.DELETE }</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' dataFormat={ linkSendMailData } width='40' headerAlign='center'>{ constants.EMAIL }</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' dataFormat={ linkResumeData } width='40'>{ constants.RESUME }</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' dataFormat={ linkQuestionData } width='45'>{ constants.QUESTIONS }</TableHeaderColumn>
                    <TableHeaderColumn dataField='PositionName' headerAlign='center' dataSort={ true } width='70'>{ constants.POSITION }</TableHeaderColumn>
                    <TableHeaderColumn dataField='Name' editable={ true } headerAlign='center' dataSort={ true } width='100'>{ constants.NAME }</TableHeaderColumn>
                    <TableHeaderColumn dataField='PhoneNumber' headerAlign='center' dataFormat={ linkPhoneData } width='80' dataAlign='center'>{ constants.PHONENUMBER }</TableHeaderColumn>
                    <TableHeaderColumn dataField='EmailId' headerAlign='center' dataFormat={ linkEmailData } width='150'>{ constants.EMAIL }</TableHeaderColumn>
                    <TableHeaderColumn dataField='Experience' width='60' headerAlign='center' dataAlign='center'>{ constants.EXPERIENCE_YEARS_HEADER }</TableHeaderColumn>
                    <TableHeaderColumn dataField='SCHDATE' dataFormat={ this.dateFormatter } dataSort={ true } width='70' headerAlign='center' dataAlign='right'>{ constants.SCHEDULEDATE }</TableHeaderColumn>
                    <TableHeaderColumn dataField='ScheduleDate' hidden>{ constants.SCHEDULEDATE }</TableHeaderColumn>
                    <TableHeaderColumn dataField='ScheduleTime' width='70' headerAlign='center' dataAlign='right'>{ constants.SCHEDULETIME }</TableHeaderColumn>
                    <TableHeaderColumn dataField='InterviewScore' width='60' headerAlign='center'  dataAlign='center' dataSort={ true }>{ constants.SCORE }</TableHeaderColumn>
                    <TableHeaderColumn dataField='InterviewResult' width='60' headerAlign='center' dataAlign='center'>{ constants.RESULT }</TableHeaderColumn>
                    <TableHeaderColumn dataField='IsActive' width='55' headerAlign='center' dataAlign='center'>{ constants.STATUS }</TableHeaderColumn>
                    <TableHeaderColumn dataField='ReportShared' width='60' headerAlign='center' dataAlign='center'>{ constants.REPORTSHARED }</TableHeaderColumn>
                  <TableHeaderColumn dataField='IsArchived' width='60' headerAlign='center' dataAlign='center'>{constants.ISARCHIVED }</TableHeaderColumn>
                  <TableHeaderColumn dataField='IsInvoiced' width='60' headerAlign='center' dataAlign='center'>{ constants.ISINVOICED }</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}
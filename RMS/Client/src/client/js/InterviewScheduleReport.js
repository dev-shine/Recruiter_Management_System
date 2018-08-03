import React from 'react';
import Ddl from'./components/Ddl';
import personStore from '../stores/PersonStore';
import personAction from './../actions/PersonActions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import DatePicker from 'react-datepicker';
import { NotificationManager } from 'react-notifications';
import constants from '../constants/Constants';

const LinkEmailComponent = (props) => {
  var urlEmail = 'mailto:' + props.rowData.EmailId;
  return (
    <a href={urlEmail}>{ props.rowData.EmailId }</a>
  );
}

const LinkPhoneComponent = (props) => {
  var urlPhone = 'tel:' + props.rowData.PhoneNumber;
  return (
      <a href={urlPhone}>{ props.rowData.PhoneNumber }</a>
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

export default class InterviewScheduleReport extends React.Component {
    constructor() {
        super();
        this.state = { persons: [], interviews: [] };
        this.onChange = this.onChange.bind(this);
        this.changeToEmail = this.changeToEmail.bind(this);
        this.onChangeFromDate = this.onChangeFromDate.bind(this);
        this.onChangeToDate = this.onChangeToDate.bind(this);
        this.dateFormatter = this.dateFormatter.bind(this);
        this.clearHandler = this.clearHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    componentWillMount() {
        personStore.addChangeListener(this.onChange);
        personAction.getAllPersons();
        let params = {
            fromDate : this.state.fromDate,
            toDate: this.state.toDate,
            toEmail: this.state.toEmail
        }

        personAction.getInterviewSchedule(params);
    }
    renderShowsTotal(start, to, total) {
        if (total !== 0) {
            return (
                <p style={{ color: 'blue' }}>
                    From { start } to { to }, total records { total }&nbsp;&nbsp;
                </p>
            );
        }
    }
    onChange() {
        this.setState({
            persons: personStore.getPersons(),
            interviews: personStore.getInterviews()
        });
    }
    changeToEmail(e) {
        this.setState({ toEmail : e });
    }
    onChangeFromDate(e) {
        if (e === null) {
            e = undefined;
        }

        this.setState({ fromDate: e });
    }
    onChangeToDate(e) {
        if (e === null) {
            e = undefined;
        }

        this.setState({ toDate: e });
    }
    dateFormatter(cell, row) {
        var scheduleDatewithLongFoemat = (new Date(cell)).toString();
        return myDateFormatter(scheduleDatewithLongFoemat);
    }
    clearHandler() {
        this.setState({
            fromDate: undefined,
            toDate : undefined,
            toEmail: '0'
        }, function() {
            let params = {
                fromDate : this.state.fromDate,
                toDate: this.state.toDate,
                toEmail: this.state.toEmail
            }

            personAction.getInterviewSchedule(params);
        });
    }
    submitHandler() {
        if (this.state.fromDate > this.state.toDate) {
            NotificationManager.warning(constants.DATEDIFF_MESSAGE, '', 3000)
        }
        else if (this.state.fromDate === undefined && this.state.toDate === undefined && (this.state.toEmail === undefined || this.state.toEmail === '0')) {
            NotificationManager.warning(constants.SELECTOPTION_MESSAGE, '', 3000)
        }
        else if ((this.state.fromDate === undefined && (this.state.toEmail === undefined || this.state.toEmail === '0')) || (this.state.fromDate === undefined && this.state.toDate !== undefined)) {
            NotificationManager.warning(constants.FROMDATE_MESSAGE, '', 3000)
        }
        else if ((this.state.toDate === undefined && (this.state.toEmail === undefined || this.state.toEmail === '0')) || (this.state.toDate === undefined && this.state.fromDate !== undefined)) {
            NotificationManager.warning(constants.TODATE_MESSAGE, '', 3000)
        }
        else {
          let params = {
              fromDate : this.state.fromDate,
              toDate: this.state.toDate,
              toEmail: this.state.toEmail
          }

          personAction.getInterviewSchedule(params);
        }
    }
    render() {
        const options = {
            page: 1,  // which page you want to show as default
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
                <div className='slds-page-header'>
                    <div className='slds-grid'>
                        <div className='slds-col slds-no-flex slds-has-flexi-truncate'>
                            <div className='slds-grid slds-no-space'>
                                <h4 className='slds-truncate'>{ constants.INTERVIEWREPORT }</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='form-group col-md-12 margintop1Percent '>
                    <div className='col-md-12 PaddingLeft0Px'>
                      <div className='col-md-8 PaddingLeft0Px'>
                          <div className='col-md-3'>
                            <label className='control-label'>{ constants.FROMDATE }</label>
                              <DatePicker className='form-control' selected={ this.state.fromDate ? this.state.fromDate : undefined } value={ this.state.fromDate } onChange={ this.onChangeFromDate } dateFormat='DD/MM/YYYY' />
                          </div>
                          <div className='col-md-3'>
                            <label className='control-label'>{ constants.TODATE }</label>
                              <DatePicker className='form-control' selected={ this.state.toDate ? this.state.toDate : undefined } value={ this.state.toDate } onChange={ this.onChangeToDate } dateFormat='DD/MM/YYYY' />
                          </div>
                          <div className='col-md-4'>
                            <label className='control-label'>{ constants.PERSON }</label>
                                <Ddl id={constants.DDL_PERSON} options={ this.state.persons } value={ this.state.toEmail } labelField='PersonName' onValueChange={ this.changeToEmail } valueField='PersonId' />
                          </div>
                          <div className='col-md-1 margin-top'>
                              <button className='btn btn-primary' onClick={ this.submitHandler }>{ constants.SEARCH }</button>
                          </div>
                          <div className='col-md-1 margin-top'>
                              <button id={constants.BTN_CLEAR} className='btn btn-primary btnClearMarginLeft' onClick={ this.clearHandler }>{ constants.CLEAR }</button>
                          </div>
                      </div>
                    </div>
                    <div>
                        <section className='slds-card__body'>
                            <BootstrapTable data={ this.state.interviews } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
                                <TableHeaderColumn isKey dataField='RowNumber' width='50%' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
                                <TableHeaderColumn dataField='PositionName' dataSort={ true } width='100%'>{ constants.POSITION }</TableHeaderColumn>
                                <TableHeaderColumn dataField='PersonName' dataSort={ true } width='130%'>{ constants.PERSON }</TableHeaderColumn>
                                <TableHeaderColumn dataField='Name' dataSort={ true } width='130%'>{ constants.NAME }</TableHeaderColumn>
                                <TableHeaderColumn dataField='PhoneNumber' dataFormat={ linkPhoneData } width='100%' headerAlign='center' dataAlign='center'>{ constants.PHONE_HEADER }<br/>{ constants.NUMBER_HEADER }</TableHeaderColumn>
                                <TableHeaderColumn dataField='EmailId' dataFormat={ linkEmailData } width='200%'>{ constants.EMAIL }</TableHeaderColumn>
                                <TableHeaderColumn dataField='Experience' width='120%' headerAlign='center' dataAlign='center'>{ constants.EXPERIENCE_HEADER }<br/>{ constants.YEARS_HEADER }</TableHeaderColumn>
                                <TableHeaderColumn dataField='SCHDATE' dataFormat={ this.dateFormatter } dataSort={ true } width='100%' headerAlign='right' dataAlign='right'>{ constants.SCHEDULE_HEADER }<br/>{ constants.DATE_HEADER }</TableHeaderColumn>
                                <TableHeaderColumn dataField='ScheduleDate' hidden>{ constants.SCHEDULEDATE }</TableHeaderColumn>
                                <TableHeaderColumn dataField='ScheduleTime' width='100%' headerAlign='right' dataAlign='right'>{ constants.SCHEDULE_HEADER }<br/>{ constants.TIME_HEADER }</TableHeaderColumn>
                                <TableHeaderColumn dataField='InterviewResult' width='100%' headerAlign='center' dataAlign='center'>{ constants.RESULT }</TableHeaderColumn>
                            </BootstrapTable>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
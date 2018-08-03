import React from 'react';
import Ddl from'./components/Ddl';
import personStore from '../stores/PersonStore';
import personAction from './../actions/PersonActions';
import interviewStatusStore from './../stores/InterviewStatusStore';
import interviewStatusActions from './../actions/InterviewStatusActions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import { Chart } from 'react-google-charts';
import constants from '../constants/Constants';
import Dropdown from 'react-dropdown-multiselect';
import _ from 'lodash';

function personNameFormatter(cell, row, enumObject, index) {
    if (cell != constants.LBL_TOTAL) {
        return (
            <div>{ cell }</div>
        );
    }
    else {
        return (
            <div className='fontWeight'>{ cell }</div>
        );
    }
}

function countFormatter(cell, row, enumObject, index) {
    if (row.PersonName != constants.LBL_TOTAL) {
        return (
            <div>{ cell }</div>
        );
    }
    else {
        return (
            <div className='fontWeight'>{ cell }</div>
        );
    }
}

export default class PersonWiseInterviewReport extends React.Component {
    constructor() {
        super();
        this.state = { persons: [], personWiseInterviewCount: [], interviewData: [], interviewStatus: [], selected: [], status: [] };
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.changeInterviewStatus = this.changeInterviewStatus.bind(this);
        this.clearHandler = this.clearHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    componentWillMount() {
        personStore.addChangeListener(this.onChange);
        interviewStatusStore.addChangeListener(this.onChange);
        personAction.getAllPersons();
        interviewStatusActions.getInterviewStatus();
        let params = {
            toEmail: this.state.selected,
            interviewStatus: this.state.status
        }

        personAction.getPersonWiseInterviewCount(params);
    }
    componentWillUnmount() {
        personStore.removeChangeListener(this.onChange);
        interviewStatusStore.removeChangeListener(this.onChange);
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
            interviewStatus: interviewStatusStore.returnStore(),
            personWiseInterviewCount: personStore.getPersonWiseInterviewCount(),
            interviewData: []
        }, function() {
            var personName;
            var count;
            var personWiseInterviewData = [];
            if (this.state.personWiseInterviewCount !== undefined && this.state.personWiseInterviewCount.length !== 0) {
                for (var i = -1; i < this.state.personWiseInterviewCount.length; i++) {
                    if (i === -1) {
                        personWiseInterviewData.push(['PersonName','Count']);
                    }
                    else {
                        personName = this.state.personWiseInterviewCount[i].PersonName;
                        count = parseInt(this.state.personWiseInterviewCount[i].InterviewCount);
                        var header = [[]];
                        header[0].push(personName);
                        header[0].push(count);
                        var a = header[0][0];
                        var b = header[0][1];
                        personWiseInterviewData.push([a,b]);
                    }
                }

                var datalength = personWiseInterviewData.length;
                personWiseInterviewData.splice(datalength - 1, 1);
                this.setState({ interviewData: personWiseInterviewData });
            }
        });
    }
    onSelect(option) {
        this.setState({ selected: option })
    }
    changeInterviewStatus(e) {
        this.setState({ status : e });
    }
    clearHandler() {
        this.setState({ selected : [], status: [] }, function() {
            let params = {
                toEmail: undefined,
                interviewStatus: this.state.status
            }

            personAction.getPersonWiseInterviewCount(params);
        });
    }
    submitHandler() {
        var selectedPersons = [];
        if (this.state.selected !== undefined && this.state.selected.length === 1) {
            NotificationManager.warning(constants.SELECTPERSON_MESSAGE, '', 3000)
        }
        else if (this.state.selected.length === 0 && (this.state.status === null || this.state.status.length === 0)) {
            NotificationManager.warning(constants.SELECTOPTION_MESSAGE, '', 3000)
        }
        else {
            _.map(this.state.selected, function(option) {
                selectedPersons.push(option.PersonId);
             });
            var emailString = selectedPersons.join(',');
            let params = {
                toEmail: emailString,
                interviewStatus: this.state.status
            }

            personAction.getPersonWiseInterviewCount(params);
        }
    }
    render() {
      const footerData = [
          [
            {
              label: 'Total',
              columnIndex: 1
            },
            {
              label: 'Total Count',
              columnIndex: 2,
              align: 'right',
              formatter: (tableData) => {
                let label = 0;
                for (let i = 0, tableDataLen = tableData.length; i < tableDataLen; i++) {
                  label = parseInt(label) + parseInt(tableData[i].InterviewCount);
                }
                return (
                  <strong>{ label }</strong>
                );
              }
            }
          ]
        ];
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

        let defaultOption = this.state.selected
        return (
          <div>
              <div className='slds-page-header'>
                  <div className='slds-grid'>
                      <div className='slds-col slds-no-flex slds-has-flexi-truncate'>
                          <div className='slds-grid slds-no-space'>
                                <h4 className='slds-truncate'>{ constants.PERSONWISEREPORT }</h4>
                          </div>
                      </div>
                  </div>
              </div>

              <div className='form-group col-md-12 margintop1Percent'>
                  <div className='col-md-12 PaddingLeft0Px'>
                    <div className='col-md-8 PaddingLeft0Px'>
                        <div className='col-md-4'>
                            <label className='control-label'>{ constants.PERSON }</label>
                            <Dropdown className='zIndex' options={ this.state.persons } value={ defaultOption } onChange={ this.onSelect } placeholder={ constants.DROPDOWN_PLACEHOLDER } />
                        </div>
                        <div className='col-md-4'>
                            <label className='control-label'>{ constants.STATUS }</label>
                            <Ddl id={constants.DDL_INTERVIEWSTATUS} options={ this.state.interviewStatus } value={ this.state.status } labelField='interviewstatus' onValueChange={ this.changeInterviewStatus } valueField='interviewstatusid' />
                        </div>
                        <div className='col-md-1 margin-top'>
                            <button className='btn btn-primary' onClick={ this.submitHandler }>{ constants.SEARCH }</button>
                        </div>
                        <div className='col-md-1 margin-top'>
                            <button id={constants.BTN_CLEAR} className='btn btn-primary btnClearMarginLeft' onClick={ this.clearHandler }>{ constants.CLEAR }</button>
                        </div>
                    </div>
                  </div>

                  <div className={'my-pretty-chart-container margin-top5Per'}>
                      { this.state.interviewData.length !== 0 ? <Chart chartType='PieChart' data={ this.state.interviewData } options={{ 'pieHole': 0.4, 'is3D': true, legend:{ position: 'labeled' }, 'pieSliceText': 'value', 'showRangeValues' : true, 'enableInteractivity': true }} graph_id='PieChart' width='100%' height='400px' legend_toggle /> : null }
                  </div>

                  <div>
                      <section className='slds-card__body'>
                          { this.state.personWiseInterviewCount !== undefined ?
                              <BootstrapTable data={ this.state.personWiseInterviewCount }  footerData={ footerData } footer striped hover options={ options }>
                                  <TableHeaderColumn isKey dataField='RowNumber' width='10%' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
                                  <TableHeaderColumn dataField='PersonName' dataFormat={ personNameFormatter } dataSort={ true } width='130%'>{ constants.PERSON }</TableHeaderColumn>
                                  <TableHeaderColumn dataField='InterviewCount' dataFormat={ countFormatter } width='50%' headerAlign='center' dataAlign='right'>{ constants.COUNT }</TableHeaderColumn>
                              </BootstrapTable>
                            : null }
                      </section>
                  </div>
              </div>
          </div>
        );
    }
}

import React from 'react';
import Ddl from'./components/Ddl';
import InterviewScheduleAction from './../actions/InterviewScheduleActions';
import InterviewScheduleStore from './../stores/InterviewScheduleStore';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Chart } from 'react-google-charts';
import _ from 'lodash';
import constants from '../constants/Constants';
import moment from 'moment';
var Mon = [];
var yr = []
var presentYear = new Date().getFullYear();
var startYear = 2017;
for (var i = startYear; i <= presentYear ; i++) {
    yr.push({'name':i, 'value':i})
}
var count = 0;
while (count < 12) Mon.push({'name':moment().month(count++).format('MMMM'), 'value':count} );
var monthCount = new Date();
var graphTitle = moment().month( monthCount.getMonth()).format('MMMM');

function TotalTextFormatter(cell, row, enumObject, index) {
    if (cell != constants.LBL_TOTAL)
    {
        return (
            <div>{cell}</div>
        );
    }
    else {
        return (
            <div className='fontWeight'>{cell}</div>
        );
    }
}

function countFormatter(cell, row, enumObject, index) {
    if (row.Date != constants.LBL_TOTAL)
    {
        return (
            <div>{cell}</div>
        );
    }
    else {
        return (
            <div className='fontWeight'>{cell}</div>
        );
    }
}

export default class MonthlyReport extends React.Component {
    constructor() {
        super();
        this.state = { interviews: [], dateWiseInterviewCount: [], interviewData: [], Month: [], Years: [] };
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showSelectError = this.showSelectError.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }
    componentWillMount() {
        this.setState({ Month: Mon });
        this.setState({ Years: yr});
        InterviewScheduleStore.addChangeListener(this.onChange);
        var newDate = new Date();
        var currentMonth = newDate.getMonth() + 1;
        var currentYear = newDate.getFullYear();
        this.setState({ selectedYear : currentYear });
        this.setState({ selectedMonth : currentMonth });
        this.setState({ TitleYear : currentYear });
        this.setState({ TitleMonth : currentMonth });
        InterviewScheduleAction.monthlyInterviews(currentMonth, currentYear);
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
    showFormErrors() {
        let isFormValid = true;
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
    onChange() {
        this.setState({
            dateWiseInterviewCount: InterviewScheduleStore.getMonthlyInterview(),
            interviewData: []
        }, function() {
            var InterviewDate;
            var count;
            var interviewScheduleData = [];
            if (this.state.dateWiseInterviewCount !== undefined && this.state.dateWiseInterviewCount.length !== 0) {
                for (var i = -1; i < this.state.dateWiseInterviewCount.length; i++) {
                    if(i === -1) {
                        interviewScheduleData.push(['InterviewDate','Count']);
                    }
                    else {
                        InterviewDate = this.state.dateWiseInterviewCount[i].InterviewDate;
                        count = parseInt(this.state.dateWiseInterviewCount[i].InterviewCount);
                        var header = [[]];
                        header[0].push(InterviewDate);
                        header[0].push(count);
                        var a = header[0][0];
                        var b = header[0][1];
                        interviewScheduleData.push([a,b]);
                    }
                }

                var datalength = interviewScheduleData.length;
                interviewScheduleData.splice(datalength - 1, 1);
                this.setState({ interviewData: interviewScheduleData });
            }
        });
    }
    changeMonth(option){
      this.setState({ selectedMonth : option })
    }
    changeYear(option){
      this.setState({ selectedYear : option })
    }
    submitHandler() {
        if (this.showFormErrors()) {
            graphTitle = moment().month(this.state.selectedMonth - 1).format('MMMM')
            this.setState({ TitleMonth : this.state.selectedYear })
            let params = {
                Month: this.state.selectedMonth,
                Year: this.state.selectedYear
            }

            InterviewScheduleAction.monthlyInterviews(parseInt(params.Month),parseInt(params.Year));
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
        return (
          <div>
              <div className='slds-page-header'>
                  <div className='slds-grid'>
                      <div className='slds-col slds-no-flex slds-has-flexi-truncate'>
                          <div className='slds-grid slds-no-space'>
                                <h4 className='slds-truncate'>{ constants.MONTHLYREPORT }</h4>
                          </div>
                      </div>
                  </div>
              </div>

              <div className='form-group col-md-12 margintop1Percent'>
                  <div className='col-md-12 PaddingLeft0Px'>
                    <div className='col-md-8 PaddingLeft0Px'>
                        <div className='col-md-4'>
                            <label id={constants.DDL_MONTHLABEL} className='control-label'>{ constants.MONTH }</label>
                              <Ddl id={constants.DDL_MONTH} options={this.state.Month} value={this.state.selectedMonth} labelField='name' onValueChange={this.changeMonth} valueField='value' />
                              <div className='error' id={constants.LBL_MONTH_ERROR} />
                        </div>
                        <div className='col-md-4'>
                            <label id={constants.DDL_YEARLABEL} className='control-label'>{ constants.YEAR }</label>
                              <Ddl id={constants.DDL_YEAR} options={this.state.Years} value={this.state.selectedYear} labelField='name' onValueChange={this.changeYear} valueField='value' />
                              <div className='error' id={constants.LBL_YEAR_ERROR} />
                        </div>
                        <div className='col-md-2 margin-top'>
                            <button className='btn btn-primary' onClick={ this.submitHandler }>{ constants.SEARCH }</button>
                        </div>
                    </div>
                  </div>
                  <div>
                  <div className="{'my-pretty-chart-container'} margin-top7Per">
                  {this.state.interviewData.length !== 0 ? <Chart chartType='AreaChart' data={ this.state.interviewData } options={{title: graphTitle + ' - ' + this.state.TitleYear, legend: 'none'}} graph_id='AreaChart' width='100%' height='400px' legend_toggle />: null}
                  </div>
                  </div>
                  <div>
                      <section className='slds-card__body'>
                          <BootstrapTable data={ this.state.dateWiseInterviewCount }  footerData={ footerData } footer striped hover options={ options }>
                              <TableHeaderColumn isKey dataField='RowNumber' width='10%' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
                              <TableHeaderColumn dataField='Date' dataFormat={ TotalTextFormatter } dataSort={ true } width='130%'>{ constants.SCHEDULEDATE }</TableHeaderColumn>
                              <TableHeaderColumn dataField='InterviewCount' dataFormat={ countFormatter } width='100%' headerAlign='center' dataAlign='center'>{ constants.COUNT }</TableHeaderColumn>
                          </BootstrapTable>
                      </section>
                  </div>
              </div>
          </div>
        );
    }
}

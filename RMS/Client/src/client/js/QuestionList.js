import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { confirm } from './components/Confirm';
import { NotificationManager } from 'react-notifications';
import questionActions from './../actions/QuestionActions';
import constants from '../constants/Constants';

//// Edit link component
const LinkEditComponent = (props) => {
  var urlEdit = 'question/' + props.rowData.QuestionId + '/edit';
  return (
      <a href={urlEdit}><center><span className='glyphicon glyphicon-edit'></span></center></a>
  );
}

//// Delete link component
const LinkDeleteComponent = (props) => {
    const deleteNotification = () => {
        return {
            success: NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 2000)
        };
    };
    const deleteHandler = () => {
        confirm(constants.DELETE_CONFIRMATION).then(() => {
            questionActions.questionDelete(props.rowData.QuestionId);
            deleteNotification();
        });
    };
    return (
      <div>
        <a href='#' onClick={ deleteHandler }><center><span className='glyphicon glyphicon-remove'></span></center></a>
      </div>
    );
}

//// Edit method
function linkEditData(cell, row) {
    return (
        <LinkEditComponent rowData={ row } />
    );
}

//// Delete method
function linkDeleteData(cell, row) {
    return (
        <LinkDeleteComponent rowData={ row } />
    );
}

export default class QuestionList extends React.Component {
    constructor() {
        super();
        this.linkHandler = this.linkHandler.bind(this);
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
    linkHandler(question) {
        window.location.hash = '#question/' + question.questionId + '/edit';
    }
    render() {
        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [{
              text: '5', value: 5
            }, {
              text: '10', value: 10
            }, {
              text: 'All', value: this.props.questions.length
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
              <BootstrapTable data={ this.props.questions } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
                <TableHeaderColumn isKey hidden dataField='RowNumber' headerAlign='center' dataAlign='center' width='30'>{ constants.SR }</TableHeaderColumn>
                <TableHeaderColumn dataField='link' dataFormat={ linkEditData } headerAlign='center' width='22'>{ constants.EDIT }</TableHeaderColumn>
                <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData } headerAlign='center' width='22'>{ constants.DELETE }</TableHeaderColumn>
                <TableHeaderColumn dataField='QuestionCategory' editable={ true } headerAlign='center' dataSort={ true } width='50'>{ constants.QUESTIONCATEGORY }</TableHeaderColumn>
                <TableHeaderColumn dataField='Question' headerAlign='center' dataSort={ true } width='150'>{ constants.QUESTION }</TableHeaderColumn>
                <TableHeaderColumn dataField='SortOrder' headerAlign='center' dataAlign='right' width='30'>{ constants.SORTORDER }</TableHeaderColumn>
                <TableHeaderColumn dataField='IsActive' headerAlign='center' dataAlign='center' width='25'>{ constants.STATUS }</TableHeaderColumn>
              </BootstrapTable>
            </div>
        );
    }
}
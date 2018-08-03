import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import { confirm } from './components/Confirm';
import QuestionCategoryActions from './../actions/QuestionCategoryActions';
import QuestionCategoryStore from './../stores/QuestionCategoryStore';
import constants from '../constants/Constants';

//// Edit link component
const LinkEditComponent = (props) => {
  var urlEdit = 'questioncategory/' + props.rowData.QuestionCategoryId + '/edit';
  return (
    <a href={urlEdit}><center><span className='glyphicon glyphicon-edit'></span></center></a>
  );
};

//// Delete link component
const LinkDeleteComponent = (props) => {
    const deleteHandler = () => {
      confirm(constants.DELETE_CONFIRMATION).then(() => {
          QuestionCategoryActions.deleteItem(props.rowData.QuestionCategoryId);
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
    if (row.UserId !== localStorage.ls_userId ) {
        return (
            <LinkDeleteComponent rowData={ row } />
        );
    }
}

export default class QuestionCategoryList extends React.Component {
    constructor() {
        super();
        this.onDeleteChange = this.onDeleteChange.bind(this);
        this.linkHandler = this.linkHandler.bind(this);
        this.handleRowSelect = this.handleRowSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }
    componentDidMount() {
        QuestionCategoryStore.addChangeListener(this.onDeleteChange);
    }
    onDeleteChange() {
        this.setState({
            categoryDeleteStatus: QuestionCategoryStore.getDeleteStatus()
        }, function() {
              if (this.state.categoryDeleteStatus === constants.CONFLICT)
              {
                  NotificationManager.error(constants.REFERENCE_EXIST_MESSAGE, '', 2000)
              }
              else if (this.state.categoryDeleteStatus === constants.LBL_OK)
              {
                  NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 2000)
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
    linkHandler(questionCategory) {
        window.location.hash = '#questioncategory/' + questionCategory.QuestionCategoryId + '/edit';
    }
    handleRowSelect(row, isSelected, e) {
        var array : [];
        if (isSelected) {
            array = this.state.globalArray;
            array.push(row.QuestionCategoryId);
            this.setState(array);
        }
        else {
            array = this.state.globalArray;
            array.pop(row.QuestionCategoryId);
            this.setState(array);
        }
    }
    handleSelectAll(isSelected, rows) {
        var array : [];
        if (isSelected) {
            for (var i = 0; i < rows.length; i++) {
                array = this.state.globalArray;
                array.push(rows[i].QuestionCategoryId);
            }

            this.setState(array);
        }
        else {
            for (var i = 0; i < rows.length; i++) {
                array = this.state.globalArray;
                array.pop(rows[i].QuestionCategoryId);
            }

            this.setState(array);
        }
    }
    render() {
        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [{
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: 'All', value: this.props.QuestionCategory.length
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
            <BootstrapTable className='questionCategoryGrid' data={ this.props.QuestionCategory } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
              <TableHeaderColumn isKey hidden dataField='RowNumber' width='30%' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkEditData } width='40' headerAlign='center'>{ constants.EDIT }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData } width='50' headerAlign='center'>{ constants.DELETE }</TableHeaderColumn>
              <TableHeaderColumn dataField='QuestionCategoryName' dataSort={ true } width='110'>{ constants.QUESTIONCATEGORY }</TableHeaderColumn>
              <TableHeaderColumn dataField='DisplayName' dataSort={ true } width='110'>{ constants.DISPLAYNAME }</TableHeaderColumn>
              <TableHeaderColumn dataField='SortOrder' dataSort={ true } width='110'>{ constants.SORTORDER }</TableHeaderColumn>
              <TableHeaderColumn dataField='IsActive' width='55' headerAlign='center' dataAlign='center'>{ constants.STATUS }</TableHeaderColumn>
            </BootstrapTable>
          </div>
        );
    }
}
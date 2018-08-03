import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { NotificationManager } from 'react-notifications';
import { confirm } from './components/Confirm';
import UserActions from './../actions/UserActions';
import constants from '../constants/Constants';

//// Edit link component
const LinkEditComponent = (props) => {
    var urlEdit = 'user/' + props.rowData.UserId + '/edit';
    return (
      <a href={urlEdit}><center><span className='glyphicon glyphicon-edit'></span></center></a>
    );
}

const LinkEmailComponent = (props) => {
  var urlEmail = 'mailto:' + props.rowData.Email;
  return (
    <a href={urlEmail}>{props.rowData.Email}</a>
  );
}

const LinkPhoneComponent = (props) => {
  var urlPhone = 'tel:' + props.rowData.ContactNumber;
  return (
    <a href={urlPhone}>{props.rowData.ContactNumber}</a>
  );
}

// Delete link component
const LinkDeleteComponent = (props) => {
  const deleteNotification = () => {
    return {
      success: NotificationManager.success(constants.DELETE_SUCCESS_MESSAGE, '', 3000)
    };
  };
  const deleteHandler = () => {
    confirm(constants.DELETE_CONFIRMATION).then(() => {
      UserActions.deleteItem(props.rowData.UserId);
      deleteNotification();
    });
  };
  return (
    <div>
      <a href='#' onClick={deleteHandler}><center><span className='glyphicon glyphicon-remove'></span></center></a>
    </div>
  );
}

// Edit method
function linkEditData(cell, row) {
  if (row.UserId !== localStorage.ls_userId ) {
  return (
    <LinkEditComponent rowData={ row } />
  );
}
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
    if (row.UserId !== localStorage.ls_userId ) {
        return (
          <LinkDeleteComponent rowData={ row } />
        );
    }
}

export default class UserList extends React.Component {
    constructor() {
        super();
        this.linkHandler = this.linkHandler.bind(this);
        this.handleRowSelect = this.handleRowSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
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
    linkHandler(user) {
        window.location.hash = '#user/' + user.UserId + '/edit';
    }
    handleRowSelect(row, isSelected, e) {
        var array : [];
        if (isSelected) {
            array = this.state.globalArray;
            array.push(row.UserId);
            this.setState(array);
        }
        else {
            array = this.state.globalArray;
            array.pop(row.UserId);
            this.setState(array);
        }
    }
    handleSelectAll(isSelected, rows) {
        var array : [];
        if (isSelected) {
            for (var i = 0; i < rows.length; i++) {
                array = this.state.globalArray;
                array.push(rows[i].UserId);
            }

            this.setState(array);
        }
        else {
            for (var i = 0; i < rows.length; i++) {
                array = this.state.globalArray;
                array.pop(rows[i].UserId);
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
              text: 'All', value: this.props.User.length
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
            <BootstrapTable className='UserGrid' data={ this.props.User } striped hover search pagination={ true } options={ options } searchPlaceholder={ constants.FILTER }>
              <TableHeaderColumn isKey hidden dataField='RowNumber' headerAlign='center' dataAlign='center' width='30'>{ constants.SR }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkEditData } headerAlign='center' width='22'>{ constants.EDIT }</TableHeaderColumn>
              <TableHeaderColumn dataField='link' dataFormat={ linkDeleteData } headerAlign='center' width='22'>{ constants.DELETE }</TableHeaderColumn>
              <TableHeaderColumn dataField='Name' dataSort={ true } width='110'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='Email' dataFormat={ linkEmailData } width='150'>Email</TableHeaderColumn>
              <TableHeaderColumn dataField='ContactNumber' dataFormat={ linkPhoneData } headerAlign='center' dataAlign='center' width='80'>Contact Number</TableHeaderColumn>
              <TableHeaderColumn dataField='IsActive' headerAlign='center' dataAlign='center' width='25'>Status</TableHeaderColumn>
            </BootstrapTable>
          </div>
        );
    }
}
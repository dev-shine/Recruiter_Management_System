import React from 'react';
import QuestionCategoryActions from './../actions/QuestionCategoryActions';
import constants from '../constants/Constants';
var questionCategoryData = [];
let checkbox;

export default class QuestionCategoryForm extends React.Component {
    constructor() {
        super();
        this.state = { questionCategoryRecord: [] };
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.changeIsActive = this.changeIsActive.bind(this);
        this.numericOnly = this.numericOnly.bind(this);
    }
    componentDidMount() {
        questionCategoryData = [];
        questionCategoryData['IsActive'] = true;
        this.setState({ questionCategoryRecord: questionCategoryData });
    }
    componentWillReceiveProps(props) {
        let questioncategory = props.questioncategory;
        this.setState(questioncategory);
        this.setState({ questionCategoryRecord: props.questioncategory }, function()
        {
            questionCategoryData = this.state.questionCategoryRecord;
        });
    }
    handleChange(event) {
        questionCategoryData[event.target.name] = event.target.value;
        this.setState({ questionCategoryRecord : questionCategoryData });
    }
    save() {
        if (this.state.QuestionCategoryId)
        {
            QuestionCategoryActions.updateItem(this.state.questionCategoryRecord);
            if (this.props.onSaved) {
                this.props.onSaved();
            }
        }
        else {
            QuestionCategoryActions.addNewItem(this.state.questionCategoryRecord);
            if (this.props.onSaved) {
                this.props.onSaved(constants.LBL_OK);
            }
        }
    }
    changeIsActive(e) {
        questionCategoryData['IsActive'] = e.target.checked;
        this.setState({ questionCategoryRecord : questionCategoryData });
    }
    numericOnly(e) {
      const re = /[0-9]+/g;
      if (!re.test(e.key)) {
          e.preventDefault();
      }
    }
    render() {
        if (this.props.questioncategory !== undefined && this.props.questioncategory.length !== 0)
        {
            checkbox = (<input type='checkbox' checked={this.props.questioncategory.IsActive} onChange={this.changeIsActive} />)
        }
        else
        {
            if (this.state.questionCategoryRecord.IsActive === true)
            {
                checkbox = (<input type='checkbox' checked={true} onChange={this.changeIsActive} />)
            }
            else
            {
                checkbox = (<input type='checkbox' checked={false}  onChange={this.changeIsActive} />)
            }
        }
        return (
          <div className='form-group col-md-12'>
              <div className='col-md-3'>
                  <label id={constants.LBL_QUESTIONCATEGORYNAME} className='control-label'>{ constants.QUESTIONCATEGORY }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_QUESTIONCATEGORYNAME} ref={constants.TXT_QUESTIONCATEGORYNAME} value={this.state.questionCategoryRecord.QuestionCategoryName ? this.state.questionCategoryRecord.QuestionCategoryName : ''} onChange={this.handleChange} autoFocus required />
                  <div className='error' id={constants.LBL_QUESTIONCATEGORYNAME_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label id={constants.LBL_DISPLAYNAME} className='control-label'>{ constants.DISPLAYNAME }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_DISPLAYNAME} ref={constants.TXT_DISPLAYNAME} value={this.state.questionCategoryRecord.DisplayName ? this.state.questionCategoryRecord.DisplayName : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.LBL_DISPLAYNAME_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label id={constants.LBL_SORTORDER} className='control-label'>{ constants.SORTORDER }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_SORTORDER} ref={constants.TXT_SORTORDER} onKeyPress={(e) => this.numericOnly(e)} pattern='^\d{1,4}$' value={this.state.questionCategoryRecord.SortOrder ? this.state.questionCategoryRecord.SortOrder : ''} onChange={this.handleChange} required />
                  <div className='error' id={constants.LBL_SORTORDER_ERROR} />
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
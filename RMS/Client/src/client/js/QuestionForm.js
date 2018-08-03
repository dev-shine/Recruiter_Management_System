import React from 'react';
import Ddl from'./components/Ddl';
import constants from '../constants/Constants';
import questionActions from './../actions/QuestionActions';
var questionData = [];
let checkbox;

export default class QuestionForm extends React.Component {
    constructor() {
        super();
        this.state = { questionRecord: [] };
        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeQuestionCategory = this.changeQuestionCategory.bind(this);
        this.changeIsActive = this.changeIsActive.bind(this);
        this.numericOnly = this.numericOnly.bind(this);
    }
    componentDidMount() {
        questionData = [];
        questionData['IsActive'] = true;
        this.setState({ questionRecord: questionData });
    }
    componentWillReceiveProps(props) {
        let question = props.question;
        this.setState(question);
        this.setState({ questionRecord: props.question }, function()
        {
            questionData = this.state.questionRecord;
        });
    }
    save() {
        if (this.state.questionRecord.QuestionId)
        {
            questionActions.questionUpdate(this.state.questionRecord);
            if (this.props.onSaved) {
                this.props.onSaved();
            }
        }
        else {
            questionActions.questionInsert(this.state.questionRecord);
        }
    }
    handleChange(event) {
        if (event.target.value !== '')
        {
            const textarea = document.querySelectorAll('textarea[name]');
            textarea.forEach(input => {
                input.classList.remove('BorderRed');
            });
        }

        questionData[event.target.name] = event.target.value;
        this.setState({ questionRecord : questionData });
    }
    changeQuestionCategory(e) {
        questionData['QuestionCategoryId'] = e;
        this.setState({ questionRecord : questionData });
    }
    changeIsActive(e) {
        questionData['IsActive'] = e.target.checked;
        this.setState({ questionRecord : questionData });
    }
    numericOnly(e) {
        const re = /[0-9]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }
    render() {
        if (this.props.question !== undefined && this.props.question.length !== 0) {
            checkbox = (<input type='checkbox'  checked={this.props.question.IsActive} onChange={this.changeIsActive} />)
        }
        else {
            if (this.state.questionRecord !== undefined) {
                if (this.state.questionRecord.IsActive === true) {
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
                  <label id={constants.LBL_DDLQUESTIONCATEGORY} className='control-label'>{ constants.QUESTIONCATEGORY }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <Ddl id={constants.DDL_QUESTIONCATEGORY} options={ this.props.questionCategory } value={ this.state.questionRecord.QuestionCategoryId } onValueChange={ this.changeQuestionCategory } labelField='QuestionCategoryName' valueField='QuestionCategoryId' />
                  <div className='error' id={constants.LBL_DDLQUESTIONCATEGORY_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label id={constants.LBL_QUESTION} className='control-label'>{ constants.QUESTION }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <textarea className='form-control resizeNone' rows='3' name={constants.QUESTION} ref={constants.QUESTION} onChange={ this.handleChange } value={ this.state.questionRecord.Question } required />
                  <div className='error' id={constants.LBL_QUESTION_ERROR} />
              </div>

              <div className='col-md-3'>
                  <label id={constants.LBL_SORTORDER} className='control-label'>{ constants.SORTORDER }</label>
              </div>
              <div className='col-md-9 form-group'>
                  <input className='form-control' type='text' name={constants.TXT_SORTORDER} ref={constants.TXT_SORTORDER} onKeyPress={(e) => this.numericOnly(e)} pattern='^\d{1,4}$' value={ this.state.questionRecord.SortOrder ? this.state.questionRecord.SortOrder : '' } onChange={ this.handleChange } required />
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
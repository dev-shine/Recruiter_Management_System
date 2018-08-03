/* eslint max-len: 0 */
/* eslint no-console: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Ddl from'./components/Ddl';
import { browserHistory } from 'react-router';
import { NotificationManager } from 'react-notifications';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import constants from '../constants/Constants';
import questionAction from './../actions/QuestionActions';
import QuestionStore from './../stores/QuestionStore';
import interviewScheduleActions from './../actions/InterviewScheduleActions';
import interviewScheduleStore from './../stores/InterviewScheduleStore';
import InterviewResultActions from './../actions/InterviewResultActions';
import InterviewResultStore from './../stores/InterviewResultStore';
import QuestionCategoryActions from './../actions/QuestionCategoryActions';
import QuestionCategoryStore from './../stores/QuestionCategoryStore';
import EmailActions from './../actions/EmailActions';
var options = [];

class AnswersEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.state = { answers: props.defaultValue };
        this.onToggleRegion = this.onToggleRegion.bind(this);
    }
    onToggleRegion(event) {
        const answer = event.currentTarget.name;
        this.props.row.IsUpdate =  true;
            this.setState({ answers: answer }, function() {
            this.props.onUpdate(this.state.answers);
        });
    }
    updateData() {
        this.props.onUpdate(this.state.answers);
    }
    render() {
        const regionCheckBoxes = options.map(answer => (
            <span key={ `span-${answer}` }>
            <br/>
                <input type='radio' className='marginLeft2P' key={ answer + this.props.row.QuestionId } id={ this.props.row.QuestionId + answer } name={ answer } checked={ this.state.answers.indexOf(answer) > -1 }
                  onKeyDown={ this.props.onKeyDown } onChange={ this.onToggleRegion } />
                <label key={ `label-${answer}` } htmlFor={ answer }>{answer}</label>
            </span>
        ));
        return (
            <span ref='inputRef'>
              { regionCheckBoxes }
            </span>
        );
    }
}

const answersFormatter = (cell, row) => ( <span>{(cell || []) }</span>);
const createAnswersEditor = (onUpdate, props) => (<AnswersEditor onUpdate={ onUpdate } {...props}/>);

// Component for Answer is updated or not
const LinkUpdateComponent = (props) => {
  if (props.rowData.IsUpdate === true) {
      return (
          <center><span className='glyphicon glyphicon-check colorGreen'></span></center>
      );
  }
  else {
      return (
          <center><span className='glyphicon glyphicon-edit colorRed'></span></center>
      );
  }
};

function linkUpdateData(cell, row) {
    return (
        <LinkUpdateComponent rowData={ row } />
    );
}

export default class QuestionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { questions: [], result: [], interview: [], interviewId: this.props.routeParams.interviewId, Recommendations: '', InterviewScore: '', InterviewResult: [], questionCategory: [] };
        this.onQuestionChange = this.onQuestionChange.bind(this);
        this.onQuestionCategoryChange = this.onQuestionCategoryChange.bind(this);
        this.onResultChange = this.onResultChange.bind(this);
        this.onInterviewResultChange = this.onInterviewResultChange.bind(this);
        this.saveNotification = this.saveNotification.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.changeResult = this.changeResult.bind(this);
        this.digitsOnly = this.digitsOnly.bind(this);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showInputError = this.showInputError.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRecommendationsChange = this.handleRecommendationsChange.bind(this);
        this.syncQuestionsHandler = this.syncQuestionsHandler.bind(this);
        this.sendMailHandler = this.sendMailHandler.bind(this);
        this.onQuestionCategoryChangeHandler = this.onQuestionCategoryChangeHandler.bind(this);
        this.onQuestionListChangeHandler = this.onQuestionListChangeHandler.bind(this);
    }
    componentWillMount() {
        interviewScheduleStore.addChangeListener(this.onResultChange);
        QuestionCategoryStore.addChangeListener(this.onQuestionCategoryChange);
        QuestionStore.addChangeListener(this.onQuestionChange);
        InterviewResultStore.addChangeListener(this.onInterviewResultChange);
        let id = this.state.interviewId;
        interviewScheduleActions.resultById(id);
        questionAction.findByIdFromAnswer(id);
        questionAction.getAllAnswer();
        InterviewResultActions.getAllResult();
        QuestionCategoryActions.getActiveCategories(id);
    }
    onQuestionChange() {
        this.setState({
            questions: QuestionStore.AnswerfindById()
        });
        var GetALL = QuestionStore.AnswerGetALL()
        for (let index=0; index<GetALL.length; index++)
        {
            options.push(GetALL[index].Answer);
        }
    }
    onQuestionCategoryChange() {
        this.setState({ questionCategory: QuestionCategoryStore.activeCategory() });
    }
    onResultChange() {
        this.setState({ interview: interviewScheduleStore.getResultId() });
        this.setState({ Recommendations : this.state.interview[0].Recommendations});
        this.setState({ InterviewScore : this.state.interview[0].InterviewScore});
        this.setState({ InterviewResult : this.state.interview[0].InterviewResultId});
    }
    onInterviewResultChange() {
        this.setState({
            result: InterviewResultStore.returnStore()
        });
    }
    saveNotification() {
        return {
            success : NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 3000)
        };
    }
    saveHandler() {
        var list = [];
        var answers = this.state.questions;
        for (var i=0; i<answers.length; i++) {
            var ansOfType = 5;
            switch (answers[i].type) {
                case constants.AVERAGE:
                    ansOfType = 1;
                    break;
                case constants.BELOW_AVERAGE:
                    ansOfType = 2;
                    break;
                case constants.GOOD:
                    ansOfType = 3;
                    break;
                case constants.EXCELLENT:
                    ansOfType = 4;
                    break;
                case constants.NONE:
                    ansOfType = 5;
                    break;
                default:
                    ansOfType = 5;
                    break;
            }

            let singleRecord = {
                ResponseId: 0,
                QuestionId: answers[i].QuestionId,
                InterviewId: this.state.interviewId,
                AnswerId : ansOfType,
                Remarks : answers[i].remarks,
                IsUpdate: answers[i].IsUpdate
            }

          list.push(singleRecord);
        }

        var ans = {
            ansList : list,
            interviewId : this.state.interviewId,
            ResultRemark : this.state.Recommendations,
            ResultScore : this.state.InterviewScore,
            InterviewResult : this.state.InterviewResult,
            IsUpdate : this.state.IsUpdate
        }

        if (this.showFormErrors()) {
            setTimeout(() => this.saveNotification(), 300);
            questionAction.addNewItem(ans);
            browserHistory.push('/interviewees');
        }
    }
    onCancelClick() {
        browserHistory.push('/interviewees');
    }
    changeResult(e) {
        this.setState({InterviewResult : e })
    }
    //// Allow only digits
    digitsOnly(e) {
        const re = /[0-9]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }
    //// Validations
    showFormErrors() {
        const inputs = document.querySelectorAll('input[name]');
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
        const isInterviewScore = refName === constants.TXT_INTERVIEWSCORE;
        if (isInterviewScore) {
            const validity = this.refs[refName].validity;
            const error = document.getElementById(`${refName}Error`);
            if (validity.patternMismatch) {
                error.textContent = constants.SCORE_MESSAGE;
                return false;
            }

            error.textContent = '';
            return true;
        }

        return true;
    }
    handleChange(event) {
        this.setState({InterviewScore : event.target.value});
    }
    handleRecommendationsChange(event) {
        this.setState({ Recommendations : event.target.value });
    }
    syncQuestionsHandler() {
        QuestionCategoryActions.questionCategoryGetAll();
        questionAction.getAllQuestionAndResponseData(this.state.interviewId);
        QuestionCategoryStore.addChangeListener(this.onQuestionCategoryChangeHandler);
        QuestionStore.addChangeListener(this.onQuestionListChangeHandler);
        NotificationManager.success(constants.QUESTIONLIST_UPDATE_SUCCESS_MESSAGE , '', 3000)
    }
    sendMailHandler() {
      if(this.props.interview.IsResponseAvailable)
      {
          var emailData = [];
          emailData = this.props.interview;
          emailData['Name'] = this.props.interview.FirstName + ' ' + this.props.interview.LastName;
          emailData['Rating'] = this.props.interview.InterviewResult;
          emailData['Result'] = this.props.interview.InterviewScore;
          emailData['ScheduleDate'] = this.props.interview.SCHDATE;
          emailData['ScheduleTime'] = this.props.interview.SCHTIME;
          EmailActions.sendMail(emailData);
      }
      else {
          NotificationManager.success(constants.SAVE_DETAILS_FOR_SEND_EMAIL , '', 3000)
      }
    }
    onQuestionCategoryChangeHandler() {
        this.setState({ questionCategory: QuestionCategoryStore.getQuestionCategories() });
    }
    onQuestionListChangeHandler() {
        this.setState({ questions: QuestionStore.getAllQuestionAndResponseData() });
    }
    render() {
        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }
        var categoryList = this.state.questionCategory;
        var questionList = this.state.questions;
        var TabHeaderText = [];
        categoryList.map(function (listItem, i) {
            TabHeaderText.push(<Tab key={i}> { listItem.DisplayName } </Tab>);
        });

        var TabContent = [];
        categoryList.map(function (listItem, i) {
        TabContent.push( <TabPanel key={i}>
             <BootstrapTable data={questionList.filter(question => question.QuestionCategoryId === listItem.QuestionCategoryId)} cellEdit={ cellEditProp } insertRow={ false }>
                 <TableHeaderColumn className='margin-top30' editable={ false } dataField='RowNumber' width='60' headerAlign='center' dataAlign='center'>{ constants.SR }</TableHeaderColumn>
                 <TableHeaderColumn width='70' dataField='IsUpdate' dataFormat={ linkUpdateData } editable={ false }></TableHeaderColumn>
                 <TableHeaderColumn columnClassName='displayText' dataField='Question' isKey={ true } editable={ false }>{ constants.QUESTION }</TableHeaderColumn>
                 <TableHeaderColumn columnClassName='displayText' dataField='remarks' editable={ { type: 'textarea'} }>{ constants.REMARKS }</TableHeaderColumn>
                 <TableHeaderColumn dataField='type' dataFormat={ answersFormatter } customEditor={ { getElement: createAnswersEditor } }>{ constants.ANSWER }</TableHeaderColumn>
             </BootstrapTable>
         </TabPanel>);
          });

        return (
            <div>
                <div>
                    <button id={constants.BTN_SYNCQUESTIONS} className='btn btn-primary floatRight syncQuestionsMargin' onClick={this.syncQuestionsHandler}>{ constants.SYNC_QUESTIONS }</button>
                    <button id={constants.BTN_SENDMAIL} className='btn btn-primary floatRight sendMailMargin' onClick={this.sendMailHandler}>{ constants.SEND_EMAIL }</button>
                </div>
                <br/>
                <div>
                    <Tabs>
                        <TabList>
                            {TabHeaderText}
                        </TabList>
                        {TabContent}
                    </Tabs>
                </div>
                <br/>
                <div className='form-group col-md-12'>
                    <div className='col-md-4 controlFloatRight'>
                        <label id={constants.LBL_INTERVIEWSCORE} className='control-label'>{ constants.RATING }</label>
                        <input className='form-control' type='text' name={constants.TXT_INTERVIEWSCORE} ref={constants.TXT_INTERVIEWSCORE} onKeyPress={(e) => this.digitsOnly(e)} pattern='^(?:[1-9]|0[1-9]|10)$' value={this.state.InterviewScore ? this.state.InterviewScore : ''} onChange={this.handleChange} />
                        <div className='error' id={constants.LBL_INTERVIEWSCORE_ERROR} />
                    </div>
                </div>
                <div className='form-group col-md-12'>
                    <div className='col-md-4 controlFloatRight'>
                        <label id={constants.LBL_INTERVIEWRESULT} className='control-label'>{ constants.RESULT }</label>
                        <Ddl id={constants.DDL_INTERVIEWRESULT} options={this.state.result} value={this.state.InterviewResult} labelField='interviewresult' onValueChange={this.changeResult} valueField='interviewresultid' />
                        <div className='error' id={constants.LBL_INTERVIEWRESULT_ERROR} />
                    </div>
                </div>
                <div className='form-group col-md-12'>
                    <div className='col-md-4 controlFloatRight'>
                        <label id={constants.LBL_RECOMMENDATIONS} className='control-label'>{ constants.TXT_RECOMMENDATIONS }</label>
                        <textarea className='form-control resizeNone' rows='2' name={constants.TXT_RECOMMENDATIONS} ref={constants.TXT_RECOMMENDATIONS} onChange={ this.handleRecommendationsChange } value={this.state.Recommendations ? this.state.Recommendations : ''} required />
                        <div className='error' id={constants.LBL_RECOMMENDATIONS_ERROR} />
                    </div>
                </div>
                <div className='form-group col-md-12'>
                    <div className='col-md-4 controlFloatRight'>
                        <button className='btn MarginLeft1Per marginRight1Per floatRight' onClick={this.onCancelClick}>{ constants.CANCEL }</button>
                        <button className='btn btn-primary slds-button slds-button--neutral slds-button--brand floatRight' onClick={this.saveHandler}>{ constants.SAVE }</button>
                    </div>
                </div>
            </div>
        );
    }
}
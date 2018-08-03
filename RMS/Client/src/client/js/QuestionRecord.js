import React from 'react';
import { RecordHeader } from './components/PageHeader';
import questionActions from './../actions/QuestionActions';
import questionStore from './../stores/QuestionStore';
import constants from '../constants/Constants';

export default class QuestionRecord extends React.Component {
    constructor() {
        super();
        this.state = { question: [] };
        this.getQuestion = this.getQuestion.bind(this);
        this.onChange = this.onChange.bind(this);
        this.editHandler = this.editHandler.bind(this);
    }
    componentDidMount() {
        questionStore.addChangeListener(this.onChange);
        this.getQuestion(this.props.params.questionId);
    }
    componentWillUnmount() {
        questionStore.removeChangeListener(this.onChange);
    }
    getQuestion(questionId) {
        questionActions.questionGetById(questionId);
    }
    onChange() {
        this.setState({ question: questionStore.getQuestionById() });
    }
    editHandler() {
        window.location.href = 'question/' + this.state.question.questionId + '/edit';
    }
    render() {
        return (
            <div>
                <RecordHeader type='question' icon={constants.LBL_LEAD} onEdit={ this.editHandler } onClone={ this.cloneHandler }>
                </RecordHeader>
                { React.cloneElement(this.props.children, { question : this.state.question }) }
            </div>
        );
    }
}
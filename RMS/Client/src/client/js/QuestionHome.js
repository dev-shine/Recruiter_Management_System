import React from 'react';
import { HomeHeader } from './components/PageHeader';
import QuestionFormWindow from './QuestionFormWindow';
import QuestionList from './QuestionList';
import { NotificationManager } from 'react-notifications';
import questionStore from './../stores/QuestionStore';
import questionActions from './../actions/QuestionActions';
import questionCategoryStore from './../stores/QuestionCategoryStore';
import questionCategoryActions from './../actions/QuestionCategoryActions';
import constants from '../constants/Constants';

export default class QuestionHome extends React.Component {
    constructor() {
        super();
        this.state = { questions: [] };
        this.newHandler = this.newHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }
    componentDidMount(){
        questionStore.addChangeListener(this.onChange);
        questionCategoryStore.addChangeListener(this.onChange);
        questionActions.questionGetAll();
        questionCategoryActions.getAllActiveCategories();
    }
    componentWillUnmount() {
        questionStore.removeChangeListener(this.onChange);
        questionCategoryStore.removeChangeListener(this.onChange);
    }
    newHandler() {
        this.setState({ addingQuestion: true });
    }
    onChange() {
        if (!this.state.addingQuestion)
        {
            this.setState({
                questions: questionStore.getQuestions(),
                questionCategory: questionCategoryStore.getAllActiveCategories()
            });
        }

        if (this.state.addingQuestion)
        {
            this.setState({ addingQuestion: false });
            this.setState({ getQuestionInsertStatus : questionStore.getQuestionInsertStatus() }, function() {
                if (this.state.getQuestionInsertStatus === constants.CONFLICT) {
                    NotificationManager.error(constants.QUESTION_EXIST, '', 2000)
                }
                else if (this.state.getQuestionInsertStatus === constants.LBL_OK) {
                    NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000)
                }
            });
        }
    }
    cancelHandler() {
        this.setState({ addingQuestion: false });
    }
    render() {
        return (
            <div>
                <HomeHeader type={ constants.QUESTIONS }
                            title={ this.state.abc }
                            newLabel={ constants.NEW_QUESTION }
                            actions={[{ value: constants.LBL_NEW, label: constants.NEW_QUESTION }]}
                            itemCount={ this.state.questions.length }
                            views={[{ id: 1, name: constants.QUESTION_LIST }]}
                            viewId={ constants.LBL_ONE }
                            onNew={ this.newHandler } />
                <QuestionList questions={ this.state.questions } />
                { this.state.addingQuestion ? <QuestionFormWindow questionCategory={ this.state.questionCategory } onCancel={ this.cancelHandler } /> : null }
            </div>
        );
    }
}
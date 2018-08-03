import React from 'react';
import { RecordHeader } from './components/PageHeader';
import QuestionCategoryStore from '../stores/QuestionCategoryStore';
import QuestionCategoryActions from './../actions/QuestionCategoryActions';
import constants from '../constants/Constants';

export default class QuestionCategoryRecord extends React.Component {
    constructor() {
        super();
        this.state = { questionCategories: [] };
        this.getQuestionCategory = this.getQuestionCategory.bind(this);
        this.onChangeRecord = this.onChangeRecord.bind(this);
        this.editHandler = this.editHandler.bind(this);
    }
    componentDidMount() {
        QuestionCategoryStore.addChangeListener(this.onChangeRecord);
        this.getQuestionCategory(this.props.params.questioncategoryId);
    }
    componentWillReceiveProps(props) {
        this.getQuestionCategory(props.params.questioncategoryId);
    }
    componentWillUnmount() {
        QuestionCategoryStore.removeChangeListener(this.onChangeRecord);
    }
    getQuestionCategory(id) {
        QuestionCategoryActions.getByIdCategory(id);
    }
    onChangeRecord() {
        this.setState({ questioncategories: QuestionCategoryStore.getQuestionCategoryById() });
    }
    editHandler() {
        window.location.hash = 'questioncategory/' + this.state.QuestionCategories.QuestionCategoryId + '/edit';
    }
    render() {
        return (
            <div>
                <RecordHeader type='categories' icon={constants.LBL_LEAD} title='' onEdit={this.editHandler} onClone={this.cloneHandler}>
                </RecordHeader>
                {React.cloneElement(this.props.children, {questioncategories : this.state.questioncategories})}
            </div>
        );
    }
}
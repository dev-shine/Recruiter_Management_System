import React from 'react';
import { HomeHeader } from './components/PageHeader';
import QuestionCategoryFormWindow from './QuestionCategoryFormWindow';
import QuestionCategoryList from './QuestionCategoryList';
import { NotificationManager } from 'react-notifications';
import QuestionCategoryStore from './../stores/QuestionCategoryStore';
import QuestionCategoryActions from './../actions/QuestionCategoryActions';
import constants from '../constants/Constants';

export default class QuestionCategoryHome extends React.Component {
    constructor() {
        super();
        this.state = { questionCategories: [] };
        this.newHandler = this.newHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }
    componentDidMount() {
        QuestionCategoryStore.addChangeListener(this.onChange);
        QuestionCategoryActions.getAllCategories();
    }
    componentWillUnmount() {
        QuestionCategoryStore.removeChangeListener(this.onChange);
    }
    newHandler() {
        this.setState({ addingCategory: true });
    }
    onChange() {
        if (!this.state.addingCategory)
        {
            this.setState({ questionCategories: QuestionCategoryStore.returnStore() });
        }
        if (this.state.addingCategory)
        {
            this.setState({ addingCategory: false });
            this.setState({
              categoryInsertStatus : QuestionCategoryStore.getInsertStatus()
            }, function(){
                  if (this.state.categoryInsertStatus === constants.CONFLICT)
                  {
                      NotificationManager.error(constants.QUESTIONCATEGORY_EXIST, '', 2000)
                  }
                  else if (this.state.categoryInsertStatus === constants.LBL_OK)
                  {
                      NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000)
                  }
              });
        }
    }
    cancelHandler() {
        this.setState({ addingCategory: false });
    }
    render() {
        return (
            <div>
                <HomeHeader type={ constants.CATEGORIES }
                            title={ this.state.abc }
                            newLabel={ constants.NEW_QUESTIONCATEGORY }
                            actions={[{ value: constants.LBL_NEW, label: constants.NEW_QUESTIONCATEGORY }]}
                            itemCount={ this.state.questionCategories.length }
                            views={[{ id: 1, name: constants.QUESTIONCATEGORY_LIST }]}
                            viewId={ constants.LBL_ONE }
                            onNew={ this.newHandler } />
                <QuestionCategoryList QuestionCategory={ this.state.questionCategories }  />
                { this.state.addingCategory ? <QuestionCategoryFormWindow onCancel={ this.cancelHandler } /> : null }
            </div>
        );
    }
}
import React from 'react';
import { HomeHeader } from './components/PageHeader';
import InterviewScheduleFormWindow from './InterviewScheduleFormWindow';
import InterviewScheduleList from './InterviewScheduleList';
import { NotificationManager } from 'react-notifications';
import constants from '../constants/Constants';
import interviewScheduleStore from './../stores/InterviewScheduleStore';
import interviewScheduleAction from './../actions/InterviewScheduleActions';
import InterviewStatusStore from './../stores/InterviewStatusStore';
import InterviewStatusActions from './../actions/InterviewStatusActions';
import personAction from './../actions/PersonActions';
import personStore from '../stores/PersonStore';

export default class InterviewScheduleHome extends React.Component {
    constructor() {
        super();
        this.state = { interviews: [], interviewStatus: [], person: [], interviewInsertStatus: '', addingInterview: false };
        this.newHandler = this.newHandler.bind(this);
        this.onChangePersons = this.onChangePersons.bind(this);
        this.onChange = this.onChange.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }
    componentWillMount() {
        interviewScheduleStore.addChangeListener(this.onChange);
        InterviewStatusStore.addChangeListener(this.onChange);
        personStore.addChangeListener(this.onChangePersons);
        interviewScheduleAction.getAllInterviews();
        InterviewStatusActions.getInterviewStatus();
        personAction.getAllPersons();
    }
    componentWillUnmount() {
        interviewScheduleStore.removeChangeListener(this.onChange);
        InterviewStatusStore.removeChangeListener(this.onChange);
        personStore.removeChangeListener(this.onChangePersons);
    }
    newHandler() {
        this.setState({ addingInterview: true });
    }
    onChangePersons(){
        if (!this.state.addingInterview)
        {
            this.setState({
                person: personStore.getPersons()
            });
        }
    }
    onChange() {
        if (!this.state.addingInterview)
        {
            this.setState({
                interviews: interviewScheduleStore.returnStore(),
                interviewStatus: InterviewStatusStore.returnStore()
            });
        }

        if (this.state.addingInterview) {
            this.setState({ addingInterview: false });
            this.setState({ interviewInsertStatus : interviewScheduleStore.getInsertStatus() }, function() {
                if (this.state.interviewInsertStatus === constants.CONFLICT) {
                    NotificationManager.error(constants.INTERVIEW_EXIST, '', 2000)
                }
                else if (this.state.interviewInsertStatus === constants.LBL_OK) {
                    NotificationManager.success(constants.INSERT_SUCCESS_MESSAGE, '', 2000)
                }
            });
        }
    }
    cancelHandler() {
        this.setState({ addingInterview: false });
    }
    render() {
        return (
            <div>
                <HomeHeader type={ constants.INTERVIEWS }
                            title={ this.state.abc }
                            newLabel={ constants.NEWINTERVIEWEE }
                            actions={[{ value: constants.LBL_NEW, label: constants.NEWINTERVIEW }]}
                            itemCount={ this.state.interviews.length }
                            views={[{ id: 1, name: constants.INTERVIEWEE_LIST }]}
                            viewId={ constants.LBL_ONE }
                            onNew={ this.newHandler } />
                <InterviewScheduleList interviews={ this.state.interviews } />
                { this.state.addingInterview ? <InterviewScheduleFormWindow interviewStatus={ this.state.interviewStatus } person={ this.state.person } onCancel={ this.cancelHandler } /> : null }
            </div>
        );
    }
}
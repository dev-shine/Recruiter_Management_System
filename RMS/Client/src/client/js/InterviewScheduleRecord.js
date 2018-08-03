import React from 'react';
import moment from 'moment';
import { RecordHeader, HeaderField } from './components/PageHeader';
import constants from '../constants/Constants';
import interviewScheduleActions from './../actions/InterviewScheduleActions';
import InterviewScheduleStore from './../stores/InterviewScheduleStore';
import InterviewStatusStore from './../stores/InterviewStatusStore';

export default class InterviewScheduleRecord extends React.Component {
    constructor() {
        super();
        this.state = { interview: [], interviewStatus: [] };
        this.getInterview = this.getInterview.bind(this);
        this.onChangeRecord = this.onChangeRecord.bind(this);
        this.editHandler = this.editHandler.bind(this);
    }
    componentDidMount() {
        InterviewScheduleStore.addChangeListener(this.onChangeRecord);
        this.getInterview(this.props.params.interviewId);
    }
    componentWillUnmount() {
        InterviewScheduleStore.removeChangeListener(this.onChangeRecord);
    }
    getInterview(id) {
        interviewScheduleActions.getByIdInterview(id);
    }
    onChangeRecord() {
        this.setState({ interview: InterviewScheduleStore.getInterviewById() });
        this.setState({ interviewStatus: InterviewStatusStore.returnStore() });
    }
    editHandler() {
        window.location.href = '#interviewee/' + this.state.interview.interviewId + '/edit';
    }
    render() {
        let interviewDate;
        if (this.state.interview.SCHDATE !== undefined && this.state.interview.SCHTIME !== undefined)
        {
            interviewDate = this.state.interview.SCHDATE + ' ' + this.state.interview.SCHTIME;
        }
        return (
            <div>
                <RecordHeader type={ constants.INTERVIEW } icon={ constants.LBL_LEAD }
                    title={this.state.interview.FirstName + ' ' + this.state.interview.LastName}
                    onEdit={this.editHandler}
                    onClone={this.cloneHandler}>
                    <HeaderField label={ constants.SCHEDULEDATE } value={interviewDate} />
                    <HeaderField label={ constants.PHONENUMBER } value={this.state.interview.PhoneNumber} />
                    <HeaderField label={ constants.EXPERIENCE_YEARS } value={this.state.interview.Experience} />
                    <HeaderField label={ constants.EMAIL } value={this.state.interview.EmailId}/>
                </RecordHeader>
                { React.cloneElement(this.props.children, { interview : this.state.interview }) }
            </div>
        );
    }
}
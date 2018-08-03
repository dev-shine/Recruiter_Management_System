import React from 'react';
import { RecordHeader, HeaderField } from './components/PageHeader';
import constants from '../constants/Constants';
import UserStore from '../stores/UserStore';
import UserActions from './../actions/UserActions';

export default class UserRecord extends React.Component {
    constructor() {
        super();
        this.state = { users: [] };
        this.getUser = this.getUser.bind(this);
        this.onChangeRecord = this.onChangeRecord.bind(this);
        this.editHandler = this.editHandler.bind(this);
    }
    componentDidMount() {
        UserStore.addChangeListener(this.onChangeRecord);
        this.getUser(this.props.params.userId);
    }
    componentWillReceiveProps(props) {
        this.getUser(props.params.userId);
    }
    getUser(id) {
        UserActions.getByIdUser(id);
    }
    onChangeRecord() {
        this.setState({ users: UserStore.getUserById() });
    }
    editHandler() {
        window.location.hash = 'user/' + this.state.users.userId + '/edit';
    }
    render() {
        return (
            <div>
                <RecordHeader type='users' icon={constants.LBL_LEAD}
                    title={this.state.users.FirstName + ' ' + this.state.users.LastName}
                    onEdit={this.editHandler}
                    onClone={this.cloneHandler}>
                    <HeaderField label={ constants.CONTACTNUMBER } value={this.state.users.ContactNumber} />
                    <HeaderField label={ constants.EMAIL } value={this.state.users.Email} />
                </RecordHeader>
                { React.cloneElement(this.props.children, { users : this.state.users }) }
            </div>
        );
    }
}
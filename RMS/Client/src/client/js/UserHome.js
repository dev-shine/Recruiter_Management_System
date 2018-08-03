import React from 'react';
import { HomeHeader } from './components/PageHeader';
import UserFormWindow from './UserFormWindow';
import UserList from './UserList';
import { NotificationManager } from 'react-notifications';
import constants from '../constants/Constants';
import UserStore from './../stores/UserStore';
import UserActions from './../actions/UserActions';

export default class UserHome extends React.Component {
    constructor() {
        super();
        this.state = { users :[] };
        this.newHandler = this.newHandler.bind(this);
        this.onChange = this.onChange.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }
    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
        UserActions.getAllUsers();
    }
    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }
    newHandler() {
        this.setState({ addingInterview: true });
    }
    onChange(){
        if (!this.state.addingInterview) {
            this.setState({
                users: UserStore.returnStore()
            });
        }
        if (this.state.addingInterview) {
            this.setState({ addingInterview: false });
            this.setState({ userInsertStatus : UserStore.getInsertStatus() }, function() {
                if (this.state.userInsertStatus === constants.CONFLICT) {
                    NotificationManager.error(constants.EMAIL_EXIST_MESSAGE, '', 2000)
                }
                else if (this.state.userInsertStatus === constants.LBL_OK) {
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
                <HomeHeader type={ constants.USERS }
                            title={ this.state.abc }
                            newLabel={ constants.NEWUSER }
                            actions={[{ value: constants.LBL_NEW, label: constants.NEWUSER }]}
                            itemCount={ this.state.users.length }
                            views={[{ id: 1, name: constants.USER_LIST }]}
                            viewId={ constants.LBL_ONE }
                            onNew={ this.newHandler } />
                <UserList User={ this.state.users }  />
                { this.state.addingInterview ? <UserFormWindow onCancel={ this.cancelHandler } /> : null }
            </div>
        );
    }
}
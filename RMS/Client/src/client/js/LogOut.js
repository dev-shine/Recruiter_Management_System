import React from 'react';
import UserActions from './../actions/UserActions';
import UserStore from '../stores/UserStore';
import { browserHistory } from 'react-router';

export default class LogOut extends React.Component {
    constructor() {
        super();
        UserStore.addChangeListener(this.onLogOut);
        UserActions.logOutUser();
    }
    onLogOut(){
        browserHistory.push('/');
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}
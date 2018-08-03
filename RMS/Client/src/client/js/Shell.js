import React from 'react';
import Spinner from './components/Spinner';
import Toast from './components/Toast';
import { Icon } from './components/Icons';
import { NotificationContainer} from 'react-notifications';
import constants from '../constants/Constants';
let HeaderMenu = '';

export default class Shell extends React.Component {
    constructor() {
        super();
        this.selectHandler = this.selectHandler.bind(this);
    }
    selectHandler(index, value, label) {
        window.location.href = 'interviewee/' + value;
    }
    render() {
        if (localStorage.ls_userSession)
        {
            HeaderMenu = (
                <header className='menu' style={{backgroundColor: '#01344E', verticalAlign: 'middle', padding: '7px'}}>
                    <div>
                        <ul className='slds-list--horizontal'>
                            <li className='slds-list__item applicationName'>RMS</li>
                            <li className='slds-list__item'><a href='/interviewees'><Icon name='lead' theme={null}/>{constants.LBL_INTERVIWEES}</a></li>
                            <li className='slds-list__item'><a href='/questioncategories'><Icon name='lead' theme={null}/>{constants.LBL_QUESTIONCATEGORIES}</a></li>
                            <li className='slds-list__item'><a href='/questions'><Icon name='lead' theme={null}/>{constants.QUESTIONS}</a></li>
                            <li className='slds-list__item'>
                                <div className='dropdown'>
                                    <div className='dropbtn divReportStyle'>
                                        {constants.LBL_REPORTS}
                                    </div>
                                    <div className='dropdown-content divContentStyle'>
                                        <a href='/reports'>{constants.INTERVIEWREPORT}</a>
                                        <a href='/MonthlyReport'>{constants.LBL_MONTHLYINTERVIEWS}</a>
                                        <a href='/personWiseInterviewReport'>{constants.LBL_PERSONWISEINTERVIEWS}</a>
                                    </div>
                                </div>
                            </li>
                            <li className='slds-list__item'><a href='/users'><Icon name='lead' theme={null}/>{constants.USERS}</a></li>
                            <li className='slds-list__item userMenu'>
                                <div className='dropdown'>
                                    <div className='dropbtn'> {localStorage.ls_userName} </div>
                                    <div className='dropdown-content'>
                                        <a href='/changePassword'>{constants.CHANGEPASSWORD}</a>
                                        <a href='/logout'>{constants.LBL_LOGOUT}</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </header>
            )
        }
        else {
            HeaderMenu = ''
        }
        return (
            <div>
                <NotificationContainer/>
                <Spinner/>
                <Toast/>
                { HeaderMenu }
                { this.props.children }
            </div>
        );
    }
}
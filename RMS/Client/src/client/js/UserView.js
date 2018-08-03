import React from 'react';
import moment from 'moment';

export default class UserView extends React.Component {
    render() {
        let User = this.props.User;
        return (
            <div className='slds-m-around--medium'>
                <div className='slds-grid slds-wrap slds-m-bottom--large'>
                    <div className='slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-2 slds-m-top--medium'>
                        <dl className='page-header--rec-home__detail-item'>
                            <dt>
                                <p className='slds-text-heading--label slds-truncate' title='Field 1'>Contact Number</p>
                            </dt>
                            <dd>
                                <p className='slds-text-body--regular slds-truncate' title=''>{User.ContactNumber}
                                </p>
                            </dd>
                        </dl>
                    </div>
                    <div className='slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-2 slds-m-top--medium'>
                        <dl className='page-header--rec-home__detail-item'>
                            <dt>
                                <p className='slds-text-heading--label slds-truncate' title='Field 1'>Email</p>
                            </dt>
                            <dd>
                                <p className='slds-text-body--regular slds-truncate' title=''>{User.Email}
                                </p>
                            </dd>
                        </dl>
                    </div>

                    </div>
                    <div className='slds-col--padded slds-size--1-of-1 slds-medium-size--1-of-2 slds-m-top--medium'>
                        <dl className='page-header--rec-home__detail-item'>
                            <dt>
                                <p className='slds-text-heading--label slds-truncate' title='Field 1'>IsActive</p>
                            </dt>
                            <dd>
                                <p className='slds-text-body--regular slds-truncate' title=''>{User.IsActive}
                                </p>
                            </dd>
                        </dl>
                </div>
            </div>

        );
    }
}
import React from 'react';
import spinner from '../../../assets/images/spinners/slds_spinner_brand.gif';

export default class Spinner extends React.Component {
    constructor() {
        super();
        document.addEventListener('startWaiting', () => {
            this.setState({spinning:true})
        });
        document.addEventListener('stopWaiting', () => {
            this.setState({spinning:false})
        });
        this.state = { spinning: false };
    }
    render() {
        return (
            <div>
            {this.state.spinning ?
                <div className='slds-spinner--large' style={{position:'absolute', zIndex:'100000', top: '0', left: '0', bottom:'0', right:'0', margin:'auto'}}>
                    <img src={spinner} alt='Loading...' />
                </div>
            :null}
            </div>
        );
    }
}
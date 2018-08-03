import React from 'react';
import moment from 'moment';
import {Icon, ButtonIcon} from './Icons';
import Dropdown from './Dropdown';
import {DropdownItem} from './Dropdown';

export class DownButtonDropdown extends React.Component {
    constructor() {
      super();
      this.state = { open: false, label: '' };
      this.changeHandler = this.changeHandler.bind(this);
      this.buttonClickHandler = this.buttonClickHandler.bind(this);
    }
    componentWillReceiveProps(props) {
        let label;
        let icon;
        let items = props.data;
        for (let i=0; i<items.length; i++) {
            let item = items[i];
            if (item[props.valueField || 'id'] == props.value) {
                label = item[props.labelField || 'name'];
                icon = item[props.iconField];
                break;
            }
        }

        this.setState({value:this.props.value, label});
    }
    changeHandler(index, value, label) {
        this.setState({value, label, open:false});
        if (this.props.onChange) {
            this.props.onChange(index, value, label);
        }
    }
    buttonClickHandler() {
        this.setState({open:true});
    }
    render() {
        return (
            <div className='slds-grid slds-no-space'>
              <h4 className='slds-truncate' title=''>{this.state.label}</h4>
                <div className='slds-dropdown-trigger' aria-haspopup='true'>
                    {/*<button className='slds-button slds-button--icon-bare slds-shrink-none slds-align-middle slds-m-left--x-small' onClick={this.buttonClickHandler}>
                        <ButtonIcon name='down'/>
                        <span className='slds-assistive-text'>View More</span>
                    </button>*/}
                    {this.state.open?
                        <Dropdown position='left' header={this.props.header}
                                  valueField={this.props.valueField}
                                  labelField={this.props.labelField}
                                  data={this.props.data}
                                  onChange={this.changeHandler}/>
                        :null}
                </div>
            </div>
        );
    }
}

export class ButtonDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: props.value, label: props.label || 'Select an option' };
      this.changeHandler = this.changeHandler.bind(this);
    }
    changeHandler(value, label, icon) {
        this.setState({value: value, label: label, icon: icon, opened: false});
        this.props.onChange(value, label);
    }
    render() {
        let label;
        let icon;
        let items = this.props.children;
        for (let i=0; i<items.length; i++) {
            let item = items[i];
            if (item.props[this.props.valueField] === this.state.value) {
                label = item.props[this.props.labelField];
                icon = item.props[this.props.iconField];
                break;
            }
        }

        let className = 'slds-button slds-button--icon-more';
        return (
            <div className='slds-dropdown-trigger' aria-haspopup='true'>
                <button className={className} aria-haspopup='true'>
                    <ButtonIcon name={icon || this.props.icon}/>
                    <span className='slds-assistive-text'>Settings</span>
                    <ButtonIcon name='down' size='x-small'/>
                    <span className='slds-assistive-text'>More</span>
                </button>
                <Dropdown header={this.props.header}
                          valueField={this.props.valueField}
                          labelField={this.props.labelField}
                          items={this.props.children}
                          size='small'
                          onChange={this.changeHandler}/>
            </div>
        );
    }
}

ButtonDropdown.defaultProps = {
  valueField: 'value',
  labelField: 'label',
  iconField: 'icon'
};

export class HeaderField extends React.Component {
    render() {
        let value = this.props.value;

        if (this.props.format === 'currency') {
            value = parseFloat(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        } else if (this.props.format === 'date') {
            value = moment(value).format('YYYY/MM/DD');
        } else if (typeof this.props.format === 'function') {
            value = this.props.format(value);
        }

        return (
                <div className='slds-col--padded headerPosition'>
                    <label className='divPadding' title={this.props.label}>{this.props.label}</label>
                    <div className='slds-truncate lblPadding' title={value}>{value}</div>
                </div>
            );
        }
}

export class RecordHeader extends React.Component {
    constructor() {
      super();
      this.followHandler = this.followHandler.bind(this);
    }
    followHandler() {
        alert('Not implemented in this demo app');
    }
    render() {
        return (
            <div className='slds-page-header'>
                <div className='slds-grid'>
                    <div className='slds-col slds-has-flexi-truncate'>
                        <div className='slds-media'>
                            <div className='slds-media__body'>
                                {/*<p className='slds-text-heading--label'>{this.props.type}</p>
                                <div className='slds-grid'>*/}
                                    <h4 className='slds-align-middle marginHeader' title={this.props.title}>{this.props.title}</h4>
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                    <div className='slds-col slds-no-flex slds-align-bottom'>
                        {/*<div className='slds-button-group' role='group'>
                            <button className='slds-button slds-button--neutral' onClick={this.props.onEdit}>Edit</button>
                            <button className='slds-button slds-button--neutral' onClick={this.props.onDelete}>Delete</button>
                            <div className='slds-button--last'>
                                <button className='slds-button slds-button--icon-border-filled'>
                                    <ButtonIcon name='down'/>
                                    <span className='slds-assistive-text'>More</span>
                                </button>
                            </div>
                        </div>*/}
                    </div>
                </div>
                <div className='slds-grid slds-page-header__detail-row'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

RecordHeader.defaultProps = {
  icon: 'account'
};

export class HomeHeader extends React.Component {
    render() {
        let viewItems;
        if (this.props.viewOptions) {
            viewItems = this.props.viewOptions.map(item => <DropdownItem value={item.value} label={item.label} icon={item.icon}/>);
        }

        let sortItems;
        if (this.props.sortOptions) {
            sortItems = this.props.sortOptions.map(item => <DropdownItem value={item.value} label={item.label}/>);
        }

        return (
            <div className='slds-page-header'>
                <div className='slds-grid'>
                    <div className='slds-col slds-no-flex slds-has-flexi-truncate'>
                        {/*<p className='slds-text-heading--label'>{this.props.type}</p>*/}
                        <DownButtonDropdown data={this.props.views} value={this.props.viewId} onChange={this.props.onViewChange}/>
                    </div>
                    <div className='slds-col'>
                    </div>
                    <div className='slds-col slds-no-flex slds-align-bottom'>
                        <div className='slds-grid'>
                            {viewItems ?
                            <div className='slds-button-space-left'>
                                <ButtonDropdown header='Display as' iconMore={true} value={this.props.viewOptions[0].value} onChange={this.props.onViewChange}>
                                    {viewItems}
                                </ButtonDropdown>
                            </div>
                            : ''}
                            {sortItems ?
                            <div className='slds-button-space-left'>
                                <ButtonDropdown header='Sort By' icon='sort' iconMore={true} onChange={this.props.onSort}>
                                    {sortItems}
                                </ButtonDropdown>
                            </div>
                            : ''}
                            <div className='slds-button-group slds-button-space-left' role='group'>
                                <button className='btn btn-primary' onClick={this.props.onNew}>{this.props.newLabel}</button>
                                {/*<div className='slds-button--last'>
                                    <button className='slds-button slds-button--icon-border-filled'>
                                        <ButtonIcon name='down'/>
                                        <span className='slds-assistive-text'>More Actions</span>
                                    </button>
                                </div>*/}
                            </div>
                        </div>
                    </div>
                </div>
                {/*<p className='slds-text-body--small slds-m-top--x-small'>{this.props.itemCount} {this.props.type.toLowerCase()}</p>*/}
            </div>
        );
    }
}

HomeHeader.defaultProps = {
  newLabel: 'New',
  icon: 'account'
};
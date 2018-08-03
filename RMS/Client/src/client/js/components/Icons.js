import React from 'react';

export class ButtonIcon extends React.Component {
    render() {
        let useTag = '<use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#' + this.props.name + '" />';
        let className  = 'slds-button__icon';
        if (this.props.stateful) {
            className += '--stateful';
        }
        if (this.props.inverse) {
            className += ' slds-button__icon--inverse';
        }
        if (this.props.position) {
            className = className + ' slds-button__icon--' + this.props.position;
        }
        if (this.props.size) {
            className = className + ' slds-button__icon--' + this.props.size;
        }
        if (this.props.hint) {
            className += ' slds-button__icon--hint';
        }
        return <svg aria-hidden='true' className={className} dangerouslySetInnerHTML={{__html: useTag }} />;
    }
}

export class Icon extends React.Component {
    render() {
        let useTag = '<use xlink:href="/assets/icons/' + this.props.category + '-sprite/svg/symbols.svg#' + this.props.name + '" />';
        let className  = 'slds-icon';
        let theme = this.props.theme === undefined ? this.props.name : this.props.theme;
        if (this.props.stateful) {
            className += '--stateful';
        }
        if (this.props.inverse) {
            className += ' slds-icon--inverse';
        }
        if (this.props.size) {
            className = className + ' slds-icon--' + this.props.size;
        }
        if (this.props.position) {
            className = className + ' slds-icon--' + this.props.position;
        }
        if (theme) {
            className = className + ' slds-icon-' + this.props.category + '-' + theme;
        }
        return <svg aria-hidden='true' className={className} dangerouslySetInnerHTML={{__html: useTag }} />;
    }
}

Icon.defaultProps = {
  category: 'standard'
};

export class InputIcon extends React.Component {
    render() {
        let useTag = '<use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#' + this.props.name + '" />';
        let className  = 'slds-input__icon slds-icon-text-default';
        return <svg aria-hidden='true' className={className} dangerouslySetInnerHTML={{__html: useTag }} />;
    }
}
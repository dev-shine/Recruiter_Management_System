import React from 'react';

export default class Ddl extends React.Component {
    constructor(props) {
        super(props);
        var selected = this.getSelectedFromProps(props);
        this.state = { selected: selected };
        this.getSelectedFromProps = this.getSelectedFromProps.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        var selected = this.getSelectedFromProps(nextProps);
        this.setState({
           selected: selected
        });
    }
    getSelectedFromProps(props) {
        var selected = props.value;
        return selected;
    }
    handleChange(e) {
      this.setState({selected: e.target.value});
      e.target.classList.remove('BorderRed');
        this.props.onValueChange(e.target.value);
    }
    render() {
        var self = this;
        var selected = this.state.selected;
        var options = self.props.options.map(function(option) {
            return (
                <option key={option[self.props.valueField]} value={option[self.props.valueField]}>
                    {option[self.props.labelField]}
                </option>
            )
        });
        return (

            <select onChange={this.handleChange} id={this.props.id}
                    className='form-control'
                    value={selected}
                    placeholder='Select an option'
                    ref={this.props.id}
                    >
                    <option value='0'>Select an option</option>
                {options}
            </select>
        )
    }
}

Ddl.propTypes = {
  id: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired,
  value: React.PropTypes.oneOfType(
      [
          React.PropTypes.number,
          React.PropTypes.string
      ]
  ),
  valueField: React.PropTypes.string,
  labelField: React.PropTypes.string,
  onChange: React.PropTypes.func
}

Ddl.defaultProps = {
  value: undefined,
  valueField: 'value',
  labelField: 'label',
  onChange: null
}
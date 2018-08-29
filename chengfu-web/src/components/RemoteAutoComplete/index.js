import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';

const { Option } = AutoComplete;

class RemoteAutoComplete extends Component {
  static defaultProps = {
    disabled: false,
    onChange: () => { },
  }
  static propsType = {
    disabled: PropTypes.bool,
    fetcher: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func,
  }
  constructor(props) {
    super(props);

    const value = this.props.value || undefined;

    this.lastFetchId = 0;
    this.state = {
      data: [],
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  fetchData = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const { fetcher } = this.props;
    this.setState({ data: [] });
    fetcher(value)
      .then((data) => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        this.setState({ data });
      });
  }

  handleSelect = (value) => {
    this.handleChange(value);
  }

  handleChange = (value) => {
    this.setState({
      data: [],
      value,
    });
    this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    const { returnMode, onChange } = this.props;
    if (onChange) {
      onChange(returnMode === 'key' ? changedValue.value : changedValue);
    }
  }

  render() {
    const { data, value } = this.state;
    return (
      <AutoComplete
        value={value || ''}
        dataSource={data}
        style={{ width: 200 }}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onSearch={this.fetchData}
        placeholder={this.props.placeholder}
      >
        {data && data.map(d => <Option key={d.key} value={d.key}>{d.label}</Option>)}
      </AutoComplete>
    );
  }
}


export default RemoteAutoComplete;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';
import debounce from 'lodash.debounce';

class RemoteTreeSelect extends Component {
  static defaultProps = {
    multiple: false,
    onChange: () => { },
  }
  static propsType = {
    multiple: PropTypes.bool,
    disabled: PropTypes.bool.isRequired,
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
    this.fetchData = debounce(this.fetchData, 800);
    this.state = {
      data: [],
      value,
    };
  }

  componentDidMount() {
    this.fetchData('');
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  onChange = (value) => {
    this.setState({ value });
    this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    const { returnMode, onChange } = this.props;
    if (onChange) {
      onChange(returnMode === 'key' ? changedValue.value : changedValue);
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

  render() {
    const { data, value } = this.state;
    const { style } = this.props;
    return (
      <TreeSelect
        showSearch
        allowClear
        labelInValue
        multiple={this.props.multiple}
        disabled={this.props.disabled}
        treeNodeFilterProp="name"
        style={{ width: '100%', ...style }}
        value={value}
        treeData={data}
        dropdownStyle={{ maxHeight: 150, overflow: 'auto' }}
        placeholder={this.props.placeholder}
        onSearch={this.fetchData}
        onChange={this.onChange}
      />
    );
  }
}


export default RemoteTreeSelect;

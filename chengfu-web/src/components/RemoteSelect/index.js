import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Spin } from 'antd';
import debounce from 'lodash.debounce';
import request from '../../utils/request';

const { Option } = Select;

const identity = a => a;

class RemoteSelect extends Component {
  static defaultProps = {
    allowClear: false,
    multiple: false,
    disabled: false,
    labelInValue: true,
    resultMap: identity,
    onChange: () => { },
  }
  static propsType = {
    allowClear: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    url: PropTypes.string,
    resultMap: PropTypes.func,
    fetcher: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    style: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func,
    tokenSeparators: PropTypes.any,
    labelInValue: PropTypes.bool,
  }
  constructor(props) {
    super(props);

    const value = this.props.value || undefined;

    this.lastFetchId = 0;
    this.fetchData = debounce(this.fetchData, 800);
    this.state = {
      data: [],
      value,
      fetching: false,
    };
  }

  componentDidMount() {
    this.fetchData('');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
    if (this.props.url !== nextProps.url) {
      this.fetchData('');
    }
    if (this.props.fetcher !== nextProps.fetcher) {
      this.fetchData('');
    }
  }

  componentWillUnmount() {
    if (this.promise && this.promiseReject) {
      this.promiseReject();
      this.promise = null;
      this.promiseReject = null;
    }
  }

  fetcher = (filter) => {
    const { url, fetcher } = this.props;
    if (url) {
      const s = url.indexOf('?') > -1 ? '&' : '?';
      return request(`${url}${s}filter=${filter}`)
        .then(this.props.resultMap);
    } else if (fetcher) {
      return fetcher(filter)
        .then(this.props.resultMap);
    }
  }

  fetchData = (filter) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });

    this.promise = new Promise((resolve, reject) => {
      this.promiseReject = reject;
      return resolve(filter);
    }).then(this.fetcher)
      .then((data) => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        this.setState({ data, fetching: false });
      });
  }

  handleChange = (value) => {
    this.setState({
      // data: [],
      value,
      fetching: false,
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
    const { fetching, data, value } = this.state;
    return (
      <Select
        showSearch
        allowClear={this.props.allowClear}
        labelInValue={this.props.labelInValue}
        disabled={this.props.disabled}
        mode={this.props.multiple ? 'multiple' : undefined}
        value={value}
        placeholder={this.props.placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : data && data.length ? null : '没找到匹配项'}
        filterOption={false}
        showArrow={false}
        onSearch={this.fetchData}
        onChange={this.handleChange}
        style={this.props.style}
        tokenSeparators={this.props.tokenSeparators}
      >
        {data && data.map(d => <Option key={d.key} value={d.key}>{d.label}</Option>)}
      </Select>
    );
  }
}


export default RemoteSelect;

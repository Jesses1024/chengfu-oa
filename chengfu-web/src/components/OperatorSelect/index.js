import React, { Component } from 'react';
import { Select } from 'antd';
import request from '../../utils/request';

const userFetcher = () => request('/api/sys/users').then(res => res.list);

class OperatorSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
    };
  }

  componentDidMount() {
    userFetcher().then((res) => {
      this.setState({ userData: res });
    });
  }

  handleSelect = (v) => {
    this.props.onChange(v);
  }

  renderSelectChildren = () => {
    const children = [];
    const { userData } = this.state;
    userData.forEach((i) => {
      children.push(
        <Select.Option key={i.fullname} value={i.fullName}>{i.fullName}</Select.Option>
      );
    });
    return children;
  }

  render() {
    return (
      <Select
        value={this.props.value}
        style={{ width: '100%' }}
        onSelect={this.handleSelect}
      >
        {this.renderSelectChildren()}
      </Select>
    );
  }
}

export default OperatorSelect;

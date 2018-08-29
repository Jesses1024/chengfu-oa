import React, { Component } from 'react';
import { Modal } from 'antd';

class index extends Component {
  render() {
    return (
      <Modal maskClosable={false} {...this.props} destroyOnClose />
    );
  }
}

export default index;

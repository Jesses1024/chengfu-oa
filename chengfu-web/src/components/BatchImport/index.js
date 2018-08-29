import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Button, message } from 'antd';

export default class BatchImport extends Component {
  static defaultProps = {
    url: null,
    icon: 'upload',
    text: '导入',
    btnType: 'primary',
    accept: '.xls,.xlsx',
  }
  static propsType = {
    url: PropTypes.string.isRequired,
    icon: PropTypes.string,
    text: PropTypes.string,
    btnType: PropTypes.string,
    accept: PropTypes.string,
  }

  loadings = {}

  handleUpload = (info) => {
    if (info.file.status === 'uploading') {
      if (!this.loadings[info.file.uid]) {
        message.destroy();
        this.loadings[info.file.uid] = true;
        message.loading('正在上传', 0);
      }
    } else if (info.file.status === 'done') {
      const { originFileObj } = info.file;
      message.destroy();
      this.loadings[info.file.uid] = false;
      message.success(`${originFileObj.name} 导入成功`);
      this.props.onChange();
    } else if (info.file.status === 'error') {
      const { response, originFileObj } = info.file;
      message.destroy();
      this.loadings[info.file.uid] = false;
      message.error(`${originFileObj.name} ${response.message}`);
    }
  }

  render() {
    const { text, icon, url, btnType, accept } = this.props;
    const uploadProps = {
      name: 'file',
      action: url,
      showUploadList: false,
      accept,
      onChange: this.handleUpload,
    };
    return (
      <Upload {...uploadProps}>
        <Button type={btnType} icon={icon}>{text}</Button>
      </Upload>
    );
  }
}

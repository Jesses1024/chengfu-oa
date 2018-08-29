import React, { Component } from 'react';
import { Upload, Icon } from 'antd';

const fileToArray = (arr) => {
  if (arr && arr.length > 0) {
    return arr.map(item => ({
      uid: item,
      name: item,
      status: 'done',
      url: `/api/upload/${item}`,
    }));
  }
  return [];
};

export default class ContractUploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: fileToArray(props.value),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({ fileList: fileToArray(nextProps.value) });
    }
  }

  handleFileChange = (info) => {
    const { fileList } = info;
    const files = fileList.map(i => (i.originFileObj ? i.originFileObj.name : i.name));
    this.props.onChange(files);
  }

  render() {
    const updateProps = {
      action: '/api/upload',
      onChange: this.handleFileChange,
      multiple: true,
    };

    return (
      <Upload {...updateProps} fileList={this.state.fileList}>
        {!this.props.isHideUpload && (
          <a>
            <Icon type="upload" /> 上传文件
          </a>
        )}
      </Upload>
    );
  }
}

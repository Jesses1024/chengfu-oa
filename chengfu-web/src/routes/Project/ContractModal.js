import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Upload, Icon, Popconfirm, Input, message, Badge, Popover } from 'antd';
import Modal from '../../components/Modal';

const { TextArea } = Input;

const statusTextMap = {
  preReview: '预览',
  preAudit: '待审核',
  aduited: '已通过',
  rejected: '未通过',
};

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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


@connect(({ projectDetail }) => ({
  projectDetail,
}))
@Form.create()
class ContractModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false,
      isShowDescription: false,
      contractRejectDescription: null,
      fileList: fileToArray(props.list) || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const { data: { attachment } } = nextProps.projectDetail;
      this.setState({
        fileList: fileToArray(attachment) || [],
        isShowDescription: false,
      });
    }
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  toggleEditStatus = () => {
    this.setState({ isEdit: !this.state.isEdit });
  }

  save = () => {
    const { data = {} } = this.props.projectDetail;
    const { fileList = [] } = this.state;
    const filteNames = fileList.map(i => i.name);
    this.props.dispatch({
      type: 'projectDetail/saveContract',
      payload: { ...data, attachment: filteNames, contractAuditStatus: 'preReview' },
    });
    this.toggleEditStatus();
    this.toggleModal();
  }

  handleTrial = () => {
    const { data = {} } = this.props.projectDetail;
    this.props.dispatch({
      type: 'projectDetail/save',
      payload: { ...data, contractAuditStatus: 'preAudit' },
    });
    this.toggleModal();
  }

  handleChange = ({ fileList }) => {
    const files = fileList.map(i => (i.originFileObj ? i.originFileObj.name : i.name));
    this.setState({ fileList: fileToArray(files) });
  };

  handleAbout = () => {
    const { data = {} } = this.props.projectDetail;
    this.props.dispatch({
      type: 'projectDetail/save',
      payload: { ...data, contractAuditStatus: 'aduited' },
    });
    this.toggleModal();
  }

  handleReject = () => {
    const { data = {} } = this.props.projectDetail;
    const { contractRejectDescription } = this.state;
    if (!contractRejectDescription) {
      message.error('请填写驳回原因');
      return this.setState({ isShowDescription: true });
    }
    this.props.dispatch({
      type: 'projectDetail/save',
      payload: { ...data, contractAuditStatus: 'rejected', contractRejectDescription },
    });
    this.toggleModal();
  }

  renderFooter = () => {
    const { data = {} } = this.props.projectDetail;
    const { contractAuditStatus } = data;
    if (!contractAuditStatus || contractAuditStatus === 'preReview' || contractAuditStatus === 'rejected') {
      const btn = [];
      if (this.state.isEdit) {
        btn.push(
          <Button onClick={this.toggleEditStatus}>取消</Button>,
          <Button type="primary" onClick={this.save}>保存</Button>,
        );
      } else {
        btn.push(
          <Button onClick={this.toggleModal}>关闭</Button>,
          <Button style={{ marginRight: 8 }} onClick={this.toggleEditStatus}>编辑</Button>,
          contractAuditStatus === 'preReview' && (
            <Popconfirm title="您确定要提审吗？" okText="是" cancelText="否" onConfirm={this.handleTrial}>
              <Button type="primary">提审</Button>,
            </Popconfirm>
          )
        );
      }
      return btn;
    } else if (contractAuditStatus === 'preAudit') {
      return [
        <Button style={{ marginRight: 8 }} onClick={this.toggleModal}>关闭</Button>,
        <Popconfirm title="您确定要驳回吗？" okText="是" cancelText="否" onConfirm={this.handleReject}>
          <Button style={{ marginRight: 8 }} type="danger">驳回</Button>,
        </Popconfirm>,
        <Popconfirm title="您确定要通过吗？" okText="是" cancelText="否" onConfirm={this.handleAbout}>
          <Button type="primary">通过</Button>,
        </Popconfirm>,
      ];
    } else {
      return [
        <Button onClick={this.toggleModal}>关闭</Button>,
      ];
    }
  }

  renderRejectModalTitle = (data) => {
    if (!data.contractAuditStatus) {
      return '合同信息';
    }
    if (data.contractAuditStatus === 'rejected') {
      return (
        <p>
          合同信息（
          <Popover title="驳回理由" content={<pre style={{ width: '300px' }}>{data.contractRejectDescription || '-'}</pre>}>
            <a>{statusTextMap[data.contractAuditStatus]}</a>
          </Popover>
          ）
        </p>
      );
    }
    return statusTextMap[data.contractAuditStatus];
  }

  render() {
    const { data = {} } = this.props.projectDetail;
    return (
      <Fragment>
        {data.contractAuditStatus === 'preAudit' ? (
          <Button onClick={this.toggleModal}>
            <Badge dot>
              合同
            </Badge>
          </Button>
        ) : (
          <Button onClick={this.toggleModal}>合同</Button>
          )}
        <Modal
          title={this.renderRejectModalTitle(data)}
          visible={this.state.visible}
          onCancel={this.toggleModal}
          onOk={this.handleSubmit}
          footer={this.renderFooter()}
        >
          <Upload
            accept="*"
            action="/api/upload"
            // listType="picture-card"
            fileList={this.state.fileList}
            onChange={this.handleChange}
          >
            {this.state.isEdit && (
              <Button>
                <Icon type="upload" /> 上传
              </Button>
            )}
          </Upload>
          {this.state.isShowDescription && (
            <Form.Item
              {...formItemLayout}
              label="驳回原因"
              style={{ marginTop: 16 }}
            >
              <TextArea
                defaultValue={data.contractRejectDescription || ''}
                rows={4}
                placeholder="请填写驳回原因（必填）"
                onChange={v => this.setState({ contractRejectDescription: v })}
              />
            </Form.Item>
          )}
        </Modal>
      </Fragment>
    );
  }
}

export default ContractModal;

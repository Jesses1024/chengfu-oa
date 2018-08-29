import React, { Component } from 'react';
import { Input, Form, Button } from 'antd';
import Modal from '../Modal';

const { TextArea } = Input;

@Form.create()
class StopModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toogleStopModal();
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleStopSubmit(values.description);
        this.toogleModal();
      }
    });
  }

  toogleModal = () => {
    this.setState({ visible: !this.state.visible }, () => {
      this.props.form.resetFields();
    });
  }

  render() {
    const { title = '终止' } = this.props;
    const { getFieldDecorator } = this.props.form;
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
    return (
      <span>
        <Button style={{ marginRight: 8 }} type="danger" onClick={this.toogleModal}>{title}</Button>
        <Modal
          title={`状态更改为：${title}`}
          visible={this.state.visible}
          onCancel={this.toogleModal}
          onOk={() => this.handleSubmit()}
          okText="确定"
          cancelText="取消"
        >
          <p style={{ textAlign: 'center' }}>您确定要{title}该任务吗？</p>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              {...formItemLayout}
              label="原因"
            >
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入原因' }],
              })(
                <TextArea rows={4} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default StopModal;

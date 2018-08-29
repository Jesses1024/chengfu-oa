import React, { Component } from 'react';
import { Form, Input } from 'antd';
import Modal from '../Modal';

@Form.create()
class index extends Component {
  state = {
    confirmDirty: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.props.form.resetFields();
    }
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('您两次输入的账号密码不一致');
    } else {
      callback();
    }
  }

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleOk(values);
      }
    });
  }


  render() {
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

    const { confirmLoading, toogelModule, visible } = this.props;

    return (
      <Modal
        title="修改密码"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => toogelModule(false)}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="原密码"
          >
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入原密码!' },
                { pattern: /^[a-zA-Z0-9]{4,11}$/, message: '请输入4-11位数字和字母组成的密码' },
              ],
            })(
              <Input type="password" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="新密码"
          >
            {getFieldDecorator('newPassword', {
              rules: [
                { required: true, message: '请输入新密码!' },
                { validator: this.validateToNextPassword },
                { pattern: /^[a-zA-Z0-9]{4,11}$/, message: '请输入4-11位数字和字母组成的密码' }],
            })(
              <Input type="password" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="确认密码"
          >
            {getFieldDecorator('confirmPassword', {
              rules: [
                { required: true, message: '请输入再次输入密码!' },
                { validator: this.compareToFirstPassword },
              ],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default index;

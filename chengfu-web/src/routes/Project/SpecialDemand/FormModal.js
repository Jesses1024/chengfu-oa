import React, { Component } from 'react';
import moment from 'moment';
import { Form, Input } from 'antd';
import Modal from '../../../components/Modal';

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

const { TextArea } = Input;
@Form.create()
export default class FormModal extends Component {
  handleSubmit = () => {
    const { currentItem: data = {}, currentUser, form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({
          ...data,
          ...values,
          auditStatus: data ? data.auditStatus : 'preAudit',
          createdBy: data ? data.createdBy : currentUser && currentUser.username,
          applyDate: moment(),
        });
      }
    });
  }

  render() {
    const { form, currentUser, currentItem: data = {} } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="特殊需求"
        width={800}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="申请人"
          >
            <span>{data && data.id ? data.createdBy : currentUser && currentUser.username}</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="申请事由"
          >
            {getFieldDecorator('applyReason', {
              initialValue: data && data.applyReason,
              rules: [
                { required: true, message: '请填写申请事由' },
              ],
            })(
              <Input placeholder="请选择" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="详细说明"
          >
            {getFieldDecorator('applyDetail', {
              initialValue: data && data.applyDetail,
              rules: [
                { required: true, message: '请输入详细说明' },
              ],
            })(
              <TextArea rows={4} placeholder="请输入" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

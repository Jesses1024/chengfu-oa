import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Input, DatePicker, InputNumber } from 'antd';
import Modal from '../../../components/Modal';

const { TextArea } = Input;

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

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
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
          createdBy: data ? data.createdBy : currentUser && currentUser.username,
        });
      }
    });
  }
  render() {
    const { form, currentUser, currentItem: data = {} } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={data ? '询价编辑' : '询价新增'}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="询价人"
          >
            <span>{data ? data.createdBy : currentUser && currentUser.username}</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="询价时间"
          >
            {getFieldDecorator('askDate', {
              initialValue: data && moment(data.askDate),
              rules: [
                { required: true, message: '请选择询价时间' },
              ],
            })(
              <DatePicker style={{ width: '100%' }} placeholder="请选择" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="供应商"
          >
            {getFieldDecorator('supplier', {
              initialValue: data && data.supplier,
              rules: [
                { required: true, message: '请输入供应商' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="货物"
          >
            {getFieldDecorator('goodsName', {
              initialValue: data && data.goodsName,
              rules: [
                { required: true, message: '请选择货物' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="型号规格"
          >
            {getFieldDecorator('modelNumber', {
              initialValue: data && data.modelNumber,
              rules: [
                { required: true, message: '请填写型号规格' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="单位"
          >
            {getFieldDecorator('goodsUnit', {
              initialValue: data && data.goodsUnit,
              rules: [
                { required: true, message: '请填写单位' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="数量"
          >
            {getFieldDecorator('number', {
              initialValue: (data && data.number) || 0,
              rules: [
                { required: true, message: '请填写数量' },
              ],
            })(
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="价钱"
          >
            {getFieldDecorator('price', {
              initialValue: (data && data.price) || 0,
              rules: [
                { required: true, message: '请填写价钱' },
              ],
            })(
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('description', {
              initialValue: data && data.description,
            })(
              <TextArea rows={4} placeholder="请输入" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

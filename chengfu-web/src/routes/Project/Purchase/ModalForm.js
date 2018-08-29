import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, InputNumber, DatePicker } from 'antd';
import Modal from '../../../components/Modal';
import RemoteAutoComplete from '../../../components/RemoteAutoComplete';
import request from '../../../utils/request';

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

const contactsFetcher = v => request(`/api/contact/query?filter=${v}&type=supplier`)
  .then(res => res.content.map(i => ({
    key: i.unitName,
    label: i.unitName,
  })));

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
@Form.create()
class ModalForm extends Component {
  handleSubmit = () => {
    const { currentItem: data = {}, form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit({
          ...data,
          ...values,
          auditStatus: 'preAudit',
          purchaseStatus: 'unArrive',
          purchaseRejectDescription: '',
          applyPurchaseDate: moment(),
        });
      }
    });
  }

  render() {
    const { currentItem: data = {}, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="采购单"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="货物"
          >
            {getFieldDecorator('goodsName', {
              initialValue: data && data.goodsName,
              rules: [
                { required: true, message: '请输入货物' },
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
              <Input placeholder="请填写型号规格" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="单位"
          >
            {getFieldDecorator('goodsUnit', {
              initialValue: data && data.goodsUnit,
              rules: [
                { required: true, message: '请输入单位' },
              ],
            })(
              <Input placeholder="请选择" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="数量"
          >
            {getFieldDecorator('number', {
              initialValue: (data && data.number) || 0,
              rules: [
                { required: true, message: '请输入数量' },
              ],
            })(
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
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
              <RemoteAutoComplete
                fetcher={contactsFetcher}
                placeholder="请输入"
              />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="需求日期"
          >
            {getFieldDecorator('needDate', {
              initialValue: data && data.needDate ? moment(data.needDate) : null,
              rules: [
                { required: true, message: '请选择需求日期' },
              ],
            })(
              <DatePicker style={{ width: '100%' }} placeholder="请填写" />
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

export default ModalForm;

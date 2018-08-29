import React, { Component } from 'react';
import { Form, InputNumber } from 'antd';
import Modal from '../../components/Modal';
import RemoteSelect from '../../components/RemoteSelect';
import request from '../../utils/request';

const FormItem = Form.Item;

const warehouseFetcher = value => request(`/api/inventory/warehouses?filter=${value}`)
  .then(res => res.list);

const goodsFetcher = value => request(`/api/sys/goods?filter=${value}`)
  .then(res => res.list);

@Form.create()
class InOutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.form.resetFields();
        this.props.handleInOutSubmit({ ...values, add: this.props.status === 'in' });
      }
    });
  }

  handelCancel = () => {
    this.props.form.resetFields();
    this.props.toogleInOutModal();
  }

  render() {
    const { form: { getFieldDecorator }, goods, warehouse } = this.props;
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
      <Modal
        title={this.props.status === 'in' ? '直接入库' : '直接出库'}
        onOk={this.handleSubmit}
        onCancel={this.handelCancel}
        visible={this.props.visible}
        okText="提交"
        cancelText="取消"
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="仓库"
          >
            {getFieldDecorator('warehouse', {
              initialValue: warehouse || { key: '', label: '' },
              rules: [{
                required: true,
                message: '请选择仓库',
              }],
            })(
              <RemoteSelect
                placeholder="请选择仓库"
                fetcher={warehouseFetcher}
                disabled={this.props.status === 'out'}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="货物信息"
          >
            {getFieldDecorator('goods', {
              initialValue: goods || { key: '', label: '' },
              rules: [{
                required: true, message: '请选择货物',
              }],
            })(
              <RemoteSelect
                placeholder="请选择货物"
                fetcher={goodsFetcher}
                disabled={this.props.status === 'out'}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="货物数量"
          >
            {getFieldDecorator('number', {
              initialValue: 0,
              rules: [{
                required: true, message: '请填写货物数量',
              }],
            })(
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default InOutModal;

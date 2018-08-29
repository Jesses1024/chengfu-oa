import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, InputNumber, Button } from 'antd';
import Modal from '../../components/Modal';
import RemoteSelect from '../../components/RemoteSelect';

import request from '../../utils/request';

import ItemFormTable from './ItemFormTable';

const FormItem = Form.Item;

const warehouseFetcher = value => request(`/api/inventory/warehouses?filter=${value}`)
  .then(res => res.list);

const goodsFetcher = value => request(`/api/sys/goods?filter=${value}`)
  .then(res => res.list);

@connect(({ inventoryList }) => ({
  inventoryList,
}))
@Form.create()
class PickingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toogleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.form.resetFields();
        this.props.dispatch({
          type: 'inventoryList/batchInventoryChange',
          payload: { ...values, add: true },
        });
        this.toogleModal();
      }
    });
  }

  render() {
    const { form: { getFieldDecorator }, goods, warehouse } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ visible: !this.state.visible })}
        >
          配货
        </Button>
        <Modal
          title="配货"
          width={800}
          visible={this.state.visible}
          onCancel={this.toogleModal}
          onOk={() => this.handleSubmit()}
          okText="提交"
          cancelText="取消"
        >
          <Form onSubmit={this.handleSubmit}>
            <h3>配货出库</h3>
            <FormItem >
              {getFieldDecorator('changes', {
                initialValue: [],
                rules: [{
                  required: true, message: '请填写',
                }],
              })(
                <ItemFormTable />
              )}
            </FormItem>
            <h3>配货入库</h3>
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
                  disabled={Boolean(warehouse)}
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
                  disabled={Boolean(goods)}
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
      </span>
    );
  }
}

export default PickingModal;

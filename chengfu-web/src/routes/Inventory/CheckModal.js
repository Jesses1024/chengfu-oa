import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, InputNumber, Button } from 'antd';
import Modal from '../../components/Modal';
import RemoteSelect from '../../components/RemoteSelect';
import request from '../../utils/request';
import { formatNum } from '../../utils/utils';

const FormItem = Form.Item;

const warehouseFetcher = value => request(`/api/inventory/warehouses?filter=${value}`)
  .then(res => res.list);

const goodsFetcher = value => request(`/api/sys/goods?filter=${value}`)
  .then(res => res.list);

@connect(({ inventoryList }) => ({
  inventoryList,
}))
@Form.create()
class CheckModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      number: 0,
    };
  }

  handleNum = (item, type) => {
    this.props.form.setFieldsValue({ [type]: item });
    const warehouse = this.props.form.getFieldValue('warehouse');
    const goods = this.props.form.getFieldValue('goods');
    if ((warehouse && warehouse.key) && (goods && goods.key)) {
      request(`/api/inventory/${warehouse.key}/${goods.key}`)
        .then((res) => {
          if (res && res.number) {
            this.setState({ number: res.number });
          } else {
            this.setState({ number: 0 });
          }
        });
    }
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const num = Math.abs(values.number - this.state.number);
      if (!err) {
        this.props.form.resetFields();
        this.props.dispatch({
          type: 'inventoryList/checkInventory',
          payload: { ...values, add: values.number > this.state.number, number: num },
        });
        this.toogleModal();
      }
    });
  }

  toogleModal = () => {
    if (this.state.visible) {
      this.setState({ number: 0 });
    }
    this.setState({ visible: !this.state.visible });
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
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ visible: !this.state.visible })}
        >
          盘点
        </Button>
        <Modal
          title="盘点"
          onOk={() => this.handleSubmit()}
          onCancel={this.toogleModal}
          visible={this.state.visible}
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
                  onChange={item => this.handleNum(item, 'warehouse')}
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
                  onChange={item => this.handleNum(item, 'goods')}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="货物数量"
            >
              <span>{formatNum(this.state.number)}</span>
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

export default CheckModal;

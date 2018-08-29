import React, { Component } from 'react';
import moment from 'moment';
import { Form, Radio, DatePicker } from 'antd';
import Modal from '../../../components/Modal';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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

@Form.create()
class ArrivedModal extends Component {
  handleSubmit = () => {
    const { data = {}, form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      const p = { ...values };
      delete p.type;
      if (!err) {
        this.props.onSubmit({
          ...data,
          ...p,
          purchaseStatus: values.type === 'planing' ? 'unArrive' : 'arrived',
        });
      }
    });
  }
  render() {
    const { data = {}, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const type = getFieldValue('type');
    return (
      <Modal
        title="采购到货"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <FormItem
          style={{ textAlign: 'center' }}
          label=""
        >
          {getFieldDecorator('type', {
            initialValue: data && data.expectArriveDate ? 'actual' : 'planing',
          })(
            <RadioGroup>
              <Radio value="planing">计划</Radio>
              <Radio value="actual">实际</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="计划到货时间"
        >
          {getFieldDecorator('expectArriveDate', {
            initialValue: data && data.expectArriveDate ? moment(data.expectArriveDate) : null,
          })(
            <DatePicker style={{ width: '100%' }} placeholder="请选择" />
          )}
        </FormItem>
        {type === 'actual' && (
          <FormItem
            {...formItemLayout}
            label="实际到货时间"
          >
            {getFieldDecorator('actualArriveDate', {
              rules: [{
                required: type === 'actual', message: '请选择实际离泊时间',
              }],
            })(
              <DatePicker style={{ width: '100%' }} placeholder="请选择" />
            )}
          </FormItem>
        )}
      </Modal>
    );
  }
}

export default ArrivedModal;

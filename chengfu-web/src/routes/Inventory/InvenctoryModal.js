import React, { Component } from 'react';
import { Form, Input } from 'antd';
import Modal from '../../components/Modal';

const FormItem = Form.Item;
@Form.create()
class InvenctoryModal extends Component {
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { data } = this.props;
      if (!err) {
        this.props.handleOk({ ...data, ...values });
      }
    });
  }

  render() {
    const { data, visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Modal
        title="修改上下限"
        visible={visible}
        onOk={this.handleOk}
        onCancel={() => this.props.handleCancel()}
      >
        <Form
          onSubmit={this.handleSubmit}
          style={{ marginTop: 8 }}
        >
          <FormItem
            {...formItemLayout}
            label="库存上限"
          >
            {getFieldDecorator('upperLimit', {
              initialValue: data.upperLimit,
              rules: [
                { required: true, message: '请填写库存上限' },
              ],
            })(
              <Input placeholder="请输入库存上限" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="库存下限"
          >
            {getFieldDecorator('lowerLimit', {
              initialValue: data.lowerLimit,
              rules: [
                { required: true, message: '请填写库存下限' },
              ],
            })(
              <Input placeholder="请输入库存下限" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default InvenctoryModal;

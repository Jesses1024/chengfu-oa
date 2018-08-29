import React, { Component } from 'react';
import { Form, Input } from 'antd';
import Modal from '../Modal';

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

@Form.create()
class StopedModal extends Component {
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      const { descript } = values;
      if (!err) {
        this.props.onSubmit(descript);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.props.title || '状态修改为已作废'}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="备注说明"
          >
            {getFieldDecorator('descript', {
              rules: [{ required: true, message: '请输入说明' }],
            })(
              <TextArea rows={4} placeholder="请填写备注说明" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default StopedModal;

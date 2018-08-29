import React, { Component, Fragment } from 'react';
import { Button, Form, Select, Input } from 'antd';
import Modal from '../../components/Modal';

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
class StopedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.stopedSubmit(values);
      }
    });
    this.toggleModal();
  }

  render() {
    const { title = '状态改为终止', linkText = '终止', btnType = 'danger', isLink, showType, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Fragment>
        {isLink ? (
          <a style={this.props.btnStyle} onClick={this.toggleModal}>{linkText}</a>
        ) : (
          <Button
            style={this.props.btnStyle}
            type={btnType}
            onClick={this.toggleModal}
          >{linkText}
          </Button>
          )}
        <Modal
          title={title}
          visible={this.state.visible}
          onCancel={this.toggleModal}
          onOk={this.handleSubmit}
        >
          <Form>
            {showType && (
              <Form.Item
                {...formItemLayout}
                label="终止类型"
              >
                {getFieldDecorator('invaildType', {
                  initialValue: 'noWish',
                  rules: [
                    { required: showType, message: '请选择终止类型' },
                  ],
                })(
                  <Select placeholder="请选择终止类型">
                    <Select.Option value="noWish">对方无购买意愿</Select.Option>
                    <Select.Option value="against">同行比价</Select.Option>
                    <Select.Option value="highPrice">认为价格偏高</Select.Option>
                    <Select.Option value="dissatisfy">无法满足对方需求</Select.Option>
                    <Select.Option value="lowProfit">利润低或者无利润</Select.Option>
                    <Select.Option value="shortPeriod">工期不能满足</Select.Option>
                    <Select.Option value="other">其他</Select.Option>
                  </Select>
                )}
              </Form.Item>
            )}
            <Form.Item
              {...formItemLayout}
              label="详细说明"
            >
              {getFieldDecorator('invaildReason', {
                rules: [
                  { required: true, message: '请填写详细说明' },
                ],
              })(
                <TextArea rows={4} placeholder="请填写详细说明" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default StopedModal;

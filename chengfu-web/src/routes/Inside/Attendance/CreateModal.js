import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, DatePicker, Button } from 'antd';
import Modal from '../../../components/Modal';

const { MonthPicker } = DatePicker;

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
@connect(({ attendanceList }) => ({
  attendanceList,
}))
@Form.create()
class CreateModal extends Component {
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
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const { attendanceDate } = value;
        this.props.dispatch({
          type: 'attendanceList/saveInfo',
          payload: {
            ...value,
            name: `${moment(attendanceDate).format('YYYY-MM')} - 考勤记录`,
            status: 'preview',
          },
        });
        this.toggleModal();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <Button type="primary" onClick={this.toggleModal}>新增</Button>
        <Modal
          title="新增"
          visible={this.state.visible}
          onCancel={this.toggleModal}
          onOk={this.handleSubmit}
        >
          <Form>
            <Form.Item
              {...formItemLayout}
              label="月份"
            >
              {getFieldDecorator('attendanceDate', {
                rules: [
                  { required: true, message: '请填写月份' },
                ],
              })(
                <MonthPicker style={{ width: '100%' }} placeholder="请选择月份" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default CreateModal;

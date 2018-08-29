import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, DatePicker } from 'antd';
import Modal from '../../../components/Modal';
import RemoteSelect from '../../../components/RemoteSelect';
import ContractUploadFile from '../../../components/ContractUploadFile';
import request from '../../../utils/request';

const userFetcher = v => request(`/api/users/query?filter=${v}`)
  .then(res => res.content.map(i => ({
    key: i.label,
    label: i.label,
  })));

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

const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ user: { currentUser } }) => ({
  currentUser,
}))
@Form.create()
class ModalForm extends Component {
  handleSubmit = () => {
    const { currentUser, currentItem: data = {}, form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      const { date } = values;
      if (!err) {
        const p = { ...values };
        delete p.date;
        const startDate = moment(date[0]).format('YYYY-MM-DD');
        const endDate = moment(date[0]).format('YYYY-MM-DD');
        this.props.onSubmit(
          {
            ...data,
            ...p,
            startDate,
            endDate,
            createdBy: data ? data.createdBy : currentUser && currentUser.username,
          }
        );
      }
    });
  }

  render() {
    const { currentUser, currentItem: data = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const date = [];
    if (data && data.startDate) {
      date.push(moment(data.startDate), moment(data.endDate));
    }
    return (
      <Modal
        title="拜访记录"
        width={800}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="姓名"
          >
            <span>{data && data.id ? data.createdBy : currentUser && currentUser.username}</span>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="拜访时间"
          >
            {getFieldDecorator('date', {
              initialValue: date,
              rules: [
                { required: true, message: '请选择拜访时间' },
              ],
            })(
              <RangePicker style={{ width: '100%' }} placeholder={['请选择', '请选择']} />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="随行人员"
          >
            {getFieldDecorator('followUser', {
              initialValue: data && data.followUser,
              rules: [
                { required: true, message: '请选择随行人员' },
              ],
            })(
              <RemoteSelect
                multiple
                labelInValue={false}
                fetcher={userFetcher}
                placeholder="请选择"
              />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="拜访详情"
          >
            {getFieldDecorator('visitDetail', {
              initialValue: data && data.visitDetail,
              rules: [
                { required: true, message: '请输入拜访详情' },
              ],
            })(
              <TextArea rows={4} placeholder="请输入" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="附件"
          >
            {getFieldDecorator('attachment', {
              initialValue: data && data.attachment,
            })(
              <ContractUploadFile />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ModalForm;

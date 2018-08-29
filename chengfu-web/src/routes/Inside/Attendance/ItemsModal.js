import React, { Component } from 'react';
import { Form, InputNumber, Input } from 'antd';
import RemoteSelect from '../../../components/RemoteSelect';
import Modal from '../../../components/Modal';
import request from '../../../utils/request';

const staffFetcher = v => request(`/api/employees/query?filter=${v}&status=accept&status=leaved&isDirectlyJoin=true`)
  .then(res => res.content.map(i => ({
    key: `${i.jobNumber}-${i.name}-${i.deptName}`,
    label: `${i.jobNumber}-${i.name}-${i.deptName}`,
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
@Form.create()
class ItemsModal extends Component {
  handleSubmit = () => {
    const { data = {} } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { staff } = values;
        const sf = staff.split('-');
        const p = { ...values };
        delete p.staff;
        this.props.onSubmit({
          ...data,
          ...p,
          name: sf[1],
          jobNumber: sf[0],
          deptName: sf[2],
        });
      }
    });
  };
  render() {
    const { data = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const staff = data && data.id ? `${data.jobNumber}-${data.name}-${data.deptName}` : null;
    return (
      <Modal
        title="考勤记录明细"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="员工"
          >
            {getFieldDecorator('staff', {
              initialValue: staff,
              rules: [
                { required: true, message: '请选择员工' },
              ],
            })(
              <RemoteSelect
                labelInValue={false}
                fetcher={staffFetcher}
                placeholder="请选择员工"
              />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="标准工作时数"
          >
            {getFieldDecorator('normalWorkHours', {
              initialValue: (data && data.normalWorkHours) || 0,
              rules: [{
                required: true,
                message: '请填写标准工作时数',
              }],
            })(
              <Input style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="实际工作时数"
          >
            {getFieldDecorator('actualWorkHours', {
              initialValue: (data && data.actualWorkHours) || 0,
              rules: [{
                required: true,
                message: '请填写实际工作时数',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写实际工作时数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="迟到次数"
          >
            {getFieldDecorator('lateTimes', {
              initialValue: (data && data.lateTimes) || 0,
              rules: [{
                required: true,
                message: '请填写迟到次数',
              }],
            })(
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写迟到次数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="迟到时长"
          >
            {getFieldDecorator('lateHours', {
              initialValue: (data && data.lateHours) || 0,
              rules: [{
                required: true,
                message: '请填写迟到时长',
              }],
            })(
              <Input style={{ width: '100%' }} />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="早退次数"
          >
            {getFieldDecorator('earlyTimes', {
              initialValue: (data && data.earlyTimes) || 0,
              rules: [{
                required: true,
                message: '请填写早退次数',
              }],
            })(
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写早退次数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="早退时长"
          >
            {getFieldDecorator('earlyHours', {
              initialValue: (data && data.earlyHours) || 0,
              rules: [{
                required: true,
                message: '请填写早退时长',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写早退时长" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="正常加班时长"
          >
            {getFieldDecorator('normalOverHours', {
              initialValue: (data && data.normalOverHours) || 0,
              rules: [{
                required: true,
                message: '请填写正常加班时长',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写正常加班时长" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="特殊加班时长"
          >
            {getFieldDecorator('especialOverHours', {
              initialValue: (data && data.especialOverHours) || 0,
              rules: [{
                required: true,
                message: '请填写特殊加班时长',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写特殊加班时长" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="标准出勤天数"
          >
            {getFieldDecorator('normalOnDutyDays', {
              initialValue: (data && data.normalOnDutyDays) || 0,
              rules: [{
                required: true,
                message: '请填写标准出勤天数',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写标准出勤天数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="实际出勤天数"
          >
            {getFieldDecorator('actualOnDutyDays', {
              initialValue: (data && data.actualOnDutyDays) || 0,
              rules: [{
                required: true,
                message: '请填写实际出勤天数',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写实际出勤天数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="出差天数"
          >
            {getFieldDecorator('travelDays', {
              initialValue: (data && data.travelDays) || 0,
              rules: [{
                required: true,
                message: '请填写出差天数',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写出差天数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="旷工天数"
          >
            {getFieldDecorator('absenteeismDays', {
              initialValue: (data && data.absenteeismDays) || 0,
              rules: [{
                required: true,
                message: '请填写旷工天数',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写旷工天数" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="请假天数"
          >
            {getFieldDecorator('leaveDays', {
              initialValue: (data && data.leaveDays) || 0,
              rules: [{
                required: true,
                message: '请填写请假天数',
              }],
            })(
              <Input style={{ width: '100%' }} placeholder="请填写请假天数" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ItemsModal;

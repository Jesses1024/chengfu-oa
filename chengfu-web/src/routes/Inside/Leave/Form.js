import React, { PureComponent } from 'react';
import qs from 'qs';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, DatePicker } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RemoteSelect from '../../../components/RemoteSelect';
import FormLoading from '../../../components/FormLoading';
import request from '../../../utils/request';

const FormItem = Form.Item;
const { TextArea } = Input;

const staffFetcher = v => request(`/api/employees/query?status=accept&status=leaved&isDirectlyJoin=true&filter=${v}`)
  .then(res => res.content.map(i => ({
    key: `${i.name}-${i.deptName}`,
    label: `${i.name}-${i.deptName}`,
  })));

@connect(({ leaveForm }) => ({
  leaveForm,
}))
@FormLoading({
  isLoading: ({ leaveForm }) => leaveForm.loading,
})
@Form.create()
export default class StaffForm extends PureComponent {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const params = qs.parse(search.substring(1));
    this.state = {
      id: params.id,
    };
  }

  componentDidMount() {
    this.fetchInfo();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'leaveForm/resetData',
    });
  }

  fetchInfo = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'leaveForm/fetch',
      payload: id,
    });
  }

  handleUserNameChange = (v) => { // 用户名字change
    const field = v.split('-');
    const deptName = field[1];
    this.props.form.setFieldsValue({ name: v, deptName });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { leaveForm: { data } } = this.props;
      if (!err) {
        const nameIndex = values.name.indexOf('-') >= 0;
        const p = { ...values, name: nameIndex ? values.name.split('-')[0] : values.name };
        this.props.dispatch({
          type: 'leaveForm/save',
          payload: { ...data, ...p, leaveAuditStatus: data.leaveAuditStatus || 'preReview' },
        });
      }
    });
  }

  render() {
    const { leaveForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { id } = this.state;

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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const deptName = this.props.form.getFieldValue('deptName') || data.deptName;
    return (
      <PageHeaderLayout title={`离职${id ? '编辑' : '新增'}`}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [{ required: true, message: '请选择姓名' }],
              })(
                <RemoteSelect
                  labelInValue={false}
                  fetcher={staffFetcher}
                  placeholder="请选择姓名"
                  onChange={this.handleUserNameChange}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门"
            >
              {getFieldDecorator('deptName', {
                initialValue: data.deptName,
              })(
                <span>{deptName || '-'}</span>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="离职日期">
              {getFieldDecorator('leaveDate', {
                initialValue: data.leaveDate ? moment(data.leaveDate) : null,
                rules: [{ required: true, message: '请选择离职日期' }],
              })(
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="离职原因">
              {getFieldDecorator('leaveReason', {
                initialValue: data.leaveReason,
                rules: [{ required: true, message: '请填写离职原因' }],
              })(
                <TextArea rows={4} placeholder="请填写离职原因" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="部门主管意见">
              {getFieldDecorator('deptLeaderOpinion', {
                initialValue: data.deptLeaderOpinion,
              })(
                <TextArea rows={4} placeholder="请填写部门主管意见" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: '8px' }} type="Default" onClick={() => this.props.dispatch(routerRedux.goBack())}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout >
    );
  }
}

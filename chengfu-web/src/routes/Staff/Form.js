import React, { PureComponent } from 'react';
import qs from 'qs';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Radio, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import RemoteSelect from '../../components/RemoteSelect';
import request from '../../utils/request';
import FormLoading from '../../components/FormLoading';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const groupFetcher = value => request(`/api/groups/query?filter=${value}&isEnabled=true`)
  .then(res => res && res.content.map(i => ({
    key: i.name,
    label: i.name,
  })));

const roleFetcher = value => request(`/api/roles/query?filter=${value}`)
  .then(res => res && res.content.map(i => ({
    key: i.name,
    label: i.name,
  })));

@connect(({ staffForm, user: { currentUser } }) => ({
  staffForm,
  currentUser,
}))
@FormLoading({
  isLoading: ({ staffForm }) => staffForm.loading,
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

  fetchInfo = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'staffForm/fetch',
      payload: id,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { staffForm: { data } } = this.props;
      if (!err) {
        this.props.dispatch({
          type: 'staffForm/save',
          payload: { ...data, ...values, status: 'accept', directlyJoin: true },
        });
      }
    });
  }

  render() {
    const { staffForm: { submitting, data = {} } } = this.props;
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

    return (
      <PageHeaderLayout title={`用户${id ? '编辑' : '新增'}`}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="工号"
            >
              {getFieldDecorator('jobNumber', {
                initialValue: data.jobNumber,
                rules: [
                  { required: true, message: '请填写工号' },
                ],
              })(
                <Input placeholder="请填写工号" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  { required: true, message: '请填写姓名' },
                ],
              })(
                <Input placeholder="请填写姓名" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属部门"
            >
              {getFieldDecorator('deptName', {
                initialValue: data.deptName,
                rules: [{ required: true, message: '请选择所属部门' }],
              })(
                <RemoteSelect
                  labelInValue={false}
                  placeholder="请搜索部门"
                  fetcher={groupFetcher}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="职务"
            >
              {getFieldDecorator('duties', {
                initialValue: data.duties,
                rules: [{ required: true, message: '请选择职务' }],
              })(
                <RemoteSelect labelInValue={false} placeholder="请选择职务" fetcher={roleFetcher} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('gender', {
                initialValue: data.gender || 'male',
                rules: [{ required: true, message: '请选择性别' }],
              })(
                <RadioGroup>
                  <Radio value="male">男</Radio>
                  <Radio value="woman">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="出生年月"
            >
              {getFieldDecorator('birthday', {
                initialValue: data.birthday ? moment(data.birthday) : null,
                rules: [{ required: true, message: '请选择出生年月' }],
              })(
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="籍贯"
            >
              {getFieldDecorator('birthplace', {
                initialValue: data.birthplace,
                rules: [{ required: true, message: '请填写籍贯' }],
              })(
                <Input placeholder="请填写籍贯" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系方式"
            >
              {getFieldDecorator('phoneNumber', {
                initialValue: data.phoneNumber,
                rules: [{ required: true, message: '请填写联系方式' }],
              })(
                <Input placeholder="请填写" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('description', {
                initialValue: data.description,
              })(
                <TextArea rows={4} placeholder="请填写备注" />
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
      </PageHeaderLayout>
    );
  }
}

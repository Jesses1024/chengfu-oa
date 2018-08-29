import React, { PureComponent } from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Radio } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RemoteSelect from '../../../components/RemoteSelect';
import FormLoading from '../../../components/FormLoading';
import request from '../../../utils/request';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const groupFetcher = value => request(`/api/groups/query?filter=${value}&isEnabled=true`)
  .then(res => res && res.content);

const roleFetcher = value => request(`/api/roles/query?filter=${value}`)
  .then(res => res.content);

@connect(({ userForm, user: { currentUser } }) => ({
  userForm,
  currentUser,
}))
@FormLoading({
  isLoading: ({ userForm }) => userForm.loading,
})
@Form.create()
export default class UserDetail extends PureComponent {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const params = qs.parse(search.substring(1));
    this.state = {
      id: params.id,
      isEdit: Boolean(params.id),
    };
  }

  componentDidMount() {
    this.fetchInfo();
  }

  fetchInfo = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'userForm/fetch',
      payload: id,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { userForm: { data } } = this.props;
      const { isEdit } = this.state;
      if (!err) {
        this.props.dispatch({
          type: 'userForm/save',
          payload: { ...data, ...values, isEdit },
        });
      }
    });
  }

  render() {
    const { userForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
              label="登录账号"
            >
              {getFieldDecorator('userName', {
                initialValue: data.userName,
                rules: [
                  { required: true, message: '请填写登录账号' },
                  { max: 20, message: '账号不得超过20位' },
                  { min: 2, message: '账号不得小于2位' },
                ],
              })(
                <Input disabled={Boolean(id)} placeholder="请输入登录账号，一经设定无法修改" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="登录密码"
            >
              {getFieldDecorator('password', {
                rules: [
                  { required: !id, message: '请填写登录密码' },
                  { pattern: /^[a-zA-Z0-9]{4,20}$/, message: '请输入4-20位数字和字母组成的密码' },
                ],
              })(
                <Input placeholder={id ? '输入密码将会重置该员工登录密码' : '请输入该员工的登录密码'} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="员工姓名"
            >
              {getFieldDecorator('displayName', {
                initialValue: data.displayName,
                rules: [
                  { required: true, message: '请输入用户名' },
                  { max: 32, message: '请输入小于32位的员工姓名' },
                ],
              })(
                <Input placeholder="请输入用户名" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属部门"
            >
              {getFieldDecorator('group', {
                initialValue: data.group,
                rules: [{ required: true, message: '请选择所属部门' }],
              })(
                <RemoteSelect
                  placeholder="请搜索部门"
                  fetcher={groupFetcher}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户类型"
            >
              {getFieldDecorator('manager', {
                initialValue: data.manager || false,
              })(
                <RadioGroup>
                  <Radio value={false}>普通用户</Radio>
                  <Radio value>管理员</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {!getFieldValue('manager') && (
              <FormItem
                {...formItemLayout}
                label="岗位角色"
              >
                {getFieldDecorator('role', {
                  initialValue: data.role,
                  rules: [{ required: true, message: '请选择岗位角色' }],
                })(
                  <RemoteSelect placeholder="请搜索角色" fetcher={roleFetcher} />
                )}
              </FormItem>
            )}
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

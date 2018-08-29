import React, { Component } from 'react';
import qs from 'qs';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input, Button, Card, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FormLoading from '../../../components/FormLoading';
import RemoteSelect from '../../../components/RemoteSelect';
import request from '../../../utils/request';

const FormItem = Form.Item;
const { TextArea } = Input;

const groupFetcher = value => request(`/api/groups/query?filter=${value}&isEnabled=true`)
  .then(res => res && res.content);

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

@connect(({ groupForm }) => ({
  groupForm,
}))
@Form.create()
@FormLoading({
  isLoading: ({ groupForm }) => groupForm.loading,
})
class groupForm extends Component {
  constructor(props) {
    super(props);
    const { search } = props.location;
    const params = qs.parse(search.substring(1)) || {};
    this.state = {
      id: params.id,
      help: null,
      validateStatus: null,
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'groupForm/fetch',
      payload: id,
    });
  }

  handleDeptChange = (v) => {
    const { id } = this.state;
    if (id) {
      if (Number(id) === (v && v.key)) {
        this.setState({ help: '上级部门不允许选择自身', validateStatus: 'error' });
      } else {
        this.setState({ help: null, validateStatus: null });
      }
    }
    this.props.form.setFieldsValue({ parent: v });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = this.state;
    const { groupForm: { data = {} } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (Number(id) === (values.parent && values.parent.key)) {
          return message.error('所属部门不能选择自身');
        }
        this.props.dispatch({
          type: 'groupForm/save',
          payload: { ...data, ...values },
        });
      }
    });
  }

  render() {
    const { groupForm: { data = {}, submitting } } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout title={`部门${data.id ? '编辑' : '新增'}`}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [{
                  required: true, message: '请填写名称',
                }],
              })(
                <Input placeholder="请填写名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属部门"
              validateStatus={this.state.validateStatus}
              help={this.state.help}
            >
              {getFieldDecorator('parent', {
                initialValue: data.parent,
                rules: [{
                  required: true, message: '请选择部门',
                }],
              })(
                <RemoteSelect
                  placeholder="请选择"
                  fetcher={groupFetcher}
                  onChange={this.handleDeptChange}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('description', {
                initialValue: data.description,
              })(
                <TextArea rows={4} placeholder="请填写" />
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

export default groupForm;

import React, { Component, Fragment } from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Radio } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FormLoading from '../../components/FormLoading';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

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

@connect(({ contactForm }) => ({
  contactForm,
}))
@FormLoading({
  isLoading: ({ contactForm }) => contactForm.loading,
})
@Form.create()
export default class ContactsForm extends Component {
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
      type: 'contactForm/fetch',
      payload: id,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { contactForm: { data } } = this.props;
      if (!err) {
        this.props.dispatch({
          type: 'contactForm/save',
          payload: { ...data, ...values, ifUsing: data.ifUsing || true },
        });
      }
    });
  }
  render() {
    const { contactForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { id } = this.state;
    const type = getFieldValue('type');
    return (
      <PageHeaderLayout title={`往来单位${id ? '编辑' : '新增'}`}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('unitName', {
                initialValue: data.unitName,
                rules: [
                  { required: true, message: '请输入名称' },
                ],
              })(
                <Input placeholder="请输入名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('type', {
                initialValue: data.type || 'customer',
              })(
                <RadioGroup>
                  <Radio value="customer">客户</Radio>
                  <Radio value="supplier">供应商</Radio>
                  <Radio value="other">其他</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {type === 'customer' && (
              <Fragment>
                <FormItem
                  {...formItemLayout}
                  label="所在地区"
                >
                  {getFieldDecorator('area', {
                    initialValue: data.area,
                    rules: [
                      { required: type === 'customer', message: '请输入所在地区' },
                    ],
                  })(
                    <Input placeholder="请输入所在地区" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="所在行业"
                >
                  {getFieldDecorator('industry', {
                    initialValue: data.industry,
                    rules: [
                      { required: type === 'customer', message: '请输入所在行业' },
                    ],
                  })(
                    <Input placeholder="请输入所在行业" />
                  )}
                </FormItem>
              </Fragment>
            )}
            <FormItem
              {...formItemLayout}
              label="负责人姓名"
            >
              {getFieldDecorator('linkmanName', {
                initialValue: data.linkmanName,
                rules: [
                  { required: true, message: '请输入姓名' },
                ],
              })(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
            {type === 'customer' && (
              <FormItem
                {...formItemLayout}
                label="职务"
              >
                {getFieldDecorator('job', {
                  initialValue: data.job,
                  rules: [
                    { required: type === 'customer', message: '请输入职务' },
                  ],
                })(
                  <Input placeholder="请输入职务" />
                )}
              </FormItem>
            )}
            <FormItem
              {...formItemLayout}
              label="联系方式"
            >
              {getFieldDecorator('contactWay', {
                initialValue: data.contactWay,
                rules: [
                  { required: true, message: '请输入联系方式' },
                ],
              })(
                <Input placeholder="请输入联系方式" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注说明"
            >
              {getFieldDecorator('description', {
                initialValue: data.description,
              })(
                <TextArea rows={4} placeholder="请输入备注说明" />
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

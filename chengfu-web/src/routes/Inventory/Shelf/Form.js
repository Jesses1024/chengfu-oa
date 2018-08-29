import React, { PureComponent } from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import RemoteSelect from '../../../components/RemoteSelect';
import FormLoading from '../../../components/FormLoading';

import request from '../../../utils/request';

const positionFetcher = value => request(`/api/warehouse/query?filter=${value}&isEnabled=true`)
  .then(res => res.content);

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ warehouseForm }) => ({
  warehouseForm,
}))
@FormLoading({
  isLoading: ({ warehouseForm }) => warehouseForm.loading,
})
@Form.create()
export default class ShelfForm extends PureComponent {
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
      type: 'warehouseForm/fetch',
      payload: id,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { warehouseForm: { data } } = this.props;
      if (!err) {
        this.props.dispatch({
          type: 'warehouseForm/save',
          payload: { ...data, ...values },
        });
      }
    });
  }

  render() {
    const { warehouseForm: { submitting, data = {} } } = this.props;
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
      <PageHeaderLayout title={`货架${id ? '编辑' : '新增'}`}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="货架名称"
            >
              {getFieldDecorator('displayName', {
                initialValue: data.displayName,
                rules: [
                  { required: true, message: '请填写货架名称' },
                ],
              })(
                <Input placeholder="请输入货架名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属仓位"
            >
              {getFieldDecorator('group', {
                initialValue: data.group,
                rules: [
                  { required: true, message: '请选择所属仓位' },
                ],
              })(
                <RemoteSelect
                  fetcher={positionFetcher}
                  placeholder="请选择"
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
                <TextArea row={4} placeholder="请填写" />
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

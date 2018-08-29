import React, { PureComponent } from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Button, Form, Col, Row, Input, Select } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import FormLoading from '../../../components/FormLoading';
import TableForm from './TableForm';
import styles from '../Form.less';

const { TextArea } = Input;

@connect(({ reimburseForm, user: { currentUser } }) => ({
  reimburseForm,
  currentUser,
}))
@FormLoading({
  isLoading: ({ reimburseForm }) => reimburseForm.loading,
})
@Form.create()
class ReimburseForm extends PureComponent {
  constructor(props) {
    super(props);
    const { search } = props.location;
    const params = qs.parse(search.substring(1)) || {};
    this.state = {
      id: params.id,
    };
  }
  state = {
    width: '100%',
  };

  componentDidMount() {
    this.fetch();
  }
  fetch = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'reimburseForm/fetch',
      payload: id,
    });
  }

  handleSubmit = () => {
    const { form, reimburseForm: { data = {} }, currentUser } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        let newItems = values.items;
        if (newItems && newItems.length > 0) {
          newItems = newItems.map((i) => {
            if (i.isAdd) {
              const p = { ...i };
              delete p.isAdd;
              delete p.id;
              return p;
            } else {
              return i;
            }
          });
        }
        this.props.dispatch({
          type: 'reimburseForm/save',
          payload: {
            ...data,
            ...values,
            auditStatus: 'preReview',
            items: newItems,
            applyName: currentUser.username,
          },
        });
      }
    });
  }

  render() {
    const { form, reimburseForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator } = form;
    const { id } = this.state;

    return (
      <PageHeaderLayout
        title={id ? '报销编辑' : '报销新增'}
        wrapperClassName={styles.advancedForm}
      >
        <Card title="付于信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('receiveName', {
                    initialValue: data.receiveName,
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(
                    <Input placeholder="请输入姓名" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="开户银行">
                  {getFieldDecorator('bankName', {
                    initialValue: data.bankName,
                    rules: [{ required: true, message: '请填写开户银行' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="银行账号">
                  {getFieldDecorator('bankNumber', {
                    initialValue: data.bankNumber,
                    rules: [{ required: true, message: '请填写银行账号' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="付款用途">
                  {getFieldDecorator('paidType', {
                    initialValue: data.paidType,
                    rules: [{ required: true, message: '请选择付款用途' }],
                  })(
                    <Select mode="multiple" placeholder="请选择">
                      <Select.Option value="loan">贷款</Select.Option>
                      <Select.Option value="fixedAssets">固定资产</Select.Option>
                      <Select.Option value="cost">费用</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('description', {
                    initialValue: data.description,
                  })(
                    <TextArea rows={4} placeholder="请填写备注" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="报销内容" bordered={false}>
          {getFieldDecorator('items', {
            initialValue: data.items || [],
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          <Button onClick={() => this.props.dispatch(routerRedux.goBack())}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default ReimburseForm;

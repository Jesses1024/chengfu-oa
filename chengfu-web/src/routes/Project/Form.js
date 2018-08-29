import React, { PureComponent } from 'react';
import qs from 'qs';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Button, Form, Col, Row, DatePicker, Input, Select, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import RemoteAutoComplete from '../../components/RemoteAutoComplete';
import FormLoading from '../../components/FormLoading';
import TableForm from './TableForm';
import request from '../../utils/request';
import styles from './Form.less';

const { Option } = Select;
const { TextArea } = Input;

const contactsFetcher = v => request(`/api/contact/query?filter=${v}&type=customer`)
  .then(res => res.content.map(i => ({
    key: i.unitName,
    label: i.unitName,
  })));

@connect(({ projectForm }) => ({
  projectForm,
}))
@FormLoading({
  isLoading: ({ projectForm }) => projectForm.loading,
})
@Form.create()
class ProjectForm extends PureComponent {
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
      type: 'projectForm/fetch',
      payload: id,
    });
  }

  handleSubmit = () => {
    const { form, projectForm: { data = {} } } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.props.dispatch({
          type: 'projectForm/save',
          payload: { ...data, ...values, status: 'preRecord' },
        });
      }
    });
  }

  render() {
    const { form, projectForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator } = form;
    const { id } = this.state;
    return (
      <PageHeaderLayout
        title={id ? '项目编辑' : '项目新增'}
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基础数据" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="公司名称">
                  {getFieldDecorator('companyName', {
                    initialValue: data.companyName,
                    rules: [{ required: true, message: '请输入公司名称' }],
                  })(
                    <RemoteAutoComplete
                      fetcher={contactsFetcher}
                      placeholder="请输入公司名称"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="行业类型">
                  {getFieldDecorator('industryType', {
                    initialValue: data.industryType,
                    rules: [{ required: true, message: '请输入行业类型' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="所在地区">
                  {getFieldDecorator('area', {
                    initialValue: data.area,
                    rules: [{ required: true, message: '请输入所在地区' }],
                  })(
                    <Input placeholder="请输入所在地区" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="项目类型">
                  {getFieldDecorator('type', {
                    initialValue: data.type || [],
                    rules: [{ required: true, message: '请选择项目类型' }],
                  })(
                    <Select mode="multiple" placeholder="请选择项目类型">
                      <Option value="gas">废气</Option>
                      <Option value="water">废水</Option>
                      <Option value="solid">固废</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="计划时间">
                  {getFieldDecorator('startDate', {
                    initialValue: data.startDate ? moment(data.startDate) : null,
                    rules: [{ required: true, message: '请选择项目计划启动日期' }],
                  })(
                    <DatePicker placeholder="请选择" style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="项目详情">
                  {getFieldDecorator('description', {
                    initialValue: data.description,
                    rules: [{ required: true, message: '请填写项目详情' }],
                  })(
                    <TextArea rows={4} placeholder="请选择项目详情" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider>对接人信息</Divider>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('linkmanName', {
                    initialValue: data.linkmanName,
                    rules: [{ required: true, message: '请填写姓名' }],
                  })(
                    <Input placeholder="请填写姓名" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="职务">
                  {getFieldDecorator('linkmanJob', {
                    initialValue: data.linkmanJob,
                    rules: [{ required: true, message: '请填写职务' }],
                  })(
                    <Input placeholder="请填写" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="联系方式">
                  {getFieldDecorator('linkemanContactWay', {
                    initialValue: data.linkemanContactWay,
                    rules: [{ required: true, message: '请填写联系方式' }],
                  })(
                    <Input placeholder="请填写联系方式" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="项目管理" bordered={false}>
          {getFieldDecorator('items', {
            initialValue: data.items,
            // rules: [{ required: true, message: '请填写预购项' }],
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

export default ProjectForm;

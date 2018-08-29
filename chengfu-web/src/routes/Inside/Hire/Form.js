import React, { PureComponent } from 'react';
import qs from 'qs';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Card, Button, Form, Col, Row, DatePicker, Input, Divider, Radio } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import FormLoading from '../../../components/FormLoading';
import TableForm from './TableForm';
import styles from '../Form.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

@connect(({ hireForm }) => ({
  hireForm,
}))
@FormLoading({
  isLoading: ({ hireForm }) => hireForm.loading,
})
@Form.create()
class HireForm extends PureComponent {
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
      type: 'hireForm/fetch',
      payload: id,
    });
  }

  handleSubmit = () => {
    const { form, hireForm: { data = {} } } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        let newWorkExperienceList = values.workExperienceList;
        if (newWorkExperienceList && newWorkExperienceList.length > 0) {
          newWorkExperienceList = newWorkExperienceList.map((i) => {
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
          type: 'hireForm/save',
          payload: { ...data, ...values, status: 'pending', workExperienceList: newWorkExperienceList },
        });
      }
    });
  }

  render() {
    const { form, hireForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator } = form;
    const { id } = this.state;

    return (
      <PageHeaderLayout
        title={id ? '录用编辑' : '录用新增'}
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: data.name,
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(
                    <Input placeholder="请输入姓名" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="性别">
                  {getFieldDecorator('gender', {
                    initialValue: data.gender || 'male',
                    rules: [{ required: true, message: '请选择性别' }],
                  })(
                    <RadioGroup>
                      <Radio value="male">男</Radio>
                      <Radio value="woman">女</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="出生年月">
                  {getFieldDecorator('birthday', {
                    initialValue: data.birthday ? moment(data.birthday) : null,
                    rules: [{ required: true, message: '请选择出生年月' }],
                  })(
                    <DatePicker style={{ width: '100%' }} placeholder="请选择" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="籍贯">
                  {getFieldDecorator('birthplace', {
                    initialValue: data.birthplace,
                    rules: [{ required: true, message: '请填写籍贯' }],
                  })(
                    <Input placeholder="请填写籍贯" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="联系方式">
                  {getFieldDecorator('phoneNumber', {
                    initialValue: data.phoneNumber,
                    rules: [{ required: true, message: '请填写联系方式' }],
                  })(
                    <Input placeholder="请填写" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('description', {
                    initialValue: data.description,
                  })(
                    <TextArea rows={4} placeholder="请填写备注" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider>工作安排</Divider>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="能否接受出差">
                  {getFieldDecorator('acceptTravel', {
                    initialValue: data.id ? data.acceptTravel : true,
                    rules: [{ required: true, message: '请选择能否接受出差' }],
                  })(
                    <RadioGroup>
                      <Radio value>能</Radio>
                      <Radio value={false}>不能</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="能否接受加班">
                  {getFieldDecorator('acceptOvertime', {
                    initialValue: data.id ? data.acceptOvertime : true,
                    rules: [{ required: true, message: '请选择能否接受加班' }],
                  })(
                    <RadioGroup>
                      <Radio value>能</Radio>
                      <Radio value={false}>不能</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="能否接受工作调度">
                  {getFieldDecorator('acceptJobTransfer', {
                    initialValue: data.id ? data.acceptJobTransfer : true,
                    rules: [{ required: true, message: '请选择能否接受工作调度' }],
                  })(
                    <RadioGroup>
                      <Radio value checked>能</Radio>
                      <Radio value={false}>不能</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider>受教育信息</Divider>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="学历">
                  {getFieldDecorator('education', {
                    initialValue: data.education,
                    rules: [{ required: true, message: '请填写学历' }],
                  })(
                    <Input placeholder="请填写学历" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="毕业院校">
                  {getFieldDecorator('graduatedSchool', {
                    initialValue: data.graduatedSchool,
                    rules: [{ required: true, message: '请填写毕业院校' }],
                  })(
                    <Input placeholder="请填写" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="专业">
                  {getFieldDecorator('profession', {
                    initialValue: data.profession,
                    rules: [{ required: true, message: '请填写专业' }],
                  })(
                    <Input placeholder="请填写专业" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="工作经验" bordered={false}>
          {getFieldDecorator('workExperienceList', {
            initialValue: data.workExperienceList || [],
            // rules: [{ required: true, message: '请填写工作经验' }],
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

export default HireForm;

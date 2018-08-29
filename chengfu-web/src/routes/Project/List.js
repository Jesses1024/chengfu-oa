import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Badge, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OverText from '../../components/OverText';
import HasPermission from '../../utils/HasPermission';
import styles from './List.less';

const FormItem = Form.Item;

const typeTextMap = {
  gas: '废气',
  water: '废水',
  solid: '固废',
};

const statusMap = {
  preRecord: 'default',
  preAudit: 'warning',
  following: 'processing',
  signed: 'processing',
  completed: 'success',
  stoped: 'error',
};

const statusTextMap = {
  preRecord: '项目预录',
  preAudit: '立项待审核',
  following: '项目跟进',
  signed: '已签约',
  completed: '完成',
  stoped: '终止',
};

@connect(({ projectList, loading }) => ({
  projectList,
  loading: loading.models.projectList,
}))
@Form.create()
class ProjectList extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/fetch',
      payload: {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
    });
  }

  gotoDetail = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/project/form',
    }));
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'projectList/fetch',
      payload: {
        params: formValues,
        pagination,
        sorter,
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'projectList/fetch',
      payload: {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'projectList/fetch',
        payload: {
          params: values,
          pagination: {
            current: 1,
            pageSize: 10,
          },
        },
      });
    });
  }

  changeToogelCard = (item) => {
    this.props.dispatch({
      type: 'projectList/toogleDept',
      payload: {
        id: item.id,
        type: item.enabled,
      },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('filter')(
                <Input placeholder="请输入公司名称（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple" placeholder="请选择">
                  <Select.Option key="preRecord">项目预录</Select.Option>
                  <Select.Option key="preAudit">立项待审核</Select.Option>
                  <Select.Option key="following">项目跟进</Select.Option>
                  <Select.Option key="signed">已签约</Select.Option>
                  <Select.Option key="completed">已完成</Select.Option>
                  <Select.Option key="stoped">已终止</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { projectList: { data }, loading } = this.props;

    const columns = [{
      title: '操作',
      render: item => (
        <HasPermission perms={['project:view', 'project:edit']} noMatch="-">
          <Link to={`/project/detail/${item.id}`}>查看</Link>
          {(item.status === 'preRecord') && (
            <Fragment>
              <Divider type="vertical" />
              <Link to={`/project/form?id=${item.id}`}>编辑</Link>
            </Fragment>
          )}
        </HasPermission>
      ),
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '行业类型',
      dataIndex: 'industryType',
    },
    {
      title: '姓名',
      dataIndex: 'linkmanName',
    },
    {
      title: '项目类型',
      dataIndex: 'type',
      render: (val) => {
        const type = val.map(i => typeTextMap[i]);
        return type.join('、');
      },
    },
    {
      title: '计划时间',
      dataIndex: 'startDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Badge status={statusMap[val]} text={statusTextMap[val]} />,
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastModifiedDate',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '项目说明',
      dataIndex: 'description',
      render: val => <OverText value={val} />,
    }];

    return (
      <PageHeaderLayout title="项目列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <HasPermission perms={['project:edit']}>
                <Button icon="plus" type="primary" onClick={() => this.gotoDetail()}>
                  新增
                </Button>
              </HasPermission>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1200 }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ProjectList;

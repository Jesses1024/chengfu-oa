import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Badge, Divider } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable';
import OverText from '../../../components/OverText';
import HasPermission from '../../../utils/HasPermission';
import styles from '../List.less';

const FormItem = Form.Item;

const statusMap = {
  preReview: 'warning',
  preAudit: 'processing',
  deptLeaderAudit: 'success',
  deptLeaderReject: 'error',
  financeAudit: 'success',
  financeReject: 'error',
  prepaid: 'processing',
  leaderReject: 'error',
  paided: 'success',
};

const statusTextMap = {
  preReview: '预览',
  preAudit: '待审批',
  deptLeaderAudit: '部门通过',
  deptLeaderReject: '部门驳回',
  financeAudit: '财务通过',
  financeReject: '财务驳回',
  prepaid: '待付款',
  leaderReject: '总经理驳回',
  paided: '付讫',
};

@connect(({ reimburseList, loading }) => ({
  reimburseList,
  loading: loading.models.reimburseList,
}))
@Form.create()
export default class ReimburseList extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'reimburseList/fetch',
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
      pathname: '/inside/reimburse-form',
    }));
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'reimburseList/fetch',
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
      type: 'reimburseList/fetch',
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
        type: 'reimburseList/fetch',
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
      type: 'reimburseList/toogleDept',
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
                <Input placeholder="请输入报销人（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple" placeholder="请选择">
                  <Select.Option key="preReview">预览</Select.Option>
                  <Select.Option key="preAudit">待审批</Select.Option>
                  <Select.Option key="deptLeaderAudit">部门通过</Select.Option>
                  <Select.Option key="deptLeaderReject">部门驳回</Select.Option>
                  <Select.Option key="financeAudit">财务通过</Select.Option>
                  <Select.Option key="financeReject">财务驳回</Select.Option>
                  <Select.Option key="prepaid">待付款</Select.Option>
                  <Select.Option key="leaderReject">总经理驳回</Select.Option>
                  <Select.Option key="paided">付讫</Select.Option>
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
    const { reimburseList: { data }, loading } = this.props;

    const columns = [{
      title: '操作',
      render: item => (
        <Fragment>
          <HasPermission perms={['inside:reimburse:view']} noMatch="-">
            <Link to={`/inside/reimburse-detail/${item.id}`}>查看</Link>
          </HasPermission>
          <HasPermission perms={['inside:reimburse:edit']} noMatch="-">
            {item.auditStatus === 'preReview' && (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`/inside/reimburse-form?id=${item.id}`}>编辑</Link>
              </Fragment>
            )}
          </HasPermission>
        </Fragment>
      ),
    },
    {
      title: '报销人',
      dataIndex: 'applyName',
    },
    {
      title: '申请时间',
      dataIndex: 'leaveDate',
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '状态',
      dataIndex: 'auditStatus',
      render: val => <Badge status={statusMap[val]} text={statusTextMap[val]} />,
    },
    {
      title: '更新时间',
      dataIndex: 'lastModifiedDate',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '备注',
      dataIndex: 'description',
      render: val => <OverText value={val} />,
    }];

    return (
      <PageHeaderLayout title="报销申请列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>

            <div className={styles.tableListOperator}>
              <HasPermission perms={['inside:reimburse:edit']}>
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Badge, Popconfirm, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import HasPermission from '../../utils/HasPermission';

import styles from './List.less';

const FormItem = Form.Item;
@connect(({ staffList, loading }) => ({
  staffList,
  loading: loading.models.staffList,
}))
@Form.create()
export default class StaffList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffList/fetch',
      payload: {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
    });
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'staffList/fetch',
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
      type: 'staffList/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'sys/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        orgId: fieldsValue.orgId && fieldsValue.orgId.key,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'staffList/fetch',
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

  gotoDetail = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/staff/form',
      search: id ? `id=${id}` : '',
    }));
  }


  handleChangeLeaved = (item) => {
    this.props.dispatch({
      type: 'staffList/editStatus',
      payload: { ...item, status: 'leaved' },
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
                <Input placeholder="请输入员工姓名（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }} justify="center">
          <Col md={8} sm={24}>
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
    const { staffList: { data }, loading } = this.props;
    const { selectedRows } = this.state;


    const columns = [
      {
        title: '操作',
        render: item => (
          <HasPermission perms={['staff:edit']} noMatch="-">
            {item.status !== 'leaved' && (
              <Fragment>
                <Popconfirm title="您确定要将该员工状态改为离职吗?" onConfirm={() => this.handleChangeLeaved(item)} okText="是" cancelText="否">
                  <a style={{ marginRight: '4px' }}>离职</a>
                </Popconfirm>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`/staff/form?id=${item.id}`}>编辑</Link>
          </HasPermission>
        ),
      },
      {
        title: '工号',
        dataIndex: 'jobNumber',
        render: val => val || '-',
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
        render: val => val || '-',
      },
      {
        title: '职务',
        dataIndex: 'duties',
        render: val => val || '-',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={val !== 'leaved' ? 'processing' : 'error'} text={val === 'leaved' ? '离职' : '在职'} />;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];

    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <HasPermission perms={['staff:user:edit']}>
                <Button icon="plus" type="primary" onClick={() => this.gotoDetail()}>
                  新增
                </Button>
              </HasPermission>
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

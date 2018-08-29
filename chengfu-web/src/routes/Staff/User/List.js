import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Badge, Divider, Popconfirm } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import HasPermission from '../../../utils/HasPermission';

import styles from '../List.less';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/fetch',
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
      type: 'userList/fetch',
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
      type: 'userList/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
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
        type: 'userList/fetch',
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
      pathname: '/staff/user-form',
      search: id ? `id=${id}` : '',
    }));
  }


  changeToogelCard = (item) => {
    this.props.dispatch({
      type: 'userList/toogleUser',
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
                <Input placeholder="请输入员工姓名（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('enabled', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="true">启用</Option>
                  <Option value="false">停用</Option>
                </Select>
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
    const { userList: { data }, loading } = this.props;
    const { selectedRows } = this.state;


    const columns = [
      {
        title: '操作',
        render: item => (
          <HasPermission perms={['staff:user:edit']} noMatch="-">
            <Popconfirm title={`您确定要${item.enabled ? '停用' : '启用'}该用户吗?`} onConfirm={() => this.changeToogelCard(item)} okText="是" cancelText="否">
              <a style={{ marginRight: '4px' }}>{item.enabled ? '停用' : '启用'}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Link to={`/staff/user-form?id=${item.id}`}>编辑</Link>
          </HasPermission>
        ),
      },
      {
        title: '员工姓名',
        dataIndex: 'displayName',
      },
      {
        title: '登录账号',
        dataIndex: 'userName',
      },
      {
        title: '所属部门',
        dataIndex: 'group.displayName',
      },
      {
        title: '角色',
        dataIndex: 'role.displayName',
        render: val => val || '-',
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        render(val) {
          return <Badge status={val ? 'processing' : 'error'} text={val ? '正常' : '停用'} />;
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

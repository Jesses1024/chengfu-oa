import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from '../../../components/StandardTable';
import OverText from '../../../components/OverText';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import HasPermission from '../../../utils/HasPermission';

import styles from '../List.less';

const FormItem = Form.Item;

@connect(({ roleList, loading }) => ({
  roleList,
  loading: loading.models.roleList,
}))

@Form.create()
export default class RoleList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleList/fetch',
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
      type: 'roleList/fetch',
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
      type: 'roleList/fetch',
      payload: {},
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
        type: 'roleList/fetch',
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


  gotoDetail = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/staff/role-form',
    }));
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('filter')(
                <Input placeholder="请输入角色名称（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
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
    const { roleList: { data }, loading } = this.props;

    const columns = [
      {
        title: '操作',
        render: item => (
          <HasPermission perms={['staff:role:edit']} noMatch="-">
            <Link to={`/staff/role-form?id=${item.id}`}>编辑</Link>
          </HasPermission>
        ),
      },
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'description',
        render: val => <OverText value={val} />,
      },
    ];

    return (
      <PageHeaderLayout title="角色列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <HasPermission perms={['staff:role:edit']}>
                <Button icon="plus" type="primary" onClick={() => this.gotoDetail()}>
                  新增
                </Button>
              </HasPermission>
            </div>
            <StandardTable
              rowKey="id"
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

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
  pending: 'processing',
  accept: 'success',
  reject: 'error',
  leaved: 'warning',
};

const statusTextMap = {
  pending: '待审核',
  accept: '已通过',
  reject: '已驳回',
  leaved: '已离职',
};

@connect(({ hireList, loading }) => ({
  hireList,
  loading: loading.models.hireList,
}))
@Form.create()
class ProjectList extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hireList/fetch',
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
      pathname: '/inside/hire-form',
    }));
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'hireList/fetch',
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
      type: 'hireList/fetch',
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
        type: 'hireList/fetch',
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
      type: 'hireList/toogleDept',
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
                <Input placeholder="请输入姓名（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple" placeholder="请选择">
                  <Select.Option key="pending">待审核</Select.Option>
                  <Select.Option key="accept">已通过</Select.Option>
                  <Select.Option key="reject">已驳回</Select.Option>
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
    const { hireList: { data }, loading } = this.props;

    const columns = [{
      title: '操作',
      render: item => (
        <Fragment>
          <HasPermission perms={['inside:hire:view']} noMatch="-">
            <Link to={`/inside/hire-detail/${item.id}`}>查看</Link>
          </HasPermission>
          <HasPermission perms={['inside:hire:edit']} noMatch="-">
            {item.status === 'pending' && (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`/inside/hire-form?id=${item.id}`}>编辑</Link>
              </Fragment>
            )}
          </HasPermission>
        </Fragment>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: val => (val === 'male' ? '男' : '女'),
    },
    {
      title: '出生年月',
      dataIndex: 'birthday',
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '籍贯',
      dataIndex: 'birthplace',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Badge status={statusMap[val]} text={statusTextMap[val]} />,
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
    }];

    return (
      <PageHeaderLayout title="录用列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>

            <div className={styles.tableListOperator}>
              <HasPermission perms={['inside:hire:edit']}>
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
            // scroll={{ x: 1400 }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ProjectList;

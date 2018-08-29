import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Badge, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable';
import HasPermission from '../../../utils/HasPermission';
import CreateModal from './CreateModal';
import styles from '../List.less';

const FormItem = Form.Item;

const statusMap = {
  preview: 'processing',
  preAudit: 'warning',
  aduited: 'success',
  rejected: 'error',
};

const statusTextMap = {
  preview: '预览',
  preAudit: '待审核',
  aduited: '已通过',
  rejected: '已驳回',
};

@connect(({ attendanceList, loading }) => ({
  attendanceList,
  loading: loading.models.attendanceList,
}))
@Form.create()
class AttendanceList extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'attendanceList/fetch',
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
      type: 'attendanceList/fetch',
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
      type: 'attendanceList/fetch',
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
        type: 'attendanceList/fetch',
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

  handleRemove = (id) => {
    this.props.dispatch({
      type: 'attendanceList/remove',
      payload: id,
    });
  }

  changeToogelCard = (item) => {
    this.props.dispatch({
      type: 'attendanceList/toogleDept',
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
                <Input placeholder="请输入名称（支持模糊搜索）" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple" placeholder="请选择">
                  <Select.Option key="preview">预览</Select.Option>
                  <Select.Option key="preAudit">待审核</Select.Option>
                  <Select.Option key="aduited">已通过</Select.Option>
                  <Select.Option key="rejected">已驳回</Select.Option>
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
    const { attendanceList: { data }, loading } = this.props;

    const columns = [{
      title: '操作',
      render: item => (
        <Fragment>
          <HasPermission perms={['inside:attendance:view']} noMatch="-">
            <Link to={`/inside/attendance-detail/${item.id}`}>查看</Link>
          </HasPermission>
          <HasPermission perms={['inside:attendance:edit']} noMatch="-">
            {item.status === 'preview' && (
              <Popconfirm
                title="您确定要删除吗？"
                okText="是"
                cancelText="否"
                onConfirm={() => this.handleRemove(item.id)}
              >
                <Divider type="vertical" />
                <a>删除</a>
              </Popconfirm>
            )}
          </HasPermission>
        </Fragment>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
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
    }];

    return (
      <PageHeaderLayout title="考勤管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>

            <div className={styles.tableListOperator}>
              <HasPermission perms={['inside:attendance:edit']}>
                <CreateModal />
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

export default AttendanceList;

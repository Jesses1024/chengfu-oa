import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Badge, Divider, Popconfirm } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import OverText from '../../../components/OverText';
import HasPermission from '../../../utils/HasPermission';
import styles from '../List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ groupList, loading }) => ({
  groupList,
  loading: loading.models.groupList,
}))
@Form.create()
export default class groupList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupList/fetch',
      payload: {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
    });
  }

  gotoDetail = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/staff/group-form',
      search: id ? `id=${id}` : '',
    }));
  }

  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'groupList/fetch',
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
      type: 'groupList/fetch',
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
        type: 'groupList/fetch',
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
      type: 'groupList/toogleDept',
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
                <Input placeholder="请输入部门名称（支持模糊搜索）" />
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
                  <Option value="true">正常</Option>
                  <Option value="false">停用</Option>
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
    const { groupList: { data }, loading } = this.props;

    const columns = [{
      title: '操作',
      render: item => (
        <HasPermission perms={['staff:group:edit']} noMatch="-">
          <Popconfirm title={`您确定要${item.enabled ? '停用' : '启用'}该部门吗?`} onConfirm={() => this.changeToogelCard(item)} okText="是" cancelText="否">
            <a style={{ marginRight: '4px' }}>{item.enabled ? '停用' : '启用'}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.gotoDetail(item.id)}>编辑</a>
        </HasPermission>
      ),
    },
    {
      title: '部门名称',
      dataIndex: 'name',
    },
    {
      title: '上级部门',
      dataIndex: 'parent',
      render: item => (item ? item.name : '-'),
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
    {
      title: '备注',
      dataIndex: 'description',
      render: val => <OverText value={val} />,
    }];

    return (
      <PageHeaderLayout title="部门列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <HasPermission perms={['staff:group:edit']}>
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

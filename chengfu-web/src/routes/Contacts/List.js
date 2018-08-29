import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Badge, Divider, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import HasPermission from '../../utils/HasPermission';
import OverText from '../../components/OverText';

import styles from './List.less';

const FormItem = Form.Item;

const typeTextMap = {
  customer: '客户',
  supplier: '供应商',
  other: '其他',
};

@connect(({ contactList, loading }) => ({
  contactList,
  loading: loading.models.contactList,
}))
@Form.create()
class ContactsList extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contactList/fetch',
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
      type: 'contactList/fetch',
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
      type: 'contactList/fetch',
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
        orgId: fieldsValue.orgId && fieldsValue.orgId.key,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'contactList/fetch',
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
      pathname: '/contacts/form',
    }));
  }


  changeToggleEnabled = (item) => {
    this.props.dispatch({
      type: 'contactList/editStatus',
      payload: {
        ...item,
        ifUsing: !item.ifUsing,
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
              {getFieldDecorator('ifUsing', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="true">启用</Select.Option>
                  <Select.Option value="false">停用</Select.Option>
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
    const { contactList: { data }, loading } = this.props;

    const columns = [
      {
        title: '操作',
        render: item => (
          <HasPermission perms={['contacts:edit']} noMatch="-">
            <Link to={`/contacts/form?id=${item.id}`}>编辑</Link>
            <Divider type="vertical" />
            <Popconfirm title={`您确定要${item.ifUsing ? '停用' : '启用'}该往来单位吗?`} onConfirm={() => this.changeToggleEnabled(item)} okText="是" cancelText="否">
              <a style={{ marginRight: '4px' }}>{item.ifUsing ? '停用' : '启用'}</a>
            </Popconfirm>
          </HasPermission>
        ),
      },
      {
        title: '名称',
        dataIndex: 'unitName',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: val => typeTextMap[val],
      },
      {
        title: '状态',
        dataIndex: 'ifUsing',
        render(val) {
          return <Badge status={val ? 'processing' : 'error'} text={val ? '正常' : '停用'} />;
        },
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
      },
    ];

    return (
      <PageHeaderLayout title="往来单位列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <HasPermission perms={['contacts:edit']}>
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
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ContactsList;

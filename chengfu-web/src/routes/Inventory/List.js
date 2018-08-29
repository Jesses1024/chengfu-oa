import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import HasPermission from '../../utils/HasPermission';
import InvenctoryModal from './InvenctoryModal';
import InventoryLogModal from './InventoryLogModal';
import InOutModal from './InOutModal';
import PickingModal from './PickingModal';
import CheckModal from './CheckModal';
import styles from './List.less';

import { formatNum } from '../../utils/utils';

const FormItem = Form.Item;

@connect(({ inventoryList, loading }) => ({
  inventoryList,
  loading: loading.models.inventoryList,
}))
@Form.create()
export default class InventoryList extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
    visible: false,
    dataSource: {},
    goodsId: null,
    warehouseId: null,
    logVisible: false,
    inOutVisible: false,
    inoutStatus: 'in',
    warehouse: {},
    goods: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryList/fetch',
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
      type: 'inventoryList/fetch',
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
      type: 'inventoryList/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
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
        type: 'inventoryList/fetch',
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

  openModal = (item) => {
    this.setState({ dataSource: item });
    this.toogleModal();
  }

  handleLimit = (item) => {
    this.props.dispatch({
      type: 'inventoryList/editLimit',
      payload: item,
    });
    this.toogleModal();
  }

  toogleModal = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }

  openLogModal = (item) => {
    this.props.dispatch({
      type: 'inventoryList/fetchLogList',
      payload: {
        params: {
          goodsId: item.goods.id,
          warehouseId: item.warehouse.id,
        },
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
    });
    this.setState({
      goodsId: item.goods.id,
      warehouseId: item.warehouse.id,
    });
    this.toogleLogModal();
  }

  handleInOutSubmit = (item) => {
    this.props.dispatch({
      type: 'inventoryList/changeInventory',
      payload: { ...item },
    });
    this.toogleInOutModal();
  }

  toogleInOutModal = () => {
    this.setState({ inOutVisible: !this.state.inOutVisible });
  }

  toogleLogModal = () => {
    const { logVisible } = this.state;
    this.setState({ logVisible: !logVisible });
  }

  openInoutModal = (item) => {
    this.setState({
      inoutStatus: 'out',
      goods: item.goods,
      warehouse: item.warehouse,
    }, () => {
      this.toogleInOutModal();
    });
  }


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="搜索">
              {getFieldDecorator('filter')(
                <Input placeholder="请输入货物、仓库名（支持模糊搜索）" />
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
    const { inventoryList: { data, logData, logLoading }, loading } = this.props;
    const columns = [{
      title: '操作',
      render: item => (
        <HasPermission perms={['port:inventory:edit', 'mine:inventory:edit', 'factory:inventory:edit']} noMatch={<a onClick={() => this.openLogModal(item)}>库存台账</a>}>
          <a onClick={() => this.openModal(item)}>库存提醒</a>
          <Divider type="vertical" />
          <a onClick={() => this.openLogModal(item)}>库存台账</a>
          <Divider type="vertical" />
          <a onClick={() => this.openInoutModal(item)}>直接出库</a>
        </HasPermission>
      ),
    }, {
      title: '所属仓库',
      dataIndex: 'warehouse',
      render: val => <span>{val && val.name}</span>,
    }, {
      title: '货物',
      dataIndex: 'goods',
      render: val => <span>{val && val.name}</span>,
    }, {
      title: '数量',
      dataIndex: 'number',
      render: val => formatNum(val),
    }, {
      title: '上限',
      dataIndex: 'upperLimit',
    }, {
      title: '下限',
      dataIndex: 'lowerLimit',
    }];

    return (
      <PageHeaderLayout title="库存列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <HasPermission perms={['port:inventory:edit', 'mine:inventory:edit', 'factory:inventory:edit']}>
                <Button
                  type="primary"
                  onClick={() => this.setState({
                    inOutVisible: !this.state.inOutVisible,
                    inoutStatus: 'in',
                    goods: null,
                    warehouse: null,
                  })}
                >
                  直接入库
                </Button>
                <PickingModal />
                <CheckModal />
              </HasPermission>
            </div>
            <StandardTable
              rowKey={record => `${record.warehouse.id}-${record.goods.id}`}
              loading={loading}
              isRowSelection={null}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            <InvenctoryModal
              data={this.state.dataSource}
              visible={this.state.visible}
              handleOk={this.handleLimit}
              handleCancel={this.toogleModal}
            />
            <InventoryLogModal
              warehouseId={this.state.warehouseId}
              goodsId={this.state.goodsId}
              dataSource={logData}
              loading={logLoading}
              visible={this.state.logVisible}
              handleOk={this.handleLimit}
              handleCancel={this.toogleLogModal}
              {...this.props}
            />
            <InOutModal
              warehouse={this.state.warehouse}
              goods={this.state.goods}
              status={this.state.inoutStatus}
              visible={this.state.inOutVisible}
              handleInOutSubmit={this.handleInOutSubmit}
              toogleInOutModal={this.toogleInOutModal}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

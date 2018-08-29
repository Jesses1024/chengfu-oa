import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Button, Table, Popconfirm, Divider } from 'antd';
import FormModal from './FormModal';
import HasPermission from '../../../utils/HasPermission';
import { formatNum } from '../../../utils/utils';

@connect(({ projectDetail }) => ({
  projectDetail,
}))
export default class InquiryPriceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentItem: null,
    };
  }

  handleOpenModal = (item) => {
    this.setState({ currentItem: item }, () => {
      this.toogleModal();
    });
  }

  toogleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleFormSubmit = (v) => {
    const { data = {} } = this.props.projectDetail;
    this.props.dispatch({
      type: 'projectDetail/saveAskItem',
      payload: { ...v, projectId: data.id },
    });
    this.toogleModal();
  }

  handleProductPurchase = (params) => {
    this.props.dispatch({
      type: 'projectDetail/productPurchase',
      payload: params,
    });
  }

  render() {
    const { data = {} } = this.props.projectDetail;
    const columns = [{
      title: '操作',
      dataIndex: 'operator',
      render: (val, record) => {
        return (
          this.props.showBtn ? (
            <HasPermission perms={['project:edit']}>
              <Fragment>
                <a onClick={() => this.handleOpenModal(record)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要生成采购单吗"
                  onConfirm={() => this.handleProductPurchase({
                    id: record.id, projectId: data.id,
                  })}
                  okText="是"
                  cancelText="否"
                >
                  <a >确认采购</a>
                </Popconfirm>
              </Fragment>
            </HasPermission>
          ) : '-'
        );
      },
    }, {
      title: '询价人',
      dataIndex: 'createdBy',
    }, {
      title: '询价时间',
      dataIndex: 'askDate',
      render: val => (val ? moment(val).format('YYYY-MM-DD') : '-'),
    }, {
      title: '供应商',
      dataIndex: 'supplier',
    }, {
      title: '货物',
      dataIndex: 'goodsName',
    }, {
      title: '型号规格',
      dataIndex: 'modelNumber',
    }, {
      title: '单位',
      dataIndex: 'goodsUnit',
    }, {
      title: '数量',
      dataIndex: 'number',
      render: val => formatNum(val),
    }, {
      title: '价钱',
      dataIndex: 'price',
      render: val => formatNum(val),
    }];

    return (
      <Fragment>
        {this.props.showBtn && (
          <Button style={{ marginBottom: 16 }} type="primary" onClick={this.toogleModal}>新增</Button>
        )}
        <Table
          dataSource={data.askPriceOrders || []}
          columns={columns}
          pagination={false}
          expandedRowRender={record => <p style={{ margin: 0 }}>备注：{record.description}</p>}
        />
        <FormModal
          visible={this.state.visible}
          currentItem={this.state.currentItem}
          currentUser={this.props.currentUser}
          onCancel={() => this.setState({ visible: false, currentItem: null })}
          onSubmit={this.handleFormSubmit}
        />
      </Fragment>
    );
  }
}

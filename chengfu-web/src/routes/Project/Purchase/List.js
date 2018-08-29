import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Button, Badge, Divider, Popconfirm } from 'antd';
import StopedModal from '../../../components/StopedModal';
import HasPermission from '../../../utils/HasPermission';
import ModalForm from './ModalForm';
import ArrivedModal from './ArrivedModal';
import { formatNum } from '../../../utils/utils';

const statusTextMap = {
  unArrive: '未到货',
  arrived: '已到货',
  invaild: '已作废',
};

const statusMap = {
  unArrive: 'warning',
  arrived: 'success',
  invaild: 'error',
};

const examineStatusTextMap = {
  preAudit: '待审批',
  aduited: '已通过',
  rejected: '已驳回',
};

const examineStatusMap = {
  preAudit: 'warning',
  aduited: 'success',
  rejected: 'error',
};

@connect(({ projectDetail, user: { currentUser } }) => ({
  projectDetail,
  currentUser,
}))
class PurchaseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: 'reject',
      arriveVisible: false,
      stopedVisible: false,
      currentItem: null,
    };
  }

  handleOpenModal = (item) => {
    this.setState({ currentItem: item }, () => {
      this.toogleModal();
    });
  }

  handleOpenRejectModal = (item, type) => {
    this.setState({ currentItem: item, type }, () => {
      this.toggleStopedModal();
    });
  }

  handleOpenArriveModal = (item) => {
    this.setState({ currentItem: item }, () => {
      this.toggleArriveModal();
    });
  }

  toogleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  toggleStopedModal = () => {
    this.setState({ stopedVisible: !this.state.stopedVisible });
  }

  toggleArriveModal = () => {
    this.setState({ arriveVisible: !this.state.arriveVisible });
  }

  handleFormSubmit = (v) => {
    const { data = {} } = this.props.projectDetail;
    this.props.dispatch({
      type: 'projectDetail/savePurchaseOrder',
      payload: { ...v, projectId: data.id },
    });
    this.toogleModal();
  }

  handleStopedSubmit = (description) => {
    const { data = {} } = this.props.projectDetail;
    const { currentItem, type } = this.state;
    if (type === 'reject') {
      this.props.handleEditAuditStatus(currentItem.id, 'purchase', 'rejected', description);
    } else {
      this.props.dispatch({
        type: 'projectDetail/savePurchaseOrder',
        payload: { ...currentItem, projectId: data.id, purchaseStatus: 'invaild', purchaseInvaildDescription: description },
      });
    }
    this.toggleStopedModal();
  }

  handleAduitedStatus = (id) => {
    this.props.handleEditAuditStatus(id, 'purchase', 'aduited', '');
  }

  handleArriveSubmit = (v) => {
    const { data = {} } = this.props.projectDetail;
    const { currentItem } = this.state;
    this.props.dispatch({
      type: 'projectDetail/savePurchaseOrder',
      payload: { ...currentItem, ...v, projectId: data.id },
    });
    this.toggleArriveModal();
  }

  render() {
    const { data = {} } = this.props.projectDetail;
    const columns = [
      {
        title: '操作',
        dataIndex: 'operator',
        render: (val, record) => {
          return (
            this.props.showBtn ? (
              <Fragment>
                <HasPermission perms={['project:edit']}>
                  {(record.auditStatus === 'rejected' || record.auditStatus === 'preAudit') && (
                    <a onClick={() => this.handleOpenModal(record)}>编辑</a>
                  )}
                </HasPermission>
                <HasPermission perms={['project:purchaseAudit']}>
                  {record.auditStatus === 'preAudit' && (
                    <Fragment>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="您确定要通过审核该数据吗"
                        onConfirm={() => this.handleAduitedStatus(record.id)}
                        okText="是"
                        cancelText="否"
                      >
                        <a>通过</a>
                      </Popconfirm>
                      <Divider type="vertical" />
                      <a onClick={() => this.handleOpenRejectModal(record, 'reject')}>驳回</a>
                    </Fragment>
                  )}
                </HasPermission>
                <HasPermission perms={['project:edit']}>
                  {record.auditStatus === 'aduited' && record.purchaseStatus === 'unArrive' && (
                    <a onClick={() => this.handleOpenArriveModal(record)}>到货</a>
                  )}
                  {(record.purchaseStatus !== 'invaild' && record.purchaseStatus !== 'arrived') ? (
                    <Fragment>
                      <Divider type="vertical" />
                      <a onClick={() => this.handleOpenRejectModal(record, 'invaild')}>作废</a>
                    </Fragment>
                  ) : '-'}
                </HasPermission>
              </Fragment>
            ) : '-'
          );
        },
      },
      {
        title: '货物',
        dataIndex: 'goodsName',
      },
      {
        title: '型号规格',
        dataIndex: 'modelNumber',
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
      },
      {
        title: '数量',
        dataIndex: 'number',
        render: val => formatNum(val),
      },
      {
        title: '供应商',
        dataIndex: 'supplier',
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        render: val => <Badge text={examineStatusTextMap[val]} status={examineStatusMap[val]} />,
      },
      {
        title: '状态',
        dataIndex: 'purchaseStatus',
        render: val => <Badge text={statusTextMap[val]} status={statusMap[val]} />,
      },
      {
        title: '请购日期',
        dataIndex: 'applyPurchaseDate',
        render: val => (val ? moment(val).format('YYYY-MM-DD') : '-'),
      },
      {
        title: '需求日期',
        dataIndex: 'needDate',
        render: val => (val ? moment(val).format('YYYY-MM-DD') : '-'),
      },
      {
        title: '计划到货日期',
        dataIndex: 'expectArriveDate',
        render: val => (val ? moment(val).format('YYYY-MM-DD') : '-'),
      },
      {
        title: '实际到货日期',
        dataIndex: 'actualArriveDate',
        render: val => (val ? moment(val).format('YYYY-MM-DD') : '-'),
      },
    ];
    return (
      <Fragment>
        {this.props.showBtn && (
          <Button style={{ marginBottom: 16 }} type="primary" onClick={this.toogleModal}>新增</Button>
        )}
        <Table
          rowKey="id"
          dataSource={data.purchaseOrders || []}
          expandedRowRender={(record) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <p>备注：</p>
                  <p>{record.description || '-'}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p>驳回理由：</p>
                  <p>{record.purchaseRejectDescription || '-'}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p>作废理由：</p>
                  <p>{record.purchaseInvaildDescription || '-'}</p>
                </div>
              </div>
            );
          }}
          columns={columns}
          pagination={false}
          scroll={{ x: 1400 }}
        />
        <ModalForm
          visible={this.state.visible}
          currentItem={this.state.currentItem}
          currentUser={this.props.currentUser}
          onCancel={() => this.setState({ visible: false, currentItem: null })}
          onSubmit={this.handleFormSubmit}
        />
        <ArrivedModal
          visible={this.state.arriveVisible}
          data={this.state.currentItem}
          onCancel={() => this.setState({ arriveVisible: false, currentItem: null })}
          onSubmit={this.handleArriveSubmit}
        />
        <StopedModal
          title={this.state.type === 'reject' ? '状态改为已驳回' : '状态改为作废'}
          visible={this.state.stopedVisible}
          onCancel={() => this.setState({ stopedVisible: false, currentItem: null })}
          onSubmit={this.handleStopedSubmit}
        />
      </Fragment>
    );
  }
}

export default PurchaseList;

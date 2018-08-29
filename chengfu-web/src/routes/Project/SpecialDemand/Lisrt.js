import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Button, Divider, Popconfirm } from 'antd';
import StopedModal from '../../../components/StopedModal';
import HasPermission from '../../../utils/HasPermission';
import FormModal from './FormModal';

const auditStatusTextMap = {
  preAudit: '待审核',
  aduited: '已通过',
  rejected: '已驳回',
};

@connect(({ projectDetail, user: { currentUser } }) => ({
  projectDetail,
  currentUser,
}))
export default class Lisrt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      stopedVisible: false,
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

  handleOpenStopModal = (item) => {
    this.setState({ currentItem: item }, () => {
      this.toggleStopenModal();
    });
  }

  toggleStopenModal = () => {
    this.setState({ stopedVisible: !this.state.stopedVisible });
  }

  handleFormSubmit = (v) => {
    const { data = {} } = this.props.projectDetail;
    this.props.dispatch({
      type: 'projectDetail/saveNeedItem',
      payload: { ...v, projectId: data.id },
    });
    this.toogleModal();
  }

  handleStopedSubmit = (description) => {
    const { currentItem: { id } } = this.state;
    this.props.handleEditAuditStatus(id, 'need', 'rejected', description);
    this.toggleStopenModal();
  }

  handleAduitedStatus = (id) => {
    this.props.handleEditAuditStatus(id, 'need', 'aduited', '');
  }

  render() {
    const { data = {} } = this.props.projectDetail;
    const columns = [{
      title: '操作',
      dataIndex: 'operator',
      render: (val, record) => {
        return (
          <Fragment>
            {(this.props.showBtn && record.auditStatus === 'preAudit') ? (
              <Fragment>
                <HasPermission perms={['project:edit']}>
                  <a onClick={() => this.handleOpenModal(record)}>编辑</a>
                </HasPermission>
                <HasPermission perms={['project:needAudit']}>
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
                  <a onClick={() => this.handleOpenStopModal(record)}>驳回</a>
                </HasPermission>
              </Fragment>
            ) : '-'}
          </Fragment>
        );
      },
    }, {
      title: '申请人',
      dataIndex: 'createdBy',
    }, {
      title: '申请时间',
      dataIndex: 'applyDate',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : '-'),
    }, {
      title: '申请事由',
      dataIndex: 'applyReason',
    }, {
      title: '审核状态',
      dataIndex: 'auditStatus',
      render: val => auditStatusTextMap[val],
    }];
    return (
      <Fragment>
        {this.props.showBtn && (
          <Button type="primary" onClick={this.toogleModal} style={{ marginBottom: 16 }}>新增</Button>
        )}
        <Table
          dataSource={data.needRecords || []}
          columns={columns}
          pagination={false}
          expandedRowRender={(record) => {
            return (
              <Fragment>
                <p>详细说明：{record.applyDetail || '-'}</p>
                <p>驳回理由：{record.rejectDescription || '-'}</p>
              </Fragment>
            );
          }}
        />
        <FormModal
          visible={this.state.visible}
          currentItem={this.state.currentItem}
          currentUser={this.props.currentUser}
          onCancel={() => this.setState({ visible: false, currentItem: null })}
          onSubmit={this.handleFormSubmit}
        />
        <StopedModal
          title="状态改为已驳回"
          visible={this.state.stopedVisible}
          onCancel={() => this.setState({ stopedVisible: false })}
          onSubmit={this.handleStopedSubmit}
        />
      </Fragment>
    );
  }
}

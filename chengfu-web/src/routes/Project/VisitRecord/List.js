import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import ModalForm from './ModalForm';
import HasPermission from '../../../utils/HasPermission';

@connect(({ projectDetail, user: { currentUser } }) => ({
  projectDetail,
  currentUser,
}))
export default class VisitRecordList extends Component {
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
      type: 'projectDetail/saveVisitItem',
      payload: { ...v, projectId: data.id },
    });
    this.toogleModal();
  }

  render() {
    const { data = {} } = this.props.projectDetail;
    const columns = [
      {
        title: '操作',
        dataIndex: 'operator',
        render: (val, record) => {
          return (
            <HasPermission perms={['project:edit']}>
              {this.props.showBtn ? (
                <a onClick={() => this.handleOpenModal(record)}>编辑</a>
              ) : '-'}
            </HasPermission>
          );
        },
      },
      {
        title: '姓名',
        dataIndex: 'createdBy',
      },
      {
        title: '拜访时间',
        dataIndex: 'startDate',
        render: (val, record) => `${moment(val).format('YYYY-MM-DD')} ~ ${moment(record.endDate).format('YYYY-MM-DD')}`,
      },
      {
        title: '随行人员',
        dataIndex: 'followUser',
        render: val => val.join('、'),
      },
    ];
    return (
      <Fragment>
        {this.props.showBtn && (
          <Button style={{ marginBottom: 16 }} type="primary" onClick={this.toogleModal}>新增</Button>
        )}
        <Table
          rowKey="id"
          dataSource={data.visitRecords || []}
          columns={columns}
          pagination={false}
          expandedRowRender={record => <p style={{ margin: 0 }}>拜访详情：{record.visitDetail || '-'}</p>}
        />
        <ModalForm
          visible={this.state.visible}
          currentUser={this.props.currentUser}
          currentItem={this.state.currentItem}
          onCancel={() => this.setState({ visible: false, currentItem: null })}
          onSubmit={this.handleFormSubmit}
        />
      </Fragment>
    );
  }
}

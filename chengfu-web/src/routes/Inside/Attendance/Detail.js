import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Button, Row, Col, Card, Modal, Table, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FormLoading from '../../../components/FormLoading';
import StopedModal from '../../../components/StopedModal';
import BatchImport from '../../../components/BatchImport';
import OverText from '../../../components/OverText';
import HasPermission from '../../../utils/HasPermission';
import { formatNum } from '../../../utils/utils';
import ItemsModal from './ItemsModal';
import styles from '../Detail.less';

const { confirm } = Modal;

const statusTextMap = {
  preview: '预览',
  preAudit: '待审核',
  aduited: '已通过',
  rejected: '已驳回',
};

@connect(({ attendanceForm }) => ({
  attendanceForm,
}))
@FormLoading({
  isLoading: ({ attendanceForm }) => attendanceForm.loading,
})
export default class AttendanceDetail extends Component {
  state = {
    visible: false,
    itemVisible: false,
    currentItem: null,
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'attendanceForm/fetch',
      payload: id,
    });
  }

  handleStoped = (description) => { // 驳回
    const { data = {} } = this.props.attendanceForm;
    this.props.dispatch({
      type: 'attendanceForm/editStatus',
      payload: { ...data, rejectedDescription: description, status: 'rejected' },
    });
    this.toggleStopenModal();
  }

  handleEditStatus = () => {
    const { dispatch } = this.props;
    const { data = {} } = this.props.attendanceForm;
    const { status } = data;
    const nextStatusMap = {
      preview: 'preAudit',
      preAudit: 'aduited',
    };
    const nextStatusTextMap = {
      preview: '提审',
      preAudit: '通过',
    };
    confirm({
      title: `您确定要${nextStatusTextMap[status]}吗`,
      content: '一经操作，不得撤回',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'attendanceForm/editStatus',
          payload: { ...data, status: nextStatusMap[status] },
        });
      },
    });
  }

  toggleStopenModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  toggleItemModal = () => {
    this.setState({ itemVisible: !this.state.itemVisible });
  }

  handleItemSubmit = (p) => {
    const { data = {} } = this.props.attendanceForm;
    const { items = [] } = data;
    const newItems = items && items.length ? [...items] : [];
    if (p && p.id) {
      const index = newItems.findIndex(i => i.id === p.id);
      newItems[index] = {
        ...p,
      };
    } else {
      newItems.push(p);
    }
    this.props.dispatch({
      type: 'attendanceForm/save',
      payload: {
        ...data,
        items: newItems,
      },
    });
    this.toggleItemModal();
  }

  handleOpenItemModal = (item = null) => {
    this.setState({ currentItem: item }, () => {
      this.toggleItemModal();
    });
  }

  handleRemoveItem = (itemId) => {
    const { data = {} } = this.props.attendanceForm;
    const newItems = data && data.items.filter(i => i.id !== itemId);
    this.props.dispatch({
      type: 'attendanceForm/save',
      payload: { ...data, items: newItems },
    });
    // this.props.dispatch({
    //   type: 'attendanceForm/removeItem',
    //   payload: {
    //     itemId,
    //     id: data.id,
    //   },
    // });
  }

  renderActionBtn = (data) => {
    const { status } = data;
    if (status === 'preview') {
      return (
        <HasPermission perms={['inside:attendance:audit']}>
          <Button type="primary" onClick={this.handleEditStatus}>提审</Button>
        </HasPermission>
      );
    } else if (status === 'preAudit') {
      return (
        <HasPermission perms={['inside:attendance:audit']}>
          <Fragment>
            <Button type="danger" onClick={this.toggleStopenModal}>驳回</Button>
            <Button type="primary" onClick={this.handleEditStatus}>通过</Button>
          </Fragment>
        </HasPermission>
      );
    }
  }

  renderAction = (data) => {
    return (
      this.renderActionBtn(data)
    );
  }

  renderExtra = (data) => {
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusTextMap[data.status]}</div>
          {data.status === 'rejected' && (
            <OverText title="驳回备注" value={data.rejectedDescription} />
          )}
        </Col>
      </Row>
    );
  }

  renderColumns = (data) => {
    const { status } = data;
    const columns = [
      {
        title: '工号',
        dataIndex: 'jobNumber',
        width: 100,
        fixed: 'left',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        fixed: 'left',
      },
      {
        title: '所属部门',
        dataIndex: 'deptName',
        width: 100,
        fixed: 'left',
      },
      {
        title: '工作时数',
        width: 200,
        children: [{
          title: '标准',
          width: 100,
          dataIndex: 'normalWorkHours',
        }, {
          title: '实际',
          width: 100,
          dataIndex: 'actualWorkHours',
        }],
      },
      {
        title: '迟到',
        width: 200,
        children: [{
          title: '次数',
          width: 100,
          dataIndex: 'lateTimes',
          render: val => formatNum(val),
        }, {
          title: '分数',
          width: 100,
          dataIndex: 'lateHours',
        }],
      },
      {
        title: '早退',
        width: 200,
        children: [{
          title: '次数',
          width: 100,
          dataIndex: 'earlyTimes',
          render: val => formatNum(val),
        }, {
          title: '分数',
          width: 100,
          dataIndex: 'earlyHours',
        }],
      },
      {
        title: '加班时数',
        width: 200,
        children: [{
          title: '正常',
          width: 100,
          dataIndex: 'normalOverHours',
        }, {
          title: '特殊',
          width: 100,
          dataIndex: 'especialOverHours',
        }],
      },
      {
        title: '标准出勤天数',
        width: 150,
        dataIndex: 'normalOnDutyDays',
      },
      {
        title: '实际出勤天数',
        width: 150,
        dataIndex: 'actualOnDutyDays',
      },
      {
        title: '出差（天）',
        width: 150,
        dataIndex: 'travelDays',
      },
      {
        title: '旷工（天）',
        width: 150,
        dataIndex: 'absenteeismDays',
      },
      {
        title: '请假（天）',
        width: 150,
        dataIndex: 'leaveDays',
      },
    ];

    if (status === 'preview') {
      columns.unshift({
        title: '操作',
        fixed: 'left',
        width: 150,
        dataIndex: 'operation',
        render: (val, item) => {
          return (
            <Fragment>
              <a onClick={() => this.handleOpenItemModal(item)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="您确定要删除吗？" okText="是" cancelText="否" onConfirm={() => this.handleRemoveItem(item.id)}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      });
    }

    return columns;
  }

  render() {
    const { data = {} } = this.props.attendanceForm;
    return (
      <PageHeaderLayout
        title={`名称：${data.name}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={this.renderAction(data)}
        extraContent={this.renderExtra(data)}
      >
        <Card
          title="考勤汇总表"
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          {data.status === 'preview' && (
            <Fragment>
              <Button type="primary" style={{ marginBottom: 16, marginRight: 8 }} onClick={() => this.handleOpenItemModal()}>新增</Button>
              <BatchImport
                url={`/api/attendance/${data.id}/excel`}
                onChange={this.fetch}
              />
            </Fragment>
          )}
          <Table
            rowKey="id"
            bordered
            dataSource={data.items || []}
            columns={this.renderColumns(data)}
            pagination={false}
            scroll={{ x: data.status === 'preview' ? 2000 : 1850 }}
          />
        </Card>
        <StopedModal
          title="状态修改为已驳回"
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          onSubmit={this.handleStoped}
        />
        <ItemsModal
          visible={this.state.itemVisible}
          data={this.state.currentItem}
          onCancel={() => this.setState({ itemVisible: false, currentItem: null })}
          onSubmit={this.handleItemSubmit}
        />
      </PageHeaderLayout>
    );
  }
}

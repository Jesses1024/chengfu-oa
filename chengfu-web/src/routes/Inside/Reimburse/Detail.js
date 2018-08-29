import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Row, Col, Card, Modal, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import FormLoading from '../../../components/FormLoading';
import OverText from '../../../components/OverText';
import StopedModal from '../../../components/StopedModal';
import HasPermission from '../../../utils/HasPermission';
import TableForm from './TableForm';
import styles from '../Detail.less';

const { Description } = DescriptionList;
const { confirm } = Modal;

const paidTypeTextMap = {
  loan: '贷款',
  fixedAssets: '固定资产',
  cost: '费用',
};

const statusTextMap = {
  preReview: '预览',
  preAudit: '待审批',
  deptLeaderAudit: '部门通过',
  deptLeaderReject: '部门驳回',
  financeAudit: '财务通过',
  financeReject: '财务驳回',
  prepaid: '待付款',
  leaderReject: '总经理驳回',
  paided: '付讫',
};

@connect(({ reimburseDetail }) => ({
  reimburseDetail,
}))
@FormLoading({
  isLoading: ({ reimburseDetail }) => reimburseDetail.loading,
})
@Form.create()
export default class LeaveDetail extends Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'reimburseDetail/fetch',
      payload: id,
    });
  }

  handleStoped = (description) => { // 驳回
    const { data = {} } = this.props.reimburseDetail;
    const { auditStatus } = data;
    const rejectedStatusMap = {
      preAudit: 'deptLeaderReject',
      deptLeaderAudit: 'financeReject',
      financeAudit: 'leaderReject',
    };
    this.props.dispatch({
      type: 'reimburseDetail/saveInfo',
      payload: {
        ...data,
        rejectDescription: description,
        auditStatus: rejectedStatusMap[auditStatus],
      },
    });
    this.toggleStopenModal();
  }

  handleStatusConfirm = () => { // 通过
    const { dispatch, reimburseDetail: { data = {} } } = this.props;
    const { auditStatus } = data;
    const nextStatusTextMap = {
      preReview: '提审',
      preAudit: '通过',
      deptLeaderAudit: '通过',
      financeAudit: '通过',
      prepaid: '付讫',
    };
    const nextStatusMap = {
      preReview: 'preAudit',
      preAudit: 'deptLeaderAudit',
      deptLeaderAudit: 'financeAudit',
      financeAudit: 'prepaid',
      prepaid: 'paided',
    };
    confirm({
      title: `您确定要${nextStatusTextMap[auditStatus]}吗？`,
      content: '一经操作，不得撤回',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'reimburseDetail/saveInfo',
          payload: { ...data, auditStatus: nextStatusMap[auditStatus] },
        });
      },
    });
  }

  gotoEdit = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/inside/reimburse-form',
      search: `?id=${id}`,
    }));
  }

  goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/inside/reimburse-list',
    }));
  }

  toggleStopenModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleItemChange = (items) => {
    const { data = {} } = this.props.reimburseDetail;
    this.props.dispatch({
      type: 'reimburseDetail/saveInfo',
      payload: { ...data, items },
    });
  }

  renderActionOperation = (data) => {
    const { auditStatus } = data;
    if (auditStatus === 'preReview') {
      return (
        <Fragment>
          <HasPermission perms={['inside:reimburse:edit']}>
            <Button onClick={() => this.gotoEdit(data.id)}>编辑</Button>
            <Button type="primary" onClick={this.handleStatusConfirm}>提审</Button>
          </HasPermission>
        </Fragment>
      );
    } else if (auditStatus === 'preAudit') {
      return (
        <Fragment>
          <HasPermission perms={['inside:reimburse:deptAudit']}>
            <Button type="danger" onClick={this.toggleStopenModal}>驳回</Button>
            <Button type="primary" onClick={this.handleStatusConfirm}>通过</Button>
          </HasPermission>
        </Fragment>
      );
    } else if (auditStatus === 'deptLeaderAudit') {
      return (
        <Fragment>
          <HasPermission perms={['inside:reimburse:inanceAudit']}>
            <Button type="danger" onClick={this.toggleStopenModal}>驳回</Button>
            <Button type="primary" onClick={this.handleStatusConfirm}>通过</Button>
          </HasPermission>
        </Fragment>
      );
    } else if (auditStatus === 'financeAudit') {
      return (
        <Fragment>
          <HasPermission perms={['inside:reimburse:leaderAudit']}>
            <Button type="danger" onClick={this.toggleStopenModal}>驳回</Button>
            <Button type="primary" onClick={this.handleStatusConfirm}>通过</Button>
          </HasPermission>
        </Fragment>
      );
    } else if (auditStatus === 'prepaid') {
      return (
        <Fragment>
          <Button onClick={this.goBack}>返回</Button>
          <HasPermission perms={['inside:reimburse:edit']}>
            <Button type="primary" onClick={this.handleStatusConfirm}>付讫</Button>
          </HasPermission>
        </Fragment>
      );
    } else if (auditStatus === 'deptLeaderReject' || auditStatus === 'financeReject' || auditStatus === 'paided') {
      return (
        <Button onClick={this.goBack}>
          返回
        </Button>
      );
    }
  }

  renderAction = (data) => {
    return (
      this.renderActionOperation(data)
    );
  }

  renderDescription = (data) => {
    const paidType = data && data.paidType && data.paidType.map(i => paidTypeTextMap[i]);
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="姓名">{data.receiveName}</Description>
        <Description term="开户银行">{data.bankName}</Description>
        <Description term="银行账号">{data.bankNumber}</Description>
        <Description term="报销类型">{paidType && paidType.length && paidType.join('、')}</Description>
        <Description term="摘要说明"><OverText value={data.description} /></Description>
      </DescriptionList>
    );
  }

  renderExtra = (data) => {
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusTextMap[data.auditStatus]}</div>
          {(data.auditStatus === 'deptLeaderReject' || data.auditStatus === 'financeReject' || data.auditStatus === 'leaderReject') && (
            <OverText value={data.rejectDescription} />
          )}
        </Col>
      </Row>
    );
  }

  render() {
    const { data = {} } = this.props.reimburseDetail;
    return (
      <PageHeaderLayout
        title={`提审人：${data.applyName}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={this.renderAction(data)}
        content={this.renderDescription(data)}
        extraContent={this.renderExtra(data)}
      >
        <Card
          title="报销内容"
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <TableForm
            value={data.items || []}
            hideBtn={data.auditStatus !== 'preReview'}
            onChange={this.handleItemChange}
          />
        </Card>
        <StopedModal
          title="状态修改为已驳回"
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          onSubmit={this.handleStoped}
        />
      </PageHeaderLayout>
    );
  }
}

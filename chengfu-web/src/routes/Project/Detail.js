import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Row, Col, Card, Modal, message, Popover } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import FormLoading from '../../components/FormLoading';
import OverText from '../../components/OverText';
import HasPermission from '../../utils/HasPermission';
import StopedModal from './StopedModal';
import TableForm from './TableForm';
import VisitRecordTable from './VisitRecord/List';
import SpecialDemandTable from './SpecialDemand/Lisrt';
import InquiryPriceList from './InquiryPrice/List';
import PurchaseList from './Purchase/List';
import ContractModal from './ContractModal';
import styles from './Detail.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { confirm } = Modal;

const auditStatusTextMap = {
  preAudit: '待审核',
  aduited: '已通过',
  rejected: '已驳回',
};

const typeTextMap = {
  gas: '废气',
  water: '废水',
  solid: '固废',
};

const stopedTypeTextMap = {
  noWish: '对方无购买意愿',
  against: '同行比价',
  highPrice: '认为价格偏高',
  dissatisfy: '无法满足对方需求',
  lowProfit: '利润低或者无利润',
  shortPeriod: '工期不能满足',
  other: '其他',
};

const statusTextMap = {
  preRecord: '项目预录',
  preAudit: '立项待审核',
  following: '项目跟进',
  signed: '已签约',
  completed: '完成',
  stoped: '终止',
};

const operationTabList = [{
  key: 'visit',
  tab: '拜访记录',
}, {
  key: 'change',
  tab: '变更记录',
}, {
  key: 'special',
  tab: '特殊需求',
}];

const billTabList = [{
  key: 'inquiry',
  tab: '询价单',
}, {
  key: 'purchase',
  tab: '采购单',
}];

@connect(({ projectDetail }) => ({
  projectDetail,
}))
@FormLoading({
  isLoading: ({ projectDetail }) => projectDetail.loading,
})
export default class ProjectDetail extends Component {
  state = {
    operationkey: 'visit',
    billTabKey: 'inquiry',
  }

  componentDidMount() {
    this.fetch();
  }


  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  handleBillTabKeyChange = (key) => {
    this.setState({ billTabKey: key });
  }

  fetch = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'projectDetail/fetch',
      payload: id,
    });
  }

  handleStoped = (params) => {
    this.props.dispatch({
      type: 'projectDetail/editStatus',
      payload: { ...params, status: 'stoped' },
    });
  }

  handleEditStatus = (status, id) => {
    const { dispatch, projectDetail: { data = {} } } = this.props;
    const nextStatusTextMap = {
      preAudit: '待审核',
      following: '跟进中',
      signed: '已签约',
      completed: '已完成',
    };
    if (status === 'signed' && data.priceAuditStatus !== 'aduited' && data.contractAuditStatus !== 'aduited') {
      return message.error('项目报价和合同必须审核通过才能签约');
    }
    confirm({
      title: `您确定要将状态改为${nextStatusTextMap[status]}`,
      content: '一经操作，不可撤回',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        dispatch({
          type: 'projectDetail/editStatus',
          payload: { status, id },
        });
      },
      onCancel: () => { },
    });
  }

  handleSaveItems = (items) => {
    const { projectDetail: { data = {} } } = this.props;
    this.props.dispatch({
      type: 'projectDetail/save',
      payload: { ...data, items, priceAuditStatus: null },
    });
  }

  handleAuditPrice = () => { // 提审报价
    const { dispatch, projectDetail: { data = {} } } = this.props;
    const { items = [] } = data;
    const isNotfound = items.findIndex(i => !i.onePrice);
    if (!isNotfound) {
      return message.error(`第${isNotfound + 1}条报价为0或者为空`);
    }
    confirm({
      title: '您确定要提审报价单吗',
      content: '一经操作，不可撤回',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        dispatch({
          type: 'projectDetail/editAuditStatus',
          payload: { auditStatus: 'preAudit', auditType: 'price', id: data.id },
        });
      },
      onCancel: () => { },
    });
  }

  handleAuditRejected = (id, auditType, { invaildReason }) => { // 单据审核驳回
    this.handleEditAuditStatus(id, auditType, 'rejected', invaildReason);
  }

  handleAduitedStatus = (id, auditType) => { // 单据审核通过操作
    const self = this;
    const auditTypeTextMap = {
      price: '报价单',
      need: '特殊需求',
      purchase: '采购单',
    };
    confirm({
      title: `您确定要将${auditTypeTextMap[auditType]}状态改为已通过`,
      content: '一经操作，不可撤回',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        self.handleEditAuditStatus(id, auditType, 'aduited');
      },
      onCancel: () => { },
    });
  }

  handleEditAuditStatus = (id, auditType, auditStatus, rejectDescription = '') => { // 单据审核
    const { data = {} } = this.props.projectDetail;
    this.props.dispatch({
      type: 'projectDetail/editAuditStatus',
      payload: {
        id,
        auditStatus,
        auditType,
        rejectDescription,
        projectId: data.id,
      },
    });
  }

  renderMainOperate = (data) => { // render 主操作
    const { status, id } = data;
    if (status === 'preRecord') { // 状态为预录
      return (
        <Button type="primary" onClick={() => this.handleEditStatus('preAudit', id)}>提审</Button>
      );
    } else if (status === 'preAudit') { // 状态为待审核
      return (
        <HasPermission perms={['project:projectAudit']}>
          <Fragment>
            <StopedModal
              showType
              title="状态改为驳回"
              linkText="驳回"
              stopedSubmit={v => this.handleStoped({ ...v, id })}
            />
          </Fragment>
          <Button type="primary" onClick={() => this.handleEditStatus('following', id)}>通过</Button>
        </HasPermission>
      );
    } else if (status === 'following') { // 状态为跟进中
      return (
        <Button type="primary" onClick={() => this.handleEditStatus('signed', id)}>签约</Button>
      );
    } else if (status === 'signed') {
      return (
        <Button type="primary" onClick={() => this.handleEditStatus('completed', id)}>完成</Button>
      );
    }
  }

  renderAction = (data) => {
    return (
      <Fragment>
        <ButtonGroup>
          {(data.status === 'preRecord' || data.status === 'following') && (
            <StopedModal
              showType
              title="状态改为作废"
              linkText="作废"
              stopedSubmit={v => this.handleStoped({ ...v, id: data.id })}
            />
          )}
          {(data.status === 'following' || data.status === 'signed' || data.status === 'completed') && (
            <ContractModal list={data.attachment || []} />
          )}
        </ButtonGroup>
        {this.renderMainOperate(data)}
      </Fragment>
    );
  }

  renderDescription = (data) => {
    const typeArr = data && data.type && data.type.length && data.type.map(i => typeTextMap[i]);
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="行业类型">{data.industryType}</Description>
        <Description term="项目类型">{typeArr ? typeArr.join('、') : '-'}</Description>
        <Description term="所在地区">{data.area}</Description>
        <Description term="对接人姓名">{data.linkmanName}</Description>
        <Description term="对接人职务">{data.linkmanJob}</Description>
        <Description term="联系方式">{data.linkemanContactWay}</Description>
        <Description term="计划时间">{moment(data.startDate).format('YYYY-MM-DD')}</Description>
        <Description term="项目说明"><OverText value={data.description} /></Description>
        <Description term="终止类型">{data.invaildType ? stopedTypeTextMap[data.invaildType] : '-'}</Description>
        <Description term="终止原因">{data.invaildReason ? <OverText value={data.invaildReason} /> : '-'}</Description>
      </DescriptionList>
    );
  }

  renderExtra = (data) => {
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusTextMap[data.status]}</div>
        </Col>
      </Row>
    );
  }

  renderItemExtra = (data) => {
    if (data.priceAuditStatus === 'preAudit') {
      return (
        <HasPermission perms={['project:priceAudit']}>
          <Fragment>
            <StopedModal
              btnStyle={{ marginRight: 8 }}
              title="状态改为驳回"
              linkText="驳回"
              stopedSubmit={v => this.handleAuditRejected(data.id, 'price', { ...v })}
            />
            <Button type="primary" onClick={() => this.handleAduitedStatus(data.id, 'price')}>通过</Button>
          </Fragment>
        </HasPermission>
      );
    }
    return '';
  }

  render() {
    const { data = {} } = this.props.projectDetail;
    // const hideListBtn = data.status === 'preAudit'
    // || data.status === 'stoped' || data.status === 'completed' || data.status === 'signed';
    const contentList = {
      visit: <VisitRecordTable showBtn={data.status === 'following'} />, // 拜访记录
      change: <span>变更记录</span>, // 变更记录
      special: <SpecialDemandTable showBtn={data.status === 'following'} handleEditAuditStatus={this.handleEditAuditStatus} />, // 特殊需求
    };

    const billTabCardList = {
      inquiry: <InquiryPriceList showBtn={data.status === 'signed'} />, // 询价单
      purchase: <PurchaseList showBtn={data.status === 'signed'} handleEditAuditStatus={this.handleEditAuditStatus} />, // 采购单
    };

    const planPriceStatusTextExtra = () => {
      if (!data.priceAuditStatus) {
        return '购买项';
      }
      if (data.priceAuditStatus === 'rejected') {
        return (
          <p>购买项（
            <Popover title="驳回理由" content={<pre style={{ width: '300px' }}>{data.priceRejectDescription}</pre>}>
              <a>{auditStatusTextMap[data.priceAuditStatus]}</a>
            </Popover>
            ）
          </p>
        );
      }
      return `购买项（${auditStatusTextMap[data.priceAuditStatus]}）`;
    };
    return (
      <PageHeaderLayout
        title={`公司名称：${data.companyName}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={this.renderAction(data)}
        content={this.renderDescription(data)}
        extraContent={this.renderExtra(data)}
      >
        <Card
          title={planPriceStatusTextExtra()}
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={this.renderItemExtra(data)}
        >
          <TableForm
            showOffer
            showTotalPrice
            showAudit={data.status === 'following' && !data.priceAuditStatus && data.priceAuditStatus !== 'aduited'}
            hideBtn={(data.priceAuditStatus === 'preAudit' || data.priceAuditStatus === 'aduited') && data.status === 'following'}
            totalPrice={data.totalPrice}
            value={data.items || []}
            onChange={this.handleSaveItems}
            status={data.status}
            handleAuditPrice={this.handleAuditPrice}
          />
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          activeTabKey={this.state.operationkey}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}
        </Card>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={billTabList}
          onTabChange={this.handleBillTabKeyChange}
          activeTabKey={this.state.billTabKey}
        >
          {billTabCardList[this.state.billTabKey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}

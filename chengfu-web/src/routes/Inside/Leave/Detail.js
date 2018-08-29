import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Row, Col, Card, Modal, Form, Radio, Input } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import FormLoading from '../../../components/FormLoading';
import OverText from '../../../components/OverText';
import StopedModal from '../../../components/StopedModal';
import HasPermission from '../../../utils/HasPermission';
import styles from '../Detail.less';

const { Description } = DescriptionList;
const { confirm } = Modal;
const { TextArea } = Input;

const statusTextMap = {
  preReview: '预览',
  preAudit: '待审核',
  hrAudit: '人事通过',
  hrReject: '人事驳回',
  financeAudit: '财务通过',
  financeReject: '财务驳回',
  leaderAudit: '领导通过',
  leaderReject: '领导驳回',
};

// const stepCurrentMap = {
//   preAudit: 0,
//   hrAudit: 1,
//   financeAudit: 2,
//   leaderAudit: 3,
//   aduited: 3,
//   rejected: ,
// };

@connect(({ leaveForm }) => ({
  leaveForm,
}))
@FormLoading({
  isLoading: ({ leaveForm }) => leaveForm.loading,
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
      type: 'leaveForm/fetch',
      payload: id,
    });
  }

  handleStoped = (description) => { // 驳回
    const { data = {} } = this.props.leaveForm;
    const { leaveAuditStatus } = data;
    const nextStatusMap = {
      preAudit: 'hrReject',
      hrAudit: 'financeReject',
      financeAudit: 'leaderReject',
    };
    this.props.dispatch({
      type: 'leaveForm/editStatus',
      payload: {
        ...data,
        rejectDescription: description,
        leaveAuditStatus: nextStatusMap[leaveAuditStatus],
      },
    });
    this.toggleStopenModal();
  }

  handlePass = () => { // 通过
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.handleStatusConfirm({ ...values });
      }
    });
  }

  handleStatusConfirm = (v) => { // 通过
    const { dispatch, leaveForm: { data = {} } } = this.props;
    const { leaveAuditStatus, name } = data;
    let dname = name;
    if (name.indexOf('-') >= 0) {
      const namea = name.split('-')[0];
      dname = namea;
    }
    const nextStatusTextMap = {
      preReview: '提审',
      preAudit: '通过',
      hrAudit: '通过',
      financeAudit: '通过',
    };

    const nextStatusMap = {
      preReview: 'preAudit',
      preAudit: 'hrAudit',
      hrAudit: 'financeAudit',
      financeAudit: 'leaderAudit',
    };
    const nextStatusItemMap = {
      preAudit: 'hrItem',
      hrAudit: 'financeItem',
      financeAudit: 'leaderItem',
    };
    const itemName = nextStatusItemMap[leaveAuditStatus];
    confirm({
      title: `您确定要${nextStatusTextMap[leaveAuditStatus]}吗？`,
      content: '一经操作，不得撤回',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'leaveForm/editStatus',
          payload: {
            ...data,
            [itemName]: { ...v },
            name: dname,
            leaveAuditStatus: nextStatusMap[leaveAuditStatus],
          },
        });
      },
    });
  }

  gotoEdit = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/inside/leave-form',
      search: `?id=${id}`,
    }));
  }

  toggleStopenModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  renderDescription = (data) => {
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="离职时间">{moment(data.leaveDate).format('YYYY-MM-DD')}</Description>
        <Description term="离职原因"><OverText value={data.leaveReason} /></Description>
        <Description term="主管意见"><OverText value={data.deptLeaderOpinion} /></Description>
      </DescriptionList>
    );
  }

  renderExtra = (data) => {
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusTextMap[data.leaveAuditStatus]}</div>
          {(data.leaveAuditStatus === 'deptLeaderReject' || data.leaveAuditStatus === 'financeReject' || data.leaveAuditStatus === 'leaderReject') && (
            <OverText value={data.rejectDescription} />
          )}
        </Col>
      </Row>
    );
  }

  renderAction = (data) => {
    return (
      data.leaveAuditStatus === 'preReview' && (
        <Fragment>
          <Button onClick={() => this.gotoEdit(data.id)}>编辑</Button>
          <Button type="primary" onClick={this.handleStatusConfirm}>提审</Button>
        </Fragment>
      )
    );
  }

  render() {
    const { data = {} } = this.props.leaveForm;
    const { getFieldDecorator } = this.props.form;
    const personnelAudit = data.leaveAuditStatus === 'preAudit';
    const FinanceAudit = data.leaveAuditStatus === 'hrAudit';
    const leaderAudit = data.leaveAuditStatus === 'financeAudit';
    return (
      <PageHeaderLayout
        title={`姓名：${data && data.name && data.name.split('-')[0]}（${data.deptName}）`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={this.renderAction(data)}
        content={this.renderDescription(data)}
        extraContent={this.renderExtra(data)}
      >
        <Card
          title="人事行政"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={personnelAudit && (
            <HasPermission perms={['inside:leave:hrAudit']}>
              <Button style={{ marginRight: 8 }} type="danger" onClick={this.toggleStopenModal}>驳回</Button>
              <Button type="primary" onClick={this.handlePass}>通过</Button>
            </HasPermission>
          )}
        >
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="钥匙/门禁">
                {getFieldDecorator('isKey', {
                  initialValue: data.hrItem && data.hrItem.isKey,
                  rules: [{ required: personnelAudit, message: '请选择是否交还钥匙/门禁' }],
                })(
                  <Radio.Group disabled={!personnelAudit}>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="电脑是否交还">
                {getFieldDecorator('isComputer', {
                  initialValue: data.hrItem && data.hrItem.isComputer,
                  rules: [{ required: personnelAudit, message: '请选择是否交还办公电脑' }],
                })(
                  <Radio.Group disabled={!personnelAudit}>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="资料是否移交">
                {getFieldDecorator('isFile', {
                  initialValue: data.hrItem && data.hrItem.isFile,
                  rules: [{ required: personnelAudit, message: '请选择是否移交资料' }],
                })(
                  <Radio.Group disabled={!personnelAudit}>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="其他物品">
                {getFieldDecorator('otherThings', {
                  initialValue: data.hrItem && data.hrItem.otherThings,
                })(
                  <TextArea rows={3} disabled={!personnelAudit} placeholder="请填写" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          title="财务部"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={FinanceAudit && (
            <HasPermission perms={['inside:leave:inanceAudit']}>
              <Button style={{ marginRight: 8 }} type="danger" onClick={this.toggleStopenModal}>驳回</Button>
              <Button type="primary" onClick={this.handlePass}>通过</Button>
            </HasPermission>
          )}
        >
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="借款结清">
                {getFieldDecorator('isBorrowSettle', {
                  initialValue: data.financeItem && data.financeItem.isBorrowSettle,
                  rules: [{ required: FinanceAudit, message: '请选择是否已结清借款' }],
                })(
                  <Radio.Group disabled={!FinanceAudit}>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="工资结清">
                {getFieldDecorator('isSalarySettle', {
                  initialValue: data.financeItem && data.financeItem.isSalarySettle,
                  rules: [{ required: FinanceAudit, message: '请选择是否已结清工资' }],
                })(
                  <Radio.Group disabled={!FinanceAudit}>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="其他">
                {getFieldDecorator('other', {
                  initialValue: data.financeItem && data.financeItem.other,
                })(
                  <TextArea rows={3} disabled={!FinanceAudit} placeholder="请填写" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card
          title="领导审批"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={leaderAudit && (
            <HasPermission perms={['inside:leave:leaderAudit']}>
              <Button style={{ marginRight: 8 }} type="danger" onClick={this.toggleStopenModal}>驳回</Button>
              <Button type="primary" onClick={this.handlePass}>通过</Button>
            </HasPermission>
          )}
        >
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="领导意见">
                {getFieldDecorator('leaderOpinion', {
                  initialValue: data.leaderItem && data.leaderItem.leaderOpinion,
                })(
                  <TextArea rows={3} disabled={!leaderAudit} placeholder="请填写领导意见" />
                )}
              </Form.Item>
            </Col>
          </Row>
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

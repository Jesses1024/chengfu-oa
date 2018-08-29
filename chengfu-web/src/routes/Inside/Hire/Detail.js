import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Button, Row, Col, Card, Modal, Table } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import FormLoading from '../../../components/FormLoading';
import OverText from '../../../components/OverText';
import StopedModal from '../../../components/StopedModal';
import HasPermission from '../../../utils/HasPermission';
import styles from '../Detail.less';

const { Description } = DescriptionList;
const { confirm } = Modal;

const statusTextMap = {
  pending: '待审核',
  accept: '已通过',
  reject: '已驳回',
  leaved: '已离职',
};

@connect(({ hireDetail }) => ({
  hireDetail,
}))
@FormLoading({
  isLoading: ({ hireDetail }) => hireDetail.loading,
})
export default class HireDetail extends Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'hireDetail/fetch',
      payload: id,
    });
  }

  handleStoped = (description) => { // 驳回
    const { data = {} } = this.props.hireDetail;
    this.props.dispatch({
      type: 'hireDetail/editStatus',
      payload: { ...data, rejectedDescription: description, status: 'reject' },
    });
    this.toggleStopenModal();
  }

  handlePass = () => { // 通过
    const { dispatch, hireDetail: { data = {} } } = this.props;
    confirm({
      title: '您确定要通过该员工吗',
      content: '一经操作，不得撤回',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'hireDetail/editStatus',
          payload: { ...data, status: 'accept' },
        });
      },
    });
  }

  gotoEdit = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/inside/hire-form',
      search: `?id=${id}`,
    }));
  }

  toggleStopenModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  renderAction = (data) => {
    return (
      data.status === 'pending' && (
        <Fragment>
          <HasPermission perms={['inside:hire:edit']}>
            <Button onClick={() => this.gotoEdit(data.id)}>编辑</Button>
          </HasPermission>
          <HasPermission perms={['inside:hire:audit']}>
            <Fragment>
              <Button type="danger" onClick={this.toggleStopenModal}>驳回</Button>
              <Button type="primary" onClick={() => this.handlePass(data.id)}>通过</Button>
            </Fragment>
          </HasPermission>
        </Fragment>
      )
    );
  }

  renderDescription = (data) => {
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="性别">{data.gender === 'male' ? '男' : '女'}</Description>
        <Description term="出生年月">{moment(data.birthday).format('YYYY-MM-DD')}</Description>
        <Description term="籍贯">{data.birthplace}</Description>
        <Description term="备注"><OverText value={data.description} /></Description>
        <Description term="驳回备注"><OverText value={data.rejectedDescription} /></Description>
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

  render() {
    const { data = {} } = this.props.hireDetail;
    const columns = [
      {
        title: '起止日期',
        dataIndex: 'startDate',
        render: (val, record) => <span>{moment(val).format('YYYY-MM-DD')} ~ {moment(record.endDate).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '工作单位',
        dataIndex: 'workUnit',
      },
      {
        title: '职务及职责',
        dataIndex: 'description',
      },
    ];
    return (
      <PageHeaderLayout
        title={`姓名：${data.name}（${data.phoneNumber}）`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        action={this.renderAction(data)}
        content={this.renderDescription(data)}
        extraContent={this.renderExtra(data)}
      >
        <Card
          title="工作安排"
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <DescriptionList className={styles.headerList} size="small" col="3">
            <Description term="能否接受出差">{data.acceptTravel ? '能' : '否'}</Description>
            <Description term="能否接受加班">{data.acceptOvertime ? '能' : '否'}</Description>
            <Description term="能否接受工作调度">{data.acceptJobTransfer ? '能' : '否'}</Description>
          </DescriptionList>
        </Card>
        <Card
          title="受教育信息"
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <DescriptionList className={styles.headerList} size="small" col="3">
            <Description term="学历">{data.education}</Description>
            <Description term="毕业院校">{data.graduatedSchool}</Description>
            <Description term="专业">{data.profession}</Description>
          </DescriptionList>
        </Card>
        <Card
          title="工作经验"
          bordered={false}
        >
          <Table
            rowKey="id"
            dataSource={data.workExperienceList || []}
            pagination={false}
            columns={columns}
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

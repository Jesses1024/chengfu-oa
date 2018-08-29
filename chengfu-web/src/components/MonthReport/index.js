import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Col, Card, Calendar, Button } from 'antd';
import RemoteSelect from '../RemoteSelect';

class MonthReport extends PureComponent {
  static defaultProps = {
    org: {},
    mode: 'month',
    currentDate: moment(),
    renderDaily: () => { },
    renderFullCell: () => { },
    handlePanelChange: () => { },
    handleSelectDateChange: () => { },
    handleSelectOrgChange: () => { },
  }

  static propsType = {
    mode: PropTypes.string.isRequired,
    currentDate: PropTypes.string.isRequired,
    org: PropTypes.object.isRequired,
    renderDaily: PropTypes.func,
    renderFullCell: PropTypes.func,
    handlePanelChange: PropTypes.func,
    handleSelectDateChange: PropTypes.func,
    handleSelectOrgChange: PropTypes.func,
  }

  render() {
    const {
      org,
      mode,
      renderFullCell,
      handlePanelChange,
      handleSelectDateChange,
      handleSelectOrgChange,
      handleMonthReportPush,
    } = this.props;

    return (
      <Row gutter={24}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ marginTop: 24 }}
            title="报表日历"
            extra={<Button type="primary" onClick={handleMonthReportPush}>月报表推送</Button>}
          >
            <Fragment>
              <RemoteSelect
                style={{ width: '70%' }}
                fetcher={this.props.fetcher}
                onChange={handleSelectOrgChange}
                value={org}
                placeholder="请选择物流节点"
              />
            </Fragment>
            <Calendar
              mode={mode}
              fullscreen={false}
              dateCellRender={renderFullCell}
              onSelect={handleSelectDateChange}
              onPanelChange={handlePanelChange}
            />
          </Card>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          {this.props.renderDaily()}
        </Col>
      </Row>
    );
  }
}

export default MonthReport;

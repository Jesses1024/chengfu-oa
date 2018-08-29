import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import { formatNum } from '../../../utils/utils';

const ds = new DataSet();

@autoHeight()
class GroupedColumnBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoHideXLabels: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { autoLabel = true, data } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  handleRoot = (n) => {
    this.root = n;
  };

  handleRef = (n) => {
    this.node = n;
  };

  renderTitleGoods = (goods) => {
    let s = '';
    goods.forEach((i, index) => {
      s += `<p key=${index} style="margin: 0">${i.goodsName}：${formatNum(i.actualWeight)}吨</p>`;
    });
    return s;
  }

  render() {
    const { height, title, forceFit = true, padding, data, fields } = this.props;
    const { autoHideXLabels } = this.state;

    const dv = ds.createView().source(data || []);

    dv.transform({
      type: 'fold',
      fields: fields || [], // 展开字段集
      key: '月份', // key字段
      value: '月均降雨量', // value字段
    });

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <div style={{ marginBottom: 20 }}>{title}</div>}
          <Chart
            height={title ? height - 41 : height}
            data={dv}
            forceFit={forceFit}
            padding={padding || 'auto'}
          >
            <Axis
              name="label"
              label={autoHideXLabels ? false : {}}
              tickLine={autoHideXLabels ? false : {}}
            />
            <Axis name="value" position="right" />
            <Legend />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="interval" position="月份*月均降雨量" color="name" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
          </Chart>
        </div>
      </div>
    );
  }
}

export default GroupedColumnBar;

import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import { formatNum } from '../../../utils/utils';


@autoHeight()
class StackedBar extends Component {
  state = {
    autoHideXLabels: false,
  };

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
    const { data = [], autoLabel = true } = this.props;
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
    const { height, title, forceFit = true, data, padding } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      percent: {
        min: 0,
        formatter(val) {
          return `${(val).toFixed(2)} 吨`;
        },
      },
    };

    const tooltipFormat = [
      'date*percent*classify*goods',
      (date, value, classify, goods) => {
        return {
          title: `
          <span>
          ${date}
          ${this.renderTitleGoods(goods)}
          </span>
          `,
          name: classify,
          value: `${formatNum(value)}吨`,
        };
      },
    ];

    const ds = new DataSet({
      state: {
        start: data[0] && data[0].date,
        end: data[data.length - 1] && data[data.length - 1].date,
      },
    });

    const dv = ds.createView()
      .source(data)
      .transform({
        type: 'aggregate', // 别名summary
        fields: ['value'], // 统计字段集
        operations: ['sum'], // 统计操作集
        groupBy: ['date', 'classify', 'value'], // 分组字段集
        as: ['percent'], // 存储字段集
      });

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <div style={{ marginBottom: 20 }}>{title}</div>}
          <Chart
            height={title ? height - 41 : height}
            data={dv}
            scale={scale}
            forceFit={forceFit}
            padding={padding || 'auto'}
          >
            <Legend />
            <Axis
              name="date"
              label={autoHideXLabels ? false : {}}
              tickLine={autoHideXLabels ? false : {}}
            />
            <Axis name="value" min={0} />
            <Tooltip />
            <Geom
              type="intervalStack"
              position="date*value"
              tooltip={this.props.tooltip && tooltipFormat}
              color="classify"
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export default StackedBar;

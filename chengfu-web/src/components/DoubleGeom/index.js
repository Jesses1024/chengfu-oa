import React, { Component } from 'react';
import { Chart, Geom, Tooltip, Coord, Label, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import classNames from 'classnames';
import ReactFitText from 'react-fittext';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../Charts/autoHeight';
import { formatNum } from '../../utils/utils';

import styles from '../Charts/Pie/index.less';

const { DataView } = DataSet;

const dv = new DataView();
@autoHeight()
class DoubleGeom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legendBlock: false,
    };
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.resize.cancel();
  }

  @Bind()
  @Debounce(300)
  resize() {
    const { hasLegend } = this.props;
    if (!hasLegend || !this.root) {
      window.removeEventListener('resize', this.resize);
      return;
    }
    if (this.root.parentNode.clientWidth <= 380) {
      if (!this.state.legendBlock) {
        this.setState({
          legendBlock: true,
        });
      }
    } else if (this.state.legendBlock) {
      this.setState({
        legendBlock: false,
      });
    }
  }

  render() {
    const { data } = this.props;

    const { legendBlock } = this.state;
    const pieClassName = classNames(styles.pie, {}, {
      [styles.hasLegend]: !!false,
      [styles.legendBlock]: legendBlock,
    });

    const newData = data && data.map(item => ({
      value: item.number,
      type: item.goods && item.goods.category && item.goods.category.name,
      name: item.goods && item.goods.name,
    }));

    dv.source(newData).transform({
      type: 'aggregate',
      fields: ['value'],
      operations: ['sum'],
      as: ['value'],
      groupBy: ['type'],
    });

    const cols = {
      percent: {
        formatter: function formatter(val) {
          return `${formatNum(val)}吨`;
        },
      },
    };

    const dv1 = new DataView();
    dv1.source(newData).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });

    return (
      <div className={pieClassName}>
        <ReactFitText>
          <div className={styles.chart}>
            <Chart
              data={dv}
              scale={cols}
              forceFit
              padding={[12, 0, 12, 0]}
              height={350}
            >
              <Coord type="theta" radius={0.5} />
              <Tooltip
                showTitle={false}
                itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
              />
              <Geom
                type="intervalStack"
                position="value"
                color="type"
                label="type"
                tooltip={['type*value', (item, value) => {
                  return {
                    name: item,
                    value: `${formatNum(value)}吨`,
                  };
                }]}
                style={{ lineWidth: 1, stroke: '#fff' }}
                select={false}
              >
                <Label content="type" offset={-10} />
              </Geom>
              <View data={dv1} scale={cols} >
                <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />
                <Geom
                  type="intervalStack"
                  position="percent"
                  color={['name', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5', '#8EE0A1', '#BAF5C4']]}
                  tooltip={['name*value', (item, value) => {
                    return {
                      name: item,
                      value: `${formatNum(value)}吨`,
                    };
                  }]}
                  style={{ lineWidth: 1, stroke: '#fff' }}
                  select={false}
                >
                  <Label content="name" />
                </Geom>
              </View>
            </Chart>
          </div>
        </ReactFitText>
      </div>
    );
  }
}

export default DoubleGeom;

import React, { Component } from 'react';
import { Spin } from 'antd';
import autoHeight from '../Charts/autoHeight';

@autoHeight()
class GaodeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointData: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.props.orgFetch().then((res) => {
      this.setState({ pointData: res }, () => {
        this.renderMap();
      });
    });
  }

  handleMap = (r) => {
    this.map = r;
  }

  markersPoint = (map) => {
    const { AMap } = window;
    const { pointData } = this.state;
    const markers = [];
    pointData.forEach((item) => {
      if (item.location) {
        if (item.location.indexOf(',') > 0) {
          markers.push({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: item.location && item.location.split(','),
            org: { ...item },
          });
        }
      }
    });

    markers.forEach((i) => {
      const marker = new AMap.Marker({
        map,
        icon: i.icon,
        position: [Number(i.position[0]), Number(i.position[1])],
        offset: new AMap.Pixel(-12, -36),
      });
      marker.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(-10, 35), // 修改label相对于maker的位置
        content: i.org && i.org.name,
      });
      marker.on('click', () => this.props.handleMarkerChange(i.org));
    });
  }

  renderMap = () => {
    if (!this.map) {
      return;
    }
    const { AMap } = window;
    if (AMap && !AMap.Map) {
      return;
    }

    const map = new AMap.Map(this.map);
    AMap.plugin([
      'AMap.ToolBar',
      'AMap.Scale',
    ], () => {
      map.addControl(new AMap.ToolBar());
      map.addControl(new AMap.Scale());
    });
    this.markersPoint(map);
    map.setFitView();
    map.on('complete', () => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
        <div style={{ width: '100%', height: this.props.height }} ref={this.handleMap} />
      </Spin>
    );
  }
}

export default GaodeMap;

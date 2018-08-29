import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class AllExport extends Component {
  static defaultProps = {
    url: null,
    icon: 'download',
    text: '导出',
    btnType: 'primary',
  }
  static propsType = {
    url: PropTypes.string.isRequired,
    icon: PropTypes.string,
    text: PropTypes.string,
    btnType: PropTypes.string,
  }

  handleExport = () => {
    const { url } = this.props;
    window.open(url);
  }

  render() {
    const { text, icon, btnType } = this.props;
    return (
      <Button icon={icon} type={btnType} onClick={this.handleExport}>
        {text}
      </Button>
    );
  }
}

export default AllExport;

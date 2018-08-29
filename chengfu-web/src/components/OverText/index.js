import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

class OverText extends Component {
  static defaultProps = {
    overLength: 10,
    title: '描述',
    isOver: false,
  }
  static propsType = {
    overLength: PropTypes.number,
    value: PropTypes.node.isRequired,
    text: PropTypes.string,
    title: PropTypes.string,
    isOver: PropTypes.bool,
  }

  render() {
    const { overLength, value, text, title } = this.props;
    return (
      <span>
        {this.props.isOver ? (

          <Popover content={(<pre style={{ width: '300px', wordWrap: 'break-word' }}>{value}</pre>)} title={title} trigger="hover">
            <a>{text || '-'}</a>
          </Popover>
          ) : (
              value ? value.length > overLength ? (
                <Popover content={(<pre style={{ width: '300px', wordWrap: 'break-word' }}>{value}</pre>)} title={title} trigger="hover">
                  <a>{text || `${value.substring(0, 10)}...`}</a>
                </Popover>
            ) : (
              <span>{value}</span>
            ) : '-'
          )}
      </span>
    );
  }
}

export default OverText;

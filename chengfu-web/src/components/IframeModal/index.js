import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import DescriptionList from '../DescriptionList';
import { formatNum } from '../../utils/utils';

const { Description } = DescriptionList;

class IframeModal extends Component {
  static defaultProps = {
    text: '',
    title: '',
    modalWidth: 1100,
    iframeHref: '',
    iframeWidth: '100%',
    iframeHeight: '500',
  }

  static propsType = {
    text: PropTypes.node.isRequired,
    title: PropTypes.node,
    modalWidth: PropTypes.number,
    iframeHref: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toogleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { data, text, title, modalWidth, iframeHref, iframeWidth, iframeHeight } = this.props;
    let label = '票号';
    let value = data.ticketNumber;
    if (data.type === 'box') {
      label = '箱号';
      value = data.boxNumber;
    }
    return (
      <span>
        <a onClick={this.toogleModal}>{text}</a>
        <Modal
          style={{ top: 30 }}
          title={title}
          visible={this.state.visible}
          width={modalWidth}
          onCancel={this.toogleModal}
          closable={false}
          footer={[]}
        >
          <div>
            <DescriptionList style={{ marginBottom: 4 }} size="small" col="5">
              <Description term="发货站">{data.dispatchWarehouse && data.dispatchWarehouse.name}</Description>
              <Description term="收货站">{data.receiveWarehouse && data.receiveWarehouse.name}</Description>
              <Description term="车匹号">{data.carNumber}</Description>
              <Description term={label}>{value}</Description>
              <Description term="计费重量/标重">{formatNum(data.receiveNetWeight)} 吨/ {formatNum(data.receiveGrossWeight)} 吨</Description>
            </DescriptionList>
            <iframe
              seamless="seamless"
              scrolling="auto"
              id="iframe"
              title="1"
              height={iframeHeight}
              width={iframeWidth}
              frameBorder="0"
              src={iframeHref}
            />
          </div>
        </Modal>
      </span>
    );
  }
}

export default IframeModal;

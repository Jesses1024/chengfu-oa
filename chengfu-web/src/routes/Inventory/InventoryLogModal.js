import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'antd';
import Modal from '../../components/Modal';
import StandardTable from '../../components/StandardTable';
import styles from './List.less';

class InventoryLogModal extends Component {
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      const { goodsId, warehouseId } = this.props;
      if (err) return;

      const values = {
        ...fieldsValue,
        goodsId,
        warehouseId,
      };

      dispatch({
        type: 'inventoryList/fetchLogList',
        payload: {
          params: values,
          pagination: {
            current: 1,
            pageSize: 10,
          },
        },
      });
    });
  }


  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch, goodsId, warehouseId } = this.props;

    dispatch({
      type: 'inventoryList/fetchLogList',
      payload: {
        params: {
          warehouseId,
          goodsId,
        },
        pagination,
        sorter,
      },
    });
  }

  render() {
    const { loading, dataSource } = this.props;

    const columns = [
      {
        title: '所属仓库',
        dataIndex: 'warehouseName',
      },
      {
        title: '货物名称',
        dataIndex: 'goodsName',
      },
      {
        title: '数量',
        dataIndex: 'number',
      },
      {
        title: '变动类型',
        dataIndex: 'add',
        render: val => <span>{val ? '入库' : '出库'}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'createdBy',
      },
      {
        title: '操作时间',
        dataIndex: 'createdDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'extra',
        render: val => <span>{val || '-'}</span>,
      },
    ];

    return (
      <Modal
        title="库存台账"
        width={800}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={() => this.props.handleCancel()}
        footer={[
          <Button key="back" onClick={this.props.handleCancel}>关闭</Button>,
        ]}
      >
        <div className={styles.tableList}>
          <StandardTable
            loading={loading}
            isRowSelection={null}
            data={dataSource}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Modal>
    );
  }
}

export default InventoryLogModal;

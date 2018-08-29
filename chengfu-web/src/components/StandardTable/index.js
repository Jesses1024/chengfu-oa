import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach((column) => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (!nextProps.isRowSelection) {
      return;
    }
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map((item) => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list, pagination },
      loading, columns, isRowSelection, rowKey, getCheckboxProps,
    } = this.props;

    let newGetCheckboxProps = record => ({ disabled: record.disabled });

    if (getCheckboxProps) {
      newGetCheckboxProps = getCheckboxProps;
    }

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: newGetCheckboxProps,
    };

    return (
      <div className={styles.standardTable}>
        {isRowSelection && (
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {
                    needTotalList.map((item, index) => (
                      <span style={{ marginLeft: 8 }} keys={index}>{item.title}总计&nbsp;
                        <span style={{ fontWeight: 600 }}>
                          {item.render ? item.render(item.total) : item.total}
                        </span>
                      </span>
                    ))
                  }
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
                </Fragment>
              )}
              type="info"
              showIcon
            />
          </div>
        )}
        <Table
          loading={loading}
          rowKey={rowKey || (record => record.key || record.id || record.username)}
          rowSelection={!isRowSelection ? null : rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={this.props.scroll || {}}
        />
      </div>
    );
  }
}

export default StandardTable;

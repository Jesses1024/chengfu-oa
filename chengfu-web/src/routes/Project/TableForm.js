import React, { Component, Fragment } from 'react';
import { Table, InputNumber, Input, Button, Popconfirm } from 'antd';
import { formatNum } from '../../utils/utils';

class TableForm extends Component {
  constructor(props) {
    super(props);
    const data = props.value || [];
    this.state = {
      data,
      isAdd: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      const data = nextProps.value || [];
      this.setState({ data });
    }
  }

  toggleEdit = () => {
    if (this.state.isAdd) {
      this.setState({ data: this.props.value || [] });
    }
    this.setState({ isAdd: !this.state.isAdd });
  }

  addRow = () => {
    const { data } = this.state;
    const newData = [...data];
    newData.push({
      goodsName: '',
      goodsUnit: '',
      number: 0,
      onePrice: null,
      subtotalPrice: null,
    });
    this.setState({ data: newData });
  }

  handleNumberField = (v, field, index, item) => {
    const { data } = this.state;
    const newData = [...data];
    let totalPrice = item.subtotalPrice;
    if ((v === null && v === undefined) || item.onePrice === null) {
      totalPrice = null;
    } else {
      totalPrice = v * item.onePrice;
    }
    newData[index] = {
      ...newData[index],
      [field]: v,
      subtotalPrice: totalPrice,
    };
    this.setState({ data: newData });
  }

  handlePriceField = (v, field, index, item) => {
    const { data } = this.state;
    const newData = [...data];

    let totalPrice = item.subtotalPrice;
    if ((v === null && v === undefined) || item.number === null) {
      totalPrice = null;
    } else {
      totalPrice = v * item.number;
    }
    newData[index] = {
      ...newData[index],
      [field]: v,
      subtotalPrice: totalPrice,
    };
    this.setState({ data: newData });
  }

  handleFieldValueChange = (v, field, index) => {
    const { data } = this.state;
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: v,
    };
    this.setState({ data: newData });
  }

  handleSave = () => {
    this.props.onChange(this.state.data);
    this.toggleEdit();
  }

  handleTotalPrice = (item) => {
    const { number, onePrice } = item;
    if (onePrice === null || number === null) {
      return '-';
    } else {
      return formatNum(onePrice * number);
    }
  }

  handleSubTotalPrice = () => {
    const { data } = this.state;
    let totalPrice = 0;
    if (data && data.length) {
      const newData = data.filter(i => i.subtotalPrice);
      newData.forEach((item) => {
        totalPrice += item.subtotalPrice;
      });
      return formatNum(totalPrice);
    } else {
      return '-';
    }
  }

  handleRemove = (index) => {
    const { data } = this.state;
    const newData = [...data];
    newData.splice(index, 1);
    this.setState({ data: newData });
  }

  renderColumns = () => {
    const columns = [
      {
        title: '货物名',
        dataIndex: 'goodsName',
        render: (val, record, index) => {
          if (this.state.isAdd) {
            return (
              <Input
                defaultValue={val}
                onChange={v => this.handleFieldValueChange(v.target.value, 'goodsName', index)}
              />
            );
          }
          return val;
        },
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        render: (val, record, index) => {
          if (this.state.isAdd) {
            return (
              <Input
                defaultValue={val}
                onChange={v => this.handleFieldValueChange(v.target.value, 'goodsUnit', index)}
              />
            );
          }
          return val;
        },
      },
      {
        title: '数量',
        dataIndex: 'number',
        render: (val, record, index) => {
          if (this.state.isAdd) {
            return (
              <InputNumber
                defaultValue={val}
                onChange={v => this.handleNumberField(v, 'number', index, record)}
              />
            );
          }
          return formatNum(val);
        },
      },
    ];
    if (this.props.showOffer) {
      columns.push({
        title: '报价',
        dataIndex: 'onePrice',
        render: (val, record, index) => {
          if (this.state.isAdd && this.props.status === 'following') {
            return (
              <InputNumber
                defaultValue={val}
                onChange={v => this.handlePriceField(v, 'onePrice', index, record)}
              />
            );
          }
          return formatNum(val);
        },
      }, {
        title: '小计',
        dataIndex: 'subtotalPrice',
        render: (val, record) => <span>{this.handleTotalPrice(record)}</span>,
      });
    }
    if (this.state.isAdd) {
      columns.unshift({
        title: '操作',
        dataIndex: 'operation',
        render: (val, record, index) => {
          return (
            <Popconfirm title="您确定要删除吗" okText="是" cancelText="否" onConfirm={() => this.handleRemove(index)}>
              <a>删除</a>
            </Popconfirm>
          );
        },
      });
    }
    return columns;
  }
  render() {
    return (
      <Fragment>
        {!this.props.hideBtn && (
          this.state.isAdd ? (
            <Fragment>
              <Button style={{ marginBottom: 16, marginRight: 8 }} type="primary" onClick={this.handleSave}>保存</Button>
              <Button onClick={this.toggleEdit}>取消</Button>
            </Fragment>
          ) : (
            <Fragment>
              <Button style={{ marginBottom: 16, marginRight: 8 }} type="primary" onClick={this.toggleEdit}>编辑</Button>
              {this.props.showAudit && (
              <Button style={{ marginBottom: 16 }} type="primary" onClick={this.props.handleAuditPrice}>提审报价</Button>
                )}
            </Fragment>
            )
        )}
        {this.props.showTotalPrice && (
          <p style={{ float: 'right' }}>总计：{this.handleSubTotalPrice()}</p>
        )}
        <Table
          rowKey="id"
          columns={this.renderColumns()}
          dataSource={this.state.data}
          pagination={false}
        />
        {this.state.isAdd && (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.addRow}
            icon="plus"
          >
            新增
          </Button>
        )}
      </Fragment>
    );
  }
}

export default TableForm;

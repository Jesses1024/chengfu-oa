import React, { Component, Fragment } from 'react';
import maxBy from 'lodash/maxBy';
import { Divider, InputNumber, Popconfirm, Input, Select, Button, message } from 'antd';
import EditableTable, { EditableContext } from '../../../components/EditableTable';
import OverText from '../../../components/OverText';
import { formatNum } from '../../../utils/utils';

const reimburseTypeTextMap = {
  office: '办公用品',
  taxi: '打车费',
  telephone: '话费',
  reception: '接待费',
  traffic: '交通费',
  travel: '差旅费',
  other: '其他',
};

class TableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      list: props.values || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ list: nextProps.value || [] });
    }
  }


  onChangeEdit = (editingKey, item) => {
    const { list } = this.state;
    if (!editingKey && item.isAdd) {
      const newList = list.filter(i => i.id !== item.id);
      this.setState({ list: newList });
      // this.props.onChange(newList);
    }
    this.setState({ editingKey });
  }

  handleAddRow = () => {
    const { list } = this.state;
    if (this.state.editingKey) {
      return message.error('请先保存');
    }
    const newList = [...list];
    let maxId = 0;
    if (newList && newList.length) {
      maxId = (maxBy(newList, 'id') || { id: 0 }).id;
    }
    newList.unshift({
      id: maxId + 1,
      weight: 0,
      isAdd: true,
    });
    this.setState({ editingKey: maxId + 1, list: newList });
  }

  saveRow = (form, item) => {
    const { list } = this.state;
    const newList = [...list];
    const index = newList.findIndex(i => i.id === item.id);
    form.validateFields((err, values) => {
      const newItem = { ...item, ...values };
      if (!err) {
        delete newItem.date;
        newList[index] = { ...newItem };
        this.props.onChange(newList);
        this.setState({
          editingKey: '',
          list: [],
        });
      } else {
        const keys = Object.keys(err);
        const key = keys[0];
        const { errors } = err[key];
        return message.error(errors[0].message);
      }
    });
  }

  handleRemove = (id) => {
    const { list } = this.state;
    const data = list.filter(i => i.id !== id);
    this.props.onChange(data);
  }

  renderColumns = () => {
    const columns = [{
      title: '名称',
      dataIndex: 'contentName',
      width: 150,
      editable: true,
      input: (
        <Input placeholder="请填写" />
      ),
    }, {
      title: '报销类型',
      dataIndex: 'reimburseType',
      width: 150,
      editable: true,
      input: (
        <Select style={{ width: '100%' }} placeholder="请选择">
          <Select.Option value="office">办公用品</Select.Option>
          <Select.Option value="taxi">打车费</Select.Option>
          <Select.Option value="telephone">话费</Select.Option>
          <Select.Option value="reception">接待费</Select.Option>
          <Select.Option value="traffic">交通费</Select.Option>
          <Select.Option value="travel">差旅费</Select.Option>
          <Select.Option value="other">其他</Select.Option>
        </Select>
      ),
      render: val => reimburseTypeTextMap[val],
    }, {
      title: '数量',
      dataIndex: 'number',
      editable: true,
      rules: [{ required: true, message: '请填写货物数量' }],
      input: (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
        />
      ),
      render: val => <span>{formatNum(val)}</span>,
    }, {
      title: '金额',
      dataIndex: 'price',
      editable: true,
      rules: [{ required: true, message: '请填写金额' }],
      render: val => formatNum(val),
      input: (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
        />
      ),
    }, {
      title: '备注',
      dataIndex: 'description',
      editable: true,
      render: val => <OverText value={val} />,
      input: (
        <Input placeholder="请输入" />
      ),
    }];
    if (!this.props.hideBtn) {
      columns.unshift({
        title: '操作',
        dataIndex: 'operator',
        render: (text, record) => {
          if (record.id === this.state.editingKey) {
            return (
              <EditableContext.Consumer>
                {form => (
                  <span>
                    <a onClick={() => this.saveRow(form, record)}>保存</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.onChangeEdit('', record)}>取消</a>
                  </span>
                )}
              </EditableContext.Consumer>
            );
          }
          return (
            <Fragment>
              <a onClick={() => this.onChangeEdit(record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="您确定要删除该记录吗?"
                onConfirm={() => this.handleRemove(record.id)}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>
            </Fragment>
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
          <Button type="primary" style={{ marginBottom: 16 }} onClick={this.handleAddRow}>新增</Button>
        )}
        <EditableTable
          rowKey="id"
          editingKey={this.state.editingKey}
          data={[...this.state.list]}
          pagination={false}
          columns={this.renderColumns()}
        />
      </Fragment>
    );
  }
}

export default TableForm;

import React, { Component, Fragment } from 'react';
import { Divider, Popconfirm, InputNumber, Button, message } from 'antd';
import EditableTable, { EditableContext } from '../EditableTable';
import RemoteSelect from '../RemoteSelect';
import { formatNum } from '../../utils/utils';
import request from '../../utils/request';

const goodsFetcher = value => request(`/api/sys/goods?filter=${value}`)
  .then(res => res.list);

class GoodsItemTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      dataSouces: [],
      maxTaskId: props.maxTaskId || 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      if (!this.state.maxTaskId) {
        this.setState({ maxTaskId: nextProps.maxTaskId });
      }
    }
  }

  onChangeEdit = (editingKey, item) => {
    const { dataSouces } = this.state;
    const newList = [...dataSouces];
    if (!editingKey && item.isAdd) {
      const index = newList.findIndex(i => i.id === item.id);
      newList.splice(index, 1);
      this.setState({ dataSouces: newList });
    }
    this.setState({ editingKey });
  }

  handleAddRow = () => {
    const { maxTaskId } = this.state;
    const i = maxTaskId + 1;
    const { dataSouces, editingKey } = this.state;
    if (editingKey) {
      return message.error('请先保存再添加');
    }
    const newDate = [...dataSouces];
    newDate.push({
      id: i,
      isAdd: true,
    });
    this.setState({ dataSouces: newDate, editingKey: i, maxTaskId: i });
  }

  saveRow = (form, item) => {
    const { value: list } = this.props;
    const { dataSouces } = this.state;
    form.validateFields((err, values) => {
      const newItem = { ...item, ...values };
      const newData = [...list, ...dataSouces];
      const isGoodsFound = newData.find(g => g.goods && g.goods.key === newItem.goods.key);
      if (!newItem.goods) {
        return message.error('请填写货物信息');
      }
      if (newItem.isAdd && isGoodsFound) {
        return message.error('已存在该货物');
      }
      delete newItem.isAdd;
      const newList = list.map(i => ({ ...i }));
      const index = newList.findIndex(i => i.id === newItem.id);
      if (index > -1) {
        newList[index] = newItem;
      } else {
        newList.push({ ...newItem });
      }
      this.props.onChange(newList);
      this.setState({ editingKey: '', dataSouces: [] });
    });
  }

  handleRemove = ({ id }) => {
    const { value: list } = this.props;
    const newList = [...list];
    const index = newList.findIndex(i => i.id === id);
    newList.splice(index, 1);
    this.props.onChange([...newList]);
  }

  render() {
    const { dataSouces } = this.state;
    return (
      <div>
        {this.props.isCreate && (
          <Button type="primary" style={{ marginBottom: 16 }} onClick={this.handleAddRow}>
            添加
          </Button>
        )}
        <EditableTable
          rowKey="id"
          editingKey={this.state.editingKey}
          data={[...this.props.value, ...dataSouces]}
          pagination={false}
          onChange={this.props.handleTableChange}
          columns={[{
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
                    onConfirm={() => this.handleRemove(record)}
                    okText="是"
                    cancelText="否"
                  >
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
              );
            },
          }, {
            title: '货物名称',
            dataIndex: 'goods',
            width: 150,
            editable: this.props.isCreate,
            render: item => <span>{item && item.label}</span>,
            input: (
              <RemoteSelect placeholder="请选择" fetcher={goodsFetcher} />
            ),
          }, {
            title: '货物数量（T）',
            dataIndex: 'planWeight',
            editable: true,
            rules: [{ required: true, message: '请填写货物数量' }],
            input: (
              <InputNumber
                min={0}
                style={{ width: '100%' }}
              />
            ),
            render: val => <span>{formatNum(val)}</span>,
          }]}
        />
      </div>
    );
  }
}

export default GoodsItemTable;

import React, { Component, Fragment } from 'react';
import moment from 'moment';
import maxBy from 'lodash/maxBy';
import { Divider, DatePicker, Popconfirm, Input, Button, message } from 'antd';
import EditableTable, { EditableContext } from '../../../components/EditableTable';

const { RangePicker } = DatePicker;

export default class TableForm extends Component {
  constructor(props) {
    super(props);
    const list = props.values && props.values.length ?
      props.values.map(i => ({ ...i, date: [moment(i.startDate), moment(i.endDate)] })) : [];
    this.state = {
      editingKey: '',
      list,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      let list = [];
      if (nextProps.value && nextProps.value.length) {
        list = nextProps.value.map(i => ({
          ...i,
          date: [moment(i.startDate), moment(i.endDate)],
        }));
      }
      this.setState({ list });
    }
  }

  onChangeEdit = (editingKey, item) => {
    const { list } = this.state;
    if (!editingKey && item.isAdd) {
      const newList = list.filter(i => i.id !== item.id);
      this.props.onChange(newList);
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
        const { date } = newItem;
        delete newItem.date;
        newList[index] = { ...newItem, startDate: date[0], endDate: date[1] };
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


  render() {
    const { list } = this.state;
    return (
      <div>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={this.handleAddRow}>
          添加
        </Button>
        <EditableTable
          rowKey="id"
          editingKey={this.state.editingKey}
          data={[...list]}
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
                    onConfirm={() => this.handleRemove(record.id)}
                    okText="是"
                    cancelText="否"
                  >
                    <a>删除</a>
                  </Popconfirm>
                </Fragment>
              );
            },
          }, {
            title: '起止日期',
            dataIndex: 'date',
            width: 350,
            editable: true,
            render: (item, record) => <span>{moment(record.startDate).format('YYYY-MM-DD')} ~ {moment(record.endDate).format('YYYY-MM-DD')}</span>,
            input: (
              <RangePicker placeholder={['请选择', '请选择']} />
            ),
          }, {
            title: '工作单位',
            dataIndex: 'workUnit',
            editable: true,
            rules: [{ required: true, message: '请填写工作单位' }],
            input: <Input />,
          }, {
            title: '职务及职责',
            dataIndex: 'description',
            editable: true,
            rules: [{ required: true, message: '请填写职务及职责' }],
            input: <Input />,
          }]}
        />
      </div>
    );
  }
}

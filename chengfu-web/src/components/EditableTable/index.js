import React from 'react';
import { Form, Table } from 'antd';

export const EditableContext = React.createContext();

const EditableRow = ({ form, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const EditableCell = ({
  editing,
  dataIndex,
  title,
  input,
  record,
  index,
  initialValue,
  rules,
  ...restProps
}) => {
  let defaultValue = record && record[dataIndex];
  if (typeof initialValue === 'function') {
    defaultValue = initialValue(defaultValue);
  } else if (initialValue) {
    defaultValue = initialValue;
  }
  return (
    <EditableContext.Consumer>
      {(form) => {
        const { getFieldDecorator } = form;
        return (
          <td {...restProps}>
            {editing ? (
              getFieldDecorator(dataIndex, {
                rules,
                initialValue: defaultValue,
              })(input)
            ) : (
                restProps.children
              )}
          </td>
        );
      }}
    </EditableContext.Consumer>
  );
};

export default class EditableTable extends React.PureComponent {
  isEditing = (record) => {
    return record[this.props.rowKey] === this.props.editingKey;
  };
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          input: col.input,
          dataIndex: col.dataIndex,
          title: col.title,
          initialValue: col.initialValue,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        rowKey={this.props.rowKey}
        loading={this.props.loading}
        components={components}
        dataSource={this.props.data}
        columns={columns}
        scroll={this.props.scroll}
        pagination={this.props.pagination}
        onChange={this.props.onChange}
      />
    );
  }
}

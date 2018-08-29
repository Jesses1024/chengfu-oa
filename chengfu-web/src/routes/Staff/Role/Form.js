import React, { PureComponent } from 'react';
import qs from 'qs';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, TreeSelect } from 'antd';
import { authorites } from '../../../common/authorites';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FormLoading from '../../../components/FormLoading';
import { arrayToTree } from '../../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ roleForm, user: { currentUser } }) => ({
  roleForm,
  currentUser,
}))
@FormLoading({
  isLoading: ({ roleForm }) => roleForm.loading,
})
@Form.create()
export default class RoleDetail extends PureComponent {
  constructor(props) {
    super(props);
    const { search } = props.location;
    const params = qs.parse(search.substring(1)) || {};
    this.state = {
      id: params.id,
      // parentKey: [],
      // perms: [],
      authorites: arrayToTree(authorites),
      // isChangeTree: false,
    };
  }

  componentDidMount() {
    this.fetch();
  }

  // componentWillReceiveProps(nextProps) {
  //   const { roleForm: { data = {} }, currentUser: { roles } } = nextProps;
  //   const newPerms = [];
  //   this.handleAuth(roles);
  //   if (!data.name) {
  //     return;
  //   }
  //   const perm = [...data.perms];
  //   if (!perm && perm.length === 0) {
  //     return;
  //   }
  //   perm.forEach((i) => {
  //     if (!i.halfChecked) {
  //       newPerms.push({ ...i });
  //     }
  //   });
  //   this.setState({ perms: newPerms });
  // }

  // handleAuth = (roles) => {
  //   if (!roles) {
  //     return this.setState({ authorites: arrayToTree(authorites) });
  //   }
  //   const role = roles[0];
  //   const arr = [];
  //   if (role) {
  //     role.perms.forEach((r) => {
  //       const filterRole = authorites.find(n => n.key === r.authority);
  //       if (filterRole) {
  //         arr.push(filterRole);
  //       }
  //     });
  //     this.setState({ authorites: arrayToTree(arr) });
  //   }
  // }

  fetch = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: 'roleForm/fetch',
      payload: id,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { roleForm: { data } } = this.props;
      if (!err) {
        this.props.dispatch({
          type: 'roleForm/save',
          payload: { ...data, ...values },
        });
      }
    });
  }


  render() {
    const { roleForm: { submitting, data = {} } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { id } = this.state;
    const tProps = {
      treeCheckable: true,
      treeData: this.state.authorites,
      // onChange: this.handleTreeChange,
      searchPlaceholder: '请选择菜单权限',
      dropdownStyle: { height: 150 },
      showCheckedStrategy: TreeSelect.SHOW_ALL,
      // onSelect: this.treeChangeSelect,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title={`角色${id ? '编辑' : '新增'}`}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [{ required: true, message: '请输入角色名称' }],
              })(
                <Input placeholder="请输入角色名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限"
            >
              {getFieldDecorator('perms', {
                initialValue: data.perms || [],
                rules: [{ required: true, message: '请选择菜单权限' }],
              })(
                <TreeSelect style={{ width: '100%' }} {...tProps} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('description', {
                initialValue: data.description,
              })(
                <TextArea rows={4} placeholder="请填写" />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: '8px' }} type="Default" onClick={() => this.props.dispatch(routerRedux.goBack())}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

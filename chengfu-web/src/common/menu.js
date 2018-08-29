import { isUrl, hasPerms } from '../utils/utils';

const menuData = [
  // {
  //   name: '库存管理',
  //   icon: 'home',
  //   path: 'inventory',
  //   authority: 'inventory',
  //   children: [{
  //     name: '仓库信息',
  //     path: 'warehouse-list',
  //     authority: hasPerms('inventory:warehouse:view'),
  //   }, {
  //     name: '仓库编辑',
  //     path: 'warehouse-form',
  //     hideInMenu: true,
  //     authority: hasPerms('inventory:warehouse:edit'),
  //   }, {
  //     name: '仓位信息',
  //     path: 'position-list',
  //     authority: hasPerms('inventory:position:view'),
  //   }, {
  //     name: '仓位编辑',
  //     path: 'position-form',
  //     hideInMenu: true,
  //     authority: hasPerms('inventory:position:edit'),
  //   }, {
  //     name: '货架信息',
  //     path: 'shelf-list',
  //     authority: hasPerms('inventory:shelf:view'),
  //   }, {
  //     name: '货架编辑',
  //     path: 'shelf-form',
  //     hideInMenu: true,
  //     authority: hasPerms('inventory:shelf:edit'),
  //   }],
  // },
  {
    name: '项目管理',
    icon: 'book',
    path: 'project/list',
    authority: hasPerms('project:view'),
  },
  {
    name: '项目管理',
    path: 'project/form',
    hideInMenu: true,
    authority: hasPerms('project:view'),
  },
  {
    name: '项目管理',
    path: 'project/detail/:id',
    hideInMenu: true,
    authority: hasPerms('project:view'),
  },
  {
    name: '往来单位',
    icon: 'team',
    path: 'contacts/list',
    authority: hasPerms('contacts:view'),
  },
  {
    name: '往来单位详情',
    path: 'contacts/form',
    authority: hasPerms('contacts:view'),
    hideInMenu: true,
  },
  {
    name: '内部管理',
    icon: 'link',
    path: 'inside',
    authority: hasPerms('inside'),
    children: [{
      name: '人事录用',
      path: 'hire-list',
      authority: hasPerms('inside:hire:view'),
    }, {
      name: '人事录用新增',
      path: 'hire-form',
      authority: hasPerms('inside:hire:view'),
      hideInMenu: true,
    }, {
      name: '人事录用详情',
      path: 'hire-detail/:id',
      hideInMenu: true,
      authority: hasPerms('inside:hire:view'),
    }, {
      name: '人事离职',
      path: 'leave-list',
      authority: hasPerms('inside:leave:view'),
    }, {
      name: '人事离职编辑',
      path: 'leave-form',
      hideInMenu: true,
      authority: hasPerms('inside:leave:view'),
    }, {
      name: '人事离职详情',
      path: 'leave-detail/:id',
      hideInMenu: true,
      authority: hasPerms('inside:leave:view'),
    }, {
      name: '考勤管理',
      path: 'attendance-list',
      authority: hasPerms('inside:attendance:view'),
    }, {
      name: '考勤详情',
      path: 'attendance-detail/:id',
      hideInMenu: true,
      authority: hasPerms('inside:attendance:view'),
    }, {
      name: '报销申请',
      path: 'reimburse-list',
      authority: hasPerms('inside:reimburse:view'),
    }, {
      name: '报销申请',
      path: 'reimburse-form',
      hideInMenu: true,
      authority: hasPerms('inside:reimburse:view'),
    }, {
      name: '考勤详情',
      path: 'reimburse-detail/:id',
      hideInMenu: true,
      authority: hasPerms('inside:reimburse:view'),
    }],
  },
  {
    name: '员工管理',
    icon: 'user',
    path: 'staff',
    authority: hasPerms('staff'),
    children: [{
      name: '部门信息',
      path: 'group-list',
      authority: hasPerms('staff:group:view'),
    }, {
      name: '部门编辑',
      path: 'group-form',
      hideInMenu: true,
      authority: hasPerms('staff:group:edit'),
    }, {
      name: '员工信息',
      path: 'list',
      authority: hasPerms('staff:view'),
    }, {
      name: '员工编辑',
      path: 'form',
      hideInMenu: true,
      authority: hasPerms('staff:edit'),
    }, {
      name: '用户信息',
      path: 'user-list',
      authority: hasPerms('staff:user:view'),
    }, {
      name: '用户编辑',
      path: 'user-form',
      hideInMenu: true,
      authority: hasPerms('staff:user:edit'),
    }, {
      name: '角色信息',
      path: 'role-list',
      authority: hasPerms('staff:role:view'),
    }, {
      name: '角色编辑',
      path: 'role-form',
      hideInMenu: true,
      authority: hasPerms('staff:role:edit'),
    }],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [{
      name: '403',
      path: '403',
    }, {
      name: '404',
      path: '404',
    }, {
      name: '500',
      path: '500',
    }, {
      name: '触发异常',
      path: 'trigger',
    }],
  },
];

function formatter(data, parentPath = '/') {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}
export const getMenuData = () => formatter(menuData);

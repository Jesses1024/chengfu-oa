import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/project/list': {
      component: dynamicWrapper(app, ['projectList'], () => import('../routes/Project/List')),
    },
    '/project/form': {
      component: dynamicWrapper(app, ['projectForm'], () => import('../routes/Project/Form')),
    },
    '/project/detail/:id': {
      component: dynamicWrapper(app, ['projectDetail'], () => import('../routes/Project/Detail')),
    },
    '/contacts/list': {
      component: dynamicWrapper(app, ['contactList'], () => import('../routes/Contacts/List')),
    },
    '/contacts/form': {
      component: dynamicWrapper(app, ['contactForm'], () => import('../routes/Contacts/Form')),
    },
    '/inside/hire-list': {
      component: dynamicWrapper(app, ['hireList'], () => import('../routes/Inside/Hire/List')),
    },
    '/inside/hire-form': {
      component: dynamicWrapper(app, ['hireForm'], () => import('../routes/Inside/Hire/Form')),
    },
    '/inside/hire-detail/:id': {
      component: dynamicWrapper(app, ['hireDetail'], () => import('../routes/Inside/Hire/Detail')),
    },
    '/inside/leave-list': {
      component: dynamicWrapper(app, ['leaveList'], () => import('../routes/Inside/Leave/List')),
    },
    '/inside/leave-form': {
      component: dynamicWrapper(app, ['leaveForm'], () => import('../routes/Inside/Leave/Form')),
    },
    '/inside/leave-detail/:id': {
      component: dynamicWrapper(app, ['leaveForm'], () => import('../routes/Inside/Leave/Detail')),
    },
    '/inside/attendance-list': {
      component: dynamicWrapper(app, ['attendanceList'], () => import('../routes/Inside/Attendance/List')),
    },
    '/inside/attendance-detail/:id': {
      component: dynamicWrapper(app, ['attendanceForm'], () => import('../routes/Inside/Attendance/Detail')),
    },
    '/inside/reimburse-list': {
      component: dynamicWrapper(app, ['reimburseList'], () => import('../routes/Inside/Reimburse/List')),
    },
    '/inside/reimburse-form': {
      component: dynamicWrapper(app, ['reimburseForm', 'user'], () => import('../routes/Inside/Reimburse/Form')),
    },
    '/inside/reimburse-detail/:id': {
      component: dynamicWrapper(app, ['reimburseDetail'], () => import('../routes/Inside/Reimburse/Detail')),
    },
    '/staff/group-list': {
      component: dynamicWrapper(app, ['groupList'], () => import('../routes/Staff/Group/List')),
    },
    '/staff/group-form': {
      component: dynamicWrapper(app, ['groupForm'], () => import('../routes/Staff/Group/Form')),
    },
    '/staff/list': {
      component: dynamicWrapper(app, ['staffList'], () => import('../routes/Staff/List')),
    },
    '/staff/form': {
      component: dynamicWrapper(app, ['staffForm'], () => import('../routes/Staff/Form')),
    },
    '/staff/user-list': {
      component: dynamicWrapper(app, ['userList'], () => import('../routes/Staff/User/List')),
    },
    '/staff/user-form': {
      component: dynamicWrapper(app, ['userForm'], () => import('../routes/Staff/User/Form')),
    },
    '/staff/role-list': {
      component: dynamicWrapper(app, ['roleList'], () => import('../routes/Staff/Role/List')),
    },
    '/staff/role-form': {
      component: dynamicWrapper(app, ['roleForm'], () => import('../routes/Staff/Role/Form')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};

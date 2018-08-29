import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import CheckPassword from '../components/CheckPassword';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
// import logo from '../assets/logo.svg';
import logo from '../../public/logo.png';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  state = {
    isMobile,
  };

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  async componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '程富';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 程富`;
    }
    return title;
  }

  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/project/list';
    }
    return redirect;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  handleNoticeClear = () => {
    this.props.dispatch({
      type: 'global/clearNotices',
    });
  }
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'editPssword') {
      this.toogleModule(true);
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }

  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  handleOk = (params) => {
    this.props.dispatch({
      type: 'user/checkPassword',
      payload: params,
    });
  }

  toogleModule = (visible) => {
    this.props.dispatch({
      type: 'user/toogleModel',
      payload: visible,
    });
  }

  toogleTips = (type) => {
    this.props.dispatch({
      type: 'global/toogleTips',
      payload: type,
    });
  }

  render() {
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location,
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
            <CheckPassword
              visible={this.props.visible}
              toogelModule={this.toogleModule}
              handleOk={this.handleOk}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {
                redirectData.map(item =>
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                )
              }
              {
                getRoutes(match.path, routerData).map(item =>
                  (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      authority={item.authority}
                      redirectPath="/exception/403"
                    />
                  )
                )
              }
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              // links={[{
              //   key: 'Pro 首页',
              //   title: 'Pro 首页',
              //   href: 'http://pro.ant.design',
              //   blankTarget: true,
              // }, {
              //   key: 'github',
              //   title: <Icon type="github" />,
              //   href: 'https://github.com/ant-design/ant-design-pro',
              //   blankTarget: true,
              // }, {
              //   key: 'Ant Design',
              //   title: 'Ant Design',
              //   href: 'http://ant.design',
              //   blankTarget: true,
              // }]}
              copyright={
                <Fragment>
                  <p style={{ margin: 0 }}>
                    <Icon type="copyright" /> 2018 上海浦信科技有限公司 版权所有&nbsp;
                    <a style={{ color: 'rgba(0, 0, 0, 0.45)', textDecoration: 'none' }} rel="noopener noreferrer" href="http://www.miitbeian.gov.cn" target="_blank">宁ICP备17001827号-1</a>
                  </p>
                  <a
                    style={{ display: 'inline-block', textDecoration: 'none', height: 20, lineHeight: '20px', color: 'rgba(0, 0, 0, 0.45)' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=64052102000060"
                  >
                    <img src="http://www.tywlgroup.com/static/D0289DC0A46FC5B15B3363FFA78CF6C7.d0289dc0.png" alt="" />
                    <span
                      style={{ height: 20, lineHeight: '20px', margin: '0 0 0 5px', color: 'rgba(0, 0, 0, 0.45)' }}
                    >
                      宁公网安备 64052102000060号
                    </span>
                  </a>
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  visible: user.visible,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  tipsVisible: global.tipsVisible,
}))(BasicLayout);

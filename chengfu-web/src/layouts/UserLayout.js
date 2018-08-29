import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';

// const links = [{
//   key: 'help',
//   title: '帮助',
//   href: '',
// }, {
//   key: 'privacy',
//   title: '隐私',
//   href: '',
// }, {
//   key: 'terms',
//   title: '条款',
//   href: '',
// }];

const links = [];


class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '程富';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 程富`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    const copyright = (
      <div className="login-footer">
        <p style={{ margin: 0 }}>
          <Icon type="copyright" /> 2018 上海铺信科技有限公司 版权所有&nbsp;
          <a style={{ textDecoration: 'none' }} rel="noopener noreferrer" href="http://www.miitbeian.gov.cn" target="_blank">宁ICP备17001827号-1</a>
        </p>
        <a
          style={{ display: 'inline-block', textDecoration: 'none', height: 20, lineHeight: '20px' }}
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=64052102000060"
        >
          <img src="http://www.tywlgroup.com/static/D0289DC0A46FC5B15B3363FFA78CF6C7.d0289dc0.png" alt="" />
          <span
            style={{ height: 20, lineHeight: '20px', margin: '0 0 0 5px' }}
          >
          宁公网安备 64052102000060号
          </span>
        </a>
      </div>
    );
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <span className={styles.title}>程富</span>
                </Link>
              </div>
              <div className={styles.desc} />
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

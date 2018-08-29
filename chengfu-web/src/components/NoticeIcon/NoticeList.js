import React from 'react';
import { Link } from 'dva/router';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
  data = [], onClick, onClear, locale, emptyText, emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? (
          <img src={emptyImage} alt="not found" />
        ) : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });

          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={item.avatar ? (
                  <Avatar className={styles.avatar}>
                    {item.avatar.length > 1 ? item.avatar.substring(0, 1) : item.avatar}
                  </Avatar>
                ) : null}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>
                      <pre>{item.description}</pre>
                    </div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.footer}>
        <a onClick={onClear}>全部已读</a>
        <div className={styles.line} />
        <Link to="/sys/notice-list">前往通知中心</Link>
      </div>
    </div>
  );
}

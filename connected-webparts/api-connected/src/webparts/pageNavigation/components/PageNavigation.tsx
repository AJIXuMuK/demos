import * as React from 'react';
import styles from './PageNavigation.module.scss';
import { IPageNavigationProps } from './IPageNavigationProps';

export default class PageNavigation extends React.Component<IPageNavigationProps, {}> {
  public render(): React.ReactElement<IPageNavigationProps> {

    const navItems: JSX.Element[] = this.props.anchors.map((anchor) => {
      return <li className={styles.navItem}>
        <a className={styles.navItemLink} onClick={() => {
          alert(`cliecked item: ${anchor.title}`);
        }}>{anchor.title}</a>
      </li>;
    });

    return (
      <div className={styles.pageNavigation}>
        <ul className={styles.nav}>
          {navItems}
        </ul>
      </div>
    );
  }
}

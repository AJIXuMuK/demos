import * as React from 'react';
import styles from './PageAnchor.module.scss';
import { IPageAnchorProps } from './IPageAnchorProps';
import { DisplayMode } from '@microsoft/sp-core-library';
import { css } from '@fluentui/react';
import * as strings from 'PageAnchorWebPartStrings';

export default class PageAnchor extends React.Component<IPageAnchorProps, {}> {
  public render(): React.ReactElement<IPageAnchorProps> {
    const {
      title,
      displayMode
    } = this.props;
    
    if (displayMode === DisplayMode.Edit) {
      return (
        <div className={css(styles.webPartTitle, styles.visible)}>
          <div className={styles.anchorEl}></div>
          {
            displayMode === DisplayMode.Edit
              ? <textarea
                placeholder={strings.AnchorTitlePlaceholder}
                aria-label={strings.AnchorTitlePlaceholder}
                onChange={event => { this.props.updateProperty(event.target.value as string); }}
                defaultValue={title}></textarea>
              : <span>{title}</span>}
        </div>
      );
    }
    else {
      return (
        <div className={styles.webPartTitle}>
          <div className={styles.anchorEl}></div>
        </div>
      );
    }
  }
}

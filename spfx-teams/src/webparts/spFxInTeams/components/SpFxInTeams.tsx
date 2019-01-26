import * as React from 'react';
import styles from './SpFxInTeams.module.scss';
import { ISpFxInTeamsProps } from './ISpFxInTeamsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SpFxInTeams extends React.Component<ISpFxInTeamsProps, {}> {
  public render(): React.ReactElement<ISpFxInTeamsProps> {
    return (
      <div className={ styles.spFxInTeams }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

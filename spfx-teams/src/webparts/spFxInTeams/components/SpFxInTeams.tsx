import * as React from 'react';
import styles from './SpFxInTeams.module.scss';
import { ISpFxInTeamsProps } from './ISpFxInTeamsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SpFxInTeams extends React.Component<ISpFxInTeamsProps, {}> {
  public render(): React.ReactElement<ISpFxInTeamsProps> {
    return (
      <div className={ styles.spFxInTeams }>
        <div className={styles.description}>{this.props.description}</div>
        {this.props.documents && this.props.documents.map(doc => {
          return <div><a href={doc.webUrl} target="_blank">{doc.name}</a></div>;
        })}
      </div>
    );
  }
}

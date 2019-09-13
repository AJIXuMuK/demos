import * as React from 'react';
import styles from './TaskDetails.module.scss';
import { ITaskDetailsProps } from '../../../../common/Model';


export interface ITaskDetailsState { }

export class TaskDetails extends React.Component<ITaskDetailsProps, ITaskDetailsState> {
  public render(): React.ReactElement<ITaskDetailsProps> {
    const {
      task
    } = this.props;
    return (
      task &&
      <div className={styles.taskDetails}>
        <div className={styles.prop}>
          <div className={styles.title}>ID:</div>
          <div className={styles.value}>{task.id}</div>
        </div>
        <div className={styles.prop}>
          <div className={styles.title}>Name:</div>
          <div className={styles.value}>{task.title}</div>
        </div>
        <div className={styles.prop}>
          <div className={styles.title}>Description:</div>
          <div className={styles.value}>{task.description}</div>
        </div>
        <div className={styles.prop}>
          <div className={styles.title}>Priority:</div>
          <div className={styles.value}>{task.priority}</div>
        </div>
        <div className={styles.prop}>
          <div className={styles.title}>Status:</div>
          <div className={styles.value}>{task.status}</div>
        </div>
      </div>
    );
  }
}

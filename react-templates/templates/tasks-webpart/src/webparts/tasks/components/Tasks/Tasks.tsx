import * as React from 'react';
import styles from './Tasks.module.scss';
import { ITasksProps } from './ITasksProps';
import { DetailsList, SelectionMode } from 'office-ui-fabric-react/lib/components/DetailsList';
import { ITaskDetailsProps } from '../../../../common/Model';

export interface ITasksState {
  selectedTaskIndex?: number;
}

export default class Tasks extends React.Component<ITasksProps, ITasksState> {
  constructor(props: ITasksProps) {
    super(props);

    this.state = {};
  }

  public render(): React.ReactElement<ITasksProps> {
    const TaskDetails = this.props.taskDetails as React.ComponentClass<ITaskDetailsProps>;
    return (
      <div className={styles.tasks}>
        <DetailsList
          items={this.props.tasks}
          columns={[{
            fieldName: 'id',
            name: 'Id',
            key: 'id',
            minWidth: 20,
            maxWidth: 20
          }, {
            fieldName: 'title',
            name: 'Title',
            key: 'title',
            minWidth: 50
          }, {
            fieldName: 'description',
            name: 'Description',
            key: 'description',
            minWidth: 100
          }, {
            fieldName: 'priority',
            name: 'Priority',
            key: 'priority',
            minWidth: 50
          }, {
            fieldName: 'status',
            name: 'Status',
            key: 'status',
            minWidth: 50
          },]}
          selectionMode={SelectionMode.single}
          onActiveItemChanged={(item, index) => {
            this.setState({
              selectedTaskIndex: index
            });
          }} />
        {this.state.selectedTaskIndex !== undefined &&
          <TaskDetails task={this.props.tasks[this.state.selectedTaskIndex]} />
        }
      </div>
    );
  }
}

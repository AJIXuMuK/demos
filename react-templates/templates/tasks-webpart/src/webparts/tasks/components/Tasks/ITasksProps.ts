import * as React from 'react';
import { ITask, ITaskDetailsProps } from '../../../../common/Model';

export interface ITasksProps {
  tasks: ITask[];
  taskDetails: React.ComponentClass<ITaskDetailsProps>;
}

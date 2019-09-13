export interface ITask {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
}

export interface ITaskDetailsProps {
    task: ITask;
}
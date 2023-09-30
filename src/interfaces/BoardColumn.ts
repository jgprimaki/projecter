import Task from './Task';

export default interface BoardColumn {
  id: string;
  title: string;
  tasks: Task[];
}

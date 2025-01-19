export interface ITask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITaskListProps {
  tasks: ITask[];
}

export type MODAL_OPEN_FROM_STATES =
  | 'FROM_ADD_TASK'
  | 'FROM_UPDATE_TASK'
  | 'FROM_NOTIFY_TASK';

export interface ICustomModalProps {
  isAddTaskModalVisible: boolean;
  setIsAddTaskModalVisible: (from: MODAL_OPEN_FROM_STATES) => void;
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: () => void;
}

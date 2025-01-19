import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Task from '@/components/Task';
import { sampleTasks } from './data/sampleTasks';
import { ITask, MODAL_OPEN_FROM_STATES } from '@/types/appType';
import CustomModal from '@/components/CustomModal';
import { useRouter } from 'expo-router';
import useDebounce from '@/hooks/useDounce';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);

  const [taskToNotify, setTaskToNotify] = useState<ITask | null>(null);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState<{
    state: boolean;
    type: MODAL_OPEN_FROM_STATES;
  }>({
    state: false,
    type: 'FROM_ADD_TASK',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadTasks();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('You need to grant notification permissions to use reminders.');
    }
  };

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received:', response);
        router.push(`/task/${response.notification.request.content.data.id}`);
      });

    return () => {
      responseListener.remove();
    };
  }, [isModalVisible]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAction = async () => {
    console.log('handleAction', isAddTaskModalVisible, taskToNotify);
    try {
      if (newTask.trim() === '') return;

      if (isAddTaskModalVisible.type === 'FROM_UPDATE_TASK' && editingTask) {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id ? { ...task, title: newTask } : task
        );
        setTasks(updatedTasks as ITask[]);
        await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
        setEditingTask(null);
      }
      if (isAddTaskModalVisible.type === 'FROM_ADD_TASK') {
        const newTaskItem = { id: Date.now().toString(), title: newTask };
        const updatedTasks = [...tasks, newTaskItem];
        setTasks(updatedTasks as ITask[]);
        await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      }

      setNewTask('');
      setIsModalVisible(false);
      router.push('/');
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  const scheduleNotification = async (task: ITask, trigger: Date) => {
    try {
      alert(`Notification scheduled for Task - ${task.title}`);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: task.title,
          data: {
            id: task.id,
          },
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      alert('Could not schedule notification for past date and time');
    }
  };

  const handleNotification = (task: ITask) => {
    setIsModalVisible(true);
    setIsAddTaskModalVisible({ state: true, type: 'FROM_NOTIFY_TASK' });
    setTaskToNotify(task);
  };

  const deleteActionSheetHandler = (task: ITask) => {
    console.log('Delete action sheet received for task:', task.title);
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    AsyncStorage.removeItem(`@task_${task.id}`);
  };

  const onTaskToggle = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const onTaskClick = (task: ITask) => {
    router.push(`/task/${task.id}`);
  };

  const handleEditClick = (task: ITask) => {
    setEditingTask(task);
    setNewTask(task.title);
    setIsModalVisible(true);
    setIsAddTaskModalVisible({ state: true, type: 'FROM_UPDATE_TASK' });
  };

  const handleCloseModal = () => {
    setNewTask('');

    setIsModalVisible(false);
    setIsAddTaskModalVisible({
      state: false,
      type: 'FROM_NOTIFY_TASK',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <KeyboardAvoidingView behavior="padding" style={{ padding: 20 }}>
        <CustomModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          newTask={newTask}
          setNewTask={setNewTask}
          handleAction={handleAction}
          modalType={isAddTaskModalVisible.type}
          taskToNotify={taskToNotify}
          scheduleNotification={scheduleNotification}
          handleCloseModal={handleCloseModal}
        />
        <View style={{ padding: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Pressable
              style={styles.addTaskButton}
              onPress={() => {
                setIsModalVisible(true);
                setIsAddTaskModalVisible({
                  state: true,
                  type: 'FROM_ADD_TASK',
                });
              }}
            >
              <Text style={{ color: 'white' }}>Add Task</Text>
            </Pressable>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'normal',
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Task List
          </Text>
          <Search tasks={tasks} setTasks={setFilteredTasks} />
          {filteredTasks?.length > 0 ? (
            <View>
              <FlatList
                data={filteredTasks}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: 'normal' }}>
                      No tasks found
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <Task
                    task={item}
                    onNotificationClick={handleNotification}
                    onToggleClick={onTaskToggle}
                    onDeleteClick={deleteActionSheetHandler}
                    onEditClick={handleEditClick}
                    onTaskClick={onTaskClick}
                  />
                )}
                keyExtractor={(item) => item.id}
                style={{ marginTop: 20 }}
              />
            </View>
          ) : (
            <View>
              <Text>No tasks found</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Search = ({
  tasks,
  setTasks,
}: {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
}) => {
  const [searchText, setSearchText] = useState('');

  const OriginalTasks = tasks;

  const debouncedSearchText = useDebounce(searchText, 500);

  useEffect(() => {
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(debouncedSearchText.toLowerCase())
    );
    setTasks(filteredTasks);
    console.log(
      'debouncedSearchText.length === 0',
      debouncedSearchText.length === 0
    );
    if (debouncedSearchText.length === 0) {
      console.log('OriginalTasks', OriginalTasks);
      setTasks(OriginalTasks);
    }
  }, [debouncedSearchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TextInput
        placeholder="Search"
        style={styles.searchInput}
        onChangeText={(text) => handleSearch(text)}
        value={searchText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskButton: {
    backgroundColor: '#574bc4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

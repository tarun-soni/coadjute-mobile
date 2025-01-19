import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Task from '@/components/Task';
import { sampleTasks } from './data/sampleTasks';
import { ITask, MODAL_OPEN_FROM_STATES } from '@/types/appType';
import CustomModal from '@/components/CustomModal';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [tasks, setTasks] = useState<ITask[]>(sampleTasks as ITask[]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const [taskToNotify, setTaskToNotify] = useState<ITask | null>(null);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState<{
    state: boolean;
    type: MODAL_OPEN_FROM_STATES;
  }>({
    state: false,
    type: 'FROM_ADD_TASK',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleReset = () => {
    setTasks(sampleTasks);
    AsyncStorage.removeItem('@tasks');
  };

  const handleAction = async () => {
    try {
      if (newTask.trim() === '') return;
      if (isAddTaskModalVisible.type === 'FROM_UPDATE_TASK' && editingTask) {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id ? { ...task, title: newTask } : task
        );
        setTasks(updatedTasks as ITask[]);
        await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
        setEditingTask(null);
        setIsModalVisible(false);
      } else if (isAddTaskModalVisible.type === 'FROM_ADD_TASK') {
        const newTaskItem = { id: Date.now().toString(), title: newTask };
        const updatedTasks = [...tasks, newTaskItem];
        setTasks(updatedTasks as ITask[]);
        await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
        setIsModalVisible(false);
      }
      setNewTask('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  const scheduleNotification = async (task: ITask) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: task.title,
        },
        // @ts-ignore
        trigger: { type: 'timeInterval', seconds: 10 }, // 10 sec from now
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleNotification = (task: ITask) => {
    console.log('Notification received for task:', task.title);
    setIsModalVisible(true);
    setIsAddTaskModalVisible({ state: true, type: 'FROM_NOTIFY_TASK' });
    setTaskToNotify(task);
    // scheduleNotification(task);
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

  const handleTitleChange = (task: ITask) => {
    console.log('Title changed:', task.title);

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, title: task.title } : t
    );
    setTasks(updatedTasks as ITask[]);
    AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
  };

  const handleEditClick = (task: ITask) => {
    setEditingTask(task);
    setNewTask(task.title);
    setIsModalVisible(true);
    setIsAddTaskModalVisible({ state: true, type: 'FROM_UPDATE_TASK' });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <CustomModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        newTask={newTask}
        setNewTask={setNewTask}
        handleAction={handleAction}
        modalType={isAddTaskModalVisible.type}
        taskToNotify={taskToNotify}
      />
      <KeyboardAvoidingView behavior="padding" style={{ padding: 20 }}>
        <View style={{ padding: 20 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Button title="Reset" onPress={handleReset} />
            <Button
              title="Add Task"
              onPress={() => {
                setIsModalVisible(true);
                setIsAddTaskModalVisible({
                  state: true,
                  type: 'FROM_ADD_TASK',
                });
              }}
            />
          </View>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <Task
                task={item}
                onNotificationClick={handleNotification}
                onToggleClick={onTaskToggle}
                onDeleteClick={deleteActionSheetHandler}
                onEditClick={handleEditClick}
              />
            )}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 20 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

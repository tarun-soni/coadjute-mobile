import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Task from '@/components/Task';
import { sampleTasks } from './data/sampleTasks';
import { ITask } from '@/types/appType';
import TaskForm from '@/components/TaskForm';
import { IconSymbol } from '@/components/ui/IconSymbol';
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
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
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

  const addTask = async () => {
    try {
      if (newTask.trim() === '') return;
      const newTaskItem = { id: Date.now().toString(), title: newTask };
      const updatedTasks = [...tasks, newTaskItem];
      setTasks(updatedTasks as ITask[]);
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      // await scheduleNotification(newTaskItem as unknown as ITask);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setNewTask('');
      Keyboard.dismiss();
      setIsAddTaskModalVisible(false);
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
    alert(`Notification received for task: ${task.title}`);
    scheduleNotification(task);
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

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <KeyboardAvoidingView behavior="padding" style={{ padding: 20 }}>
        <ScrollView
          style={{ padding: 20 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Button title="Reset" onPress={handleReset} />
            <Button
              title="Add Task"
              onPress={() => setIsAddTaskModalVisible(true)}
            />
          </View>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <Task
                task={item}
                onTaskToggle={onTaskToggle}
                handleNotification={handleNotification}
                deleteActionSheetHandler={deleteActionSheetHandler}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
                handleTitleChange={handleTitleChange}
              />
            )}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={isAddTaskModalVisible}
        onRequestClose={() => {
          setIsAddTaskModalVisible(false);
        }}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#ccc',
          justifyContent: 'center',
          position: 'absolute',

          transform: [
            { translateX: -Dimensions.get('window').width / 4 },
            { translateY: -Dimensions.get('window').height / 4 },
          ],
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: Dimensions.get('window').width / 1.5,
            height: Dimensions.get('window').height / 1.5,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [
              { translateX: -Dimensions.get('window').width / 3 },
              { translateY: -Dimensions.get('window').height / 3 },
            ],
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
          }}
        >
          <Pressable
            style={{ position: 'absolute', top: 10, right: 10 }}
            onPress={() => setIsAddTaskModalVisible(false)}
          >
            <IconSymbol name="xmark" size={24} color="#000" />
          </Pressable>
          {/* <TaskForm onSubmit={addTask} /> */}
          <TextInput
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Enter a new task"
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginBottom: 10,
              width: '100%',
            }}
          />
          <Button title="Add Task" onPress={addTask} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

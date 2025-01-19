import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ITask } from '@/types/appType';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewTask = () => {
  const { id } = useLocalSearchParams();

  const [task, setTask] = useState<ITask | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      const tasks = await AsyncStorage.getItem('@tasks');
      console.log('tasks', tasks);
      const task = JSON.parse(tasks || '[]').find(
        (task: ITask) => task.id === id
      );
      setTask(task);
    };
    fetchTask();
  }, [id]);

  console.log('task', task);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Text>Task Title: {task?.title}</Text>
    </SafeAreaView>
  );
};

export default ViewTask;

const styles = StyleSheet.create({});

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import React, { FC } from 'react';
import { IconSymbol } from './ui/IconSymbol';

interface TaskProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
  onTaskClick: (task: TaskProps['task']) => void;
  onNotificationClick: (task: TaskProps['task']) => void;
  onEditClick: (task: TaskProps['task']) => void;
  onDeleteClick: (task: TaskProps['task']) => void;
  onToggleClick: (id: string) => void;
}

const Task: FC<TaskProps> = ({
  task,
  onTaskClick,
  onNotificationClick,
  onEditClick,
  onDeleteClick,
  onToggleClick,
}) => {
  return (
    <Pressable
      key={task.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#1f1f1f',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        width: '100%',
      }}
      onPress={() => onTaskClick(task)}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => onToggleClick(task.id)}
          style={{ marginRight: 15 }}
        >
          <Text style={{ fontSize: 20 }}>{task.completed ? '☑️' : '⬜️'}</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textDecorationLine: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#aaa' : '#333',
          }}
        >
          {task.title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        {/* edit icon */}
        <TouchableOpacity
          onPress={() => onEditClick(task)}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <IconSymbol name="pencil" size={20} color="#574bc4" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNotificationClick(task)}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <IconSymbol name="bell.fill" size={20} color="#574bc4" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDeleteClick(task)}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <IconSymbol name="trash.fill" size={20} color="#cc3743" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default Task;

const styles = StyleSheet.create({});

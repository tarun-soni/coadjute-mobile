import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC } from 'react';
import { IconSymbol } from './ui/IconSymbol';

interface TaskProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
  onTaskToggle: (id: string) => void;
  handleNotification: (task: TaskProps['task']) => void;
  deleteActionSheetHandler: (task: TaskProps['task']) => void;
  handleTitleChange: (task: TaskProps['task']) => void;
  editingTask: TaskProps['task'] | null;
  setEditingTask: (task: TaskProps['task']) => void;
}

const Task: FC<TaskProps> = ({
  task,
  onTaskToggle,
  handleNotification,
  deleteActionSheetHandler,
  handleTitleChange,

  editingTask,
  setEditingTask,
}) => {
  return (
    <View
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
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => onTaskToggle(task.id)}
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
          {editingTask?.id === task.id ? (
            <TextInput
              value={task.title}
              onChangeText={(text) => handleTitleChange(task)}
              style={{
                paddingHorizontal: 4,
                width: '70%',
                fontSize: 16,
                fontWeight: 'bold',
                borderWidth: 1,
              }}
            />
          ) : (
            task.title
          )}
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
          onPress={() => setEditingTask(task)}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <IconSymbol name="pencil" size={20} color="#574bc4" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNotification(task)}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <IconSymbol name="bell.fill" size={20} color="#574bc4" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteActionSheetHandler(task)}
          style={{
            marginLeft: 'auto',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <IconSymbol name="trash.fill" size={20} color="#cc3743" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({});

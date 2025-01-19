import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

interface TaskFormProps {
  onSubmit: (task: { title: string; description: string }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Task Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 5,
            borderRadius: 5,
          }}
          placeholder="Enter task title"
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 5,
            borderRadius: 5,
          }}
          placeholder="Enter task description"
          multiline
        />
      </View>
      <Button title="Add Task" onPress={handleSubmit} />
    </View>
  );
};

export default TaskForm;

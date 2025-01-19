import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {
  ICustomModalProps,
  MODAL_OPEN_FROM_STATES,
  ITask,
} from '@/types/appType';

interface CustomModalProps {
  isVisible: boolean;
  setIsVisible: (state: boolean) => void;
  newTask: string;
  setNewTask: (task: string) => void;
  handleAction: () => void;
  modalType: MODAL_OPEN_FROM_STATES;
  taskToNotify?: ITask | null;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  setIsVisible,
  newTask,
  setNewTask,
  handleAction,
  modalType,
  taskToNotify,
}) => {
  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
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
        }}
      >
        <Pressable
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
          onPress={() => setIsVisible(false)}
        >
          <IconSymbol name="xmark" size={20} color="#000" />
        </Pressable>
        <View
          style={{
            width: '90%',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {modalType === 'FROM_ADD_TASK' && <Text>Add a new task</Text>}
          {modalType === 'FROM_UPDATE_TASK' && <Text>Edit task</Text>}
          {modalType === 'FROM_NOTIFY_TASK' && (
            <View>
              <Text>Notify about</Text>
              <Text>{taskToNotify?.title}</Text>

              <View>
                <Text>Pick a Date and time</Text>
                {/* <DatePicker
                  value={new Date()}
                  onChange={(date) => setDate(date)}
                />   */}
              </View>
            </View>
          )}
        </View>

        {(modalType === 'FROM_ADD_TASK' ||
          modalType === 'FROM_UPDATE_TASK') && (
          <TextInput
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Enter task title"
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginBottom: 10,
              width: '90%',
              height: 40,
            }}
          />
        )}

        <Button
          title={
            modalType === 'FROM_ADD_TASK'
              ? 'Add Task'
              : modalType === 'FROM_UPDATE_TASK'
              ? 'Save Task'
              : 'Notify'
          }
          onPress={handleAction}
        />
      </View>
    </Modal>
  );
};

export default CustomModal;

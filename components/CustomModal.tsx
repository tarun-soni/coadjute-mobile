import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Dimensions,
  Pressable,
  StyleSheet,
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
  scheduleNotification: (task: ITask, trigger: Date) => void;
  handleCloseModal: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  setIsVisible,
  newTask,
  setNewTask,
  handleAction,
  modalType,
  taskToNotify,
  scheduleNotification,
  handleCloseModal,
}) => {
  const [date, setDate] = useState(new Date());

  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => handleCloseModal()}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Pressable
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
          onPress={() => handleCloseModal()}
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
          {modalType === 'FROM_ADD_TASK' && (
            <Text style={styles.modalTitle}>Add a new task</Text>
          )}
          {modalType === 'FROM_UPDATE_TASK' && (
            <Text style={styles.modalTitle}>Edit task</Text>
          )}
          {modalType === 'FROM_NOTIFY_TASK' && (
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.modalTitle}>
                Notify about - {taskToNotify?.title}
              </Text>
              <View style={styles.dateTimePickerContainer}>
                <Text style={styles.modalSubtitle}>Pick a Date and Time</Text>
                <DateTimePicker
                  style={{
                    width: '100%',
                    height: 40,
                  }}
                  value={date}
                  mode="datetime"
                  display="default"
                  onChange={(event: any, selectedDate: Date | undefined) => {
                    const currentDate = selectedDate || date;
                    setDate(currentDate);
                  }}
                />
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
              marginVertical: 10,
              marginBottom: 10,
              width: '90%',
              height: 40,
            }}
          />
        )}

        <Pressable
          style={styles.actinButton}
          onPress={() => {
            if (modalType === 'FROM_NOTIFY_TASK' && taskToNotify) {
              scheduleNotification(taskToNotify, date);
            }
            handleAction();
            setIsVisible(false);
          }}
        >
          <Text style={styles.actinButtonText}>
            {modalType === 'FROM_ADD_TASK'
              ? 'Add Task'
              : modalType === 'FROM_UPDATE_TASK'
              ? 'Save Task'
              : 'Notify'}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
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
  },
  modalContent: {
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
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateTimePickerContainer: {
    width: '90%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },

  actinButton: {
    width: '90%',

    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',

    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 10,

    backgroundColor: '#574bc4',
    padding: 10,
    borderRadius: 5,
  },
  actinButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

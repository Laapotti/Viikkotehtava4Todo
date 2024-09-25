import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    }
  };


  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      Alert.alert('Error', 'Failed to save tasks');
    }
  };


  const addTask = () => {
    if (task.length > 0) {
      const newTask = { id: Date.now().toString(), title: task, done: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setTask('');
    } else {
      Alert.alert('Error', 'Task cannot be empty');
    }
  };


  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((item) =>
      item.id === taskId ? { ...item, done: !item.done } : item
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };


  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskItem}>
      <Text style={item.done ? styles.taskDone : styles.taskText}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo list</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          value={task}
          onChangeText={setTask}

        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  taskDone: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  addButton: {
    padding: 15,
    marginLeft: 150,
  },
  addButtonText: {
    color: '#0000FF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

import React from 'react';
import TaskForm from '../components/tasks/TaskForm';

const AddTaskPage = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create a New Task</h2>
      <TaskForm />
    </div>
  );
};

export default AddTaskPage;
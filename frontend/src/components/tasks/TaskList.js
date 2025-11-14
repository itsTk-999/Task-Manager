import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onTaskDelete, onTaskUpdate }) => {
  if (!tasks || tasks.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-light-gray)' }}>No tasks found. Add one!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onTaskDelete={onTaskDelete} onTaskUpdate={onTaskUpdate} />
      ))}
    </div>
  );
};

export default TaskList;
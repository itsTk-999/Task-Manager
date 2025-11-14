import React from 'react';
import './TaskSkeleton.css'; // We'll create this next

const TaskSkeleton = () => {
  return (
    <div className="task-item-skeleton">
      <div className="skeleton-header">
        <span className="skeleton-line skeleton-priority"></span>
        <span className="skeleton-line skeleton-category"></span>
      </div>
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-desc"></div>
    </div>
  );
};

export default TaskSkeleton;
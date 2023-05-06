import React from 'react';

import TaskListComponent from '../components/historyFormTable';

const TaskList = () => {
  return (
    <div className="main-content">
      <TaskListComponent from="list" />
    </div>
  );
};

export default TaskList;


import { useState } from 'react'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const categories = [
    { id: 'urgent', name: 'Urgent', color: '#ff4d4d' },
    { id: 'important', name: 'Important', color: '#ffcc00' },
    { id: 'regular', name: 'Regular', color: '#4CAF50' },
    { id: 'later', name: 'Later', color: '#2196F3' }
  ];

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, {
        key: Date.now(),
        description: newTask,
        completed: false,
        category: selectedCategory || 'regular',
        dueDate: dueDate || null
      }]);
      setNewTask('');
      setDueDate('');
    }
  };

  const handleToggleComplete = (taskKey) => {
    setTasks(tasks.map(task => 
      task.key === taskKey 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleDeleteTask = (taskKey) => {
    setTasks(tasks.filter(task => task.key !== taskKey));
  };

  // Group tasks by category
  const tasksByCategory = {};
  categories.forEach(category => {
    tasksByCategory[category.id] = tasks.filter(task => task.category === category.id);
  });

  // Calculate progress for each category
  const getCategoryProgress = (categoryId) => {
    const categoryTasks = tasks.filter(task => task.category === categoryId);
    if (categoryTasks.length === 0) return 0;
    
    const completedTasks = categoryTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / categoryTasks.length) * 100);
  };

  return (
    <div className="todo-container">
      <h1>Todo App</h1>
      
      <div className="add-task">
        <input
          type="text"
          className="task-input"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <select 
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="date-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button 
          className="add-button"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
      
      {categories.map(category => (
        <div key={category.id} className="category-section">
          <div className="category-header">
            <h2 style={{ color: category.color }}>{category.name}</h2>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${getCategoryProgress(category.id)}%`,
                  backgroundColor: category.color
                }}
              ></div>
            </div>
            <span className="progress-text">{getCategoryProgress(category.id)}% complete</span>
          </div>
          
          <div className="task-list">
            {tasksByCategory[category.id].length > 0 ? (
              tasksByCategory[category.id].map(task => (
                <div key={task.key} className="task-item">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.key)}
                    />
                    <div className="task-details">
                      <span 
                        className={task.completed ? "task-text completed" : "task-text"}
                      >
                        {task.description}
                      </span>
                      {task.dueDate && (
                        <span className="task-due-date">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </label>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.key)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-category">No tasks in this category</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

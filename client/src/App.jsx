import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from './api/taskService';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    overdue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOption, setSortOption] = useState('createdAt_desc');

  // Modals & UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mobile sidebar toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const [, startTransition] = useTransition();

  // Show toast utility
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch stats and tasks from real MongoDB backend
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [tasksRes, statsRes] = await Promise.all([
        getTasks({
          search,
          status: statusFilter,
          priority: priorityFilter,
          sort: sortOption,
        }),
        getTaskStats(),
      ]);

      startTransition(() => {
        setTasks(tasksRes.data || []);
        setStats(statsRes || {});
      });
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortOption]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Create / Edit Task
  const handleSaveTask = async (taskData) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        showToast('Task updated successfully.');
      } else {
        await createTask(taskData);
        showToast('Task created successfully.');
      }

      setIsModalOpen(false);
      setEditingTask(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error saving task.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle status: if Completed -> Pending, otherwise -> Completed
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      // Optimistic update for instant responsiveness
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );

      await updateTask(task._id, { status: newStatus });
      showToast(
        newStatus === 'Completed'
          ? 'Task marked as completed.'
          : 'Task marked as pending.'
      );
      fetchData();
    } catch (err) {
      showToast(err.message || 'Error updating status.', 'error');
      fetchData(); // Rollback
    }
  };

  // Handle Delete Confirmation & Execution
  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await deleteTask(deletingTask._id);
      showToast('Task deleted successfully.');
      setDeletingTask(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Error deleting task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortOption('createdAt_desc');
  };

  // Check if any filter is active
  const isFiltered =
    Boolean(search) ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    sortOption !== 'createdAt_desc';

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeStatus={statusFilter}
        activePriority={priorityFilter}
        onSelectFilter={(status, priority) => {
          setStatusFilter(status);
          setPriorityFilter(priority);
        }}
        stats={stats}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          onOpenNewTask={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className="content-container">
          {/* Understated Dashboard Statistics Cards */}
          <StatsOverview
            stats={stats}
            currentStatus={statusFilter}
            onSelectStatus={(st) => {
              setStatusFilter((prev) => (prev === st ? 'All' : st));
            }}
          />

          {/* Search, Filter & Sort Controls */}
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            priority={priorityFilter}
            onPriorityChange={setPriorityFilter}
            sort={sortOption}
            onSortChange={setSortOption}
            onResetFilters={handleResetFilters}
          />

          {/* Main Task List */}
          <TaskTable
            tasks={tasks}
            isLoading={isLoading}
            error={error}
            onRetry={fetchData}
            onToggleStatus={handleToggleStatus}
            onEdit={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
            onDelete={(task) => setDeletingTask(task)}
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenNewTask={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          />
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isSaving) {
            setIsModalOpen(false);
            setEditingTask(null);
          }
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        onClose={() => {
          if (!isDeleting) setDeletingTask(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

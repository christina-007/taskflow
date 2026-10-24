import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from './api/taskService';
import {
  getToken,
  getStoredUser,
  logout as authLogout,
  checkAuth,
} from './api/authService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Verify stored session on mount
  useEffect(() => {
    const verifySession = async () => {
      const user = await checkAuth();
      setCurrentUser(user);
    };
    verifySession();

    // Listen for 401 unauthorized events
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setTasks([]);
      setStats({ total: 0, completed: 0, pending: 0, inProgress: 0, highPriority: 0, overdue: 0 });
      showToast('Session expired. Please sign in again.', 'error');
      setIsAuthModalOpen(true);
    };

    window.addEventListener('taskflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskflow:unauthorized', handleUnauthorized);
  }, []);

  // Fetch stats and tasks from MongoDB Atlas for the authenticated user
  const fetchData = useCallback(async () => {
    if (!getToken()) {
      setTasks([]);
      setStats({ total: 0, completed: 0, pending: 0, inProgress: 0, highPriority: 0, overdue: 0 });
      setIsLoading(false);
      return;
    }

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
  }, [fetchData, currentUser]);

  // Handle Logout
  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setTasks([]);
    setStats({ total: 0, completed: 0, pending: 0, inProgress: 0, highPriority: 0, overdue: 0 });
    showToast('Signed out successfully.');
  };

  // Handle successful login or register
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    fetchData();
  };

  // Handle Create / Edit Task
  const handleSaveTask = async (taskData) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

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

  // Quick toggle status
  const handleToggleStatus = async (task) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
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
      fetchData();
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
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenNewTask={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setEditingTask(null);
              setIsModalOpen(true);
            }
          }}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className="content-container">
          {/* Dashboard Statistics Cards */}
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
            isUnauthenticated={!currentUser}
            onResetFilters={handleResetFilters}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenNewTask={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else {
                setEditingTask(null);
                setIsModalOpen(true);
              }
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

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
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

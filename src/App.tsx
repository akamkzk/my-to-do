import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import TabBar from './components/TabBar';
import SearchBar from './components/SearchBar';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import StatsPanel from './components/StatsPanel';
import FocusPanel from './components/FocusPanel';

function AppContent() {
  const { filteredTodos, activeTab } = useApp();

  return (
    <div className="kraft-background">
      <div className="app-container">
        <Header />
        <TabBar />

        <div className="main-content">
          {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'completed') && (
            <section className="content-section active" id="sectionTodos">
              <div className="paper-card sketch-frame breathe-shadow">
                <SearchBar />
                <hr className="line-divider" />
                <AddTodoForm />
                <div className="washi-tape washi-pink"></div>
                <TodoList todos={filteredTodos} />
              </div>
            </section>
          )}

          {activeTab === 'stats' && (
            <section className="content-section active" id="sectionStats">
              <StatsPanel />
            </section>
          )}

          {activeTab === 'focus' && (
            <section className="content-section active" id="sectionFocus">
              <FocusPanel />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <AppProvider>
        <AppContent />
      </AppProvider>
    </>
  );
}

export default App;

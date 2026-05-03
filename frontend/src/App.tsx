import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import ChatWidget from './components/ChatWidget';
import Timeline from './pages/Timeline';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <ChatWidget />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

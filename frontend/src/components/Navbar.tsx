import { Link } from 'react-router-dom';
import { MessageSquare, Clock, BookOpen, HelpCircle, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 text-primary font-bold text-xl tracking-tight">
            <img src="/logo.png" alt="Elector Logo" className="w-10 h-10 object-contain" />
            <span className="hidden sm:inline">Elector</span>
          </Link>
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex space-x-8">
              <Link to="/chat" className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>AI Chat</span>
              </Link>
              <Link to="/timeline" className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <Clock className="w-4 h-4" />
                <span>Timeline</span>
              </Link>
              <Link to="/flashcards" className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Flashcards</span>
              </Link>
              <Link to="/quiz" className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span>Quiz</span>
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

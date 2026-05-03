import { useState, useEffect } from 'react';
import { TrendingUp, Award, BookOpen, Clock, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/quiz/progress/guest_user')
      .then(res => res.json())
      .then(data => {
        setHistory(data.progress || []);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Learning Streak', value: '3 Days', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-orange-500' },
    { label: 'Concepts Mastered', value: '12', icon: <BookOpen className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Accuracy', value: '85%', icon: <Award className="w-5 h-5" />, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold mb-2">Adaptive Learning Dashboard</h1>
        <p className="text-slate-500 font-medium">Tracking your progress through the Indian Election System.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
            <div className={`p-3 rounded-2xl text-white ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Recent Activity</span>
          </h2>
          
          <div className="space-y-4">
            {history.length > 0 ? history.map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${item.score > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.score > 0 ? '+1' : '0'}
                  </div>
                  <div>
                    <p className="font-bold">Quiz Session: {item.difficulty}</p>
                    <p className="text-xs text-slate-400">Concept: General Election Knowledge</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            )) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-3xl text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 font-medium italic">No quiz history yet. Start a quiz to track your progress!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Suggested Topics</h2>
          <div className="space-y-3">
            {['EVM Security', 'Model Code of Conduct', 'Voter Registration'].map((topic, i) => (
              <div key={i} className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 hover:border-primary/30 cursor-pointer transition-all">
                <p className="font-bold text-primary">{topic}</p>
                <p className="text-xs text-primary/60">AI Recommended based on current trends</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

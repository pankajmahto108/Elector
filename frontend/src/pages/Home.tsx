import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, LayoutDashboard, Shield, Zap, Globe } from 'lucide-react';

export default function Home() {
  const features = [
    { title: 'Elector AI Chat', icon: <MessageSquare className="w-8 h-8 text-blue-500" />, path: '/chat', desc: 'Expert guidance on constitutional voting rights and processes.' },
    { title: 'Election Timeline', icon: <Clock className="w-8 h-8 text-green-500" />, path: '/timeline', desc: 'Interactive step-by-step cycle from announcement to results.' },
    { title: 'Adaptive Quiz', icon: <Brain className="w-8 h-8 text-purple-500" />, path: '/quiz', desc: 'AI-generated challenges that adapt to your knowledge level.' },
    { title: 'Learning Dashboard', icon: <LayoutDashboard className="w-8 h-8 text-orange-500" />, path: '/dashboard', desc: 'Track your mastery of the Indian democratic system.' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-24 py-10">
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Elector Logo" className="w-24 h-24 object-contain shadow-2xl rounded-2xl p-2 bg-white dark:bg-slate-800" />
          </div>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            <span>Powered by Gemini 2.5 Flash</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Empowering Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600">Indian Voter.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            The world's most advanced AI platform for civic education. 
            Understand the largest democratic exercise on Earth with precision and clarity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/learn" className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-primary/30">
              Start Learning Now
            </Link>
            <Link to="/timeline" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Explore Timeline
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <Link to={f.path} className="block h-full p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-primary/20 transition-all group">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 w-fit rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">{f.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <section className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h4 className="text-2xl font-bold mb-2">Safe & Reliable</h4>
            <p className="text-slate-400 font-medium">Fact-checked by ECI constitutional guidelines.</p>
          </div>
          <div>
            <Globe className="w-10 h-10 text-primary mx-auto mb-4" />
            <h4 className="text-2xl font-bold mb-2">Multilingual</h4>
            <p className="text-slate-400 font-medium">Coming soon in 22 regional languages.</p>
          </div>
          <div>
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h4 className="text-2xl font-bold mb-2">Instant Answers</h4>
            <p className="text-slate-400 font-medium">Real-time processing with Gemini 2.5 Flash.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/>
    </svg>
  );
}

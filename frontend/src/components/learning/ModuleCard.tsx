import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock, Info, Loader2, Volume2, PlayCircle, Trophy } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ModuleData {
  id: number;
  title: string;
  explanation: string;
  bulletPoints: string[];
  quiz: QuizQuestion[];
}

interface ModuleCardProps {
  module: ModuleData;
  isUnlocked: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function ModuleCard({ module, isUnlocked, isCompleted, onComplete }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleExplainWithAI = async () => {
    if (aiExplanation) return;
    setIsExplaining(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Please explain this Indian election topic simply but in detail: ${module.title}. Key points: ${module.bulletPoints.join(', ')}`,
          history: []
        })
      });
      const data = await res.json();
      setAiExplanation(data.reply);
    } catch (e) {
      setAiExplanation("Failed to load AI explanation. Please check your connection.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    
    const correct = option === module.quiz[quizIndex].answer;
    if (correct) setQuizScore(s => s + 1);

    setTimeout(() => {
      setSelectedAnswer(null);
      if (quizIndex + 1 < module.quiz.length) {
        setQuizIndex(i => i + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  if (!isUnlocked) {
    return (
      <div className="opacity-50 grayscale transition-all p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
        <div className="p-4 bg-slate-200 dark:bg-slate-700 rounded-2xl">
          <Lock className="w-8 h-8 text-slate-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">Module {module.id}: {module.title}</h3>
          <p className="text-sm font-medium text-slate-400">Complete previous modules to unlock.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className={`border-2 transition-all duration-500 rounded-3xl overflow-hidden shadow-sm ${
        isCompleted ? 'border-green-500/50 bg-green-50/10 dark:bg-green-900/10' : 'border-primary/20 bg-white dark:bg-slate-900'
      }`}
    >
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-6 cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl transition-colors ${
            isCompleted ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
          }`}>
            {isCompleted ? <Trophy className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Module {module.id}</span>
              {isCompleted && <span className="text-xs font-bold uppercase tracking-wider text-green-500 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-full">Completed</span>}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{module.title}</h3>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-8 space-y-8">
              {/* Theory Section */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {module.explanation}
                  </p>
                  <button 
                    onClick={() => handleSpeak(module.explanation)}
                    className={`p-2 rounded-xl border transition-colors ml-4 shrink-0 ${isSpeaking ? 'bg-primary text-white border-primary animate-pulse' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary/30'}`}
                    title="Read Aloud"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <ul className="grid sm:grid-cols-2 gap-3 mt-6">
                  {module.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Explain Button */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-3xl border border-primary/10">
                <button 
                  onClick={handleExplainWithAI}
                  disabled={isExplaining}
                  className="flex items-center space-x-2 text-primary font-bold hover:opacity-80 transition-opacity"
                >
                  {isExplaining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Info className="w-5 h-5" />}
                  <span>{aiExplanation ? "AI Explanation Provided Below" : "Explain deeper with Elector AI"}</span>
                </button>
                
                <AnimatePresence>
                  {aiExplanation && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-inner whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      {aiExplanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mini Quiz Section */}
              <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px]"></div>
                
                <h4 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Knowledge Check</span>
                </h4>

                {!quizFinished ? (
                  <div className="relative z-10">
                    <p className="text-lg font-medium mb-4 text-slate-200">
                      Q{quizIndex + 1}: {module.quiz[quizIndex].question}
                    </p>
                    <div className="space-y-3">
                      {module.quiz[quizIndex].options.map((opt, i) => {
                        const isCorrect = opt === module.quiz[quizIndex].answer;
                        const isSelected = selectedAnswer === opt;
                        let btnClass = "w-full text-left p-4 rounded-xl font-medium border-2 transition-all ";
                        
                        if (!selectedAnswer) {
                          btnClass += "border-slate-700 hover:border-primary bg-slate-800/50 hover:bg-slate-800";
                        } else if (isCorrect) {
                          btnClass += "border-green-500 bg-green-500/20 text-green-300";
                        } else if (isSelected) {
                          btnClass += "border-red-500 bg-red-500/20 text-red-300";
                        } else {
                          btnClass += "border-slate-800 opacity-50";
                        }

                        return (
                          <button key={i} disabled={!!selectedAnswer} onClick={() => handleAnswer(opt)} className={btnClass}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 relative z-10">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h5 className="text-2xl font-bold mb-2">Quiz Completed!</h5>
                    <p className="text-slate-400 mb-6">Score: {quizScore} / {module.quiz.length}</p>
                    {!isCompleted && (
                      <button 
                        onClick={() => {
                          onComplete();
                          setExpanded(false);
                        }}
                        className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-focus transition-all"
                      >
                        Mark Module as Completed
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

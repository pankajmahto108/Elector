import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, XCircle, Brain, Target, Loader2, Info } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function Quiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const MAX_QUESTIONS = 5;

  const FALLBACK_QUESTIONS: Question[] = [
    {
      id: "f1",
      question: "What is the minimum voting age in India?",
      options: ["16 Years", "18 Years", "21 Years", "25 Years"],
      answer: "18 Years",
      explanation: "The 61st Amendment Act of 1988 lowered the voting age from 21 to 18 years."
    },
    {
      id: "f2",
      question: "Which body conducts elections to the Lok Sabha in India?",
      options: ["State Election Commission", "Election Commission of India", "Parliament", "Supreme Court"],
      answer: "Election Commission of India",
      explanation: "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering Union and State election processes in India."
    },
    {
      id: "f3",
      question: "What does EVM stand for?",
      options: ["Electronic Voting Machine", "Electoral Voting Method", "Election Validation Mechanism", "Electronic Voter Matrix"],
      answer: "Electronic Voting Machine",
      explanation: "EVM stands for Electronic Voting Machine, used extensively in Indian elections to record votes securely and quickly."
    },
    {
      id: "f4",
      question: "When does the Model Code of Conduct (MCC) come into effect?",
      options: ["6 months before elections", "Immediately after election schedule announcement", "1 month before voting day", "On the voting day"],
      answer: "Immediately after election schedule announcement",
      explanation: "The MCC comes into force immediately when the ECI announces the election schedule, ensuring a level playing field."
    },
    {
      id: "f5",
      question: "What is NOT required for an Indian citizen to vote?",
      options: ["To be 18 years old", "To have a Voter ID card", "To pay income tax", "To be on the electoral roll"],
      answer: "To pay income tax",
      explanation: "Voting in India is based on universal adult suffrage. Paying income tax is not a prerequisite to exercise the right to vote."
    }
  ];

  const fetchQuestion = async (diff: Difficulty = difficulty) => {
    setLoading(true);
    setSelected(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: diff, topic: 'General Election Knowledge' })
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      if (data && data.question) {
        setQuestion(data);
      } else {
        throw new Error("Invalid format");
      }
    } catch (error) {
      console.warn("Using fallback quiz data", error);
      const randomQ = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      // Prevent exact same question twice in a row if possible
      setQuestion({ ...randomQ, id: `f_${Date.now()}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (option: string) => {
    if (selected || !question) return;
    setSelected(option);
    setTotalAttempted(prev => prev + 1);
    
    const isCorrect = option === question.answer;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    // Attempt to save to Firebase (will fail gracefully if not configured)
    try {
      fetch('http://localhost:8000/api/v1/quiz/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'guest_user',
          score: isCorrect ? 1 : 0,
          total: 1,
          difficulty: difficulty
        })
      });
    } catch {}
  };

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
        >
          <div className="inline-flex p-5 bg-primary/10 rounded-3xl mb-6">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Adaptive AI Quiz</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Challenge yourself with dynamically generated questions based on the latest Indian election guidelines.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-10">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-4 rounded-2xl font-bold transition-all border-2 ${
                  difficulty === d 
                    ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' 
                    : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button 
            onClick={() => { setQuizStarted(true); fetchQuestion(); }}
            className="w-full py-5 bg-primary text-white text-xl font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/30"
          >
            Start Dynamic Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const handleNext = () => {
    if (totalAttempted >= MAX_QUESTIONS) {
      setIsFinished(true);
    } else {
      fetchQuestion();
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setTotalAttempted(0);
    setIsFinished(false);
    fetchQuestion();
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
        >
          <div className="inline-flex p-5 bg-primary/10 rounded-3xl mb-6">
            <Target className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">Quiz Complete!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-xl">
            You scored <span className="font-bold text-primary">{score}</span> out of <span className="font-bold">{MAX_QUESTIONS}</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-10">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" 
              style={{ width: `${(score / MAX_QUESTIONS) * 100}%` }}
            ></div>
          </div>
          <button 
            onClick={restartQuiz}
            className="w-full py-5 bg-primary text-white text-xl font-bold rounded-2xl hover:bg-primary-focus transition-all shadow-xl shadow-primary/30"
          >
            Restart Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Stats Header */}
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-bold">{score} Correct</span>
          </div>
          <div className="text-slate-300">|</div>
          <div className="font-medium text-slate-500">Attempted {totalAttempted}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            difficulty === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
          }`}>
            {difficulty} Mode
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 text-center"
          >
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-medium">AI is crafting a unique question for you...</p>
            </div>
          </motion.div>
        ) : question && (
          <motion.div 
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-tight">
                {question.question}
              </h2>
              
              <div className="grid gap-4">
                {question.options.map((opt, i) => {
                  const isCorrect = opt === question.answer;
                  const isSelected = selected === opt;
                  
                  let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ";
                  
                  if (!selected) {
                    btnClass += "border-slate-100 dark:border-slate-800 hover:border-primary hover:bg-primary/5 bg-slate-50/50 dark:bg-slate-800/30";
                  } else {
                    if (isCorrect) {
                      btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
                    } else if (isSelected) {
                      btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300";
                    } else {
                      btnClass += "border-slate-100 dark:border-slate-800 opacity-50";
                    }
                  }

                  return (
                    <button key={i} onClick={() => handleSelect(opt)} disabled={!!selected} className={btnClass}>
                      <span className="font-bold text-lg">{opt}</span>
                      {selected && isCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {selected && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {selected && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-slate-900 dark:bg-primary/10 text-white dark:text-primary p-8 rounded-[2rem] shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-white/20 dark:bg-primary/20 rounded-xl">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Deep Dive Explanation</h3>
                    <p className="text-slate-300 dark:text-slate-400 leading-relaxed font-medium">
                      {question.explanation}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-8 py-4 bg-white dark:bg-primary text-primary dark:text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    <span>{totalAttempted >= MAX_QUESTIONS ? 'See Results' : 'Next Concept'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

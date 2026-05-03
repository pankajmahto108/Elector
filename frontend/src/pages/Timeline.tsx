import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

export default function Timeline() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);

  const FALLBACK_STEPS = [
    {
      id: 1,
      title: "Voter Registration & Electoral Roll Update",
      description: "The Election Commission of India (ECI) updates the electoral rolls. Eligible citizens (18+ years) can register to vote, update details, or remove duplicate entries."
    },
    {
      id: 2,
      title: "Announcement of Election Schedule",
      description: "The ECI formally announces the election dates in a press conference. This immediately triggers the Model Code of Conduct (MCC)."
    },
    {
      id: 3,
      title: "Filing & Scrutiny of Nominations",
      description: "Candidates file their nomination papers along with affidavits detailing their assets, criminal records, and educational qualifications."
    },
    {
      id: 4,
      title: "Election Campaigning",
      description: "Parties and candidates actively campaign through rallies and media. Campaigning ends strictly 48 hours before voting day."
    },
    {
      id: 5,
      title: "Voting Day (Polling)",
      description: "Voters cast their votes using Electronic Voting Machines (EVMs) and VVPATs. The polling is tightly secured by paramilitary forces."
    },
    {
      id: 6,
      title: "Counting & Declaration of Results",
      description: "EVMs are opened under strict security. Votes are counted, and the candidate with the highest votes is declared the winner."
    }
  ];

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/timeline/')
      .then(res => res.json())
      .then(data => {
        if (data && data.steps && data.steps.length > 0) {
          setSteps(data.steps);
        } else {
          setSteps(FALLBACK_STEPS);
        }
        setLoading(false);
      })
      .catch(() => {
        setSteps(FALLBACK_STEPS);
        setLoading(false);
      });
  }, []);

  const handleExplain = async (step: Step) => {
    setExplaining(true);
    setExplanationLoading(true);
    setExplanation(null);
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/timeline/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_id: step.id,
          step_title: step.title,
          step_description: step.description
        })
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation("Unable to get explanation right now.");
    } finally {
      setExplanationLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto py-20 space-y-4">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full mb-8"></div>
      <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl"></div>
    </div>
  );

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Interactive Election Timeline
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Navigate through the democratic cycle step-by-step.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                  Phase {currentStep.id}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {currentStep.title}
                </h2>
              </div>
              <button 
                onClick={() => handleExplain(currentStep)}
                className="p-3 text-primary bg-primary/5 hover:bg-primary/15 rounded-2xl transition-colors group flex items-center gap-2"
                title="Explain with AI"
              >
                <Info className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline font-semibold">AI Explain</span>
              </button>
            </div>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {currentStep.description}
            </p>

            <AnimatePresence>
              {explaining && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800 relative">
                    {explanationLoading ? (
                      <div className="flex items-center space-x-3 text-primary font-medium p-4 bg-primary/5 rounded-2xl">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Elector AI is analyzing this phase...</span>
                      </div>
                    ) : (
                      <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl relative shadow-inner">
                        <button 
                          onClick={() => setExplaining(false)} 
                          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="flex gap-3 mb-3">
                          <Info className="w-5 h-5 text-primary shrink-0" />
                          <h3 className="font-bold text-primary">AI Insights</h3>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed prose prose-slate dark:prose-invert max-w-none">
                          {explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => {
            setExplaining(false);
            setCurrentStepIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={currentStepIndex === 0}
          className="flex items-center space-x-2 px-6 py-4 rounded-2xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Phase</span>
        </button>
        
        <button
          onClick={() => {
            setExplaining(false);
            setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
          }}
          disabled={currentStepIndex === steps.length - 1}
          className="flex items-center space-x-2 px-6 py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary-focus hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          <span>Next Phase</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

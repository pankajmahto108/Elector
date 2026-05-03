import { useState, useEffect, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, Award } from 'lucide-react';
import ModuleCard, { type ModuleData } from '../components/learning/ModuleCard';
import ProgressBar from '../components/learning/ProgressBar';

const LEARNING_MODULES: ModuleData[] = [
  {
    id: 1,
    title: "Introduction to Elections",
    explanation: "Democracy is a system of government by the whole population, typically through elected representatives. Elections are the foundation of this system, allowing citizens to choose their leaders and shape the future of the nation.",
    bulletPoints: [
      "Democracy means 'rule by the people'.",
      "Elections provide a peaceful way to transfer power.",
      "Ensures accountability of leaders to the public.",
      "Gives every adult citizen an equal voice (One Person, One Vote)."
    ],
    quiz: [
      {
        question: "What does Democracy literally mean?",
        options: ["Rule by a king", "Rule by the people", "Rule by the rich", "Rule by the army"],
        answer: "Rule by the people"
      },
      {
        question: "Why are elections important in a democracy?",
        options: ["To collect taxes", "To start wars", "To peacefully choose leaders", "To decide holidays"],
        answer: "To peacefully choose leaders"
      }
    ]
  },
  {
    id: 2,
    title: "Election Commission of India (ECI)",
    explanation: "The Election Commission of India is an autonomous constitutional authority responsible for administering election processes in India at national and state levels.",
    bulletPoints: [
      "Operates under Article 324 of the Constitution.",
      "Conducts elections for Lok Sabha, Rajya Sabha, and State Assemblies.",
      "Enforces the Model Code of Conduct.",
      "Registers political parties and assigns symbols."
    ],
    quiz: [
      {
        question: "Under which Article of the Constitution does the ECI operate?",
        options: ["Article 370", "Article 324", "Article 15", "Article 21"],
        answer: "Article 324"
      },
      {
        question: "Which of the following is NOT a role of the ECI?",
        options: ["Assigning symbols to parties", "Enforcing Model Code of Conduct", "Making national laws", "Conducting Lok Sabha elections"],
        answer: "Making national laws"
      }
    ]
  },
  {
    id: 3,
    title: "Election Timeline",
    explanation: "An election follows a strict chronological process to ensure fairness, from the initial announcement to the final counting of votes.",
    bulletPoints: [
      "Announcement: The ECI declares dates, activating the Model Code of Conduct.",
      "Nomination: Candidates file papers and declare assets.",
      "Campaigning: Candidates present their manifestos to voters.",
      "Voting Day: Registered voters cast their ballots.",
      "Counting Day: Votes are counted securely and results declared."
    ],
    quiz: [
      {
        question: "What comes immediately after the Election Announcement?",
        options: ["Voting", "Campaigning", "Nomination", "Counting"],
        answer: "Nomination"
      },
      {
        question: "When does the Model Code of Conduct (MCC) become active?",
        options: ["On Voting Day", "During Counting", "Immediately upon Announcement", "After Nominations"],
        answer: "Immediately upon Announcement"
      }
    ]
  },
  {
    id: 4,
    title: "The Voting Process",
    explanation: "Voting in India is primarily conducted using Electronic Voting Machines (EVMs) accompanied by Voter Verifiable Paper Audit Trails (VVPATs) to ensure accuracy and transparency.",
    bulletPoints: [
      "EVMs record votes electronically, preventing invalid votes.",
      "VVPAT prints a paper slip showing the candidate voted for, for 7 seconds.",
      "Citizens need a Voter ID or approved ID proof to cast a vote.",
      "Indelible ink is applied to the finger to prevent double voting."
    ],
    quiz: [
      {
        question: "What does VVPAT do?",
        options: ["Takes a photo of the voter", "Prints a paper slip verifying the vote", "Counts the final votes", "Connects to the internet"],
        answer: "Prints a paper slip verifying the vote"
      },
      {
        question: "Why is indelible ink applied to a voter's finger?",
        options: ["As a reward", "To identify the political party", "To prevent double voting", "For health reasons"],
        answer: "To prevent double voting"
      }
    ]
  },
  {
    id: 5,
    title: "Results & Government Formation",
    explanation: "After voting concludes, votes are counted under strict surveillance. The party or coalition with a majority of seats forms the government.",
    bulletPoints: [
      "EVMs are kept in strongrooms until counting day.",
      "A party needs 272+ seats in the Lok Sabha for an absolute majority.",
      "The leader of the majority party becomes the Prime Minister.",
      "If no party has a majority, a coalition government may be formed."
    ],
    quiz: [
      {
        question: "How many seats are generally needed for a majority in the Lok Sabha?",
        options: ["200", "250", "272+", "543"],
        answer: "272+"
      },
      {
        question: "What is formed if no single party achieves a clear majority?",
        options: ["A dictatorship", "A coalition government", "A monarchy", "The election is cancelled"],
        answer: "A coalition government"
      }
    ]
  }
];

export default function Learn() {
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('elector_learning_progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('elector_learning_progress', JSON.stringify(completedModuleIds));
  }, [completedModuleIds]);

  const handleComplete = (id: number) => {
    if (!completedModuleIds.includes(id)) {
      setCompletedModuleIds([...completedModuleIds, id]);
    }
  };

  const progressPercentage = (completedModuleIds.length / LEARNING_MODULES.length) * 100;
  
  // A module is unlocked if it's the first one, or if the previous one is completed.
  const isUnlocked = (index: number) => index === 0 || completedModuleIds.includes(LEARNING_MODULES[index - 1].id);

  const nextUncompletedIndex = useMemo(() => {
    const index = LEARNING_MODULES.findIndex(m => !completedModuleIds.includes(m.id));
    return index === -1 ? 0 : index; // if all completed, return to start
  }, [completedModuleIds]);

  const handleContinueLearning = () => {
    const el = document.getElementById(`module-${LEARNING_MODULES[nextUncompletedIndex].id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="md:w-1/4 shrink-0 hidden md:block">
        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-primary transition-colors font-medium mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Course Modules</span>
          </h3>
          
          <nav className="space-y-2">
            {LEARNING_MODULES.map((mod, idx) => {
              const unlocked = isUnlocked(idx);
              const completed = completedModuleIds.includes(mod.id);
              
              return (
                <button
                  key={mod.id}
                  disabled={!unlocked}
                  onClick={() => {
                    document.getElementById(`module-${mod.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center space-x-3 text-sm font-medium ${
                    completed 
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : unlocked 
                        ? 'hover:bg-primary/5 text-slate-700 dark:text-slate-300' 
                        : 'opacity-50 grayscale cursor-not-allowed text-slate-400'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${completed ? 'border-green-500 bg-green-500 text-white' : unlocked ? 'border-primary text-primary' : 'border-slate-300'}`}>
                    {completed ? <Award className="w-3 h-3" /> : mod.id}
                  </div>
                  <span className="truncate">{mod.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:w-3/4 flex-grow space-y-12">
        
        {/* Mobile Back Button */}
        <div className="md:hidden">
          <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[3rem] p-8 md:p-12 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-sm mb-6">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>Certified Learning Path</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Learn the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Indian Election Process</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mb-8">
              A simple, interactive, step-by-step guide to understanding the world's largest democracy.
            </p>

            <ProgressBar progress={progressPercentage} />

            {progressPercentage < 100 ? (
              <button 
                onClick={handleContinueLearning}
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-focus transition-all shadow-xl shadow-primary/30"
              >
                {completedModuleIds.length === 0 ? "Start First Module" : "Continue Learning"}
              </button>
            ) : (
              <div className="inline-flex items-center space-x-3 px-8 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30">
                <Award className="w-6 h-6" />
                <span>Course Completed! You're a Certified Elector.</span>
              </div>
            )}
          </div>
        </section>

        {/* Modules List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Curriculum Modules</h2>
          {LEARNING_MODULES.map((module, index) => (
            <div key={module.id} id={`module-${module.id}`}>
              <ModuleCard 
                module={module}
                isUnlocked={isUnlocked(index)}
                isCompleted={completedModuleIds.includes(module.id)}
                onComplete={() => handleComplete(module.id)}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

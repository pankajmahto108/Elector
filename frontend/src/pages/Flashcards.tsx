import { useState } from 'react';
import { motion } from 'framer-motion';

const terms = [
  { term: 'ECI', definition: 'Election Commission of India. A constitutional body responsible for administering elections.' },
  { term: 'EVM', definition: 'Electronic Voting Machine. Used to cast and record votes electronically.' },
  { term: 'VVPAT', definition: 'Voter Verifiable Paper Audit Trail. Allows voters to verify that their vote was cast correctly.' },
  { term: 'MCC', definition: 'Model Code of Conduct. Guidelines issued by ECI for conduct of political parties and candidates.' },
  { term: 'NOTA', definition: 'None Of The Above. Option allowing voters to reject all candidates in their constituency.' },
];

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % terms.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + terms.length) % terms.length);
    }, 200);
  };

  return (
    <div className="max-w-xl mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-8">Election Flashcards</h1>
      
      <div className="relative h-80 w-full mb-8 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-slate-200 flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-widest">Term</span>
            <h2 className="text-6xl font-extrabold text-primary">{terms[currentIndex].term}</h2>
            <p className="mt-8 text-sm text-slate-400 font-medium">Click to reveal</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-primary text-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-sm font-medium text-blue-200 mb-4 uppercase tracking-widest">Definition</span>
            <p className="text-2xl font-medium leading-relaxed">{terms[currentIndex].definition}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <button onClick={prevCard} className="px-6 py-3 bg-white text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors border border-slate-200">
          Previous
        </button>
        <span className="flex items-center text-slate-500 font-bold">
          {currentIndex + 1} / {terms.length}
        </span>
        <button onClick={nextCard} className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

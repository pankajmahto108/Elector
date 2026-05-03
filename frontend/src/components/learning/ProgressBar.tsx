import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Course Progress</span>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </div>
  );
}

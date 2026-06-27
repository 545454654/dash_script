import { useState, useEffect } from "react";
import { motion } from "motion/react";
import logoImg from "../assets/images/dash_script_logo_1782558894553.jpg";

interface LoadingViewProps {
  onComplete: () => void;
}

export default function LoadingView({ onComplete }: LoadingViewProps) {
  const [progress, setProgress] = useState(0);
  const [activeLines, setActiveLines] = useState<number[]>([]);

  const lines = [
    "جارى الاتصال بالسيرفر...",
    "جارى تحميل البيانات...",
    "جارى قراءة الحساب...",
    "جارى فحص الأمان...",
    "تم تأمين الاتصال..."
  ];

  // Increment lines based on time offsets
  useEffect(() => {
    lines.forEach((_, i) => {
      const timer = setTimeout(() => {
        setActiveLines((prev) => [...prev, i]);
      }, i * 1100);
      return () => clearTimeout(timer);
    });
  }, []);

  // Increment percentage bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.floor(Math.random() * 8) + 2;
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Redirect after complete
          setTimeout(onComplete, 800);
          return 100;
        }
        return next;
      });
    }, 220);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-[430px] px-4 flex flex-col justify-center items-center min-h-[90vh] z-10 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-[#000a14]/75 border-2 border-[#00f7ff] rounded-[24px] p-6 backdrop-blur-xl shadow-[0_0_40px_#00f7ff]"
      >
        <div className="flex justify-center mb-4">
          <img
            src={logoImg}
            alt="dash_script logo"
            className="w-20 h-20 rounded-xl border border-[#00f7ff]/50 shadow-[0_0_15px_rgba(0,247,255,0.25)] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="text-center text-xl font-bold font-mono text-[#00f7ff] mb-6 tracking-[3px] select-none uppercase">
          dash_script
        </h2>

        {/* Lines logs */}
        <div className="flex flex-col gap-3 min-h-[160px] justify-center mb-6" dir="rtl">
          {lines.map((line, idx) => {
            const isVisible = activeLines.includes(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3 }}
                className={`text-sm font-semibold tracking-wide ${
                  idx === lines.length - 1 ? "text-green-400 font-bold" : "text-[#00f7ff]/90"
                }`}
              >
                {isVisible && (
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${idx === lines.length - 1 ? "bg-green-400 animate-ping" : "bg-[#00f7ff] animate-pulse"}`}></span>
                    {line}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#001a22] rounded-full overflow-hidden mb-2 shadow-inner">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
            className="h-full bg-[#00f7ff] shadow-[0_0_12px_#00f7ff]"
          />
        </div>

        {/* Percent label */}
        <div className="text-right text-xs font-mono text-[#00f7ff] font-bold">
          {progress}%
        </div>
      </motion.div>
    </div>
  );
}

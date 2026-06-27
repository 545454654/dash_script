import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, Zap } from "lucide-react";
import { PredictionsMap, RowInfo } from "../types";
import { savePredictionsToDatabase, fetchPredictionsFromDatabase } from "../firebaseService";

// Import the generated game assets
import goodAppleImg from "../assets/images/good_apple_1782554460174.jpg";
import badAppleImg from "../assets/images/bad_apple_1782554477300.jpg";
import logoImg from "../assets/images/dash_script_logo_1782558894553.jpg";

export default function GameView() {
  const [predictions, setPredictions] = useState<PredictionsMap | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);

  // Define multipliers in reverse order (top of screen to bottom of screen)
  const targetRows: RowInfo[] = [
    { mult: "x349.68", row: 9 }, // أعلى صف
    { mult: "x69.93",  row: 8 },
    { mult: "x27.92",  row: 7 },
    { mult: "x11.18",  row: 6 },
    { mult: "x6.71",   row: 5 },
    { mult: "x4.02",   row: 4 },
    { mult: "x2.41",   row: 3 },
    { mult: "x1.93",   row: 2 },
    { mult: "x1.54",   row: 1 },
    { mult: "x1.23",   row: 0 }, // أسفل صف يبدأ منه المشغل
  ];

  // Load existing predictions on mount
  useEffect(() => {
    const loadSaved = async () => {
      const data = await fetchPredictionsFromDatabase();
      if (data) {
        setPredictions(data);
      }
    };
    loadSaved();
  }, []);

  // Safe apple checker per instructions
  const isSafeApple = (rowIdx: number, colIdx: number) => {
    if (!predictions || Object.keys(predictions).length === 0) return false;
    
    // 1. حساب الرقم التسلسلي للخانة
    const mIndex = rowIdx * 5 + colIdx + 1;
    const mKey = `m${mIndex}`;
    
    // 2. قراءة الكائن المقابل للخانة من التوقعات المجلوبة
    const mObj = (predictions as any)[mKey];
    
    // 3. التحقق من القيمة والتأكد أنها تساوي "1"
    if (mObj && typeof mObj === "object" && mObj[mKey] === "1") {
      return true; // التفاحة سليمة!
    }
    
    return false; // التفاحة تالفة
  };

  // Generate predictions based on difficulty specifications
  const generatePredictions = async () => {
    const finalObject: Record<string, any> = {};

    // نمر على 10 صفوف (من 0 إلى 9)
    for (let r = 0; r < 10; r++) {
      // تحديد عدد التفاحات السليمة بالصف بناء على رقم صف
      let safeCount = 4;
      if (r >= 4 && r < 7) safeCount = 3;      // الصفوف 4، 5، 6
      if (r >= 7 && r < 9) safeCount = 2;      // الصفوف 7، 8
      if (r >= 9) safeCount = 1;               // الصف التاسع والأخير

      // تحديد أماكن التفاح السليم بشكل عشوائي داخل الأعمدة الـ 5
      const safeCols: number[] = [];
      while (safeCols.length < safeCount) {
        const randomCol = Math.floor(Math.random() * 5); // اختيار عمود عشوائي من 0 إلى 4
        if (!safeCols.includes(randomCol)) {
          safeCols.push(randomCol);
        }
      }

      // كتابة القيم للخانة (تحويل الصف والعمود لرمز الخانة من 1 لـ 50)
      for (let c = 0; c < 5; c++) {
        const mIndex = r * 5 + c + 1; // المعادلة السحرية لحساب رقم الخانة الفريد
        const value = safeCols.includes(c) ? "1" : "0"; // 1 = سليمة، 0 = تالفة
        
        // الهيكل المعتمد داخل الفايربيز
        finalObject[`m${mIndex}`] = { [`m${mIndex}`]: value };
      }
    }

    // الآن نقوم برفع الكائن بالكامل إلى الفايربيز تحت مسار m11 (وحفظه محلياً أيضاً)
    await savePredictionsToDatabase(finalObject);
    setPredictions(finalObject);
    return finalObject;
  };

  // Run progress loader when START or RELOAD is triggered
  const runLoader = (revealResult: boolean) => {
    setHasRevealed(false);
    setShowLoader(true);
    setLoaderProgress(0);

    let progress = 0;
    const interval = setInterval(async () => {
      // Fast progress updates
      const step = Math.floor(Math.random() * 5) + 2;
      progress += step;

      if (progress >= 100) {
        progress = 100;
        setLoaderProgress(100);
        clearInterval(interval);

        // Generate brand new predictions on reload or start
        const freshPreds = await generatePredictions();

        setTimeout(() => {
          setShowLoader(false);
          if (revealResult) {
            setHasRevealed(true);
          }
        }, 500);
      } else {
        setLoaderProgress(progress);
      }
    }, 45);
  };

  return (
    <div className="w-full max-w-[440px] px-4 flex flex-col items-center min-h-screen py-6 z-10 relative">
      
      {/* Brand logo */}
      <div className="flex justify-center mb-2.5">
        <img
          src={logoImg}
          alt="dash_script logo"
          className="w-20 h-20 rounded-xl border border-[#00f7ff]/50 shadow-[0_0_15px_rgba(0,247,255,0.25)] object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Header title */}
      <h1 className="text-3xl font-black tracking-[4px] text-[#00f7ff] text-center mb-4 drop-shadow-[0_0_15px_#00f7ff] font-mono uppercase">
        dash_script
      </h1>

      {/* Decorative loading animation bar below header */}
      <div className="w-full h-1 bg-[#001a22] rounded-full overflow-hidden mb-6 shadow-[0_0_15px_#00f7ff]">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#00f7ff] to-transparent animate-[slide_1.5s_linear_infinite]" />
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}</style>

      {/* Central Screen Panel */}
      <div className="w-full relative min-h-[500px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* LOADER AREA */}
          {showLoader ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full bg-slate-950/80 border border-[#00f7ff]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-xl shadow-[0_0_30px_rgba(0,247,255,0.15)]"
            >
              {/* Horizontal bar */}
              <div className="w-full h-2.5 bg-[#001a22] rounded-full overflow-hidden mb-8 shadow-inner">
                <div
                  style={{ width: `${loaderProgress}%` }}
                  className="h-full bg-[#00f7ff] transition-all duration-75 shadow-[0_0_12px_#00f7ff]"
                />
              </div>

              {/* Glowing spinner */}
              <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#002a33] border-t-[#00f7ff] animate-spin" />
                <Zap className="w-8 h-8 text-[#00f7ff] animate-pulse" />
              </div>

              {/* Percent label */}
              <div className="text-2xl font-black font-mono text-[#00f7ff] drop-shadow-[0_0_8px_#00f7ff/50]">
                {loaderProgress}%
              </div>
              <div className="text-xs text-[#00f7ff]/60 mt-1 font-bold tracking-widest uppercase">
                Analyzing Predictions
              </div>
            </motion.div>
          ) : (
            
            /* BOARD GRID */
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full bg-slate-950/80 border border-[#00f7ff]/40 rounded-3xl p-4 backdrop-blur-xl shadow-[0_0_35px_rgba(0,247,255,0.2)]"
            >
              <div className="flex flex-col gap-2.5">
                {targetRows.map((rowInfo, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-3">
                    
                    {/* Multiplier Tag */}
                    <div className="w-16 text-center bg-[#001a22] border border-[#00f7ff]/25 py-1.5 rounded-xl text-[#00f7ff] font-black text-[11px] font-mono shadow-[0_0_8px_rgba(0,247,255,0.1)]">
                      {rowInfo.mult}
                    </div>
                    
                    {/* 5 Columns/Apples Grid */}
                    <div className="grid grid-cols-5 gap-2.5 flex-1">
                      {Array.from({ length: 5 }).map((_, cIdx) => {
                        const isSafe = isSafeApple(rowInfo.row, cIdx);
                        return (
                          <motion.div 
                            key={cIdx}
                            initial={{ scale: 0.95, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: hasRevealed ? (targetRows.length - 1 - rowInfo.row) * 0.05 + cIdx * 0.02 : 0 }}
                            className={`aspect-square rounded-[14px] border flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                              hasRevealed && isSafe 
                                ? "border-green-500/50 bg-green-500/10 shadow-[0_0_14px_rgba(34,197,94,0.45)] scale-[1.03]" 
                                : "border-white/5 bg-white/[0.02]"
                            }`}
                          >
                            {hasRevealed && (
                              isSafe ? (
                                <motion.img 
                                  initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                                  src={goodAppleImg} 
                                  alt="Safe Apple"
                                  className="w-[82%] h-[82%] object-contain" 
                                />
                              ) : (
                                <motion.img 
                                  initial={{ scale: 0.3, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 0.15 }}
                                  transition={{ duration: 0.2 }}
                                  src={badAppleImg} 
                                  alt="Bad Apple"
                                  className="w-[82%] h-[82%] object-contain grayscale" 
                                />
                              )
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Button Controls */}
      <div className="w-full flex flex-col gap-3.5 mt-6 relative z-10">
        
        {/* START button */}
        <button
          id="startBtn"
          onClick={() => runLoader(true)}
          disabled={showLoader}
          className="w-full py-4.5 bg-[#00f7ff] text-black font-black text-lg rounded-[20px] tracking-wider cursor-pointer hover:bg-white active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_20px_#00f7ff] flex items-center justify-center gap-2 select-none"
        >
          <Sparkles className="w-5 h-5" />
          START
        </button>

      </div>
    </div>
  );
}

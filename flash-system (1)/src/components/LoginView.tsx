import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Key, User, ExternalLink, Send } from "lucide-react";
import { fetchAdminCodes, fetchTelegramLink, TimedAdminCode } from "../firebaseService";
import logoImg from "../assets/images/dash_script_logo_1782558894553.jpg";

interface LoginViewProps {
  onSuccess: () => void;
}

export default function LoginView({ onSuccess }: LoginViewProps) {
  const [uid, setUid] = useState("");
  const [pass, setPass] = useState("");
  const [showError, setShowError] = useState(false);

  // States for Steps Modal
  const [showSteps, setShowSteps] = useState(false);

  // Dynamically loaded admin data
  const [adminCodes, setAdminCodes] = useState<TimedAdminCode[]>([]);
  const [telegramLink, setTelegramLink] = useState("https://t.me/P9_B_ET");

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      const codes = await fetchAdminCodes();
      const link = await fetchTelegramLink();
      if (codes) {
        setAdminCodes(codes);
      }
      if (link) {
        setTelegramLink(link);
      }
    };
    loadConfig();
  }, []);

  const handleLogin = () => {
    const validID = /^\d{10}$/.test(uid.trim());
    const now = Date.now();
    const isCodeValid = adminCodes.some((item) => {
      const match = item.code.toLowerCase().trim() === pass.toLowerCase().trim();
      const notExpired = item.expiresAt === null || item.expiresAt > now;
      return match && notExpired;
    });

    if (!validID || !isCodeValid) {
      setShowError(true);
      return;
    }
    onSuccess();
  };

  return (
    <div className="w-full max-w-[430px] px-4 flex flex-col justify-center items-center min-h-[90vh] z-10 relative">
      
      {/* Dynamic Steps on Top / Above Logo */}
      <div className="w-full bg-[#001018]/95 border border-yellow-500/40 rounded-2xl p-5 mb-4 text-right backdrop-blur shadow-[0_0_25px_rgba(234,179,8,0.15)] relative" dir="rtl">
        <h3 className="text-yellow-400 font-black text-sm mb-2.5 flex items-center gap-1.5 justify-start">
          <Send className="w-4 h-4 text-yellow-400" />
          <span>الشروط والأحكام وخطوات التفعيل:</span>
        </h3>
        
        {/* Standard Terms List */}
        <ul className="text-white/85 text-[11px] leading-relaxed mb-4 list-decimal list-inside space-y-1.5 pr-1 border-r border-yellow-500/20">
          <li>سجل حساب جديد على منصة <b className="text-yellow-400">SpinBetter</b> مع تفعيل البروموكود <b className="text-yellow-400 font-mono">XR88</b>.</li>
          <li>قم بعمل إيداع بقيمة <b className="text-yellow-400">200 جنيه مصري</b> كحد أدنى لتفعيل حسابك وتوقع السكربت.</li>
          <li>يجب الالتزام الدائم بإرشادات القناة الرسمية وتحديث أكواد السكربت لتجنب انتهاء صلاحيتها.</li>
          <li>توقعات وتحليلات السكربت ترفيهية وتقديرية مبنية على الذكاء الاصطناعي وتتطلب حساباً نشطاً ومفعلاً.</li>
        </ul>

        <p className="text-white/90 text-xs font-bold mb-3">
          بمجرد الضغط بالأسفل، سيتم توجيهك فوراً لصفحة التسجيل لتفعيل السكربت:
        </p>

        <a
          href="https://spinbetter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(220,38,38,0.35)]"
        >
          <span>اضغط هنا للتسجيل في المنصة فوراً 🚀</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-slate-950/75 border-2 border-[#00f7ff]/50 rounded-[28px] p-8 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(0,247,255,0.25)] relative"
      >
        <div className="flex justify-center mb-5">
          <img
            src={logoImg}
            alt="dash_script logo"
            className="w-28 h-28 rounded-2xl border-2 border-[#00f7ff]/50 shadow-[0_0_20px_rgba(0,247,255,0.3)] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <h1 className="text-3xl font-black tracking-[2px] text-[#00f7ff] mb-6 drop-shadow-[0_0_15px_rgba(0,247,255,0.6)] font-mono uppercase">
          dash_script LOGIN
        </h1>

        {/* Account ID Field */}
        <div className="relative mb-4" dir="rtl">
          <div className="absolute right-4 top-3.5 text-[#00f7ff]/70">
            <User className="w-5 h-5" />
          </div>
          <input
            id="uid"
            type="text"
            placeholder="ادخل ID (10 أرقام)"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            maxLength={10}
            className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-[#00f7ff]/40 bg-[#001018] text-[#00f7ff] placeholder-[#00f7ff]/45 text-right outline-none focus:border-[#00f7ff] focus:shadow-[0_0_10px_rgba(0,247,255,0.2)] transition-all font-semibold"
          />
        </div>

        {/* Password Field */}
        <div className="relative mb-6" dir="rtl">
          <div className="absolute right-4 top-3.5 text-[#00f7ff]/70">
            <Key className="w-5 h-5" />
          </div>
          <input
            id="pass"
            type="password"
            placeholder="كلمة مرور تفعيل السكربت"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-[#00f7ff]/40 bg-[#001018] text-[#00f7ff] placeholder-[#00f7ff]/45 text-right outline-none focus:border-[#00f7ff] focus:shadow-[0_0_10px_rgba(0,247,255,0.2)] transition-all font-semibold animate-pulse-subtle"
          />
        </div>

        {/* Login Action Button */}
        <button
          onClick={handleLogin}
          className="w-full py-4 rounded-[30px] bg-[#00f7ff] text-black font-black text-lg cursor-pointer hover:bg-white hover:shadow-[0_0_25px_rgba(0,247,255,0.7)] transition-all active:scale-[0.98] select-none"
        >
          دخول
        </button>

        {/* Steps Options */}
        <div className="flex flex-col gap-2.5 mt-5 text-right" dir="rtl">
          <p className="text-yellow-400 font-bold text-xs text-center mb-1 select-none">
            خطوات الحصول على كود التفعيل أسفل حقل الإدخال:
          </p>
          <a
            href="https://t.me/P9_B_ET"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-[30px] bg-yellow-500/10 border-2 border-yellow-400/40 text-yellow-400 hover:text-black font-black text-sm text-center block cursor-pointer hover:bg-yellow-400 transition-all active:scale-[0.98] select-none shadow-[0_0_15px_rgba(234,179,8,0.15)]"
          >
            🔑 اضغط هنا للانتقال إلى قناة التليجرام الرسمية
          </a>
        </div>

      </motion.div>

      {/* CODES ADMIN LOGIN PROMPT */}


      {/* STEP-BY-STEP ACTIVATION MODAL */}
      <AnimatePresence>
        {showSteps && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#001018] border-2 border-yellow-400/70 p-6 rounded-3xl w-full max-w-[380px] text-right shadow-[0_0_35px_rgba(234,179,8,0.25)]"
              dir="rtl"
            >
              <h3 className="text-xl font-black text-yellow-400 mb-5 flex items-center gap-2 border-b border-yellow-400/20 pb-3">
                <Send className="w-5 h-5 text-yellow-400" />
                خطوات الحصول على كود التفعيل
              </h3>

              <div className="flex flex-col gap-5 text-white/95 text-sm font-semibold">
                
                {/* Step 1 */}
                <div className="flex gap-3 items-start">
                  <div className="bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md">
                    ١
                  </div>
                  <div className="flex-1">
                    <p className="mb-2 leading-relaxed">انضم لقناة التليجرام الرسمية للحصول على أكواد تفعيل جديدة ونشطة ومتابعة التحديثات:</p>
                    <a
                      href={telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                    >
                      <span>انضم لقناة التليجرام الرسمية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start">
                  <div className="bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md">
                    ٢
                  </div>
                  <div>
                    <p className="leading-relaxed">
                      سجل حساب جديد على منصة <b className="text-yellow-400">SpinBetter</b> وتأكد من تفعيل الاتصال لتتمكن من استخدام السكربت.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start">
                  <div className="bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md">
                    ٣
                  </div>
                  <div>
                    <p className="leading-relaxed">
                      احصل على كود التفعيل الخاص بك من القناة أو من المسؤول، ثم ضعه في خانة تسجيل الدخول بالأعلى لتفعيل توقعات السكربت فوراً!
                    </p>
                  </div>
                </div>

              </div>

              <button
                onClick={() => setShowSteps(false)}
                className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all cursor-pointer text-center text-sm border border-white/10"
              >
                إغلاق النافذة
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR MODAL */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#001018] border border-[#00f7ff]/60 p-6 rounded-2xl text-center max-w-[280px]"
            >
              <div className="text-red-500 font-bold text-lg mb-4 flex flex-col items-center gap-2">
                <span className="text-4xl animate-bounce">❌</span>
                البيانات خطأ
              </div>
              <p className="text-white/80 text-sm mb-5 leading-relaxed" dir="rtl">
                كود تفعيل السكربت أو الـ ID المدخل غير صحيح!
                يرجى اتباع خطوات الحصول على كود تفعيل صالح.
              </p>
              <button
                onClick={() => setShowError(false)}
                className="w-full py-2 bg-[#00f7ff] text-[#001018] font-black rounded-xl hover:bg-white transition-all cursor-pointer shadow-[0_0_12px_#00f7ff]"
              >
                حسناً
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

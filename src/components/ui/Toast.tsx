"use client";
import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface Toast { id: string; message: string; type: "success" | "error" | "info"; }
interface ToastContextType { add: (message: string, type?: Toast["type"]) => void; }

const ToastContext = createContext<ToastContextType>({ add: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 40, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className="flex items-center gap-3 glass-raised rounded-xl px-4 py-3 shadow-dropdown min-w-[260px]">
              {t.type === "success" && <CheckCircle className="h-4 w-4 text-emerald flex-shrink-0" />}
              {t.type === "error" && <AlertCircle className="h-4 w-4 text-rose flex-shrink-0" />}
              {t.type === "info" && <Info className="h-4 w-4 text-cyan flex-shrink-0" />}
              <p className="text-sm text-text-primary flex-1">{t.message}</p>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

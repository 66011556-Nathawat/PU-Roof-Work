import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface CeoPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reason?: string;
}

export const CeoPasswordModal: React.FC<CeoPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  reason,
}) => {
  const { lang } = useLanguage();
  const { isDark } = useTheme();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '1234') {
      setIsSuccess(true);
      setError(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } else {
      setError(true);
      setErrorMessage(
        lang === 'th'
          ? 'รหัสผ่านไม่ถูกต้อง กรุณาระบุรหัสผ่าน CEO ที่ถูกต้อง (Hint: 1234)'
          : 'Invalid PIN. Please enter the correct CEO Master PIN (Hint: 1234)'
      );
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin === '1234') {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 400);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const modalBgCls = isDark
    ? 'bg-slate-900 border-slate-700 text-white'
    : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`border rounded-2xl max-w-sm w-full overflow-hidden animate-fadeIn shadow-2xl ${modalBgCls}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <span>{lang === 'th' ? 'การยืนยันตัวตน CEO' : 'CEO Authentication'}</span>
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'th' ? 'รหัสผ่านสิทธิ์ผู้บริหารสูงสุด' : 'Master Executive PIN Verification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg">
            <KeyRound className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-base font-bold">
              {lang === 'th' ? 'กรุณากรอกรหัสผ่าน CEO' : 'Enter CEO Master PIN'}
            </h4>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {reason ||
                (lang === 'th'
                  ? 'เพื่อปลดล็อกสิทธิ์ควบคุมสูงสุด และระบบข้อสั่งการถึงแอดมิน'
                  : 'To unlock full system control and executive directives to admin')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="• • • •"
                className={`w-full text-center text-2xl font-mono tracking-widest py-2.5 px-4 rounded-xl border transition focus:outline-hidden ${
                  error
                    ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                    : isSuccess
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'ยืนยันสิทธิ์ CEO สำเร็จ!' : 'CEO Verified Successfully!'}</span>
              </div>
            )}

            {/* Numeric Keypad for fast touch or click */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleKeyPress(n)}
                  className={`py-2 rounded-lg font-mono text-sm font-semibold transition border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className={`py-2 rounded-lg text-xs font-medium transition border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                }`}
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className={`py-2 rounded-lg font-mono text-sm font-semibold transition border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className={`py-2 rounded-lg text-xs font-medium transition border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                }`}
              >
                ⌫
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`w-1/2 py-2 rounded-xl text-xs font-semibold transition border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'th' ? 'ปลดล็อก (1234)' : 'Unlock (1234)'}</span>
              </button>
            </div>
          </form>

          {/* Quick Credential Badge */}
          <div
            className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span>{lang === 'th' ? 'รหัสผ่าน CEO ที่กำหนด:' : 'Preset CEO PIN:'}</span>
            <code className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold font-mono">
              1234
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

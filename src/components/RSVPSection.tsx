import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, HeartHandshake, Sparkles, Send } from 'lucide-react';
import { ArabesqueCorner, IslamicStarKhatim } from './IslamicOrnaments';

export const RSVPSection: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [attendance, setAttendance] = useState<'accept' | 'decline' | null>('accept');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    attendance: 'accept' | 'decline';
  } | null>(null);

  useEffect(() => {
    // Check if guest already RSVPed in local storage
    const stored = localStorage.getItem('royal_wedding_rsvp_syed_mehek');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSubmittedData(parsed);
        setIsSubmitted(true);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attendance) return;

    const record = {
      name: name.trim(),
      attendance,
    };

    localStorage.setItem('royal_wedding_rsvp_syed_mehek', JSON.stringify(record));
    setSubmittedData(record);
    setIsSubmitted(true);

    if (attendance === 'accept') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#dfba73', '#f5e4bd', '#c5a059', '#104d38'],
      });
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    if (submittedData) {
      setName(submittedData.name);
      setAttendance(submittedData.attendance);
    }
  };

  return (
    <section id="rsvp" className="relative py-24 px-4 max-w-2xl mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Main RSVP Card */}
      <div className="relative paper-card-texture text-[#152a22] rounded-3xl p-8 sm:p-12 border-2 border-[#dfba73] shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Arabesque corners */}
        <ArabesqueCorner position="tl" size={48} className="absolute top-2 left-2 opacity-80" />
        <ArabesqueCorner position="tr" size={48} className="absolute top-2 right-2 opacity-80" />
        <ArabesqueCorner position="bl" size={48} className="absolute bottom-2 left-2 opacity-80" />
        <ArabesqueCorner position="br" size={48} className="absolute bottom-2 right-2 opacity-80" />

        <div className="text-center mb-8">
          <p className="font-arabic text-2xl sm:text-3xl text-[#0b291e] font-bold mb-1">
            تأكيد الحضور
          </p>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#061e16] uppercase">
            Your Presence Would Mean The World To Us
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-10 bg-[#cca052]" />
            <IslamicStarKhatim size={14} className="text-[#cca052]" />
            <span className="h-[1px] w-10 bg-[#cca052]" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted && submittedData ? (
            /* Confirmation Card */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#0a291e] text-[#fce8a6] border-2 border-[#dfba73] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-[#fce8a6]" />
              </div>

              <h3 className="font-cinzel text-2xl font-bold text-[#082018] mb-1">
                JazakAllahu Khairan!
              </h3>
              <p className="font-cormorant italic text-lg text-[#614515] mb-4">
                {submittedData.attendance === 'accept'
                  ? `Thank you, ${submittedData.name}. We joyfully anticipate celebrating this blessed day in your gracious company!`
                  : `Thank you for your sincere response, ${submittedData.name}. You will remain in our prayers and thoughts.`}
              </p>

              <div className="inline-block p-4 rounded-xl bg-white/70 border border-[#cca052]/40 text-xs font-cinzel tracking-widest text-[#082018] mb-6 shadow-sm">
                <span>STATUS: </span>
                <span className="font-bold text-[#946b25] uppercase">
                  {submittedData.attendance === 'accept'
                    ? 'Joyfully Accepted'
                    : 'Regretfully Declined'}
                </span>
              </div>

              <div>
                <button
                  onClick={handleEdit}
                  className="text-xs font-cinzel text-[#826127] hover:text-[#061e16] underline tracking-widest uppercase transition-colors"
                >
                  Update Response
                </button>
              </div>
            </motion.div>
          ) : (
            /* RSVP Form with ONLY Name and Attendance Options (No guest count) */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="guest-name"
                  className="block font-cinzel text-xs font-bold uppercase tracking-widest text-[#0b291e] mb-2"
                >
                  Your Full Name
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  placeholder="Enter your esteemed name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#cca052]/60 text-[#082018] placeholder-[#082018]/40 focus:outline-none focus:ring-2 focus:ring-[#cca052] font-cormorant text-lg shadow-sm"
                />
              </div>

              {/* Attendance Selection Cards: Joyfully Accept vs Regretfully Decline */}
              <div>
                <span className="block font-cinzel text-xs font-bold uppercase tracking-widest text-[#0b291e] mb-3">
                  Will You Be Attending?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Joyfully Accept */}
                  <div
                    onClick={() => setAttendance('accept')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      attendance === 'accept'
                        ? 'border-[#0a291e] bg-[#0a291e] text-[#fce8a6] shadow-md'
                        : 'border-[#cca052]/40 bg-white/60 text-[#123126] hover:bg-white/90'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        attendance === 'accept'
                          ? 'border-[#fce8a6] bg-[#fce8a6]'
                          : 'border-[#cca052]'
                      }`}
                    >
                      {attendance === 'accept' && (
                        <div className="w-2 h-2 rounded-full bg-[#0a291e]" />
                      )}
                    </div>
                    <div>
                      <p className="font-cinzel text-sm font-bold tracking-wider">
                        Joyfully Accept
                      </p>
                      <p
                        className={`text-xs font-cormorant italic ${
                          attendance === 'accept'
                            ? 'text-[#dfba73]'
                            : 'text-[#58411b]'
                        }`}
                      >
                        With grace and prayers
                      </p>
                    </div>
                  </div>

                  {/* Regretfully Decline */}
                  <div
                    onClick={() => setAttendance('decline')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      attendance === 'decline'
                        ? 'border-[#0a291e] bg-[#0a291e] text-[#fce8a6] shadow-md'
                        : 'border-[#cca052]/40 bg-white/60 text-[#123126] hover:bg-white/90'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        attendance === 'decline'
                          ? 'border-[#fce8a6] bg-[#fce8a6]'
                          : 'border-[#cca052]'
                      }`}
                    >
                      {attendance === 'decline' && (
                        <div className="w-2 h-2 rounded-full bg-[#0a291e]" />
                      )}
                    </div>
                    <div>
                      <p className="font-cinzel text-sm font-bold tracking-wider">
                        Regretfully Decline
                      </p>
                      <p
                        className={`text-xs font-cormorant italic ${
                          attendance === 'decline'
                            ? 'text-[#dfba73]'
                            : 'text-[#58411b]'
                        }`}
                      >
                        Sending warmest du’as
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-gradient-to-r from-[#09261c] to-[#04140f] border border-[#dfba73] text-[#fce8a6] hover:text-white hover:border-[#fce8a6] font-cinzel text-xs tracking-[0.25em] uppercase transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 mx-auto active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT RSVP</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

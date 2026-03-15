'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Check,
  MapPin,
  Phone,
  Loader2,
  Calendar,
  User,
  Users,
  UserPlus,
  Bus,
  ClipboardCheck,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  BedDouble,
  Clock,
  Car,
  MessageCircle,
  Pencil,
} from 'lucide-react';

/* ================================================================
   TYPES
   ================================================================ */

interface FamilyMember {
  id: string;
  fullName: string;
  dob: string;
  relationship: 'spouse' | 'son' | 'daughter' | 'sibling' | 'parent' | 'other';
  specialNeeds: string;
}

interface Guest {
  id: string;
  fullName: string;
  phone: string;
}

interface FormData {
  days: string[];
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  familyMembers: FamilyMember[];
  bringingGuests: boolean;
  guests: Guest[];
  needTransport: boolean;
  pickupLocation: string;
  transportSeats: string;
  dietaryRequirements: string;
  medicalConditions: string;
  additionalNotes: string;
}

type StepErrors = Record<string, string>;

/* ================================================================
   CONSTANTS
   ================================================================ */

const RETREAT_DAYS = [
  { id: 'thu-28', day: 'Thursday', date: '28 May', emoji: '🚗', note: 'Travel Day · Arrive by 4:30 PM' },
  { id: 'fri-29', day: 'Friday', date: '29 May', emoji: '🌿', note: '' },
  { id: 'sat-30', day: 'Saturday', date: '30 May', emoji: '☀️', note: '' },
  { id: 'sun-31', day: 'Sunday', date: '31 May', emoji: '🙏', note: '' },
];

const STEPS = [
  { id: 'welcome', title: 'Days', icon: Calendar },
  { id: 'details', title: 'Details', icon: User },
  { id: 'family', title: 'Family', icon: Users },
  { id: 'guests', title: 'Guests', icon: UserPlus },
  { id: 'logistics', title: 'Travel', icon: Bus },
  { id: 'review', title: 'Review', icon: ClipboardCheck },
];

const INITIAL_FORM_DATA: FormData = {
  days: ['thu-28', 'fri-29', 'sat-30', 'sun-31'],
  fullName: '',
  dob: '',
  email: '',
  phone: '',
  address: '',
  familyMembers: [],
  bringingGuests: false,
  guests: [],
  needTransport: false,
  pickupLocation: '',
  transportSeats: '1',
  dietaryRequirements: '',
  medicalConditions: '',
  additionalNotes: '',
};

const uid = () => Math.random().toString(36).slice(2, 9);

const INPUT =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base placeholder:text-gray-300';
const LABEL = 'block text-sm font-medium text-gray-700 mb-1';
const CARD = 'bg-white rounded-2xl border border-gray-100 shadow-sm p-5';

/* ================================================================
   CONFETTI
   ================================================================ */

function Confetti() {
  const colors = ['#ab815a', '#f16923', '#c9a882', '#8a6744', '#f4894f', '#d4bc9f'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, 1200],
            x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720 - 360],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   ERROR LABEL
   ================================================================ */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
      <AlertTriangle className="w-3 h-3 shrink-0" /> {message}
    </p>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<StepErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Countdown
  const [daysUntil, setDaysUntil] = useState(0);
  useEffect(() => {
    const retreat = new Date('2026-05-28T00:00:00');
    const diff = Math.ceil((retreat.getTime() - Date.now()) / 86_400_000);
    setDaysUntil(diff > 0 ? diff : 0);
  }, []);

  // Load saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem('svchurch-retreat-2026');
      if (saved) setFormData({ ...INITIAL_FORM_DATA, ...JSON.parse(saved) });
    } catch {}
  }, []);

  // Auto-save
  useEffect(() => {
    if (!submitted) {
      try {
        localStorage.setItem('svchurch-retreat-2026', JSON.stringify(formData));
      } catch {}
    }
  }, [formData, submitted]);

  // Scroll top on step change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  /* ---------- helpers ---------- */

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      const n = { ...p };
      delete n[key as string];
      return n;
    });
  };

  const toggleDay = (dayId: string) => {
    setFormData((p) => ({
      ...p,
      days: p.days.includes(dayId) ? p.days.filter((d) => d !== dayId) : [...p.days, dayId],
    }));
    setErrors((p) => {
      const n = { ...p };
      delete n.days;
      return n;
    });
  };

  const selectAllDays = () => {
    setFormData((p) => ({ ...p, days: RETREAT_DAYS.map((d) => d.id) }));
  };

  /* family */
  const addFamilyMember = () => {
    setFormData((p) => ({
      ...p,
      familyMembers: [
        ...p.familyMembers,
        { id: uid(), fullName: '', dob: '', relationship: 'spouse', specialNeeds: '' },
      ],
    }));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFormData((p) => ({
      ...p,
      familyMembers: p.familyMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  const removeFamilyMember = (id: string) => {
    setFormData((p) => ({ ...p, familyMembers: p.familyMembers.filter((m) => m.id !== id) }));
  };

  /* guests */
  const addGuest = () => {
    setFormData((p) => ({
      ...p,
      guests: [...p.guests, { id: uid(), fullName: '', phone: '' }],
    }));
  };

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setFormData((p) => ({
      ...p,
      guests: p.guests.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    }));
  };

  const removeGuest = (id: string) => {
    setFormData((p) => ({ ...p, guests: p.guests.filter((g) => g.id !== id) }));
  };

  /* ---------- validation ---------- */

  const validateStep = (s: number): boolean => {
    const e: StepErrors = {};
    switch (s) {
      case 0:
        if (formData.days.length === 0) e.days = 'Please select at least one day';
        break;
      case 1:
        if (!formData.fullName.trim()) e.fullName = 'Full name is required';
        if (!formData.dob) e.dob = 'Date of birth is required';
        if (!formData.phone.trim()) e.phone = 'Phone number is required';
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
        if (!formData.address.trim()) e.address = 'Address is required';
        break;
      case 2:
        formData.familyMembers.forEach((m, i) => {
          if (!m.fullName.trim()) e[`family_${i}_name`] = 'Name is required';
          if (!m.dob) e[`family_${i}_dob`] = 'Date of birth is required';
        });
        break;
      case 3:
        if (formData.bringingGuests) {
          formData.guests.forEach((g, i) => {
            if (!g.fullName.trim()) e[`guest_${i}_name`] = 'Name is required';
          });
        }
        break;
      case 4:
        if (formData.needTransport && !formData.pickupLocation.trim())
          e.pickupLocation = 'Please enter your pickup location';
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- navigation ---------- */

  const goNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const goToStep = (s: number) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };

  /* ---------- submit ---------- */

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/retreat-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Registration failed. Please try again.');
      }
      setSubmitted(true);
      setShowConfetti(true);
      localStorage.removeItem('svchurch-retreat-2026');
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- animation ---------- */

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
  };

  const totalPeople = 1 + formData.familyMembers.length + formData.guests.length;

  /* ================================================================
     RENDER — SUCCESS
     ================================================================ */

  if (submitted) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="min-h-screen bg-gradient-to-br from-cream via-warmGray to-cream flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="max-w-md w-full"
          >
            <div className={`${CARD} text-center`}>
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-10 h-10 text-primary" strokeWidth={3} />
              </motion.div>

              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                Registration Complete!
              </h1>
              <p className="text-gray-500 mb-6">
                Thank you, <span className="font-semibold text-gray-700">{formData.fullName}</span>!
                We&apos;re excited to have you at the Church Retreat.
              </p>

              {/* Summary */}
              <div className="bg-cream rounded-xl p-4 text-left space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total people</span>
                  <span className="font-semibold">{totalPeople}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days attending</span>
                  <span className="font-semibold">{formData.days.length} of 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transport needed</span>
                  <span className="font-semibold">{formData.needTransport ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Important reminder */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-sm mb-6">
                <p className="font-semibold text-amber-800 mb-1">Remember to bring:</p>
                <p className="text-amber-700">
                  Your own duvets, bedsheets &amp; pillows. We travel on Thursday 28th May — aim to
                  arrive by 4:30 PM.
                </p>
              </div>

              {/* Contact Simon */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Questions? Get in touch with <span className="font-semibold">Simon Varghese</span>
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/447378143331?text=Hi%20Simon%2C%20I%27ve%20registered%20for%20the%20Spring%20Valley%20Church%20Retreat%202026!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20bd5a] active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+447378143331"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                </div>
              </div>
            </div>

            {/* Spring Valley Church footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              Spring Valley Church · The Valley of New Birth
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  /* ================================================================
     RENDER — FORM
     ================================================================ */

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-br from-cream via-warmGray to-cream">
      {/* -------- HERO HEADER -------- */}
      <div className="relative overflow-hidden bg-dark text-white">
        {/* Warm accent glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="relative max-w-lg mx-auto px-5 pt-5 pb-5 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Logo — compact */}
            <Image
              src="/images/retreat-logo-white.png"
              alt="Spring Valley Church"
              width={100}
              height={100}
              className="mx-auto mb-2"
              priority
            />

            {/* Title — bold and visible */}
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1.5 leading-tight">
              Church Retreat <span className="text-accent">2026</span>
            </h1>

            {/* Date & location in one compact line */}
            <p className="text-white/80 text-sm sm:text-base">
              Thu 28 – Sun 31 May
              <span className="mx-2 text-primary">|</span>
              <MapPin className="w-3 h-3 inline -mt-0.5" /> Colchester CO7 6FJ
            </p>

            {daysUntil > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 bg-accent/20 border border-accent/30 rounded-full text-accent text-xs font-medium"
              >
                <Sparkles className="w-3 h-3" />
                {daysUntil} days to go!
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* -------- PROGRESS BAR -------- */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2.5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => i < step && goToStep(i)}
                  disabled={i > step}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      i < step
                        ? 'bg-primary text-white'
                        : i === step
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      i <= step ? 'text-[#8a6744]' : 'text-gray-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      {/* -------- FORM CONTENT -------- */}
      <div className="max-w-lg mx-auto px-4 py-4 pb-32">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 0 && <StepDays />}
            {step === 1 && <StepDetails />}
            {step === 2 && <StepFamily />}
            {step === 3 && <StepGuests />}
            {step === 4 && <StepLogistics />}
            {step === 5 && <StepReview />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* -------- BOTTOM NAV -------- */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              step === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-xs text-gray-400 tabular-nums">
            {step + 1} / {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-1 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-[#8a6744] active:scale-95 transition-all shadow-md shadow-primary/20"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-[#8a6744] active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          )}
        </div>

        {submitError && (
          <div className="max-w-lg mx-auto px-4 pb-3">
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              {submitError}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  /* ================================================================
     STEP 0 — DAYS
     ================================================================ */

  function StepDays() {
    const allSelected = formData.days.length === 4;
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">When are you joining us?</h2>
          <p className="text-sm text-gray-500 mt-1">
            We encourage everyone to attend all four days for the full retreat experience.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {RETREAT_DAYS.map((d) => {
            const selected = formData.days.includes(d.id);
            return (
              <motion.button
                key={d.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleDay(d.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-primary bg-cream shadow-sm shadow-primary/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <span className="text-2xl">{d.emoji}</span>
                <p className="font-semibold text-gray-900 mt-1">{d.day}</p>
                <p className="text-sm text-gray-500">{d.date}</p>
                {d.note && <p className="text-xs text-amber-600 mt-1 font-medium">{d.note}</p>}
              </motion.button>
            );
          })}
        </div>

        <FieldError message={errors.days} />

        {!allSelected && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={selectAllDays}
            className="w-full py-2.5 text-sm text-primary font-medium rounded-xl border border-primary/20 bg-cream/50 hover:bg-cream transition-all"
          >
            Select all four days (recommended)
          </motion.button>
        )}

        {!allSelected && formData.days.length > 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            You&apos;ll get the most out of the retreat by attending all days. But we understand if you
            can only make it for some!
          </p>
        )}
      </div>
    );
  }

  /* ================================================================
     STEP 1 — DETAILS
     ================================================================ */

  function StepDetails() {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">Tell us about yourself</h2>
          <p className="text-sm text-gray-500 mt-1">
            We need a few details to get you registered.
          </p>
        </div>

        <div className={`${CARD} space-y-4`}>
          {/* Full Name */}
          <div>
            <label className={LABEL}>
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={INPUT}
              placeholder="e.g. John Abraham"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
            <FieldError message={errors.fullName} />
          </div>

          {/* DOB */}
          <div>
            <label className={LABEL}>
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              className={INPUT}
              value={formData.dob}
              min="1920-01-01"
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => updateField('dob', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Click the calendar icon to pick your date</p>
            <FieldError message={errors.dob} />
          </div>

          {/* Email */}
          <div>
            <label className={LABEL}>
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className={INPUT}
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <FieldError message={errors.email} />
          </div>

          {/* Phone */}
          <div>
            <label className={LABEL}>
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              className={INPUT}
              placeholder="+44 7123 456789"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <FieldError message={errors.phone} />
          </div>

          {/* Address */}
          <div>
            <label className={LABEL}>
              Full Address <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              className={`${INPUT} resize-none`}
              placeholder="House number, street, city, postcode"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
            />
            <FieldError message={errors.address} />
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================
     STEP 2 — FAMILY
     ================================================================ */

  function StepFamily() {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">Family members</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add any family members (including children) who&apos;ll be joining you.
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {formData.familyMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`${CARD} space-y-3 relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#8a6744]">
                    Member {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(member.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    aria-label="Remove family member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className={LABEL}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={INPUT}
                    placeholder="Full name"
                    value={member.fullName}
                    onChange={(e) => updateFamilyMember(member.id, 'fullName', e.target.value)}
                  />
                  <FieldError message={errors[`family_${i}_name`]} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>
                      Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      className={INPUT}
                      value={member.dob}
                      min="1920-01-01"
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => updateFamilyMember(member.id, 'dob', e.target.value)}
                    />
                    <FieldError message={errors[`family_${i}_dob`]} />
                  </div>
                  <div>
                    <label className={LABEL}>Relationship</label>
                    <select
                      className={INPUT}
                      value={member.relationship}
                      onChange={(e) =>
                        updateFamilyMember(member.id, 'relationship', e.target.value)
                      }
                    >
                      <option value="spouse">Spouse</option>
                      <option value="son">Son</option>
                      <option value="daughter">Daughter</option>
                      <option value="sibling">Sibling</option>
                      <option value="parent">Parent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Special Needs / Allergies</label>
                  <input
                    type="text"
                    className={INPUT}
                    placeholder="Optional"
                    value={member.specialNeeds}
                    onChange={(e) => updateFamilyMember(member.id, 'specialNeeds', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={addFamilyMember}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary text-sm font-medium hover:bg-cream hover:border-primary transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Family Member
        </motion.button>

        {formData.familyMembers.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">
            No family members added yet — that&apos;s fine! You can continue.
          </p>
        )}
      </div>
    );
  }

  /* ================================================================
     STEP 3 — GUESTS
     ================================================================ */

  function StepGuests() {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">Bringing any guests?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Friends, neighbours — everyone is welcome!
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-3">
          {[
            { val: true, label: 'Yes, I am' },
            { val: false, label: 'No guests' },
          ].map((opt) => (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => {
                updateField('bringingGuests', opt.val);
                if (opt.val && formData.guests.length === 0) addGuest();
              }}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                formData.bringingGuests === opt.val
                  ? 'border-primary bg-cream text-[#8a6744]'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {formData.bringingGuests && (
          <AnimatePresence mode="popLayout">
            {formData.guests.map((guest, i) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`${CARD} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#8a6744]">Guest {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeGuest(guest.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      aria-label="Remove guest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className={LABEL}>
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={INPUT}
                      placeholder="Guest's full name"
                      value={guest.fullName}
                      onChange={(e) => updateGuest(guest.id, 'fullName', e.target.value)}
                    />
                    <FieldError message={errors[`guest_${i}_name`]} />
                  </div>

                  <div>
                    <label className={LABEL}>Phone Number</label>
                    <input
                      type="tel"
                      className={INPUT}
                      placeholder="+44 7123 456789"
                      value={guest.phone}
                      onChange={(e) => updateGuest(guest.id, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.button
              key="add-guest-btn"
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={addGuest}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary text-sm font-medium hover:bg-cream hover:border-primary transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Another Guest
            </motion.button>
          </AnimatePresence>
        )}
      </div>
    );
  }

  /* ================================================================
     STEP 4 — LOGISTICS
     ================================================================ */

  function StepLogistics() {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">Travel &amp; Logistics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Help us plan the journey and make your stay comfortable.
          </p>
        </div>

        {/* Transport */}
        <div className={CARD}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Do you need transportation?</p>
              <p className="text-xs text-gray-400">We&apos;ll arrange shared travel from Luton</p>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            {[
              { val: true, label: 'Yes, please' },
              { val: false, label: 'No, I\'ll drive' },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => updateField('needTransport', opt.val)}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.needTransport === opt.val
                    ? 'border-primary bg-cream text-[#8a6744]'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {formData.needTransport && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div>
                <label className={LABEL}>
                  Pickup Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={INPUT}
                  placeholder="Where should we pick you up?"
                  value={formData.pickupLocation}
                  onChange={(e) => updateField('pickupLocation', e.target.value)}
                />
                <FieldError message={errors.pickupLocation} />
              </div>
              <div>
                <label className={LABEL}>Total seats needed</label>
                <select
                  className={INPUT}
                  value={formData.transportSeats}
                  onChange={(e) => updateField('transportSeats', e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={String(n)}>
                      {n} {n === 1 ? 'seat' : 'seats'}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Dietary & Medical */}
        <div className={`${CARD} space-y-4`}>
          <div>
            <label className={LABEL}>Dietary Requirements</label>
            <input
              type="text"
              className={INPUT}
              placeholder="e.g. Vegetarian, Vegan, Gluten-free"
              value={formData.dietaryRequirements}
              onChange={(e) => updateField('dietaryRequirements', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Medical Conditions / Allergies</label>
            <input
              type="text"
              className={INPUT}
              placeholder="Anything we should know about?"
              value={formData.medicalConditions}
              onChange={(e) => updateField('medicalConditions', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Additional Notes</label>
            <textarea
              rows={2}
              className={`${INPUT} resize-none`}
              placeholder="Any other requests or information…"
              value={formData.additionalNotes}
              onChange={(e) => updateField('additionalNotes', e.target.value)}
            />
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-amber-900 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Important Information
          </h3>
          <div className="space-y-2.5 text-sm text-amber-800">
            <div className="flex items-start gap-2.5">
              <BedDouble className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <p>
                <span className="font-medium">Bring your own bedding</span> — duvets, bedsheets,
                and pillows are not provided.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Car className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <p>
                We will be <span className="font-medium">travelling on Thursday 28th May</span> to
                reach the venue in time.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <p>
                Aim to <span className="font-medium">arrive by 4:30 PM</span> so we can set up our
                rooms before the evening.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium">
                  Vauxhall Christian Trust — Great Wenham, Colchester CO7 6FJ
                </p>
                <div className="mt-2 flex gap-2">
                  <a
                    href="https://share.google/JZ6h5uUIFby5jSG1N"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline underline-offset-2"
                  >
                    <MapPin className="w-3 h-3" /> Open in Maps
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowMap((p) => !p)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline underline-offset-2"
                  >
                    <ExternalLink className="w-3 h-3" /> {showMap ? 'Hide Map' : 'View Map'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden rounded-xl mt-2"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d78557.13974864171!2d1.017298!3d52.026726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d9a77758a0f1cb%3A0x5423aa04b99dbdb5!2sGreat%20Wenham%2C%20Colchester%20CO7%206QQ!5e0!3m2!1sen!2suk!4v1773582785353!5m2!1sen!2suk"
                className="w-full h-52 rounded-xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Retreat venue location"
              />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  /* ================================================================
     STEP 5 — REVIEW
     ================================================================ */

  function StepReview() {
    const dayLabel = (id: string) => RETREAT_DAYS.find((d) => d.id === id);

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-heading font-bold text-gray-900">Review your registration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please check everything looks correct before submitting.
          </p>
        </div>

        {/* Days */}
        <ReviewSection title="Days Attending" icon={Calendar} onEdit={() => goToStep(0)}>
          <div className="flex flex-wrap gap-2">
            {formData.days.map((d) => {
              const info = dayLabel(d);
              return (
                <span
                  key={d}
                  className="px-3 py-1 bg-cream text-[#8a6744] rounded-full text-sm font-medium"
                >
                  {info?.day} {info?.date}
                </span>
              );
            })}
          </div>
          {formData.days.length < 4 && (
            <p className="text-xs text-amber-600 mt-2">
              Attending {formData.days.length} of 4 days
            </p>
          )}
        </ReviewSection>

        {/* Your Details */}
        <ReviewSection title="Your Details" icon={User} onEdit={() => goToStep(1)}>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <span className="text-gray-400">Name</span>
            <span className="font-medium">{formData.fullName}</span>
            <span className="text-gray-400">DOB</span>
            <span>{formData.dob}</span>
            <span className="text-gray-400">Email</span>
            <span>{formData.email}</span>
            <span className="text-gray-400">Phone</span>
            <span>{formData.phone}</span>
            <span className="text-gray-400">Address</span>
            <span className="whitespace-pre-line">{formData.address}</span>
          </div>
        </ReviewSection>

        {/* Family */}
        <ReviewSection
          title={`Family Members (${formData.familyMembers.length})`}
          icon={Users}
          onEdit={() => goToStep(2)}
        >
          {formData.familyMembers.length === 0 ? (
            <p className="text-sm text-gray-400">No family members</p>
          ) : (
            <div className="space-y-2">
              {formData.familyMembers.map((m) => (
                <div key={m.id} className="text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                    {m.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium">{m.fullName}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 capitalize">{m.relationship}</span>
                  {m.dob && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{m.dob}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ReviewSection>

        {/* Guests */}
        <ReviewSection
          title={`Guests (${formData.guests.length})`}
          icon={UserPlus}
          onEdit={() => goToStep(3)}
        >
          {!formData.bringingGuests || formData.guests.length === 0 ? (
            <p className="text-sm text-gray-400">No guests</p>
          ) : (
            <div className="space-y-2">
              {formData.guests.map((g) => (
                <div key={g.id} className="text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                    {g.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium">{g.fullName}</span>
                  {g.phone && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{g.phone}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ReviewSection>

        {/* Logistics */}
        <ReviewSection title="Travel & Logistics" icon={Bus} onEdit={() => goToStep(4)}>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <span className="text-gray-400">Transport</span>
            <span className="font-medium">{formData.needTransport ? 'Yes' : 'No'}</span>
            {formData.needTransport && (
              <>
                <span className="text-gray-400">Pickup</span>
                <span>{formData.pickupLocation}</span>
                <span className="text-gray-400">Seats</span>
                <span>{formData.transportSeats}</span>
              </>
            )}
            {formData.dietaryRequirements && (
              <>
                <span className="text-gray-400">Dietary</span>
                <span>{formData.dietaryRequirements}</span>
              </>
            )}
            {formData.medicalConditions && (
              <>
                <span className="text-gray-400">Medical</span>
                <span>{formData.medicalConditions}</span>
              </>
            )}
            {formData.additionalNotes && (
              <>
                <span className="text-gray-400">Notes</span>
                <span>{formData.additionalNotes}</span>
              </>
            )}
          </div>
        </ReviewSection>

        {/* Total */}
        <div className="bg-cream border border-primary/20 rounded-2xl p-4 text-center">
          <p className="text-sm text-primary mb-1">Total people attending</p>
          <p className="text-3xl font-heading font-bold text-dark">{totalPeople}</p>
          <p className="text-xs text-primary mt-1">
            (You{formData.familyMembers.length > 0 ? ` + ${formData.familyMembers.length} family` : ''}
            {formData.guests.length > 0 ? ` + ${formData.guests.length} guest${formData.guests.length > 1 ? 's' : ''}` : ''})
          </p>
        </div>

        {/* Contact */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Questions? Contact{' '}
            <span className="font-semibold text-gray-700">Simon Varghese</span>
          </p>
          <a
            href="tel:+447378143331"
            className="text-primary font-medium hover:underline"
          >
            +44 7378 143331
          </a>
        </div>
      </div>
    );
  }
}

/* ================================================================
   REVIEW SECTION HELPER
   ================================================================ */

function ReviewSection({
  title,
  icon: Icon,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`${CARD}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-primary font-medium hover:text-[#8a6744] transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

'use client'

// ─── React ────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── MUI ─────────────────────────────────────────────────────────────────────
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthModal = 'patient' | 'staff' | null

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  blue:      '#1a6fb3',
  blueDark:  '#145a96',
  blueDeep:  '#0d3d6e',
  blueLight: '#e8f3fc',
  dark:      '#0d2b45',
  mid:       '#555',
  lite:      '#888',
  bgGrey:    '#f5f7fa',
  border:    '#e2eaf3',
  white:     '#fff',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',     href: '#home'       },
  { label: 'About',    href: '#about'      },
  { label: 'Services', href: '#services'   },
  { label: 'Doctors',  href: '#specialists'},
  { label: 'Blog',     href: '#blog'       },
  { label: 'Contact',  href: '#contact'    },
]

const FEATURES = [
  { icon: 'tabler-shield-check', title: 'Quality & Safety',     desc: 'New Senara utilises state of the art technology and employs a team of true medical experts.' },
  { icon: 'tabler-cpu',          title: 'Leading Technology',    desc: 'Advanced diagnostic equipment and digital health records for accurate, fast results.' },
  { icon: 'tabler-stethoscope',  title: 'Experts by Experience', desc: 'Over 15 years serving Ratnapura with trusted specialist consultants across all disciplines.' },
]

const SERVICES = [
  { emoji: '❤️',  title: 'Consultant Channeling', desc: 'Book appointments with leading medical specialists. Fast, easy, and reliable channeling for all your needs.' },
  { emoji: '🔬',  title: 'Medical Laboratory',    desc: 'State-of-the-art diagnostic lab with accurate, fast results — affiliated with Ratnapura Laboratory Medical Labs.' },
  { emoji: '📡',  title: 'Ultra-Sound Scans',     desc: 'Advanced ultrasound imaging for obstetrics, abdominal, and soft tissue examinations by experienced radiologists.' },
  { emoji: '🏃',  title: 'Physiotherapy',         desc: 'Comprehensive physiotherapy for rehabilitation, chronic pain, post-surgery recovery, and sports injuries.' },
  { emoji: '🗣️', title: 'Speech Therapy',        desc: 'Professional speech and language therapy for children and adults addressing communication disorders.' },
  { emoji: '💊',  title: 'Pharmacy',              desc: 'Well-stocked in-house pharmacy with genuine medications available immediately after your consultation.' },
]

const DOCTORS = [
  { name: 'Dr. Kumara Perera',   spec: 'Cardiologist', bg: '#dbeafe', emoji: '👨‍⚕️' },
  { name: 'Dr. Nimali Silva',    spec: 'Gynecologist', bg: '#fce7f3', emoji: '👩‍⚕️' },
  { name: 'Dr. Roshan Fernando', spec: 'Physician',    bg: '#d1fae5', emoji: '👨‍⚕️' },
  { name: 'Dr. Priya Mendis',    spec: 'Pediatrician', bg: '#fef3c7', emoji: '👩‍⚕️' },
]

const STATS = [
  { icon: '🏅', label: 'Years of Experience', num: 25,   suffix: '+' },
  { icon: '🩺', label: 'Medical Specialists', num: 470,  suffix: '+' },
  { icon: '🏥', label: 'Appointments Made',   num: 689,  suffix: '+' },
  { icon: '😊', label: 'Happy Patients',      num: 9036, suffix: '+' },
]

const TESTIMONIALS = [
  { quote: 'New Senara Channel Center is the best in Ratnapura. I booked online, waited barely 10 minutes, and the doctor was thorough and professional. Highly recommend.',  name: 'Sanduni Rathnayake', role: 'Teacher, Ratnapura',  emoji: '😊' },
  { quote: 'The lab results came back the same day and I could check them from my phone. Incredible service. The pharmacy staff were also very helpful with my prescription.', name: 'Chaminda Wickrama',  role: 'Business Owner',     emoji: '👤' },
  { quote: 'The physiotherapy team helped me recover from knee surgery in record time. Professional, caring, and very knowledgeable. Thank you New Senara!',                   name: 'Malini Jayawardena', role: 'Retired, Ratnapura', emoji: '👤' },
]

const PRICING = [
  { price: 'LKR 1,500', per: 'Per Visit',   title: 'General Channeling',    feats: ['GP Consultation', 'Basic Health Assessment', 'Prescription Service', 'Follow-up Advice'],                   featured: false },
  { price: 'LKR 2,500', per: 'Per Visit',   title: 'Specialist Channeling', feats: ['Specialist Consultation', 'Detailed Examination', 'Diagnostic Review', 'Treatment Planning'],               featured: true  },
  { price: 'LKR 3,500', per: 'Per Session', title: 'Physiotherapy',         feats: ['Initial Assessment', 'Personalised Treatment', 'Exercise Guidance', 'Progress Monitoring'],                 featured: false },
  { price: 'LKR 800',   per: 'Per Test',    title: 'Blood Test',            feats: ['Blood Test Service', 'Same-Day Results', 'Lab Report Issued', 'Doctor Review Available'],                   featured: false },
]

const BLOGS = [
  { emoji: '🩺', bg: '#dbeafe', date: 'Feb 10, 2026', author: 'Dr. K. Perera', title: 'What is the Success Rate of Early Specialist Intervention?',    desc: 'Early specialist consultations significantly improve patient outcomes. New research highlights the importance of timely medical care.' },
  { emoji: '🔬', bg: '#d1fae5', date: 'Jan 28, 2026', author: 'Dr. P. Mendis', title: "How to Handle Your Child's Mystery Ailments",                    desc: 'Understanding when to channel a pediatrician vs a GP can save time and ensure your child receives the right care faster.' },
  { emoji: '💊', bg: '#fce7f3', date: 'Jan 15, 2026', author: 'Dr. K. Perera', title: 'How to Help the Cardiology Department Do Its Best Work',         desc: 'Preparation before your cardiology appointment makes a major difference. Learn what to bring and what questions to ask.' },
]

const FAQS = [
  { q: 'Do I need an appointment to visit?',           a: 'Appointments are strongly recommended to minimise waiting time, but walk-ins are also welcome subject to availability.' },
  { q: 'How do I book an appointment online?',         a: "Register as a patient on our portal, choose your specialist, select an available slot and confirm. You'll receive an SMS confirmation instantly." },
  { q: 'Are lab results available online?',            a: 'Yes. Once registered, you can access your medical lab results and scan reports securely through the patient portal.' },
  { q: 'What are the operating hours?',                a: 'We are open Monday to Saturday 8:00 AM – 8:00 PM and Sunday 9:00 AM – 2:00 PM.' },
  { q: 'Is the pharmacy open without a consultation?', a: 'Yes. Our in-house pharmacy serves walk-in customers for prescription and over-the-counter medication needs.' },
]

const PARTNERS = [
  { emoji: '🏥', name: 'Ratnapura Labs'   },
  { emoji: '🦴', name: 'Orthatech Inc'   },
  { emoji: '🧬', name: 'Elisa'           },
  { emoji: '🏨', name: 'Medical Center'  },
  { emoji: '💻', name: 'Med Informatics' },
]

const STAFF_ROLES = ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist']

const DEPT_LINKS = ['Cardiology', 'Gynecology', 'Pediatrics', 'Physiotherapy', 'Dermatology', 'Speech Therapy']

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Single IntersectionObserver – fires `sr-visible` once per element */
function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll<HTMLElement>('[data-reveal]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('sr-visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [ref])
}

/** Animated number counter */
function useCounter(target: number, duration = 1800, started = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let cur = 0
    const step = Math.ceil(target / (duration / 16))
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [target, duration, started])
  return val
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Hex SVG tile background */
const HexBg = ({ opacity = 0.04 }: { opacity?: number }) => (
  <div
    aria-hidden
    className='absolute inset-0 pointer-events-none'
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='92' viewBox='0 0 80 92'%3E%3Cpolygon points='40,2 78,22 78,62 40,82 2,62 2,22' fill='none' stroke='%231a6fb3' stroke-width='1.2'/%3E%3C/svg%3E")`,
      backgroundSize: '80px 92px',
      opacity,
    }}
  />
)

/** ECG / heartbeat SVG line (animates on scroll-reveal) */
const HbDivider = ({ color = C.blue, align = 'center' }: { color?: string; align?: 'center' | 'left' }) => (
  <div className={`flex mbs-3 mbe-2 ${align === 'center' ? 'justify-center' : ''}`} aria-hidden>
    <svg width='80' height='22' viewBox='0 0 80 22' fill='none'>
      <line x1='0' y1='11' x2='22' y2='11' stroke={color} strokeWidth='1.5' />
      <polyline
        className='sr-hb-line'
        points='22,11 28,2 33,18 38,6 43,16 48,11'
        stroke={color} strokeWidth='2' fill='none' strokeLinejoin='round' strokeLinecap='round'
      />
      <line x1='48' y1='11' x2='80' y2='11' stroke={color} strokeWidth='1.5' />
    </svg>
  </div>
)

/** Section label — small uppercase coloured text */
const SecLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant='overline'
    display='block'
    sx={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.14em', color: C.blue, mb: 1.2 }}
  >
    {children}
  </Typography>
)

/** Animated stat card cell */
const StatCell = ({ s, idx, started }: { s: typeof STATS[0]; idx: number; started: boolean }) => {
  const n = useCounter(s.num, 1800, started)
  const display = started ? (s.num >= 1000 ? n.toLocaleString() : String(n)) + s.suffix : '0'
  return (
    <div
      className='flex flex-col items-center justify-center gap-2 p-6 text-center'
      style={{ borderRight: idx < STATS.length - 1 ? `1px solid ${C.border}` : 'none' }}
    >
      <div className='sr-stat-icon flex items-center justify-center rounded-full'
        style={{ width: 58, height: 58, background: C.blueLight, border: '1.5px dashed #93c5fd', fontSize: '1.55rem' }}
        aria-hidden
      >
        {s.icon}
      </div>
      <Typography variant='caption' color='text.secondary' className='font-semibold uppercase tracking-wide text-center'>
        {s.label}
      </Typography>
      <Typography variant='h4' className='font-extrabold' style={{ color: C.dark }}>
        {display}
      </Typography>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SenaraLandingBody() {

  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [authModal,   setAuthModal]   = useState<AuthModal>(null)
  const [patientTab,  setPatientTab]  = useState(0)
  const [staffRole,   setStaffRole]   = useState('Admin')
  const [expandedFaq, setExpandedFaq] = useState<string | false>('faq-0')
  const [testiIdx,    setTestiIdx]    = useState(0)
  const [testiFade,   setTestiFade]   = useState(false)
  const [statsGo,     setStatsGo]     = useState(false)

  const bodyRef  = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useScrollReveal(bodyRef)

  // Scroll → navbar shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Stats counter: start when card enters view
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsGo(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Testimonial fade swap
  const goTesti = useCallback((idx: number) => {
    setTestiFade(true)
    setTimeout(() => { setTestiIdx(idx); setTestiFade(false) }, 220)
  }, [])

  // ── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════════════════════════════════════
          GLOBAL CSS
      ══════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .sr-root, .sr-root * { font-family:'Poppins','Segoe UI',sans-serif !important; }

        /* ── Scroll reveal ── */
        [data-reveal]                 { opacity:0; transition:opacity .65s ease,transform .65s ease; }
        [data-reveal="up"]            { transform:translateY(26px); }
        [data-reveal="left"]          { transform:translateX(-30px); }
        [data-reveal="right"]         { transform:translateX(30px); }
        [data-reveal="scale"]         { transform:scale(.93); }
        [data-reveal].sr-visible      { opacity:1 !important; transform:none !important; }
        [data-d="1"]                  { transition-delay:.08s; }
        [data-d="2"]                  { transition-delay:.18s; }
        [data-d="3"]                  { transition-delay:.28s; }
        [data-d="4"]                  { transition-delay:.38s; }
        [data-d="5"]                  { transition-delay:.48s; }
        [data-d="6"]                  { transition-delay:.58s; }

        /* Heartbeat line draw */
        .sr-hb-line { stroke-dasharray:60; stroke-dashoffset:60; transition:stroke-dashoffset .9s ease .25s; }
        .sr-visible .sr-hb-line      { stroke-dashoffset:0; }

        /* ── Hero text entrance ── */
        @keyframes srIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .sr-hero-in > * { opacity:0; animation:srIn .68s ease forwards; }
        .sr-hero-in > *:nth-child(1) { animation-delay:.10s }
        .sr-hero-in > *:nth-child(2) { animation-delay:.22s }
        .sr-hero-in > *:nth-child(3) { animation-delay:.38s }
        .sr-hero-in > *:nth-child(4) { animation-delay:.52s }

        /* ── Floating animations ── */
        @keyframes srFloat    { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-12px)} }
        @keyframes srFloatAlt { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-7px)}  }
        .sr-float     { animation:srFloat    4.5s ease-in-out infinite; }
        .sr-float-alt { animation:srFloatAlt 3.6s ease-in-out infinite; }

        /* ── Stat icon gentle pulse ── */
        @keyframes srPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.10)} }
        .sr-stat-icon { animation:srPulse 2.4s ease-in-out infinite; }

        /* ── Play button ring ── */
        @keyframes srRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
        .sr-play-ring { position:relative !important; overflow:visible !important; }
        .sr-play-ring::after { content:''; position:absolute; inset:0; border-radius:50%;
          background:rgba(26,111,179,.30); animation:srRing 1.8s ease-out infinite; pointer-events:none; }

        /* ── Top bar ── */
        .sr-topbar  { background:${C.blueDeep}; font-size:.78rem; }
        .sr-toplink { color:rgba(255,255,255,.6); font-size:.8rem; text-decoration:none;
                      width:28px; height:28px; border-radius:50%; border:1px solid rgba(255,255,255,.18);
                      display:inline-flex; align-items:center; justify-content:center; transition:background .2s; }
        .sr-toplink:hover { background:${C.blue}; border-color:${C.blue}; color:#fff; }

        /* ── Nav links ── */
        .sr-navlink { font-size:.88rem; font-weight:600; color:${C.mid}; text-decoration:none;
                      position:relative; padding-bottom:3px; transition:color .2s; }
        .sr-navlink::after { content:''; position:absolute; bottom:-1px; left:0; width:0;
                             height:2px; background:${C.blue}; transition:width .25s; }
        .sr-navlink:hover, .sr-navlink.active { color:${C.blue}; }
        .sr-navlink:hover::after, .sr-navlink.active::after { width:100%; }

        /* ── Buttons ── */
        .sr-btn-primary { background:${C.blue}!important; color:#fff!important; border-radius:4px!important;
          font-weight:700!important; text-transform:none!important;
          transition:background .2s,box-shadow .2s,transform .18s !important; }
        .sr-btn-primary:hover { background:${C.blueDark}!important;
          box-shadow:0 6px 20px rgba(26,111,179,.32)!important; transform:translateY(-2px)!important; }

        .sr-btn-outline { border:2px solid ${C.blue}!important; color:${C.blue}!important;
          border-radius:4px!important; font-weight:700!important; text-transform:none!important;
          transition:background .2s,color .2s,transform .18s !important; }
        .sr-btn-outline:hover { background:${C.blue}!important; color:#fff!important; transform:translateY(-2px)!important; }

        .sr-btn-dark { background:${C.blueDeep}!important; color:#fff!important;
          border-radius:4px!important; font-weight:700!important; text-transform:none!important;
          transition:background .2s,transform .18s !important; }
        .sr-btn-dark:hover { background:#061929!important; transform:translateY(-2px)!important; }

        /* ── Feature cards hover ── */
        .sr-feat-card { transition:transform .25s,box-shadow .25s !important; }
        .sr-feat-card:hover { transform:translateY(-6px)!important; box-shadow:0 16px 40px rgba(26,111,179,.13)!important; }

        /* ── About mosaic panels ── */
        .sr-mosaic { transition:transform .3s,box-shadow .3s !important; }
        .sr-mosaic:hover { transform:translateY(-6px) scale(1.02)!important; box-shadow:0 16px 40px rgba(26,111,179,.2)!important; }

        /* ── Services ── */
        .sr-svc-wrap { transition:transform .25s,background .25s; border-radius:14px; cursor:default; }
        .sr-svc-wrap:hover { transform:translateY(-6px); background:rgba(26,111,179,.04); }
        .sr-svc-circle { width:78px; height:78px; border-radius:50%; border:1.5px solid ${C.border};
          background:#fff; display:flex; align-items:center; justify-content:center; font-size:1.85rem;
          margin:0 auto 18px; box-shadow:0 2px 12px rgba(0,0,0,.06);
          transition:background .28s,border-color .28s,transform .28s; }
        .sr-svc-wrap:hover .sr-svc-circle { background:${C.blue}; border-color:${C.blue}; transform:scale(1.1) rotate(-4deg); }

        /* ── Doctor cards ── */
        .sr-doc-card { transition:transform .28s,box-shadow .28s !important; }
        .sr-doc-card:hover { transform:translateY(-7px)!important; box-shadow:0 16px 48px rgba(26,111,179,.18)!important; }
        .sr-doc-photo-wrap { overflow:hidden; }
        .sr-doc-photo-wrap > div { transition:transform .35s; }
        .sr-doc-card:hover .sr-doc-photo-wrap > div { transform:scale(1.06); }
        .sr-social { transition:background .2s,transform .2s !important; }
        .sr-social:hover { background:${C.blue}!important; color:#fff!important; transform:scale(1.18)!important; }

        /* ── Pricing cards ── */
        .sr-price-card { transition:transform .25s,box-shadow .25s,border-color .25s !important; }
        .sr-price-card:hover { transform:translateY(-6px)!important; box-shadow:0 16px 48px rgba(26,111,179,.14)!important; border-color:${C.blue}!important; }

        /* ── Blog cards ── */
        .sr-blog-card { transition:transform .25s,box-shadow .25s !important; }
        .sr-blog-card:hover { transform:translateY(-5px)!important; box-shadow:0 14px 40px rgba(26,111,179,.14)!important; }

        /* ── FAQ ── */
        .sr-faq .MuiAccordion-root          { border-radius:8px!important; border:1.5px solid ${C.border}!important;
                                              margin-bottom:10px!important; box-shadow:none!important;
                                              transition:border-color .2s!important; }
        .sr-faq .MuiAccordion-root.Mui-expanded { border-color:${C.blue}!important; }
        .sr-faq .MuiAccordion-root::before  { display:none!important; }

        /* ── Testimonial fade ── */
        .sr-testi-content { transition:opacity .22s ease,transform .22s ease; }
        .sr-testi-content.fading { opacity:0; transform:translateY(8px); }

        /* ── Partner logo ── */
        .sr-partner { opacity:.45; transition:opacity .2s; cursor:pointer; }
        .sr-partner:hover { opacity:1; }

        /* ── Footer link ── */
        .sr-flink { color:rgba(255,255,255,.58)!important; font-size:.83rem;
                    text-decoration:none; transition:color .2s,padding-left .2s; display:flex; align-items:center; gap:6px; }
        .sr-flink:hover { color:${C.blue}!important; padding-left:4px!important; }
        .sr-flink::before { content:'+'; color:${C.blue}; font-weight:800; }
      `}</style>

      <div className='sr-root' ref={bodyRef}>

        {/* ══════════════════════════════════════════════
            TOP BAR
        ══════════════════════════════════════════════ */}
        <div className='sr-topbar flex items-center justify-between px-6 py-2 flex-wrap gap-2'>
          <div className='flex items-center gap-5 flex-wrap'>
            <span className='flex items-center gap-2' style={{ color: 'rgba(255,255,255,.68)', fontSize: '.78rem' }}>
              <i className='tabler-map-pin' style={{ color: C.blue }} />
              No. 12 Main Street, Ratnapura, Sri Lanka
            </span>
            <span className='flex items-center gap-2' style={{ color: 'rgba(255,255,255,.68)', fontSize: '.78rem' }}>
              <i className='tabler-clock' style={{ color: C.blue }} />
              Mon–Sat 8:00–20:00 &nbsp;|&nbsp; Sun 9:00–14:00
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {['tabler-brand-facebook', 'tabler-brand-twitter', 'tabler-brand-instagram', 'tabler-brand-linkedin'].map((ic, i) => (
              <a key={i} href='#' className='sr-toplink'><i className={`${ic} text-xs`} /></a>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════════ */}
        <AppBar
          position='sticky'
          elevation={scrolled ? 4 : 1}
          sx={{ background: C.white, borderBottom: `1px solid ${C.border}`, transition: 'box-shadow .3s' }}
        >
          <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: '5% !important', minHeight: '70px !important', gap: 2 }}>
            {/* Logo */}
            <a href='#home' style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-hospital-circle text-lg' style={{ color: '#fff' }} />
              </div>
              <Typography variant='h6' sx={{ fontWeight: 800, color: C.dark }}>
                New <span style={{ color: C.blue }}>Senara</span>
              </Typography>
            </a>

            <div style={{ flex: 1 }} />

            {/* Desktop nav */}
            <nav className='hidden lg:flex items-center gap-7'>
              {NAV_LINKS.map((l, i) => (
                <a key={i} href={l.href} className={`sr-navlink ${i === 0 ? 'active' : ''}`}>{l.label}</a>
              ))}
            </nav>

            <div style={{ flex: 1 }} />

            {/* CTA buttons */}
            <div className='hidden sm:flex items-center gap-2'>
              <Button size='small' variant='outlined' className='sr-btn-outline'
                sx={{ fontSize: '.8rem', py: .8, px: 2 }}
                onClick={() => setAuthModal('staff')}
              >
                Staff Login
              </Button>
              <Button size='small' variant='contained' className='sr-btn-primary'
                sx={{ fontSize: '.8rem', py: .8, px: 2 }}
                onClick={() => setAuthModal('patient')}
                startIcon={<i className='tabler-calendar-check text-sm' />}
              >
                Appointment
              </Button>
            </div>

            {/* Hamburger */}
            <IconButton className='lg:hidden' onClick={() => setMobileOpen(true)} sx={{ color: C.dark }}>
              <i className='tabler-menu-2' />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer anchor='right' open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <div style={{ width: 270 }}>
            <div className='flex items-center justify-between p-4' style={{ borderBottom: `1px solid ${C.border}` }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 800, color: C.dark }}>Menu</Typography>
              <IconButton onClick={() => setMobileOpen(false)}><i className='tabler-x' /></IconButton>
            </div>
            <List>
              {NAV_LINKS.map((l, i) => (
                <ListItemButton key={i} component='a' href={l.href} onClick={() => setMobileOpen(false)}>
                  <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              ))}
            </List>
            <div className='flex flex-col gap-3 p-4' style={{ borderTop: `1px solid ${C.border}` }}>
              <Button fullWidth variant='outlined' className='sr-btn-outline' onClick={() => { setAuthModal('staff'); setMobileOpen(false) }}>Staff Login</Button>
              <Button fullWidth variant='contained' className='sr-btn-primary' onClick={() => { setAuthModal('patient'); setMobileOpen(false) }}>Book Appointment</Button>
            </div>
          </div>
        </Drawer>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section
          id='home'
          className='relative overflow-hidden'
          style={{ background: 'linear-gradient(115deg,#eef5fc 0%,#e0effa 45%,#f4f9ff 100%)', minHeight: '88vh', display: 'flex', alignItems: 'center' }}
        >
          <HexBg opacity={0.045} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 5%', width: '100%' }}>
            <Grid container spacing={6} alignItems='center'>

              {/* Left – text */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <div className='sr-hero-in flex flex-col gap-5'>
                  <SecLabel>Welcome to New Senara Channel Center</SecLabel>
                  <Typography variant='h2' sx={{ fontWeight: 800, color: C.dark, lineHeight: 1.18, fontSize: 'clamp(2.1rem,5vw,3.1rem)' }}>
                    We Take Care of<br />
                    <span style={{ color: C.blue }}>Our Patients'</span> Health
                  </Typography>
                  <Typography variant='body1' color='text.secondary' sx={{ lineHeight: 1.8, maxWidth: 460 }}>
                    Specialist channeling, ultrasound scans, physiotherapy, speech therapy, laboratory services, and pharmacy — all under one roof in Ratnapura.
                  </Typography>
                  <div className='flex gap-3 flex-wrap'>
                    <Button variant='contained' size='large' className='sr-btn-primary'
                      startIcon={<i className='tabler-calendar-check' />}
                      onClick={() => setAuthModal('patient')}
                    >
                      Book Appointment
                    </Button>
                    <Button variant='outlined' size='large' className='sr-btn-outline'
                      component='a' href='#services'
                      startIcon={<i className='tabler-stethoscope' />}
                    >
                      Our Services
                    </Button>
                  </div>
                </div>
              </Grid>

              {/* Right – doctor visual + badge */}
              <Grid size={{ xs: 12, lg: 6 }} className='hidden lg:flex justify-center'>
                <div className='sr-float relative' style={{ width: '100%', maxWidth: 500 }}>
                  {/* Photo area */}
                  <div style={{
                    width: '100%', aspectRatio: '4/3.2', borderRadius: 12,
                    background: 'linear-gradient(135deg,#c8dff5,#e8f3fc)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9rem', overflow: 'hidden',
                  }}>
                    👨‍⚕️
                  </div>
                  {/* Floating badge */}
                  <div className='sr-float-alt absolute flex items-center gap-3 rounded-xl'
                    style={{ bottom: 24, left: -24, zIndex: 10, background: C.white, boxShadow: '0 8px 32px rgba(0,0,0,.12)', padding: '14px 18px' }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: C.blueLight, fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🏆</div>
                    <div>
                      <Typography variant='subtitle2' sx={{ fontWeight: 800, color: C.dark }}>15+ Years</Typography>
                      <Typography variant='caption' color='text.secondary'>Serving Ratnapura</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>

        {/* ═══ Feature Cards (overlap bottom of hero) ═══ */}
        <div style={{ background: C.white }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5%', transform: 'translateY(-44px)' }}>
            <Grid container spacing={3}>
              {FEATURES.map((f, i) => (
                <Grid key={i} size={{ xs: 12, md: 4 }}>
                  <div data-reveal='up' data-d={String(i + 1)}>
                    <Card className='sr-feat-card' elevation={3} sx={{ borderRadius: 2, border: `1px solid ${C.border}`, height: '100%' }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={`${f.icon} text-2xl`} style={{ color: C.blue }} />
                        </div>
                        <div>
                          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: C.dark, mb: .5 }}>{f.title}</Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.65 }}>{f.desc}</Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════════ */}
        <section id='about' style={{ background: C.white, padding: '60px 0 90px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
            <Grid container spacing={10} alignItems='center'>

              {/* Left – image mosaic */}
              <Grid size={{ xs: 12, lg: 5 }} className='hidden lg:block'>
                <div data-reveal='left' className='relative' style={{ height: 420 }}>
                  <div className='sr-mosaic absolute rounded-2xl flex items-center justify-center'
                    style={{ width: '58%', height: '62%', top: 0, left: 0, background: `linear-gradient(135deg,${C.blue},${C.blueDeep})`, fontSize: '5rem', boxShadow: '0 12px 40px rgba(26,111,179,.28)' }}
                  >🩺</div>
                  <div className='sr-mosaic absolute rounded-2xl flex items-center justify-center'
                    style={{ width: '44%', height: '48%', bottom: 24, left: '28%', background: C.blueLight, fontSize: '4rem', border: '2px solid #c0d8f0' }}
                  >🔬</div>
                  <div className='sr-mosaic absolute rounded-2xl flex items-center justify-center'
                    style={{ width: '38%', height: '44%', top: '22%', right: 0, background: '#f0faf5', fontSize: '3.5rem', border: '2px solid #b0e0c8' }}
                  >📡</div>
                  {/* Play button with ring pulse */}
                  <div className='sr-play-ring absolute flex items-center justify-center rounded-full cursor-pointer'
                    style={{ width: 54, height: 54, background: C.blue, boxShadow: '0 4px 18px rgba(26,111,179,.4)', top: '28%', left: '10%', zIndex: 10 }}
                  >
                    <i className='tabler-player-play' style={{ color: '#fff', fontSize: '1.1rem' }} />
                  </div>
                </div>
              </Grid>

              {/* Right – text */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <div data-reveal='right'>
                  <SecLabel>OUR MEDICAL</SecLabel>
                  <Typography variant='h3' sx={{ fontWeight: 800, color: C.dark, lineHeight: 1.22, fontSize: 'clamp(1.7rem,3.5vw,2.4rem)', mb: 1 }}>
                    We're Setting Standards in{' '}
                    <span style={{ color: C.blue }}>Research</span> &amp;{' '}
                    <span style={{ color: '#b0c4d8' }}>Clinical Care</span>
                  </Typography>
                  <HbDivider align='left' />
                  <Typography variant='body1' color='text.secondary' sx={{ lineHeight: 1.8, mt: 2, mb: 1.5 }}>
                    New Senara Channel Center provides the most comprehensive medical services in Sabaragamuwa Province, so every person could receive qualitative healthcare close to home.
                  </Typography>
                  <Typography variant='body1' color='text.secondary' sx={{ lineHeight: 1.8, mb: 4 }}>
                    Our center has grown to provide world-class facilities for specialist consultations, advanced diagnostics, rehabilitation, and laboratory services — with over 15 years of trusted service in Ratnapura.
                  </Typography>
                  {/* Signature + CTA row */}
                  <div className='flex items-center gap-5 flex-wrap'>
                    <Typography sx={{ fontSize: '1.7rem', fontStyle: 'italic', opacity: .5, color: C.dark, lineHeight: 1 }}>
                      Dr. S. Perera
                    </Typography>
                    <Button variant='contained' className='sr-btn-primary'
                      component='a' href='#services'
                      startIcon={<i className='tabler-arrow-right' />}
                    >
                      More About Us
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SERVICES
        ══════════════════════════════════════════════ */}
        <section id='services' className='relative overflow-hidden' style={{ background: C.bgGrey, padding: '90px 0' }}>
          <HexBg opacity={0.035} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
            <div data-reveal='up' className='text-center' style={{ marginBottom: 56 }}>
              <SecLabel>OUR SERVICES</SecLabel>
              <Typography variant='h3' sx={{ fontWeight: 800, color: '#d0dce8', fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                We Care for Our Patients.
              </Typography>
              <HbDivider />
            </div>
            <Grid container spacing={4}>
              {SERVICES.map((s, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <div data-reveal='up' data-d={String(i + 1)}>
                    <div className='sr-svc-wrap text-center p-8'>
                      <div className='sr-svc-circle'>{s.emoji}</div>
                      <Typography variant='h6' sx={{ fontWeight: 700, color: C.dark, mb: 1.5 }}>{s.title}</Typography>
                      <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.7 }}>{s.desc}</Typography>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            DOCTORS
        ══════════════════════════════════════════════ */}
        <section id='specialists' className='relative overflow-hidden' style={{ background: C.white, padding: '90px 0' }}>
          <HexBg opacity={0.025} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
            <div data-reveal='up' className='text-center' style={{ marginBottom: 56 }}>
              <SecLabel>OUR DOCTORS</SecLabel>
              <Typography variant='h3' sx={{ fontWeight: 800, color: C.dark, fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                Our Dedicated Doctors Team
              </Typography>
              <HbDivider />
            </div>
            <Grid container spacing={3}>
              {DOCTORS.map((doc, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <div data-reveal='scale' data-d={String(i + 1)}>
                    <Card className='sr-doc-card' elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <div className='sr-doc-photo-wrap'>
                        <div style={{ height: 220, background: doc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5.5rem' }}>
                          {doc.emoji}
                        </div>
                      </div>
                      <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 700, color: C.dark, mb: .5 }}>{doc.name}</Typography>
                        <Typography variant='body2' sx={{ color: C.blue, fontWeight: 600 }}>{doc.spec}</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <div className='flex justify-center gap-3'>
                          {['tabler-brand-facebook', 'tabler-brand-instagram', 'tabler-brand-twitter'].map((ic, j) => (
                            <a key={j} href='#' className='sr-social flex items-center justify-center rounded-full'
                              style={{ width: 30, height: 30, background: C.blueLight, color: C.blue, textDecoration: 'none' }}
                            >
                              <i className={`${ic} text-xs`} />
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
              ))}
            </Grid>
            <div data-reveal='up' className='text-center' style={{ marginTop: 36 }}>
              <Typography variant='body2' color='text.secondary'>
                Don't hesitate, contact us for better help and services —{' '}
                <span style={{ color: C.blue, fontWeight: 700, cursor: 'pointer' }} onClick={() => setAuthModal('patient')}>
                  View All Specialists →
                </span>
              </Typography>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            APPOINTMENT CTA  +  STATS
        ══════════════════════════════════════════════ */}
        <section
          className='relative overflow-hidden'
          style={{ background: `linear-gradient(120deg,${C.blue} 0%,${C.blueDark} 55%,${C.blueDeep} 100%)`, padding: '80px 0 0' }}
        >
          <HexBg opacity={0.06} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems='flex-end'>

              {/* Left – text */}
              <Grid size={{ xs: 12, md: 7 }}>
                <div data-reveal='left'>
                  <Typography variant='overline' display='block' sx={{ color: 'rgba(255,255,255,.65)', fontWeight: 700, letterSpacing: '.13em', mb: 1.5 }}>
                    NEED A DOCTOR FOR CHECK-UP?
                  </Typography>
                  <Typography variant='h2' sx={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(2rem,4.5vw,2.9rem)', lineHeight: 1.2, mb: 2 }}>
                    Just Make an Appointment<br />
                    and <em style={{ color: '#93c5fd', fontStyle: 'italic' }}>You're Done!</em>
                  </Typography>
                  <Typography variant='body1' sx={{ color: 'rgba(255,255,255,.7)', mb: .5 }}>
                    Get Your Quote or Call:
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 800, color: '#fff', mb: 4 }}>
                    +94 45 222 3456
                  </Typography>
                  <Button variant='contained' size='large' className='sr-btn-dark'
                    startIcon={<i className='tabler-calendar-plus' />}
                    onClick={() => setAuthModal('patient')}
                  >
                    Book an Appointment
                  </Button>
                </div>
              </Grid>

              {/* Right – doctor silhouette */}
              <Grid size={{ xs: 12, md: 5 }} className='flex justify-center items-end'>
                <div data-reveal='right'>
                  <div style={{
                    width: 260, height: 300, borderRadius: '200px 200px 0 0',
                    background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8.5rem',
                  }}>
                    👩‍⚕️
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Stats bar – white card overlapping */}
          <div ref={statsRef} style={{ maxWidth: 1000, margin: '0 auto', padding: '0 5%', transform: 'translateY(44px)', position: 'relative', zIndex: 2 }}>
            <Card elevation={6} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Grid container>
                  {STATS.map((s, i) => (
                    <Grid key={i} size={{ xs: 6, md: 3 }}>
                      <StatCell s={s} idx={i} started={statsGo} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════ */}
        <section className='relative overflow-hidden' style={{ background: C.white, padding: '130px 0 90px' }}>
          <HexBg opacity={0.025} />
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
            <div data-reveal='up' className='text-center' style={{ marginBottom: 48 }}>
              <SecLabel>HAPPY PATIENTS</SecLabel>
              <Typography variant='h3' sx={{ fontWeight: 800, color: '#d0dce8', fontSize: 'clamp(1.6rem,4vw,2.4rem)' }}>
                What Our Patients Say
              </Typography>
              <HbDivider />
            </div>

            <div data-reveal='up'>
              <Card elevation={0} sx={{ borderRadius: 3, border: `1.5px solid ${C.border}`, boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 3, p: 5 }}>

                  {/* Quote */}
                  <div className={`sr-testi-content ${testiFade ? 'fading' : ''}`}>
                    <Typography variant='h6' sx={{ fontWeight: 400, lineHeight: 1.78, color: '#4a5568', fontStyle: 'italic' }}>
                      "{TESTIMONIALS[testiIdx].quote}"
                    </Typography>
                  </div>

                  {/* Avatar selector */}
                  <div className='flex items-center gap-4'>
                    {TESTIMONIALS.map((t, i) => (
                      <div
                        key={i}
                        onClick={() => goTesti(i)}
                        title={t.name}
                        style={{
                          width: i === testiIdx ? 58 : 46, height: i === testiIdx ? 58 : 46,
                          borderRadius: '50%', background: C.blueLight,
                          border: i === testiIdx ? `3px solid ${C.blue}` : `2px solid ${C.border}`,
                          fontSize: i === testiIdx ? '1.6rem' : '1.2rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all .25s',
                        }}
                      >
                        {t.emoji}
                      </div>
                    ))}
                  </div>

                  {/* Name & role */}
                  <div className={`sr-testi-content ${testiFade ? 'fading' : ''}`}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 800, color: C.blue }}>{TESTIMONIALS[testiIdx].name}</Typography>
                    <Typography variant='caption' color='text.secondary'>{TESTIMONIALS[testiIdx].role}</Typography>
                  </div>
                </CardContent>
              </Card>

              {/* Prev / Next */}
              <div className='flex justify-center gap-4' style={{ marginTop: 24 }}>
                {[
                  { label: '‹', bg: C.white, color: C.blue, fn: () => goTesti((testiIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length) },
                  { label: '›', bg: C.blue,  color: C.white, fn: () => goTesti((testiIdx + 1) % TESTIMONIALS.length) },
                ].map((btn, i) => (
                  <button
                    key={i} onClick={btn.fn}
                    style={{ width: 42, height: 42, borderRadius: '50%', border: `1.5px solid ${C.blue}`, background: btn.bg, color: btn.color, cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .18s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════ */}
        <section className='relative overflow-hidden' style={{ background: C.bgGrey, padding: '90px 0' }}>
          <HexBg opacity={0.035} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
            <div data-reveal='up' className='text-center' style={{ marginBottom: 56 }}>
              <SecLabel>OUR PRICING</SecLabel>
              <Typography variant='h3' sx={{ fontWeight: 800, color: C.dark, fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
                Pricing Plans
              </Typography>
              <HbDivider />
            </div>
            <Grid container spacing={3}>
              {PRICING.map((plan, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <div data-reveal='up' data-d={String(i + 1)}>
                    <Card
                      className='sr-price-card'
                      elevation={plan.featured ? 6 : 1}
                      sx={{
                        borderRadius: 2, height: '100%',
                        border: `1.5px solid ${plan.featured ? C.blue : C.border}`,
                        boxShadow: plan.featured ? '0 8px 32px rgba(26,111,179,.2)' : undefined,
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                        {/* Price header */}
                        <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                          <Typography variant='h4' sx={{ fontWeight: 800, color: C.blue }}>{plan.price}</Typography>
                          <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{plan.per}</Typography>
                        </div>
                        <Typography variant='h6' sx={{ fontWeight: 800, color: C.dark, textAlign: 'center' }}>{plan.title}</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {plan.feats.map((f, fi) => (
                            <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <i className='tabler-check text-sm' style={{ color: C.blue, flexShrink: 0 }} />
                              <Typography variant='body2' color='text.secondary'>{f}</Typography>
                            </div>
                          ))}
                        </div>
                        <Button
                          fullWidth variant={plan.featured ? 'contained' : 'outlined'}
                          className={plan.featured ? 'sr-btn-primary' : 'sr-btn-outline'}
                          sx={{ borderRadius: '4px !important', mt: 'auto' }}
                          onClick={() => setAuthModal('patient')}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
              ))}
            </Grid>
            <div data-reveal='up' className='text-center' style={{ marginTop: 32 }}>
              <Typography variant='body2' color='text.secondary'>
                Don't hesitate, contact us for better help and services —{' '}
                <span style={{ color: C.blue, fontWeight: 700, cursor: 'pointer' }} onClick={() => setAuthModal('patient')}>
                  Explore All Services →
                </span>
              </Typography>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BLOG / NEWS
        ══════════════════════════════════════════════ */}
        <section id='blog' style={{ background: C.white, padding: '90px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
            <div data-reveal='up' className='text-center' style={{ marginBottom: 56 }}>
              <SecLabel>OUR BLOG</SecLabel>
              <Typography variant='h3' sx={{ fontWeight: 800, color: '#d0dce8', fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                Recent Articles and News
              </Typography>
              <HbDivider />
            </div>
            <Grid container spacing={3}>
              {BLOGS.map((b, i) => (
                <Grid key={i} size={{ xs: 12, md: 4 }}>
                  <div data-reveal='up' data-d={String(i + 1)}>
                    <Card className='sr-blog-card' elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', border: `1px solid ${C.border}` }}>
                      {/* Thumb */}
                      <div className='relative flex items-center justify-center' style={{ height: 200, background: b.bg, fontSize: '5rem' }}>
                        {b.emoji}
                        <Chip label={b.date} size='small' sx={{ position: 'absolute', bottom: 12, right: 12, background: C.blue, color: '#fff', fontWeight: 700, fontSize: '.72rem' }} />
                      </div>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography variant='subtitle1' sx={{ fontWeight: 700, color: C.dark, mb: 1, lineHeight: 1.45 }}>{b.title}</Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.65, mb: 2 }}>{b.desc}</Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                            <i className='tabler-user text-xs' /> {b.author}
                          </Typography>
                          <div className='flex items-center gap-3'>
                            <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'><i className='tabler-heart text-xs' /> 12</Typography>
                            <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'><i className='tabler-message text-xs' /> 5</Typography>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════ */}
        <section className='relative overflow-hidden' style={{ background: C.bgGrey, padding: '90px 0' }}>
          <HexBg opacity={0.03} />
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
            <div data-reveal='up' className='text-center' style={{ marginBottom: 56 }}>
              <SecLabel>COMMON QUESTIONS</SecLabel>
              <Typography variant='h3' sx={{ fontWeight: 800, color: C.dark, fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
                Frequently Asked Questions
              </Typography>
              <HbDivider />
            </div>
            <div className='sr-faq'>
              {FAQS.map((f, i) => (
                <div key={i} data-reveal='up' data-d={String(i + 1)}>
                  <Accordion
                    expanded={expandedFaq === `faq-${i}`}
                    onChange={(_, exp) => setExpandedFaq(exp ? `faq-${i}` : false)}
                    disableGutters elevation={0}
                  >
                    <AccordionSummary expandIcon={<i className='tabler-chevron-down' />}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>{f.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.8 }}>{f.a}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PARTNERS
        ══════════════════════════════════════════════ */}
        <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '44px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 5%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
            {PARTNERS.map((p, i) => (
              <div key={i} data-reveal='up' data-d={String(i + 1)} className='sr-partner flex items-center gap-2'>
                <span style={{ fontSize: '1.6rem' }}>{p.emoji}</span>
                <Typography variant='body2' sx={{ fontWeight: 700, color: C.dark }}>{p.name}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer id='contact' style={{ background: C.blueDeep, padding: '70px 0 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
            <Grid container spacing={6}>

              {/* Brand */}
              <Grid size={{ xs: 12, md: 4 }}>
                <div className='flex items-center gap-2' style={{ marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className='tabler-hospital-circle text-lg' style={{ color: '#fff' }} />
                  </div>
                  <Typography variant='h6' sx={{ fontWeight: 800, color: '#fff' }}>New Senara</Typography>
                </div>
                <Typography variant='body2' sx={{ color: 'rgba(255,255,255,.58)', lineHeight: 1.8, mb: 3 }}>
                  Our clinic has grown to provide world-class facilities for treatment and care of patients across Sabaragamuwa Province. Trusted healthcare with 15+ years of experience.
                </Typography>
                <div className='flex gap-3'>
                  {['tabler-brand-facebook', 'tabler-brand-instagram', 'tabler-brand-twitter', 'tabler-brand-linkedin'].map((ic, i) => (
                    <a key={i} href='#'
                      style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.6)', textDecoration: 'none', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.borderColor = C.blue }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)' }}
                    >
                      <i className={`${ic} text-xs`} />
                    </a>
                  ))}
                </div>
              </Grid>

              {/* Departments */}
              <Grid size={{ xs: 6, md: 2 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#fff', mb: 2.5, pb: 1.5, borderBottom: `2px solid ${C.blue}`, display: 'inline-block' }}>
                  Departments
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {DEPT_LINKS.map((d, i) => (
                    <a key={i} href='#' className='sr-flink'>{d}</a>
                  ))}
                </div>
              </Grid>

              {/* Latest News */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#fff', mb: 2.5, pb: 1.5, borderBottom: `2px solid ${C.blue}`, display: 'inline-block' }}>
                  Latest News
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                  {[
                    { emoji: '🩺', title: 'Integrative Medicine & Specialist Care', date: 'February 10, 2026' },
                    { emoji: '💊', title: 'Achieving Better Healthcare in Ratnapura', date: 'January 28, 2026' },
                    { emoji: '🔬', title: 'Great Lab Care for Patients',             date: 'January 15, 2026' },
                  ].map((n, i) => (
                    <div key={i} className='flex gap-3 items-start'>
                      <div style={{ width: 54, height: 54, borderRadius: 6, background: 'rgba(255,255,255,.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        {n.emoji}
                      </div>
                      <div>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: 'rgba(255,255,255,.85)', lineHeight: 1.45, mb: .5 }}>{n.title}</Typography>
                        <Typography variant='caption' sx={{ color: 'rgba(255,255,255,.38)' }}>{n.date}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>

              {/* Contact */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#fff', mb: 2.5, pb: 1.5, borderBottom: `2px solid ${C.blue}`, display: 'inline-block' }}>
                  Contact Us
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                  {[
                    { icon: 'tabler-map-pin',  label: 'Address', val: 'No. 12 Main Street, Ratnapura, Sri Lanka' },
                    { icon: 'tabler-phone',     label: 'Phone',   val: '+94 45 222 3456\n+94 45 222 3457' },
                    { icon: 'tabler-mail',      label: 'Email',   val: 'info@newsenara.lk' },
                    { icon: 'tabler-clock',     label: 'Hours',   val: 'Mon–Sat: 8:00 AM – 8:00 PM\nSunday: 9:00 AM – 2:00 PM' },
                  ].map((c, i) => (
                    <div key={i} className='flex gap-3 items-start'>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(26,111,179,.28)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`${c.icon} text-sm`} style={{ color: C.blue }} />
                      </div>
                      <div>
                        <Typography variant='caption' sx={{ fontWeight: 700, color: 'rgba(255,255,255,.8)', display: 'block', mb: .3 }}>{c.label}</Typography>
                        <Typography variant='body2' sx={{ color: 'rgba(255,255,255,.55)', whiteSpace: 'pre-line', lineHeight: 1.65 }}>{c.val}</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>

            {/* Footer bottom bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 52, padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <Typography variant='caption' sx={{ color: 'rgba(255,255,255,.38)' }}>
                Copyright © 2025 <strong style={{ color: 'rgba(255,255,255,.55)' }}>New Senara Channel Center</strong>. All Rights Reserved.
              </Typography>
              <div className='flex gap-5'>
                {['Privacy Policy', 'Contact'].map((l, i) => (
                  <a key={i} href='#'
                    style={{ color: 'rgba(255,255,255,.38)', fontSize: '.78rem', textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.blue)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.38)')}
                  >{l}</a>
                ))}
                <span
                  onClick={() => setAuthModal('staff')}
                  style={{ color: 'rgba(255,255,255,.38)', fontSize: '.78rem', cursor: 'pointer', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.blue)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.38)')}
                >
                  Staff Login
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* ══════════════════════════════════════════════
            PATIENT PORTAL MODAL
        ══════════════════════════════════════════════ */}
        <Dialog open={authModal === 'patient'} onClose={() => setAuthModal(null)} maxWidth='xs' fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24, textAlign: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>👤</div>
              <Typography variant='h5' sx={{ fontWeight: 800, color: C.dark }}>Patient Portal</Typography>
              <Typography variant='body2' color='text.secondary'>Access appointments, records &amp; lab results</Typography>
            </div>
            <Tabs value={patientTab} onChange={(_, v) => setPatientTab(v)} variant='fullWidth' sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Tab label='Login' sx={{ fontWeight: 800 }} />
              <Tab label='Register' sx={{ fontWeight: 800 }} />
            </Tabs>
            {patientTab === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TextField label='NIC / Patient ID' placeholder='Enter your NIC number' fullWidth size='small' />
                <TextField label='Password' type='password' fullWidth size='small' />
                <Typography variant='caption' sx={{ color: C.blue, fontWeight: 700, cursor: 'pointer', textAlign: 'right', display: 'block' }}>Forgot password?</Typography>
                <Button variant='contained' size='large' fullWidth className='sr-btn-primary' sx={{ borderRadius: '4px !important' }}>Sign In to Portal</Button>
                <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center' }}>
                  New patient?{' '}
                  <span style={{ color: C.blue, fontWeight: 700, cursor: 'pointer' }} onClick={() => setPatientTab(1)}>Create an account</span>
                </Typography>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TextField label='Full Name' fullWidth size='small' />
                <TextField label='NIC Number' fullWidth size='small' />
                <TextField label='Mobile Number' placeholder='+94 7X XXX XXXX' fullWidth size='small' />
                <TextField label='Date of Birth' type='date' fullWidth size='small' InputLabelProps={{ shrink: true }} />
                <TextField label='Password' type='password' fullWidth size='small' />
                <Button variant='contained' size='large' fullWidth className='sr-btn-primary' sx={{ borderRadius: '4px !important' }}>Create Patient Account</Button>
                <Typography variant='caption' color='text.disabled' sx={{ textAlign: 'center' }}>By registering you agree to our Terms &amp; Privacy Policy</Typography>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════
            STAFF LOGIN MODAL
        ══════════════════════════════════════════════ */}
        <Dialog open={authModal === 'staff'} onClose={() => setAuthModal(null)} maxWidth='xs' fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24, textAlign: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🔒</div>
              <Typography variant='h5' sx={{ fontWeight: 800, color: C.dark }}>Staff Portal</Typography>
              <Typography variant='body2' color='text.secondary'>For Admins, Doctors &amp; Reception Staff</Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <TextField label='Staff Email' type='email' fullWidth size='small' />
              <TextField label='Password' type='password' fullWidth size='small' />
              <FormControl fullWidth size='small'>
                <InputLabel>Login As</InputLabel>
                <Select value={staffRole} label='Login As' onChange={e => setStaffRole(e.target.value as string)}>
                  {STAFF_ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
              </FormControl>
              <Button variant='contained' size='large' fullWidth
                sx={{ borderRadius: '4px !important', fontWeight: 800, background: `${C.blueDeep} !important`, '&:hover': { background: '#061929 !important' } }}
              >
                Sign In to Staff Portal
              </Button>
              <Typography variant='caption' color='text.disabled' sx={{ textAlign: 'center' }}>
                Staff accounts are created by the administrator only.
              </Typography>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  )
}
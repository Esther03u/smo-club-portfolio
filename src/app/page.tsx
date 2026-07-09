'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FadeIn, StaggerContainer, AnimatedText } from '@/components/ui/animated';
import { MemberCard } from '@/components/ui/MemberCard';
import { supabase } from '@/lib/supabaseClient';

// ---- Types ----
interface Member {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// ---- Hero words cycle ----
const heroWords = ['สร้างสรรค์', 'ยอดเยี่ยม', 'แข็งแกร่ง', 'มีวิสัยทัศน์'];

function useWordCycle(words: string[], interval = 2500) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((prev) => (prev + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return words[i];
}

// ---- Stats ----
const stats = [
  { value: '50+', label: 'สมาชิก' },
  { value: '30+', label: 'ผลงาน' },
  { value: '5+', label: 'ปีที่ก่อตั้ง' },
  { value: '10+', label: 'รางวัล' },
];

// ---- Main Page ----
export default function HomePage() {
  const word = useWordCycle(heroWords);
  const [members, setMembers] = useState<Member[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: membersData }, { data: announcementsData }] = await Promise.all([
        supabase.from('members').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
      ]);
      if (membersData) setMembers(membersData);
      if (announcementsData) setAnnouncements(announcementsData);
    }
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-[120px]"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            สโมสรนักศึกษา มหาวิทยาลัยราชภัฏภูเก็ต
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <AnimatedText text="พวกเรา" className="text-white" delay={0.3} />
            <br />
            <AnimatedText text="ทีมที่" className="text-zinc-400" delay={0.5} />
            {' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={word}
                  initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -40, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="gradient-text absolute left-0 right-0"
                >
                  {word}
                </motion.span>
              </AnimatePresence>
              <span className="opacity-0 gradient-text">{heroWords.reduce((a, b) => a.length > b.length ? a : b)}</span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            สโมสรที่รวบรวมนักศึกษาผู้มีความสามารถ สร้างผลงานอันโดดเด่น
            และมุ่งสู่ความเป็นเลิศทุกก้าว
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/members"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              พบกับสมาชิก
            </Link>
            <Link
              href="/works"
              className="px-8 py-3.5 glass-card hover:bg-white/6 text-white rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5"
            >
              ดูผลงาน
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-zinc-600"
          >
            <div className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-zinc-500 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } } }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-zinc-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Members Preview ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">ทีมของเรา</p>
            <h2 className="text-4xl font-bold text-white mb-4">พบกับสมาชิก</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              รวมคนเก่งจากหลากหลายสาขา ร่วมสร้างสรรค์สิ่งดีๆ ให้กับสโมสร
            </p>
          </FadeIn>

          {members.length === 0 ? (
            // Demo cards if no data yet
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'สมชาย ใจดี', role: 'ประธานสโมสร', bio: 'นักศึกษาปี 4 สาขาวิทยาการคอมพิวเตอร์' },
                { name: 'สมหญิง รักเรียน', role: 'รองประธาน', bio: 'นักศึกษาปี 3 สาขาการจัดการ' },
                { name: 'วิชัย ขยันดี', role: 'ฝ่ายประชาสัมพันธ์', bio: 'นักศึกษาปี 2 สาขานิเทศศาสตร์' },
                { name: 'นภา สุขใจ', role: 'ฝ่ายกิจกรรม', bio: 'นักศึกษาปี 3 สาขาการบัญชี' },
                { name: 'พิชิต มานะ', role: 'ฝ่ายการเงิน', bio: 'นักศึกษาปี 4 สาขาการเงิน' },
                { name: 'มาลี หัวใจใหญ่', role: 'ฝ่ายสวัสดิการ', bio: 'นักศึกษาปี 2 สาขารัฐศาสตร์' },
              ].map((m, i) => (
                <MemberCard key={i} {...m} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m, i) => (
                <MemberCard key={m.id} {...m} index={i} />
              ))}
            </div>
          )}

          <FadeIn delay={0.3} className="text-center mt-12">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              ดูสมาชิกทั้งหมด
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Announcements ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-3">ข่าวสาร</p>
            <h2 className="text-4xl font-bold text-white mb-4">ประกาศล่าสุด</h2>
            <p className="text-zinc-400">ติดตามข่าวสารและกิจกรรมจากสโมสร</p>
          </FadeIn>

          <div className="space-y-4">
            {(announcements.length > 0 ? announcements : [
              { id: '1', title: 'ประชุมสามัญประจำปี 2567', content: 'ขอเชิญสมาชิกทุกท่านเข้าร่วมประชุมสามัญประจำปี วันที่ 15 ก.ค. 2567 เวลา 13:00 น.', created_at: '2024-07-01' },
              { id: '2', title: 'รับสมัครสมาชิกใหม่ประจำปีการศึกษา 2567', content: 'สโมสรเปิดรับสมาชิกใหม่แล้ว! สมัครได้ถึงวันที่ 31 ก.ค. 2567', created_at: '2024-06-20' },
              { id: '3', title: 'โครงการอาสาพัฒนาชุมชน', content: 'ร่วมกันทำดีเพื่อสังคม ณ หมู่บ้านกะรน จ.ภูเก็ต', created_at: '2024-06-10' },
            ] as Announcement[]).map((ann, i) => (
              <FadeIn key={ann.id} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                        {ann.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{ann.content}</p>
                    </div>
                    <time className="text-xs text-zinc-600 whitespace-nowrap mt-1">
                      {new Date(ann.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              พร้อมร่วมเป็นส่วนหนึ่ง<br />
              <span className="gradient-text">ของเราแล้วหรือยัง?</span>
            </h2>
            <p className="text-zinc-400 mb-8">
              เข้าร่วมสโมสรและสัมผัสประสบการณ์ที่คุณจะจดจำตลอดชีวิต
            </p>
            <Link
              href="/members"
              className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              เข้าร่วมสโมสร
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

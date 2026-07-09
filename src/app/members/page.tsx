'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/animated';
import { MemberCard } from '@/components/ui/MemberCard';
import { supabase } from '@/lib/supabaseClient';

interface Member {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
}

const demoMembers: Member[] = [
  { id: '1', name: 'สมชาย ใจดี', role: 'ประธานสโมสร', bio: 'นักศึกษาปี 4 สาขาวิทยาการคอมพิวเตอร์ มีความเชี่ยวชาญด้านการพัฒนาซอฟต์แวร์' },
  { id: '2', name: 'สมหญิง รักเรียน', role: 'รองประธาน', bio: 'นักศึกษาปี 3 สาขาการจัดการธุรกิจ' },
  { id: '3', name: 'วิชัย ขยันดี', role: 'ฝ่ายประชาสัมพันธ์', bio: 'นักศึกษาปี 2 สาขานิเทศศาสตร์' },
  { id: '4', name: 'นภา สุขใจ', role: 'ฝ่ายกิจกรรม', bio: 'นักศึกษาปี 3 สาขาการบัญชี' },
  { id: '5', name: 'พิชิต มานะ', role: 'ฝ่ายการเงิน', bio: 'นักศึกษาปี 4 สาขาการเงินและการธนาคาร' },
  { id: '6', name: 'มาลี หัวใจใหญ่', role: 'ฝ่ายสวัสดิการ', bio: 'นักศึกษาปี 2 สาขารัฐศาสตร์' },
  { id: '7', name: 'ชนกานต์ ดวงดี', role: 'ฝ่ายวิชาการ', bio: 'นักศึกษาปี 3 สาขาเทคโนโลยีสารสนเทศ' },
  { id: '8', name: 'ธีรพงศ์ เก่งกาจ', role: 'ฝ่ายกีฬา', bio: 'นักศึกษาปี 2 สาขาพลศึกษา' },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      const { data } = await supabase.from('members').select('*').order('name');
      setMembers(data && data.length > 0 ? data : demoMembers);
      setLoading(false);
    }
    fetchMembers();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            {members.length} สมาชิก
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-4">
            สมาชิก<span className="gradient-text">สโมสร</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            รู้จักกับทีมงานผู้อยู่เบื้องหลังความสำเร็จของสโมสร
          </p>
        </FadeIn>

        {/* Search */}
        <FadeIn delay={0.2} className="mb-12">
          <div className="max-w-md mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาชื่อหรือตำแหน่ง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
            />
          </div>
        </FadeIn>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-white/8 mb-4" />
                <div className="h-5 bg-white/8 rounded mb-2 w-3/4" />
                <div className="h-4 bg-white/5 rounded mb-3 w-1/2" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m, i) => (
              <MemberCard key={m.id} {...m} index={i} />
            ))}
          </div>
        ) : (
          <FadeIn className="text-center py-20 text-zinc-500">
            <div className="text-5xl mb-4">🔍</div>
            <p>ไม่พบสมาชิกที่ค้นหา</p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

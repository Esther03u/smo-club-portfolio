'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Stats {
  members: number;
  announcements: number;
  works: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ members: 0, announcements: 0, works: 0 });
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      setUserEmail(user.email ?? '');

      // Fetch counts
      const [{ count: mc }, { count: ac }, { count: wc }] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('works').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ members: mc ?? 0, announcements: ac ?? 0, works: wc ?? 0 });
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  const cards = [
    { label: 'สมาชิก', value: stats.members, href: '/admin/members', icon: '👥', color: 'from-indigo-600 to-purple-600' },
    { label: 'ประกาศ', value: stats.announcements, href: '/admin/announcements', icon: '📢', color: 'from-purple-600 to-pink-600' },
    { label: 'ผลงาน', value: stats.works, href: '/admin/works', icon: '🎯', color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen pt-8 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white">แผงควบคุม</h1>
            <p className="text-zinc-400 mt-1 text-sm">ยินดีต้อนรับ, {userEmail}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 text-sm text-zinc-400 hover:text-white glass-card rounded-xl transition-colors">
              ดูหน้าเว็บ
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 glass-card rounded-xl transition-colors border-red-500/20">
              ออกจากระบบ
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href} className="block glass-card rounded-2xl p-6 hover:border-white/12 transition-all duration-300 group">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-2xl mb-4`}>
                  {card.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                  {loading ? <div className="h-10 w-16 bg-white/8 rounded animate-pulse" /> : card.value}
                </div>
                <div className="text-zinc-400 text-sm group-hover:text-zinc-200 transition-colors">
                  {card.label} → จัดการ
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-semibold text-white mb-4">การดำเนินการด่วน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: '/admin/members', label: '+ เพิ่มสมาชิกใหม่', desc: 'เพิ่มข้อมูลสมาชิกสโมสร' },
              { href: '/admin/announcements', label: '+ สร้างประกาศ', desc: 'ประกาศข่าวสารและกิจกรรม' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="glass-card rounded-xl p-4 hover:border-white/10 transition-all group">
                <div className="font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors mb-1">{link.label}</div>
                <div className="text-sm text-zinc-500">{link.desc}</div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

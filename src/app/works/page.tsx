'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FadeIn, ScaleOnHover } from '@/components/ui/animated';
import { supabase } from '@/lib/supabaseClient';

interface Work {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  year?: number;
}

const demoWorks: Work[] = [
  { id: '1', title: 'โครงการอาสาพัฒนาชุมชน', description: 'ร่วมกันพัฒนาชุมชนในจังหวัดภูเก็ต สร้างสรรค์สิ่งดีๆ ให้กับสังคม', category: 'สังคม', year: 2024 },
  { id: '2', title: 'งานสัมมนาวิชาการ 2567', description: 'งานสัมมนาเพื่อพัฒนาทักษะและความรู้ให้กับนักศึกษา', category: 'วิชาการ', year: 2024 },
  { id: '3', title: 'กีฬาสีสโมสร', description: 'กิจกรรมกีฬาสีเพื่อส่งเสริมความสามัคคีในหมู่สมาชิก', category: 'กีฬา', year: 2024 },
  { id: '4', title: 'นิทรรศการผลงานนักศึกษา', description: 'แสดงผลงานสร้างสรรค์ของนักศึกษาในรูปแบบนิทรรศการ', category: 'ศิลปะ', year: 2023 },
  { id: '5', title: 'โครงการฝึกอบรมผู้นำ', description: 'พัฒนาทักษะความเป็นผู้นำให้กับสมาชิกสโมสร', category: 'พัฒนา', year: 2023 },
  { id: '6', title: 'วันสถาปนาสโมสร', description: 'ฉลองครบรอบก่อตั้งสโมสรนักศึกษา', category: 'วันสำคัญ', year: 2023 },
];

const categoryColors: Record<string, string> = {
  สังคม: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  วิชาการ: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  กีฬา: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  ศิลปะ: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  พัฒนา: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  วันสำคัญ: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
};

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState<string>('ทั้งหมด');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorks() {
      setLoading(true);
      const { data } = await supabase.from('works').select('*').order('year', { ascending: false });
      setWorks(data && data.length > 0 ? data : demoWorks);
      setLoading(false);
    }
    fetchWorks();
  }, []);

  const categories = ['ทั้งหมด', ...Array.from(new Set(works.map((w) => w.category || 'อื่นๆ')))];
  const filtered = filter === 'ทั้งหมด' ? works : works.filter((w) => w.category === filter);

  const gradients = [
    'from-indigo-900/50 to-purple-900/50',
    'from-purple-900/50 to-pink-900/50',
    'from-blue-900/50 to-cyan-900/50',
    'from-emerald-900/50 to-teal-900/50',
    'from-orange-900/50 to-red-900/50',
    'from-pink-900/50 to-rose-900/50',
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            ผล<span className="gradient-text">งาน</span>ของเรา
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            รวบรวมโครงการและกิจกรรมที่ผ่านมาของสโมสร
          </p>
        </FadeIn>

        {/* Category Filter */}
        <FadeIn delay={0.2} className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  filter === cat
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'glass-card text-zinc-400 hover:text-white hover:border-white/12'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-6">
                  <div className="h-5 bg-white/8 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((work, i) => (
              <ScaleOnHover key={work.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-white/12 transition-all duration-300"
                >
                  {/* Image / Gradient Placeholder */}
                  <div className={`relative h-48 bg-gradient-to-br ${gradients[i % gradients.length]} overflow-hidden`}>
                    {work.image_url ? (
                      <Image src={work.image_url} alt={work.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">🎯</span>
                      </div>
                    )}
                    {/* Year badge */}
                    {work.year && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs text-zinc-300">
                        {work.year}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {work.category && (
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md border mb-3 ${categoryColors[work.category] ?? 'text-zinc-400 bg-white/5 border-white/10'}`}>
                        {work.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-indigo-300 transition-colors">
                      {work.title}
                    </h3>
                    {work.description && (
                      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{work.description}</p>
                    )}
                  </div>
                </motion.div>
              </ScaleOnHover>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

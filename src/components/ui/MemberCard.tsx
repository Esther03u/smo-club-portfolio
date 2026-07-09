'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ScaleOnHover } from './animated';

interface MemberCardProps {
  name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  index?: number;
}

export function MemberCard({ name, role, bio, avatar_url, index = 0 }: MemberCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    'from-indigo-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
  ];
  const colorClass = colors[index % colors.length];

  return (
    <ScaleOnHover>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-30px' }}
        className="glass-card rounded-2xl p-6 group cursor-pointer hover:border-white/12 transition-all duration-300"
      >
        {/* Avatar */}
        <div className="mb-4">
          {avatar_url ? (
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/10">
              <Image src={avatar_url} alt={name} fill className="object-cover" />
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-xl`}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-indigo-400 font-medium mb-3">{role}</p>
        {bio && <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{bio}</p>}

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08), transparent 70%)' }}
        />
      </motion.div>
    </ScaleOnHover>
  );
}

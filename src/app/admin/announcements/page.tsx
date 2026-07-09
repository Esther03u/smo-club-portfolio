'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const emptyForm = { title: '', content: '' };

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/admin/login');
    });
    fetchItems();
  }, [router]);

  async function fetchItems() {
    setFetching(true);
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await supabase.from('announcements').update(form).eq('id', editingId);
      setSuccess('อัปเดตประกาศเรียบร้อยแล้ว');
    } else {
      await supabase.from('announcements').insert(form);
      setSuccess('สร้างประกาศเรียบร้อยแล้ว');
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setLoading(false);
    fetchItems();
    setTimeout(() => setSuccess(''), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบประกาศนี้ใช่หรือไม่?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    fetchItems();
  }

  function startEdit(item: Announcement) {
    setForm({ title: item.title, content: item.content });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors">← กลับ</Link>
          <h1 className="text-3xl font-bold text-white">จัดการประกาศ</h1>
          <button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}
            className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {showForm ? 'ยกเลิก' : '+ สร้างประกาศ'}
          </button>
        </div>

        {/* Success notification */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-6 mb-8 overflow-hidden space-y-4"
            >
              <h2 className="text-lg font-semibold text-white">{editingId ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'}</h2>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">หัวข้อ *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="หัวข้อประกาศ"
                  className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">เนื้อหา *</label>
                <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="รายละเอียดประกาศ..." rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                  {loading ? 'กำลังบันทึก...' : editingId ? 'อัปเดต' : 'บันทึก'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}
                  className="px-6 py-2.5 glass-card hover:bg-white/8 text-zinc-400 rounded-xl text-sm transition-colors">
                  ยกเลิก
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* List */}
        {fetching ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-white/8 rounded mb-3 w-2/3" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <div className="text-5xl mb-4">📢</div>
            <p>ยังไม่มีประกาศ กด "+ สร้างประกาศ" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{item.content}</p>
                    <time className="text-xs text-zinc-600 mt-2 block">
                      {new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(item)}
                      className="px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 glass-card rounded-lg transition-colors">
                      แก้ไข
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 glass-card rounded-lg transition-colors">
                      ลบ
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Member {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
}

const emptyForm = { name: '', role: '', bio: '', avatar_url: '' };

export default function AdminMembersPage() {
  const router = useRouter();
  const [items, setItems] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/admin/login');
    });
    fetchItems();
  }, [router]);

  async function fetchItems() {
    setFetching(true);
    const { data } = await supabase.from('members').select('*').order('name');
    setItems(data ?? []);
    setFetching(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filename, file);
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
      setForm((f) => ({ ...f, avatar_url: publicUrl }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = { name: form.name, role: form.role, bio: form.bio || null, avatar_url: form.avatar_url || null };
    if (editingId) {
      await supabase.from('members').update(payload).eq('id', editingId);
      setSuccess('อัปเดตข้อมูลสมาชิกเรียบร้อยแล้ว');
    } else {
      await supabase.from('members').insert(payload);
      setSuccess('เพิ่มสมาชิกใหม่เรียบร้อยแล้ว');
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setLoading(false);
    fetchItems();
    setTimeout(() => setSuccess(''), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm('ต้องการลบสมาชิกนี้ใช่หรือไม่?')) return;
    await supabase.from('members').delete().eq('id', id);
    fetchItems();
  }

  function startEdit(item: Member) {
    setForm({ name: item.name, role: item.role, bio: item.bio ?? '', avatar_url: item.avatar_url ?? '' });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-8 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors">← กลับ</Link>
          <h1 className="text-3xl font-bold text-white">จัดการสมาชิก</h1>
          <button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}
            className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {showForm ? 'ยกเลิก' : '+ เพิ่มสมาชิก'}
          </button>
        </div>

        {/* Success */}
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
              <h2 className="text-lg font-semibold text-white">{editingId ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">ชื่อ-นามสกุล *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="สมชาย ใจดี"
                    className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">ตำแหน่ง *</label>
                  <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="ประธานสโมสร"
                    className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">ประวัติย่อ</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับสมาชิก..." rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">รูปภาพ (อัปโหลด หรือใส่ URL)</label>
                <div className="flex gap-3 items-center">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-zinc-400 hover:border-white/16 transition-all text-sm text-center">
                      {uploading ? 'กำลังอัปโหลด...' : '📷 เลือกรูปภาพ'}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  <span className="text-zinc-600 text-sm">หรือ</span>
                  <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                    placeholder="URL รูปภาพ"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                  />
                </div>
                {form.avatar_url && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={form.avatar_url} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <span className="text-xs text-zinc-500">ตัวอย่างรูปภาพ</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading || uploading}
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
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-4 animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/8 shrink-0" />
                <div className="flex-1"><div className="h-4 bg-white/8 rounded mb-2 w-1/3" /><div className="h-3 bg-white/5 rounded w-1/4" /></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <div className="text-5xl mb-4">👥</div>
            <p>ยังไม่มีสมาชิก กด "+ เพิ่มสมาชิก" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="glass-card rounded-2xl p-4 hover:border-white/10 transition-all duration-200 flex items-center gap-4">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    {initials(item.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-sm text-indigo-400">{item.role}</div>
                  {item.bio && <div className="text-xs text-zinc-500 truncate mt-0.5">{item.bio}</div>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(item)} className="px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 glass-card rounded-lg transition-colors">แก้ไข</button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 glass-card rounded-lg transition-colors">ลบ</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

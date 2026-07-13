-- 1. Create Tables
CREATE TABLE public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    year INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Storage Bucket for Avatars & Works
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- 3. Set up Row Level Security (RLS)
-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public profiles are viewable by everyone." ON public.members FOR SELECT USING (true);
CREATE POLICY "Public works are viewable by everyone." ON public.works FOR SELECT USING (true);
CREATE POLICY "Public announcements are viewable by everyone." ON public.announcements FOR SELECT USING (true);

-- Allow authenticated users (Admin) to insert/update/delete
CREATE POLICY "Admins can insert members." ON public.members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update members." ON public.members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete members." ON public.members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert works." ON public.works FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update works." ON public.works FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete works." ON public.works FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert announcements." ON public.announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update announcements." ON public.announcements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete announcements." ON public.announcements FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Storage Policies (Allow public to view, Admins to upload)
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Admins can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

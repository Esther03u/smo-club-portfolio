'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Users, ChevronRight } from 'lucide-react';
import TextType from '../components/TextType/TextType';
import ShinyText from '../components/ShinyText/ShinyText';
import CircularGallery from '../components/CircularGallery/CircularGallery';
import StaggeredMenu from '../components/StaggeredMenu/StaggeredMenu';
import DotField from '../components/DotField/DotField';
import BorderGlow from '../components/BorderGlow/BorderGlow';

const menuItems = [
  { label: 'หน้าแรก', ariaLabel: 'Go to home page', link: '#home' },
  { label: 'สมาชิก', ariaLabel: 'Members', link: '#members' },
  { label: 'ติดต่อเรา', ariaLabel: 'Contact us', link: '#contact' },
  { label: 'ร้องเรียน', ariaLabel: 'Report or complain', link: '#report' },
  { label: 'เข้าสู่ระบบ', ariaLabel: 'Login', link: '#login' }
];

const socialItems = [
  { label: 'Facebook', link: 'https://facebook.com' },
  { label: 'Instagram', link: 'https://instagram.com' },
  { label: 'Line', link: 'https://line.me' }
];

const logoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40"><text x="0" y="28" font-family="sans-serif" font-size="24" font-weight="bold" fill="white">SMO SCI-TECH</text></svg>`;

const members = [
  {
    id: 1,
    name: 'นายสมชาย ใจดี',
    role: 'นายกสโมสรนักศึกษา',
    image: 'https://i.pravatar.cc/300?img=11',
  },
  {
    id: 2,
    name: 'นางสาวสมหญิง รักเรียน',
    role: 'รองนายกสโมสรนักศึกษา',
    image: 'https://i.pravatar.cc/300?img=5',
  },
  {
    id: 3,
    name: 'นายกิตติ เก่งกาจ',
    role: 'เลขานุการ',
    image: 'https://i.pravatar.cc/300?img=15',
  },
  {
    id: 4,
    name: 'นางสาวมาลี สีสวย',
    role: 'เหรัญญิก',
    image: 'https://i.pravatar.cc/300?img=9',
  },
  {
    id: 5,
    name: 'นายชาญชัย ชาญวิทย์',
    role: 'ฝ่ายกิจกรรม',
    image: 'https://i.pravatar.cc/300?img=33',
  },
  {
    id: 6,
    name: 'นางสาววิไล ไว้วางใจ',
    role: 'ฝ่ายประชาสัมพันธ์',
    image: 'https://i.pravatar.cc/300?img=24',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-yellow-500/30 overflow-hidden relative">
      
      {/* Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotField
          dotRadius={1.5}
          dotSpacing={15}
          bulgeStrength={60}
          glowRadius={160}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="#eab308"
          gradientTo="#f97316"
          glowColor="#1a1a1a"
        />
      </div>

      {/* Navbar (StaggeredMenu) */}
      <StaggeredMenu
        isFixed={true}
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#000000"
        changeMenuColorOnOpen={true}
        colors={['#eab308', '#f59e0b']}
        logoUrl={logoSvg}
        accentColor="#eab308"
      />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-6">
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <ShinyText text="สโมสรนักศึกษาคณะวิทยาศาสตร์และเทคโนโลยี" disabled={false} speed={3} className="text-sm font-medium" color="#d4d4d8" shineColor="#eab308" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight flex flex-col items-center justify-center gap-2 md:gap-4"
            >
              <span className="text-white drop-shadow-md">Welcome to</span>
              <TextType 
                text={["SMO Sci-Tech"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 pb-2"
              />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10"
            >
              มหาวิทยาลัยราชภัฏภูเก็ต<br/>
              เป็นตัวแทนของนักศึกษาในการขับเคลื่อนกิจกรรม และเป็นกระบอกเสียงให้กับทุกคน
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4"
            >
              <a href="#members" className="px-8 py-3.5 bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-full transition-all flex items-center gap-2">
                ทำความรู้จักพวกเรา <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full transition-all backdrop-blur-sm">
                ติดต่อสโมสร
              </a>
            </motion.div>
          </div>
        </section>

        {/* MEMBERS SECTION */}
        <section id="members" className="py-32 px-6 relative z-10 border-t border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">สมาชิกในสโมสร</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                คณะกรรมการสโมสรนักศึกษา ประจำปีการศึกษา 2567 ที่พร้อมดูแลและรับฟังทุกปัญหาของนักศึกษา
              </p>
            </div>

            <div style={{ height: '600px', position: 'relative' }} className="w-full mt-10">
              <CircularGallery
                bend={1}
                textColor="#ffffff"
                borderRadius={0.05}
                scrollEase={0.05}
                scrollSpeed={2}
              />
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 px-6 relative z-10 border-t border-white/5 overflow-hidden flex flex-col items-center">
          {/* Symmetrical Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-yellow-500/10 blur-[150px] pointer-events-none rounded-full" />
          
          <div className="w-full max-w-6xl flex flex-col items-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center w-full">ช่องทางการติดต่อ</h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-3xl text-center w-full">
              หากมีข้อสงสัย เสนอแนะกิจกรรม หรือต้องการแจ้งเรื่องร้องเรียน สามารถติดต่อเราได้ตามช่องทางด้านล่างนี้
            </p>

            <div className="w-full max-w-5xl flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <BorderGlow
                glowColor="45 100 50"
                colors={['#eab308', '#f59e0b', '#d97706']}
                borderRadius={24}
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center text-center gap-4 p-8 w-full h-full">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 shrink-0">
                    <MessageCircle className="text-yellow-400 w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wide">Facebook Page</p>
                    <p className="text-zinc-100 font-medium leading-relaxed break-words">สโมสรนักศึกษาคณะวิทยาศาสตร์<br/>และเทคโนโลยี ม.ราชภัฏภูเก็ต</p>
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow
                glowColor="45 100 50"
                colors={['#eab308', '#f59e0b', '#d97706']}
                borderRadius={24}
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center text-center gap-4 p-8 w-full h-full">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 shrink-0">
                    <Phone className="text-yellow-400 w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wide">เบอร์โทรศัพท์ (ห้องสโมสร)</p>
                    <p className="text-zinc-100 font-medium text-lg leading-relaxed">076-XXX-XXX<br/><span className="text-sm text-zinc-500">ต่อ XXXX</span></p>
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow
                glowColor="45 100 50"
                colors={['#eab308', '#f59e0b', '#d97706']}
                borderRadius={24}
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center text-center gap-4 p-8 w-full h-full">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 shrink-0">
                    <MapPin className="text-yellow-400 w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wide">ที่ทำการสโมสร</p>
                    <p className="text-zinc-100 font-medium leading-relaxed break-words">อาคารศูนย์วิทยาศาสตร์<br/>และวิทยาศาสตร์ประยุกต์ ชั้น 1</p>
                  </div>
                </div>
              </BorderGlow>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8 text-center text-zinc-500 text-sm">
        <p>&copy; 2026 สโมสรนักศึกษาคณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏภูเก็ต. All rights reserved.</p>
      </footer>
    </div>
  );
}


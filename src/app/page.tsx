'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, MapPin, Users, ChevronRight, ArrowRight, Camera } from 'lucide-react';
import TextType from '../components/TextType/TextType';
import ShinyText from '../components/ShinyText/ShinyText';
import CircularGallery from '../components/CircularGallery/CircularGallery';
import StaggeredMenu from '../components/StaggeredMenu/StaggeredMenu';
import DotField from '../components/DotField/DotField';
import BorderGlow from '../components/BorderGlow/BorderGlow';
import SideRays from '../components/SideRays/SideRays';
import Folder from '../components/Folder';
import Carousel from '../components/Carousel';

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
        <SideRays 
          rayColor1="#eab308"
          rayColor2="#facc15"
          className="absolute inset-0 z-0 opacity-50" 
        />
        <div className="absolute inset-0 z-10">
          <DotField
            dotRadius={1}
            dotSpacing={15}
            cursorRadius={120}
            bulgeStrength={20}
            glowRadius={120}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="#eab308"
            gradientTo="#f97316"
            glowColor="#1a1a1a"
          />
        </div>
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
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6">
          
          <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl">

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-4"
            >
              <span className="text-white drop-shadow-md text-2xl sm:text-3xl md:text-5xl">Welcome to</span>
              <TextType 
                text={["SMO Sci-Tech"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 pb-2"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-4 w-[85%] sm:w-[90%] sm:max-w-2xl mx-auto"
            >
              <p className="text-base sm:text-lg md:text-xl font-medium text-zinc-300 tracking-wide text-center">
                มหาวิทยาลัยราชภัฏภูเก็ต
              </p>
              
              <div className="h-px w-12 bg-yellow-500/50 rounded-full" />
              
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <ShinyText 
                  text="คนของพระราชา ข้าของแผ่นดิน" 
                  disabled={false} 
                  speed={5} 
                  className="text-[13px] sm:text-base leading-relaxed text-center font-light"
                  color="#a1a1aa" 
                  shineColor="#eab308" 
                />
                <ShinyText 
                  text="&quot;มหาวิทยาลัยเพื่อการพัฒนาประเทศ ผ่านการขับเคลื่อนท้องถิ่น บนพื้นฐานความรับผิดชอบต่อสังคม&quot;" 
                  disabled={false} 
                  speed={5} 
                  delay={2.5}
                  className="text-[13px] sm:text-base leading-relaxed text-center font-light"
                  color="#a1a1aa" 
                  shineColor="#eab308" 
                />
              </div>
            </motion.div>

            {/* Spacer to guarantee distance between text and buttons */}
            <div className="h-8 sm:h-10 w-full" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center w-full px-4 sm:px-0 mt-4 sm:mt-0"
            >
              {/* PRIMARY BUTTON */}
              <motion.a 
                href="#members" 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center px-5 h-14 text-[15px] sm:text-base font-bold text-zinc-900 bg-yellow-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.7)] w-full max-w-[280px] sm:max-w-none sm:w-[220px]"
              >
                {/* Dotted Texture Reveal */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] mix-blend-overlay" />
                
                {/* Cyber Sweep */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] transition-transform ease-out">
                  <div className="relative h-full w-8 bg-white/30 blur-[1px]" />
                </div>
                
                <span className="relative z-10 flex items-center gap-2">
                  ทำความรู้จักพวกเรา
                  <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
                    <ChevronRight className="absolute transition-all duration-300 group-hover:translate-x-[150%] group-hover:opacity-0 w-4 h-4" />
                    <ArrowRight className="absolute -translate-x-[150%] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 w-4 h-4" />
                  </div>
                </span>
              </motion.a>

              {/* SECONDARY BUTTON */}
              <motion.a 
                href="#contact" 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center px-5 h-14 text-[15px] sm:text-base font-medium text-zinc-300 bg-black/40 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden transition-all duration-300 hover:bg-black/60 hover:text-white hover:border-yellow-500/50 hover:shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)] w-full max-w-[280px] sm:max-w-none sm:w-[220px]"
              >
                {/* Glowing edge effect on hover */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                <span className="relative z-10 flex items-center transition-transform duration-300 group-hover:-translate-x-2">
                  ติดต่อสโมสร
                </span>
                
                {/* Icon slides in from right */}
                <span className="absolute right-6 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-yellow-500 z-10">
                  <MessageCircle className="w-4 h-4" />
                </span>
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* MEMBERS SECTION */}
        <section id="members" className="py-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center relative z-20">
              <h2 className="text-4xl md:text-5xl font-bold">สมาชิกในสโมสร</h2>
            </div>

            <div style={{ height: '600px' }} className="w-full -mt-32 relative z-10">
              <CircularGallery
                bend={1}
                textColor="#ffffff"
                borderRadius={0.05}
                scrollEase={0.05}
                scrollSpeed={2}
                font="bold 40px 'Noto Sans Thai', sans-serif"
              />
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="min-h-[100dvh] pt-[120px] sm:pt-[200px] pb-[150px] sm:pb-[250px] px-4 sm:px-6 relative z-10 overflow-hidden flex flex-col items-center justify-center">
          {/* Symmetrical Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] h-[40vh] sm:h-[50vh] bg-yellow-500/10 blur-[100px] sm:blur-[150px] pointer-events-none rounded-full" />
          
          <div className="w-full max-w-6xl flex flex-col items-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center w-[85%] sm:w-[90%] mx-auto">ช่องทางการติดต่อ</h2>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 w-[85%] sm:w-[90%] sm:max-w-2xl text-center mx-auto leading-relaxed mb-6 sm:mb-8">
              หากมีข้อสงสัย เสนอแนะกิจกรรม หรือต้องการแจ้งเรื่องร้องเรียน สามารถติดต่อเราได้ตามช่องทางด้านล่างนี้
            </p>
            
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium animate-pulse text-center relative z-20 mt-8 sm:mt-12">
              Swipe and click to open links
            </p>
            
            {/* Guaranteed Spacer */}
            <div style={{ height: '32px' }} className="w-full block sm:hidden" />
            <div style={{ height: '48px' }} className="w-full hidden sm:block" />

            <div className="w-full max-w-5xl flex flex-col items-center">
              <div className="w-full sm:w-[85%] md:w-[60%] lg:w-[40%] mx-auto flex justify-center">
                <Carousel 
                  baseWidth={320}
                  autoplay={true}
                  autoplayDelay={3000}
                  pauseOnHover={true}
                  loop={true}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-8 flex justify-center text-center text-zinc-500 text-sm">
        <p className="w-[85%] sm:w-[90%] sm:max-w-none mx-auto leading-relaxed">
          &copy; 2026 สโมสรนักศึกษาคณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏภูเก็ต.<br className="block sm:hidden" /> All rights reserved.
        </p>
      </footer>
    </div>
  );
}


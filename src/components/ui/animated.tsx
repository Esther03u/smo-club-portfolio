'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

// ============================================================
// AnimatedText - แสดงข้อความทีละตัวอักษร (เหมือน Animate UI)
// ============================================================
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function AnimatedText({ text, className = '', delay = 0, once = true }: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start('visible');
  }, [isInView, controls]);

  const chars = text.split('');

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  const char: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={controls}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <motion.span key={i} variants={char} className="inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ============================================================
// TextCycle - หมุนข้อความ (เหมือน Animate UI text-rotate)
// ============================================================
interface TextCycleProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function TextCycle({ words, className = '', interval = 2500 }: TextCycleProps) {
  const [index, setIndex] = useIndex(words.length, interval);

  return (
    <span className={`relative inline-block overflow-hidden ${className}`} style={{ minWidth: '1ch' }}>
      <motion.span
        key={index}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="inline-block"
      >
        {words[index]}
      </motion.span>
    </span>
  );
}

function useIndex(max: number, interval: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((prev: number) => (prev + 1) % max), interval);
    return () => clearInterval(t);
  }, [max, interval]);
  return [i, setI] as const;
}

// ============================================================
// FadeIn - fade-in เมื่อ scroll มาถึง
// ============================================================
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
}

export function FadeIn({ children, className = '', delay = 0, direction = 'up', once = true }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const dirMap = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// ScaleOnHover - scale animation เมื่อ hover
// ============================================================
interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function ScaleOnHover({ children, className = '', scale = 1.03 }: ScaleOnHoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// StaggerContainer - ลูกๆ animate ทีละตัว
// ============================================================
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function StaggerContainer({ children, className = '', delay = 0, stagger = 0.1, once = true }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

'use client';

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useState } from 'react';
import ShinyText from '../ShinyText/ShinyText';

import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const DEFAULT_FONT = 'bold 30px Figtree';
// Figtree is not guaranteed to be available on the host page, so the component
// loads it on demand whenever the default font is used.
const DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap';

function deriveFontFamilyFromUrl(url) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '');
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont';
}

async function loadFontFromStylesheet(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family = null;
  const fontFaces = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet');
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load();
      document.fonts.add(face);
    })
  );
  return family;
}

async function loadFontFromFile(url) {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

async function loadCustomFont(fontUrl) {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl);
}

// Loads `fontUrl` (a stylesheet such as a Google Fonts URL, or a direct font
// file) and returns a canvas-ready font string that keeps the size/weight from
// `font` but swaps in the freshly loaded family. Falls back to `font` on error.
async function resolveFont(font, fontUrl) {
  // Use the bundled Figtree stylesheet when the caller relies on the default
  // font, otherwise honor the explicit `fontUrl`.
  const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null);
  if (!effectiveUrl) {
    // A custom family was supplied without a URL – make sure it is ready (in
    // case the host page declares it) before we draw it to the canvas,
    // otherwise the first paint silently falls back to a system font.
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(font);
        await document.fonts.ready;
      } catch {
        // Ignore – fall back to whatever the browser provides.
      }
    }
    return font;
  }
  try {
    const family = await loadCustomFont(effectiveUrl);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px';
    const resolved = `${prefix} "${family}"`;
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(resolved);
      } catch {
        // Ignore – we still attempt to render with the requested font.
      }
    }
    return resolved;
  } catch (error) {
    console.error('CircularGallery: unable to load font from', fontUrl, error);
    return font;
  }
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;

  const lines = text ? text.split('\n') : [''];
  let maxWidth = 0;
  lines.forEach(line => {
    const metrics = context.measureText(line);
    if (metrics.width > maxWidth) maxWidth = metrics.width;
  });

  const fontSize = getFontSize(font);
  const lineHeight = Math.ceil(fontSize * 1.5); // Increased line height for Thai characters
  const textWidth = Math.ceil(maxWidth);
  const textHeight = lineHeight * lines.length;

  canvas.width = textWidth + 40; // More padding
  canvas.height = textHeight + 40;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);

  lines.forEach((line, i) => {
    context.fillText(line, canvas.width / 2, (i * lineHeight) + (lineHeight / 2) + 20);
  });

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height, lines: lines.length };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif', yOffsetMultiplier = 1, yPadding = -0.05, sizeMultiplier = 1 }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.yOffsetMultiplier = yOffsetMultiplier;
    this.yPadding = yPadding;
    this.sizeMultiplier = sizeMultiplier;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height, lines } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform float uAlpha;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = vec4(color.rgb, color.a * uAlpha);
        }
      `,
      uniforms: { 
        tMap: { value: texture },
        uAlpha: { value: 1.0 }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    let textHeight = this.plane.scale.y * 0.15 * (lines || 1) * this.sizeMultiplier;
    let textWidth = textHeight * aspect;

    // Prevent text from overflowing the card width
    const maxTextWidth = this.plane.scale.x * 0.95;
    if (textWidth > maxTextWidth) {
      const scaleDown = maxTextWidth / textWidth;
      textWidth *= scaleDown;
      textHeight *= scaleDown;
    }

    this.mesh.scale.set(textWidth, textHeight, 1);
    
    // Position text: if yOffsetMultiplier is negative, place it at the bottom outside. 
    // If yOffsetMultiplier is positive, place it ABOVE the card outside.
    if (this.yOffsetMultiplier < 0) {
      this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 + this.yPadding;
    } else {
      this.mesh.position.y = this.plane.scale.y * 0.5 + textHeight * 0.5 + this.yPadding;
    }
    
    this.mesh.position.z = 0.1; // Ensure text is drawn in front of the card
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    positionText,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    imageBgColor = '#FDF6E3'
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.positionText = positionText;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.imageBgColor = imageBgColor;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
      anisotropy: 16
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform vec3 uImageBgColor;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alphaMask = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          // Use the alpha channel to reveal the cream background for PNGs
          // JPGs will just render normally because their alpha is 1.0
          vec3 finalRgb = mix(uImageBgColor, color.rgb, color.a);
          
          gl_FragColor = vec4(finalRgb, alphaMask);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uImageBgColor: { value: hexToRgb(this.imageBgColor) }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    let imgUrl = this.image;
    // Use Next.js image optimization API for local images
    if (imgUrl.startsWith('/') && !imgUrl.startsWith('/_next')) {
      imgUrl = `/_next/image?url=${encodeURIComponent(imgUrl)}&w=1080&q=75`;
    }
    
    img.src = imgUrl;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
      yOffsetMultiplier: -1,
      yPadding: -0.05
    });

    if (this.positionText) {
      this.positionTitle = new Title({
        gl: this.gl,
        plane: this.plane,
        renderer: this.renderer,
        text: this.positionText,
        textColor: '#eab308', // Yellow color for position
        font: this.font,
        yOffsetMultiplier: 1,
        yPadding: 0.02,
        sizeMultiplier: 1.6 // Make position text even larger
      });
    }
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }

    const d = Math.abs(this.plane.position.x);
    const centerFade = Math.min(1.0, d / 0.5); // Fades out when within 0.5 units of center
    
    if (this.title && this.title.mesh) {
        this.title.mesh.program.uniforms.uAlpha.value = centerFade;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (750 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (550 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      imageBgColor = '#FDF6E3',
      scrollSpeed = 2,
      scrollEase = 0.05
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font, imageBgColor);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 15,
      widthSegments: 30
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font, imageBgColor) {
    const defaultItems = [
      { image: 'https://picsum.photos/seed/m1/800/600?grayscale', position: 'นายกสโมสรนักศึกษา', name: 'นายภูธเนศ เปรมปรีดิ์', major: 'เทคโนโลยีสารสนเทศ', year: 'ชั้นปีที่ 3' },
      { image: 'https://picsum.photos/seed/m2/800/600?grayscale', position: 'รองนายกสโมสรนักศึกษา', name: 'นางสาวสมหญิง ใจดี', major: 'วิทยาการคอมพิวเตอร์', year: 'ชั้นปีที่ 3' },
      { image: 'https://picsum.photos/seed/m3/800/600?grayscale', position: 'เลขานุการ', name: 'นายรักดี เรียนเก่ง', major: 'คณิตศาสตร์ประยุกต์', year: 'ชั้นปีที่ 2' },
      { image: 'https://picsum.photos/seed/m4/800/600?grayscale', position: 'เหรัญญิก', name: 'นางสาวนับเงิน ทองมาก', major: 'เทคโนโลยีสารสนเทศ', year: 'ชั้นปีที่ 2' },
      { image: 'https://picsum.photos/seed/m5/800/600?grayscale', position: 'ฝ่ายกิจกรรม', name: 'นายสายเที่ยว ชอบลุย', major: 'วิทยาศาสตร์สิ่งแวดล้อม', year: 'ชั้นปีที่ 2' },
      { image: 'https://picsum.photos/seed/m6/800/600?grayscale', position: 'ฝ่ายประชาสัมพันธ์', name: 'นางสาวพูดเก่ง เสียงใส', major: 'เทคโนโลยีการสื่อสาร', year: 'ชั้นปีที่ 2' },
    ];
    const galleryItems = items && items.length > 0 ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      let nickname = data.nickname || '';
      let major = data.major || '';
      
      // Auto-detect if major is being used as a nickname (short, no year)
      if (!nickname && major && major.length < 20 && !data.year && !major.includes('วิทยา')) {
        nickname = major;
        major = '';
      }

      const hasMajorOrYear = major || data.year;
      const majorYearText = hasMajorOrYear ? `\n${major} ${data.year || ''}`.trimEnd() : '';
      
      let displayText = data.name ? `${data.name}${majorYearText}` : data.text;
      if (nickname) {
        displayText = `${nickname}\n${displayText}`;
      }
      
      const displayPosition = data.position || null;
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: displayText,
        positionText: displayPosition,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        imageBgColor
      });
    });
  };
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.scroll.target += this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.scroll.target -= this.scrollSpeed * 5;
        this.onCheckDebounce();
        break;

      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheckDebounce();
        break;

      default:
        break;
    }
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    
    let closestIndex = 0;
    let minD = Infinity;

    if (this.medias) {
      this.medias.forEach(media => {
        media.update(this.scroll, direction);
        const d = Math.abs(media.plane.position.x);
        if (d < minD) {
          minD = d;
          closestIndex = media.index;
        }
      });
    }

    if (this.onActiveChange && this.lastClosestIndex !== closestIndex) {
      this.lastClosestIndex = closestIndex;
      this.onActiveChange(closestIndex % (this.mediasImages ? this.mediasImages.length / 2 : 1));
    }
    
    if (this.onCenterProgress) {
      const progress = Math.max(0, 1.0 - (minD / 0.5));
      this.onCenterProgress(progress);
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);

    window.addEventListener('resize', this.boundOnResize);
    
    // Attach start events to container so it only activates when interacting with the gallery
    this.container.addEventListener('mousewheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('mousedown', this.boundOnTouchDown, { passive: true });
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });

    // Attach move/up events to window for smooth dragging outside bounds
    window.addEventListener('mousemove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('mouseup', this.boundOnTouchUp, { passive: true });
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    window.addEventListener('touchend', this.boundOnTouchUp, { passive: true });

    this.container?.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    
    if (this.container) {
      this.container.removeEventListener('mousewheel', this.boundOnWheel);
      this.container.removeEventListener('wheel', this.boundOnWheel);
      this.container.removeEventListener('mousedown', this.boundOnTouchDown);
      this.container.removeEventListener('touchstart', this.boundOnTouchDown);
      this.container.removeEventListener('keydown', this.boundOnKeyDown);
    }
    
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }

    if (this.container) {
      this.container.removeEventListener('keydown', this.boundOnKeyDown);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  fontUrl,
  imageBgColor = '#FDF6E3',
  scrollSpeed = 2,
  scrollEase = 0.05
}) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    let app;
    let isMounted = true;
    resolveFont(font, fontUrl).then(resolvedFont => {
      if (!isMounted || !containerRef.current) return;
      app = new App(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font: resolvedFont,
        imageBgColor,
        scrollSpeed,
        scrollEase
      });
      app.onActiveChange = (idx) => {
        setActiveIndex(idx);
      };
      app.onCenterProgress = (progress) => {
        if (overlayRef.current) {
          overlayRef.current.style.opacity = progress;
        }
      };
    });

    return () => {
      isMounted = false;
      if (app) app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, fontUrl, imageBgColor, scrollSpeed, scrollEase]);

  const activeItem = items && items.length > 0 ? items[activeIndex] : null;

  return (
    <div className="relative w-full h-full">
      <div
        className="circular-gallery w-full h-full"
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Circular image gallery. Use left and right arrow keys to navigate."
      />
      
      <div 
        ref={overlayRef}
        className="absolute left-1/2 top-[76%] md:top-[80%] -translate-x-1/2 pointer-events-none flex flex-col items-center justify-center text-center w-[120%]"
        style={{ opacity: 0 }}
      >
        {activeItem && (
          <>
            {activeItem.nickname && (
              <ShinyText 
                text={activeItem.nickname} 
                speed={3} 
                className="text-2xl md:text-3xl font-bold mb-1" 
                color="#ffffff" 
                shineColor="#eab308" 
              />
            )}
            <ShinyText 
              text={activeItem.name || activeItem.text} 
              speed={3} 
              className="text-lg md:text-2xl font-bold" 
              color="#ffffff" 
              shineColor="#eab308" 
            />
            {(activeItem.major || activeItem.year) && (
              <ShinyText 
                text={`${activeItem.major || ''} ${activeItem.year || ''}`.trim()} 
                speed={3} 
                className="text-xs md:text-sm font-normal mt-1 opacity-80" 
                color="#ffffff" 
                shineColor="#eab308" 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { cardPhotos } from '../data/photos';
import { flowers } from '../data/flowers';

const C = {
  cover:     'linear-gradient(145deg,#D6336C 0%,#E91E63 45%,#AD1457 100%)',
  coverText: '#FFF0F5',
  pageBg:    '#FFF8F5',
  title:     '#E91E63',
  body:      '#2D1B2E',
  muted:     '#7A5A7B',
  gold:      '#D4AF37',
};

const TILTS = ['-4deg','2.5deg','-2deg','3deg','-1.5deg','2deg'];

// ─── Gift box popup (full-screen, matches screenshot style) ───────────────────
function GiftBoxVisual({ opening }) {
  return (
    <>
      <style>{`
        @keyframes giftFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes lidFly {
          0%   { transform: translateY(0px) rotate(0deg);   opacity:1; }
          100% { transform: translateY(-160px) rotate(-35deg); opacity:0; }
        }
        .gift-wrap { animation: giftFloat 3.2s ease-in-out infinite; }
        .gift-wrap.opening .gift-lid-top { animation: lidFly 0.9s ease-in forwards !important; }
      `}</style>

      <div className={`gift-wrap${opening ? ' opening' : ''}`}
        style={{ position:'relative', width:220, height:240, filter:'drop-shadow(0 24px 48px rgba(0,0,0,0.55))' }}>

        {/* ── Lid ── */}
        <div className="gift-lid-top" style={{
          position:'absolute', left:-12, top:-55, width:244, height:68,
          background:'#FAF6EF',
          backgroundImage:'radial-gradient(circle, #8fa5c0 2.5px, transparent 2.5px)',
          backgroundSize:'18px 18px',
          borderRadius:6, zIndex:5,
        }}>
          {/* Lid H-ribbon */}
          <div style={{ position:'absolute', top:'50%', left:0, width:'100%', height:22, background:'#C41E3A', transform:'translateY(-50%)', zIndex:6 }} />
          {/* Lid V-ribbon */}
          <div style={{ position:'absolute', left:'50%', top:0, width:22, height:'100%', background:'#C41E3A', transform:'translateX(-50%)', zIndex:6 }} />

          {/* Bow — left loop */}
          <div style={{
            position:'absolute', left:'50%', top:-28,
            width:58, height:40, background:'#C41E3A',
            borderRadius:'50% 50% 0 50%',
            transform:'translateX(-90%) rotate(-28deg)', zIndex:8,
          }} />
          {/* Bow — right loop */}
          <div style={{
            position:'absolute', left:'50%', top:-28,
            width:58, height:40, background:'#C41E3A',
            borderRadius:'50% 50% 50% 0',
            transform:'translateX(30%) rotate(28deg)', zIndex:8,
          }} />
          {/* Bow — center knot */}
          <div style={{
            position:'absolute', left:'50%', top:-8,
            width:30, height:24, background:'#9B1527',
            borderRadius:'50%',
            transform:'translateX(-50%)', zIndex:9,
          }} />
          {/* Ribbon tails dangling */}
          <div style={{ position:'absolute', left:'50%', top:20, width:18, height:28, background:'#C41E3A', transform:'translateX(-125%) rotate(-12deg)', borderRadius:'0 0 6px 6px', zIndex:7 }} />
          <div style={{ position:'absolute', left:'50%', top:20, width:18, height:28, background:'#C41E3A', transform:'translateX(25%) rotate(12deg)', borderRadius:'0 0 6px 6px', zIndex:7 }} />
        </div>

        {/* ── Box body ── */}
        <div style={{
          position:'absolute', left:0, top:22, width:220, height:190,
          background:'#FAF6EF',
          backgroundImage:'radial-gradient(circle, #8fa5c0 2.5px, transparent 2.5px)',
          backgroundSize:'18px 18px',
          borderRadius:6, zIndex:2,
          boxShadow:'inset 0 -6px 20px rgba(0,0,0,0.08)',
        }}>
          {/* Body H-ribbon */}
          <div style={{ position:'absolute', top:'42%', left:0, width:'100%', height:24, background:'#C41E3A', transform:'translateY(-50%)', zIndex:3 }} />
          {/* Body V-ribbon */}
          <div style={{ position:'absolute', left:'50%', top:0, width:24, height:'100%', background:'#C41E3A', transform:'translateX(-50%)', zIndex:3 }} />
        </div>

        {/* Bottom shadow disc */}
        <div style={{
          position:'absolute', bottom:-18, left:'50%', transform:'translateX(-50%)',
          width:180, height:16,
          background:'rgba(0,0,0,0.35)',
          borderRadius:'50%', filter:'blur(10px)', zIndex:1,
        }} />
      </div>
    </>
  );
}

function GiftBoxPopup({ onOpen }) {
  const [opening, setOpening]   = useState(false);
  const [bursting, setBursting] = useState(false);
  const [wiggling, setWiggling] = useState(false);

  // Generate flower burst items once when bursting starts
  const burstItems = useMemo(() => {
    if (!bursting) return [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 768;
    const COUNT = isMobile ? 35 : 80;
    const items = Array.from({ length: COUNT }, (_, i) => {
      // 1. Bouquet Phase (The Dome shape from the screenshot)
      const heightRatio = Math.random();
      const bouquetY = -20 - (heightRatio * 200); 
      const maxWidth = 50 + Math.sin(heightRatio * Math.PI) * 120;
      const bouquetX = (Math.random() - 0.5) * 2 * maxWidth;
      
      // 2. Explosion Phase (Erupt outwards from the bouquet center)
      const angle = Math.atan2(bouquetY + 100, bouquetX); 
      // Force starts from 0 so the center doesn't become empty
      const force = Math.random() * 2.5;
      const apexX = bouquetX + Math.cos(angle) * (vw * 0.4) * force;
      const apexY = bouquetY + Math.sin(angle) * (vh * 0.4) * force;
      
      // 3. Falling phase
      const fallX = apexX + (Math.random() - 0.5) * 150;
      const fallY = vh * 0.7 + Math.random() * vh * 0.5;

      const size   = 80 + Math.random() * 80; 
      const rot    = (Math.random() - 0.5) * 360;
      const delay  = Math.random() * 0.2;
      const img    = flowers[i % flowers.length];
      
      return { id: i, img, bouquetX, bouquetY, apexX, apexY, fallX, fallY, size, rot, delay };
    });
    
    // Sort so top flowers are drawn first, bottom flowers last (in front)
    items.sort((a, b) => a.bouquetY - b.bouquetY);
    return items;
  }, [bursting]);

  const handleTap = () => {
    if (wiggling || opening) return;
    setWiggling(true);
    setTimeout(() => {
      setOpening(true);
      setTimeout(() => setBursting(true), 380);
      setTimeout(onOpen, 4200);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.7 }}
      onClick={!opening ? handleTap : undefined}
      style={{
        position:'absolute', inset:0,
        cursor: opening ? 'default' : 'pointer',
        background:'radial-gradient(ellipse at center, #E63E72 0%, #C2185B 60%, #7A0E33 100%)',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:28,
        paddingTop: '22vh',
        overflow:'hidden',
      }}
    >
      {/* Vignette */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)' }} />

      {/* Idle sparkles — hidden while bursting */}
      {!bursting && ['10%','88%','22%','78%','50%'].map((l, k) => (
        <motion.div key={k}
          animate={{ opacity:[0.3,1,0.3], scale:[0.8,1.2,0.8] }}
          transition={{ repeat:Infinity, duration:1.4+k*0.3, delay:k*0.2 }}
          style={{ position:'absolute', left:l, top:`${15+k*15}%`, fontSize:22, pointerEvents:'none', zIndex:5 }}
        >✨</motion.div>
      ))}

      {/* Hint text — hidden once tapped */}
      {!opening && (
        <motion.div
          animate={{ opacity:[0.7,1,0.7] }}
          transition={{ repeat:Infinity, duration:2 }}
          style={{ fontFamily:'Caveat, cursive', fontSize:20, color:'rgba(255,210,210,0.9)', letterSpacing:2, zIndex:10 }}
        >
          tap to open your gift 🎀
        </motion.div>
      )}

      {/* Gift box */}
      <motion.div
        initial={{ scale: 0 }}
        animate={
          bursting
            ? { opacity: [1, 1, 0], scale: [1, 1, 1.15] }
            : wiggling
            ? { scale: 1, opacity: 1, rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0], transition: { duration: 0.6 } }
            : { scale: [0, 1.2, 1], rotate: [0, -5, 5, 0], opacity: 1 }
        }
        transition={
          bursting 
            ? { duration: 1.2, times: [0, 0.6, 1], ease: "easeIn" }
            : { duration: 0.8, ease: "easeOut" }
        }
        style={{ zIndex:10 }}
      >
        <GiftBoxVisual opening={opening} />
      </motion.div>

      {/* "For Angeline" label */}
      <motion.div 
        animate={ bursting ? { opacity: [1, 1, 0] } : { opacity: 1 } }
        transition={{ duration: 1.2, times: [0, 0.6, 1], ease: "easeIn" }}
        style={{
          fontFamily:"'Great Vibes', cursive", fontSize:36,
          color:'rgba(255,200,200,0.92)',
          textShadow:'0 0 20px rgba(255,100,100,0.5)',
          zIndex:10,
        }}
      >
        For Angeline
      </motion.div>

      {/* ── BOUQUET TO EXPLOSION BURST ── */}
      {burstItems.map(({ id, img, bouquetX, bouquetY, apexX, apexY, fallX, fallY, size, rot, delay }) => (
        <motion.img
          key={id}
          src={img}
          width={size}
          draggable={false}
          style={{
            position:'absolute',
            left:'50%', top:'50%',
            pointerEvents:'none',
            zIndex: 5, // Behind the box (zIndex:10)
          }}
          initial={{ x:'-50%', y:'calc(-50% + 80px)', scale:0.3, opacity:1, rotate:0 }}
          animate={{
            x:     ['-50%', `calc(-50% + ${bouquetX}px)`, `calc(-50% + ${apexX}px)`, `calc(-50% + ${fallX}px)`],
            y:     ['calc(-50% + 80px)', `calc(-50% + ${bouquetY}px)`, `calc(-50% + ${apexY}px)`, `calc(-50% + ${fallY}px)`],
            scale: [0.3, 1.0, 3.0, 1.2], 
            opacity: [1, 1, 1, 0],
            rotate: [0, rot * 0.5, rot * 2, rot * 2 + (Math.random() > 0.5 ? 1 : -1) * 200],
          }}
          transition={{
            duration: 4.0,
            delay,
            times: [0, 0.2, 0.45, 1], // Form bouquet at 20%, erupt at 45%, fall completely by 100%
            ease: ['easeOut', 'easeInOut', 'easeIn'],
          }}
          onError={e => {
            const sz = size;
            const emojis = ['🌸','🌺','🌷','🌹','🌻','🌼','🪷'];
            const em = emojis[id % emojis.length];
            e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}"><text y="50%" x="50%" dominant-baseline="central" text-anchor="middle" font-size="${sz*0.8}">${em}</text></svg>`
            )}`;
          }}
        />
      ))}
    </motion.div>
  );
}

// ─── Page components ──────────────────────────────────────────────────────────
const Page = React.forwardRef(({ children, pageNum, style, ...rest }, ref) => (
  <div ref={ref} className="book-page" style={{
    ...style,
    width:'100%', height:'100%',
    background:'linear-gradient(180deg,#FFF8FA 0%,#FFEDF2 100%)',
    position:'relative', overflow:'hidden',
    padding:'28px 22px 20px', boxSizing:'border-box',
    display:'flex', flexDirection:'column', alignItems:'center',
  }} {...rest}>
    <div style={{
      position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
      background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.012) 2px,rgba(0,0,0,0.012) 4px)',
    }} />
    <div style={{ position:'relative', zIndex:1, width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
      {children}
    </div>
    {pageNum && (
      <div style={{ position:'absolute', bottom:10, right:14, fontFamily:'Inter, sans-serif', fontSize:11, color:C.muted, opacity:0.5, zIndex:2 }}>
        {pageNum}
      </div>
    )}
  </div>
));

const PageCover = React.forwardRef(({ children, style, ...rest }, ref) => (
  <div ref={ref} data-density="hard" className="book-page-cover" style={{
    ...style,
    width:'100%', height:'100%',
    background:'linear-gradient(145deg,#D6336C 0%,#E91E63 45%,#AD1457 100%)',
    overflow:'hidden', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    position:'relative', boxSizing:'border-box',
  }} {...rest}>
    <div style={{ position:'absolute', inset:14, border:'1px solid rgba(212,175,55,0.5)', borderRadius:6, pointerEvents:'none' }} />
    {children}
  </div>
));

function FrontCoverContent() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:'0 24px', textAlign:'center' }}>
      {[['top',22,'left',24],['top',22,'right',24],['bottom',22,'left',24],['bottom',22,'right',24]].map(([ta,tv,la,lv],k) => (
        <span key={k} style={{ position:'absolute', [ta]:tv, [la]:lv, fontSize:18, opacity:.35, color:C.coverText }}>❀</span>
      ))}
      <div style={{ fontSize:26, opacity:.7 }}>♥</div>
      <div style={{ fontFamily:'"Great Vibes", cursive', fontSize:'clamp(38px,9vw,56px)', color:C.coverText, lineHeight:1.15, textShadow:'0 2px 12px rgba(0,0,0,0.2)' }}>
        To Angeline
      </div>
      <div style={{ fontFamily:'Caveat, cursive', fontSize:20, fontStyle:'italic', color:C.coverText, opacity:.82 }}>
        open me 💕
      </div>
    </div>
  );
}

function BackCoverContent() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, textAlign:'center', padding:'0 24px' }}>
      <div style={{ fontSize:28 }}>✨</div>
      <div style={{ fontFamily:'Caveat, cursive', fontSize:22, fontStyle:'italic', color:C.coverText, opacity:.88, lineHeight:1.5 }}>
        have a wonderful day! 🎁
      </div>
    </div>
  );
}

function Page1Content() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, textAlign:'center', width:'100%' }}>
      <div style={{
        fontFamily:'"Great Vibes", cursive',
        fontSize:'clamp(34px,9vw,54px)', lineHeight:1.2,
        background:'linear-gradient(135deg,#FF1493 0%,#E91E63 50%,#FF6B9D 100%)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
      }}>
        Happy Birthday! 🎂
      </div>
      <div style={{ display:'flex', gap:6, fontSize:28 }}><span>✨</span><span>🎉</span></div>
      <div style={{ width:'55%', height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }} />
      <div style={{ fontFamily:'Caveat, cursive', fontSize:18, fontStyle:'italic', color:C.muted, lineHeight:1.55, textAlign:'center' }}>
        a little gift<br />just for you ✨
      </div>
    </div>
  );
}

function Page2Content() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:18, width:'100%', justifyContent:'center' }}>
      <div style={{
        background:'#fff', padding:'8px 8px 24px', borderRadius:4,
        boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
        transform:'rotate(-2deg)', position:'relative', width:'75%',
      }}>
        <div style={{
          position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
          width:'40%', height:14, background:'rgba(255,220,80,0.7)', borderRadius:3, zIndex:2,
        }} />
        <img src={cardPhotos[0]} alt=""
          style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block', borderRadius:2 }}
          onError={e => { e.target.style.background='#ffd0e8'; e.target.removeAttribute('src'); }}
        />
      </div>
      <div style={{ fontFamily:'Caveat, cursive', fontSize:21, fontStyle:'italic', color:C.body, textAlign:'center', lineHeight:1.4, padding:'0 10px' }}>
        Happy Birth Day ya Dedek Imoet!<br/>Semoga tahun ini penuh dengan hal-hal baik yessss ✨
      </div>
    </div>
  );
}

function Page3Content() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:18, width:'100%', justifyContent:'center' }}>
      <div style={{
        background:'#fff', padding:'8px 8px 24px', borderRadius:4,
        boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
        transform:'rotate(3deg)', position:'relative', width:'75%',
      }}>
        <div style={{
          position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
          width:'40%', height:14, background:'rgba(255,220,80,0.7)', borderRadius:3, zIndex:2,
        }} />
        <img src={cardPhotos[1]} alt=""
          style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block', borderRadius:2 }}
          onError={e => { e.target.style.background='#ffd0e8'; e.target.removeAttribute('src'); }}
        />
      </div>
      <div style={{ fontFamily:'Caveat, cursive', fontSize:21, fontStyle:'italic', color:C.body, textAlign:'center', lineHeight:1.4, padding:'0 10px' }}>
        Walaupun nggak bisa ngerayain bareng secara langsung...
      </div>
    </div>
  );
}

function Page4Content({ onDone }) {
  return (
    <div
      onClick={onDone}
      style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:22, width:'100%', cursor:'pointer' }}
    >
      <div 
        onPointerDown={e => e.stopPropagation()} 
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        style={{ position: 'absolute', right: -22, top: 0, bottom: 0, width: 60, zIndex: 100 }} 
      />
      <div style={{ fontSize:32, color:C.title, opacity:.5 }}>✨</div>
      <div style={{ fontFamily:'"Great Vibes", cursive', fontSize:'clamp(28px,8vw,44px)', color:C.title, textAlign:'center', lineHeight:1.3 }}>
        Wishing you the best!
      </div>
      <div style={{ fontFamily:'Caveat, cursive', fontSize:19, fontStyle:'italic', color:C.muted, textAlign:'center', lineHeight:1.5, maxWidth:240 }}>
        Semoga semua impian dan harapan lu tahun ini bisa tercapai ya! jangan malas malas terus, belajar woi 🥳
      </div>
      <div style={{ marginTop:16, fontFamily:'Inter, sans-serif', fontSize:12, color:C.muted, opacity:.6, letterSpacing:1 }}>
        tap to open your gift ✨
      </div>
    </div>
  );
}

function StarryDots() {
  const stars = useMemo(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id:i, left:`${(i*41+13)%100}%`, top:`${(i*57+9)%100}%`,
      size:1+(i%3), delay:`${(i*0.19)%3}s`, dur:`${1.6+(i%5)*0.45}s`,
    })), []);
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:'absolute', left:s.left, top:s.top,
          width:s.size, height:s.size, borderRadius:'50%', background:'#fff',
          animation:`twkl ${s.dur} ${s.delay} ease-in-out infinite alternate`,
        }} />
      ))}
      <style>{`@keyframes twkl { from { opacity:0.12; } to { opacity:0.82; } }`}</style>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Act4Card({ onNext }) {
  const bookRef = useRef();
  const [bookDone, setBookDone] = useState(false);

  const bookW = 330;
  const bookH = 460;
  // Calculate scale so the 2-page spread (660px) fits on mobile screens
  const scaleFactor = Math.min(1, (window.innerWidth - 16) / (bookW * 2));

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{
        position:'absolute', inset:0,
        background:'linear-gradient(180deg,#0d0221 0%,#1a0533 100%)',
        display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
      }}
    >
      <StarryDots />

      {/* Book — fades out when bookDone */}
      <AnimatePresence>
        {!bookDone && (
          <motion.div
            key="book"
            initial={{ opacity:1 }}
            exit={{ opacity:0, scale:0.88, transition:{ duration:0.65 } }}
            style={{ position:'relative', zIndex:5 }}
          >
            <div style={{
              position:'absolute', bottom:'100%', left:0, right:0, marginBottom: 20,
              textAlign:'center', zIndex:10, pointerEvents:'none',
              fontFamily:'Caveat, cursive', fontSize:18, color:'rgba(255,255,255,0.55)',
              whiteSpace:'nowrap',
            }}>
              ✨ drag the page corner to turn ✨
            </div>

            <div style={{
              marginTop: 48 * scaleFactor,
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'center top',
              filter: 'drop-shadow(0 20px 40px rgba(255,20,147,0.35))',
            }}>
              <HTMLFlipBook
                ref={bookRef}
                width={bookW} height={bookH}
                size="fixed"
                minWidth={260} maxWidth={400}
                minHeight={360} maxHeight={540}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                drawShadow={true}
                flippingTime={800}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                startPage={0}
                className="love-book"
                style={{}}
              >
                <PageCover><FrontCoverContent /></PageCover>
                <Page pageNum="1"><Page1Content /></Page>
                <Page pageNum="2"><Page2Content /></Page>
                <Page pageNum="3"><Page3Content /></Page>
                <Page pageNum="4"><Page4Content onDone={() => setBookDone(true)} /></Page>
                <PageCover><BackCoverContent /></PageCover>
              </HTMLFlipBook>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift box popup — appears after book fades out */}
      <AnimatePresence>
        {bookDone && <GiftBoxPopup key="gift" onOpen={onNext} />}
      </AnimatePresence>
    </motion.div>
  );
}

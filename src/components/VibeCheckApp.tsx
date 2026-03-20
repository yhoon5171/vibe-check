'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';

export default function VibeCheckApp() {
  const { lang, setLang, t } = useLanguage();
  const [step, setStep] = useState<'language' | 'landing' | 'quiz' | 'calculating' | 'result'>('language');
  
  // Quiz state
  const [currentQ, setCurrentQ] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  
  // Result state
  const [resultId, setResultId] = useState<string | null>(null);
  const [friendResult, setFriendResult] = useState<string | null>(null);
  const [adTimer, setAdTimer] = useState(3);

  const [visitorCount, setVisitorCount] = useState(() => {
    const base = 8421093;
    const now = new Date();
    const extra = Math.floor((now.getTime() - new Date('2024-01-01').getTime()) / 10000); 
    return base + extra; // Grows over time organically even across refreshes
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'language' || step === 'landing') {
      interval = setInterval(() => setVisitorCount(p => p + Math.floor(Math.random() * 3) + 1), 3200);
    }
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step === 'calculating' && adTimer > 0) {
      const timerId = setTimeout(() => setAdTimer(adTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [step, adTimer]);

  useEffect(() => {
    // Check URL parameters for shared results
    const params = new URLSearchParams(window.location.search);
    const sharedRes = params.get('res');
    if (sharedRes) {
      setFriendResult(sharedRes);
      // We do not jump to 'result' anymore. They must choose language, navigate to landing, and take test!
    }
    
    // Load Kakao SDK for Official KakaoTalk Link Sharing
    if (typeof window !== 'undefined' && !(window as any).Kakao) {
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.async = true;
      script.onload = () => {
        try {
          if (!(window as any).Kakao.isInitialized()) {
            (window as any).Kakao.init('REPLACE_WITH_YOUR_KAKAO_KEY'); // Requires actual API key
          }
        } catch(e) {}
      };
      document.head.appendChild(script);
    }
  }, []);

  const startQuiz = () => {
    setStep('quiz');
  };

  const handleAnswer = (val: number) => {
    const newAnswers = [...answers, val];
    
    if (currentQ < 12) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      setStep('calculating');
      let E = 0, I = 0, N = 0, S = 0, F = 0, T = 0, P = 0, J = 0;
      newAnswers[0] === 1 ? E++ : I++; newAnswers[8] === 1 ? E++ : I++; newAnswers[11] === 1 ? E++ : I++;
      newAnswers[4] === 1 ? N++ : S++; newAnswers[9] === 1 ? N++ : S++; newAnswers[10] === 1 ? N++ : S++;
      newAnswers[2] === 1 ? F++ : T++; newAnswers[3] === 1 ? T++ : F++; newAnswers[6] === 1 ? F++ : T++;
      newAnswers[1] === 1 ? P++ : J++; newAnswers[5] === 1 ? P++ : J++; newAnswers[7] === 1 ? P++ : J++;
      
      const mbti = `${E > I ? 'E' : 'I'}${N > S ? 'N' : 'S'}${T > F ? 'T' : 'F'}${J > P ? 'J' : 'P'}`;
      const auraMap: Record<string, string> = {
        ESTP: 'crimson', ESTJ: 'white', ESFP: 'teal', ESFJ: 'gold',
        ENTP: 'pink', ENTJ: 'red', ENFP: 'orange', ENFJ: 'magenta',
        ISTP: 'cyan', ISTJ: 'silver', ISFP: 'yellow', ISFJ: 'green',
        INTP: 'purple', INTJ: 'black', INFP: 'blue', INFJ: 'indigo'
      };
      let type = auraMap[mbti] || 'red';

      setResultId(btoa(type));
      setAdTimer(3); // Start 3-second explicit UI countdown
    }
  };

  return (
    <div className="flex-center" style={{ width: '100%' }}>
      
      {/* Language Switcher Overlay */}
      {step !== 'language' && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
          {(['en', 'ko', 'ja', 'zh'] as Language[]).map(l => (
            <button 
              key={l} 
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className="glass-panel flex-center" style={{ maxWidth: '600px', width: '100%', minHeight: '400px' }}>
        
        {step === 'language' && (
          <div className="flex-center" style={{ gap: '2rem', width: '100%', animation: 'fadeIn 0.5s' }}>
            <div style={{ width: '80px', height: '80px', background: 'radial-gradient(circle, var(--brand-neon), transparent)', opacity: 0.8, borderRadius: '50%', margin: '1rem 0', animation: 'spin 4s linear infinite', border: '2px dashed rgba(255,255,255,0.2)' }}></div>
            <h1 className="title-glow" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1rem' }}>Choose Your Language</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '350px' }}>
              <button className="btn-secondary" onClick={() => { setLang('en'); setStep('landing'); }} style={{ padding: '1rem', fontSize: '1.1rem' }}>English</button>
              <button className="btn-secondary" onClick={() => { setLang('ko'); setStep('landing'); }} style={{ padding: '1rem', fontSize: '1.1rem' }}>한국어</button>
              <button className="btn-secondary" onClick={() => { setLang('ja'); setStep('landing'); }} style={{ padding: '1rem', fontSize: '1.1rem' }}>日本語</button>
              <button className="btn-secondary" onClick={() => { setLang('zh'); setStep('landing'); }} style={{ padding: '1rem', fontSize: '1.1rem' }}>中文</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem' }}>Cosmic Aura & Vibe Check ✨</p>
          </div>
        )}

        {step === 'landing' && (() => {
          let friendName = '';
          let friendColor = 'var(--glass-border)';
          if (friendResult) {
            let fType = 'red';
            try { fType = atob(friendResult) || 'red'; } catch(e) {}
            const resObj = typeof t(`results.types.${fType}.name`) === 'string' ? fType : 'red';
            friendName = t(`results.types.${resObj}.name`);
            friendColor = t(`results.types.${resObj}.color`);
          }

          return (
          <div className="flex-center" style={{ gap: '1.5rem', width: '100%', animation: 'fadeIn 0.5s' }}>
            <h1 className="title-glow">{t('landing.title')}</h1>
            
            {friendResult ? (
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.6)', borderRadius: '16px', border: `1px solid ${friendColor}`, textAlign: 'center', width: '100%', animation: 'pulse 2s infinite' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>You were challenged! Friend's Aura:</p>
                <p style={{ color: friendColor, fontSize: '1.3rem', fontWeight: 'bold' }}>{friendName}</p>
                <p style={{ color: '#fff', fontSize: '1rem', marginTop: '0.5rem' }}>Find out your Aura & Compare Match %!</p>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                {t('landing.subtitle')}
              </p>
            )}

            <div style={{ width: '100%', height: friendResult ? '150px' : '200px', background: `radial-gradient(circle, ${friendResult ? friendColor : 'var(--brand-neon)'}, transparent)`, opacity: 0.5, borderRadius: '50%', margin: '1rem 0' }}></div>
            
            <p style={{ color: 'var(--brand-neon)', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 600, animation: 'pulse 2s infinite' }}>
              🔥 {visitorCount.toLocaleString()} {lang === 'ko' ? '명이 자신의 오라를 확인했습니다!' : lang === 'ja' ? '人がオーラを確認しました！' : lang === 'zh' ? '人已确认了自己的光环！' : 'vibes checked globally'}
            </p>

            <button className="btn-cosmic" onClick={startQuiz}>
              {friendResult ? 'Start Vibe Check & Compare' : t('landing.startBtn')}
            </button>

            {!friendResult && (
              <button className="btn-secondary" onClick={() => { alert('Take the test first, then share your link with friends to compare!'); }}>
                {t('landing.compareBtn')}
              </button>
            )}
          </div>
          );
        })()}

        {step === 'quiz' && (
          <div key={currentQ} className="flex-center" style={{ gap: '2rem', width: '100%', animation: 'fadeIn 0.5s' }}>
            <h2 style={{ fontSize: 'var(--font-h2)', textAlign: 'center', color: 'var(--brand-glow)' }}>
              {currentQ}/12
            </h2>
            <p style={{ fontSize: 'var(--font-body)', textAlign: 'center', margin: '2rem 0', minHeight: '3rem' }}>
              {t(`questions.q${currentQ}.text`)}
            </p>
            <button className="btn-secondary" onClick={() => handleAnswer(1)} style={{ padding: '1.5rem' }}>
              {t(`questions.q${currentQ}.a`)}
            </button>
            <button className="btn-secondary" onClick={() => handleAnswer(2)} style={{ padding: '1.5rem' }}>
              {t(`questions.q${currentQ}.b`)}
            </button>
          </div>
        )}

        {step === 'calculating' && (
          <div className="flex-center" style={{ gap: '1.5rem', width: '100%', animation: 'fadeIn 0.5s' }}>
            <h2 className="title-glow" style={{ fontSize: '1.6rem', textAlign: 'center' }}>
              {lang === 'ko' ? '우주적 오라를 분석하고 있습니다...' : lang === 'ja' ? '宇宙的オーラを分析中...' : lang === 'zh' ? '正在分析宇宙光环...' : 'Analyzing Cosmic Signature...'}
            </h2>
            
            {/* AdSense Interstitial Placeholder */}
            <div style={{ width: '100%', height: '280px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', marginTop: '0.5rem', borderRadius: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '10px', left: '15px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Advertisement</span>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>[ Google AdSense Slot ]</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Full-width interstitial ad loads here</p>
              </div>
            </div>

            <div style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button 
                className={adTimer === 0 ? "btn-cosmic" : "btn-secondary"}
                disabled={adTimer > 0}
                onClick={() => setStep('result')}
                style={{ 
                  width: '100%', 
                  padding: '1rem 0.5rem', 
                  fontSize: lang === 'ko' ? '0.95rem' : '1rem',
                  whiteSpace: 'nowrap',
                  opacity: adTimer > 0 ? 0.5 : 1,
                  cursor: adTimer > 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  border: adTimer === 0 ? '1px solid var(--brand-neon)' : '1px solid var(--glass-border)'
                }}
              >
                {adTimer > 0 
                  ? (lang === 'ko' ? `🔒 ${adTimer}초 후 결과 확인 가능...` : lang === 'ja' ? `🔒 ${adTimer}秒後に結果表示...` : lang === 'zh' ? `🔒 ${adTimer}秒后查看结果...` : `🔒 Unlocking Result in ${adTimer}s...`) 
                  : (lang === 'ko' ? '✨ 내 오라 결과 확인하기 ✨' : lang === 'ja' ? '✨ オーラ結果を見る ✨' : lang === 'zh' ? '✨ 查看我的光环结果 ✨' : '✨ View My Aura Result ✨')}
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (() => {
          let type = 'red';
          try { type = atob(resultId || '') || 'red'; } catch(e) {}
          const resObj = typeof t(`results.types.${type}.name`) === 'string' ? type : 'red';
          const rName = t(`results.types.${resObj}.name`);
          const rMeme = t(`results.types.${resObj}.meme`);
          const rMatch = t(`results.types.${resObj}.match`);
          const rRarity = t(`results.types.${resObj}.rarity`);
          const rColor = t(`results.types.${resObj}.color`);

          return (
          <div className="flex-center" style={{ gap: '1.5rem', width: '100%', animation: 'fadeIn 0.5s' }}>
            <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid gold', color: 'gold', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              {t('results.rarity', rRarity)} 
            </div>
            <div style={{ width: '150px', height: '150px', background: `radial-gradient(circle, ${rColor}, #050510)`, borderRadius: '50%', margin: '1rem 0', boxShadow: `0 0 50px ${rColor}` }}></div>
            <h1 className="title-glow" style={{ color: rColor, fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: `0px 4px 20px ${rColor}80` }}>{rName}</h1>
            <p style={{ color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, padding: '0 1rem' }}>
              {rMeme}
            </p>
            
            <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', margin: '1rem 0' }}></div>
            
            {/* Live Friend Compare Logic */}
            {friendResult && (() => {
              let fType = 'red';
              try { fType = atob(friendResult) || 'red'; } catch(e) {}
              const fObj = typeof t(`results.types.${fType}.name`) === 'string' ? fType : 'red';
              const friendTitle = t(`results.types.${fObj}.name`);
              const friendCol = t(`results.types.${fObj}.color`);
              
              // simple deterministic match %
              let hash1 = 0; for(let i=0; i<resObj.length; i++) hash1 += resObj.charCodeAt(i);
              let hash2 = 0; for(let i=0; i<fObj.length; i++) hash2 += fObj.charCodeAt(i);
              const score = resObj === fObj ? 100 : 50 + ((hash1 * hash2) % 49);

              return (
                <div style={{ padding: '1.2rem', background: `linear-gradient(135deg, rgba(0,0,0,0.8), ${friendCol}30)`, borderRadius: '16px', width: '100%', textAlign: 'center', border: `2px solid ${friendCol}`, animation: 'fadeIn 1s', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem' }}>Compatibility with Friend</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: friendCol, textShadow: `0 0 10px ${friendCol}` }}>{score}% Vibe Match!</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{rName} ✖️ {friendTitle}</p>
                </div>
              );
            })()}

            {/* Social Match Logic */}
            <div style={{ padding: '1.2rem', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', width: '100%', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t('results.matchLabel')}</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: type === 'blue' || type === 'black' ? '#ff4081' : '#00e5ff' }}>{rMatch}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
              <button className="btn-cosmic" onClick={async () => {
                const url = new URL(window.location.href);
                url.searchParams.set('res', resultId || '');
                const finalUrl = url.toString();
                const shareData = { title: 'Cosmic Aura & Vibe Check', text: 'Check out my Cosmic Aura! Who matches my vibe?', url: finalUrl };
                try { if (navigator.share) { await navigator.share(shareData); } else { navigator.clipboard.writeText(finalUrl); alert('Copied to clipboard!'); } } catch(e) {}
              }} style={{ margin: '0 auto', background: `linear-gradient(45deg, ${rColor}, #050510)` }}>
                {t('results.matchBtn')}
              </button>

              {/* Direct App Share Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem', maxWidth: '300px' }}>
                {/* Twitter / X */}
                <button title="Share on Twitter/X" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(rName + ' 🌌')}&url=${encodeURIComponent(u.toString())}`); }} style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                {/* FB */}
                <button title="Share on Facebook" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u.toString())}`); }} style={{ background: '#1877F2', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </button>
                {/* Telegram */}
                <button title="Share on Telegram" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); window.open(`https://t.me/share/url?url=${encodeURIComponent(u.toString())}&text=${encodeURIComponent('Cosmic Aura Check!')}`); }} style={{ background: '#229ED9', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.543 2.904l-18.08 6.94a1.22 1.22 0 0 0-.056 2.29l4.595 1.54a1.22 1.22 0 0 0 1.34-.33l7.984-8.08c.19-.19.467.09.28.29l-6.84 6.72a1.22 1.22 0 0 0-.25 1.48l2.97 5.48a1.22 1.22 0 0 0 2.2-.26l5.72-15.02a1.22 1.22 0 0 0-1.63-1.46z"/></svg>
                </button>
                {/* WhatsApp */}
                <button title="Share on WhatsApp" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(rName + ' 🌌 ' + u.toString())}`); }} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.405-.883-.733-1.48-1.638-1.653-1.935-.173-.299-.018-.461.13-.61.133-.134.297-.348.446-.522.148-.173.197-.297.297-.497.101-.199.051-.373-.023-.522-.075-.15-.67-1.613-.918-2.209-.241-.58-.485-.67-.51-.173-.008-.371-.008-.57-.008s-.522.074-.795.372c-.273.298-1.041 1.018-1.041 2.483s1.066 2.88 1.214 3.078c.148.199 2.096 3.193 5.075 4.478.711.336 1.266.537 1.696.688.71.304 1.356.26 1.868.158.577-.116 1.758-.718 2.006-1.41.248-.692.248-1.286.173-1.41-.073-.122-.27-.197-.568-.346z"/><path d="M12 21.055h-.005a8.966 8.966 0 0 1-4.57-1.25l-.328-.195-3.393.889.904-3.308-.214-.34A8.964 8.964 0 0 1 3.036 12C3.036 7.058 7.062 3.03 12.006 3.03 16.948 3.03 20.976 7.058 20.976 12S16.948 21.055 12 21.055z"/><path d="M12 1.055C5.937 1.055 1.012 5.98 1.012 12c0 1.942.507 3.834 1.474 5.503L1 23.5l6.634-1.74A10.974 10.974 0 0 0 12 23.01c6.064 0 10.99-4.925 10.99-10.99 0-6.065-4.926-10.965-10.99-10.965z"/></svg>
                </button>
                {/* LINE */}
                <button title="Share on LINE" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); window.open(`https://line.me/R/msg/text/?${encodeURIComponent(rName + ' ✨ ' + u.toString())}`); }} style={{ background: '#06C755', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 10.3c0-4.4-4.2-8-9.3-8S5.3 5.9 5.3 10.3c0 4 .3 7.2 7.8 7.9.6.1 1.4.3 1.6.8.2.5.1 1.3 0 1.9l-.3 1.7c-.1.5-.4 2.1 1.7 1.2 2.1-.9 11.6-6.8 11.6-13.5zm-15.1 3h-2.5c-.3 0-.6-.3-.6-.6V7.4c0-.3.3-.6.6-.6h2.5c.3 0 .6.3.6.6v4.6c0 .4-.3.7-.6.7zm5.5-1.5h-1.6v-3h1.6c.3 0 .6-.3.6-.6s-.3-.6-.6-.6H12c-.3 0-.6.3-.6.6v5.2c0 .3.3.6.6.6h2.4c.3 0 .6-.3.6-.6s-.3-.6-.6-.6zm3.3.9L16 9.8V12.7c0 .3-.3.6-.6.6s-.6-.3-.6-.6V7.4c0-.3.3-.6.6-.6.2 0 .4.1.5.3L17.7 9.8V7.4c0-.3.3-.6.6-.6s.6.3.6.6v5.2c0 .3-.3.6-.6.6-.2.1-.4 0-.6-.2z"/></svg>
                </button>
                {/* Kakao */}
                <button title="Share on KakaoTalk" onClick={() => { 
                  const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); 
                  const finalUrl = u.toString();
                  if ((window as any).Kakao && (window as any).Kakao.isInitialized()) {
                    (window as any).Kakao.Share.sendDefault({
                      objectType: 'feed',
                      content: {
                        title: '우주적 오라 & 바이브 테스트',
                        description: `나의 오라 결과는 [${rName}]! 내 오라를 확인하고 나와의 궁합 매치(%)를 확인해보세요!`,
                        imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
                        link: { mobileWebUrl: finalUrl, webUrl: finalUrl },
                      },
                      buttons: [{ title: '내 오라 테스트 알아보기', link: { mobileWebUrl: finalUrl, webUrl: finalUrl } }]
                    });
                  } else {
                    alert('카카오톡 공식 링크 공유를 위해서는 카카오 개발자 API 키 등록이 필요합니다! (임시로 링크 복사됨)');
                    navigator.clipboard.writeText(finalUrl);
                  }
                }} style={{ background: '#FEE500', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-5.52 0-10 3.58-10 8 0 2.86 1.87 5.38 4.67 6.81l-1.35 4.92c-.08.3.26.57.53.42l5.77-3.83c.45.04.9.06 1.38.06 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>
                </button>
                {/* Weibo */}
                <button title="Share on Weibo" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(u.toString())}&title=${encodeURIComponent('Cosmic Aura Test!')}`); }} style={{ background: '#DF2029', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10.15 15.4c-2.43.3-4.66-.54-4.96-1.87-.28-1.25 1.48-2.5 3.96-2.8 2.45-.3 4.67.55 4.95 1.83.28 1.25-1.48 2.5-3.95 2.84zm6.54-3.56c-.36-.08-.54-.15-.4-.54.2-.6.28-1.12.18-1.46-.3-.9-1.63-1.04-3.08-.7l.38-1.2c0-.03-.02-.04-.04-.04h-.05l-.1.03c-2.3.88-5.32 3.12-6.52 5-.66.97-1.12 2-1.18 3.03-.1 1.94 1.7 3.52 4.66 4.3 2.12.56 5.16.58 7.2-.3 3.65-1.56 4.74-4.57 3.58-6.17-.4-.53-1.1-1-2.22-1.34L19.4 13.9c.47-.2.9-.4 1.2-.67 1.3-1.07 1-2.8-.52-3.8-1.57-1.03-3.66-1.5-3.4-.64z"/></svg>
                </button>
                {/* WeChat */}
                <button title="Copy for WeChat" onClick={() => { const u=new URL(window.location.href); u.searchParams.set('res', resultId || ''); navigator.clipboard.writeText(u.toString()); alert('Link copied for WeChat! Open WeChat to paste and share.'); }} style={{ background: '#07C160', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 2.5C4.2 2.5 0 5.4 0 9.2c0 2.1 1.1 4.1 2.8 5.3L2 17l3-1.6c1.1.4 2.3.6 3.5.6 4.5 0 8.5-2.9 8.5-6.7S13.1 2.5 8.5 2.5zm7.5 6C15.7 8.5 15.4 8.5 15.1 8.6 16.3 9.9 17 11.6 17 13.5c0 3.8-3.6 6.8-8 6.8-.7 0-1.4-.1-2-.3l-.4-.1-3 1.6.8-2.6-.2-.3c-1.2-1.2-2-2.7-2-4.4 0-1-.2-1.9-.5-2.8 1.4 3.7 5.2 6.5 9.7 6.5 5.5 0 10-3.9 10-8.8 0-4-3.3-7.3-7.5-8.4.5-.4 1.2-.6 2-.6 4.4 0 8 3.1 8 7s-3.5 7-8 7c-1.3 0-2.4-.3-3.4-.7L8.5 23l1-2.8c-1.9-1.2-3-3.2-3-5.2 0-1.9.8-3.7 2-5 3.1 3 8 2.7 11-1.3l-3.5-5.2z"/></svg>
                </button>
              </div>
            </div>

            <button className="btn-secondary" style={{ margin: '0 auto' }} onClick={() => { 
                setCurrentQ(1);
                setAnswers([]);
                setStep('landing'); 
                window.history.pushState({}, '', '/'); 
            }}>
              Retake Test
            </button>
            
             <div style={{ width: '100%', height: '100px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', marginTop: '0.5rem', borderRadius: '12px', fontSize: '0.8rem' }}>
              AdSense Banner Area
            </div>
          </div>
          );
        })()}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

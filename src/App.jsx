import { useState, useEffect, useRef } from "react";

function useSize() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  return { mob: w < 680, tab: w >= 680 && w < 1060, desk: w >= 1060, w };
}
const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

/* ── STYLES ────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:#fff;color:#0a0a0a;font-family:'DM Sans',sans-serif;overflow-x:hidden}
    button{cursor:pointer;font-family:inherit;border:none;background:none}
    a{text-decoration:none;color:inherit}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}
    @keyframes float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-12px) rotate(var(--r,0deg))}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes pop{0%{transform:scale(.94)}100%{transform:scale(1)}}
    .rv{opacity:0;transform:translateY(28px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
    .rv.on{opacity:1;transform:translateY(0)}
    .tag-btn{border:2px solid #e8e8e8;border-radius:12px;background:#fff;transition:all .18s;cursor:pointer;padding:0}
    .tag-btn:hover{border-color:#0a0a0a;transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.1)}
    .tag-btn.sel{border-color:#0a0a0a;background:#0a0a0a}
    .qty-btn{width:40px;height:40px;border-radius:8px;border:1.5px solid #e8e8e8;background:#fff;font-size:20px;font-weight:300;color:#0a0a0a;transition:all .15s;display:flex;align-items:center;justify-content:center}
    .qty-btn:hover{border-color:#0a0a0a}
    .cta-dark{background:#0a0a0a;color:#fff;border-radius:10px;padding:14px 32px;font-family:'Outfit',sans-serif;font-weight:600;font-size:15px;transition:all .2s;border:none;cursor:pointer}
    .cta-dark:hover{background:#222;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
    .cta-outline{background:transparent;color:#0a0a0a;border:1.5px solid #0a0a0a;border-radius:10px;padding:13px 32px;font-family:'Outfit',sans-serif;font-weight:600;font-size:15px;transition:all .2s;cursor:pointer}
    .cta-outline:hover{background:#0a0a0a;color:#fff}
  `}</style>
);

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }), { threshold: 0.1 });
    const upd = () => document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    upd(); const mo = new MutationObserver(upd); mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mo.disconnect(); };
  }, []);
}

/* ── BRANDS ────────────────────────────────────────────────── */
const BRANDS = [
  { id: "instagram", name: "Instagram", color: "#E1306C", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { id: "tiktok", name: "TikTok", color: "#010101", bg: "#010101",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.82a8.18 8.18 0 004.77 1.52V6.89a4.85 4.85 0 01-1-.2z"/></svg> },
  { id: "x", name: "X", color: "#000", bg: "#000",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id: "facebook", name: "Facebook", color: "#1877F2", bg: "#1877F2",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id: "youtube", name: "YouTube", color: "#FF0000", bg: "#FF0000",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", bg: "#25D366",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  { id: "snapchat", name: "Snapchat", color: "#FFFC00", bg: "#FFFC00",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="#000"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.083.04.206.09.36.09.3-.002.659-.12 1.032-.418.2-.15.358-.212.507-.212.138 0 .274.034.399.09.426.189.408.481.399.54-.015.14-.08.256-.149.366-.198.313-.471.553-.755.768-.142.103-.293.21-.445.31-.15.099-.306.201-.47.312-.065.043-.141.09-.218.14-.15.094-.309.19-.489.335-.054.044-.125.105-.084.198.015.044.081.144.378.267.1.041.218.079.344.115.42.122 1.003.288 1.12.65.04.123.035.247-.014.353-.128.283-.467.435-.733.57-.027.013-.053.026-.079.038-.196.094-.384.185-.536.287a.826.826 0 00-.322.42c-.064.206-.134.406-.204.6a1.13 1.13 0 01-.141.3c-.1.14-.247.205-.42.205-.147 0-.32-.047-.516-.097a3.95 3.95 0 00-.963-.152c-.212 0-.434.031-.676.124-.387.146-.731.408-1.05.65-.586.441-1.207.907-2.165.907-.085 0-.171-.004-.257-.013a3.658 3.658 0 01-.263.013c-.958 0-1.58-.466-2.166-.907-.319-.242-.663-.504-1.05-.65-.242-.093-.464-.124-.676-.124-.345 0-.677.07-.963.152-.197.05-.369.097-.516.097-.173 0-.32-.065-.42-.205a1.13 1.13 0 01-.141-.3c-.07-.194-.14-.394-.204-.6a.826.826 0 00-.322-.42c-.152-.102-.34-.193-.536-.287l-.079-.038c-.266-.135-.605-.287-.733-.57a.534.534 0 01-.014-.353c.117-.362.7-.528 1.12-.65.126-.036.244-.074.344-.115.297-.123.363-.223.378-.267.041-.093-.03-.154-.084-.198-.18-.145-.34-.24-.489-.335-.077-.05-.153-.097-.218-.14-.164-.11-.32-.213-.47-.312a6.16 6.16 0 01-.445-.31c-.284-.215-.557-.455-.755-.768-.069-.11-.134-.226-.149-.366-.009-.059-.027-.351.399-.54a.833.833 0 01.399-.09c.149 0 .307.062.507.212.373.298.732.42 1.032.418.154 0 .277-.05.36-.09l-.03-.51-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.86 1.069 11.217.793 12.206.793z"/></svg> },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", bg: "#0A66C2",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id: "pinterest", name: "Pinterest", color: "#E60023", bg: "#E60023",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg> },
  { id: "spotify", name: "Spotify", color: "#1DB954", bg: "#1DB954",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  { id: "airbnb", name: "Airbnb", color: "#FF5A5F", bg: "#FF5A5F",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M11.985 14.278c-1.027-1.274-1.584-2.43-1.751-3.44-.096-.57-.066-1.05.072-1.47.245-.77.817-1.213 1.679-1.213.861 0 1.433.444 1.678 1.213.138.42.168.9.073 1.47-.168 1.011-.725 2.166-1.751 3.44zm9.357 1.563c.035.97-.504 1.823-1.488 2.34-.913.483-2.192.674-3.725.545-1.24-.105-2.673-.497-4.144-1.133-1.47.636-2.904 1.028-4.144 1.133-1.533.13-2.812-.062-3.725-.544-.984-.518-1.523-1.372-1.488-2.341.021-.602.25-1.303.799-2.125.647-.97 1.73-2.044 3.311-3.186-.264-.788-.403-1.553-.403-2.295 0-1.89.894-3.378 2.514-4.19.667-.33 1.384-.497 2.136-.497 2.47 0 4.056 1.574 4.056 4.005 0 .834-.148 1.685-.455 2.54l-.003.008c1.524 1.116 2.573 2.173 3.212 3.13.55.822.778 1.523.799 2.125-.001.162-.004.32-.002.485z"/></svg> },
  { id: "discord", name: "Discord", color: "#5865F2", bg: "#5865F2",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg> },
  { id: "telegram", name: "Telegram", color: "#2CA5E0", bg: "#2CA5E0",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
  { id: "reddit", name: "Reddit", color: "#FF4500", bg: "#FF4500",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/></svg> },
  { id: "threads", name: "Threads", color: "#000", bg: "#000",
    icon: s => <svg viewBox="0 0 24 24" width={s} height={s} fill="white"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V12c.024-6.462 4.29-10.5 10.704-10.5h.003c3.217.018 5.838 1.043 7.591 2.964.939 1.032 1.646 2.36 2.101 3.951L19.7 9a10.38 10.38 0 00-1.726-3.28C16.61 4.05 14.474 3.27 11.97 3.254c-5.225.002-8.937 3.456-8.957 9.015v.044c0 3.116.724 5.588 2.157 7.347C6.637 21.283 8.835 22.23 11.7 22.246c2.27.012 3.928-.55 5.178-1.712.908-.842 1.517-2.066 1.878-3.742h-5.75v-1.636h7.563l-.004.232c-.09 5.25-3.52 8.612-8.38 8.612z"/></svg> },
];

const COLOURS = [
  "#E1306C","#7C3AED","#2D9CDB","#16A34A","#F97316","#EF4444",
  "#EC4899","#F59E0B","#0EA5E9","#1c1713","#6366F1","#ffffff",
];

/* ── LOGO KEYRING (matches real product) ───────────────────── */
function LogoKeyring({ brand, colour, size = 180, rotate = 0, delay = "0s" }) {
  const bw = Math.round(size * 0.07);
  const r  = Math.round(size * 0.26);
  const ir = Math.max(r - bw, 4);
  const bg = colour || "#7C3AED";

  return (
    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center",
      animation:`float 5s ease-in-out ${delay} infinite`,
      "--r": `${rotate}deg`,
      transform:`rotate(${rotate}deg)`,
      filter:"drop-shadow(0 12px 28px rgba(0,0,0,0.18))",
    }}>
      {/* Metal ring */}
      <div style={{ position:"relative", width:size*0.13, height:size*0.2, marginBottom:-size*0.05, zIndex:2 }}>
        <svg width={size*0.13} height={size*0.2} viewBox="0 0 13 20">
          <ellipse cx="6.5" cy="10" rx="5" ry="8.5" fill="none" stroke="#bbb" strokeWidth="2.2"/>
          <ellipse cx="6.5" cy="10" rx="5" ry="8.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 20" strokeDashoffset="5"/>
        </svg>
      </div>
      {/* White border body */}
      <div style={{ width:size, height:size, borderRadius:r, background:"#ffffff", padding:bw, position:"relative",
        boxShadow:"0 2px 4px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.13)",
      }}>
        {/* FDM lines on white */}
        <div style={{ position:"absolute", inset:0, borderRadius:r, overflow:"hidden", pointerEvents:"none" }}>
          {Array.from({length:Math.floor(size/8)},(_,i)=>(
            <div key={i} style={{ position:"absolute", left:0, right:0, top:i*8, height:1, background:"rgba(0,0,0,0.022)" }}/>
          ))}
        </div>
        {/* Coloured face */}
        <div style={{ width:"100%", height:"100%", borderRadius:ir, background:bg,
          display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative",
        }}>
          {/* FDM lines on colour */}
          {Array.from({length:Math.floor((size-bw*2)/6)},(_,i)=>(
            <div key={i} style={{ position:"absolute", left:0, right:0, top:i*6, height:1, background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
          ))}
          {brand.icon(Math.round(size*0.54))}
        </div>
      </div>
    </div>
  );
}

/* ── NAV ────────────────────────────────────────────────────── */
function Nav({ scrolled }) {
  const { mob } = useSize();
  const [open, setOpen] = useState(false);
  const links = [{ l:"Products", id:"brands" },{ l:"Customise", id:"customise" },{ l:"Pricing", id:"pricing" }];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, height:60,
      background: scrolled||open ? "rgba(255,255,255,0.96)" : "transparent",
      backdropFilter: scrolled||open ? "blur(16px)" : "none",
      borderBottom: scrolled||open ? "1px solid #f0f0f0" : "none",
      transition:"all .3s", padding: mob?"0 20px":"0 40px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{
        display:"flex", alignItems:"center", gap:10, background:"none", border:"none", cursor:"pointer",
      }}>
        <div style={{ width:32, height:32, borderRadius:8, background:"#0a0a0a",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <svg viewBox="0 0 20 20" width={18} height={18} fill="white">
            <rect x="2" y="2" width="16" height="16" rx="4" fill="none" stroke="white" strokeWidth="1.5"/>
            <path d="M10 5C10 5 15 7.5 15 10C15 12.5 10 15 10 15" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity=".9"/>
            <path d="M10 8C10 8 12.5 9 12.5 10C12.5 11 10 12 10 12" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity=".7"/>
            <circle cx="10" cy="10" r="1.2" fill="white"/>
          </svg>
        </div>
        <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:17, color:"#0a0a0a", letterSpacing:"-.02em" }}>
          NeoPrint<span style={{ color:"#888" }}>Labs</span>
        </span>
      </button>

      {mob ? (
        <button onClick={()=>setOpen(o=>!o)} style={{ display:"flex", flexDirection:"column", gap:5, padding:8 }}>
          {[0,1,2].map(i=><div key={i} style={{ width:22,height:1.5,background:"#0a0a0a",borderRadius:1 }}/>)}
        </button>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:32 }}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>scrollTo(l.id)} style={{
              background:"none", border:"none", fontFamily:"'Outfit',sans-serif", fontWeight:500,
              fontSize:14, color:"#555", transition:"color .2s", cursor:"pointer",
            }}
              onMouseEnter={e=>e.target.style.color="#0a0a0a"}
              onMouseLeave={e=>e.target.style.color="#555"}
            >{l.l}</button>
          ))}
          <button className="cta-dark" style={{ padding:"9px 22px", fontSize:13 }} onClick={()=>scrollTo("customise")}>
            Order Now
          </button>
        </div>
      )}
      {open && mob && (
        <div style={{ position:"fixed", top:60, left:0, right:0, background:"#fff",
          borderBottom:"1px solid #f0f0f0", padding:"20px 24px 28px",
          display:"flex", flexDirection:"column", gap:4, animation:"fadeIn .15s ease",
        }}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>{scrollTo(l.id);setOpen(false);}} style={{
              background:"none", border:"none", textAlign:"left", padding:"13px 0",
              fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:500, color:"#0a0a0a",
              borderBottom:"1px solid #f5f5f5", cursor:"pointer",
            }}>{l.l}</button>
          ))}
          <button className="cta-dark" style={{ marginTop:16, width:"100%", textAlign:"center" }}
            onClick={()=>{scrollTo("customise");setOpen(false);}}>Order Now</button>
        </div>
      )}
    </nav>
  );
}

/* ── HERO ───────────────────────────────────────────────────── */
function Hero() {
  const { mob, tab } = useSize();
  const showcase = [
    { brand: BRANDS[0], colour: "#7C3AED", rotate: -8, delay:"0s" },
    { brand: BRANDS[0], colour: "#2D9CDB", rotate:  6, delay:".6s" },
    { brand: BRANDS[0], colour: "#E1306C", rotate: -4, delay:"1.2s" },
    { brand: BRANDS[0], colour: "#16A34A", rotate:  9, delay:".3s" },
  ];
  return (
    <section style={{
      minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center",
      padding: mob?"100px 24px 64px": tab?"110px 40px 64px":"0 64px",
      position:"relative", overflow:"hidden",
    }}>
      {/* Background grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:"linear-gradient(to top,#0a0a0a,transparent)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:1280, margin:"0 auto", width:"100%", display:"flex",
        flexDirection: mob||tab?"column":"row", alignItems:"center", gap: mob?48:tab?40:80,
      }}>
        {/* Text */}
        <div style={{ flex:1, animation:"fadeUp .7s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.08)",
            border:"1px solid rgba(255,255,255,.12)", borderRadius:20, padding:"6px 14px", marginBottom:28,
          }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80" }}/>
            <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:"rgba(255,255,255,.7)", letterSpacing:".08em" }}>3D PRINTED · NFC ENABLED</span>
          </div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, lineHeight:1.0,
            fontSize: mob?"clamp(42px,11vw,58px)": tab?"clamp(48px,7vw,64px)":"clamp(56px,5.5vw,80px)",
            color:"#fff", letterSpacing:"-.04em", marginBottom:20,
          }}>
            Your social.<br/>On your keys.
          </h1>
          <p style={{ fontSize: mob?15:17, color:"rgba(255,255,255,.5)", lineHeight:1.75, maxWidth:480,
            marginBottom:40, fontWeight:300,
          }}>
            3D-printed NFC keyrings shaped like your favourite social media logo. Any platform, any colour. Tap to share your profile instantly.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="cta-dark" style={{ background:"#fff", color:"#0a0a0a", fontSize:15, padding:"14px 32px" }}
              onClick={()=>scrollTo("customise")}>
              Customise & Order
            </button>
            <button className="cta-outline" style={{ borderColor:"rgba(255,255,255,.25)", color:"rgba(255,255,255,.8)" }}
              onClick={()=>scrollTo("brands")}>
              See All Brands
            </button>
          </div>
          {/* Stats */}
          <div style={{ display:"flex", gap: mob?20:36, marginTop:52, paddingTop:40,
            borderTop:"1px solid rgba(255,255,255,.08)", flexWrap:"wrap",
          }}>
            {[["15+","Brand logos"],["50+","Colours"],["24h","Dispatch"],["NFC","In every tag"]].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize: mob?20:26, color:"#fff" }}>{n}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:2, fontWeight:400, letterSpacing:".04em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product showcase */}
        {!mob && (
          <div style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative", width: tab?280:360, height: tab?320:400,
          }}>
            {showcase.map((s,i) => (
              <div key={i} style={{ position:"absolute",
                top: ["-5%","10%","55%","40%"][i], left: ["-5%","55%","5%","52%"][i],
                animation:`fadeIn .6s ease ${i*.15}s both`,
              }}>
                <LogoKeyring brand={s.brand} colour={s.colour} size={tab?100:120} rotate={s.rotate} delay={s.delay}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── BRANDS GRID ────────────────────────────────────────────── */
function BrandsGrid({ selected, onSelect }) {
  const { mob, tab } = useSize();
  return (
    <section id="brands" style={{ padding: mob?"64px 20px": tab?"80px 40px":"100px 64px", background:"#fff" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div className="rv" style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".18em", color:"#aaa", marginBottom:12 }}>PLATFORMS</div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
            fontSize: mob?"clamp(28px,8vw,40px)":"clamp(32px,4vw,52px)",
            letterSpacing:"-.03em", lineHeight:1.05, color:"#0a0a0a",
          }}>Pick your platform.</h2>
          <p style={{ fontSize:15, color:"#888", marginTop:12, fontWeight:300 }}>
            Each keyring is shaped and printed as the exact logo — then choose your colour.
          </p>
        </div>

        <div className="rv" style={{ display:"grid", gridTemplateColumns: mob?"repeat(3,1fr)": tab?"repeat(5,1fr)":"repeat(5,1fr)", gap:12 }}>
          {BRANDS.map(b => (
            <button key={b.id} onClick={()=>{ onSelect(b); scrollTo("customise"); }} style={{
              border:`2px solid ${selected?.id===b.id?"#0a0a0a":"#f0f0f0"}`,
              borderRadius:16, padding:"16px 8px 12px", background: selected?.id===b.id?"#0a0a0a":"#fff",
              display:"flex", flexDirection:"column", alignItems:"center", gap:10,
              cursor:"pointer", transition:"all .18s",
              boxShadow: selected?.id===b.id?"0 8px 24px rgba(0,0,0,.18)":"none",
            }}
              onMouseEnter={e=>{ if(selected?.id!==b.id){ e.currentTarget.style.borderColor="#0a0a0a"; e.currentTarget.style.transform="translateY(-2px)"; }}}
              onMouseLeave={e=>{ if(selected?.id!==b.id){ e.currentTarget.style.borderColor="#f0f0f0"; e.currentTarget.style.transform="translateY(0)"; }}}
            >
              <div style={{ width:44, height:44, borderRadius:11,
                background: selected?.id===b.id ? (b.color || "#333") : "#1a1a1a",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"background .18s",
              }}>
                {b.icon(26)}
              </div>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:11,
                color: selected?.id===b.id?"#fff":"#0a0a0a", letterSpacing:".02em",
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"100%",
              }}>{b.name}</span>
            </button>
          ))}
        </div>
        {/* Dimensions strip */}
        <div className="rv" style={{ marginTop:32, display:"grid", gridTemplateColumns: mob?"1fr":"repeat(3,1fr)", gap:12 }}>
          {SIZES.map(s => (
            <div key={s.id} style={{ background:"#f7f7f7", borderRadius:12, padding:"18px 20px",
              display:"flex", alignItems:"center", gap:16, border:"1px solid #f0f0f0",
            }}>
              <div style={{
                width: s.id==="sm"?36:s.id==="md"?46:56,
                height: s.id==="sm"?36:s.id==="md"?46:56,
                borderRadius: s.id==="sm"?9:s.id==="md"?12:14,
                border:"2px solid #0a0a0a", flexShrink:0,
              }}/>
              <div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#0a0a0a" }}>{s.label}</div>
                <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{s.dim} · {s.thickness} thick</div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>Weight approx. {s.weight}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── STL GENERATOR ───────────────────────────────────────────── */
const LOGO_PATHS = {
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  tiktok: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.82a8.18 8.18 0 004.77 1.52V6.89a4.85 4.85 0 01-1-.2z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  youtube: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  snapchat: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.083.04.206.09.36.09.3-.002.659-.12 1.032-.418.2-.15.358-.212.507-.212.138 0 .274.034.399.09.426.189.408.481.399.54-.015.14-.08.256-.149.366-.198.313-.471.553-.755.768-.142.103-.293.21-.445.31-.15.099-.306.201-.47.312-.065.043-.141.09-.218.14-.15.094-.309.19-.489.335-.054.044-.125.105-.084.198.015.044.081.144.378.267.1.041.218.079.344.115.42.122 1.003.288 1.12.65.04.123.035.247-.014.353-.128.283-.467.435-.733.57-.027.013-.053.026-.079.038-.196.094-.384.185-.536.287a.826.826 0 00-.322.42c-.064.206-.134.406-.204.6a1.13 1.13 0 01-.141.3c-.1.14-.247.205-.42.205-.147 0-.32-.047-.516-.097a3.95 3.95 0 00-.963-.152c-.212 0-.434.031-.676.124-.387.146-.731.408-1.05.65-.586.441-1.207.907-2.165.907-.085 0-.171-.004-.257-.013a3.658 3.658 0 01-.263.013c-.958 0-1.58-.466-2.166-.907-.319-.242-.663-.504-1.05-.65-.242-.093-.464-.124-.676-.124-.345 0-.677.07-.963.152-.197.05-.369.097-.516.097-.173 0-.32-.065-.42-.205a1.13 1.13 0 01-.141-.3c-.07-.194-.14-.394-.204-.6a.826.826 0 00-.322-.42c-.152-.102-.34-.193-.536-.287l-.079-.038c-.266-.135-.605-.287-.733-.57a.534.534 0 01-.014-.353c.117-.362.7-.528 1.12-.65.126-.036.244-.074.344-.115.297-.123.363-.223.378-.267.041-.093-.03-.154-.084-.198-.18-.145-.34-.24-.489-.335-.077-.05-.153-.097-.218-.14-.164-.11-.32-.213-.47-.312a6.16 6.16 0 01-.445-.31c-.284-.215-.557-.455-.755-.768-.069-.11-.134-.226-.149-.366-.009-.059-.027-.351.399-.54a.833.833 0 01.399-.09c.149 0 .307.062.507.212.373.298.732.42 1.032.418.154 0 .277-.05.36-.09l-.03-.51-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.86 1.069 11.217.793 12.206.793z",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  pinterest: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z",
  spotify: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
  airbnb: "M11.985 14.278c-1.027-1.274-1.584-2.43-1.751-3.44-.096-.57-.066-1.05.072-1.47.245-.77.817-1.213 1.679-1.213.861 0 1.433.444 1.678 1.213.138.42.168.9.073 1.47-.168 1.011-.725 2.166-1.751 3.44zm9.357 1.563c.035.97-.504 1.823-1.488 2.34-.913.483-2.192.674-3.725.545-1.24-.105-2.673-.497-4.144-1.133-1.47.636-2.904 1.028-4.144 1.133-1.533.13-2.812-.062-3.725-.544-.984-.518-1.523-1.372-1.488-2.341.021-.602.25-1.303.799-2.125.647-.97 1.73-2.044 3.311-3.186-.264-.788-.403-1.553-.403-2.295 0-1.89.894-3.378 2.514-4.19.667-.33 1.384-.497 2.136-.497 2.47 0 4.056 1.574 4.056 4.005 0 .834-.148 1.685-.455 2.54l-.003.008c1.524 1.116 2.573 2.173 3.212 3.13.55.822.778 1.523.799 2.125-.001.162-.004.32-.002.485z",
  discord: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
  telegram: "M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  reddit: "M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z",
  threads: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V12c.024-6.462 4.29-10.5 10.704-10.5h.003c3.217.018 5.838 1.043 7.591 2.964.939 1.032 1.646 2.36 2.101 3.951L19.7 9a10.38 10.38 0 00-1.726-3.28C16.61 4.05 14.474 3.27 11.97 3.254c-5.225.002-8.937 3.456-8.957 9.015v.044c0 3.116.724 5.588 2.157 7.347C6.637 21.283 8.835 22.23 11.7 22.246c2.27.012 3.928-.55 5.178-1.712.908-.842 1.517-2.066 1.878-3.742h-5.75v-1.636h7.563l-.004.232c-.09 5.25-3.52 8.612-8.38 8.612z",
};

// Load earcut triangulation library
function loadEarcut() {
  return new Promise(res => {
    if (window.earcut) { res(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/earcut@2.2.4/src/earcut.min.js';
    s.onload = res; document.head.appendChild(s);
  });
}

// Sample an SVG path as polygon points using browser API
function sampleSVGPath(pathD, samples, scale, offX, offY) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width','24'); svg.setAttribute('height','24');
  Object.assign(svg.style,{position:'absolute',visibility:'hidden',top:'-9999px',left:'-9999px'});
  const path = document.createElementNS(ns,'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path); document.body.appendChild(svg);
  const len = path.getTotalLength();
  const pts = [];
  if (len > 0) {
    for (let i = 0; i < samples; i++) {
      const p = path.getPointAtLength((i/samples)*len);
      pts.push([(p.x-12)*scale+offX, -(p.y-12)*scale+offY]);
    }
  }
  document.body.removeChild(svg);
  return pts;
}

// Split compound SVG path into subpaths (split on M commands)
function splitSubpaths(pathD) {
  return pathD.split(/(?=[Mm]\s*[-\d])/).map(s=>s.trim()).filter(Boolean);
}

// Add triangle (auto-compute normal)
function addTri(tris, v1, v2, v3) {
  const ux=v2[0]-v1[0],uy=v2[1]-v1[1],uz=v2[2]-v1[2];
  const vx=v3[0]-v1[0],vy=v3[1]-v1[1],vz=v3[2]-v1[2];
  const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
  const l=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
  tris.push({n:[nx/l,ny/l,nz/l],v:[v1,v2,v3]});
}

// Triangulate a flat polygon face (with optional holes) using earcut
function triangulateFace(tris, outer, holes, z, flip) {
  const allPts = [...outer, ...holes.flat()];
  const flat = allPts.flatMap(p=>[p[0],p[1]]);
  const holeIdx = holes.length ? (() => { let idx=outer.length,acc=[]; for(const h of holes){acc.push(idx);idx+=h.length;} return acc; })() : null;
  const idxs = window.earcut(flat, holeIdx, 2);
  for (let i=0;i<idxs.length;i+=3) {
    const v1=[...allPts[idxs[i]],z],v2=[...allPts[idxs[i+1]],z],v3=[...allPts[idxs[i+2]],z];
    flip ? addTri(tris,v1,v3,v2) : addTri(tris,v1,v2,v3);
  }
}

// Extrude side walls between z1 and z2
function extrudeWalls(tris, pts, z1, z2, flip) {
  for(let i=0;i<pts.length;i++){
    const j=(i+1)%pts.length;
    const a=[pts[i][0],pts[i][1],z1],b=[pts[j][0],pts[j][1],z1];
    const c=[pts[j][0],pts[j][1],z2],d=[pts[i][0],pts[i][1],z2];
    flip?(addTri(tris,a,c,b),addTri(tris,a,d,c)):(addTri(tris,a,b,c),addTri(tris,a,c,d));
  }
}

// Rounded rectangle polygon points
function rrectPts(W,H,R,segs=12){
  const pts=[];
  [[W/2-R,H/2-R,0],[-(W/2-R),H/2-R,Math.PI/2],[-(W/2-R),-(H/2-R),Math.PI],[W/2-R,-(H/2-R),3*Math.PI/2]]
    .forEach(([cx,cy,sa])=>{for(let i=0;i<=segs;i++){const a=sa+(i/segs)*Math.PI/2;pts.push([cx+R*Math.cos(a),cy+R*Math.sin(a)]);}});
  return pts;
}

// Circle polygon points
function circPts(cx,cy,r,segs=24){
  return Array.from({length:segs},(_,i)=>{const a=(i/segs)*Math.PI*2;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});
}

// Build binary STL ArrayBuffer from triangle list
function buildSTL(tris){
  const buf=new ArrayBuffer(84+tris.length*50);
  const dv=new DataView(buf);
  dv.setUint32(80,tris.length,true);
  let off=84;
  for(const{n,v}of tris){
    [...n,...v[0],...v[1],...v[2]].forEach(f=>{dv.setFloat32(off,f,true);off+=4;});
    dv.setUint16(off,0,true);off+=2;
  }
  return buf;
}

// Main STL generator
async function generateKeyringSTL(brand, sizeObj) {
  await loadEarcut();
  const W = sizeObj.mm;
  const D = parseFloat(sizeObj.thickness||"3");
  const R = W*0.25;
  const holeR = Math.min(3.5, W*0.065);
  const holeCY = W/2 - holeR - 4;
  const logoScale = (W*0.46)/24;
  const logoH = 1.8;
  const logoOffY = -W*0.04;
  const tris = [];
  const outer = rrectPts(W,W,R,14);
  const hole  = circPts(0,holeCY,holeR,28);

  // Base: bottom face, top face with hole, outer walls, hole walls+caps
  triangulateFace(tris, outer, [], 0, true);
  triangulateFace(tris, outer, [hole.slice().reverse()], D, false);
  extrudeWalls(tris, outer, 0, D, false);
  extrudeWalls(tris, hole,  0, D, true);
  triangulateFace(tris, hole, [], 0, false);
  triangulateFace(tris, hole, [], D, true);

  // Logo bump — sample SVG path, split subpaths, extrude
  const pathD = LOGO_PATHS[brand.id];
  if (pathD) {
    const subpaths = splitSubpaths(pathD);
    const polys = subpaths
      .map(sp => sampleSVGPath(sp, 64, logoScale, 0, logoOffY))
      .filter(p => p.length >= 3);
    if (polys.length > 0) {
      const outer2 = polys[0];
      const holes2 = polys.slice(1).map(h=>h.slice().reverse());
      triangulateFace(tris, outer2, holes2, D,        true);
      triangulateFace(tris, outer2, holes2, D+logoH,  false);
      extrudeWalls(tris, outer2, D, D+logoH, false);
      holes2.forEach(h=>extrudeWalls(tris,h,D,D+logoH,true));
    }
  }
  return buildSTL(tris);
}

// Upload STL to file.io → returns public download URL
async function uploadSTL(buffer, filename) {
  const blob = new Blob([buffer],{type:'application/octet-stream'});
  const fd = new FormData();
  fd.append('file', blob, filename);
  fd.append('expires','14d');
  const r = await fetch('https://file.io/',{method:'POST',body:fd});
  const d = await r.json();
  if(d.success && d.link) return d.link;
  throw new Error('Upload failed: '+JSON.stringify(d));
}

/* ── SIZES ───────────────────────────────────────────────────── */
const SIZES = [
  { id:"sm", label:"Small",    dim:"40 × 40mm", thickness:"3mm", weight:"~8g",  mult:1.0,   preview:140 },
  { id:"md", label:"Standard", dim:"55 × 55mm", thickness:"3mm", weight:"~15g", mult:1.45,  preview:180 },
  { id:"lg", label:"Large",    dim:"70 × 70mm", thickness:"4mm", weight:"~24g", mult:1.85,  preview:220 },
];

/* ── CUSTOMISER ─────────────────────────────────────────────── */
function Customiser({ initBrand }) {
  const { mob, tab } = useSize();
  const [brand, setBrand] = useState(initBrand || BRANDS[0]);
  const [colour, setColour] = useState("#7C3AED");
  const [size, setSize] = useState(SIZES[1]);
  const [label, setLabel] = useState("");
  const [qty, setQty] = useState(10);
  const [nfc, setNfc] = useState(false);
  const [url, setUrl] = useState("");

  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [payDone, setPayDone] = useState(false);

  useEffect(() => { if (initBrand) setBrand(initBrand); }, [initBrand]);

  const baseUnit = qty >= 50 ? 1.60 : qty >= 10 ? 2.80 : 4.80;
  const unit = (baseUnit * size.mult + (nfc ? 0.5 : 0));
  const total = (unit * qty).toFixed(2);

  const BACKEND_URL = "https://neoprintlabs-backend-668w.vercel.app/api";

  const handlePay = async () => {
    setGenerating(true);
    setGenStatus("Generating 3D file…");
    let fileUrl = null;
    try {
      const stlBuffer = await generateKeyringSTL(brand, size);
      setGenStatus("Uploading file…");
      const filename = `${brand.id}_${size.id}_${colour.replace('#','')}.stl`;
      fileUrl = await uploadSTL(stlBuffer, filename);
    } catch(e) { console.warn("STL error:", e); }

    setGenStatus("Opening Stripe checkout…");
    try {
      const amount = Math.round(parseFloat(total) * 100);
      const description = `${qty}× ${brand.name} keyring — ${size.label} (${size.dim})${nfc ? " + NFC" : ""}`;
      const res = await fetch(`${BACKEND_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });
      const data = await res.json();
      if (data.url) {
        // Send order email with STL link
        if (fileUrl) {
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_key: "ce8fd7a4-14a4-4a44-a1d7-ccac58240d1c",
              to: "solonascharalampous@gmail.com",
              subject: `🛒 New Order — ${brand.name} ×${qty} (${size.label})`,
              message: [
                "NEW ORDER — NeoPrintLabs",
                "━━━━━━━━━━━━━━━━━━━━━━",
                `Platform:  ${brand.name}`,
                `Size:      ${size.label} (${size.dim} · ${size.thickness})`,
                `Colour:    ${colour}`,
                `Quantity:  ${qty}`,
                `NFC:       ${nfc ? `Yes — ${url||"URL not set"}` : "No"}`,
                `Total:     €${total}`,
                "━━━━━━━━━━━━━━━━━━━━━━",
                `STL FILE:  ${fileUrl}`,
                "(Download link valid 14 days)",
              ].join("\n"),
            }),
          }).catch(()=>{});
        }
        window.open(data.url, "_blank");
        setPayDone(true);
      } else {
        setGenStatus("Payment error — please try again.");
      }
    } catch(e) {
      console.error("Checkout error:", e);
      setGenStatus("Could not connect to payment server.");
    }
    setGenerating(false);
  };

  if (payDone) return (
    <section id="customise" style={{ padding: mob?"80px 20px":"120px 64px", background:"#f5f5f5" }}>
      <div style={{ maxWidth:520, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:24 }}>🎉</div>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:36, color:"#0a0a0a", marginBottom:14, letterSpacing:"-.02em" }}>Payment opened!</h2>
        <p style={{ color:"#888", lineHeight:1.75, fontWeight:300, marginBottom:8 }}>
          Stripe opened in a new tab with <strong style={{color:"#0a0a0a"}}>€{total}</strong> pre-filled.
        </p>
        <p style={{ color:"#aaa", fontSize:13, lineHeight:1.7, marginBottom:32 }}>
          We'll start printing once payment is confirmed. You'll receive a Stripe receipt by email.
        </p>
        <button className="cta-dark" onClick={()=>setPayDone(false)}>Place another order</button>
      </div>
    </section>
  );

  return (
    <section id="customise" style={{ padding: mob?"64px 20px": tab?"80px 40px":"100px 64px", background:"#f7f7f7" }}>
      <div style={{ maxWidth:1160, margin:"0 auto" }}>
        <div className="rv" style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".18em", color:"#aaa", marginBottom:12 }}>CUSTOMISER</div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
            fontSize: mob?"clamp(28px,8vw,40px)":"clamp(32px,4vw,52px)",
            letterSpacing:"-.03em", color:"#0a0a0a",
          }}>Make it yours.</h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns: mob||tab?"1fr":"1fr 1fr", gap:24, alignItems:"start" }}>

          {/* Controls */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Brand */}
            <div style={{ background:"#fff", borderRadius:16, padding:"24px 20px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, color:"#aaa", letterSpacing:".12em", marginBottom:14 }}>PLATFORM</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                {BRANDS.map(b=>(
                  <button key={b.id} onClick={()=>setBrand(b)} style={{
                    border:`2px solid ${brand.id===b.id?"#0a0a0a":"#f0f0f0"}`,
                    borderRadius:12, padding:"10px 4px", background: brand.id===b.id?"#f5f5f5":"#fff",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", transition:"all .15s",
                  }}>
                    <div style={{ width:32, height:32, borderRadius:8,
                      background: brand.id===b.id ? (b.color || "#333") : "#1a1a1a",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"background .15s",
                    }}>
                      {b.icon(17)}
                    </div>
                    <span style={{ fontSize:9, fontFamily:"'Outfit',sans-serif", fontWeight:600, color: brand.id===b.id?"#0a0a0a":"#888", whiteSpace:"nowrap" }}>
                      {b.name === "X / Twitter" ? "X" : b.name.length > 8 ? b.name.slice(0,7)+"…" : b.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ background:"#fff", borderRadius:16, padding:"24px 20px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, color:"#aaa", letterSpacing:".12em", marginBottom:14 }}>SIZE</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {SIZES.map(s=>(
                  <button key={s.id} onClick={()=>setSize(s)} style={{
                    border:`2px solid ${size.id===s.id?"#0a0a0a":"#f0f0f0"}`,
                    borderRadius:12, padding:"14px 16px", background: size.id===s.id?"#0a0a0a":"#fff",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    cursor:"pointer", transition:"all .18s", textAlign:"left",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      {/* Size visual */}
                      <div style={{
                        width: s.id==="sm"?28:s.id==="md"?36:44,
                        height: s.id==="sm"?28:s.id==="md"?36:44,
                        borderRadius: s.id==="sm"?7:s.id==="md"?9:11,
                        border:`2px solid ${size.id===s.id?"rgba(255,255,255,.4)":"#e8e8e8"}`,
                        flexShrink:0, transition:"all .18s",
                      }}/>
                      <div>
                        <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14,
                          color: size.id===s.id?"#fff":"#0a0a0a",
                        }}>{s.label}</div>
                        <div style={{ fontSize:11, color: size.id===s.id?"rgba(255,255,255,.5)":"#aaa", marginTop:2 }}>
                          {s.dim} · {s.thickness} thick · {s.weight}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13,
                      color: size.id===s.id?"rgba(255,255,255,.7)":"#888",
                    }}>×{s.mult.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div style={{ background:"#fff", borderRadius:16, padding:"24px 20px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, color:"#aaa", letterSpacing:".12em", marginBottom:14 }}>BACKGROUND COLOUR</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                {COLOURS.map(c=>(
                  <button key={c} onClick={()=>setColour(c)} style={{
                    width:30, height:30, borderRadius:"50%",
                    background: c === "#ffffff" ? "#fff" : c,
                    border: c === "#ffffff" ? "1.5px solid #e8e8e8" : "none",
                    cursor:"pointer",
                    boxShadow: colour===c ? "0 0 0 2.5px #fff, 0 0 0 4.5px #0a0a0a" : "0 1px 4px rgba(0,0,0,.12)",
                    transition:"all .15s",
                  }}/>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <input type="color" value={colour} onChange={e=>setColour(e.target.value)} style={{ width:36, height:32, border:"1.5px solid #e8e8e8", borderRadius:6, padding:2, cursor:"pointer", background:"none" }}/>
                <span style={{ fontSize:12, color:"#aaa", fontFamily:"monospace" }}>{colour}</span>
              </div>
            </div>

            {/* Text */}
            <div style={{ background:"#fff", borderRadius:16, padding:"24px 20px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, color:"#aaa", letterSpacing:".12em", marginBottom:12 }}>
                TEXT ON TAG <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span>
              </div>
              <input value={label} onChange={e=>setLabel(e.target.value)} maxLength={18}
                placeholder="e.g. @yourhandle"
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e8e8e8",
                  fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"#0a0a0a", background:"#fff",
                  outline:"none", transition:"border-color .15s", boxSizing:"border-box",
                }}
                onFocus={e=>e.target.style.borderColor="#0a0a0a"}
                onBlur={e=>e.target.style.borderColor="#e8e8e8"}
              />
              <div style={{ fontSize:11, color:"#ccc", marginTop:6 }}>{label.length}/18</div>
            </div>

            {/* NFC */}
            <div style={{ background:"#fff", borderRadius:16, padding:"20px",
              border:`1.5px solid ${nfc?"#0a0a0a":"#f0f0f0"}`, transition:"border-color .2s",
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, color:"#0a0a0a", marginBottom:4 }}>
                    NFC Programming
                    <span style={{ fontWeight:500, fontSize:12, color:"#888", marginLeft:8 }}>+€0.50 per tag</span>
                  </div>
                  <div style={{ fontSize:12, color:"#aaa", lineHeight:1.65, fontWeight:300 }}>
                    We'll pre-programme each tag to your URL before dispatch. Chips ship blank otherwise.
                  </div>
                  {nfc && (
                    <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yourwebsite.com"
                      style={{ marginTop:10, width:"100%", padding:"9px 12px", borderRadius:8,
                        border:"1.5px solid #0a0a0a", fontSize:13, fontFamily:"'DM Sans',sans-serif",
                        color:"#0a0a0a", outline:"none", boxSizing:"border-box",
                      }}
                    />
                  )}
                </div>
                <div onClick={()=>setNfc(n=>!n)} style={{
                  width:44, height:24, borderRadius:12, background: nfc?"#0a0a0a":"#e8e8e8",
                  position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0, marginTop:3,
                }}>
                  <div style={{ position:"absolute", top:3, left: nfc?23:3, width:18, height:18,
                    borderRadius:"50%", background:"#fff", transition:"left .2s",
                    boxShadow:"0 1px 4px rgba(0,0,0,.2)",
                  }}/>
                </div>
              </div>
            </div>
          </div>

          {/* Preview + Order */}
          <div style={{ display:"flex", flexDirection:"column", gap:16, position: mob?"static":"sticky", top:80 }}>

            {/* Preview */}
            <div style={{ background:"#fff", borderRadius:16, padding:"36px 24px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:20,
            }}>
              <div style={{ fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:700, letterSpacing:".12em", color:"#aaa" }}>LIVE PREVIEW</div>
              <div style={{ padding:"20px 0" }}>
                <LogoKeyring brand={brand} colour={colour} size={mob ? Math.round(size.preview*0.8) : size.preview} delay="0s"/>
              </div>
              {label && (
                <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600,
                  color:"#555", background:"#f7f7f7", padding:"6px 14px", borderRadius:20,
                }}>{label}</div>
              )}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                {[brand.name, size.dim, "PLA", nfc?"NFC programmed":"Blank chip"].map((v,i)=>(
                  <div key={i} style={{ padding:"4px 12px", borderRadius:20, border:"1.5px solid #f0f0f0",
                    fontSize:10, color:"#888", fontFamily:"'Outfit',sans-serif", fontWeight:600, letterSpacing:".04em",
                  }}>{v}</div>
                ))}
              </div>
            </div>

            {/* Quantity + price */}
            <div style={{ background:"#fff", borderRadius:16, padding:"24px 20px" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, color:"#aaa", letterSpacing:".12em", marginBottom:14 }}>QUANTITY</div>
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                {[1,10,25,50,100].map(q=>(
                  <button key={q} onClick={()=>setQty(q)} style={{
                    flex:1, minWidth:40, padding:"9px 4px", borderRadius:8, fontSize:13, fontWeight:600,
                    fontFamily:"'Outfit',sans-serif",
                    border:`1.5px solid ${qty===q?"#0a0a0a":"#e8e8e8"}`,
                    background: qty===q?"#0a0a0a":"#fff",
                    color: qty===q?"#fff":"#555",
                    cursor:"pointer", transition:"all .15s",
                  }}>{q}</button>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))}
                  style={{ flex:1, textAlign:"center", padding:"10px", borderRadius:8,
                    border:"1.5px solid #e8e8e8", fontSize:16, fontWeight:700,
                    fontFamily:"'Outfit',sans-serif", color:"#0a0a0a", outline:"none",
                  }}
                />
                <button className="qty-btn" onClick={()=>setQty(q=>q+1)}>+</button>
              </div>

              <div style={{ borderTop:"1px solid #f5f5f5", paddingTop:16, display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                {[
                  ["Print price", `€${(baseUnit * size.mult).toFixed(2)} × ${qty}`],
                  ["Size modifier", `${size.label} (${size.dim})`],
                  ...(nfc?[["NFC programming", `€0.50 × ${qty}`]]:[]),
                ].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <span style={{ fontSize:13, color:"#888", flexShrink:0 }}>{k}</span>
                    <span style={{ fontSize:13, color:"#555", fontWeight:500, textAlign:"right" }}>{v}</span>
                  </div>
                ))}
                {qty>=50&&<div style={{ fontSize:11, color:"#16a34a", fontWeight:700 }}>✓ Bulk rate applied</div>}
                {qty>=10&&qty<50&&<div style={{ fontSize:11, color:"#f97316", fontWeight:700 }}>✓ Small batch rate applied</div>}
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid #f5f5f5" }}>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#0a0a0a" }}>Total</span>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:26, color:"#0a0a0a" }}>€{total}</span>
                </div>
              </div>

              {genStatus && (
                <div style={{ background:"#f7f7f7", border:"1px solid #e8e8e8", borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:12, color:"#555", display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:12, height:12, border:"2px solid #0a0a0a", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", flexShrink:0 }}/>
                  {genStatus}
                </div>
              )}
              {/* Stripe pay button */}
              <button onClick={handlePay} disabled={generating} style={{
                width:"100%", padding:"16px", borderRadius:10,
                background: generating?"#999":"#635BFF", color:"#fff", border:"none",
                fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16,
                cursor: generating?"not-allowed":"pointer", transition:"all .2s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              }}
                onMouseEnter={e=>{ if(!generating) e.currentTarget.style.background="#4f46e5"; }}
                onMouseLeave={e=>{ if(!generating) e.currentTarget.style.background="#635BFF"; }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                {generating ? genStatus||"Processing…" : `Pay €${total} with Stripe`}
              </button>
              <div style={{ fontSize:11, color:"#ccc", textAlign:"center", marginTop:10, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#ccc" strokeWidth="1.5"/></svg>
                Secure payment powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ───────────────────────────────────────────── */
function HowItWorks() {
  const { mob, tab } = useSize();
  const steps = [
    { n:"01", title:"Design", desc:"Pick your platform, choose your colour, add an optional text label. See it live on screen.", emoji:"✏️" },
    { n:"02", title:"We print it", desc:"Your keyring is 3D printed in PLA layer by layer — the logo shape, the white border, all of it.", emoji:"🖨️" },
    { n:"03", title:"NFC embed", desc:"An NFC chip is set into every tag. Ships blank, or add programming for +€0.50 per tag.", emoji:"📡" },
    { n:"04", title:"Dispatched", desc:"Packed and shipped within 24–48 hours via tracked courier. Worldwide.", emoji:"📦" },
  ];
  return (
    <section id="how" style={{ padding: mob?"64px 20px": tab?"80px 40px":"100px 64px", background:"#0a0a0a" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div className="rv" style={{ marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".18em", color:"#444", marginBottom:12 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
            fontSize: mob?"clamp(28px,8vw,40px)":"clamp(32px,4vw,52px)",
            letterSpacing:"-.03em", color:"#fff",
          }}>Order to door in days.</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: mob?"1fr": tab?"1fr 1fr":"repeat(4,1fr)", gap:16 }}>
          {steps.map((s,i)=>(
            <div key={i} className="rv" style={{ transitionDelay:`${i*.1}s`,
              background:"#141414", borderRadius:16, padding:"28px 24px", border:"1px solid #1e1e1e",
              transition:"transform .25s, border-color .25s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="#333";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="#1e1e1e";}}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:48, color:"#1e1e1e", lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:24 }}>{s.emoji}</div>
              </div>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:19, color:"#fff", marginBottom:10 }}>{s.title}</h3>
              <p style={{ fontSize:13, color:"#555", lineHeight:1.75, fontWeight:300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRICING ────────────────────────────────────────────────── */
function Pricing() {
  const { mob, tab } = useSize();
  const tiers = [
    { name:"Sample", range:"1–9 units", price:"€4.80", sub:"per tag", color:"#888",
      features:["Any platform & colour","PLA material","NFC chip included","5–7 day dispatch"] },
    { name:"Small Batch", range:"10–49 units", price:"€2.80", sub:"per tag", color:"#0a0a0a", hot:true,
      features:["Any platform & colour","PLA material","NFC chip included","48h priority dispatch","Logo artwork print"] },
    { name:"Bulk", range:"50+ units", price:"€1.60", sub:"per tag", color:"#0a0a0a",
      features:["Any platform & colour","PLA material","NFC chip included","Priority queue","Dedicated contact"] },
  ];
  return (
    <section id="pricing" style={{ padding: mob?"64px 20px": tab?"80px 40px":"100px 64px", background:"#fff" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div className="rv" style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".18em", color:"#aaa", marginBottom:12 }}>PRICING</div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
            fontSize: mob?"clamp(28px,8vw,40px)":"clamp(32px,4vw,52px)",
            letterSpacing:"-.03em", color:"#0a0a0a", marginBottom:8,
          }}>Simple. Per unit.</h2>
          <p style={{ color:"#888", fontWeight:300, fontSize:15 }}>Price drops with quantity. NFC programming is +€0.50/tag if you want it.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: mob?"1fr": tab?"1fr 1fr":"repeat(3,1fr)", gap:16 }}>
          {tiers.map((t,i)=>(
            <div key={i} className="rv" style={{ transitionDelay:`${i*.1}s`,
              background: t.hot?"#0a0a0a":"#fff",
              border:`1.5px solid ${t.hot?"#0a0a0a":"#f0f0f0"}`,
              borderRadius:16, padding:"32px 28px", position:"relative",
              transition:"transform .25s, box-shadow .25s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=t.hot?"0 16px 40px rgba(0,0,0,.2)":"0 8px 24px rgba(0,0,0,.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
            >
              {t.hot&&<div style={{ position:"absolute", top:20, right:20, background:"#fff", color:"#0a0a0a",
                fontSize:9, fontWeight:800, letterSpacing:".1em", padding:"4px 10px", borderRadius:20,
              }}>BEST VALUE</div>}
              <div style={{ fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:700, letterSpacing:".1em",
                color: t.hot?"rgba(255,255,255,.4)":"#aaa", marginBottom:6,
              }}>{t.range}</div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:44, lineHeight:1,
                color: t.hot?"#fff":"#0a0a0a", marginBottom:4,
              }}>{t.price}</div>
              <div style={{ fontSize:12, color: t.hot?"rgba(255,255,255,.4)":"#aaa", marginBottom:24 }}>{t.sub}</div>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18,
                color: t.hot?"#fff":"#0a0a0a", marginBottom:20,
              }}>{t.name}</div>
              <div style={{ height:1, background: t.hot?"rgba(255,255,255,.1)":"#f5f5f5", marginBottom:20 }}/>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {t.features.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:16,height:16,borderRadius:"50%",flexShrink:0,
                      border:`1.5px solid ${t.hot?"rgba(255,255,255,.2)":"#e8e8e8"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                    }}>
                      <div style={{ width:5,height:5,borderRadius:"50%",background: t.hot?"#fff":"#0a0a0a" }}/>
                    </div>
                    <span style={{ fontSize:13, color: t.hot?"rgba(255,255,255,.7)":"#555" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{
                width:"100%", padding:13, borderRadius:10,
                background: t.hot?"#fff":"#0a0a0a",
                color: t.hot?"#0a0a0a":"#fff",
                fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14,
                border:"none", cursor:"pointer", transition:"opacity .2s",
              }}
                onClick={()=>scrollTo("customise")}
                onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}
              >Order Now →</button>
            </div>
          ))}
        </div>

        {/* NFC add-on callout */}
        <div className="rv" style={{ marginTop:20, padding: mob?"20px":"24px 32px",
          background:"#f7f7f7", borderRadius:14, display:"flex",
          alignItems: mob?"flex-start":"center", gap:16, flexDirection: mob?"column":"row",
        }}>
          <div style={{ fontSize:26, flexShrink:0 }}>📡</div>
          <div>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#0a0a0a", marginBottom:4 }}>
              NFC Programming — <span style={{ color:"#888", fontWeight:400 }}>+€0.50 per tag</span>
            </div>
            <p style={{ fontSize:13, color:"#888", lineHeight:1.65, fontWeight:300 }}>
              Every tag ships with an NFC chip inside. By default it's blank — programme it yourself with any free app (NFC Tools, etc.). Or we can pre-programme it to your URL before dispatch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── MATERIAL ───────────────────────────────────────────────── */
function Material() {
  const { mob, tab } = useSize();
  const facts = [
    { n:"50+", l:"Colours" }, { n:"PLA", l:"Biodegradable" }, { n:"100%", l:"Custom printed" }, { n:"FDM", l:"Technology" },
  ];
  return (
    <section style={{ padding: mob?"64px 20px": tab?"80px 40px":"100px 64px", background:"#f7f7f7" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"grid",
        gridTemplateColumns: mob||tab?"1fr":"1fr 1fr", gap: mob?40:80, alignItems:"center",
      }}>
        <div className="rv">
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".18em", color:"#aaa", marginBottom:12 }}>MATERIAL</div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800,
            fontSize: mob?"clamp(26px,7vw,38px)":"clamp(28px,3.5vw,44px)",
            letterSpacing:"-.03em", color:"#0a0a0a", marginBottom:16,
          }}>We print in PLA.<br/>Nothing else.</h2>
          <p style={{ fontSize:15, color:"#888", lineHeight:1.8, fontWeight:300, maxWidth:440 }}>
            PLA is a plant-based, biodegradable thermoplastic. It prints with a smooth, consistent finish that takes colour beautifully — and it's better for the planet than petroleum-based alternatives. We chose it deliberately and we stick with it.
          </p>
          <div style={{ display:"flex", gap:24, marginTop:36, flexWrap:"wrap" }}>
            {facts.map(({n,l})=>(
              <div key={l}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:24, color:"#0a0a0a" }}>{n}</div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:2, fontWeight:600, letterSpacing:".06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rv" style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:16 }}>
          {[BRANDS[0],BRANDS[1],BRANDS[3],BRANDS[4]].map((b,i)=>(
            <LogoKeyring key={i} brand={b} colour={[COLOURS[6],COLOURS[0],COLOURS[2],COLOURS[4]][i]}
              size={mob?90:110} rotate={[-6,5,-4,7][i]} delay={`${i*.2}s`}/>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ────────────────────────────────────────────────────── */
function CTA() {
  const { mob } = useSize();
  return (
    <section id="contact" style={{ padding: mob?"64px 20px":"100px 64px", background:"#0a0a0a" }}>
      <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
        <div className="rv">
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900,
            fontSize: mob?"clamp(36px,10vw,52px)":"clamp(44px,5vw,64px)",
            letterSpacing:"-.04em", color:"#fff", lineHeight:1.0, marginBottom:16,
          }}>Ready to tap?</h2>
          <p style={{ fontSize:17, color:"rgba(255,255,255,.4)", lineHeight:1.7, marginBottom:40, fontWeight:300 }}>
            Order yours today. Designed, printed and dispatched in 24–48 hours.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button style={{ background:"#fff", color:"#0a0a0a", border:"none", borderRadius:10,
              padding:"15px 36px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16,
              cursor:"pointer", transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(255,255,255,.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
              onClick={()=>scrollTo("customise")}
            >Customise & Order →</button>
            <button className="cta-outline" style={{ borderColor:"rgba(255,255,255,.2)", color:"rgba(255,255,255,.6)" }}>
              Talk to us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  const { mob, tab } = useSize();
  const cols = [
    { t:"Products", ls:["Business Cards","Product Tags","Event Keyrings","Custom Orders","Bulk Orders"] },
    { t:"Services", ls:["3D Printing","NFC Programming","Custom Modelling","Sample Orders","Get a Quote"] },
    { t:"Company",  ls:["About Us","Blog","Careers","Press","Contact"] },
  ];
  return (
    <footer style={{ background:"#0a0a0a", borderTop:"1px solid #141414", padding: mob?"48px 20px 28px":"60px 64px 32px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns: mob?"1fr": tab?"1fr 1fr":"2fr 1fr 1fr 1fr",
          gap: mob?32:48, marginBottom:48,
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }}
              onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
              <div style={{ width:30,height:30,borderRadius:7,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg viewBox="0 0 20 20" width={16} height={16} fill="white" opacity=".8">
                  <rect x="2" y="2" width="16" height="16" rx="4" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M10 5C10 5 15 7.5 15 10C15 12.5 10 15 10 15" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="1.2" fill="white"/>
                </svg>
              </div>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#fff" }}>
                NeoPrint<span style={{ color:"#444" }}>Labs</span>
              </span>
            </div>
            <p style={{ fontSize:13, color:"#444", lineHeight:1.8, maxWidth:240, fontWeight:300 }}>
              3D-printed NFC keyrings. Any platform. Any colour. Made to order.
            </p>
            <div style={{ display:"flex", gap:8, marginTop:20 }}>
              {["X","Ig","Li","Yt"].map(s=>(
                <div key={s} style={{ width:32,height:32,borderRadius:6,border:"1px solid #1e1e1e",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#444",cursor:"pointer",
                  transition:"all .2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#444";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e1e";e.currentTarget.style.color="#444";}}
                >{s}</div>
              ))}
            </div>
          </div>
          {cols.map(col=>(
            <div key={col.t}>
              <div style={{ fontSize:10, color:"#333", fontWeight:700, letterSpacing:".18em", marginBottom:16 }}>{col.t.toUpperCase()}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {col.ls.map(l=>(
                  <a key={l} href="#" onClick={e=>e.preventDefault()} style={{ fontSize:13, color:"#444", transition:"color .2s", display:"block", fontWeight:300 }}
                    onMouseEnter={e=>e.target.style.color="#fff"}
                    onMouseLeave={e=>e.target.style.color="#444"}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid #141414", paddingTop:24, display:"flex",
          justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12,
        }}>
          <div style={{ fontSize:12, color:"#2a2a2a" }}>© 2025 NeoPrintLabs Ltd. All rights reserved.</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade8055" }}/>
            <span style={{ fontSize:10, color:"#2a2a2a", letterSpacing:".1em" }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── APP ────────────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  useReveal();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background:"#fff", minHeight:"100vh", overflowX:"hidden" }}>
      <Styles />
      <Nav scrolled={scrolled} />
      <Hero />
      <BrandsGrid selected={selectedBrand} onSelect={setSelectedBrand} />
      <Customiser initBrand={selectedBrand} />
      <HowItWorks />
      <Material />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

// app.js — ARME Global Script

// API anahtarını env.js dosyasından alıyoruz
let API_KEY = typeof ARME_CONFIG !== 'undefined' ? ARME_CONFIG.GEMINI_API_KEY : "";
let GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Eğer env.js yüklenemediyse uyarı ver
if (!API_KEY) {
    console.warn("env.js bulunamadı veya API_KEY eksik! Lütfen yapılandırmanızı kontrol edin.");
}

const NEWS_SOURCES = [
    { name:"Global Compact Türkiye", url:"https://www.globalcompactturkiye.org/", title:"Sürdürülebilirlik Raporları", desc:"Küresel ilkeler sözleşmesi doğrultusunda Türkiye'deki cinsiyet eşitliği çalışmaları." },
    { name:"UN Women Türkiye", url:"https://turkiye.unwomen.org/tr", title:"Toplumsal Cinsiyet Eşitliği Projeleri", desc:"BM Kadın Birimi'nin Türkiye'deki güncel haberleri ve eylem planları." },
    { name:"Kadının İnsan Hakları", url:"https://kadinininsanhaklari.org/", title:"Savunuculuk ve Yasal Gelişmeler", desc:"Kadın hakları savunuculuğu bağlamında hukuki ve toplumsal gelişmeler." },
    { name:"CEİD İzler", url:"https://ceidizler.ceid.org.tr/", title:"Cinsiyet Eşitliği İzleme", desc:"Türkiye genelinde cinsiyet eşitliğinin izlenmesine dair istatistikler." },
    { name:"TAPV", url:"https://www.tapv.org.tr", title:"Aile Sağlığı ve Planlaması", desc:"Kadın sağlığı ve eğitimde fırsat eşitliği üzerine güncel bültenler." },
    { name:"SistersLab", url:"https://sisterslab.org/", title:"Bilim ve Teknolojide Kadınlar", desc:"Kadınların STEM (Bilim, Teknoloji, Mühendislik, Matematik) alanlarındaki eğitimleri ve faaliyetleri." }
];

// ---- NEWS CARDS ----
function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    container.innerHTML = '';
    NEWS_SOURCES.forEach(src => {
        const a = document.createElement('a');
        a.href = src.url; a.target = '_blank'; a.className = 'news-card';
        a.innerHTML = `
            <span class="news-source-tag">${src.name}</span>
            <h3>${src.title}</h3>
            <p>${src.desc}</p>
            <div class="news-card-footer">
                <span><i class="fas fa-external-link-alt"></i> Kaynağa Git</span>
                <i class="fas fa-arrow-right"></i>
            </div>`;
        container.appendChild(a);
    });
}

// ---- GEMINI AI CHAT ----
const SYSTEM_PROMPT = `Sen ARME (Awareness, Rights, Mutuality, Equality) projesinin resmi yapay zeka asistanısın. Tek görevin, Birleşmiş Milletler Sürdürülebilir Kalkınma Amacı 5 (SDG 5) ve toplumsal cinsiyet eşitliği hakkında net ve bilimsel bilgiler sunmaktır.

KIRMIZI ÇİZGİLER VE REDDETME KURALLARI (EN ÖNEMLİ BÖLÜM):

Kapsam Dışı Her Şeyi Reddet: Ziyaretçi sana günlük selamlaşmalar (Selam, naber, nasılsın), spor, siyaset, magazin, yazılım, matematik veya SDG 5 / Toplumsal Cinsiyet Eşitliği ile DOĞRUDAN alakası olmayan herhangi bir şey yazarsa, soruyu kesinlikle yanıtlama. Konuyu asla senin alanına bağlamaya çalışma.

Standart Hata Mesajı: Konu dışı veya sohbet amaçlı her türlü girdiye SADECE ve TAM OLARAK şu cevabı ver:
"Ben ARME projesinin resmi asistanıyım. Ben bu amaçlar dışında sohbetlerinize cevap vermeyeceğim. Size sadece toplumsal cinsiyet eşitliği ve SDG 5 hedefleri hakkında bilgi verebilirim."
(Bu cümleye tek bir harf, kelime veya karşılama metni ekleme.)

Yanıt Formatı ve Kurallar (Konu Dahilindeki Sorular İçin):
- Asla emoji kullanma. Ciddiyetini koru.
- Kısa, öz ve net cevaplar ver. Cümlelerini yarım bırakma. Madde işaretleri kullan.

Sadece şu verileri ve konuları kullanarak cevap üret:
- SDG 5 Kapsamı: Kadınlara yönelik ayrımcılığı ve şiddeti sona erdirmek, eşit eğitim/iş fırsatları sunmak.
- Cam Tavan Sendromu: Kadınların liyakatlerine rağmen üst yönetim pozisyonlarına yükselmelerini engelleyen görünmez bariyerler.
- Türkiye İşgücü (Şubat 2024): Kadın işgücüne katılım %36.6, erkek %71.7.
- Küresel Kıyaslama: Türkiye'de kadın istihdamı %36 (parlamento %20); İsveç'te kadın istihdamı %60+ (parlamento %45).
- Toplumsal Algı Anketi: Toplumun %85.9'u erkeklerin lider olma ihtimalini yüksek görüyor. %71.8'i kadınların yönetici olmak için daha fazla çaba harcaması gerektiğine inanıyor.`;

// Basit Markdown to HTML çevirici (Madde işaretleri ve kalın metin için)
function formatResponse(text) {
    if (text.includes("Ben ARME projesinin resmi asistanıyım")) return text;
    
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\s*[-*]\s+(.*)/gm, '<li>$1</li>');
    
    if (html.includes('<li>')) {
        // Ardışık li'leri ul içine al
        html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');
    }
    return html.replace(/\n/g, '<br>');
}

async function callGemini(userMessage) {
    const requestBody = {
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
            {
                role: "user",
                parts: [{ text: userMessage }]
            }
        ],
        generationConfig: {
            temperature: 0, // En katı yanıtlar için 0
            maxOutputTokens: 800,
            topP: 0.1
        }
    };

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Servis şu an yoğun, lütfen tekrar deneyin.`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Yeniden deneyin.');
    return text.trim();
}

function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messages = document.getElementById('chat-messages');
    if (!input || !sendBtn || !messages) return;

    function addMsg(content, isUser) {
        const div = document.createElement('div');
        div.className = `msg ${isUser ? 'user' : 'ai'}`;
        const formatted = isUser ? content : formatResponse(content);
        div.innerHTML = `
            <div class="msg-bubble">${formatted}</div>
            <div class="msg-label">${isUser ? 'Siz' : 'ARME Asistanı'}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'msg ai typing-indicator';
        div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    async function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        sendBtn.disabled = true;
        addMsg(text, true);
        const typing = showTyping();
        try {
            const reply = await callGemini(text);
            typing.remove();
            addMsg(reply, false);
        } catch(e) {
            typing.remove();
            addMsg(e.message, false);
        }
        sendBtn.disabled = false;
        input.focus();
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', e => { if(e.key === 'Enter') handleSend(); });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.textContent;
            handleSend();
        });
    });
}

// ---- CONTACT FORM ----
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const success = document.getElementById('form-success');
        if (success) { success.style.display = 'block'; }
        form.reset();
        setTimeout(() => { if(success) success.style.display = 'none'; }, 5000);
    });
}

// ---- HAMBURGER + SCROLL NAV ----
function initNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    }
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    renderNews();
    initChat();
    initContactForm();
});

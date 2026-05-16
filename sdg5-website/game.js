// game.js — ARME Farkındalık Oyunu (Senaryo Tabanlı Karar Ağacı)

const GAME_DATA = {
    roles: [
        { id: 'student', name: 'Öğrenci', icon: 'fas fa-user-graduate' },
        { id: 'parent', name: 'Ebeveyn', icon: 'fas fa-home' },
        { id: 'corporate', name: 'Kurumsal Çalışan', icon: 'fas fa-briefcase' }
    ],
    scenarios: {
        corporate: {
            startId: 'q1',
            questions: {
                q1: {
                    text: 'Bir toplantıda çok önemli bir proje fikri önerdiniz ancak bir erkek iş arkadaşınız aynı fikri 5 dakika sonra kendi fikriymiş gibi tekrar sundu ve yöneticiden övgü aldı. Ne yaparsınız?',
                    options: [
                        { text: 'Nazikçe araya girerek, bu fikri az önce paylaştığınızı hatırlatır ve detaylandırırım.', nextId: 'q2', score: 1 },
                        { text: 'Çatışmadan kaçınmak için sessiz kalırım ve iş arkadaşımın övgü almasına izin veririm.', nextId: 'q2', score: 0 }
                    ]
                },
                q2: {
                    text: 'Yıllık terfi döneminde, sizden daha az deneyimli ve daha düşük performans verilerine sahip olan erkek bir iş arkadaşınızın üst pozisyona atandığını öğrendiniz. Tepkiniz ne olur?',
                    options: [
                        { text: 'Yöneticimden atama kriterleri hakkında şeffaf bir geri bildirim toplantısı talep ederim.', nextId: 'q3', score: 1 },
                        { text: 'Kararı sorgulamadan kabul eder, onun muhtemelen daha "lider ruhlu" olduğunu varsayarım.', nextId: 'q3', score: 0 }
                    ]
                },
                q3: {
                    text: 'Mola odasında kadınları aşağılayan veya cinsiyetçi kalıplar içeren bir şaka yapıldığını duydunuz. Herkes gülüyor. Nasıl davranırsınız?',
                    options: [
                        { text: 'Bu tür şakaların profesyonel olmayan ve rahatsız edici bir ortam yarattığını belirtirim.', nextId: 'end', score: 1 },
                        { text: 'Ortama uyum sağlamak ve dışlanmamak için ben de gülümserim.', nextId: 'end', score: 0 }
                    ]
                }
            }
        },
        student: {
            startId: 's1',
            questions: {
                s1: {
                    text: 'Sınıf içinde grup çalışması yapılacak. Liderlik pozisyonu için otomatik olarak erkek arkadaşlarınızın aday gösterildiğini fark ettiniz. Ne yaparsınız?',
                    options: [
                        { text: 'Liderlik için gönüllü olurum ve yetkinliklerimi anlatırım.', nextId: 's2', score: 1 },
                        { text: 'Not tutma gibi daha geri planda kalan görevleri üstlenirim.', nextId: 's2', score: 0 }
                    ]
                },
                s2: {
                    text: 'Bir kariyer gününde, mühendislik gibi alanların "erkek işi" olduğu imasında bulunulduğunu duydunuz. Düşünceniz nedir?',
                    options: [
                        { text: 'Mesleğin cinsiyeti olmadığını, yetenek ve ilginin önemli olduğunu savunurum.', nextId: 's3', score: 1 },
                        { text: 'Haklılık payı olabileceğini düşünür ve kendimi daha "kadınlara uygun" alanlara yönlendiririm.', nextId: 's3', score: 0 }
                    ]
                },
                s3: {
                    text: 'Akademik bir başarı elde ettiniz ancak çevrenizden "şanslı olduğunuz" veya "hocaların yardım ettiği" gibi imalar geldi. Tepkiniz?',
                    options: [
                        { text: 'Çalışmalarımı ve emeğimi net bir şekilde ortaya koyarak bu imaları reddederim.', nextId: 'end', score: 1 },
                        { text: 'Alçakgönüllülük adına bu imalara sessiz kalırım.', nextId: 'end', score: 0 }
                    ]
                }
            }
        },
        parent: {
            startId: 'p1',
            questions: {
                p1: {
                    text: 'Çocuklarınız ev işlerinde yardım ediyor. Kız çocuğunuza mutfak işlerini, erkek çocuğunuza tamirat işlerini mi verirsiniz?',
                    options: [
                        { text: 'Her ikisine de her türlü işi öğrenmeleri için dönüşümlü görevler veririm.', nextId: 'p2', score: 1 },
                        { text: 'Cinsiyetlerine uygun olduğunu düşündüğüm geleneksel işleri veririm.', nextId: 'p2', score: 0 }
                    ]
                },
                p2: {
                    text: 'Kızınız futbol oynamak, oğlunuz ise bale yapmak istediğini söyledi. Tepkiniz ne olur?',
                    options: [
                        { text: 'İlgilerini destekler ve kurslara kayıt yaptırırım.', nextId: 'p3', score: 1 },
                        { text: 'Daha "normal" karşılanan hobilere yönlendirmeye çalışırım.', nextId: 'p3', score: 0 }
                    ]
                },
                p3: {
                    text: 'Çocuğunuzun okul kitabında kadınların sadece evde, erkeklerin ise sadece dışarıda çalıştığı görseller var. Ne yaparsınız?',
                    options: [
                        { text: 'Bu görsellerin gerçeği yansıtmadığını ve her iki cinsiyetin de her yerde olabileceğini anlatırım.', nextId: 'end', score: 1 },
                        { text: 'Kitaptaki görselleri sorgulamadan geçerim.', nextId: 'end', score: 0 }
                    ]
                }
            }
        }
    }
};

class AwarenessGame {
    constructor() {
        this.currentRole = null;
        this.currentQuestionId = null;
        this.score = 0;
        this.maxScore = 0;
        
        this.container = document.getElementById('game-body');
        this.init();
    }

    init() {
        this.renderRoleSelection();
    }

    renderRoleSelection() {
        this.container.innerHTML = `
            <p class="question-text">Lütfen deneyimlemek istediğiniz rolü seçin:</p>
            <div class="role-grid">
                ${GAME_DATA.roles.map(role => `
                    <button class="role-btn" onclick="game.selectRole('${role.id}')">
                        <i class="${role.icon}"></i>
                        <span>${role.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    selectRole(roleId) {
        this.currentRole = roleId;
        this.currentQuestionId = GAME_DATA.scenarios[roleId].startId;
        this.score = 0;
        this.maxScore = Object.keys(GAME_DATA.scenarios[roleId].questions).length;
        
        this.transition(() => this.renderQuestion());
    }

    renderQuestion() {
        const scenario = GAME_DATA.scenarios[this.currentRole];
        const question = scenario.questions[this.currentQuestionId];

        this.container.innerHTML = `
            <p class="question-text">${question.text}</p>
            <div class="options-list">
                ${question.options.map((opt, idx) => `
                    <button class="option-btn" onclick="game.handleChoice(${idx})">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    handleChoice(optionIndex) {
        const scenario = GAME_DATA.scenarios[this.currentRole];
        const question = scenario.questions[this.currentQuestionId];
        const choice = question.options[optionIndex];

        this.score += choice.score;
        
        if (choice.nextId === 'end') {
            this.transition(() => this.renderResult());
        } else {
            this.currentQuestionId = choice.nextId;
            this.transition(() => this.renderQuestion());
        }
    }

    renderResult() {
        let title, desc, icon;
        const ratio = this.score / this.maxScore;

        if (ratio === 1) {
            icon = 'fas fa-award';
            title = 'Eşitlik Elçisi';
            desc = 'Kararlarınız tamamen toplumsal cinsiyet eşitliği ve SDG 5 vizyonuyla örtüşüyor. Farkındalığınızın yüksek olması, çevrenizdeki "Cam Tavan" bariyerlerini yıkmak için en büyük gücünüz.';
        } else if (ratio >= 0.5) {
            icon = 'fas fa-balance-scale';
            title = 'Farkındalık Yolcusu';
            desc = 'Eşitlik konusunda duyarlısınız ancak bazı durumlarda toplumsal kalıpların etkisi altında kalabiliyorsunuz. Unutmayın, değişim küçük ama kararlı adımlarla başlar.';
        } else {
            icon = 'fas fa-lightbulb';
            title = 'Yeni Bir Bakış Açısı';
            desc = 'Bazı kararlarınız geleneksel rollerin etkisinde kalmış olabilir. ARME projesi olarak sunduğumuz veriler ve eğitimlerle bu bakış açısını dönüştürmek elimizde.';
        }

        this.container.innerHTML = `
            <div class="result-card">
                <div class="result-icon"><i class="${icon}"></i></div>
                <h3 class="result-title">${title}</h3>
                <p class="result-desc">${desc}</p>
                
                <div class="result-stats">
                    <div class="stat-box">
                        <strong>%85.9</strong>
                        <span>Erkek liderlik algısı (TR)</span>
                    </div>
                    <div class="stat-box">
                        <strong>%36.6</strong>
                        <span>Kadın işgücü katılımı</span>
                    </div>
                </div>

                <button class="btn-primary" onclick="game.init()">
                    <i class="fas fa-redo"></i> Yeniden Başla
                </button>
            </div>
        `;
    }

    transition(callback) {
        this.container.classList.add('fade-out');
        setTimeout(() => {
            callback();
            this.container.classList.remove('fade-out');
            this.container.classList.add('fade-in');
            setTimeout(() => this.container.classList.remove('fade-in'), 400);
        }, 400);
    }
}

// Global instance
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new AwarenessGame();
});

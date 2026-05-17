# ARME - Awareness, Rights, Mutuality, Equality

## Proje Hakkinda
ARME, Birlesmis Milletler Surdurulebilir Kalkinma Amaci 5 (SDG 5): Toplumsal Cinsiyet Esitligi hedefleri dogrultusunda gelistirilmis, bilinclendirme ve egitim odakli bir web portalidir. Bu platform, kadinlara yonelik ayrimciligi sona erdirmeyi, egitim ve is firsatlarinda esitligi tesvik etmeyi ve toplumdaki farkindaligi artirmayi amaclayan veri odakli ve yapay zeka destekli bir yapi sunmaktadir.

Proje, modern web teknolojileri kullanilarak gelistirilmis olup, kullanicilara interaktif bir deneyim sunmayi hedeflemektedir.

## Temel Ozellikler

- Yapay Zeka Destekli Asistan: Sadece toplumsal cinsiyet esitligi ve SDG 5 uzerine egitilmis, konu disi sorulari reddedecek sekilde yapilandirilmis Google Gemini altyapili asistan.
- Interaktif Karar Agaci Oyunu: Kullanicilarin senaryo tabanli secimler yaparak farkli sosyal sonuclari ve esitsizlik durumlarini analiz edebilecekleri oyunlastirilmis egitim modulu.
- Dinamik Veri ve Kaynaklar: UN Women, Global Compact ve CEID gibi global/yerel kurumlardan derlenen guncel istatistiklerin ve surdurulebilirlik raporlarinin sergilendigi yapi.
- Coklu Dil Destegi: Google Translate entegrasyonu ile tasarimi bozmadan calisan Turkce/Ingilizce anlik cevirme ozelligi.
- Responsive (Mobil Uyumlu) Tasarim: Tum cihazlarda ve ekran cozunurluklerinde kusursuz calisan esnek DOM yapisi.

## Sayfa ve Modul Aciklamalari

### 1. Ana Sayfa (index.html)
Projenin karsilama ekranidir. Sayfa icerisinde:
- Particle (parcacik) animasyonlarina sahip dinamik baslik (Hero) alani.
- Turkiye ve dunya genelindeki isgucu ve parlamento temsiliyet oranlarini iceren, sayfa kaydirildiginda (scroll) sayan interaktif istatistik cubugu.
- Diger modullere hizli erisim saglayan gezinme kartlari.
- JavaScript ile yonetilen "Interaktif Farkindalik Oyunu"nun bulundugu ana bolum yer almaktadir.

### 2. Hakkimizda (hakkimizda.html)
ARME projesinin ortaya cikis nedenlerini, vizyonunu ve misyonunu detaylandiran sayfa. Toplumsal cinsiyet esitligi alanindaki uzun vadeli hedefler, projeyi hayata geciren temel motivasyonlar burada kullanicilara aktarilmaktadir. Tasarimda sade, okumayi kolaylastiran ve icerige odaklanmayi saglayan grid tabanli bir bilesen hiyerarsisi kullanilmistir.

### 3. Bilgilendirme (bilgilendirme.html)
Kadin haklari, aile planlamasi, egitimde firsat esitligi gibi konularda yetkin sivil toplum kuruluslarinin (Global Compact Turkiye, UN Women Turkiye, Kadinin Insan Haklari, TAPV, SistersLab vb.) calismalarinin ve guncel haber bultenlerinin listelendigi moduldur. Her kaynak kendi baglantisi uzerinden dis sayfalara guvenli yonlendirme saglar.

### 4. Sorular / AI Asistan (sorular.html)
Kullanicilarin SDG 5, cam tavan sendromu, esit ise esit ucret, Turkiye'deki cinsiyet esitsizligi istatistikleri gibi spesifik konularda sorular sorabilecegi sohbet ekranidir. Asistanin talimatlari kati kurallarla belirlenmis olup, eglence veya konu disi gorusmelere girmesi engellenmistir. Yanitlar Markdown formati kullanilarak duzenli HTML listeleri halinde sayfaya render edilir. Chatbot, kullanicinin kelime secimine gore anlik yazma animasyonlariyla (typing indicator) asenkron olarak calisir.

### 5. Iletisim (iletisim.html)
Kullanicilarin proje ekibiyle dogrudan baglanti kurmasini saglayan form yapisi ve ekip uyelerinin (Dokuz Eylul Universitesi gelistiricileri) iletisim bilgilerini iceren tasarimdir. Sayfa ici grid mimarisi ile yan yana olan form ve iletisim bilgileri, mobil cihazlarda dikey (column) yapisina pruzsuz sekilde gecis yapar.

## Kullanilan Teknolojiler ve Mimari

- Frontend Iskeleti: Saf HTML5 ve CSS3 kullanilmistir. Herhangi bir dis CSS framework'u (Bootstrap veya Tailwind vb.) kullanilmadan tamamen ozel "Vanilla CSS" degiskenleri ile insa edilmistir.
- JavaScript ve DOM Yonetimi: ES6+ standartlarinda yazilmis moduler yapidaki JS kodlari, oyun motorunu, API cagrilarini ve cevirme islemlerini (Google Translate Element) dinamik olarak yonetir.
- API Entegrasyonu: Google Generative AI (Gemini 1.5 Flash) REST API kullanilarak HTTP POST istekleri uzerinden asistan mimarisi kurulmustur.
- Tasarim Kaliplari: Glassmorphism efektleri, asenkron veri isleme, scroll-triggered (kaydirma tetiklemeli) animasyonlar kullanilmistir.

## Kurulum ve Calistirma Talimatlari

Proje tamamen istemci tarafi (Client-side) teknolojilerle gelistirildigi icin ek bir arka plan sunucusu (Node.js, Python vb.) gerektirmez.

1. Proje Deposu Klonlama
Git komut satirini kullanarak projeyi bilgisayariniza indirin:
git clone https://github.com/kadir465/ARME.git

2. Proje Klasorune Erisim
Komut satiri uzerinden klasore girin:
cd ARME/sdg5-website

3. Ortam Degiskenleri (API Ayarlari)
Yapay zeka asistaninin calisabilmesi icin aktif bir Google Gemini API anahtariniza ihtiyac vardir. Proje kok dizininde env.js adinda bir dosya olusturun ve asagidaki formati ekleyin:

const ARME_CONFIG = {
    GEMINI_API_KEY: "API_ANAHTARINIZI_BURAYA_GIRIN"
};

(Not: env.js dosyasi proje guvenligi amaciyla .gitignore icerisine dahil edilmistir, bu nedenle uzak depoya yansitilmaz.)

4. Projeyi Baslatma
Klasor icindeki index.html dosyasini tarayiciniz uzerinden dogrudan acabilirsiniz. Sayfa ici navigasyonlar ve guvenlik politikasi (CORS) yuzunden API cagrilarinda sorun yasamamak adina Visual Studio Code editorunun "Live Server" eklentisi uzerinden (veya basit bir localhost ile) calistirmaniz onemle tavsiye edilir.

## Telif Haklari
Bu proje, Dokuz Eylul Universitesi bunyesinde egitim ve farkindalik amaci tasinarak gelistirilmistir. Kullanilan istatistiksel veriler Birlesmis Milletler ve bagimsiz raporlardan derlenmistir. Tum kod haklari gelistiricilere aittir.

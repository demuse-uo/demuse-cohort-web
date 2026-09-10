// ===== Hamburger menu =====
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}


// ===== Slide reveal (animasi buka-tutup) =====
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // toggle, bukan add -> nutup lagi pas keluar layar
    entry.target.classList.toggle('open', entry.isIntersecting);
  });
}, {
  threshold: 0,
  rootMargin: '-12% 0px -12% 0px'
});

document.querySelectorAll('.slide-reveal').forEach(el => slideObserver.observe(el));


// ===== Countdown piknik =====
const cdBox = document.getElementById('countdown');

if (cdBox) {
  const targetDate = new Date('2026-08-30T09:00:00+07:00').getTime();
  let cdTimer;

  const updateCountdown = () => {
    const gap = targetDate - Date.now();

    if (gap <= 0) {
      cdBox.innerHTML = '<span class="cd-label">Hari H sudah tiba \u2014 selamat piknik, warga Kahyangan! \ud83c\udf89</span>';
      clearInterval(cdTimer);
      return;
    }

    const pad = (n) => String(n).padStart(2, '0');

    document.getElementById('cdDay').textContent  = pad(Math.floor(gap / 86400000));
    document.getElementById('cdHour').textContent = pad(Math.floor(gap / 3600000) % 24);
    document.getElementById('cdMin').textContent  = pad(Math.floor(gap / 60000) % 60);
    document.getElementById('cdSec').textContent  = pad(Math.floor(gap / 1000) % 60);
  };

  updateCountdown();
  cdTimer = setInterval(updateCountdown, 1000);
}


// ===== Galeri Birthday =====
// Format tgl: 'MM-DD'  //
const birthdays = [
  { nama: 'TARRY',   tgl: '07-15', foto: 'image/Ketua.jpg'    },
  { nama: 'ANIS',    tgl: '09-02', foto: 'image/anicccc.jpg', link: 'https://invitationwebsiteee-faa.github.io/kakanicc/' },
  { nama: 'TANTI',   tgl: '06-04', foto: 'image/tantiiii.jpg' },
  { nama: 'SILFA',   tgl: '12-02', foto: 'image/silfa.jpg'    },
  { nama: 'SITI',    tgl: '05-25', foto: 'image/siti.jpg'    },
  { nama: 'RASITI',  tgl: '06-10', foto: 'image/rasitiiii.jpg'},
  { nama: 'PUJI',    tgl: '08-26', foto: 'image/puji.jpg'},
  { nama: 'SEPTYANA',tgl: '09-04', foto: 'image/septyana.jpg'},
  { nama: 'LIKA',    tgl: '09-06', foto: 'image/Lika.jpg'},
  { nama: 'RIA',     tgl: '09-19', foto: 'image/ria.jpg'},
  { nama: 'ASFIRINASRI',   tgl: '09-21', foto: 'image/Asfirinasri.jpg'},
  { nama: 'ESTER',   tgl: '09-23', foto: 'image/ester.jpg'},
  { nama: 'MUJNAH',  tgl: '09-24', foto: 'image/mujnah.jpg'},
  { nama: 'RISMA',   tgl: '09-26', foto: 'image/risma.jpg'},
  { nama: 'TURINIH', tgl: '10-09', foto: 'image/rini.jpg'},
  { nama: 'ERNI',    tgl: '11-05', foto: 'image/Erni.jpg'},
  { nama: 'PRISKA',  tgl: '11-14', foto: 'image/priska.jpg'},
  { nama: 'MARDIANA',tgl: '11-29', foto: 'image/mardiana.jpg'},
  { nama: 'PONI',    tgl: '12-23', foto: 'image/poni.jpg'},
  { nama: 'SANTI',   tgl: '01-24', foto: 'image/santiiiii.jpg'},
  { nama: 'JENI',    tgl: '02-15', foto: 'image/jeni.jpg'},
  { nama: 'IKA',     tgl: '02-24', foto: 'image/ika.jpg'},
  { nama: 'AJENG',   tgl: '03-07', foto: 'image/Ajeng.jpg'},
  { nama: 'REZA',    tgl: '03-16', foto: 'image/reza.jpg'},
  { nama: 'WINI',    tgl: '03-20', foto: 'image/wini.jpg'},
  { nama: 'NURUL',   tgl: '03-28', foto: 'image/nurul.jpg'},
  { nama: 'ERNING',  tgl: '04-12', foto: 'image/erninggg.jpg'},
  { nama: 'MEGA',    tgl: '04-14', foto: 'image/Mega.jpg'},
  { nama: 'QOMARIYAH',     tgl: '04-16', foto: 'image/qomariah.jpg'},
  { nama: 'SIPORA',     tgl: '04-27', foto: 'image/sipora.jpg'},
  // ...lanjutin sisanya di sini
];

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni',
               'Juli','Agustus','September','Oktober','November','Desember'];

function sisaHari(tgl) {
  const [bln, hari] = tgl.split('-').map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let next = new Date(today.getFullYear(), bln - 1, hari);
  if (next < today) next.setFullYear(next.getFullYear() + 1);   // udah lewat -> tahun depan

  return Math.round((next - today) / 86400000);
}

const bdayGrid = document.getElementById('bdayGrid');

if (bdayGrid) {
  const urut = [...birthdays].sort((a, b) => sisaHari(a.tgl) - sisaHari(b.tgl));

  bdayGrid.innerHTML = urut.map(orang => {
    const [bln, hari] = orang.tgl.split('-').map(Number);
    const sisa = sisaHari(orang.tgl);

    let teksSisa;
    if (sisa === 0)      teksSisa = '\ud83c\udf89 Hari ini ulang tahun!';
    else if (sisa === 1) teksSisa = 'Besok!';
    else                 teksSisa = sisa + ' hari lagi';

    // kalau punya link -> jadi <a>, kalau nggak -> tetap <div>
    const tag  = orang.link ? 'a' : 'div';
    const href = orang.link ? ` href="${orang.link}" target="_blank" rel="noopener"` : '';
    const klik = orang.link ? ' has-link' : '';
    const tanda = orang.link ? '<span class="bday-arrow">&rarr;</span>' : '';

    return `
      <${tag}${href} class="bday-card${klik} ${sisa === 0 ? 'today' : ''}">
        <img src="${orang.foto}" alt="Foto ${orang.nama}">
        <div class="bday-info">
          <b>${orang.nama}</b>
          <span class="tanggal">${hari} ${BULAN[bln - 1]}</span>
          <span class="sisa">${teksSisa}</span>
        </div>
        ${tanda}
      </${tag}>`;
  }).join('');
}


// ===== Lightbox galeri =====
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lbImg     = document.getElementById('lbImg');
  const lbVideo   = document.getElementById('lbVideo');
  const lbCaption = document.getElementById('lbCaption');

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lbVideo) {
      lbVideo.pause();      // stop suara pas ditutup
      lbVideo.src = '';
    }
  };

  document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', () => {
      const vid = card.querySelector('video');

      if (vid && lbVideo) {
        // isinya video
        lbVideo.src = vid.getAttribute('src');
        lbVideo.load();
        lbVideo.classList.remove('lb-hide');
        lbImg.classList.add('lb-hide');
      } else {
        // isinya foto
        const img = card.querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbImg.classList.remove('lb-hide');
        if (lbVideo) lbVideo.classList.add('lb-hide');
      }

      lbCaption.innerHTML = card.querySelector('figcaption').innerHTML;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('lbClose').addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}


// ===== Back to top =====
const toTop = document.getElementById('toTop');

if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 400);
  });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
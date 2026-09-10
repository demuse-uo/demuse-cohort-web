/* =========================================================
   MADING deMuse
   Ganti URL di bawah dengan URL Web App dari Apps Script.
   ========================================================= */
const MADING_API = 'https://script.google.com/macros/s/AKfycbyd7dWhpBHOdcD0A07JDTwm7nP3QYp-ThmC-cBLNBM_WKN3P6-eDHsz25c7guTY15-nxA/exec';

const MAX_MB = 5;   // batas ukuran file


const grid = document.getElementById('madingGrid');

if (grid) {

  const form      = document.getElementById('madingForm');
  const toggle    = document.getElementById('toggleForm');
  const tombolKirim = document.getElementById('mfKirim');
  const status    = document.getElementById('mfStatus');
  const filterBox = document.getElementById('madingFilter');

  let semuaData = [];
  let kategoriAktif = 'Semua';

  const IKON = {
    'Pengumuman':  'fa-bullhorn',
    'Materi':      'fa-book',
    'Rangkuman':   'fa-file-lines',
    'Tips Belajar':'fa-lightbulb',
    'Lainnya':     'fa-thumbtack'
  };


  /* ---------- buka tutup form ---------- */
  toggle.addEventListener('click', () => {
    form.hidden = !form.hidden;
    toggle.innerHTML = form.hidden
      ? '<i class="fa-solid fa-plus"></i> Tempel Sesuatu'
      : '<i class="fa-solid fa-xmark"></i> Tutup Form';
  });


  /* ---------- ubah tanggal jadi teks Indonesia ---------- */
  const BLN = ['Jan','Feb','Mar','Apr','Mei','Jun',
               'Jul','Agu','Sep','Okt','Nov','Des'];

  function tanggalRapi(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`;
  }


  /* ---------- cegah teks kiriman jadi kode HTML ---------- */
  function aman(teks) {
    const div = document.createElement('div');
    div.textContent = teks == null ? '' : String(teks);
    return div.innerHTML;
  }


  /* ---------- gambar kartu ---------- */
  function tampilkan() {
    const data = kategoriAktif === 'Semua'
      ? semuaData
      : semuaData.filter(x => x.kategori === kategoriAktif);

    if (!data.length) {
      grid.innerHTML = '<p class="mading-loading">Belum ada kiriman di kategori ini.</p>';
      return;
    }

    grid.innerHTML = data.map(x => {
      const ikon = IKON[x.kategori] || 'fa-thumbtack';

      const tombolLink = x.link
        ? `<a href="${aman(x.link)}" target="_blank" rel="noopener" class="md-aksi">
             <i class="fa-solid fa-link"></i> Buka Link</a>`
        : '';

      const tombolFile = x.fileUrl
        ? `<a href="${aman(x.fileUrl)}" target="_blank" rel="noopener" class="md-aksi">
             <i class="fa-solid fa-paperclip"></i> ${aman(x.fileNama)}</a>`
        : '';

      const isi = x.isi
        ? `<p class="md-isi">${aman(x.isi).replace(/\n/g, '<br>')}</p>`
        : '';

      return `
        <article class="md-card">
          <span class="md-tag"><i class="fa-solid ${ikon}"></i> ${aman(x.kategori)}</span>
          <h3>${aman(x.judul)}</h3>
          ${isi}
          <div class="md-aksi-row">${tombolLink}${tombolFile}</div>
          <footer class="md-meta">
            <span>${aman(x.nama)}</span>
            <span>${tanggalRapi(x.waktu)}</span>
          </footer>
        </article>`;
    }).join('');
  }


  /* ---------- tombol saringan kategori ---------- */
  function buatFilter() {
    const daftar = ['Semua', ...new Set(semuaData.map(x => x.kategori))];

    filterBox.innerHTML = daftar.map(k =>
      `<button class="md-filter${k === kategoriAktif ? ' aktif' : ''}" data-k="${aman(k)}">${aman(k)}</button>`
    ).join('');

    filterBox.querySelectorAll('.md-filter').forEach(b => {
      b.addEventListener('click', () => {
        kategoriAktif = b.dataset.k;
        buatFilter();
        tampilkan();
      });
    });
  }


  /* ---------- ambil data dari Sheets ---------- */
  async function muat() {
    try {
      const res = await fetch(MADING_API);
      semuaData = await res.json();

      if (!semuaData.length) {
        grid.innerHTML = '<p class="mading-loading">Mading masih kosong. Jadi yang pertama nempel, yuk!</p>';
        return;
      }

      buatFilter();
      tampilkan();

    } catch (err) {
      grid.innerHTML = '<p class="mading-loading">Gagal memuat kiriman. Coba muat ulang halaman.</p>';
      console.error(err);
    }
  }


  /* ---------- ubah file jadi teks base64 ---------- */
  function bacaFile(file) {
    return new Promise((selesai, gagal) => {
      const r = new FileReader();
      r.onload  = () => selesai(r.result.split(',')[1]);
      r.onerror = () => gagal(new Error('Gagal membaca file'));
      r.readAsDataURL(file);
    });
  }


  /* ---------- kirim ---------- */
  tombolKirim.addEventListener('click', async () => {
    const nama  = document.getElementById('mfNama').value.trim();
    const judul = document.getElementById('mfJudul').value.trim();
    const berkas = document.getElementById('mfFile').files[0];

    if (!nama || !judul) {
      status.textContent = 'Nama dan judul wajib diisi ya.';
      status.className = 'mf-status gagal';
      return;
    }

    if (berkas && berkas.size > MAX_MB * 1024 * 1024) {
      status.textContent = `File kegedean. Maksimal ${MAX_MB} MB.`;
      status.className = 'mf-status gagal';
      return;
    }

    tombolKirim.disabled = true;
    status.textContent = 'Mengirim...';
    status.className = 'mf-status';

    const kiriman = {
      nama:     nama,
      kategori: document.getElementById('mfKategori').value,
      judul:    judul,
      isi:      document.getElementById('mfIsi').value.trim(),
      link:     document.getElementById('mfLink').value.trim()
    };

    try {
      if (berkas) {
        kiriman.fileData = await bacaFile(berkas);
        kiriman.fileNama = berkas.name;
        kiriman.fileTipe = berkas.type;
      }

      const res = await fetch(MADING_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(kiriman)
      });

      const hasil = await res.json();

      if (hasil.ok) {
        status.textContent = 'Berhasil ditempel! 🎉';
        status.className = 'mf-status sukses';

        ['mfNama','mfJudul','mfIsi','mfLink','mfFile'].forEach(id => {
          document.getElementById(id).value = '';
        });

        setTimeout(() => {
          form.hidden = true;
          toggle.innerHTML = '<i class="fa-solid fa-plus"></i> Tempel Sesuatu';
          status.textContent = '';
          muat();
        }, 1400);

      } else {
        status.textContent = 'Gagal: ' + (hasil.pesan || 'coba lagi');
        status.className = 'mf-status gagal';
      }

    } catch (err) {
      status.textContent = 'Gagal mengirim. Cek koneksi lalu coba lagi.';
      status.className = 'mf-status gagal';
      console.error(err);
    }

    tombolKirim.disabled = false;
  });


  muat();
}

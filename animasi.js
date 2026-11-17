/* =========================================================================
   ANIMASI SCROLL deMUSE  —  GSAP + ScrollTrigger
   Dipakai di SEMUA halaman: index, galeri, birthday, mading.
   -------------------------------------------------------------------------
   File ini HANYA mengatur animasi. Logika lain (menu, kalender ulang tahun,
   lightbox, mading) tetap di script.js dan mading.js.

   KELAS YANG BISA DIPAKAI DI HTML
     .anim-hero    elemen layar pembuka — muncul sekali saat halaman dibuka
     .anim-masuk   judul & teks — memudar naik
     .anim-kartu   kartu — muncul berurutan sambil sedikit membesar
     .anim-pudar   hanya memudar, tanpa gerak
                   (dipakai untuk polaroid, karena polaroid sudah punya
                    kemiringan sendiri yang tidak boleh ditimpa)
     .anim-baris   item daftar — meluncur dari kiri

   ANIMASINYA BOLAK-BALIK
     Saat elemen masuk layar  -> muncul
     Saat elemen keluar layar -> kembali tersembunyi
     Jadi animasinya jalan lagi setiap kali discroll naik maupun turun.

   CARA MENAMBAH ELEMEN BARU
     Cukup tambahkan salah satu kelas di atas pada elemen HTML-nya.
     File ini tidak perlu disentuh.

   PENTING
     Harus dimuat SETELAH gsap.min.js dan ScrollTrigger.min.js
   ========================================================================= */


/* -------------------------------------------------------------------------
   PENGAMAN: kalau GSAP gagal dimuat, tampilkan semua konten apa adanya.
   ------------------------------------------------------------------------- */
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
  document.documentElement.classList.remove('gsap-siap');
  console.warn('GSAP tidak termuat. Animasi dilewati, konten tetap tampil.');

} else {

  gsap.registerPlugin(ScrollTrigger);


  /* -----------------------------------------------------------------------
     PENGATURAN — ubah angka di sini kalau animasi terasa
     kecepetan, kelambatan, atau terlalu jauh geraknya.
     ----------------------------------------------------------------------- */
  const SETELAN = {
    durasi: 0.7,          // lama animasi muncul (detik)
    balik:  0.4,          // lama animasi menghilang — sengaja lebih cepat
    jarak:  40,           // jarak luncur (piksel)
    jeda:   0.07,         // jeda antar kartu
    pelan:  'power3.out',
    mulai:  'top 88%',    // mulai saat puncak elemen di 88% tinggi layar
    habis:  'bottom 12%'  // kembali tersembunyi saat hampir keluar layar
  };


  const mm = gsap.matchMedia();


  /* =======================================================================
     A. PENGGUNA YANG MEMATIKAN ANIMASI  (prefers-reduced-motion)
     ======================================================================= */
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.anim-hero, .anim-masuk, .anim-kartu, .anim-pudar, .anim-baris', {
      opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'all'
    });
  });


  /* =======================================================================
     B. ANIMASI NORMAL
     ======================================================================= */
  mm.add(
    {
      hp:    '(prefers-reduced-motion: no-preference) and (max-width: 820px)',
      layar: '(prefers-reduced-motion: no-preference) and (min-width: 821px)'
    },
    (konteks) => {

      const { hp } = konteks.conditions;

      // di HP gerakan dipendekkan supaya terasa ringan
      const jarak  = hp ? SETELAN.jarak * 0.6 : SETELAN.jarak;
      const durasi = hp ? SETELAN.durasi * 0.8 : SETELAN.durasi;
      const jeda   = hp ? SETELAN.jeda * 0.6  : SETELAN.jeda;


      /* ------------------------------------------------------------------
         1. LAYAR PEMBUKA — sekali saat halaman dibuka, tidak ikut scroll.
         Bagian ini memang di paling atas, jadi tidak perlu bolak-balik.
         ------------------------------------------------------------------ */
      if (document.querySelector('.anim-hero')) {
        gsap.to('.anim-hero', {
          opacity: 1, y: 0,
          duration: durasi,
          ease: SETELAN.pelan,
          stagger: 0.12,
          delay: 0.15
        });
      }


      /* ------------------------------------------------------------------
         2. JUDUL & TEKS — memudar naik, bolak-balik.

         toggleActions punya empat nilai, berurutan:
           masuk-dari-bawah | keluar-ke-atas | masuk-lagi-dari-atas | keluar-ke-bawah
         'play reverse play reverse' artinya:
           muncul saat masuk layar, tersembunyi lagi saat keluar —
           dari arah mana pun.
         ------------------------------------------------------------------ */
      gsap.utils.toArray('.anim-masuk').forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0,
          duration: durasi,
          ease: SETELAN.pelan,
          scrollTrigger: {
            trigger: el,
            start: SETELAN.mulai,
            end:   SETELAN.habis,
            toggleActions: 'play reverse play reverse'
          }
        });
      });


      /* ------------------------------------------------------------------
         3. BARIS DAFTAR — meluncur dari kiri, bolak-balik.
         ------------------------------------------------------------------ */
      gsap.utils.toArray('.anim-baris').forEach((el) => {
        gsap.to(el, {
          opacity: 1, x: 0,
          duration: durasi,
          ease: SETELAN.pelan,
          scrollTrigger: {
            trigger: el,
            start: SETELAN.mulai,
            end:   SETELAN.habis,
            toggleActions: 'play reverse play reverse'
          }
        });
      });


      /* ------------------------------------------------------------------
         4. KARTU — muncul berurutan per kelompok, bolak-balik.

         ScrollTrigger.batch() mengumpulkan kartu yang masuk layar
         bersamaan lalu menganimasikannya sekaligus. Penting karena kartu
         anggota ada 31 buah; tanpa batch, browser harus mengurus 31
         pemicu terpisah dan scroll jadi tersendat di HP.

         Empat kejadian yang ditangani:
           onEnter     masuk layar dari bawah  -> muncul
           onLeave     keluar layar ke atas    -> sembunyi
           onEnterBack masuk lagi dari atas    -> muncul
           onLeaveBack keluar layar ke bawah   -> sembunyi
         ------------------------------------------------------------------ */
      const munculKartu = (kelompok) => gsap.to(kelompok, {
        opacity: 1, y: 0, scale: 1,
        duration: durasi,
        ease: SETELAN.pelan,
        stagger: jeda,
        overwrite: true
      });

      const sembunyiKartu = (kelompok) => gsap.to(kelompok, {
        opacity: 0, y: jarak, scale: 0.96,
        duration: SETELAN.balik,
        ease: 'power2.in',
        overwrite: true
      });

      ScrollTrigger.batch('.anim-kartu', {
        start: SETELAN.mulai,
        end:   SETELAN.habis,
        batchMax: hp ? 4 : 8,
        onEnter:     munculKartu,
        onEnterBack: munculKartu,
        onLeave:     sembunyiKartu,
        onLeaveBack: sembunyiKartu
      });


      /* ------------------------------------------------------------------
         5. HANYA MEMUDAR — untuk polaroid galeri.
         Polaroid punya kemiringan sendiri (rotate) dari CSS. Kalau di sini
         ikut diatur geraknya, kemiringannya hilang. Jadi yang diubah
         cuma tingkat kepekatannya.
         ------------------------------------------------------------------ */
      const munculPudar   = (k) => gsap.to(k, {
        opacity: 1, duration: durasi, ease: SETELAN.pelan,
        stagger: jeda, overwrite: true
      });
      const sembunyiPudar = (k) => gsap.to(k, {
        opacity: 0, duration: SETELAN.balik, ease: 'power2.in', overwrite: true
      });

      ScrollTrigger.batch('.anim-pudar', {
        start: SETELAN.mulai,
        end:   SETELAN.habis,
        batchMax: hp ? 4 : 8,
        onEnter:     munculPudar,
        onEnterBack: munculPudar,
        onLeave:     sembunyiPudar,
        onLeaveBack: sembunyiPudar
      });


      /* ------------------------------------------------------------------
         6. ATUR ULANG setelah gambar selesai dimuat.
         Tinggi halaman berubah saat foto masuk, jadi titik pemicunya
         harus dihitung ulang supaya tidak meleset.
         ------------------------------------------------------------------ */
      window.addEventListener('load', () => ScrollTrigger.refresh());

    }
  );
}

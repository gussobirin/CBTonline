import { ExamPackage, SchoolSettings } from '../types/cbt';

export const defaultSchoolSettings: SchoolSettings = {
  schoolName: 'SMK Negeri 1 Rekayasa & Informatika',
  examHeaderTitle: 'UJIAN BERBASIS KOMPUTER (CBT) TAHUN AJARAN 2025/2026',
  academicYear: '2025/2026 - Genap',
  curriculum: 'Kurikulum Merdeka Kejuruan',
  principalName: 'Drs. H. Mulyadi, M.Kom.',
  chiefProctorName: 'Agus Sobirin, S.Kom., M.T.'
};

export const sampleExams: ExamPackage[] = [
  {
    id: 'ukk-rpl-2026',
    title: 'Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak',
    subject: 'Pemrograman Web, Perangkat Bergerak & Basis Data',
    gradeLevel: 'Kelas XII RPL',
    description: 'Ujian teori kejuruan standar nasional kompetensi keahlian RPL: Arsitektur MVC, REST API, Database Query, Asynchronous JS, dan Keamanan Web.',
    durationMinutes: 45,
    token: 'RPL2026',
    tokenActive: true,
    passingGrade: 75,
    randomizeQuestions: false,
    randomizeChoices: false,
    allowReview: true,
    showScoreImmediately: true,
    strictFullscreen: true,
    maxViolations: 3,
    createdAt: '2026-03-01T08:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'single_choice',
        category: 'REST API & Web Service',
        questionText: 'Perhatikan potongan kode pembuatan endpoint REST API Express.js berikut ini. HTTP Status Code yang paling tepat untuk menggantikan `[KODE_STATUS]` saat data berhasil dibuat di database adalah:',
        codeSnippet: {
          language: 'javascript',
          code: `app.post('/api/v1/products', async (req, res) => {
  try {
    const newProduct = await db.products.create({ data: req.body });
    return res.status([KODE_STATUS]).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: newProduct
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});`
        },
        options: [
          { id: 'A', text: '200 OK' },
          { id: 'B', text: '201 Created' },
          { id: 'C', text: '204 No Content' },
          { id: 'D', text: '304 Not Modified' },
          { id: 'E', text: '202 Accepted' }
        ],
        correctAnswer: 'B',
        points: 10,
        difficulty: 'Mudah',
        explanation: 'Status 201 Created adalah kode standar HTTP yang mengindikasikan bahwa permintaan POST berhasil dan entitas/sumber daya baru telah sukses dibuat di server.'
      },
      {
        id: 'q2',
        type: 'single_choice',
        category: 'Basis Data Relasional (SQL)',
        questionText: 'Diberikan tabel `siswa` (id, nama, kelas_id) dan tabel `kelas` (id, nama_kelas). Kita ingin menampilkan seluruh data kelas berserta nama siswa yang terdaftar di kelas tersebut, termasuk kelas yang saat ini belum memiliki siswa sama sekali. Jenis JOIN yang paling tepat digunakan adalah:',
        codeSnippet: {
          language: 'sql',
          code: `SELECT k.nama_kelas, s.nama
FROM kelas k
[JENIS_JOIN] siswa s ON k.id = s.kelas_id;`
        },
        options: [
          { id: 'A', text: 'INNER JOIN' },
          { id: 'B', text: 'RIGHT JOIN' },
          { id: 'C', text: 'LEFT JOIN' },
          { id: 'D', text: 'CROSS JOIN' },
          { id: 'E', text: 'FULL OUTER JOIN yang diurutkan' }
        ],
        correctAnswer: 'C',
        points: 10,
        difficulty: 'Sedang',
        explanation: 'LEFT JOIN mengambil semua baris dari tabel kiri (kelas) meskipun tidak ada kecocokan baris di tabel kanan (siswa). Dengan demikian kelas yang belum memiliki siswa tetap akan tampil dengan nilai kolom siswa bernilai NULL.'
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        category: 'Arsitektur & Clean Code',
        questionText: 'Dalam prinsip SOLID pada Object-Oriented Programming (OOP), pilihlah DUA prinsip berikut yang paling tepat sesuai definisinya! (Pilihan Ganda Kompleks)',
        options: [
          { id: 'A', text: 'Single Responsibility Principle (SRP): Setiap class hanya boleh memiliki satu alasan untuk berubah (satu tanggung jawab utama).' },
          { id: 'B', text: 'Open/Closed Principle (OCP): Class harus terbuka untuk modifikasi langsung dan tertutup dari penambahan ekstensi.' },
          { id: 'C', text: 'Dependency Inversion Principle (DIP): Modul tingkat tinggi harus bergantung pada modul tingkat rendah secara langsung.' },
          { id: 'D', text: 'Interface Segregation Principle (ISP): Klien tidak boleh dipaksa bergantung pada interface atau method yang tidak digunakannya.' }
        ],
        correctAnswer: ['A', 'D'],
        points: 15,
        difficulty: 'Sedang',
        explanation: 'Pilihan A (SRP) dan D (ISP) benar sesuai standar Robert C. Martin. Pilihan B salah karena OCP mengharuskan class "terbuka untuk ekstensi, namun tertutup untuk modifikasi langsung". Pilihan C salah karena DIP menyatakan modul tingkat tinggi maupun rendah harus bergantung pada abstraksi.'
      },
      {
        id: 'q4',
        type: 'single_choice',
        category: 'JavaScript Asynchronous',
        questionText: 'Perhatikan urutan eksekusi JavaScript Event Loop pada cuplikan kode di bawah ini. Urutan output angka pada terminal konsol yang benar adalah:',
        codeSnippet: {
          language: 'javascript',
          code: `console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);`
        },
        options: [
          { id: 'A', text: '1 -> 2 -> 3 -> 4' },
          { id: 'B', text: '1 -> 4 -> 2 -> 3' },
          { id: 'C', text: '1 -> 4 -> 3 -> 2' },
          { id: 'D', text: '1 -> 3 -> 4 -> 2' },
          { id: 'E', text: '4 -> 1 -> 3 -> 2' }
        ],
        correctAnswer: 'C',
        points: 15,
        difficulty: 'Sukar',
        explanation: 'Eksekusi sinkron berjalan lebih dulu: log(1) lalu log(4). Kemudian microtask queue (Promise.then) dieksekusi menghasilkan log(3). Terakhir macrotask queue (setTimeout callback) dieksekusi menghasilkan log(2). Sehingga urutan adalah 1 -> 4 -> 3 -> 2.'
      },
      {
        id: 'q5',
        type: 'true_false',
        category: 'Keamanan Web (Cybersecurity)',
        questionText: 'Penyimpanan token autentikasi JWT (JSON Web Token) yang sensitif di dalam `localStorage` browser jauh lebih aman dari serangan Cross-Site Scripting (XSS) dibandingkan menyimpannya di cookie dengan flag `HttpOnly` dan `Secure`.',
        options: [
          { id: 'A', text: 'BENAR (True)' },
          { id: 'B', text: 'SALAH (False)' }
        ],
        correctAnswer: 'B',
        points: 10,
        difficulty: 'Mudah',
        explanation: 'Pernyataan SALAH. LocalStorage dapat diakses dengan mudah oleh skrip JavaScript apapun yang berjalan di halaman web, sehingga rentan dicuri saat terjadi eksploitasi XSS. Sebaliknya, cookie ber-flag HttpOnly tidak dapat dibaca oleh client-side JavaScript.'
      },
      {
        id: 'q6',
        type: 'single_choice',
        category: 'Version Control (Git)',
        questionText: 'Seorang developer ingin menggabungkan commit dari branch `feature-login` ke branch `main`, namun ia ingin seluruh riwayat commit dari `feature-login` dipadatkan menjadi SATU commit tunggal yang rapi di `main`. Perintah Git yang tepat adalah:',
        codeSnippet: {
          language: 'bash',
          code: `git checkout main
git [PERINTAH_MERGE] feature-login`
        },
        options: [
          { id: 'A', text: 'merge --no-ff' },
          { id: 'B', text: 'merge --squash' },
          { id: 'C', text: 'rebase -i' },
          { id: 'D', text: 'cherry-pick' },
          { id: 'E', text: 'pull --rebase' }
        ],
        correctAnswer: 'B',
        points: 10,
        difficulty: 'Sedang',
        explanation: 'Flag `git merge --squash feature-login` memadatkan semua perubahan commit dari branch fitur ke dalam working directory dan staging area branch aktif sebagai satu commit baru.'
      },
      {
        id: 'q7',
        type: 'single_choice',
        category: 'Algoritma & Struktur Data',
        questionText: 'Manakah struktur data yang menerapkan mekanisme LIFO (Last-In First-Out) dan umum digunakan pada fitur tombol Undo/Redo serta call-stack pada interpreter bahasa pemrograman?',
        options: [
          { id: 'A', text: 'Queue (Antrean)' },
          { id: 'B', text: 'Binary Search Tree' },
          { id: 'C', text: 'Stack (Tumpukan)' },
          { id: 'D', text: 'Linked List' },
          { id: 'E', text: 'Hash Map' }
        ],
        correctAnswer: 'C',
        points: 10,
        difficulty: 'Mudah',
        explanation: 'Stack (tumpukan) menerapkan prinsip LIFO di mana elemen terakhir yang dimasukkan (push) adalah yang pertama kali dikeluarkan (pop).'
      },
      {
        id: 'q8',
        type: 'essay',
        category: 'Rekayasa Perangkat Lunak',
        questionText: 'Jelaskan perbedaan mendasar antara arsitektur Monolithic dan arsitektur Microservices, serta sebutkan minimal 2 keuntungan dan 2 tantangan dalam menerapkan Microservices pada aplikasi enterprise!',
        correctAnswer: 'Arsitektur Monolithic menggabungkan seluruh modul dalam satu basis kode dan deployment terpadu, sedangkan Microservices memecah sistem menjadi service independen kecil yang berkomunikasi via API. Keuntungan: skalabilitas independen, isolasi error. Tantangan: kompleksitas orkestrasi jaringan, konsistensi data terdistribusi.',
        points: 20,
        difficulty: 'Sedang',
        explanation: 'Kunci jawaban mencakup: definisi monolitik vs microservices, keuntungan (skalabilitas per modul, fleksibilitas stack), dan tantangan (distribusi transaksi, monitoring log, overhead jaringan).'
      }
    ]
  },
  {
    id: 'anbk-digital-2026',
    title: 'Simulasi Asesmen Kompetensi Minimum (AKM) Literasi & Digital',
    subject: 'Literasi Digital & Penalaran Algoritmik',
    gradeLevel: 'Kelas XI SMK / SMA',
    description: 'Simulasi ANBK resmi untuk melatih kemampuan literasi membaca, interpretasi data grafik, dan logika pemecahan masalah komputasional.',
    durationMinutes: 30,
    token: 'AKM2026',
    tokenActive: true,
    passingGrade: 70,
    randomizeQuestions: false,
    randomizeChoices: true,
    allowReview: true,
    showScoreImmediately: true,
    strictFullscreen: true,
    maxViolations: 2,
    createdAt: '2026-03-02T09:00:00Z',
    questions: [
      {
        id: 'akm1',
        type: 'single_choice',
        category: 'Logika Algoritmik',
        questionText: 'Sebuah robot pengantar barang diprogram dengan aturan: Jika mendeteksi halangan di depan berjarak < 30 cm, robot berputar 90 derajat ke kanan. Jika jalan kanan buntu, robot berputar 180 derajat ke belakang. Jika robot berada di lorong lurus dengan halangan di depan dan dinding di sebelah kanannya, aksi yang akan dilakukan robot adalah:',
        options: [
          { id: 'A', text: 'Tetap maju hingga menabrak halangan' },
          { id: 'B', text: 'Berputar 90 derajat ke kanan lalu menabrak dinding' },
          { id: 'C', text: 'Mendeteksi halangan, mengecek ke kanan (buntu), lalu berbalik 180 derajat ke belakang' },
          { id: 'D', text: 'Berhenti total dan mematikan daya mesin' }
        ],
        correctAnswer: 'C',
        points: 25,
        difficulty: 'Mudah',
        explanation: 'Berdasarkan runtutan kondisi algoritma (conditional branching), robot mendeteksi dinding di kanan sehingga kondisi kedua (jalan kanan buntu) terpenuhi dan robot berputar 180 derajat.'
      },
      {
        id: 'akm2',
        type: 'single_choice',
        category: 'Literasi Keamanan Digital',
        questionText: 'Pak Hendra menerima pesan WhatsApp dari nomor asing yang mengaku dari pihak ekspedisi paket kilat. Pesan tersebut melampirkan berkas dengan nama `Foto_Paket_JNE_2026.apk` dan meminta segera diinstal untuk melacak paket. Tindakan yang paling tepat dan aman sesuai prinsip literasi digital adalah:',
        options: [
          { id: 'A', text: 'Mengunduh dan langsung menginstal berkas agar paket tidak hilang' },
          { id: 'B', text: 'Mengirimkan pesan tersebut ke grup keluarga untuk meminta pendapat' },
          { id: 'C', text: 'Membuka berkas lewat laptop dengan kabel data' },
          { id: 'D', text: 'Menghapus pesan, memblokir nomor, dan tidak menginstal berkas karena ekstensi .apk mengindikasikan malware/trojan peretas SMS banking' }
        ],
        correctAnswer: 'D',
        points: 25,
        difficulty: 'Mudah',
        explanation: 'Modus penipuan berkas berkedok foto paket dengan ekstensi .apk (Android Package Kit) sering digunakan untuk mencuri kredensial SMS OTP perbankan. Tindakan benar adalah tidak menginstalnya sama sekali dan memblokir pengirim.'
      },
      {
        id: 'akm3',
        type: 'multiple_choice',
        category: 'Analisis Data & Numerasi',
        questionText: 'Sebuah lab komputer sekolah memiliki 40 unit PC. Dalam 1 bulan tercatat: 24 PC digunakan untuk praktikum Web, 18 PC digunakan untuk praktikum Jaringan, dan 6 PC tidak digunakan sama sekali. Berapa banyak PC yang digunakan untuk kedua praktikum (Web dan Jaringan) sekaligus? Pilihlah jawaban dan pernyataan yang benar!',
        options: [
          { id: 'A', text: 'Total PC yang aktif digunakan adalah 34 unit.' },
          { id: 'B', text: 'Sebanyak 8 PC digunakan untuk kedua praktikum secara bersamaan.' },
          { id: 'C', text: 'Sebanyak 12 PC hanya digunakan untuk praktikum Jaringan saja.' },
          { id: 'D', text: 'Sebanyak 10 PC digunakan untuk kedua praktikum secara bersamaan.' }
        ],
        correctAnswer: ['A', 'B'],
        points: 25,
        difficulty: 'Sedang',
        explanation: 'Total PC = 40. Tidak aktif = 6, maka aktif = 40 - 6 = 34 PC. Dengan rumus himpunan: n(A U B) = n(A) + n(B) - n(A ∩ B) => 34 = 24 + 18 - x => x = 42 - 34 = 8 PC. Jadi irisan = 8 PC. Hanya jaringan = 18 - 8 = 10 PC.'
      },
      {
        id: 'akm4',
        type: 'true_false',
        category: 'Etika Komputasi & AI',
        questionText: 'Menggunakan kode sumber berlisensi MIT atau Apache-2.0 ke dalam proyek aplikasi komersial diperbolehkan secara hukum selama tetap menyertakan copyright notice dan teks lisensi aslinya.',
        options: [
          { id: 'A', text: 'BENAR (True)' },
          { id: 'B', text: 'SALAH (False)' }
        ],
        correctAnswer: 'A',
        points: 25,
        difficulty: 'Mudah',
        explanation: 'BENAR. Lisensi open-source permisif seperti MIT dan Apache 2.0 mengizinkan modifikasi, distribusi, dan penggunaan komersial dengan syarat utama tetap menyertakan atribusi lisensi aslinya.'
      }
    ]
  }
];

export const mockProctorStudents: {
  id: string;
  studentId: string;
  name: string;
  classGroup: string;
  examId: string;
  examTitle: string;
  status: 'Mengerjakan' | 'Selesai' | 'Terkunci' | 'Belum Mulai';
  progressAnswered: number;
  totalQuestions: number;
  flaggedCount: number;
  remainingMinutes: number;
  violationCount: number;
  lastActive: string;
  score?: number;
}[] = [
  {
    id: 'std-1',
    studentId: '20261101',
    name: 'Ahmad Faisal Arifin',
    classGroup: 'XII RPL 1',
    examId: 'ukk-rpl-2026',
    examTitle: 'UKK Rekayasa Perangkat Lunak 2026',
    status: 'Mengerjakan',
    progressAnswered: 7,
    totalQuestions: 8,
    flaggedCount: 1,
    remainingMinutes: 24,
    violationCount: 0,
    lastActive: 'Baru saja'
  },
  {
    id: 'std-2',
    studentId: '20261102',
    name: 'Dewi Anjani Rahmawati',
    classGroup: 'XII RPL 1',
    examId: 'ukk-rpl-2026',
    examTitle: 'UKK Rekayasa Perangkat Lunak 2026',
    status: 'Mengerjakan',
    progressAnswered: 5,
    totalQuestions: 8,
    flaggedCount: 0,
    remainingMinutes: 21,
    violationCount: 1,
    lastActive: '1 menit lalu'
  },
  {
    id: 'std-3',
    studentId: '20261103',
    name: 'Budi Kurniawan Pratama',
    classGroup: 'XII RPL 2',
    examId: 'ukk-rpl-2026',
    examTitle: 'UKK Rekayasa Perangkat Lunak 2026',
    status: 'Terkunci',
    progressAnswered: 3,
    totalQuestions: 8,
    flaggedCount: 2,
    remainingMinutes: 30,
    violationCount: 3,
    lastActive: '3 menit lalu'
  },
  {
    id: 'std-4',
    studentId: '20261104',
    name: 'Siti Nurhaliza',
    classGroup: 'XII RPL 2',
    examId: 'ukk-rpl-2026',
    examTitle: 'UKK Rekayasa Perangkat Lunak 2026',
    status: 'Selesai',
    progressAnswered: 8,
    totalQuestions: 8,
    flaggedCount: 0,
    remainingMinutes: 0,
    violationCount: 0,
    lastActive: '5 menit lalu',
    score: 92
  },
  {
    id: 'std-5',
    studentId: '20261105',
    name: 'Rizky Ramadhan',
    classGroup: 'XII RPL 1',
    examId: 'ukk-rpl-2026',
    examTitle: 'UKK Rekayasa Perangkat Lunak 2026',
    status: 'Mengerjakan',
    progressAnswered: 4,
    totalQuestions: 8,
    flaggedCount: 1,
    remainingMinutes: 28,
    violationCount: 0,
    lastActive: 'Baru saja'
  }
];

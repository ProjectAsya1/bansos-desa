import React, { useState } from 'react';
import { Database, FileCode, Server, Terminal, X, Copy, Check, FolderTree } from 'lucide-react';

interface DatabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseGuideModal: React.FC<DatabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'LOCAL_SETUP' | 'SCHEMA_ERD' | 'STRUCTURE'>('LOCAL_SETUP');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider = "postgresql" // atau "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN_DESA
  KEPALA_DESA
  PETUGAS_LAPANGAN
}

model User {
  id           String    @id @default(cuid())
  username     String    @unique
  passwordHash String
  nama         String
  role         Role
  jabatan      String
  email        String    @unique
  telepon      String
  usulanDibuat UsulanBansos[] @relation("Pengusul")
  auditLogs    AuditLog[]
}

model Warga {
  id                 String       @id @default(cuid())
  nik                String       @unique @db.VarChar(16)
  noKk               String       @db.VarChar(16)
  nama               String
  tempatLahir        String
  tanggalLahir       DateTime
  jenisKelamin       String
  alamat             String
  dusun              String
  rt                 String       @db.VarChar(3)
  rw                 String       @db.VarChar(3)
  pekerjaan          String
  penghasilan        Decimal      @db.Decimal(12, 2)
  jumlahTanggungan   Int
  statusRumah        String
  kondisiLantai      String
  kondisiDinding     String
  kondisiAtap        String
  dayaListrik        String
  lansiaDisabilitas  Boolean      @default(false)
  usulanList         UsulanBansos[]
  penyaluranPenerima PenerimaPenyaluran[]
}

model ProgramBansos {
  id                String    @id @default(cuid())
  kode              String    @unique
  nama              String
  sumberDana        String
  periode           String
  tahun             Int
  jenis             String
  nominalPerKpm     Decimal   @db.Decimal(12, 2)
  keteranganBarang  String?
  kuota             Int
  kriteriaEksklusif Boolean   @default(false)
  jadwalPenyaluran  PenyaluranJadwal[]
  penerimaList      PenerimaPenyaluran[]
}

model UsulanBansos {
  id                   String       @id @default(cuid())
  wargaId              String
  warga                Warga        @relation(fields: [wargaId], references: [id])
  pengusulId           String
  pengusul             User         @relation("Pengusul", fields: [pengusulId], references: [id])
  catatanPetugas       String
  skorKelayakan        Int
  kategoriKelayakan    String
  status               String       // MENUNGGU_VERIFIKASI_ADMIN | MENUNGGU_PERSETUJUAN_KADES | DISETUJUI | DITOLAK
  catatanAdmin         String?
  catatanKades         String?
  createdAt            DateTime     @default(now())
}

model PenyaluranJadwal {
  id                     String           @id @default(cuid())
  programId              String
  program                ProgramBansos    @relation(fields: [programId], references: [id])
  judul                  String
  tanggal                DateTime
  lokasi                 String
  petugasPenanggungJawab String
  totalSasaran           Int
  totalTersalurkan       Int
  status                 String
  penerimaList           PenerimaPenyaluran[]
}

model PenerimaPenyaluran {
  id                 String           @id @default(cuid())
  jadwalId           String
  jadwal             PenyaluranJadwal @relation(fields: [jadwalId], references: [id])
  programId          String
  program            ProgramBansos    @relation(fields: [programId], references: [id])
  wargaId            String
  warga              Warga            @relation(fields: [wargaId], references: [id])
  status             String           // BELUM_DISALURKAN | SUDAH_DISALURKAN | GAGAL_DISALURKAN
  namaPenerimaNyata  String?
  hubunganDenganKpm  String?
  fotoBukti          String?
  tandaTangan        String?          @db.Text
  waktuSerahTerima   DateTime?
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String
  entity    String
  entityId  String
  details   String
  timestamp DateTime @default(now())
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 text-slate-900">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Arsitektur, Skema Relasional (ERD) & Panduan Lokal</h3>
              <p className="text-[11px] text-slate-300">Instruksi deploy Express + Prisma (PostgreSQL / MySQL) & Node.js</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('LOCAL_SETUP')}
            className={`pb-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'LOCAL_SETUP'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Cara Menjalankan di Lokal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SCHEMA_ERD')}
            className={`pb-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SCHEMA_ERD'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Skema Relasional (Prisma/ERD)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('STRUCTURE')}
            className={`pb-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'STRUCTURE'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Struktur Folder Proyek</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'LOCAL_SETUP' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Server className="w-4 h-4 text-blue-700" />
                  Instruksi Langkah demi Langkah Menjalankan Aplikasi
                </div>
                <p className="text-xs text-blue-800/90">
                  Aplikasi web SIM-BANSOS DESA dibangun dengan arsitektur Full-Stack modern yang siap dijalankan di localhost maupun dideploy ke VPS/Cloud Run.
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-slate-200 bg-slate-50 rounded-lg p-3.5 space-y-2">
                  <span className="font-bold text-slate-900 block">Langkah 1: Clone Repository & Pasang Dependencies</span>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-[11px] space-y-1 overflow-x-auto border border-slate-800">
                    <div className="text-emerald-400">git clone https://github.com/desa/sim-bansos-desa.git</div>
                    <div>cd sim-bansos-desa</div>
                    <div className="text-blue-400">npm install</div>
                  </div>
                </div>

                <div className="border border-slate-200 bg-slate-50 rounded-lg p-3.5 space-y-2">
                  <span className="font-bold text-slate-900 block">Langkah 2: Konfigurasi Environment Variable (.env)</span>
                  <p className="text-slate-600">Salin berkas <code className="font-mono text-blue-700 font-bold">.env.example</code> menjadi <code className="font-mono text-blue-700 font-bold">.env</code> dan sesuaikan string koneksi database PostgreSQL atau MySQL:</p>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-[11px] overflow-x-auto border border-slate-800 space-y-1">
                    <div className="text-amber-300">DATABASE_URL="postgresql://postgres:password123@localhost:5432/sim_bansos_desa?schema=public"</div>
                    <div className="text-purple-300">JWT_SECRET="kunci_rahasia_desa_sukamaju_2026"</div>
                    <div className="text-slate-400">PORT=3000</div>
                  </div>
                </div>

                <div className="border border-slate-200 bg-slate-50 rounded-lg p-3.5 space-y-2">
                  <span className="font-bold text-slate-900 block">Langkah 3: Migrasi Database & Seeder Data Awal</span>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-[11px] space-y-1 overflow-x-auto border border-slate-800">
                    <div className="text-blue-400">npx prisma migrate dev --name init_sim_bansos</div>
                    <div className="text-emerald-400">npx prisma db seed <span className="text-slate-400"># Mengisi data dummy warga desa dan program bansos</span></div>
                  </div>
                </div>

                <div className="border border-slate-200 bg-slate-50 rounded-lg p-3.5 space-y-2">
                  <span className="font-bold text-slate-900 block">Langkah 4: Jalankan Server Pengembangan</span>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-[11px] space-y-1 overflow-x-auto border border-slate-800">
                    <div className="text-emerald-400">npm run dev</div>
                    <div className="text-slate-400"># Buka browser di http://localhost:3000</div>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Akun login default demo: <code className="font-mono font-semibold text-blue-700">admin</code> / <code className="font-mono text-slate-600">password123</code> (Kaur Kesra), <code className="font-mono font-semibold text-blue-700">kades</code> / <code className="font-mono text-slate-600">password123</code> (Kepala Desa), atau <code className="font-mono font-semibold text-blue-700">rt01</code> / <code className="font-mono text-slate-600">password123</code> (Petugas RT).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SCHEMA_ERD' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Skema Relasional Database (Prisma ORM)</h4>
                  <p className="text-slate-500 text-[11px]">Tersedia di berkas <code className="font-mono text-blue-700">prisma/schema.prisma</code></p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Skema'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto border border-slate-800 shadow-inner">
                <pre>{prismaSchemaCode}</pre>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 block">Relasi Kunci (Entity Relationship / ERD):</span>
                <div>· <strong className="text-blue-700">Warga 1 - M UsulanBansos</strong>: Satu warga dapat memiliki riwayat usulan bertahap.</div>
                <div>· <strong className="text-blue-700">Warga 1 - M PenerimaPenyaluran</strong>: Satu warga dapat terdaftar dalam jadwal penerimaan bansos.</div>
                <div>· <strong className="text-blue-700">ProgramBansos 1 - M PenyaluranJadwal</strong>: Satu program memiliki jadwal pembagian per dusun/periode.</div>
                <div>· <strong className="text-blue-700">PenyaluranJadwal 1 - M PenerimaPenyaluran</strong>: Jadwal mencatat daftar penerima KPM dengan foto bukti & TTD digital.</div>
                <div>· <strong className="text-blue-700">User 1 - M AuditLog</strong>: Setiap mutasi data dicatat secara otomatis untuk transparansi.</div>
              </div>
            </div>
          )}

          {activeTab === 'STRUCTURE' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-900 block">Struktur Folder Arsitektur Aplikasi</span>
              <div className="bg-slate-900 text-cyan-300 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
                <pre>{`sim-bansos-desa/
├── prisma/
│   ├── schema.prisma            # Skema Relasional PostgreSQL/MySQL
│   └── seed.ts                  # Seeder data penduduk & program desa
├── src/
│   ├── components/              # Komponen Antarmuka Pengguna (UI)
│   │   ├── Navbar.tsx           # Header resmi navigasi & user info
│   │   ├── Sidebar.tsx          # Navigasi bertingkat berbasis Role
│   │   ├── LandingPublicCheck.tsx # Form Cek NIK Publik tanpa login
│   │   ├── LoginModal.tsx       # Autentikasi Admin, Kades & RT/RW
│   │   ├── DashboardView.tsx    # KPI Cards, Bar Chart & Pie Chart
│   │   ├── WargaView.tsx        # CRUD Penduduk, NIK validator, Impor/Ekspor Excel
│   │   ├── UsulanView.tsx       # Skoring otomatis & Approval bertingkat
│   │   ├── ProgramView.tsx      # Master program bansos & kuota
│   │   ├── PenyaluranView.tsx   # Jadwal, Foto serah terima & Canvas Signature
│   │   ├── LaporanView.tsx      # Rekapitulasi & Cetak PDF Kop Surat Desa
│   │   ├── AuditLogView.tsx     # Audit Trail aktivitas pengguna
│   │   ├── UserManagementView.tsx # Manajemen akun petugas desa
│   │   ├── SignatureCanvas.tsx  # Tanda Tangan Digital interaktif
│   │   └── DatabaseGuideModal.tsx # Dokumentasi DB & panduan lokal
│   ├── data/
│   │   └── seedData.ts          # Data realistis khas desa di Indonesia
│   ├── services/
│   │   └── storage.ts           # Storage engine, NIK check & Excel handler
│   ├── types/
│   │   └── index.ts             # Definisi tipe data domain TypeScript
│   ├── utils/
│   │   └── scoring.ts           # Algoritma skoring kemiskinan desa & helper
│   ├── App.tsx                  # Kontroler navigasi dan state utama
│   ├── main.tsx                 # Entry point React
│   └── index.css                # Styling Tailwind v4 & format cetak resmi
├── index.html                   # HTML Entry point
├── package.json
└── vite.config.ts`}</pre>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold border border-slate-300 cursor-pointer transition-colors"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

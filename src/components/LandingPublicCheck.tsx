import React, { useState } from 'react';
import { db } from '../services/storage';
import { Search, ShieldAlert, CheckCircle2, AlertCircle, Building2, UserCheck, HelpCircle } from 'lucide-react';

interface LandingPublicCheckProps {
  onLoginClick: () => void;
  onOpenGuide: () => void;
}

export const LandingPublicCheck: React.FC<LandingPublicCheckProps> = ({ onLoginClick, onOpenGuide }) => {
  const [nikInput, setNikInput] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = nikInput.trim();

    if (!clean) {
      setErrorMsg('Silakan masukkan 16 digit NIK Anda.');
      return;
    }

    if (!/^\d{16}$/.test(clean)) {
      setErrorMsg('NIK harus terdiri tepat dari 16 digit angka sesuai KTP.');
      return;
    }

    const result = db.checkNikPublic(clean);
    setSearchResult(result);
    setHasSearched(true);
  };

  const handleQuickFill = (nik: string) => {
    setNikInput(nik);
    setErrorMsg('');
    const result = db.checkNikPublic(nik);
    setSearchResult(result);
    setHasSearched(true);
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4">
      {/* Official Hero Banner with Village Queue Photo */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src="/src/assets/images/hero_bansos_antrean_desa_1794463207343.jpg"
            alt="Warga antre tertib penyaluran bantuan sosial di Balai Desa Sukamaju"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
          />
          {/* Subtle contrast gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-950/20" />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold rounded-full w-fit mb-2.5">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Pemerintah Desa Sukamaju · Kec. Kepanjen · Kab. Malang</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white max-w-2xl text-balance">
              Sistem Informasi Pendataan & Monitoring Penerima Bantuan Sosial Desa
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-xl mt-1.5 line-clamp-2 sm:line-clamp-none">
              Layanan transparansi publik penyaluran BLT-DD, PKH, BPNT, dan Bantuan Pangan Beras secara akuntabel, tepat sasaran, dan tanpa potongan.
            </p>

            {/* Quick Live Stats in Hero */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-white/20 text-xs">
              <div>
                <span className="text-slate-300 block text-[11px]">Realisasi Salur</span>
                <span className="font-bold font-mono text-amber-300 text-sm">100% Bebas Potongan</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20" />
              <div>
                <span className="text-slate-300 block text-[11px]">Metode Verifikasi</span>
                <span className="font-bold text-white text-xs">Musdes & Skoring Kemiskinan</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20" />
              <div>
                <span className="text-slate-300 block text-[11px]">Bukti Penerimaan</span>
                <span className="font-bold text-emerald-300 text-xs">Foto & TTD Digital KPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Search Box Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-700" />
            Pencarian Status Penerima Bantuan (Khusus Warga)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan 16 digit Nomor Induk Kependudukan (NIK) yang tertera pada Kartu Tanda Penduduk (KTP) atau Kartu Keluarga (KK).
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={16}
                value={nikInput}
                onChange={(e) => {
                  setNikInput(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                placeholder="Contoh: 3507114502540001 (16 Digit Angka)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono tracking-wider text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-blue-600 transition-all shadow-2xs"
              />
              <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-mono">
                {nikInput.length}/16
              </span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status Bansos</span>
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Quick Demo NIK Helper for testers */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="text-slate-700 font-semibold">Contoh NIK Warga Terdata:</span>
          <button
            type="button"
            onClick={() => handleQuickFill('3507114502540001')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-blue-700 font-mono text-[11px] border border-slate-200 transition-colors cursor-pointer"
          >
            3507114502540001 (Mbah Suparmi - BLT)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('3507111208720003')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-blue-700 font-mono text-[11px] border border-slate-200 transition-colors cursor-pointer"
          >
            3507111208720003 (Slamet - BLT)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('3507116003680002')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-blue-700 font-mono text-[11px] border border-slate-200 transition-colors cursor-pointer"
          >
            3507116003680002 (Aminah - Proses)
          </button>
        </div>

        {/* Search Results Display */}
        {hasSearched && searchResult && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            {searchResult.found ? (
              <div className="space-y-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Data Ditemukan dalam Basis Data Desa
                      </h3>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Nama: <span className="font-semibold text-emerald-800">{searchResult.namaMasked}</span> · Wilayah: <span className="font-semibold text-slate-900">{searchResult.dusun}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-white text-emerald-800 border border-emerald-300 px-2 py-1 rounded shadow-2xs font-semibold">
                    NIK: {searchResult.nikMasked}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900">
                    Riwayat Kepesertaan & Status Penyaluran:
                  </div>
                  {searchResult.bantuanList && searchResult.bantuanList.length > 0 ? (
                    <div className="space-y-2">
                      {searchResult.bantuanList.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{item.program}</span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.status === 'Tersalurkan' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : item.status === 'Gagal Disalurkan'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-slate-600 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                            <span>Periode: <strong className="text-slate-900">{item.periode}</strong></span>
                            <span>Bentuk: <strong className="text-blue-700">{item.nominal}</strong></span>
                            <span>Jadwal/Tanggal: <strong className="text-slate-900">{item.waktuPencairan}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200">
                      Warga terdaftar dalam basis kependudukan namun belum dialokasikan pada program bantuan aktif saat ini.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center space-y-2">
                <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">NIK Tidak Ditemukan</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {searchResult.message || 'NIK tidak terdaftar dalam penerima bantuan sosial periode ini. Silakan hubungi Ketua RT/RW setempat untuk mengajukan usulan warga pra-sejahtera.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Public Information Showcase Cards with Authentic Photos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Tata Kelola & Penyaluran Bantuan Sosial di Desa Sukamaju
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Transparansi · Tepat Sasaran · Berkelanjutan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Musyawarah Desa */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group hover:shadow-md transition-all flex flex-col justify-between">
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/musyawarah_desa_verifikasi_1794463210651.jpg"
                alt="Musyawarah desa verifikasi bansos"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 bg-blue-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                01. Musyawarah Desa
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1">
              <h3 className="text-xs font-bold text-slate-900">Verifikasi Terpadu Bersama RT/RW</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Penetapan calon KPM diputuskan melalui Musdes terbuka dengan bobot skoring kemiskinan (penghasilan, tanggungan, kondisi rumah).
              </p>
            </div>
          </div>

          {/* Card 2: Logistik Pangan Beras */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group hover:shadow-md transition-all flex flex-col justify-between">
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/beras_sembako_bansos_1794463209822.jpg"
                alt="Logistik beras bansos pangan desa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                02. Logistik Pangan & BLT
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1">
              <h3 className="text-xs font-bold text-slate-900">Validasi Cegah Bantuan Ganda</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Penerima BLT-DD Dana Desa otomatis diverifikasi agar tidak terjadi tumpang tindih dengan PKH dan BPNT Kemensos.
              </p>
            </div>
          </div>

          {/* Card 3: Penyerahan Langsung */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group hover:shadow-md transition-all flex flex-col justify-between">
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/penyerahan_bansos_lapangan_1794463208005.jpg"
                alt="Penyerahan bantuan sosial ke warga lansia"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                03. Serah Terima Sah
              </span>
            </div>
            <div className="p-4 space-y-1.5 flex-1">
              <h3 className="text-xs font-bold text-slate-900">Bukti Foto & Tanda Tangan Digital</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Setiap paket diserahkan langsung ke tangan KPM dengan dokumentasi foto dan tanda tangan digital untuk akuntabilitas mutlak.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Officer Entry Callout */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-white">Akses Portal Perangkat Desa & Petugas RT/RW</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Kelola master data warga, input usulan baru, verifikasi kelayakan, dan jadwalkan penyaluran.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenGuide}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dokumentasi DB</span>
          </button>
          <button
            type="button"
            onClick={onLoginClick}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Masuk Petugas Desa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

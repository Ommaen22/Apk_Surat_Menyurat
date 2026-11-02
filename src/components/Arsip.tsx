import { useState } from 'react';
import { Surat } from '../types';

interface Props {
  suratMasuk: Surat[];
  suratKeluar: Surat[];
  setSuratMasuk: (surat: Surat[]) => void;
  setSuratKeluar: (surat: Surat[]) => void;
}

export default function Arsip({ suratMasuk, suratKeluar, setSuratMasuk, setSuratKeluar }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState('');
  const [filterJenis, setFilterJenis] = useState<'semua' | 'masuk' | 'keluar'>('semua');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);

  const allSurat = [
    ...suratMasuk.filter(s => s.status === 'Diarsipkan').map(s => ({ ...s, jenisLabel: 'Masuk' })),
    ...suratKeluar.filter(s => s.status === 'Diarsipkan').map(s => ({ ...s, jenisLabel: 'Keluar' })),
  ];

  const filteredArsip = allSurat.filter(s => {
    const matchSearch = s.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.penerima.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKlasifikasi = !filterKlasifikasi || s.klasifikasi === filterKlasifikasi;
    const matchJenis = filterJenis === 'semua' || s.jenis === filterJenis;
    return matchSearch && matchKlasifikasi && matchJenis;
  });

  const handleRestore = (id: string, jenis: 'masuk' | 'keluar') => {
    if (confirm('Kembalikan surat dari arsip?')) {
      if (jenis === 'masuk') {
        setSuratMasuk(suratMasuk.map(s => s.id === id ? { ...s, status: 'Selesai' } : s));
      } else {
        setSuratKeluar(suratKeluar.map(s => s.id === id ? { ...s, status: 'Selesai' } : s));
      }
    }
  };

  const handlePermanentDelete = (id: string, jenis: 'masuk' | 'keluar') => {
    if (confirm('PERINGATAN: Surat akan dihapus permanen dan tidak dapat dikembalikan. Lanjutkan?')) {
      if (jenis === 'masuk') {
        setSuratMasuk(suratMasuk.filter(s => s.id !== id));
      } else {
        setSuratKeluar(suratKeluar.filter(s => s.id !== id));
      }
    }
  };

  // Active (non-archived) surat for quick archive
  const activeMasuk = suratMasuk.filter(s => s.status !== 'Diarsipkan');
  const activeKeluar = suratKeluar.filter(s => s.status !== 'Diarsipkan');

  const handleQuickArchive = (id: string, jenis: 'masuk' | 'keluar') => {
    if (jenis === 'masuk') {
      setSuratMasuk(suratMasuk.map(s => s.id === id ? { ...s, status: 'Diarsipkan' } : s));
    } else {
      setSuratKeluar(suratKeluar.map(s => s.id === id ? { ...s, status: 'Diarsipkan' } : s));
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-500">
          <p className="text-xs text-gray-500 uppercase">Total Arsip</p>
          <p className="text-2xl font-bold text-gray-800">{allSurat.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Arsip Surat Masuk</p>
          <p className="text-2xl font-bold text-gray-800">{suratMasuk.filter(s => s.status === 'Diarsipkan').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase">Arsip Surat Keluar</p>
          <p className="text-2xl font-bold text-gray-800">{suratKeluar.filter(s => s.status === 'Diarsipkan').length}</p>
        </div>
      </div>

      {/* Quick Archive Section */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-3">
          <i className="fas fa-archive text-gray-500 mr-2"></i>Arsipkan Surat Aktif
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Surat Masuk */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Surat Masuk Belum Diarsipkan ({activeMasuk.length})</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {activeMasuk.length === 0 ? (
                <p className="text-xs text-gray-400">Semua surat masuk sudah diarsipkan</p>
              ) : (
                activeMasuk.slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <span className="truncate flex-1">{s.nomorSurat} - {s.perihal}</span>
                    <button onClick={() => handleQuickArchive(s.id, 'masuk')} className="ml-2 px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-[10px]">
                      Arsipkan
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Active Surat Keluar */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Surat Keluar Belum Diarsipkan ({activeKeluar.length})</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {activeKeluar.length === 0 ? (
                <p className="text-xs text-gray-400">Semua surat keluar sudah diarsipkan</p>
              ) : (
                activeKeluar.slice(0, 10).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <span className="truncate flex-1">{s.nomorSurat} - {s.perihal}</span>
                    <button onClick={() => handleQuickArchive(s.id, 'keluar')} className="ml-2 px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-[10px]">
                      Arsipkan
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Archive Search & Filter */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Cari arsip..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-gray-500 w-64"
        />
        <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value as typeof filterJenis)} className="px-3 py-2 border rounded-lg text-sm">
          <option value="semua">Semua Jenis</option>
          <option value="masuk">Surat Masuk</option>
          <option value="keluar">Surat Keluar</option>
        </select>
        <select value={filterKlasifikasi} onChange={(e) => setFilterKlasifikasi(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
          <option value="">Semua Klasifikasi</option>
          <option value="Umum">Umum</option>
          <option value="Keuangan">Keuangan</option>
          <option value="Kepegawaian">Kepegawaian</option>
          <option value="Pendidikan">Pendidikan</option>
          <option value="Kesehatan">Kesehatan</option>
          <option value="Infrastruktur">Infrastruktur</option>
          <option value="Hukum">Hukum</option>
        </select>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Detail Arsip Surat</h3>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Nomor Surat</p><p className="text-sm font-medium">{selectedSurat.nomorSurat}</p></div>
                <div><p className="text-xs text-gray-500">Tanggal Surat</p><p className="text-sm font-medium">{selectedSurat.tanggalSurat}</p></div>
                <div><p className="text-xs text-gray-500">Jenis</p><p className="text-sm font-medium">{selectedSurat.jenis === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'}</p></div>
                <div><p className="text-xs text-gray-500">Sifat</p><p className="text-sm font-medium">{selectedSurat.sifat}</p></div>
                <div><p className="text-xs text-gray-500">Pengirim</p><p className="text-sm font-medium">{selectedSurat.pengirim}</p></div>
                <div><p className="text-xs text-gray-500">Penerima</p><p className="text-sm font-medium">{selectedSurat.penerima}</p></div>
                <div><p className="text-xs text-gray-500">Klasifikasi</p><p className="text-sm font-medium">{selectedSurat.klasifikasi || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-medium text-green-600">Diarsipkan</p></div>
              </div>
              <div><p className="text-xs text-gray-500">Perihal</p><p className="text-sm font-medium">{selectedSurat.perihal}</p></div>
              <div><p className="text-xs text-gray-500">Keterangan</p><p className="text-sm">{selectedSurat.keterangan || '-'}</p></div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={() => setShowDetail(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">No. Surat</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Jenis</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Perihal</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Klasifikasi</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredArsip.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <i className="fas fa-folder-open text-3xl mb-2 block"></i>
                    Belum ada arsip surat
                  </td>
                </tr>
              ) : (
                filteredArsip.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.nomorSurat}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.jenis === 'masuk' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {s.jenisLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.tanggalSurat}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate">{s.perihal}</td>
                    <td className="px-4 py-3 text-gray-600">{s.klasifikasi || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setSelectedSurat(s); setShowDetail(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Detail">
                          <i className="fas fa-eye text-xs"></i>
                        </button>
                        <button onClick={() => handleRestore(s.id, s.jenis)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Kembalikan">
                          <i className="fas fa-undo text-xs"></i>
                        </button>
                        <button onClick={() => handlePermanentDelete(s.id, s.jenis)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus Permanen">
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
          Menampilkan {filteredArsip.length} arsip surat
        </div>
      </div>
    </div>
  );
}

import { Surat, Disposisi, PageType } from '../types';

interface Props {
  suratMasuk: Surat[];
  suratKeluar: Surat[];
  disposisi: Disposisi[];
  setCurrentPage: (page: PageType) => void;
}

export default function Dashboard({ suratMasuk, suratKeluar, disposisi, setCurrentPage }: Props) {
  const stats = {
    totalMasuk: suratMasuk.length,
    totalKeluar: suratKeluar.length,
    suratBaru: suratMasuk.filter(s => s.status === 'Baru').length,
    suratProses: [...suratMasuk, ...suratKeluar].filter(s => s.status === 'Diproses' || s.status === 'Disposisi').length,
    suratSelesai: [...suratMasuk, ...suratKeluar].filter(s => s.status === 'Selesai').length,
    disposisiPending: disposisi.filter(d => d.status === 'Pending' || d.status === 'Diterima').length,
  };

  const recentMasuk = [...suratMasuk].sort((a, b) => new Date(b.tanggalCatat).getTime() - new Date(a.tanggalCatat).getTime()).slice(0, 5);
  const recentKeluar = [...suratKeluar].sort((a, b) => new Date(b.tanggalCatat).getTime() - new Date(a.tanggalCatat).getTime()).slice(0, 5);

  const getStatColor = (status: string) => {
    switch (status) {
      case 'Biasa': return 'bg-green-100 text-green-700';
      case 'Penting': return 'bg-yellow-100 text-yellow-700';
      case 'Segera': return 'bg-orange-100 text-orange-700';
      case 'Rahasia': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Surat Masuk</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalMasuk}</p>
              <p className="text-xs text-blue-600 mt-1">{stats.suratBaru} surat baru</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-inbox text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Surat Keluar</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalKeluar}</p>
              <p className="text-xs text-green-600 mt-1">Total tercatat</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-paper-plane text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Dalam Proses</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.suratProses}</p>
              <p className="text-xs text-yellow-600 mt-1">Perlu ditindaklanjuti</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-spinner text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Disposisi</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.disposisiPending}</p>
              <p className="text-xs text-purple-600 mt-1">Menunggu tindak lanjut</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-share-nodes text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => setCurrentPage('surat-masuk')} className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <i className="fas fa-plus text-blue-600"></i>
            <span className="text-sm text-blue-700">Catat Surat Masuk</span>
          </button>
          <button onClick={() => setCurrentPage('surat-keluar')} className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <i className="fas fa-plus text-green-600"></i>
            <span className="text-sm text-green-700">Buat Surat Keluar</span>
          </button>
          <button onClick={() => setCurrentPage('disposisi')} className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <i className="fas fa-share text-purple-600"></i>
            <span className="text-sm text-purple-700">Buat Disposisi</span>
          </button>
          <button onClick={() => setCurrentPage('template')} className="flex items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <i className="fas fa-file-lines text-orange-600"></i>
            <span className="text-sm text-orange-700">Template Surat</span>
          </button>
        </div>
      </div>

      {/* Recent Letters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Surat Masuk */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              <i className="fas fa-inbox text-blue-500 mr-2"></i>Surat Masuk Terbaru
            </h3>
            <button onClick={() => setCurrentPage('surat-masuk')} className="text-xs text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          {recentMasuk.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada surat masuk</p>
          ) : (
            <div className="space-y-3">
              {recentMasuk.map(surat => (
                <div key={surat.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`px-2 py-1 rounded text-[10px] font-medium ${getStatColor(surat.sifat)}`}>
                    {surat.sifat}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{surat.perihal}</p>
                    <p className="text-xs text-gray-500">Dari: {surat.pengirim}</p>
                    <p className="text-xs text-gray-400">{surat.nomorSurat} • {surat.tanggalSurat}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    surat.status === 'Baru' ? 'bg-blue-100 text-blue-700' :
                    surat.status === 'Diproses' ? 'bg-yellow-100 text-yellow-700' :
                    surat.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{surat.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Surat Keluar */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              <i className="fas fa-paper-plane text-green-500 mr-2"></i>Surat Keluar Terbaru
            </h3>
            <button onClick={() => setCurrentPage('surat-keluar')} className="text-xs text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          {recentKeluar.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada surat keluar</p>
          ) : (
            <div className="space-y-3">
              {recentKeluar.map(surat => (
                <div key={surat.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`px-2 py-1 rounded text-[10px] font-medium ${getStatColor(surat.sifat)}`}>
                    {surat.sifat}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{surat.perihal}</p>
                    <p className="text-xs text-gray-500">Kepada: {surat.penerima}</p>
                    <p className="text-xs text-gray-400">{surat.nomorSurat} • {surat.tanggalSurat}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    surat.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                    surat.status === 'Diproses' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{surat.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Ringkasan Status Surat</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Baru', 'Disposisi', 'Diproses', 'Selesai', 'Diarsipkan'].map(status => {
            const count = [...suratMasuk, ...suratKeluar].filter(s => s.status === status).length;
            const colors: Record<string, string> = {
              'Baru': 'bg-blue-500',
              'Disposisi': 'bg-purple-500',
              'Diproses': 'bg-yellow-500',
              'Selesai': 'bg-green-500',
              'Diarsipkan': 'bg-gray-500',
            };
            return (
              <div key={status} className="text-center">
                <div className={`w-full h-2 rounded-full ${colors[status]} opacity-20`}>
                  <div className={`h-2 rounded-full ${colors[status]}`} style={{ width: `${Math.min(100, (count / Math.max(1, [...suratMasuk, ...suratKeluar].length)) * 100)}%` }}></div>
                </div>
                <p className="text-lg font-bold text-gray-800 mt-2">{count}</p>
                <p className="text-xs text-gray-500">{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

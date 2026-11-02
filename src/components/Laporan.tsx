import { Surat, Disposisi } from '../types';

interface Props {
  suratMasuk: Surat[];
  suratKeluar: Surat[];
  disposisi: Disposisi[];
}

export default function Laporan({ suratMasuk, suratKeluar, disposisi }: Props) {
  const allSurat = [...suratMasuk, ...suratKeluar];

  // Monthly stats
  const getMonthlyData = () => {
    const months: Record<string, { masuk: number; keluar: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    suratMasuk.forEach(s => {
      const d = new Date(s.tanggalSurat);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) months[key] = { masuk: 0, keluar: 0 };
      months[key].masuk++;
    });

    suratKeluar.forEach(s => {
      const d = new Date(s.tanggalSurat);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) months[key] = { masuk: 0, keluar: 0 };
      months[key].keluar++;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, val]) => ({
        month: monthNames[parseInt(key.split('-')[1]) - 1],
        ...val,
      }));
  };

  const monthlyData = getMonthlyData();
  const maxMonthly = Math.max(...monthlyData.map(d => Math.max(d.masuk, d.keluar)), 1);

  // Classification stats
  const classificationStats = () => {
    const stats: Record<string, number> = {};
    allSurat.forEach(s => {
      const klas = s.klasifikasi || 'Tanpa Klasifikasi';
      stats[klas] = (stats[klas] || 0) + 1;
    });
    return Object.entries(stats).sort(([, a], [, b]) => b - a);
  };

  // Sifat stats
  const sifatStats = () => {
    const stats: Record<string, number> = { 'Biasa': 0, 'Penting': 0, 'Segera': 0, 'Rahasia': 0 };
    allSurat.forEach(s => {
      stats[s.sifat] = (stats[s.sifat] || 0) + 1;
    });
    return Object.entries(stats);
  };

  // Status stats
  const statusStats = () => {
    const stats: Record<string, number> = { 'Baru': 0, 'Disposisi': 0, 'Diproses': 0, 'Selesai': 0, 'Diarsipkan': 0 };
    allSurat.forEach(s => {
      stats[s.status] = (stats[s.status] || 0) + 1;
    });
    return Object.entries(stats);
  };

  // Top pengirim
  const topPengirim = () => {
    const stats: Record<string, number> = {};
    suratMasuk.forEach(s => {
      stats[s.pengirim] = (stats[s.pengirim] || 0) + 1;
    });
    return Object.entries(stats).sort(([, a], [, b]) => b - a).slice(0, 5);
  };

  // Top penerima
  const topPenerima = () => {
    const stats: Record<string, number> = {};
    suratKeluar.forEach(s => {
      stats[s.penerima] = (stats[s.penerima] || 0) + 1;
    });
    return Object.entries(stats).sort(([, a], [, b]) => b - a).slice(0, 5);
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Jenis', 'Nomor Surat', 'Tanggal', 'Pengirim/Penerima', 'Perihal', 'Sifat', 'Status', 'Klasifikasi'];
    const rows = allSurat.map((s, idx) => [
      idx + 1,
      s.jenis === 'masuk' ? 'Masuk' : 'Keluar',
      s.nomorSurat,
      s.tanggalSurat,
      s.jenis === 'masuk' ? s.pengirim : s.penerima,
      s.perihal,
      s.sifat,
      s.status,
      s.klasifikasi || '',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-surat-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
          <i className="fas fa-file-csv"></i> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{suratMasuk.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Surat Masuk</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{suratKeluar.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Surat Keluar</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{disposisi.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Disposisi</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{allSurat.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Semua Surat</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-chart-bar text-blue-500 mr-2"></i>Statistik Bulanan (6 Bulan Terakhir)
        </h3>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Belum ada data</p>
        ) : (
          <div className="space-y-3">
            {monthlyData.map((d, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">{d.month}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-blue-600 w-10">Masuk</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4">
                      <div className="bg-blue-500 h-4 rounded-full flex items-center justify-end px-2" style={{ width: `${(d.masuk / maxMonthly) * 100}%`, minWidth: d.masuk > 0 ? '24px' : '0' }}>
                        <span className="text-[10px] text-white font-medium">{d.masuk}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-600 w-10">Keluar</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4">
                      <div className="bg-green-500 h-4 rounded-full flex items-center justify-end px-2" style={{ width: `${(d.keluar / maxMonthly) * 100}%`, minWidth: d.keluar > 0 ? '24px' : '0' }}>
                        <span className="text-[10px] text-white font-medium">{d.keluar}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            <i className="fas fa-chart-pie text-yellow-500 mr-2"></i>Distribusi Status
          </h3>
          <div className="space-y-2">
            {statusStats().map(([status, count]) => {
              const percentage = allSurat.length > 0 ? (count / allSurat.length) * 100 : 0;
              const colors: Record<string, string> = {
                'Baru': 'bg-blue-500',
                'Disposisi': 'bg-purple-500',
                'Diproses': 'bg-yellow-500',
                'Selesai': 'bg-green-500',
                'Diarsipkan': 'bg-gray-500',
              };
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20">{status}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5">
                    <div className={`${colors[status]} h-5 rounded-full flex items-center px-2`} style={{ width: `${Math.max(percentage, 2)}%` }}>
                      <span className="text-[10px] text-white font-medium">{count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sifat Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            <i className="fas fa-flag text-red-500 mr-2"></i>Distribusi Sifat Surat
          </h3>
          <div className="space-y-2">
            {sifatStats().map(([sifat, count]) => {
              const percentage = allSurat.length > 0 ? (count / allSurat.length) * 100 : 0;
              const colors: Record<string, string> = {
                'Biasa': 'bg-green-500',
                'Penting': 'bg-yellow-500',
                'Segera': 'bg-orange-500',
                'Rahasia': 'bg-red-500',
              };
              return (
                <div key={sifat} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20">{sifat}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5">
                    <div className={`${colors[sifat]} h-5 rounded-full flex items-center px-2`} style={{ width: `${Math.max(percentage, 2)}%` }}>
                      <span className="text-[10px] text-white font-medium">{count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pengirim */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            <i className="fas fa-user text-blue-500 mr-2"></i>Top 5 Pengirim Surat
          </h3>
          {topPengirim().length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>
          ) : (
            <div className="space-y-2">
              {topPengirim().map(([name, count], idx) => (
                <div key={name} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
                  <span className="text-sm font-medium text-gray-800">{count} surat</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Penerima */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            <i className="fas fa-building text-green-500 mr-2"></i>Top 5 Penerima Surat
          </h3>
          {topPenerima().length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>
          ) : (
            <div className="space-y-2">
              {topPenerima().map(([name, count], idx) => (
                <div key={name} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
                  <span className="text-sm font-medium text-gray-800">{count} surat</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Classification Stats */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-tags text-purple-500 mr-2"></i>Statistik Berdasarkan Klasifikasi
        </h3>
        {classificationStats().length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Belum ada data</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {classificationStats().map(([klas, count]) => (
              <div key={klas} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500 mt-1">{klas}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

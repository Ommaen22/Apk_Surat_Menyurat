import { useState } from 'react';
import { Surat, Disposisi } from '../types';

interface Props {
  suratMasuk: Surat[];
  setSuratMasuk: (surat: Surat[]) => void;
  disposisi: Disposisi[];
  setDisposisi: (disposisi: Disposisi[]) => void;
}

export default function DisposisiPage({ suratMasuk, setSuratMasuk, disposisi, setDisposisi }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    suratId: '',
    kepada: '',
    instruksi: '',
    catatan: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDisposisi: Disposisi = {
      id: Date.now().toString(),
      suratId: formData.suratId,
      kepada: formData.kepada,
      instruksi: formData.instruksi,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Pending',
      catatan: formData.catatan,
    };
    setDisposisi([newDisposisi, ...disposisi]);

    // Update status surat
    setSuratMasuk(suratMasuk.map(s =>
      s.id === formData.suratId
        ? { ...s, status: 'Disposisi', disposisi: [...(s.disposisi || []), newDisposisi] }
        : s
    ));

    setFormData({ suratId: '', kepada: '', instruksi: '', catatan: '' });
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: Disposisi['status']) => {
    setDisposisi(disposisi.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus disposisi ini?')) {
      setDisposisi(disposisi.filter(d => d.id !== id));
    }
  };

  const filteredDisposisi = disposisi.filter(d => {
    const surat = suratMasuk.find(s => s.id === d.suratId);
    const matchSearch = d.kepada.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.instruksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (surat && surat.perihal.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Diterima': return 'bg-blue-100 text-blue-700';
      case 'Diproses': return 'bg-orange-100 text-orange-700';
      case 'Selesai': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cari disposisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diterima">Diterima</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Buat Disposisi
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-purple-600 mt-0.5"></i>
          <div>
            <p className="text-sm font-medium text-purple-800">Tentang Disposisi</p>
            <p className="text-xs text-purple-600 mt-1">Disposisi digunakan untuk meneruskan surat masuk kepada pihak yang berwenang untuk ditindaklanjuti. Setiap disposisi akan tercatat dan dapat dipantau status penyelesaiannya.</p>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Buat Disposisi Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Surat Masuk *</label>
                <select
                  required
                  value={formData.suratId}
                  onChange={(e) => setFormData({ ...formData, suratId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="">-- Pilih Surat --</option>
                  {suratMasuk.filter(s => s.status !== 'Diarsipkan').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nomorSurat} - {s.perihal} ({s.pengirim})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ditujukan Kepada *</label>
                <input
                  type="text"
                  required
                  value={formData.kepada}
                  onChange={(e) => setFormData({ ...formData, kepada: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Nama/Jabatan penerima disposisi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instruksi *</label>
                <textarea
                  required
                  value={formData.instruksi}
                  onChange={(e) => setFormData({ ...formData, instruksi: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  rows={3}
                  placeholder="Instruksi/tindak lanjut yang diminta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <input
                  type="text"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Catatan tambahan"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  <i className="fas fa-save mr-1"></i> Simpan Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Surat</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Kepada</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Instruksi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDisposisi.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <i className="fas fa-share-nodes text-3xl mb-2 block"></i>
                    Belum ada disposisi
                  </td>
                </tr>
              ) : (
                filteredDisposisi.map((d, idx) => {
                  const surat = suratMasuk.find(s => s.id === d.suratId);
                  return (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3 text-gray-600">{d.tanggal}</td>
                      <td className="px-4 py-3">
                        {surat ? (
                          <div>
                            <p className="text-gray-800 font-medium text-xs">{surat.nomorSurat}</p>
                            <p className="text-gray-500 text-xs truncate max-w-[150px]">{surat.perihal}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Surat dihapus</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{d.kepada}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{d.instruksi}</td>
                      <td className="px-4 py-3">
                        <select
                          value={d.status}
                          onChange={(e) => handleStatusChange(d.id, e.target.value as Disposisi['status'])}
                          className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${getStatusBadge(d.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Diterima">Diterima</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleDelete(d.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500">
          Menampilkan {filteredDisposisi.length} dari {disposisi.length} disposisi
        </div>
      </div>
    </div>
  );
}

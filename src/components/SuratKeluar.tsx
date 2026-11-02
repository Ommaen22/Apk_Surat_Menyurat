import { useState } from 'react';
import { Surat } from '../types';

interface Props {
  surat: Surat[];
  setSurat: (surat: Surat[]) => void;
}

export default function SuratKeluar({ surat, setSurat }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSifat, setFilterSifat] = useState('');
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const [formData, setFormData] = useState({
    nomorSurat: '',
    tanggalSurat: new Date().toISOString().split('T')[0],
    penerima: '',
    perihal: '',
    sifat: 'Biasa' as Surat['sifat'],
    klasifikasi: '',
    keterangan: '',
  });

  const resetForm = () => {
    setFormData({
      nomorSurat: '',
      tanggalSurat: new Date().toISOString().split('T')[0],
      penerima: '',
      perihal: '',
      sifat: 'Biasa',
      klasifikasi: '',
      keterangan: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSurat(surat.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
      const newSurat: Surat = {
        id: Date.now().toString(),
        ...formData,
        tanggalCatat: new Date().toISOString().split('T')[0],
        pengirim: 'Kepala Kantor',
        jenis: 'keluar',
        status: 'Diproses',
        disposisi: [],
      };
      setSurat([newSurat, ...surat]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (s: Surat) => {
    setFormData({
      nomorSurat: s.nomorSurat,
      tanggalSurat: s.tanggalSurat,
      penerima: s.penerima,
      perihal: s.perihal,
      sifat: s.sifat,
      klasifikasi: s.klasifikasi,
      keterangan: s.keterangan,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus surat ini?')) {
      setSurat(surat.filter(s => s.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: Surat['status']) => {
    setSurat(surat.map(s => s.id === id ? { ...s, status } : s));
  };

  const filteredSurat = surat.filter(s => {
    const matchSearch = s.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.penerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || s.status === filterStatus;
    const matchSifat = !filterSifat || s.sifat === filterSifat;
    return matchSearch && matchStatus && matchSifat;
  });

  const getSifatBadge = (sifat: string) => {
    switch (sifat) {
      case 'Biasa': return 'bg-green-100 text-green-700';
      case 'Penting': return 'bg-yellow-100 text-yellow-700';
      case 'Segera': return 'bg-orange-100 text-orange-700';
      case 'Rahasia': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Diproses': return 'bg-yellow-100 text-yellow-700';
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Diarsipkan': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Cari surat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua Status</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Diarsipkan">Diarsipkan</option>
          </select>
          <select value={filterSifat} onChange={(e) => setFilterSifat(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua Sifat</option>
            <option value="Biasa">Biasa</option>
            <option value="Penting">Penting</option>
            <option value="Segera">Segera</option>
            <option value="Rahasia">Rahasia</option>
          </select>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Buat Surat Keluar
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Surat Keluar' : 'Buat Surat Keluar Baru'}
              </h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Contoh: 001/SK/2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalSurat}
                    onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penerima/Tujuan *</label>
                  <input
                    type="text"
                    required
                    value={formData.penerima}
                    onChange={(e) => setFormData({ ...formData, penerima: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Nama penerima/instansi tujuan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sifat Surat *</label>
                  <select
                    value={formData.sifat}
                    onChange={(e) => setFormData({ ...formData, sifat: e.target.value as Surat['sifat'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Segera">Segera</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perihal *</label>
                  <input
                    type="text"
                    required
                    value={formData.perihal}
                    onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Perihal surat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klasifikasi</label>
                  <select
                    value={formData.klasifikasi}
                    onChange={(e) => setFormData({ ...formData, klasifikasi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="">Pilih Klasifikasi</option>
                    <option value="Umum">Umum</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Hukum">Hukum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <input
                    type="text"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="Keterangan tambahan"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  <i className="fas fa-save mr-1"></i> {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Detail Surat Keluar</h3>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Nomor Surat</p><p className="text-sm font-medium">{selectedSurat.nomorSurat}</p></div>
                <div><p className="text-xs text-gray-500">Tanggal Surat</p><p className="text-sm font-medium">{selectedSurat.tanggalSurat}</p></div>
                <div><p className="text-xs text-gray-500">Pengirim</p><p className="text-sm font-medium">{selectedSurat.pengirim}</p></div>
                <div><p className="text-xs text-gray-500">Penerima</p><p className="text-sm font-medium">{selectedSurat.penerima}</p></div>
                <div><p className="text-xs text-gray-500">Sifat</p><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getSifatBadge(selectedSurat.sifat)}`}>{selectedSurat.sifat}</span></div>
                <div><p className="text-xs text-gray-500">Status</p><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(selectedSurat.status)}`}>{selectedSurat.status}</span></div>
                <div><p className="text-xs text-gray-500">Klasifikasi</p><p className="text-sm font-medium">{selectedSurat.klasifikasi || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Tanggal Catat</p><p className="text-sm font-medium">{selectedSurat.tanggalCatat}</p></div>
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">No. Surat</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Penerima</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Perihal</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Sifat</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    <i className="fas fa-paper-plane text-3xl mb-2 block"></i>
                    Tidak ada data surat keluar
                  </td>
                </tr>
              ) : (
                filteredSurat.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.nomorSurat}</td>
                    <td className="px-4 py-3 text-gray-600">{s.tanggalSurat}</td>
                    <td className="px-4 py-3 text-gray-600">{s.penerima}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate">{s.perihal}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSifatBadge(s.sifat)}`}>{s.sifat}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={s.status}
                        onChange={(e) => handleStatusChange(s.id, e.target.value as Surat['status'])}
                        className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${getStatusBadge(s.status)}`}
                      >
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Diarsipkan">Diarsipkan</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setSelectedSurat(s); setShowDetail(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Detail">
                          <i className="fas fa-eye text-xs"></i>
                        </button>
                        <button onClick={() => handleEdit(s)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Edit">
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
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
          Menampilkan {filteredSurat.length} dari {surat.length} surat keluar
        </div>
      </div>
    </div>
  );
}

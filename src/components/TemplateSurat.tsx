import { useState } from 'react';
import { TemplateSurat as TemplateType } from '../types';

const defaultTemplates: TemplateType[] = [
  {
    id: '1',
    nama: 'Surat Dinas',
    jenis: 'Surat Resmi',
    konten: `KOP SURAT INSTANSI
============================================

Nomor    : [Nomor Surat]
Lampiran : [Jumlah Lampiran]
Perihal  : [Perihal Surat]

Kepada Yth.
[Nama Penerima]
[Alamat Penerima]

Dengan hormat,

[Isi surat di sini. Jelaskan maksud dan tujuan surat dengan jelas dan ringkas.]

Demikian surat ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.

[Kota], [Tanggal]
[Jabatan Pengirim]


[Nama Pengirim]
[NIP]`,
  },
  {
    id: '2',
    nama: 'Surat Undangan',
    jenis: 'Undangan',
    konten: `KOP SURAT INSTANSI
============================================

Nomor    : [Nomor Surat]
Lampiran : [Jumlah Lampiran]
Perihal  : Undangan

Kepada Yth.
[Nama Penerima]
[Alamat Penerima]

Dengan hormat,

Sehubungan dengan [sebutkan kegiatan/acara], bersama ini kami mengundang Bapak/Ibu untuk hadir pada:

Hari/Tanggal : [Hari, Tanggal]
Waktu        : [Jam]
Tempat       : [Lokasi]
Acara        : [Nama Acara]

Mengingat pentingnya acara tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.

Demikian undangan ini kami sampaikan. Atas perhatian dan kehadiran Bapak/Ibu, kami ucapkan terima kasih.

[Kota], [Tanggal]
[Jabatan Pengirim]


[Nama Pengirim]
[NIP]`,
  },
  {
    id: '3',
    nama: 'Surat Keterangan',
    jenis: 'Keterangan',
    konten: `KOP SURAT INSTANSI
============================================

SURAT KETERANGAN
Nomor: [Nomor Surat]

Yang bertanda tangan di bawah ini:

Nama       : [Nama Pejabat]
Jabatan    : [Jabatan]
Unit Kerja : [Unit Kerja]

Menerangkan dengan sesungguhnya bahwa:

Nama       : [Nama yang diterangkan]
NIK/NIP    : [Nomor Identitas]
Jabatan    : [Jabatan]
Alamat     : [Alamat]

Adalah benar [keterangan yang diberikan].

Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.

[Kota], [Tanggal]
[Jabatan]


[Nama Pejabat]
[NIP]`,
  },
  {
    id: '4',
    nama: 'Surat Tugas',
    jenis: 'Tugas',
    konten: `KOP SURAT INSTANSI
============================================

SURAT TUGAS
Nomor: [Nomor Surat]

Dasar:
1. [Dasar pertama]
2. [Dasar kedua]

Menugaskan kepada:

Nama       : [Nama Pegawai]
NIP        : [NIP]
Jabatan    : [Jabatan]
Unit Kerja : [Unit Kerja]

Untuk:
[Maksud penugasan secara detail]

Waktu pelaksanaan: [Tanggal mulai] s.d. [Tanggal selesai]
Tempat           : [Lokasi penugasan]

Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.

[Kota], [Tanggal]
[Jabatan Pemberi Tugas]


[Nama Pejabat]
[NIP]`,
  },
  {
    id: '5',
    nama: 'Surat Permohonan',
    jenis: 'Permohonan',
    konten: `KOP SURAT INSTANSI
============================================

Nomor    : [Nomor Surat]
Lampiran : [Jumlah Lampiran]
Perihal  : Permohonan [Jenis Permohonan]

Kepada Yth.
[Nama Penerima]
[Jabatan]
[Instansi]

Dengan hormat,

Sehubungan dengan [alasan permohonan], bersama ini kami mengajukan permohonan [jenis permohonan] untuk [tujuan/keperluan].

Sebagai bahan pertimbangan, bersama ini kami lampirkan:
1. [Dokumen lampiran 1]
2. [Dokumen lampiran 2]
3. [Dokumen lampiran 3]

Besar harapan kami agar permohonan ini dapat dikabulkan. Demikian permohonan ini kami sampaikan. Atas perhatian dan kebijaksanaan Bapak/Ibu, kami ucapkan terima kasih.

[Kota], [Tanggal]
[Jabatan Pengirim]


[Nama Pengirim]
[NIP]`,
  },
  {
    id: '6',
    nama: 'Nota Dinas',
    jenis: 'Internal',
    konten: `NOTA DINAS

Kepada  : [Nama/Jabatan Penerima]
Dari    : [Nama/Jabatan Pengirim]
Tanggal : [Tanggal]
Nomor   : [Nomor]
Lampiran: [Jumlah]
Perihal : [Perihal]

-------------------------------------------------------------------

[Isi nota dinas. Sampaikan informasi, instruksi, atau laporan secara ringkas dan jelas.]

[Jika diperlukan, tambahkan poin-poin penting:]
1. [Poin pertama]
2. [Poin kedua]
3. [Poin ketiga]

Demikian untuk menjadi maklum. Atas perhatiannya diucapkan terima kasih.


[Nama Pengirim]`,
  },
];

export default function TemplateSurat() {
  const [templates, setTemplates] = useState<TemplateType[]>(() => {
    const saved = localStorage.getItem('templateSurat');
    return saved ? JSON.parse(saved) : defaultTemplates;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    jenis: '',
    konten: '',
  });

  const saveTemplates = (newTemplates: TemplateType[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('templateSurat', JSON.stringify(newTemplates));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      saveTemplates(templates.map(t => t.id === editingId ? { ...t, ...formData } : t));
    } else {
      const newTemplate: TemplateType = {
        id: Date.now().toString(),
        ...formData,
      };
      saveTemplates([...templates, newTemplate]);
    }
    setFormData({ nama: '', jenis: '', konten: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (t: TemplateType) => {
    setFormData({ nama: t.nama, jenis: t.jenis, konten: t.konten });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus template ini?')) {
      saveTemplates(templates.filter(t => t.id !== id));
    }
  };

  const handlePreview = (t: TemplateType) => {
    setSelectedTemplate(t);
    setShowPreview(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedTemplate) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedTemplate.nama}</title>
            <style>
              body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; padding: 40px; white-space: pre-wrap; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>${selectedTemplate.konten}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Gunakan template untuk mempercepat pembuatan surat</p>
        </div>
        <button
          onClick={() => { setFormData({ nama: '', jenis: '', konten: '' }); setEditingId(null); setShowForm(true); }}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Tambah Template
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{t.nama}</h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{t.jenis}</span>
              </div>
              <i className="fas fa-file-lines text-orange-400 text-2xl"></i>
            </div>
            <p className="text-xs text-gray-500 line-clamp-3 mb-4">{t.konten.substring(0, 150)}...</p>
            <div className="flex gap-2">
              <button onClick={() => handlePreview(t)} className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 flex items-center justify-center gap-1">
                <i className="fas fa-eye"></i> Preview
              </button>
              <button onClick={() => handleEdit(t)} className="flex-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded text-xs hover:bg-yellow-100 flex items-center justify-center gap-1">
                <i className="fas fa-edit"></i> Edit
              </button>
              <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Template' : 'Tambah Template Baru'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Contoh: Surat Perjanjian"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis *</label>
                  <input
                    type="text"
                    required
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Contoh: Resmi, Internal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Template *</label>
                <textarea
                  required
                  value={formData.konten}
                  onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                  rows={15}
                  placeholder="Tulis konten template surat di sini..."
                />
                <p className="text-xs text-gray-400 mt-1">Gunakan [tanda kurung siku] untuk field yang perlu diisi</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
                  <i className="fas fa-save mr-1"></i> {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Preview: {selectedTemplate.nama}</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-8">
              <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800">{selectedTemplate.konten}</pre>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                Tutup
              </button>
              <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                <i className="fas fa-print"></i> Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface Surat {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  tanggalCatat: string;
  pengirim: string;
  penerima: string;
  perihal: string;
  jenis: 'masuk' | 'keluar';
  sifat: 'Biasa' | 'Penting' | 'Segera' | 'Rahasia';
  status: 'Baru' | 'Disposisi' | 'Diproses' | 'Selesai' | 'Diarsipkan';
  klasifikasi: string;
  keterangan: string;
  fileAttachment?: string;
  disposisi?: Disposisi[];
}

export interface Disposisi {
  id: string;
  suratId: string;
  kepada: string;
  instruksi: string;
  tanggal: string;
  status: 'Pending' | 'Diterima' | 'Diproses' | 'Selesai';
  catatan: string;
}

export interface TemplateSurat {
  id: string;
  nama: string;
  jenis: string;
  konten: string;
}

export type PageType = 'dashboard' | 'surat-masuk' | 'surat-keluar' | 'disposisi' | 'arsip' | 'laporan' | 'template';

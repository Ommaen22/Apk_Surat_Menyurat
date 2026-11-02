import { useState, useEffect } from 'react';
import { Surat, Disposisi, PageType } from './types';
import Dashboard from './components/Dashboard';
import SuratMasuk from './components/SuratMasuk';
import SuratKeluar from './components/SuratKeluar';
import DisposisiPage from './components/DisposisiPage';
import Arsip from './components/Arsip';
import Laporan from './components/Laporan';
import TemplateSurat from './components/TemplateSurat';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [suratMasuk, setSuratMasuk] = useState<Surat[]>([]);
  const [suratKeluar, setSuratKeluar] = useState<Surat[]>([]);
  const [disposisi, setDisposisi] = useState<Disposisi[]>([]);

  useEffect(() => {
    const savedMasuk = localStorage.getItem('suratMasuk');
    const savedKeluar = localStorage.getItem('suratKeluar');
    const savedDisposisi = localStorage.getItem('disposisi');
    if (savedMasuk) setSuratMasuk(JSON.parse(savedMasuk));
    if (savedKeluar) setSuratKeluar(JSON.parse(savedKeluar));
    if (savedDisposisi) setDisposisi(JSON.parse(savedDisposisi));
  }, []);

  useEffect(() => {
    localStorage.setItem('suratMasuk', JSON.stringify(suratMasuk));
  }, [suratMasuk]);

  useEffect(() => {
    localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
  }, [suratKeluar]);

  useEffect(() => {
    localStorage.setItem('disposisi', JSON.stringify(disposisi));
  }, [disposisi]);

  const menuItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'surat-masuk' as PageType, label: 'Surat Masuk', icon: 'fa-inbox' },
    { id: 'surat-keluar' as PageType, label: 'Surat Keluar', icon: 'fa-paper-plane' },
    { id: 'disposisi' as PageType, label: 'Disposisi', icon: 'fa-share-nodes' },
    { id: 'arsip' as PageType, label: 'Arsip Surat', icon: 'fa-folder-open' },
    { id: 'laporan' as PageType, label: 'Laporan', icon: 'fa-chart-bar' },
    { id: 'template' as PageType, label: 'Template Surat', icon: 'fa-file-lines' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard suratMasuk={suratMasuk} suratKeluar={suratKeluar} disposisi={disposisi} setCurrentPage={setCurrentPage} />;
      case 'surat-masuk':
        return <SuratMasuk surat={suratMasuk} setSurat={setSuratMasuk} />;
      case 'surat-keluar':
        return <SuratKeluar surat={suratKeluar} setSurat={setSuratKeluar} />;
      case 'disposisi':
        return <DisposisiPage suratMasuk={suratMasuk} setSuratMasuk={setSuratMasuk} disposisi={disposisi} setDisposisi={setDisposisi} />;
      case 'arsip':
        return <Arsip suratMasuk={suratMasuk} suratKeluar={suratKeluar} setSuratMasuk={setSuratMasuk} setSuratKeluar={setSuratKeluar} />;
      case 'laporan':
        return <Laporan suratMasuk={suratMasuk} suratKeluar={suratKeluar} disposisi={disposisi} />;
      case 'template':
        return <TemplateSurat />;
      default:
        return <Dashboard suratMasuk={suratMasuk} suratKeluar={suratKeluar} disposisi={disposisi} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Logo */}
        <div className="p-4 border-b border-blue-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-envelope text-blue-900 text-sm"></i>
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg leading-tight">SIMAS</h1>
              <p className="text-[10px] text-blue-300">Sistem Manajemen Surat</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-blue-700/50 ${
                currentPage === item.id ? 'bg-blue-700/70 border-r-4 border-yellow-400' : ''
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${currentPage === item.id ? 'text-yellow-400' : 'text-blue-300'}`}></i>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-blue-700 hover:bg-blue-700/50 transition-colors"
        >
          <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-blue-300`}></i>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
            </h2>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <i className="fas fa-bell text-gray-400 cursor-pointer hover:text-blue-600"></i>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {suratMasuk.filter(s => s.status === 'Baru').length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-xs"></i>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-[10px] text-gray-400">Operator Surat</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;

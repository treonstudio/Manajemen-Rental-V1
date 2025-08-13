export const mockSupportTickets = [
  {
    id: 'TCK-001',
    userId: '1',
    userName: 'Super Admin',
    userEmail: 'owner@demo.com',
    subject: 'Error saat upload foto kendaraan',
    category: 'technical_issue',
    priority: 'medium',
    status: 'in_progress',
    description: 'Tidak bisa upload foto kendaraan, muncul error "File too large"',
    createdAt: '2025-01-11T09:30:00Z',
    updatedAt: '2025-01-11T14:15:00Z',
    response: 'Tim support sedang menangani masalah ini. Pastikan ukuran file foto maksimal 5MB.',
    assignedTo: 'Support Team',
    whatsappSent: true
  },
  {
    id: 'TCK-002',
    userId: '2',
    userName: 'Admin Utama',
    userEmail: 'admin@demo.com',
    subject: 'Permintaan training untuk fitur baru',
    category: 'training_request',
    priority: 'low',
    status: 'open',
    description: 'Butuh training untuk penggunaan fitur manajemen pengguna yang baru',
    createdAt: '2025-01-10T16:20:00Z',
    updatedAt: '2025-01-10T16:20:00Z',
    assignedTo: 'Training Team',
    whatsappSent: true
  }
]

export const mockSupportFAQs = [
  {
    id: '1',
    question: 'Bagaimana cara menambah kendaraan baru ke sistem?',
    answer: 'Untuk menambah kendaraan baru: \n1. Masuk ke menu "Inventaris Kendaraan" \n2. Klik tombol "Tambah Kendaraan" \n3. Isi semua informasi yang diperlukan (nama, plat nomor, kategori, tarif harian) \n4. Upload foto kendaraan \n5. Klik "Simpan" untuk menyelesaikan.',
    category: 'vehicle_management',
    helpfulCount: 25,
    tags: ['kendaraan', 'tambah', 'inventaris'],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  },
  {
    id: '2',
    question: 'Bagaimana cara memproses pembayaran pelanggan?',
    answer: 'Untuk memproses pembayaran: \n1. Buka menu "Transaksi" \n2. Pilih transaksi yang ingin diproses \n3. Klik "Tambah Pembayaran" \n4. Masukkan jumlah pembayaran dan metode \n5. Upload bukti transfer jika diperlukan \n6. Klik "Verifikasi Pembayaran"',
    category: 'transaction_management',
    helpfulCount: 18,
    tags: ['pembayaran', 'transaksi', 'verifikasi'],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-09T14:30:00Z'
  },
  {
    id: '3',
    question: 'Bagaimana cara mengirim reminder WhatsApp ke pelanggan?',
    answer: 'Untuk mengirim reminder WhatsApp: \n1. Masuk ke menu "Pengaturan Komunikasi" \n2. Pilih template pesan yang sesuai \n3. Atau gunakan fitur reminder otomatis di menu "Jadwal Sewa" \n4. Sistem akan mengirim reminder sesuai jadwal yang ditentukan',
    category: 'communication',
    helpfulCount: 32,
    tags: ['whatsapp', 'reminder', 'komunikasi', 'pelanggan'],
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-11T08:45:00Z'
  }
]
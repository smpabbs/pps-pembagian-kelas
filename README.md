# PPS 2026/2027 — Pembagian Kelas SMP ABBS Surakarta

Website untuk mengelola data PPS dan pembagian kelas 7A–7E.
**Auto-sync ke GitHub setiap kali data disimpan.**

🌐 **URL:** https://pps2627.vercel.app

## Fitur
- 📊 **Dashboard** — Statistik dan ringkasan pembagian kelas
- 📋 **Data PPS** — Tabel data semua siswa (bisa diedit langsung!)
- 👥 **Pembagian Kelas** — Lihat komposisi per kelas (7A–7E), auto recalculate
- 📖 **Aturan** — Dokumentasi aturan pembagian kelas
- 💾 **Simpan Data** — Auto-commit ke GitHub, data permanen

## Cara Pakai
1. Buka **https://pps2627.vercel.app**
2. **Edit data** langsung klik sel di tab Data PPS
3. Pembagian kelas **otomatis menyesuaikan**
4. Klik **💾 Simpan Data** → tersimpan permanen di GitHub (~1-2 detik)
5. Buka dari HP/manapun — data sudah yang terbaru ✅

## Struktur Repo
```
├── index.html         # Website utama
├── data.json          # Data siswa (source of truth)
├── api/
│   ├── data.js        # Vercel Function: baca data dari GitHub
│   └── simpan.js      # Vercel Function: commit perubahan ke GitHub
├── vercel.json
└── README.md
```

## Update Data dari Excel
```bash
python3 export_data.py    # Export → data.json
# atau edit langsung di website, klik Simpan Data
```

## Teknologi
- HTML + CSS + JavaScript (vanilla)
- Vercel Serverless Functions (auto-sync)
- GitHub API (read/write data.json)

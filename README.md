# PPS 2026/2027 — Pembagian Kelas SMP ABBS Surakarta

Website untuk melihat dan mengelola data PPS serta pembagian kelas 7A–7E.

## Fitur
- 📊 **Dashboard** — Statistik dan ringkasan pembagian kelas
- 📋 **Data PPS** — Tabel data semua siswa (bisa diedit langsung!)
- 👥 **Pembagian Kelas** — Lihat komposisi per kelas (7A–7E)
- 📖 **Aturan** — Dokumentasi aturan pembagian kelas

## Cara Pakai
1. Buka `index.html` di browser (atau via Vercel)
2. **Edit data** langsung klik sel di tab Data PPS
3. Pembagian kelas **otomatis menyesuaikan**
4. Klik **💾 Simpan Data** untuk menyimpan ke browser
5. Klik **📥 Download Data** untuk backup

## Deploy ke Vercel
1. Push repo ini ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Import repo → deploy (static, no config needed)
4. Selesai! Website langsung online

## Update Data dari Excel
```
python3 export_data.py    # Export Excel → data_pps.json
```

## Teknologi
- HTML + CSS + JavaScript (vanilla, no framework)
- Data tersimpan di localStorage browser
- Vercel / GitHub Pages (static hosting)

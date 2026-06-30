// api/simpan.js — Vercel Serverless Function
// Menyimpan perubahan data.json ke GitHub (auto-commit)
const OWNER = process.env.REPO_OWNER || 'smpabbs';
const REPO = process.env.REPO_NAME || 'pps-pembagian-kelas';
const TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { siswa, sha } = req.body;

    if (!siswa || !Array.isArray(siswa)) {
      return res.status(400).json({ error: 'Data siswa tidak valid' });
    }

    // Rebuild data.json structure
    const l_count = siswa.filter(s => s.program.endsWith('-L')).length;
    const p_count = siswa.filter(s => s.program.endsWith('-P')).length;

    // Cari tanggal terbaru
    let latestDate = '';
    let latest = 0;
    for (const s of siswa) {
      const parts = s.tgl_daftar.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[2])*10000 + parseInt(parts[1])*100 + parseInt(parts[0]);
        if (d > latest && d < 99999999) { latest = d; latestDate = s.tgl_daftar; }
      }
    }

    const dataBaru = {
      title: 'PENERIMAAN PESERTA DIDIK BARU (PPS) 2026/2027',
      sekolah: 'SMP ABBS Surakarta',
      total: siswa.length,
      l_count,
      p_count,
      per_tanggal: latestDate,
      siswa
    };

    const content = Buffer.from(JSON.stringify(dataBaru, null, 2)).toString('base64');
    const commitMsg = `Update data: ${siswa.length} siswa (${l_count}L / ${p_count}P) — ${new Date().toLocaleString('id-ID')}`;

    // Ambil SHA jika tidak dikirim dari client
    let currentSha = sha;
    if (!currentSha) {
      const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/data.json`;
      const getRes = await fetch(getUrl, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'pps-app'
        }
      });
      if (getRes.ok) {
        const existing = await getRes.json();
        currentSha = existing.sha;
      }
    }

    // Commit ke GitHub
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/data.json`;
    const body = {
      message: commitMsg,
      content: content,
      sha: currentSha || undefined
    };

    const commitRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'pps-app',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!commitRes.ok) {
      const errData = await commitRes.json().catch(() => ({}));
      return res.status(500).json({
        error: 'Gagal commit ke GitHub',
        detail: errData.message || commitRes.statusText
      });
    }

    const result = await commitRes.json();
    const newSha = result.content?.sha;

    return res.status(200).json({
      success: true,
      message: `✅ Data tersimpan! ${siswa.length} siswa`,
      sha: newSha,
      commit: commitMsg,
      html_url: result.content?.html_url
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

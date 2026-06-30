// api/data.js — Vercel Serverless Function
// Membaca data.json dari GitHub (live, tanpa CDN cache)
const OWNER = process.env.REPO_OWNER || 'smpabbs';
const REPO = process.env.REPO_NAME || 'pps-pembagian-kelas';
const TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Fetch data.json langsung dari GitHub API (bukan CDN)
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/data.json`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'pps-app'
      }
    });

    if (!response.ok) {
      // Fallback: coba dari raw.githubusercontent.com
      const fallbackUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/data.json`;
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) {
        return res.status(500).json({ error: 'Gagal membaca data' });
      }
      const text = await fallbackRes.text();
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(text);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    
    res.setHeader('Content-Type', 'application/json');
    // Kirim data + SHA (SHA diperlukan untuk update nanti)
    const parsed = JSON.parse(content);
    parsed._sha = data.sha;
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

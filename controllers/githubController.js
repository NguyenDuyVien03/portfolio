const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

async function fetchGitHubStats(username) {
  if (!username) {
    return {
      username: null,
      repoCount: 0,
      topLanguage: 'N/A',
      repos: [],
      error: 'Chưa cấu hình GITHUB_USERNAME trong file .env',
    };
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get(`${GITHUB_API}/users/${username}`, {
        headers: { Accept: 'application/vnd.github+json' },
        timeout: 8000,
      }),
      axios.get(`${GITHUB_API}/users/${username}/repos`, {
        params: { sort: 'updated', per_page: 6, type: 'owner' },
        headers: { Accept: 'application/vnd.github+json' },
        timeout: 8000,
      }),
    ]);

    const repos = reposRes.data.filter((r) => !r.fork).slice(0, 6);
    const languageCount = {};

    await Promise.all(
      repos.slice(0, 5).map(async (repo) => {
        try {
          const langRes = await axios.get(`${GITHUB_API}/repos/${username}/${repo.name}/languages`, {
            timeout: 5000,
          });
          Object.keys(langRes.data).forEach((lang) => {
            languageCount[lang] = (languageCount[lang] || 0) + langRes.data[lang];
          });
        } catch {
          /* skip repo language fetch */
        }
      })
    );

    const topLanguage =
      Object.entries(languageCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      username,
      avatar: userRes.data.avatar_url,
      profileUrl: userRes.data.html_url,
      repoCount: userRes.data.public_repos,
      topLanguage,
      repos: repos.map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updated: r.updated_at,
      })),
      error: null,
    };
  } catch (err) {
    console.error('GitHub API error:', err.message);
    return {
      username,
      repoCount: 0,
      topLanguage: 'N/A',
      repos: [],
      error: 'Không thể tải dữ liệu GitHub. Kiểm tra username hoặc giới hạn API.',
    };
  }
}

module.exports = { fetchGitHubStats };

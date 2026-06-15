const { fetchGitHubStats } = require('./githubController');

async function getHomePage(req, res) {
  const githubUsername = process.env.GITHUB_USERNAME || '';
  const github = await fetchGitHubStats(githubUsername);

  res.render('pages/index', {
    title: 'Trang chủ',
    github,
  });
}

module.exports = { getHomePage };

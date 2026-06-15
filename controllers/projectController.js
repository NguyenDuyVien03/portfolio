const siteData = require('../data/siteData');

function getProjectDetail(req, res) {
  const { slug } = req.params;
  const project = siteData.projectDetails[slug];
  const summary = siteData.projects.find((p) => p.slug === slug);

  if (!project || !summary) {
    return res.status(404).render('pages/404', { title: 'Không tìm thấy dự án' });
  }

  res.render('pages/project-detail', {
    title: project.title,
    project,
    summary,
    slug,
  });
}

module.exports = { getProjectDetail };

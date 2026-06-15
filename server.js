require('dotenv').config();

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const indexRoutes = require('./routes/index');
const projectRoutes = require('./routes/projects');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.site = require('./data/siteData');
  res.locals.currentPath = req.path;
  next();
});

app.use('/', indexRoutes);
app.use('/projects', projectRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Không tìm thấy trang' });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).render('pages/404', {
    title: 'Lỗi hệ thống',
    message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio đang chạy tại http://localhost:${PORT}`);
});

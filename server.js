require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const locales = {};
fs.readdirSync(path.join(__dirname, 'locales')).forEach((file) => {
  const lang = path.basename(file, '.json');
  locales[lang] = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', file), 'utf-8'));
});

app.use((req, res, next) => {
  const supported = ['vi', 'en'];
  const queryLang = req.query.lang;
  const cookieLang = req.cookies && req.cookies.lang;
  let lang = queryLang || cookieLang || 'vi';
  if (!supported.includes(lang)) lang = 'vi';

  if (queryLang && cookieLang !== queryLang) {
    res.cookie('lang', queryLang, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  }

  const locale = locales[lang] || locales.vi;

  res.locals.lang = lang;
  res.locals.locale = locale;
  res.locals.t = (key) => locale[key] || key;

  res.locals._l = (obj) => {
    if (typeof obj === 'string' && obj) return obj;
    if (obj && typeof obj === 'object') {
      if (lang === 'en' && obj.en !== undefined) return obj.en;
      return obj.vi !== undefined ? obj.vi : obj.en || obj;
    }
    return obj;
  };

  res.locals.site = require('./data/siteData');
  res.locals.currentPath = req.path;
  next();
});

app.use('/', indexRoutes);
app.use('/projects', projectRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: res.locals.t('error.notFound') });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).render('pages/404', {
    title: res.locals.t('error.systemError'),
    message: res.locals.t('error.message'),
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio dang chay tai http://localhost:${PORT}`);
});

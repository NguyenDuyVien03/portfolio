# Website Portfolio Cá Nhân

Portfolio chuyên nghiệp cho vị trí **Fresher/Junior Backend Developer**, xây dựng theo tài liệu yêu cầu.

## Công nghệ

| Layer | Stack |
|-------|--------|
| Backend | NodeJS, ExpressJS |
| View | EJS Template Engine |
| UI | HTML5, CSS3, Bootstrap 5 |
| Thư viện | Font Awesome, AOS, Axios |

## Cấu trúc thư mục

```
portfolio/
├── server.js              # Entry point
├── data/
│   └── siteData.js        # Dữ liệu tĩnh (profile, dự án, timeline...)
├── routes/
│   ├── index.js
│   ├── projects.js
│   └── api.js
├── controllers/
├── views/
│   ├── layouts/
│   ├── partials/
│   └── pages/
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── files/
└── .env
```

## Cài đặt & chạy

```bash
npm install
cp .env.example .env
# Sửa GITHUB_USERNAME trong .env
npm run dev
```

Mở: **http://localhost:3000**

## Routes

| URL | Mô tả |
|-----|--------|
| `/` | Trang chủ (tất cả sections) |
| `/projects/ecommerce-furniture` | Khóa luận TMĐT nội thất |
| `/projects/mverse-media` | Freelance Mverse Media |
| `/projects/real-estate` | Thực tập BĐS (System Analyst) |
| `/projects/portfolio` | Website Portfolio |
| `POST /api/contact` | Form liên hệ |
| `GET /api/github` | Dữ liệu GitHub API |

## Tùy chỉnh

1. **Thông tin cá nhân**: `data/siteData.js`
2. **GitHub API**: file `.env` → `GITHUB_USERNAME=ten-github-cua-ban`
3. **CV**: đặt file `public/files/cv.pdf`
4. **Ảnh đại diện**: thay `public/images/avatar.svg` hoặc cập nhật `profile.avatar`

## Tính năng

- Responsive (Desktop, Laptop, Tablet, Mobile)
- Dark / Light mode (localStorage)
- Tích hợp GitHub API (repos, ngôn ngữ, thống kê)
- Form liên hệ (Axios POST)
- AOS scroll animations
- Trang chi tiết từng dự án

## Production

```bash
npm start
```

Set biến môi trường `PORT` nếu cần.

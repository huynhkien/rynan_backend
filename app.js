const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var hpp = require('hpp');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const {notFound, errorHandler} = require('./src/middlewares/errHandle');
const app = express();
require('dotenv').config();
const userRouter = require('./src/routes/users.route');
const categoryRouter = require('./src/routes/categories.route');
const productRouter = require('./src/routes/products.route');
const orderRouter = require('./src/routes/orders.route');
const specificationRouter = require('./src/routes/specifications.route');
const quoteRouter = require('./src/routes/quotes.route');
const receiptRouter = require('./src/routes/receipts.route');
const inventoryRouter = require('./src/routes/inventories.route');
const materialRouter = require('./src/routes/materials.route');
const supplierRouter = require('./src/routes/suppliers.route');

// Ngăn chặn injection NoSQL
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  // KHÔNG gán lại req.query trực tiếp nếu nó là getter-only
  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach((key) => {
      const value = req.query[key];
      if (typeof value === 'object') {
        req.query[key] = mongoSanitize.sanitize(value);
      }
    });
  }
  next();
});
// Bảo mật http
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
// Phân tích JSON
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
// Phân tích url-encoded body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// cors => truyền dữ liệu
const corsOptions = {
   origin: [
    'https://rynan-frontend-n2dm.vercel.app',
    'https://rynan-frontend-n2dm-ejal6lpti-kiens-projects-37788a2e.vercel.app',
    'https://rynan-frontend-n2dm-git-main-kiens-projects-37788a2e.vercel.app',
    'http://localhost:3000',
    'https://rynan-frontend-cv3l.vercel.app'
  ],
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
   optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// Xử lý params
app.use(hpp({
    whitelist: ['sort', 'fields'] 
}));
// tự động lấy cookie
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    return res.json({
        message: "Welcome"
    })
})
// api
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);
app.use('/api/specification', specificationRouter); 
app.use('/api/quote', quoteRouter); 
app.use('/api/receipt', receiptRouter); 
app.use('/api/inventory', inventoryRouter); 
app.use('/api/material', materialRouter); 
app.use('/api/supplier', supplierRouter); 
// Bắt các route không khớp, trả về lỗi 404
app.use(notFound)
// Xử lý lỗi
app.use(errorHandler)

module.exports = app;

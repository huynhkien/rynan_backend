const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var hpp = require('hpp');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const {notFound, errorHandler} = require('./src/middlewares/errHandle');
const app = express();
require('dotenv').config();
const userRouter = require('./src/routes/users.route');
const categoryRouter = require('./src/routes/categories.route');
const productRouter = require('./src/routes/products.route');
const orderRouter = require('./src/routes/orders.route');
const specificationRouter = require('./src/routes/specifications.route');

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
// Giới hạn số lần request
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
        error: 'Quá nhiều requests từ IP này, vui lòng thử lại sau.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Phân tích JSON
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
// Phân tích url-encoded body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// cors => truyền dữ liệu
const corsOptions = {
   origin: 'http://localhost:3000',
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
// Bắt các route không khớp, trả về lỗi 404
app.use(notFound)
// Xử lý lỗi
app.use(errorHandler)

module.exports = app;
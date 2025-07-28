const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ordersRouter = require('./routes/orders');
const menusRouter = require('./routes/menus');
const authRouter = require('./routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: 'lunchbox-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static('public'));

app.use('/orders', ordersRouter);
app.use('/menus', menusRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

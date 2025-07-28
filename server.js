const express = require('express');
const bodyParser = require('body-parser');
const ordersRouter = require('./routes/orders');
const menusRouter = require('./routes/menus');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/orders', ordersRouter);
app.use('/menus', menusRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

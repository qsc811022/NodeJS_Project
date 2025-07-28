const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');

// Get all orders with menu and user name
router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request()
      .query(`SELECT Orders.Id, Users.Username, Menus.Name AS MenuName, Menus.Price, Orders.Note
              FROM Orders
              JOIN Users ON Orders.UserId = Users.Id
              JOIN Menus ON Orders.MenuId = Menus.Id`);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create an order (create user if not exists)
router.post('/', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Not logged in');
  await poolConnect;
  const { menuId, note } = req.body;
  try {
    await pool.request()
      .input('userId', sql.Int, req.session.user.id)
      .input('menuId', sql.Int, menuId)
      .input('note', sql.NVarChar(255), note)
      .query('INSERT INTO Orders (UserId, MenuId, OrderDate, Note) VALUES (@userId, @menuId, GETDATE(), @note)');
    res.status(201).send('Order created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/stats/today', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request()
      .query(`SELECT Menus.Name, COUNT(*) AS Quantity, SUM(Menus.Price) AS Total
              FROM Orders
              JOIN Menus ON Orders.MenuId = Menus.Id
              WHERE Orders.OrderDate = CAST(GETDATE() AS DATE)
              GROUP BY Menus.Name`);

    const summary = await pool.request()
      .query(`SELECT COUNT(*) AS TotalCount, SUM(Menus.Price) AS TotalAmount
              FROM Orders JOIN Menus ON Orders.MenuId = Menus.Id
              WHERE Orders.OrderDate = CAST(GETDATE() AS DATE)`);

    res.json({ items: result.recordset, summary: summary.recordset[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

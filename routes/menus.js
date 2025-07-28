const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');

router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query('SELECT * FROM Menus WHERE AvailableDate = CAST(GETDATE() AS DATE)');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create new menu (admin only)
router.post('/', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send('Forbidden');
  }
  await poolConnect;
  const { name, price, availableDate } = req.body;
  try {
    await pool.request()
      .input('name', sql.NVarChar(100), name)
      .input('price', sql.Int, price)
      .input('date', sql.Date, availableDate)
      .query('INSERT INTO Menus (Name, Price, AvailableDate) VALUES (@name, @price, @date)');
    res.status(201).send('Menu created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

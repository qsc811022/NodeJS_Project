const express = require('express');
const router = express.Router();
const { pool, poolConnect } = require('../db');

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

module.exports = router;

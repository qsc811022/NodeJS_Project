const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');

// Get all orders with menu and user name
router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request()
      .query(`SELECT Orders.Id, Users.Name, Menus.Name AS MenuName, Menus.Price, Orders.Note
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
  await poolConnect;
  const { name, menuId, note } = req.body;
  try {
    // check if user exists
    let result = await pool.request()
      .input('name', sql.NVarChar(50), name)
      .query('SELECT Id FROM Users WHERE Name = @name');

    let userId;
    if (result.recordset.length) {
      userId = result.recordset[0].Id;
    } else {
      result = await pool.request()
        .input('name', sql.NVarChar(50), name)
        .query('INSERT INTO Users (Name) OUTPUT INSERTED.Id VALUES (@name)');
      userId = result.recordset[0].Id;
    }

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('menuId', sql.Int, menuId)
      .input('note', sql.NVarChar(255), note)
      .query('INSERT INTO Orders (UserId, MenuId, OrderDate, Note) VALUES (@userId, @menuId, GETDATE(), @note)');
    res.status(201).send('Order created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

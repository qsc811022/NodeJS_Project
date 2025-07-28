const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');

// Login
router.post('/login', async (req, res) => {
  await poolConnect;
  const { username, password } = req.body;
  try {
    const result = await pool.request()
      .input('username', sql.NVarChar(50), username)
      .input('password', sql.NVarChar(255), password)
      .query('SELECT Id, IsAdmin FROM Users WHERE Username=@username AND Password=@password');
    if (!result.recordset.length) {
      return res.status(401).send('Invalid credentials');
    }
    const user = result.recordset[0];
    req.session.user = { id: user.Id, isAdmin: user.IsAdmin };
    res.json({ isAdmin: user.IsAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.sendStatus(200);
  });
});

module.exports = router;

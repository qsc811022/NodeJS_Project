# 🥡 訂便當系統（LunchBox Ordering System）

## 📘 專案簡介
本專案為一個公司內部使用的訂便當系統，支援員工線上點餐、統計數量與金額，具備基本 CRUD 與資料庫儲存功能。使用原生 HTML/CSS/JavaScript 作為前端，Node.js 作為後端，並以 MSSQL 儲存資料。

---

## 💻 技術棧

| 層級   | 技術       |
|--------|------------|
| 前端   | HTML / CSS / JavaScript |
| 後端   | Node.js (Express) |
| 資料庫 | Microsoft SQL Server (MSSQL) |

---

## 🔧 系統功能

### 使用者端
- 登入 / 登出
- 點選便當並填寫備註後提交訂單
- 查看目前所有人的訂單
- 統計各便當品項數量與總金額
- 管理員可新增菜單

---

## 📂 專案目錄預期結構

lunchbox-order/
├── public/
│ ├── index.html
│ ├── style.css
│ └── script.js
├── routes/
│ └── orders.js
├── db.js
├── server.js
├── database.sql
└── README.md

pgsql
複製
編輯

---

## 🗄️ 資料庫設計（MSSQL）

```sql
CREATE TABLE Users (
  Id INT PRIMARY KEY IDENTITY,
  Name NVARCHAR(50)
);

CREATE TABLE Menus (
  Id INT PRIMARY KEY IDENTITY,
  Name NVARCHAR(100),
  Price INT,
  AvailableDate DATE
);

CREATE TABLE Orders (
  Id INT PRIMARY KEY IDENTITY,
  UserId INT,
  MenuId INT,
  OrderDate DATE,
  Note NVARCHAR(255),
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  FOREIGN KEY (MenuId) REFERENCES Menus(Id)
);

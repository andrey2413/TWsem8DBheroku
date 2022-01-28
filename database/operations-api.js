import { databaseConfigProps } from "../config.js";
import mariadb from "mariadb";

const pool = mariadb.createPool(databaseConfigProps);

async function connectToDatabase() {
  var connenction;
  try {
    connenction = await pool.getConnection();
    return connenction;
  } catch (err) {
    throw err;
  }
}

async function getTestValue(dbConn) {
  try {
    const [result] = await dbConn.query("SELECT 1 as val");
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (dbConn) dbConn.end();
  }
}

async function getOrders(dbConn) {
  try {
    const orders = await dbConn.query("SELECT * FROM Orders");
    return orders;
  } catch (err) {
    throw err;
  } finally {
    if (dbConn) dbConn.end();
  }
}

async function getOrder(dbConn, orderId) {
  try {
    const order = await dbConn.query(
      "SELECT * FROM Orders WHERE OrderId = ?",
      [orderId],
      (err) => {
        if (err) throw err;
      }
    );
    return order;
  } catch (err) {
    throw err;
  } finally {
    if (dbConn) dbConn.end();
  }
}

async function deleteOrder(dbConn, orderId) {
  try {
    const order = await dbConn.query(
      "DELETE FROM Orders WHERE OrderId = ?",
      [orderId],
      (err) => {
        if (err) throw err;
      }
    );
    return order;
  } catch (err) {
    throw err;
  } finally {
    if (dbConn) dbConn.end();
  }
}

async function createOrder(dbConn, order) {
  try {
    const { title, quantity, message, city } = order;
    var result = await dbConn.query(
      "INSERT INTO Orders (Title, Quantity, Message, City) VALUES (?, ?, ?, ?)",
      [title, quantity, message, city],
      (err) => {
        if (err) throw err;
      }
    );
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (dbConn) dbConn.end();
  }
}

export var databaseOperationsAPI = {
  connect: connectToDatabase,
  getTestValueBy: getTestValue,
  getOrders: getOrders,
  getOrder: getOrder,
  deleteOrder: deleteOrder,
  createOrder: createOrder,
};

import { Authors, AuthorsXBooks, Orders, Products, Books } from "./sync.js";
import seq from "sequelize";

/* INIT SEQ */
async function sequelizeAuth(sequelizeConnection) {
  try {
    await sequelizeConnection.authenticate();
    console.log("Sequelize has succesfully connected to the database");
  } catch (err) {
    throw err;
  }
}

async function sequelizeSync(sequelizeConnection) {
  try {
    await sequelizeConnection.sync({ force: true, alter: true });
    console.log("Sync complete!");
  } catch (err) {
    throw err;
  }
}

async function executeInitialDatabasePopulation() {
  await Orders.create({
    Title: "Title from code",
    Quantity: 23.6,
    City: "Message from code",
    Message: "City form code",
  });
  await Orders.create({
    Title: "Title from code 2",
    Quantity: 122.6,
    City: "Message from code 2",
    Message: "City form code 2",
  });
  await Products.create({
    Name: "Product one",
    Price: 10,
    OrderId: 1,
  });
  await Authors.create({
    AuthorName: "Nikos Kazantzakis",
  });
  await Authors.create({
    AuthorName: "Maria Stepanova",
  });
  await Authors.create({
    AuthorName: "Gabriel Liiceanu",
  });
  await Authors.create({
    AuthorName: "Robert Greene",
  });
  await Authors.create({
    AuthorName: "Lena Constante",
  });
  await Books.create({
    BookName: "Ascensiunea",
  });
  await Books.create({
    BookName: "In amintirea memoriei",
  });
  await Books.create({
    BookName: "Impudoare. Despre <<eu>> va fi vorba",
  });
  await Books.create({
    BookName: "Asteptand o alta omenire",
  });
  await Books.create({
    BookName: "48 laws of power",
  });
  await Books.create({
    BookName: "Laws of human nature",
  });
  await Books.create({
    BookName: "Evadarea tacuta",
  });
  await Books.create({
    BookName: "Evadarea imposibila",
  });
  await AuthorsXBooks.create({
    AuthorId: 1,
    BookId: 1,
  });
  await AuthorsXBooks.create({
    AuthorId: 2,
    BookId: 2,
  });
  await AuthorsXBooks.create({
    AuthorId: 3,
    BookId: 3,
  });
  await AuthorsXBooks.create({
    AuthorId: 3,
    BookId: 4,
  });
  await AuthorsXBooks.create({
    AuthorId: 4,
    BookId: 5,
  });
  await AuthorsXBooks.create({
    AuthorId: 4,
    BookId: 6,
  });
  await AuthorsXBooks.create({
    AuthorId: 5,
    BookId: 7,
  });
  await AuthorsXBooks.create({
    AuthorId: 5,
    BookId: 8,
  });
}

async function initSequelize(sequelizeConnection) {
  await sequelizeAuth(sequelizeConnection);
  await sequelizeSync(sequelizeConnection);
  await executeInitialDatabasePopulation();
}
/* INIT SEQ */

/* VALIDATIONS */
function validateId(sentId, response, callbackFn = function () {}) {
  if (Number.isFinite(sentId) && sentId > 0) return callbackFn();
  else response.status(500).json("Invalid id!");
}
/* VALIDATIONS */

/* WRAPPER */
async function execAsyncRequest(asyncRequest) {
  try {
    return await asyncRequest();
  } catch (err) {
    throw err;
  }
}
/* WRAPPER */

/* ORDERS */
async function getOrders() {
  return await execAsyncRequest(async function retrieveOrders() {
    return await Orders.findAll();
  });
}

async function getOrderById(orderId) {
  return await execAsyncRequest(async function retrieveOrderById() {
    return await Orders.findAll({ where: { OrderId: orderId } });
  });
}

async function getOrderByQuery(query) {
  return await execAsyncRequest(async function retrieveOrderBySearch() {
    return await Orders.findAll({
      where: {
        Title: {
          [seq.Op.or]: [query.Title],
        },
      },
    });
  });
}

async function getAggregateQuantity(upperLimit) {
  return await execAsyncRequest(async function retrieveQuantitySum() {
    return await Orders.findAll({
      attributes: [[seq.fn("SUM", seq.col("Quantity")), "QuantitySum"]],
      where: {
        Quantity: {
          [seq.Op.lt]: upperLimit,
        },
      },
    });
  });
}

async function createOrder(order) {
  await execAsyncRequest(async function createOrder() {
    await Orders.create({
      Title: order.Title,
      Quantity: order.Quantity,
      City: order.City,
      Message: order.Message,
    });
  });
}

async function updateOrder(orderId, order) {
  await execAsyncRequest(async function updateOrder() {
    var record = await Orders.findByPk(orderId);
    if (record)
      await record.update({
        Title: order.Title,
        Quantity: order.Quantity,
        City: order.City,
        Message: order.Message,
      });
  });
}

async function deleteOrder(orderId) {
  await execAsyncRequest(async function deleteOrder() {
    var record = await Orders.findByPk(orderId);
    if (record) await record.destroy();
  });
}
/* ORDERS */

/* ORDERS WITH PRODUCTS */
async function getOrdersWithProducts(productId) {
  return await execAsyncRequest(
    async function retrieveOrdersWithProductsById() {
      return await Orders.findAll({
        include: [
          {
            model: Products,
            where: { ProductId: productId },
          },
        ],
      });
    }
  );
}

async function createOrderWithProducts(order) {
  await execAsyncRequest(async function createOrderWithProducts() {
    var result = await Orders.create({
      Title: order.Title,
      Quantity: order.Quantity,
      City: order.City,
      Message: order.Message,
    });
    var { Products: products } = order;
    products.forEach((product) => {
      Products.create({
        Name: product.Name,
        Price: product.Price,
        OrderId: result.OrderId,
      });
    });
  });
}
/* ORDERS WITH PRODUCTS */

/* AUTHORS WITH BOOKS */
async function getAuthorsWithBooks() {
  return await execAsyncRequest(async function retrieveAuthorsWithBooks() {
    return await Authors.findAll({
      include: [
        {
          model: Books,
          as: "Books",
        },
      ],
    });
  });
}
/* AUTHORS WITH BOOKS */

export var sequelizeOperationsAPI = {
  init: initSequelize,
  validateId: validateId,
  getOrders: getOrders,
  getOrderById: getOrderById,
  getQuantitySumForValuesLowerThan: getAggregateQuantity,
  getOrderByQuery: getOrderByQuery,
  createOrder: createOrder,
  updateOrder: updateOrder,
  deleteOrder: deleteOrder,
  getOrdersWithProductsBy: getOrdersWithProducts,
  createOrderWithProducts: createOrderWithProducts,
  getAuthorsWithBooks: getAuthorsWithBooks,
};

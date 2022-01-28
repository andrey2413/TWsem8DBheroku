import { router } from "../server-init.js";
import "./sync.js";
import { sequelizeOperationsAPI } from "./operations-api.js";

router
  .route("/sequelize/orders")
  .get(async function getSequelizeOrders(_, response) {
    var result = await sequelizeOperationsAPI.getOrders();
    response.status(200).json(result);
  });

router
  .route("/sequelize/authorsWithBooks")
  .get(async function getAuthorsWithBooks(_, response) {
    var result = await sequelizeOperationsAPI.getAuthorsWithBooks();
    response.status(200).json(result);
  });

router
  .route("/sequelize/orders/quantitySum")
  .get(async function getSequelizeOrders(_, response) {
    var result = await sequelizeOperationsAPI.getQuantitySumForValuesLowerThan(
      40
    ); // Some config number
    response.status(200).json(result);
  });

router
  .route("/sequelize/orders/:orderId")
  .get(async function getOrderById(req, res) {
    const orderId = +req.params.orderId;
    sequelizeOperationsAPI.validateId(
      orderId,
      res,
      async function handleSuccessfulValidation() {
        var result = await sequelizeOperationsAPI.getOrderById(orderId);
        res.status(200).json(result);
      }
    );
  });

router
  .route("/sequelize/ordersWithProducts/:productId")
  .get(async function getOrdersWithProductsById(req, res) {
    const productId = +req.params.productId;
    sequelizeOperationsAPI.validateId(
      productId,
      res,
      async function handleSuccessfulValidation() {
        var result = await sequelizeOperationsAPI.getOrdersWithProductsBy(
          productId
        );
        res.status(200).json(result);
      }
    );
  });

router
  .route("/sequelize/ordersByQuery/search")
  .get(async function getOrderById(req, res) {
    const query = req.query;
    var result = await sequelizeOperationsAPI.getOrderByQuery(query);
    res.status(200).json(result);
  });

router.route("/sequelize/orders").post(async ({ body }, res) => {
  try {
    await sequelizeOperationsAPI.createOrder(body);
    res.status(200).json("Success!");
  } catch (err) {
    console.error(`Error while calling API: ${err}`);
  }
});

router
  .route("/sequelize/orders/:orderId")
  .put(async function updateOrder({ body, params: { orderId } }, res) {
    try {
      sequelizeOperationsAPI.validateId(
        +orderId,
        res,
        async function handleSuccessfulValidation() {
          await sequelizeOperationsAPI.updateOrder(+orderId, body);
          res.status(200).json("Success!");
        }
      );
    } catch (err) {
      console.error(`Error while calling API: ${err}`);
    }
  });

router
  .route("/sequelize/orders/:orderId")
  .delete(async function updateOrder({ params: { orderId } }, res) {
    try {
      sequelizeOperationsAPI.validateId(
        +orderId,
        res,
        async function handleSuccessfulValidation() {
          await sequelizeOperationsAPI.deleteOrder(+orderId);
          res.status(200).json("Success!");
        }
      );
    } catch (err) {
      console.error(`Error while calling API: ${err}`);
    }
  });

router.route("/sequelize/orderWithProducts").post(async ({ body }, res) => {
  try {
    await sequelizeOperationsAPI.createOrderWithProducts(body);
    res.status(200).json("Success!");
  } catch (err) {
    console.error(`Error while calling API: ${err}`);
  }
});

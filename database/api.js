import { router } from "../server-init.js";
import { databaseOperationsAPI } from "./operations-api.js";

var connection;

{
  if (!connection) {
    databaseOperationsAPI.connect().then((con) => (connection = con));
  }
}

router.use(function loggingMiddleware(req, res, next) {
  if (res.statusCode != 200) console.log(req.body, res.statusCode);
  next();
});

/* ROUTES */
router.route("/check-status").get(function sendStatusResponse(_, res) {
  res.status(200).json(`All good! System time: ${new Date()}`);
});

router.route("/get-test-value").get(async function getTestValue(_, res) {
  var value = await databaseOperationsAPI.getTestValueBy(connection);
  res.status(200).json(value);
});

router.route("/orders").get(async function sendOrdersResponse(_, res) {
  var value = await databaseOperationsAPI.getOrders(connection);
  res.status(200).json(value);
});

router
  .route("/orders/:orderId")
  .get(async function sendOrderResponse(req, res) {
    const orderId = +req.params.orderId;
    var order = await databaseOperationsAPI.getOrder(connection, orderId);
    res.status(200).json(order);
  });

router.route("/orders/:orderId").delete(async function deleteOrder(req, res) {
  const orderId = +req.params.orderId;
  var result = await databaseOperationsAPI.deleteOrder(connection, orderId);
  res.status(200).json(result);
});

router.route("/orders").post(async function createOrder(req, res) {
  var order = req.body;
  var result = await databaseOperationsAPI.createOrder(connection, order);
  res.status(200).json(result);
});
/* ROUTES */

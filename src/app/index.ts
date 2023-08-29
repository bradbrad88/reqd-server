import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use("/api/v1", routes);

// app.get("/", (req, res) => {
//   res.json(data);
// });

// app.get("/order", (req, res) => {
//   res.json(order);
// });

// app.get("/items", (req, res) => {
//   res.json(items);
// });

// type ItemList = {
//   itemId: string;
//   areas: {
//     area: string;
//     amount: number;
//   }[];
// }[];

// app.post("/set-order-item-value", (req, res) => {
//   const schema = z.object({
//     itemId: z.string(),
//     area: z.string(),
//     amount: z.number(),
//   });

//   const { amount, area, itemId } = schema.parse(req.body);

//   const updatedOrder = order.map(item => {
//     if (item.itemId !== itemId) return item;

//     const areas = [...item.areas.filter(itemArea => itemArea.area !== area)];

//     if (amount > 0) areas.push({ amount, area });
//     items;
//     return {
//       ...item,
//       areas,
//     };
//   });

//   order = updatedOrder;

//   res.send(true);
// });

// app.post("/new-order", (req, res) => {
//   const date = new Date();
//   const orderId = uuid();
//   const newOrder = {
//     date,
//     orderId,
//   };
//   res.json(newOrder);
// });

// app.listen(port, () => console.log("App listening on port", port));

export default app;

import "dotenv/config";
import app from "./app";

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("App listening on port", port));

console.log(app._router);

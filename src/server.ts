import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  // console.log(`App is running at ${PORT}`);
});

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("=====================================");
    console.log(`� Bunny API running`);
    console.log(`🌍 http://localhost:${PORT}`);
    console.log("=====================================");
});
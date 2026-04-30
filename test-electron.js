const e = require("electron"); console.log("type:", typeof e); console.log("app:", typeof e.app); console.log("keys:", Object.keys(e).join(",")); if(e.app) e.app.quit(); else process.exit(0);

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load the regulations data once at startup
let regs = { meta: {}, species: [] };
try {
  regs = JSON.parse(fs.readFileSync(path.join(__dirname, "regs.json"), "utf8"));
} catch (e) {
  console.error("Could not read regs.json:", e.message);
}

// Health check — visiting the base URL confirms the server is alive
app.get("/", (req, res) => {
  res.json({
    service: "SALTLINE Regulations API",
    status: "ok",
    species: regs.species.length,
    hint: "Try /regs for all species, or /regs/redsnapper for one."
  });
});

// Return all species
app.get("/regs", (req, res) => {
  res.json(regs);
});

// Return a single species by slug (e.g. /regs/redsnapper)
app.get("/regs/:slug", (req, res) => {
  const match = regs.species.find(
    (s) => s.slug.toLowerCase() === req.params.slug.toLowerCase()
  );
  if (!match) return res.status(404).json({ error: "species not found" });
  res.json({ meta: regs.meta, species: match });
});

app.listen(PORT, () => {
  console.log("SALTLINE API running on port " + PORT);
});

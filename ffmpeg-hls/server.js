const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HLS output)
app.use(express.static("public"));

// Basic health
app.get("/", (req, res) => res.send("ffmpeg-hls service is running"));

// Convert endpoint
app.get("/convert", (req, res) => {
  const videoUrl = req.query.url;
  const name = req.query.name || `video-${Date.now()}`;

  if (!videoUrl) {
    return res.status(400).send("❌ Please provide ?url=MKV_LINK");
  }

  const safeName = name.replace(/[^a-zA-Z0-9-_\.]/g, "_");
  const outPath = path.join(__dirname, "public", safeName + ".m3u8");

  if (fs.existsSync(outPath)) {
    return res.send(`✅ Already converted. Play at: /${safeName}.m3u8`);
  }

  const cmd = `bash mkv_to_hls.sh "${videoUrl}" "${safeName}"`;
  exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
    if (err) {
      console.error("Conversion error:\n", stderr);
      return res.status(500).send("❌ Conversion failed. Check server logs.");
    }
    return res.send(`✅ Done! Play your video at: /${safeName}.m3u8`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import "dotenv/config";
import express from "express";
import multer from "multer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(express.json({ limit: "200kb" }));
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Juda ko'p so'rov yuborildi. Biroz kutib qayta urinib ko'ring." }
});
app.use("/api/", limiter);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Faqat JPG, PNG yoki WEBP rasm yuklang."));
    }
    cb(null, true);
  }
});

function getClient() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("BU_YERGA")) {
    throw new Error("Serverda API kaliti sozlanmagan. .env faylini tekshiring.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

app.post("/api/analyze-clothing", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Kiyim rasmini tanlang." });

    const client = getClient();
    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Sen STYLE nomli o'zbekcha AI stilistsan. Rasmda ko'ringan kiyim buyumini tahlil qil.
Faqat JSON qaytar, izoh yoki markdown qo'shma. Tuzilma:
{"name":"qisqa nom","category":"ustki kiyim|futbolka/ko'ylak|shim/yubka|oyoq kiyim|aksessuar|boshqa","color":"asosiy rang(lar)","style":"kundalik|sport|klassik|streetwear|elegant|boshqa","description":"rasmda ko'ringan kiyimning qisqa, xolis tavsifi"}
Agar rasmda kiyim aniq ko'rinmasa, category="boshqa" va description ichida buni ayt. Tana yoki odamning tashqi ko'rinishini baholama.`
          },
          { type: "input_image", image_url: dataUrl, detail: "high" }
        ]
      }],
      max_output_tokens: 250
    });

    const raw = response.output_text || "";
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    let item;
    try {
      item = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: "AI javobini o'qib bo'lmadi. Boshqa rasm bilan urinib ko'ring." });
    }
    res.json({ item });
  } catch (err) {
    console.error("Analyze error:", err.message);
    res.status(500).json({ error: err.message || "Tahlil vaqtida xatolik yuz berdi." });
  }
});

app.post("/api/create-outfit", async (req, res) => {
  try {
    const wardrobe = req.body?.wardrobe;
    const occasion = String(req.body?.occasion || "kundalik").slice(0, 60);
    if (!Array.isArray(wardrobe) || wardrobe.length < 2 || wardrobe.length > 30) {
      return res.status(400).json({ error: "Obraz tavsiyasi uchun garderobga kamida 2 ta kiyim qo'shing." });
    }

    const safeItems = wardrobe.map((x) => ({
      name: String(x.name || "").slice(0, 80),
      category: String(x.category || "").slice(0, 50),
      color: String(x.color || "").slice(0, 60),
      style: String(x.style || "").slice(0, 50),
      description: String(x.description || "").slice(0, 160)
    }));

    const client = getClient();
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [{
        role: "user",
        content: [{
          type: "input_text",
          text: `Sen STYLE o'zbekcha AI stilistsan. Quyidagi garderob buyumlaridan "${occasion}" holati uchun mos obraz tuz.
Mos keladigan buyumlarni tanla, ranglar uyg'unligini hisobga ol. Faqat JSON qaytar:
{"title":"obraz nomi","items":["tanlangan kiyim nomlari"],"explanation":"nima uchun mosligi haqida 2-3 gap","extra_tip":"ixtiyoriy qisqa maslahat"}
Garderob: ${JSON.stringify(safeItems)}`
        }]
      }],
      max_output_tokens: 350
    });

    const cleaned = (response.output_text || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    try {
      res.json({ outfit: JSON.parse(cleaned) });
    } catch {
      res.status(502).json({ error: "AI obraz tavsiyasini o'qib bo'lmadi. Qayta urinib ko'ring." });
    }
  } catch (err) {
    console.error("Outfit error:", err.message);
    res.status(500).json({ error: err.message || "Obraz yaratishda xatolik yuz berdi." });
  }
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Yuklangan faylda xatolik." });
});

app.listen(PORT, () => {
  console.log(`STYLE ishlayapti: http://localhost:${PORT}`);
});

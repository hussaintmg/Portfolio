const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Home = require("../models/homePage");
const upload = require("../middlewares/upload");

// Helper: delete old file safely
function deleteFileIfExists(filePath) {
  if (!filePath) return;
  const absolutePath = path.join(__dirname, "..", "uploads/images", path.basename(filePath));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    console.log("Deleted:", absolutePath);
  }
}

// 📌 Upload Logo
router.post("/upload-logo", upload.single("logo"), async (req, res) => {
  try {
    const logoPath = `/uploads/images/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.logo) {
      deleteFileIfExists(oldData.logo);
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { logo: logoPath },
      { new: true, upsert: true }
    );

    res.json({ message: "Logo updated", logo: homeData.logo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Upload Profile
router.post("/upload-prof", upload.single("Prof"), async (req, res) => {
  try {
    const ProfPath = `/uploads/images/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.Profile) {
      deleteFileIfExists(oldData.Profile);
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { Profile: ProfPath },
      { new: true, upsert: true }
    );

    res.json({ message: "Profile updated", Profile: homeData.Profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Welcome Text
router.post("/upload-wel", async (req, res) => {
  try {
    const { welText } = req.body;
    const updated = await Home.findOneAndUpdate({}, { welText }, { new: true, upsert: true });
    res.json({ welText: updated.welText });
  } catch (error) {
    res.status(500).json({ error: "Failed to update text" });
  }
});

// 📌 MSB, MS
router.post("/upload-msb", async (req, res) => {
  try {
    const { MSB } = req.body;
    const updated = await Home.findOneAndUpdate({}, { MSB }, { new: true, upsert: true });
    res.json({ MSB: updated.MSB });
  } catch {
    res.status(500).json({ error: "Failed to update text" });
  }
});
router.post("/upload-ms", async (req, res) => {
  try {
    const { MS } = req.body;
    const updated = await Home.findOneAndUpdate({}, { MS }, { new: true, upsert: true });
    res.json({ MS: updated.MS });
  } catch {
    res.status(500).json({ error: "Failed to update text" });
  }
});

// 📌 Freelance Options
router.post("/upload-FO", async (req, res) => {
  try {
    const { FOI, FOL } = req.body;
    const homeData = await Home.findOne();
    let FOsaved = homeData?.FO || [];
    FOsaved.push({ FOI, FOL });

    const updated = await Home.findOneAndUpdate({}, { FO: FOsaved }, { new: true, upsert: true });
    res.json({ FO: updated.FO });
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});
router.post("/update-FO", async (req, res) => {
  try {
    const { index, FOI, FOL } = req.body;
    const homeData = await Home.findOne();
    if (!homeData) return res.status(404).json({ message: "No data found" });

    homeData.FO[index] = { FOI, FOL };
    await homeData.save();
    res.json({ message: "FO updated", FO: homeData.FO });
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});
router.post("/delete-FO", async (req, res) => {
  try {
    const { index } = req.body;
    let homeData = await Home.findOne();

    if (!homeData) return res.status(404).json({ message: "No FO data found" });
    if (index < 0 || index >= homeData.FO.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    homeData.FO.splice(index, 1);
    await homeData.save();
    res.json({ message: "FO deleted", FO: homeData.FO });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 Email Icon + Text
router.post("/upload-emi", upload.single("EMI"), async (req, res) => {
  try {
    const EMIPath = `/uploads/images/${req.file.filename}`;
    const oldData = await Home.findOne();
    if (oldData && oldData.EmailIcon) {
      deleteFileIfExists(oldData.EmailIcon);
    }
    const homeData = await Home.findOneAndUpdate({}, { EmailIcon: EMIPath }, { new: true, upsert: true });
    res.json({ message: "Email icon updated", EmailIcon: homeData.EmailIcon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-emt", async (req, res) => {
  try {
    const { EmailT } = req.body;
    const updated = await Home.findOneAndUpdate({}, { EmailT }, { new: true, upsert: true });
    res.json({ EmailT });
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});

// 📌 Phone
router.post("/upload-pmi", upload.single("PMI"), async (req, res) => {
  try {
    const PMIPath = `/uploads/images/${req.file.filename}`;
    const oldData = await Home.findOne();
    if (oldData && oldData.PhoneI) {
      deleteFileIfExists(oldData.PhoneI);
    }
    const homeData = await Home.findOneAndUpdate({}, { PhoneI: PMIPath }, { new: true, upsert: true });
    res.json({ message: "Phone icon updated", PhoneI: homeData.PhoneI });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-pmt", async (req, res) => {
  try {
    const { selectedPhoneNumber } = req.body;
    const updated = await Home.findOneAndUpdate({}, { PhoneN: selectedPhoneNumber }, { new: true, upsert: true });
    res.json({ selectedPhoneNumber });
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});

// 📌 Address
router.post("/upload-ami", upload.single("AMI"), async (req, res) => {
  try {
    const AMIPath = `/uploads/images/${req.file.filename}`;
    const oldData = await Home.findOne();
    if (oldData && oldData.AddressI) {
      deleteFileIfExists(oldData.AddressI);
    }
    const homeData = await Home.findOneAndUpdate({}, { AddressI: AMIPath }, { new: true, upsert: true });
    res.json({ message: "Address icon updated", AddressI: homeData.AddressI });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-amt", async (req, res) => {
  try {
    const { selectedAddress } = req.body;
    const updated = await Home.findOneAndUpdate({}, { AddressT: selectedAddress }, { new: true, upsert: true });
    res.json({ selectedAddress });
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});

// 📌 Socials
router.post("/social-upload", upload.single("icon"), async (req, res) => {
  try {
    let home = await Home.findOne() || new Home();

    const newSocial = {
      title: req.body.title,
      link: req.body.link,
      icon: req.file ? "/uploads/images/" + req.file.filename : "",
      colour: req.body.colour,
      shape: req.body.shape,
    };

    home.socials.push(newSocial);
    await home.save();

    res.json({ socials: home.socials });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});
router.delete("/social-delete/:index", async (req, res) => {
  try {
    let home = await Home.findOne();
    if (!home) return res.status(404).json({ error: "Home not found" });

    const index = parseInt(req.params.index);
    if (index < 0 || index >= home.socials.length) {
      return res.status(400).json({ error: "Invalid index" });
    }

    // Delete file if exists
    deleteFileIfExists(home.socials[index].icon);

    home.socials.splice(index, 1);
    await home.save();

    res.json({ socials: home.socials });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});
router.put("/social-update/:index", upload.single("icon"), async (req, res) => {
  try {
    let home = await Home.findOne();
    if (!home) return res.status(404).json({ error: "Home not found" });

    const index = parseInt(req.params.index);
    if (index < 0 || index >= home.socials.length) {
      return res.status(400).json({ error: "Invalid index" });
    }

    let social = home.socials[index];
    const { title, link, colour, shape } = req.body;

    social.title = title || social.title;
    social.link = link || social.link;
    social.colour = colour || social.colour;
    social.shape = shape || social.shape;

    if (req.file) {
      deleteFileIfExists(social.icon);
      social.icon = "/uploads/images/" + req.file.filename;
    }

    home.socials[index] = social;
    await home.save();

    res.json({ message: "Social updated", socials: home.socials });
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
});

// 📌 Get Data
router.get("/get-data", async (req, res) => {
  try {
    const homeData = await Home.findOne();
    res.json({
      logo: homeData?.logo,
      welText: homeData?.welText,
      MSB: homeData?.MSB,
      MS: homeData?.MS,
      Profile: homeData?.Profile,
      FO: homeData?.FO,
      EmailIcon: homeData?.EmailIcon,
      EmailT: homeData?.EmailT,
      PhoneI: homeData?.PhoneI,
      PhoneN: homeData?.PhoneN,
      AddressI: homeData?.AddressI,
      AddressT: homeData?.AddressT,
      socials: homeData?.socials,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

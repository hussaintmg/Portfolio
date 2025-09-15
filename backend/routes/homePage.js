const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Home = require("../models/homePage");
const upload = require("../middlewares/upload");

router.post("/upload-logo", upload.single("logo"), async (req, res) => {
  try {
    const logoPath = `/uploads/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.logo) {
      const oldFilePath = path.join(__dirname, "..", oldData.logo);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { logo: logoPath },
      { new: true, upsert: true }
    );

    res.json({
      message: "Logo updated and old one deleted",
      logo: homeData.logo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-prof", upload.single("Prof"), async (req, res) => {
  try {
    const ProfPath = `/uploads/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.Profile) {
      const oldFilePath = path.join(__dirname, "..", oldData.Profile);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { Profile: ProfPath },
      { new: true, upsert: true }
    );

    res.json({
      message: "Profile updated and old one deleted",
      Profile: homeData.Profile,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/upload-wel", async (req, res) => {
  try {
    const { welText } = req.body;
    const updated = await Home.findOneAndUpdate(
      {},
      { welText },
      { new: true, upsert: true }
    );
    res.json({ welText });
  } catch (error) {
    res.status(500).json({ error: "Failed to update text" });
  }
});
router.post("/upload-msb", async (req, res) => {
  try {
    const { MSB } = req.body;
    const updated = await Home.findOneAndUpdate(
      {},
      { MSB },
      { new: true, upsert: true }
    );
    res.json({ MSB });
  } catch (error) {
    res.status(500).json({ error: "Failed to update text" });
  }
});
router.post("/upload-ms", async (req, res) => {
  try {
    const { MS } = req.body;
    const updated = await Home.findOneAndUpdate(
      {},
      { MS },
      { new: true, upsert: true }
    );
    res.json({ MS });
  } catch (error) {
    res.status(500).json({ error: "Failed to update text" });
  }
});
router.post("/upload-FO", async (req, res) => {
  try {
    const { FOI, FOL } = req.body;
    const homeData = await Home.findOne();
    let FOsaved = homeData?.FO;
    FOsaved.push({ FOI, FOL });
    const updated = await Home.findOneAndUpdate(
      {},
      { FO: FOsaved },
      { new: true, upsert: true }
    );
    res.json({ FO: updated.FO });
  } catch (error) {
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
    res.json({
      message: "Freelance link updated successfully",
      FO: homeData.FO,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

router.post("/delete-FO", async (req, res) => {
  try {
    const { index } = req.body;

    let homeData = await Home.findOne();
    if (!homeData) {
      return res.status(404).json({ message: "No FO data found" });
    }

    if (index < 0 || index >= homeData.FO.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    homeData.FO.splice(index, 1);

    await homeData.save();

    res.status(200).json({
      message: "FO item deleted successfully",
      FO: homeData.FO,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/upload-emi", upload.single("EMI"), async (req, res) => {
  try {
    const EMIPath = `/uploads/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.EmailIcon) {
      const oldFilePath = path.join(__dirname, "..", oldData.EmailIcon);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { EmailIcon: EMIPath },
      { new: true, upsert: true }
    );

    res.json({
      message: "Icon updated and old one deleted",
      EmailIcon: homeData.EmailIcon,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-emt", async (req, res) => {
  try {
    const { EmailT } = req.body;
    const updated = await Home.findOneAndUpdate(
      {},
      { EmailT },
      { new: true, upsert: true }
    );
    res.json({ EmailT });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

router.post("/upload-pmi", upload.single("PMI"), async (req, res) => {
  try {
    const PMIPath = `/uploads/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.PhoneI) {
      const oldFilePath = path.join(__dirname, "..", oldData.PhoneI);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { PhoneI: PMIPath },
      { new: true, upsert: true }
    );

    res.json({
      message: "Icon updated and old one deleted",
      PhoneI: homeData.PhoneI,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-pmt", async (req, res) => {
  try {
    const { selectedPhoneNumber } = req.body;
    const updated = await Home.findOneAndUpdate(
      {},
      { PhoneN: selectedPhoneNumber },
      { new: true, upsert: true }
    );
    res.json({ selectedPhoneNumber });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});
router.post("/upload-ami", upload.single("AMI"), async (req, res) => {
  try {
    const AMIPath = `/uploads/${req.file.filename}`;

    const oldData = await Home.findOne();
    if (oldData && oldData.AddressI) {
      const oldFilePath = path.join(__dirname, "..", oldData.AddressI);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { AddressI: AMIPath },
      { new: true, upsert: true }
    );

    res.json({
      message: "Icon updated and old one deleted",
      AddressI: homeData.AddressI,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload-amt", async (req, res) => {
  try {
    const { selectedAddress } = req.body;
    console.log(selectedAddress);
    const updated = await Home.findOneAndUpdate(
      {},
      { AddressT: selectedAddress },
      { new: true, upsert: true }
    );
    res.json({ selectedAddress });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});

router.post("/social-upload", upload.single("icon"), async (req, res) => {
  try {
    let home = await Home.findOne();

    const newSocial = {
      title: req.body.title,
      link: req.body.link,
      icon: req.file ? "/uploads/" + req.file.filename : "",
      colour: req.body.colour,
      shape: req.body.shape,
    };

    home.socials.push(newSocial);
    await home.save();

    res.json({ socials: home.socials });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});
// Backend (routes)
router.delete("/social-delete/:index", async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) return res.status(404).json({ error: "Home not found" });

    const index = parseInt(req.params.index);
    if (index < 0 || index >= home.socials.length) {
      return res.status(400).json({ error: "Invalid index" });
    }

    // index se social delete karo
    home.socials.splice(index, 1);
    await home.save();

    res.json({ socials: home.socials });
  } catch (err) {
    console.error("Delete failed:", err);
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
      if (social.icon) {
        const oldPath = path.join(__dirname, "..", social.icon);
        fs.unlink(oldPath, (err) => {
          if (err) {
            console.log("Old icon delete failed:", err.message);
          } else {
            console.log("Old icon deleted:", social.icon);
          }
        });
      }
      social.icon = "/uploads/" + req.file.filename;
    }

    home.socials[index] = social;
    await home.save();

    res.json({
      message: "updated successfully",
      socials: home.socials,
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});




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

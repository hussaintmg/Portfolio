const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Skill = require("../models/skillPage");
const upload = require("../middlewares/upload");

// 📌 Upload Icon
router.post("/upload-icon", upload.single("icon"), async (req, res) => {
  try {
    const iconPath = `/uploads/images/${req.file.filename}`;
    const skillData = await Skill.findOneAndUpdate(
      {},
      { $push: { skIcons: iconPath } },
      { new: true, upsert: true }
    );

    res.json({
      message: "Icon uploaded successfully",
      icons: skillData.skIcons,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Delete Icon
router.delete("/delete-icon", async (req, res) => {
  try {
    const { iconPath } = req.body;

    const updatedSkill = await Skill.findOneAndUpdate(
      {},
      { $pull: { skIcons: iconPath } },
      { new: true }
    );

    // Absolute path banate waqt basename use karo
    const absolutePath = path.join(
      __dirname,
      "..",
      "uploads/images",
      path.basename(iconPath)
    );

    fs.unlink(absolutePath, (err) => {
      if (err) console.error("File delete error:", err.message);
    });

    res.json({ success: true, icons: updatedSkill.skIcons });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete icon" });
  }
});

// 📌 Update Icon by Index
router.put("/skIcon-update/:index", upload.single("icon"), async (req, res) => {
  try {
    let skill = await Skill.findOne();
    const index = parseInt(req.params.index);

    if (index < 0 || index >= skill.skIcons.length) {
      return res.status(400).json({ error: "Invalid index" });
    }

    let oldIconPath = skill.skIcons[index];

    if (req.file) {
      if (oldIconPath) {
        const oldPath = path.join(
          __dirname,
          "..",
          "uploads/images",
          path.basename(oldIconPath)
        );
        fs.unlink(oldPath, (err) => {
          if (err) {
            console.log("Old icon delete failed:", err.message);
          } else {
            console.log("Old icon deleted:", oldPath);
          }
        });
      }
      skill.skIcons[index] = "/uploads/images" + req.file.filename;
    }

    await skill.save();

    res.json({
      message: "updated successfully",
      icons: skill.skIcons,
    });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 📌 Upload Skill List Item
router.post("/upload-sk-list", async (req, res) => {
  try {
    const { heading, list } = req.body;
    const savedData = await Skill.findOne();
    let lisaved = savedData?.skList || [];

    lisaved.push({ heading, list });

    const skillData = await Skill.findOneAndUpdate(
      {},
      { skList: lisaved },
      { new: true, upsert: true }
    );

    res.json({
      message: "Item uploaded successfully",
      list: skillData.skList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Update Skill List Item
router.put("/skList-update/:index", async (req, res) => {
  try {
    let skill = await Skill.findOne();
    const { heading, list } = req.body;
    const index = parseInt(req.params.index);

    if (index < 0 || index >= skill.skList.length) {
      return res.status(400).json({ error: "Invalid index" });
    }

    skill.skList[index] = { heading, list };
    await skill.save();

    res.json({
      message: "updated successfully",
      list: skill.skList,
    });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 📌 Upload Service
router.post("/upload-service", async (req, res) => {
  try {
    const { title, icon } = req.body;
    const savedData = await Skill.findOne();
    let saved = savedData?.services || [];

    saved.push({ title, icon });

    const skillData = await Skill.findOneAndUpdate(
      {},
      { services: saved },
      { new: true, upsert: true }
    );

    res.json({
      message: "Item uploaded successfully",
      services: skillData.services,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Delete Service
router.delete("/delete-service/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Skill.findOneAndUpdate(
      {},
      { $pull: { services: { _id: id } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({
      message: "Service deleted successfully",
      services: updated.services,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// 📌 Update Service
router.put("/update-service/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon } = req.body;

    const updated = await Skill.findOneAndUpdate(
      { "services._id": id },
      {
        $set: {
          "services.$.title": title,
          "services.$.icon": icon,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({
      message: "Service updated successfully",
      services: updated.services,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update service" });
  }
});

// 📌 Get All Data
router.get("/get-data", async (req, res) => {
  try {
    const skillData = await Skill.findOne();
    res.json({
      icons: skillData?.skIcons || [],
      skList: skillData?.skList || [],
      services: skillData?.services || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

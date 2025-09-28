const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Project = require("../models/ProjectsPage");
const upload = require("../middlewares/upload");

// Upload images/videos at creation
const uploadFields = upload.fields([
  { name: "images[]", maxCount: 10 },
  { name: "videos[]", maxCount: 5 },
]);

// ✅ Create new project
router.post("/upload-new", uploadFields, async (req, res) => {
  try {
    const { title ,link} = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }

    const images = req.files["images[]"]
      ? req.files["images[]"].map((file) => `/uploads/images/${file.filename}`)
      : [];

    const videos = req.files["videos[]"]
      ? req.files["videos[]"].map((file) => `/uploads/videos/${file.filename}`)
      : [];

    const project = new Project({
      title,
      link,
      images,
      videos,
    });

    await project.save();

    res.status(201).json({
      message: "Project uploaded successfully",
      project,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete project + files
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete images
    for (const imgPath of project.images) {
      const fullPath = path.join(__dirname, "..", imgPath);
      fs.unlink(fullPath, (err) => {
        if (err) console.warn("Failed to delete image:", fullPath, err.message);
      });
    }

    // Delete videos
    for (const videoPath of project.videos) {
      const fullPath = path.join(__dirname, "..", videoPath);
      fs.unlink(fullPath, (err) => {
        if (err) console.warn("Failed to delete video:", fullPath, err.message);
      });
    }

    await Project.findByIdAndDelete(id);

    res.json({ message: "Project and files deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update project title
router.put("/up-link/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { link } = req.body;

    const updated = await Project.findByIdAndUpdate(
      id,
      { link },
      { new: true }
    );

    res.status(200).json({ success: true, project: updated });
  } catch (err) {
    console.error("Update Link Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
router.put("/up-title/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updated = await Project.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    res.status(200).json({ success: true, project: updated });
  } catch (err) {
    console.error("Update Title Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post(
  "/add-images",
  upload.fields([{ name: "images", maxCount: 20 }]),
  async (req, res) => {
    try {
      const { projectId } = req.body;
      if (!projectId) {
        return res.status(400).json({ message: "projectId is required" });
      }

      const project = await Project.findById(projectId);
      console.log(project);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // jo images upload hui hain unke path banao
      const newImages = req.files["images"]
        ? req.files["images"].map((file) => `/uploads/images/${file.filename}`)
        : [];

      // hamesha last main append karo
      project.images.push(...newImages);

      await project.save();

      res.status(200).json({
        message: "Images added successfully",
        images: project.images,
      });
    } catch (err) {
      console.error("Add Images Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/delete-image/:projectId/:index", async (req, res) => {
  try {
    const { projectId, index } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (index < 0 || index >= project.images.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const imagePath = project.images[index];
    const absolutePath = path.join(__dirname, "..", imagePath);

    project.images.splice(index, 1);
    await project.save();

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error("File delete error:", err);
      }
    });

    res.status(200).json({
      message: "Image deleted successfully",
      project,
    });
  } catch (err) {
    console.error("Delete Image Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-image", upload.single("image"), async (req, res) => {
  try {
    const { projectId, index } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.images[index]) {
      return res.status(400).json({ message: "Invalid image index" });
    }
    const oldImagePath = path.join(
      __dirname,
      "..",
      "uploads/images",
      project.images[index].replace("/uploads/images", "")
    );

    const newImagePath = `/uploads/images/${req.file.filename}`;
    project.images[index] = newImagePath;

    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error("Error deleting old image:", oldImagePath, err.message);
      } else {
        console.log("Deleted old image:", oldImagePath);
      }
    });

    await project.save();

    // ✅ return updated images
    res.json({
      message: "Image updated successfully",
      images: project.images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/add-videos",
  upload.fields([{ name: "videos", maxCount: 10 }]),
  async (req, res) => {
    try {
      const { projectId } = req.body;
      if (!projectId) {
        return res.status(400).json({ message: "projectId is required" });
      }

      const project = await Project.findById(projectId);
      console.log(project);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // jo images upload hui hain unke path banao
      const newVideos = req.files["videos"]
        ? req.files["videos"].map((file) => `/uploads/videos/${file.filename}`)
        : [];

      // hamesha last main append karo
      project.videos.push(...newVideos);

      await project.save();

      res.status(200).json({
        message: "Videos added successfully",
        videos: project.videos,
      });
    } catch (err) {
      console.error("Add Video Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/delete-video/:projectId/:index", async (req, res) => {
  try {
    const { projectId, index } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (index < 0 || index >= project.videos.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    const videoPath = project.videos[index];
    const absolutePath = path.join(__dirname, "..", videoPath);

    project.videos.splice(index, 1);
    await project.save();

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error("File delete error:", err);
      }
    });

    res.status(200).json({
      message: "Video deleted successfully",
      project,
    });
  } catch (err) {
    console.error("Delete Video Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update-video", upload.single("video"), async (req, res) => {
  try {
    const { projectId, index } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.videos[index]) {
      return res.status(400).json({ message: "Invalid video index" });
    }

    const oldVideoPath = path.join(
      __dirname,
      "..",
      project.videos[index]
    );

    // 🔹 new video ka path
    const newVideoPath = `/uploads/videos/${req.file.filename}`;
    project.videos[index] = newVideoPath;

    await project.save();

    fs.unlink(oldVideoPath, (err) => {
      if (err) {
        console.error("⚠️ Error deleting old video:", oldVideoPath, err.message);
      } else {
        console.log("✅ Deleted old video:", oldVideoPath);
      }
    });

    res.json({
      message: "Video updated successfully",
      videos: project.videos,
    });
  } catch (err) {
    console.error("❌ Update video error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get all projects
router.get("/get-data", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (err) {
    console.error("Get Data Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

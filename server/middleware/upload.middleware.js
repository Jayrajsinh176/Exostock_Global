import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDir = "uploads/products";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extensionByMimeType = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    const ext = extensionByMimeType[file.mimetype];

    cb(
      null,
      `product-${Date.now()}-${crypto.randomUUID()}${ext}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      )
    );
  }
};

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `products-${Date.now()}-${crypto.randomUUID()}.csv`
    );
  },
});

const csvFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "text/csv" ||
    file.originalname.endsWith(".csv")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
};

export const uploadProductCSV = multer({
  storage: csvStorage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
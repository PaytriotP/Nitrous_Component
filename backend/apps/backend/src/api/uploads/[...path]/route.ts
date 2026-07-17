import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import fs from "fs";
import path from "path";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const pathParam = req.params.path || req.params[0];
  const filePath = Array.isArray(pathParam) ? pathParam.join("/") : String(pathParam);
  
  
  // Resolve path relative to backend/apps/backend/uploads
  const absolutePath = path.resolve(process.cwd(), "uploads", filePath);

  // Security check: ensure path is within the uploads directory to prevent directory traversal
  if (!absolutePath.startsWith(path.resolve(process.cwd(), "uploads"))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (fs.existsSync(absolutePath)) {
    return res.sendFile(absolutePath);
  } else {
    return res.status(404).json({ message: "File not found" });
  }
};

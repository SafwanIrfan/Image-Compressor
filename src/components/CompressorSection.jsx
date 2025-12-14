import React, { useCallback, useEffect, useRef, useState } from "react";

const formatBytes = (bytes) => {
   if (!bytes) return "0 B";
   const sizes = ["B", "KB", "MB", "GB"];
   const i = Math.floor(Math.log(bytes) / Math.log(1024));
   const value = bytes / 1024 ** i;
   return `${value.toFixed(value >= 10 ? 0 : 1)} ${sizes[i]}`;
};

const loadImage = (file) =>
   new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = URL.createObjectURL(file);
   });

const compressImage = async (file, quality, maxDimension) => {
   const image = await loadImage(file);
   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");
   const { naturalWidth, naturalHeight } = image;

   // ... (Dimension scaling logic remains the same)
   const maxSide = Math.max(naturalWidth, naturalHeight);
   const scale = maxSide > maxDimension ? maxDimension / maxSide : 1;
   const width = Math.round(naturalWidth * scale);
   const height = Math.round(naturalHeight * scale);

   canvas.width = width;
   canvas.height = height;

   ctx.imageSmoothingEnabled = true;
   ctx.imageSmoothingQuality = "high";
   ctx.drawImage(image, 0, 0, width, height);

   // --- FINAL CORRECTED LOGIC ---
   let outputType = file.type;
   let compressionQuality = undefined;

   // Only apply the quality setting (which enables lossy compression)
   // if the original file is a JPEG.
   if (file.type === "image/jpeg") {
      compressionQuality = quality;
   }
   // For PNG and other types, we use their native type and do not set quality.
   // This preserves them as lossless/transparent, only applying dimension scaling.

   // We explicitly avoid setting outputType to "image/jpeg" if it was "image/png"
   // to prevent format conversion and loss of transparency.
   // -----------------------------

   const dataUrl = canvas.toDataURL(outputType, compressionQuality);
   const blob = await (await fetch(dataUrl)).blob();

   return {
      blob,
      dataUrl,
      width,
      height,
      outputType: blob.type, // Use blob.type for the most accurate result
   };
};

const CompressorSection = () => {
   const [file, setFile] = useState(null);
   const [quality, setQuality] = useState(0.7);
   const [maxDimension, setMaxDimension] = useState(1600);
   const [originalPreview, setOriginalPreview] = useState(null);
   const [compressedPreview, setCompressedPreview] = useState(null);
   const [error, setError] = useState("");
   const [isProcessing, setIsProcessing] = useState(false);
   const dropRef = useRef(null);
   const fileInputRef = useRef(null);

   const handleFile = useCallback((selected) => {
      const picked = selected?.[0];
      if (!picked) return;

      // Define the allowed types
      const allowedTypes = ["image/jpeg", "image/png"];

      // --- MODIFIED LOGIC HERE ---
      if (!allowedTypes.includes(picked.type)) {
         setError("Only JPG/JPEG and PNG image files are supported."); // Clear file state if an invalid file was previously selected
         setFile(null);
         return;
      } // Check file size (warn if too large, but still allow)
      // ---------------------------

      if (picked.size > 10 * 1024 * 1024) {
         // 10 MB
         setError("Warning: Large file detected. Processing may take longer.");
      } else {
         setError("");
      }

      setFile(picked);
      const previewUrl = URL.createObjectURL(picked);
      setOriginalPreview({
         url: previewUrl,
         size: picked.size,
         type: picked.type,
      });
   }, []);

   const onDrop = useCallback(
      (event) => {
         event.preventDefault();
         handleFile(event.dataTransfer.files);
      },
      [handleFile]
   );

   useEffect(() => {
      const dropZone = dropRef.current;
      if (!dropZone) return;

      const preventDefaults = (event) => {
         event.preventDefault();
         event.stopPropagation();
      };

      const highlight = () => dropZone.classList.add("drop--active");
      const unhighlight = () => dropZone.classList.remove("drop--active");

      ["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
         dropZone.addEventListener(event, preventDefaults)
      );
      ["dragenter", "dragover"].forEach((event) =>
         dropZone.addEventListener(event, highlight)
      );
      ["dragleave", "drop"].forEach((event) =>
         dropZone.addEventListener(event, unhighlight)
      );
      dropZone.addEventListener("drop", onDrop);

      return () => {
         ["dragenter", "dragover", "dragleave", "drop"].forEach((event) =>
            dropZone.removeEventListener(event, preventDefaults)
         );
         ["dragenter", "dragover"].forEach((event) =>
            dropZone.removeEventListener(event, highlight)
         );
         ["dragleave", "drop"].forEach((event) =>
            dropZone.removeEventListener(event, unhighlight)
         );
         dropZone.removeEventListener("drop", onDrop);
      };
   }, [onDrop]);

   useEffect(() => {
      const runCompression = async () => {
         if (!file) return;
         setIsProcessing(true);
         setError("");
         try {
            const result = await compressImage(file, quality, maxDimension);
            setCompressedPreview({
               url: result.dataUrl,
               size: result.blob.size,
               width: result.width,
               height: result.height,
            });
            // Clear any previous errors
            setError("");
         } catch (err) {
            setError(
               err.message ||
                  "Unable to compress this image. Please try another file."
            );
            setCompressedPreview(null);
         } finally {
            setIsProcessing(false);
         }
      };

      runCompression();
   }, [file, quality, maxDimension]);

   // This function needs access to the 'file' (original file) and 'compressedPreview' state.

   const downloadCompressed = () => {
      if (!compressedPreview || !file) return;
      const link = document.createElement("a");
      link.href = compressedPreview.url;

      const originalName = file.name.replace(/\.[^/.]+$/, "");

      // Use the file.type to determine the extension,
      // as we are no longer forcing conversion in compressImage.
      let extension = "dat"; // Default fallback
      if (file.type === "image/png") {
         extension = "png";
      } else if (file.type === "image/jpeg") {
         extension = "jpg";
      }

      link.download = `compressed-${originalName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const clearSelection = () => {
      // Clean up object URLs to prevent memory leaks
      if (originalPreview?.url) {
         URL.revokeObjectURL(originalPreview.url);
      }
      setFile(null);
      setOriginalPreview(null);
      setCompressedPreview(null);
      setError("");
      // Reset file input
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   return (
      <div className="compressor">
         <div className="dropzone" ref={dropRef}>
            <input
               type="file"
               accept="image/*"
               id="file-input"
               ref={fileInputRef}
               className="sr-only"
               onChange={(e) => handleFile(e.target.files)}
            />
            <label htmlFor="file-input">
               <div className="dropzone__inner">
                  <p className="eyebrow">Drop an image or click to browse</p>
                  <p>JPG and PNG supported. Max recommended size: 10 MB.</p>
                  <button
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fileInputRef.current?.click();
                     }}
                     className="button ghost small"
                     type="button"
                  >
                     Choose a file
                  </button>
               </div>
            </label>
         </div>

         {error && <p className="error">{error}</p>}

         {file && (
            <div className="controls">
               {file.type.split("/", 2)[1] !== "png" && (
                  <div className="control">
                     <div className="control__header">
                        <label htmlFor="quality">Quality</label>
                        <span>{Math.round(quality * 100)}%</span>
                     </div>
                     <input
                        id="quality"
                        type="range"
                        min="0.2"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                     />
                  </div>
               )}
               <div className="control">
                  <div className="control__header">
                     <label htmlFor="dimension">Max dimension</label>
                     <span>{maxDimension}px</span>
                  </div>
                  <input
                     id="dimension"
                     type="range"
                     min="600"
                     max="2400"
                     step="50"
                     value={maxDimension}
                     onChange={(e) =>
                        setMaxDimension(parseInt(e.target.value, 10))
                     }
                  />
               </div>

               <div className="action-row">
                  <button
                     className="button ghost"
                     type="button"
                     onClick={clearSelection}
                     disabled={isProcessing}
                  >
                     Clear
                  </button>
                  <button
                     className="button primary"
                     type="button"
                     onClick={downloadCompressed}
                     disabled={!compressedPreview || isProcessing}
                  >
                     {isProcessing ? "Compressing…" : "Download compressed"}
                  </button>
               </div>
            </div>
         )}

         {file && (
            <div className="preview-grid">
               <div className="card preview">
                  <div className="preview__header">
                     <div>
                        <p className="eyebrow">Original</p>
                        <p>{originalPreview?.type || "Image"}</p>
                     </div>
                     <span className="badge subtle">
                        {formatBytes(originalPreview?.size)}
                     </span>
                  </div>
                  {originalPreview?.url && (
                     <img
                        src={originalPreview.url}
                        alt="Original preview"
                        loading="lazy"
                     />
                  )}
               </div>

               {isProcessing ? (
                  <div className="card preview">
                     <div className="preview__header">
                        <p className="eyebrow">Compressed</p>
                     </div>
                     <div className="processing">
                        <p>Processing image...</p>
                     </div>
                  </div>
               ) : compressedPreview ? (
                  <div className="card preview">
                     <div className="preview__header">
                        <div>
                           <p className="eyebrow">Compressed</p>
                           <p>
                              {compressedPreview.width} ×{" "}
                              {compressedPreview.height}
                           </p>
                        </div>
                        <span className="badge success">
                           {formatBytes(compressedPreview.size)}
                        </span>
                     </div>
                     <img
                        src={compressedPreview.url}
                        alt="Compressed preview"
                        loading="lazy"
                     />
                     {originalPreview?.size && compressedPreview.size && (
                        <div className="compression-stats">
                           <p>
                              {(
                                 (1 -
                                    compressedPreview.size /
                                       originalPreview.size) *
                                 100
                              ).toFixed(1)}
                              % smaller
                           </p>
                        </div>
                     )}
                  </div>
               ) : null}
            </div>
         )}
      </div>
   );
};

export default CompressorSection;

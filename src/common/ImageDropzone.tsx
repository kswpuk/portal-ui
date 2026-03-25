import { Alert, Box, Typography, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  /**
   * Function to call when a file has been selected
   */
  onFileSelected: (file: File) => void
}

/**
 * A drag-and-drop image upload zone backed by `react-dropzone`.
 *
 * Accepts a single image file up to 3 MB. Shows a success alert with the
 * filename and size once a valid file is selected, or an error alert if the
 * file is rejected (wrong type or too large). The drop area's visual style
 * updates while a file is being dragged over it.
 */
export default function ImageDropzone({ onFileSelected }: ImageDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const theme = useTheme();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const reason = fileRejections[0].errors[0].message;
        setError(reason);
        setFile(null);
        return;
      }

      const selected = acceptedFiles[0];
      setFile(selected);
      setError("");

      if (onFileSelected) {
        onFileSelected(selected);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024, // 3MB
    multiple: false
  });

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          borderColor: isDragActive ? theme.palette.primary.dark : theme.palette.grey[500],
          borderWidth: "2px",
          borderStyle: isDragActive ? "solid" : "dashed",
          borderRadius: "0.75rem",
          padding: "2rem",
          textAlign: "center",
          background: isDragActive ? theme.palette.primary.light : theme.palette.background.paper,
          color: isDragActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
          transition: "background 0.2s ease",
          cursor: "pointer"
        }}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <Typography>Drop your image here</Typography>
        ) : (file ? (<>
            <Typography>Drag and drop a different image here, or click to select</Typography>
            <Typography variant="body2">Maximum file size is 3 megabytes</Typography>
          </>) : (<>
            <Typography>Drag and drop an image here, or click to select</Typography>
            <Typography variant="body2">Maximum file size is 3 megabytes</Typography>
          </>)
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{marginTop: "1rem"}}>{error}</Alert>
      )}

      {file && (
        <Alert severity="success" sx={{marginTop: "1rem"}}>
          <strong>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
        </Alert>
      )}
    </Box>
  );
}

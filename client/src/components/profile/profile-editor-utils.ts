const MAX_PROFILE_PICTURE_BYTES = 350 * 1024;

export function isValidProfilePicture(value: string) {
  return /^https?:\/\/.+/i.test(value) || /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value);
}

export function getApproximateDataUrlBytes(value: string) {
  const [, base64 = ""] = value.split(",", 2);
  return Math.floor((base64.length * 3) / 4);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read file."));
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image."));
    image.src = dataUrl;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number) {
  return canvas.toDataURL("image/jpeg", quality);
}

export async function compressProfileImage(file: File) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(originalDataUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare image.");
  }

  const maxDimension = 512;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42]) {
    const compressedDataUrl = canvasToDataUrl(canvas, quality);

    if (getApproximateDataUrlBytes(compressedDataUrl) <= MAX_PROFILE_PICTURE_BYTES) {
      return compressedDataUrl;
    }
  }

  const smallestDataUrl = canvasToDataUrl(canvas, 0.35);

  if (getApproximateDataUrlBytes(smallestDataUrl) <= MAX_PROFILE_PICTURE_BYTES) {
    return smallestDataUrl;
  }

  throw new Error("Image is still too large after compression.");
}

export function validateUploadedProfileImage(file: File) {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "Please choose an image smaller than 5 MB.";
  }

  return null;
}

export function validateProfilePictureValue(value: string) {
  if (value && !isValidProfilePicture(value)) {
    return "Enter a valid image URL.";
  }

  if (value.startsWith("data:image/") && getApproximateDataUrlBytes(value) > MAX_PROFILE_PICTURE_BYTES) {
    return "Uploaded image is too large. Please choose a smaller image.";
  }

  return null;
}

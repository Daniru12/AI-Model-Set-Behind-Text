// src/app/utils/blurBackground.js
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

let bodyPixNet = null;

export async function getBodyPixNet() {
  if (!bodyPixNet) {
    bodyPixNet = await bodyPix.load();
  }
  return bodyPixNet;
}

/**
 * Blurs background only, keeps person sharp
 * @param {HTMLImageElement} imgElement - source image
 * @param {HTMLCanvasElement} canvas - canvas to draw result
 * @param {number} blurAmount - blur radius in px
 * @param {Object} net - loaded BodyPix model
 */
export async function blurBackgroundImage(imgElement, canvas, blurAmount = 8, net) {
  // 1. Segment the person in the image
  const segmentation = await net.segmentPerson(imgElement);

  // 2. Create mask where person pixels are white, background pixels are black
  // We want to keep person unblurred, so mask person as white (255), background black (0)
  const mask = bodyPix.toMask(
    segmentation,
    { r: 255, g: 255, b: 255, a: 255 }, // person: white & opaque
    { r: 0, g: 0, b: 0, a: 0 }          // background: transparent black
  );

  const ctx = canvas.getContext('2d');
  canvas.width = imgElement.width;
  canvas.height = imgElement.height;

  // Step A: Draw blurred full image on canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `blur(${blurAmount}px)`;
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

  // Step B: Use the mask to clear the person area from blur and draw original sharp image there

  // Create offscreen canvas for mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.putImageData(mask, 0, 0);

  // Set composite mode so that only the person area is drawn sharply on the blurred canvas
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(maskCanvas, 0, 0);

  // Now draw the person area sharply on top
  ctx.globalCompositeOperation = 'destination-over';
  ctx.filter = 'none';
  ctx.drawImage(imgElement, 0, 0);

  // Reset composite mode for further drawing
  ctx.globalCompositeOperation = 'source-over';
}

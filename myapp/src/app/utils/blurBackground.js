// src/app/utils/blurBackground.js
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

let bodyPixNet = null;

export async function getBodyPixNet() {
  if (!bodyPixNet) {
    bodyPixNet = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
  }
  return bodyPixNet;
}

export async function blurBackgroundImage(imgElement, canvas, blurAmount = 8, net) {
  try {
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    const segmentation = await net.segmentPerson(imgElement, {
      internalResolution: 'high',
      segmentationThreshold: 0.7,
      maxDetections: 1
    });

    const backgroundBlurAmount = blurAmount;
    const edgeBlurAmount = Math.min(blurAmount / 2, 6);
    const flipHorizontal = false;

    await bodyPix.drawBokehEffect(
      canvas,
      imgElement,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
  } catch (error) {
    console.error('Error applying blur:', error);
    // Fallback to drawing original image if blur fails
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  }
}
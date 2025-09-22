import * as posedetection from '@tensorflow-models/pose-detection';

let detector = null;

/**
 * Инициализация детектора позы (MoveNet) с настройками.
 * Возвращает единственный экземпляр детектора (singleton).
 */
export async function initDetector() {
  if (!detector) {
    detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
      modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true, // сглаживание для стабильности ключевых точек
    });
  }
  return detector;
}

/**
 * Оценка позы на текущем кадре видеопотока.
 * @param {HTMLVideoElement} video - видео элемент с видеопотоком
 * @returns {Promise<Object|null>} одна поза или null, если поза не найдена
 */
export async function estimatePose(video) {
  if (!detector) {
    await initDetector();
  }
  try {
    const poses = await detector.estimatePoses(video);
    return poses.length > 0 ? poses[0] : null;
  } catch (error) {
    console.error('Ошибка при оценке позы:', error);
    return null;
  }
}

import { Router } from 'express';

import {
  addWaterController,
  updateWaterController,
  deleteWaterController,
  getDailyWaterController,
  getMonthlyWaterController,
} from '../controllers/water.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { addWaterSchema, updateWaterSchema } from '../validation/water.js';

import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

// додавання
router.post(
  '/',
  authenticate,
  validateBody(addWaterSchema),
  ctrlWrapper(addWaterController),
);

// оновлення
router.patch(
  '/:id',
  authenticate,
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

// видалення
router.delete('/:id', authenticate, ctrlWrapper(deleteWaterController));

// день
router.get('/daily', authenticate, ctrlWrapper(getDailyWaterController));

// місяць
router.get('/monthly', authenticate, ctrlWrapper(getMonthlyWaterController));

export default router;

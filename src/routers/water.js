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

const router = Router();

// додавання запису

router.post('/', validateBody(addWaterSchema), ctrlWrapper(addWaterController));

// оновлення

router.patch(
  '/:id',
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

// видалення

router.delete('/:id', ctrlWrapper(deleteWaterController));

// день

router.get('/daily', ctrlWrapper(getDailyWaterController));

// місяць

router.get('/monthly', ctrlWrapper(getMonthlyWaterController));

export default router;

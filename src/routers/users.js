import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { inputUserSchema, updateUserSchema } from '../validation/users.js';
import {
  signinUserController,
  logoutUserController,
  refreshUserSessionController,
  signupUserController,
  getCurrentUserController,
  updateUserController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.post(
  '/signup',
  validateBody(inputUserSchema),
  ctrlWrapper(signupUserController),
);
router.post(
  '/signin',
  validateBody(inputUserSchema),
  ctrlWrapper(signinUserController),
);
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/update',
  authenticate,
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

router.post(
  '/refresh',
  authenticate,
  ctrlWrapper(refreshUserSessionController),
);

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
export default router;

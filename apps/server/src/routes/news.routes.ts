import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';

const router = Router();

router.get('/', NewsController.getAll);
router.get('/:id', NewsController.getById);

export default router;

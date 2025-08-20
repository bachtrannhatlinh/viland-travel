import { Router } from 'express';
import { NewsController } from '../controllers/postgresql/news.controller';

const router = Router();

router.get('/', NewsController.getAll);
router.get('/:id', NewsController.getById);

export default router;

import { Router } from 'express';
import { ContactController } from '../controllers/postgresql/contact.controller';

const router = Router();

router.post('/', ContactController.create);

export default router;

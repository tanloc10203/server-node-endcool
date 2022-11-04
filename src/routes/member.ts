import { Router } from 'express';
import { memberController } from '../controllers';
import { authorization, verifyTokenAndAdmin } from '../middleware';

const memberRoute = Router();

memberRoute.post('/', [authorization, verifyTokenAndAdmin], memberController.create);
memberRoute.get('/count', [authorization], memberController.count);
memberRoute.get('/', [authorization, verifyTokenAndAdmin], memberController.getAll);
memberRoute.get('/:id', [authorization, verifyTokenAndAdmin], memberController.getById);
memberRoute.patch('/:id', [authorization, verifyTokenAndAdmin], memberController.update);
memberRoute.delete('/:id', [authorization, verifyTokenAndAdmin], memberController.delete);

export default memberRoute;

import { Router } from 'express';
import { productStatusController } from '../controllers';

const productStatusRoute = Router();

productStatusRoute.post('/', productStatusController.create);
productStatusRoute.get('/', productStatusController.getAll);
productStatusRoute.get('/:id', productStatusController.getById);
productStatusRoute.patch('/:id', productStatusController.update);
productStatusRoute.delete('/:id', productStatusController.delete);

export default productStatusRoute;

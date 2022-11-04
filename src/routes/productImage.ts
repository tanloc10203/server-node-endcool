import { Router } from 'express';
import { productImageController } from '../controllers';

const productImageRoute = Router();

productImageRoute.post('/', productImageController.create);
productImageRoute.get('/', productImageController.getAll);
productImageRoute.get('/:id', productImageController.getById);
productImageRoute.patch('/:id', productImageController.update);
productImageRoute.delete('/:id', productImageController.delete);

export default productImageRoute;

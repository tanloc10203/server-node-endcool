import { Router } from 'express';
import { productQuantityController } from '../controllers/productQuantity.controller';

const productQuantityRoute = Router();

productQuantityRoute.post('/', productQuantityController.create);
productQuantityRoute.get('/:id', productQuantityController.getById);
productQuantityRoute.get('/', productQuantityController.getAll);
productQuantityRoute.patch('/:id', productQuantityController.update);
productQuantityRoute.patch('/trash/:id', productQuantityController.trash);
productQuantityRoute.patch('/restore/:id', productQuantityController.restore);
productQuantityRoute.delete('/:id', productQuantityController.delete);

export default productQuantityRoute;

import { Router } from 'express';
import { evaluateProduct } from '../controllers';

const evaluateProductRoute = Router();

evaluateProductRoute.post('/:orderId', evaluateProduct.create);
evaluateProductRoute.get('/:productId', evaluateProduct.getAll);
// evaluateProductRoute.get('/', [authorization, verifyTokenAndAdmin], memberController.getAll);
// evaluateProductRoute.get('/:id', [authorization, verifyTokenAndAdmin], memberController.getById);
// evaluateProductRoute.patch('/:id', [authorization, verifyTokenAndAdmin], memberController.update);
// evaluateProductRoute.delete('/:id', [authorization, verifyTokenAndAdmin], memberController.delete);

export default evaluateProductRoute;

import { Router } from 'express';
import { productPriceController } from '../controllers';

const productPriceRoute = Router();

productPriceRoute.post('/', productPriceController.create);
productPriceRoute.get('/', productPriceController.getAll);
productPriceRoute.get('/:id', productPriceController.getById);
productPriceRoute.patch('/:id', productPriceController.update);
productPriceRoute.delete('/:id', productPriceController.delete);

export default productPriceRoute;

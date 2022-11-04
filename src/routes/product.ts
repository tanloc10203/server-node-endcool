import { Router } from 'express';
import { productController } from '../controllers';
import { authorization, verifyTokenStaff } from '../middleware';

const productRoute = Router();

// * Dashboard
productRoute.post('/', [authorization, verifyTokenStaff], productController.create);
productRoute.get('/', [authorization, verifyTokenStaff], productController.getAll);

// * HomePage
productRoute.get('/collections', productController.getCollections);
productRoute.get('/array/slug/:slug', productController.getArrayBySlug);
productRoute.get('/slug/:slug', productController.getBySlug);

// * Dashboard
productRoute.get('/count', [authorization], productController.count);
productRoute.get('/:id', [authorization, verifyTokenStaff], productController.getById);
productRoute.patch('/:id', [authorization, verifyTokenStaff], productController.update);
productRoute.delete('/:id', [authorization, verifyTokenStaff], productController.delete);

export default productRoute;

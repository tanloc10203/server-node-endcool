import { Router } from 'express';
import { categoryController } from '../controllers';
import { authorization, verifyTokenStaff } from '../middleware';

const categoryRoute = Router();

// * HomePage
categoryRoute.get('/tree', categoryController.getAllTree);
categoryRoute.get('/product', categoryController.getProduct);

// * Dashboard
categoryRoute.get('/', [authorization, verifyTokenStaff], categoryController.getAll);
categoryRoute.get('/count', [authorization], categoryController.count);
categoryRoute.get('/:id', [authorization, verifyTokenStaff], categoryController.getById);
categoryRoute.post('/', [authorization, verifyTokenStaff], categoryController.create);
categoryRoute.patch('/:id', [authorization, verifyTokenStaff], categoryController.update);
categoryRoute.delete('/:id', [authorization, verifyTokenStaff], categoryController.delete);

export default categoryRoute;

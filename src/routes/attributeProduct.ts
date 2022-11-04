import { Router } from 'express';
import { attributeProductController } from '../controllers/attributeProduct.controller';
import { authorization, verifyTokenStaff } from '../middleware';

const attributeProductRoute = Router();

// * Dashboard
attributeProductRoute.get(
  '/by-product/:productId',
  [authorization, verifyTokenStaff],
  attributeProductController.getAll
);
attributeProductRoute.get('/count', [authorization], attributeProductController.count);
attributeProductRoute.get(
  '/:id',
  [authorization, verifyTokenStaff],
  attributeProductController.getById
);
attributeProductRoute.post(
  '/',
  [authorization, verifyTokenStaff],
  attributeProductController.create
);
attributeProductRoute.patch(
  '/:id',
  [authorization, verifyTokenStaff],
  attributeProductController.update
);
attributeProductRoute.delete(
  '/:id',
  [authorization, verifyTokenStaff],
  attributeProductController.delete
);

export default attributeProductRoute;

import { Express, Request, Response } from 'express';
import { introServer } from '../utils';
import addressRoute from './address';
import attributeProductRoute from './attributeProduct';
import authRoute from './auth';
import categoryRoute from './category';
import evaluateProductRoute from './evaluateProduct';
import memberRoute from './member';
import orderRoute from './order';
import productRoute from './product';
import productImageRoute from './productImage';
import productPriceRoute from './productPrice';
import productQuantityRoute from './productQuantity';
import productStatusRoute from './productStatus';
import purchaseOrderRoute from './purchaseOrder';
import purchaseStatusRoute from './purchaseStatus';

const initWebRoutes = (app: Express) => {
  app.get('/', (req: Request, res: Response) => res.status(200).json(introServer));

  app.use('/api/auth', authRoute);
  app.use('/api/member', memberRoute);
  app.use('/api/category', categoryRoute);
  app.use('/api/product', productRoute);
  app.use('/api/product-status', productStatusRoute);
  app.use('/api/product-price', productPriceRoute);
  app.use('/api/product-image', productImageRoute);
  app.use('/api/product-quantity', productQuantityRoute);
  app.use('/api/order', orderRoute);
  app.use('/api/purchase-status', purchaseStatusRoute);
  app.use('/api/purchase-order', purchaseOrderRoute);
  app.use('/api/address', addressRoute);
  app.use('/api/evaluate-product', evaluateProductRoute);
  app.use('/api/attribute-product', attributeProductRoute);

  app.use((req: Request, res: Response) => {
    if (!req.route)
      return res
        .status(404)
        .json({ error: true, message: 'Cannot PATCH ' + req.url + ', method: ' + req.method });
  });

  return app;
};

export default initWebRoutes;

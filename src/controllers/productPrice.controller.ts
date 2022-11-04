import { Request, Response } from 'express';
import { db } from '../config/db';
import { ProductPrice } from '../services';

export const productPriceController = {
  db: new ProductPrice(db.ProductPrice),

  create(req: Request, res: Response) {
    return productPriceController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return productPriceController.db.getAll(req, res);
  },

  update(req: Request, res: Response) {
    return productPriceController.db.update(req, res);
  },

  getById(req: Request, res: Response) {
    return productPriceController.db.getById(req, res);
  },

  delete(req: Request, res: Response) {
    return productPriceController.db.delete(req, res);
  },
};

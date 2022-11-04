import { Request, Response } from 'express';
import { db } from '../config/db';
import { ProductImage } from '../services';

export const productImageController = {
  db: new ProductImage(db.ProductImages),

  create(req: Request, res: Response) {
    return productImageController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return productImageController.db.getAll(req, res);
  },

  getById(req: Request, res: Response) {
    return productImageController.db.getById(req, res);
  },

  update(req: Request, res: Response) {
    return productImageController.db.update(req, res);
  },

  delete(req: Request, res: Response) {
    return productImageController.db.delete(req, res);
  },
};

import { Request, Response } from 'express';
import { db } from '../config/db';
import { ProductQuantity } from '../services';

export const productQuantityController = {
  db: new ProductQuantity(db.ProductQuantity),

  create(req: Request, res: Response) {
    return productQuantityController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return productQuantityController.db.getAll(req, res);
  },

  getById(req: Request, res: Response) {
    return productQuantityController.db.getById(req, res);
  },

  update(req: Request, res: Response) {
    return productQuantityController.db.update(req, res);
  },

  trash(req: Request, res: Response) {
    return productQuantityController.db.trash(req, res);
  },

  restore(req: Request, res: Response) {
    return productQuantityController.db.restore(req, res);
  },

  delete(req: Request, res: Response) {
    return productQuantityController.db.delete(req, res);
  },
};

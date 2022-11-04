import { Request, Response } from 'express';
import { db } from '../config/db';
import { ProductStatus } from '../services';

export const productStatusController = {
  db: new ProductStatus(db.StatusProduct),

  create(req: Request, res: Response) {
    return productStatusController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return productStatusController.db.getAll(req, res);
  },

  update(req: Request, res: Response) {
    return productStatusController.db.update(req, res);
  },

  getById(req: Request, res: Response) {
    return productStatusController.db.getById(req, res);
  },

  delete(req: Request, res: Response) {
    return productStatusController.db.delete(req, res);
  },
};

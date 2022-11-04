import { PurchaseOrderAttribute } from './../models/purchaseorder.model';
import { Request, Response } from 'express';
import { db } from '../config/db';
import { PurchaseOrder } from '../services';

export const purchaseOrderController = {
  db: new PurchaseOrder(db.PurchaseOrder),

  create(req: Request, res: Response) {
    return purchaseOrderController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return purchaseOrderController.db.getAll(req, res);
  },

  getById(req: Request, res: Response) {
    return purchaseOrderController.db.getById(req, res);
  },

  update(req: Request, res: Response) {
    return purchaseOrderController.db.update(req, res);
  },

  trash(req: Request, res: Response) {
    return purchaseOrderController.db.trash(req, res);
  },

  restore(req: Request, res: Response) {
    return purchaseOrderController.db.restore(req, res);
  },

  delete(req: Request, res: Response) {
    return purchaseOrderController.db.delete(req, res);
  },
};

import { Request, Response } from 'express';
import { db } from '../config/db';
import { PurchaseStatus } from '../services';

export const purchaseStatusController = {
  db: new PurchaseStatus(db.PurchaseStatus),

  create(req: Request, res: Response) {
    return purchaseStatusController.db.create(req, res);
  },

  getAll(req: Request, res: Response) {
    return purchaseStatusController.db.getAll(req, res);
  },

  getActions(req: Request, res: Response) {
    return purchaseStatusController.db.getActions(req, res);
  },

  getById(req: Request, res: Response) {
    return purchaseStatusController.db.getById(req, res);
  },

  update(req: Request, res: Response) {
    return purchaseStatusController.db.update(req, res);
  },

  trash(req: Request, res: Response) {
    return purchaseStatusController.db.trash(req, res);
  },

  restore(req: Request, res: Response) {
    return purchaseStatusController.db.restore(req, res);
  },

  delete(req: Request, res: Response) {
    return purchaseStatusController.db.delete(req, res);
  },
};

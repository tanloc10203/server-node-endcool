import { Router } from 'express';
import { purchaseStatusController } from '../controllers';

const purchaseStatusRoute = Router();

purchaseStatusRoute.post('/', purchaseStatusController.create);
purchaseStatusRoute.get('/', purchaseStatusController.getAll);
purchaseStatusRoute.get('/actions', purchaseStatusController.getActions);
purchaseStatusRoute.get('/:id', purchaseStatusController.getById);
purchaseStatusRoute.patch('/:id', purchaseStatusController.update);
purchaseStatusRoute.patch('/trash/:id', purchaseStatusController.trash);
purchaseStatusRoute.patch('/restore/:id', purchaseStatusController.restore);
purchaseStatusRoute.delete('/:id', purchaseStatusController.delete);

export default purchaseStatusRoute;

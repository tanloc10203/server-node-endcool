import { Router } from 'express';
import { purchaseOrderController } from '../controllers';

const purchaseOrderRoute = Router();

purchaseOrderRoute.post('/', purchaseOrderController.create);
purchaseOrderRoute.get('/', purchaseOrderController.getAll);
purchaseOrderRoute.get('/:id', purchaseOrderController.getById);
purchaseOrderRoute.patch('/:id', purchaseOrderController.update);
purchaseOrderRoute.patch('/trash/:id', purchaseOrderController.trash);
purchaseOrderRoute.patch('/restore/:id', purchaseOrderController.restore);
purchaseOrderRoute.delete('/', purchaseOrderController.delete);

export default purchaseOrderRoute;

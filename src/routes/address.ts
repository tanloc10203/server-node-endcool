import { Router } from 'express';
import { addressController } from '../controllers';

const addressRoute = Router();

addressRoute.get('/', addressController.getAll);
addressRoute.get('/is-default', addressController.getIsDefault);
addressRoute.get('/:id', addressController.getById);
addressRoute.post('/', addressController.create);
addressRoute.patch('/:id', addressController.update);
addressRoute.delete('/:id', addressController.delete);

export default addressRoute;

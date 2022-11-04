import { Router } from 'express';
import orderController from '../controllers/order.controller';

const orderRoute = Router();

orderRoute.post('/', orderController.create);
orderRoute.get('/analysis', orderController.analysis);
orderRoute.get('/count', orderController.count);
orderRoute.get('/detail/', orderController.getAllDetail);
orderRoute.get('/detail/:memberId', orderController.getAllDetailHome);
orderRoute.get('/', orderController.getAll);
orderRoute.get('/:id', orderController.getById);
orderRoute.patch('/status-confirm/:orderId', orderController.statusConfirm);
orderRoute.patch('/checkout/:orderId', orderController.checkout);
orderRoute.patch('/:id', orderController.update);
orderRoute.delete('/:id', orderController.delete);

export default orderRoute;

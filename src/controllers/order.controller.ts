import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { db } from '../config/db';
import log from '../logger';
import { OrderAttribute } from '../models/order.model';
import { OrderDetailAttribute } from '../models/orderdetail.model';
import { ProductAttribute } from '../models/product.model';
import { ProductQuantityAttribute } from '../models/productquantity.model';
import { PurchaseStatusAttribute } from '../models/purchasestatus.model';
import orderService from '../services/order.service';
import { FilterPayload, statusActions } from '../utils';

const orderController = {
  async create(req: Request, res: Response) {
    try {
      const { memberId, productId, quantity } = req.body;

      if (!memberId || !productId || !quantity)
        return res.status(404).json({
          message: 'Missing body parameter: [memberId, productId, quantity] !!!',
          error: true,
        });

      const responseOrder = await orderService.getOrder(memberId, productId);

      if (!responseOrder || responseOrder.status?.id !== 3) {
        const responseOrderCreate: OrderAttribute = await orderService.createOrder(memberId);

        const data: OrderDetailAttribute = {
          orderId: responseOrderCreate.id as number,
          productId: productId,
          quantity: quantity,
        };

        const responseOrderDetailCreate = await orderService.createOrderDetail(data);

        return res.status(200).json({
          message: 'Create Success',
          error: false,
          data: { order: responseOrderCreate, orderDetail: responseOrderDetailCreate },
        });
      }

      let data: OrderDetailAttribute = {
        orderId: responseOrder.id as number,
        productId: productId,
        quantity: +quantity + 1,
      };

      const findOrderDetail = await orderService.findOrderDetail(data);

      data = {
        orderId: responseOrder.id as number,
        productId: productId,
        quantity:
          (findOrderDetail?.get() as OrderDetailAttribute).quantity + (1 || parseInt(quantity)),
      };

      const updateOrderDetail = await findOrderDetail?.update({ ...data });

      res.status(200).json({
        message: 'Create Success',
        error: false,
        responseOrder,
        data: { order: responseOrder, orderDetail: updateOrderDetail },
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const { memberId } = req.query;

      if (!memberId)
        return res
          .status(404)
          .json({ message: 'Missing query parameter: [memberId]!!!', error: true });

      const response = await orderService.getAllOrder(+memberId);

      res.status(200).json({
        message: 'Get All Success',
        error: false,
        data: response,
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = req.params;

      if (!id)
        return res.status(404).json({ message: 'Missing params parameter: [id]!!!', error: true });

      const response = await orderService.getOrderById(+id);

      res.status(200).json({
        message: 'Get All Success',
        error: false,
        data: response,
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { quantity, memberId, productId } = req.body;

      if (!id || !quantity || !memberId || !productId)
        return res.status(404).json({
          message:
            'Missing params parameter and body parameter: [id], [quantity, memberId, productId] !!!',
          error: true,
        });

      const findOrder = await orderService.getOrder(parseInt(memberId), parseInt(productId));

      if (!findOrder) return res.status(400).json({ message: 'Not exist Order!!!', error: true });

      const updateOrderDetail = await db.OrderDetail.update(
        {
          quantity: quantity,
        },
        {
          where: {
            productId,
            orderId: findOrder.id,
          },
          returning: true,
        }
      );

      res.status(200).json({
        message: 'Update Success',
        error: false,
        data: updateOrderDetail[1][0],
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      //
      if (!id)
        return res.status(404).json({ message: 'Missing params parameter [id]!!!', error: true });

      const response = await orderService.getOrderById(+id);

      if (!response) return res.status(400).json({ message: 'Id order was not exist' });

      const order = response.get();

      await response.destroy();

      await orderService.deleteOrderDetailById(+order.id);

      res.status(200).json({
        message: 'Delete Success',
        error: false,
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async getAllDetail(req: Request, res: Response) {
    try {
      const statusId = parseInt(req.query.status as string);
      const filters: FilterPayload = req.query as FilterPayload;

      let { _limit, _page, name_like } = filters;

      _page = parseInt(_page + '') ? _page : 0;
      _page = _page < 1 ? (_page = 0) : _page - 1;

      _limit = (parseInt(_limit + '') && parseInt(_limit + '')) || 10;
      name_like = parseInt(name_like + '') ? parseInt(name_like + '') : name_like;

      const response = await orderService.handleGetAllAtDashboard({
        ...filters,
        _limit,
        _page,
        name_like,
        statusId,
      });
      const _totalRows = await orderService.orderDetailLength();

      res.json({
        message: 'GET SUCCESS',
        data: response,
        pagination: { _limit, _page: _page + 1, _totalRows: _totalRows.length },
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async getAllDetailHome(req: Request, res: Response) {
    try {
      const memberId = parseInt(req.params.memberId + '');
      const statusId = parseInt(req.query.status + '');
      const filters: FilterPayload = req.query as FilterPayload;

      let { _limit, _page, name_like } = filters;

      _page = parseInt(_page + '') ? _page : 0;
      _page = _page < 1 ? (_page = 0) : _page - 1;

      _limit = (parseInt(_limit + '') && parseInt(_limit + '')) || 10;
      name_like = parseInt(name_like + '') ? parseInt(name_like + '') : name_like;

      const response = await orderService.handleGetAllAtHome(
        {
          ...filters,
          _limit,
          _page,
          name_like,
          statusId,
        },
        memberId
      );

      const _totalRows = await orderService.orderDetailHomeLength(
        {
          ...filters,
          _limit,
          _page,
          name_like,
          statusId,
        },
        memberId
      );

      res.json({
        message: 'GET SUCCESS',
        data: response,
        pagination: { _limit, _page: _page + 1, _totalRows: _totalRows.length },
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async checkout(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const data = req.body;

      if (!orderId || !data)
        return res.status(404).json({ message: 'Missing parameter orderId and data', error: true });

      const updateOrder = await db.Order.update(
        { customerId: data.customerId, statusId: 5 },
        {
          where: {
            id: orderId,
          },
          returning: true,
        }
      );

      const updatePurchase = await db.PurchaseOrder.update(
        { statusId: 5 },
        {
          where: {
            orderId: orderId,
          },
          returning: true,
        }
      );

      res.json({
        message: 'Checkout Success',
        error: false,
        response: { updateOrder, updatePurchase },
      });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async statusConfirm(req: Request, res: Response) {
    try {
      const data: OrderDetailAttribute = req.body as OrderDetailAttribute;
      const orderId = parseInt(req.params.orderId + '');

      if (!orderId || !(data.order?.status as PurchaseStatusAttribute).id) {
        return res
          .status(404)
          .json({ message: 'Missing parameter orderId and statusId', error: true });
      }

      const status: PurchaseStatusAttribute = data.order?.status as PurchaseStatusAttribute;
      const product: ProductAttribute = data.product as ProductAttribute;

      let statusId = 11;

      const productQuantity = await db.ProductQuantity.findOne({
        where: { productId: product.id },
      });

      if (!productQuantity)
        return res.status(400).json({ message: 'Product Quantity not found!', error: true });

      const quantity: ProductQuantityAttribute = productQuantity.get();

      if (status.key === statusActions.confirmOrder) {
        if (data.isDelete) statusId = 12;
        else statusId = 6;

        await productQuantity.update({
          orderQuantity: data.quantity,
          totalQuantity: quantity.totalQuantity - data.quantity,
        });
      } else if (status.key === statusActions.waitProduct) {
        statusId = 7;
      } else if (status.key === statusActions.transport) {
        statusId = 8;
      } else if (status.key === statusActions.delivered) {
        statusId = 9;
        await productQuantity.update({ sold: data.quantity + quantity.sold });
      } else {
        statusId = 12;
      }

      await db.Order.update({ statusId: statusId }, { where: { id: orderId } });

      res.json({ message: 'Update status confirm success', error: false });
    } catch (error) {
      res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
      log.error(error);
    }
  },

  async count(req: Request, res: Response) {
    try {
      const response = await db.Order.count({
        col: 'id',
        where: {
          statusId: {
            [Op.eq]: 9,
          },
        },
      });

      res.status(200).json({ message: `Get count row success`, count: response, error: false });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  },

  async analysis(req: Request, res: Response) {
    try {
      let responseCart = (
        await orderService.handleAnalysis('createdAt', {
          statusId: { [Op.gte]: 3 },
        })
      ).map((i) => ({
        date: i?.get().date,
        count: +i?.get().count,
      }));

      const responseSold = (await orderService.handleAnalysis('updatedAt', { statusId: 9 })).map(
        (i) => ({
          date: i?.get().date,
          count: +i?.get().count,
        })
      );

      const responseCancel = (await orderService.handleAnalysis('updatedAt', { statusId: 12 })).map(
        (i) => ({
          date: i?.get().date,
          count: +i?.get().count,
        })
      );

      const response = [...responseCart, ...responseSold, ...responseCancel].sort(
        (e, b) => +new Date(e.date) - +new Date(b.date)
      );

      let unique = response.map((i) => i.date);

      const newUnique = unique
        .filter((item, index, arr) => arr.indexOf(item) === index)
        .map((item) => ({ date: item, count: 0 }));

      const newResponseCart = orderService.handleArrayPassDate(responseCart, newUnique);
      const newResponseSold = orderService.handleArrayPassDate(responseSold, newUnique);
      const newResponseCancel = orderService.handleArrayPassDate(responseCancel, newUnique);

      res.status(200).json({
        error: false,
        message: 'GET SUCCESS',
        // dataOld: { cart: responseCart, sold: responseSold, cancel: responseCancel },
        data: { cart: newResponseCart, sold: newResponseSold, cancel: newResponseCancel },
        date: newUnique.map((i) => i.date),
      });
    } catch (error) {
      log.error(error);
      if (error instanceof Error)
        return res.status(500).json({ message: 'ERROR FROM SERVER!!!', error: error.message });
    }
  },
};

export default orderController;

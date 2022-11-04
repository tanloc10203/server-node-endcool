import { Op, Sequelize, WhereOptions } from 'sequelize';
import { db } from '../config/db';
import { OrderAttribute } from '../models/order.model';
import { OrderDetailAttribute } from '../models/orderdetail.model';
import { AnalysisPayload, FilterPayload } from '../utils';

const orderService = {
  getOrder(memberId: number, productId: number): Promise<OrderAttribute> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.Order.findAll({
          where: { memberId },
          limit: 1,
          include: [
            {
              model: db.OrderDetail,
              as: 'orderDetail',
              where: { productId },
              required: true,
            },
            {
              model: db.PurchaseStatus,
              as: 'status',
              required: true,
            },
          ],
          order: [['createdAt', 'DESC']],
        });

        resolve(response[0] as unknown as OrderAttribute);
      } catch (error) {
        reject(error);
      }
    });
  },

  getOrderDetail(orderId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.OrderDetail.findOne({ where: { orderId } });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  createOrder(memberId: number): Promise<OrderAttribute> {
    return new Promise(async (resolve, reject) => {
      try {
        const response: OrderAttribute = (await db.Order.create({ memberId, statusId: 3 })).get();
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  createOrderDetail(data: OrderDetailAttribute) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.OrderDetail.create({ ...data });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  updateOrderDetail(data: OrderDetailAttribute) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.OrderDetail.update(
          { ...data },
          { where: { orderId: data.orderId, productId: data.productId } }
        );
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  findOrderDetail(data: OrderDetailAttribute) {
    return db.OrderDetail.findOne({
      where: { orderId: data.orderId, productId: data.productId },
    });
  },

  getAllOrder(memberId: number) {
    return db.Order.findAll({
      where: { memberId },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: ['id'],
      include: [
        {
          model: db.OrderDetail,
          as: 'orderDetail',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: db.Product,
              as: 'product',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
              include: [
                {
                  model: db.Category,
                  as: 'categories',
                  attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                  },
                },
                {
                  model: db.StatusProduct,
                  as: 'status',
                  attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt'],
                  },
                },
                {
                  model: db.ProductPrice,
                  as: 'price',
                  attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                  },
                },
                {
                  model: db.ProductImages,
                  as: 'images',
                  attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                  },
                },
              ],
            },
          ],
        },
        {
          model: db.PurchaseStatus,
          as: 'status',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          where: {
            key: 'them-vao-gio-hang',
          },
        },
      ],
    });
  },

  getOrderById(id: number) {
    return db.Order.findByPk(id);
  },

  deleteOrderById(id: number) {
    return db.Order.destroy({ where: { id } });
  },

  deleteOrderDetailById(orderId: number) {
    return db.OrderDetail.destroy({ where: { orderId } });
  },

  orderDetailLength() {
    return db.OrderDetail.findAll({
      attributes: {
        exclude: ['orderId', 'productId'],
      },
      order: ['createdAt'],
      include: [
        {
          model: db.Order,
          as: 'order',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'memberId', 'statusId'],
          },
        },
      ],
    });
  },

  handleGetAllAtDashboard(filters: FilterPayload) {
    let { _limit, _page, name_like, name_query, statusId } = filters;

    return db.OrderDetail.findAll({
      attributes: {
        exclude: ['orderId', 'productId'],
      },
      offset: _limit * _page,
      limit: _limit,
      order: [
        [{ model: db.Order, as: 'order' }, 'updatedAt', 'DESC'],
        // [{ model: db.Order, as: 'order' }, 'statusId'],
      ],
      include: [
        {
          model: db.Order,
          as: 'order',
          attributes: {
            exclude: ['createdAt', 'memberId', 'statusId'],
          },
          required: true,

          include: [
            {
              model: db.Member,
              as: 'member',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'key', 'keyChangePw'],
              },
            },
            {
              model: db.PurchaseStatus,
              as: 'status',
              where: {
                id: {
                  [statusId ? Op.eq : Op.not]: statusId ? statusId : null,
                },
              },
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
              required: true,
            },
            {
              model: db.Address,
              as: 'customer',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: db.Product,
          as: 'product',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'categoryId',
              'statusPId',
              'productDetail',
              'description',
            ],
          },
          include: [
            {
              model: db.ProductPrice,
              as: 'price',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
    });
  },

  orderDetailHomeLength(filters: FilterPayload, memberId: number) {
    let { _limit, _page, name_like, name_query, statusId } = filters;

    return db.OrderDetail.findAll({
      attributes: {
        exclude: ['orderId', 'productId'],
      },
      order: ['createdAt'],
      include: [
        {
          model: db.Order,
          as: 'order',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'memberId', 'statusId'],
          },
          required: true,

          include: [
            {
              model: db.Member,
              as: 'member',
              where: {
                id: memberId,
              },
              required: true,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'key', 'keyChangePw'],
              },
            },
            {
              model: db.PurchaseStatus,
              as: 'status',
              where: {
                id: {
                  [statusId ? Op.eq : Op.not]: statusId ? statusId : null,
                },
                key: {
                  [Op.not]: 'them-vao-gio-hang',
                },
              },
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
              required: true,
            },
          ],
        },
      ],
    });
  },

  handleGetAllAtHome(filters: FilterPayload, memberId: number) {
    let { _limit, _page, name_like, name_query, statusId } = filters;

    return db.OrderDetail.findAll({
      attributes: {
        exclude: ['orderId', 'productId'],
      },
      order: [[{ model: db.Order, as: 'order' }, 'statusId']],
      offset: _limit * _page,
      limit: _limit,
      include: [
        {
          model: db.Order,
          as: 'order',
          attributes: {
            exclude: ['createdAt', 'memberId', 'statusId'],
          },
          required: true,

          include: [
            {
              model: db.Member,
              as: 'member',
              where: {
                id: memberId,
              },
              required: true,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'key', 'keyChangePw'],
              },
            },
            {
              model: db.PurchaseStatus,
              as: 'status',
              where: {
                id: {
                  [statusId ? Op.eq : Op.not]: statusId ? statusId : null,
                },
                key: {
                  [Op.not]: 'them-vao-gio-hang',
                },
              },
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
              required: true,
            },
            {
              model: db.Address,
              as: 'customer',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: db.Product,
          as: 'product',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'categoryId',
              'statusPId',
              'productDetail',
              'description',
            ],
          },
          include: [
            {
              model: db.ProductPrice,
              as: 'price',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
    });
  },

  handleAnalysis(col: 'updatedAt' | 'createdAt', whereOption: WhereOptions<any>) {
    return db.Order.findAll({
      where: whereOption,
      attributes: [
        [Sequelize.literal(`DATE("${col}")`), 'date'],
        [Sequelize.literal(`COUNT("${col}")`), 'count'],
      ],
      group: ['date'],
    });
  },

  handleArrayPassDate(array: Array<AnalysisPayload>, arrayDate: Array<AnalysisPayload>) {
    const newArr = [...arrayDate, ...array];

    const arr_date = newArr.map((o) => o.date);

    let filter = newArr.filter(({ date }, index) => !arr_date.includes(date, index + 1));

    filter = filter.sort((a, b) => +new Date(a.date) - +new Date(b.date));

    return filter;
  },
};

export default orderService;

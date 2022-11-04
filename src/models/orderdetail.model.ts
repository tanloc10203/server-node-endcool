'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Order, OrderAttribute } from './order.model';
import { Product, ProductAttribute } from './product.model';

export interface OrderDetailAttribute {
  id?: number;
  quantity: number;

  orderId: number;
  order?: OrderAttribute;

  productId: number;
  product?: ProductAttribute;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

export class OrderDetail extends Model implements OrderDetailAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public orderId!: number;
  public quantity!: number;
  public productId!: number;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly order?: Order;
  public readonly product?: Product;

  public static associations: {
    // define association here
    order: Association<OrderDetail, Order>;
    product: Association<OrderDetail, Product>;
  };
}

export function initOrderDetail(sequelize: Sequelize): void {
  OrderDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderDetail',
    }
  );
}

export function associateOrderDetail(): void {
  OrderDetail.belongsTo(Order, {
    targetKey: 'id',
    foreignKey: 'orderId',
    as: 'order',
  });
  OrderDetail.belongsTo(Product, {
    targetKey: 'id',
    foreignKey: 'productId',
    as: 'product',
  });
}

'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Address, AddressAttribute } from './address.model';
import { Member } from './member.model';
import { OrderDetail, OrderDetailAttribute } from './orderdetail.model';
import { PurchaseOrder, PurchaseOrderAttribute } from './purchaseorder.model';
import { PurchaseStatus, PurchaseStatusAttribute } from './purchasestatus.model';

export interface OrderAttribute {
  id?: number;
  memberId?: number;

  orderDetail?: OrderDetailAttribute;
  purchaseOrders?: PurchaseOrderAttribute[];

  statusId?: number;
  status?: PurchaseStatusAttribute;

  customerId?: number;
  customer?: AddressAttribute;

  createdAt?: string;
  isEvaluate?: boolean;
  updatedAt?: string;

  [key: string]: any;
}

export class Order extends Model implements OrderAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public memberId!: number;
  public statusId?: number;
  public isEvaluate?: boolean;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly member?: Member;
  public readonly orderDetail?: OrderDetailAttribute;
  public readonly purchaseOrders?: PurchaseOrderAttribute[];
  public readonly customer?: AddressAttribute;

  public static associations: {
    // define association here
    member: Association<Order, Member>;
    orderDetail: Association<Order, OrderDetail>;
    purchaseOrders: Association<Order, PurchaseOrder>;
    customer: Association<Order, Address>;
  };
}

export function initOrder(sequelize: Sequelize): void {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      isEvaluate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
}

export function associateOrder(): void {
  Order.belongsTo(Member, {
    targetKey: 'id',
    foreignKey: 'memberId',
    as: 'member',
  });

  Order.hasOne(OrderDetail, {
    sourceKey: 'id',
    foreignKey: 'orderId',
    as: 'orderDetail',
  });

  Order.hasMany(PurchaseOrder, {
    sourceKey: 'id',
    foreignKey: 'orderId',
    as: 'purchaseOrders',
  });

  Order.belongsTo(PurchaseStatus, {
    targetKey: 'id',
    foreignKey: 'statusId',
    as: 'status',
  });

  Order.belongsTo(Address, {
    targetKey: 'id',
    foreignKey: 'customerId',
    as: 'customer',
  });
}

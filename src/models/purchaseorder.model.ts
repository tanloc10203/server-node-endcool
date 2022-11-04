'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Order, OrderAttribute } from './order.model';
import { PurchaseStatus, PurchaseStatusAttribute } from './purchasestatus.model';

export interface PurchaseOrderAttribute {
  id?: number;

  orderId: number;
  statusId: number;

  purchaseStatus?: PurchaseStatusAttribute;
  order?: OrderAttribute;

  updatedAt?: string;
  createdAt?: string;
}

export class PurchaseOrder extends Model implements PurchaseOrderAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public orderId!: number;
  public statusId!: number;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly purchaseStatus?: PurchaseStatusAttribute;
  public readonly order?: OrderAttribute;

  public static associations: {
    // define association here
    purchaseStatus: Association<PurchaseOrder, PurchaseStatus>;
    order: Association<PurchaseOrder, Order>;
  };
}

export function initPurchaseOrder(sequelize: Sequelize): void {
  PurchaseOrder.init(
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'PurchaseOrder',
    }
  );
}

export function associatePurchaseOrder(): void {
  PurchaseOrder.belongsTo(PurchaseStatus, {
    targetKey: 'id',
    foreignKey: 'statusId',
    as: 'purchaseStatus',
  });

  PurchaseOrder.belongsTo(Order, {
    targetKey: 'id',
    foreignKey: 'orderId',
    as: 'order',
  });
}

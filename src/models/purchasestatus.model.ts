'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Order } from './order.model';
import { PurchaseOrder, PurchaseOrderAttribute } from './purchaseorder.model';

export interface PurchaseStatusAttribute {
  id?: number;

  key: string;
  name: string;

  purchases?: PurchaseOrderAttribute[];
  isActive?: boolean;

  updatedAt?: string;
  createdAt?: string;
}

export class PurchaseStatus extends Model implements PurchaseStatusAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public key!: string;

  public name!: string;
  public isActive?: boolean;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly purchases?: PurchaseOrderAttribute[];

  public static associations: {
    // define association here
    purchases: Association<PurchaseStatus, PurchaseOrder>;
  };
}

export function initPurchaseStatus(sequelize: Sequelize): void {
  PurchaseStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'PurchaseStatus',
    }
  );
}

export function associatePurchaseStatus(): void {
  PurchaseStatus.hasMany(PurchaseOrder, {
    sourceKey: 'id',
    foreignKey: 'statusId',
    as: 'purchases',
  });

  PurchaseStatus.hasMany(Order, {
    sourceKey: 'id',
    foreignKey: 'statusId',
    as: 'orders',
  });
}

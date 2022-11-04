'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { ProductPrice } from './productprice.model';

export interface TimeChangeAttribute {
  id?: number;
  time: Date;
  createdAt?: string;
  updatedAt?: string;
}

export class TimeChange extends Model implements TimeChangeAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public time!: Date;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly productPrice?: ProductPrice;

  public static associations: {
    // define association here
    productPrice: Association<TimeChange, ProductPrice>;
  };
}

export function initTimeChange(sequelize: Sequelize): void {
  TimeChange.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'TimeChange',
    }
  );
}

export function associateTimeChange(): void {
  TimeChange.hasMany(ProductPrice, {
    sourceKey: 'id',
    foreignKey: 'id',
    as: 'productPrices',
  });
}

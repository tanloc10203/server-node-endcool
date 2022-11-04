'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Member } from './member.model';
import { Product } from './product.model';

export interface StatusProductAttribute {
  id?: number;
  name: string;
  key: string;
  createdAt?: string;
  updatedAt?: string;
}

export class StatusProduct extends Model implements StatusProductAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public name!: string;
  public key!: string;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly product?: Product[];

  public static associations: {
    // define association here
    product: Association<StatusProduct, Product>;
  };
}

export function initStatusProduct(sequelize: Sequelize): void {
  StatusProduct.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      key: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'StatusProduct',
    }
  );
}

export function associateStatusProduct(): void {
  StatusProduct.hasMany(Product, {
    sourceKey: 'id',
    foreignKey: 'statusPId',
    as: 'statusPId',
  });
}

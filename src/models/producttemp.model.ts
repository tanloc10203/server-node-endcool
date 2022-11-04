'use strict';

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { Product, ProductAttribute } from './product.model';

export interface ProductTempAttribute {
  id?: number;
  productId: number;
  createdAt?: string;
  updatedAt?: string;
  products?: ProductAttribute;
}

export class ProductTemp extends Model implements ProductTempAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;
  public productId!: number;

  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly product?: Product[];

  public static associations: {
    // define association here
    product: Association<ProductTemp, Product>;
  };
}

export function initProductTemp(sequelize: Sequelize): void {
  ProductTemp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ProductTemp',
    }
  );
}

export function associateProductTemp(): void {
  ProductTemp.belongsTo(Product, { targetKey: 'id', foreignKey: 'productId', as: 'products' });
}

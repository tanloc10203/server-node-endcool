('use strict');

import { Association, DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize/types';
import { AttributeProduct } from './attributeproduct.model';
import { Category } from './category.model';
import { EvaluateProduct } from './evaluateproduct.model';
import { OrderDetail } from './orderdetail.model';
import { ProductImages } from './productimages.model';
import { ProductPrice } from './productprice.model';
import { ProductQuantity, ProductQuantityAttribute } from './productquantity.model';
import { ProductTemp } from './producttemp.model';
import { StatusProduct } from './statusproduct.model';

export interface ProductAttribute {
  id?: number;

  name?: string;
  thumb?: string;

  categoryId?: number;
  statusPId?: number;

  description?: string;
  productDetail?: string;
  productQuantity?: ProductQuantityAttribute;

  slug?: string;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

export class Product extends Model implements ProductAttribute {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  public id?: number;

  public name?: string;
  public thumb?: string;

  public categoryId?: number;
  public statusPId?: number;

  public description?: string;
  public productDetail?: string;

  public readonly slug?: string;
  public readonly createdAt?: string | undefined;
  public readonly updatedAt?: string | undefined;

  public readonly category?: Category;
  public readonly status?: StatusProduct;
  public readonly productPrice?: ProductPrice;
  public readonly orders?: OrderDetail;
  public readonly productQuantity?: ProductQuantity;
  public readonly evaluateProduct?: EvaluateProduct;
  public readonly attributeProduct?: AttributeProduct;

  public static associations: {
    // define association here
    category: Association<Product, Category>;
    orders: Association<Product, OrderDetail>;
    status: Association<Product, StatusProduct>;
    productPrice: Association<Product, ProductPrice>;
    productQuantity: Association<Product, ProductQuantity>;
    evaluateProduct: Association<Product, EvaluateProduct>;
    attributeProduct: Association<Product, AttributeProduct>;
  };
}

export function initProduct(sequelize: Sequelize): void {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      thumb: DataTypes.STRING,
      productDetail: DataTypes.TEXT,
      description: DataTypes.TEXT,
      categoryId: {
        type: DataTypes.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      statusPId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      // freezeTableName: true,
      modelName: 'Product',
    }
  );
}

export function associateProduct(): void {
  Product.belongsTo(Category, { as: 'categories', targetKey: 'id', foreignKey: 'categoryId' });
  Product.belongsTo(StatusProduct, { as: 'status', targetKey: 'id', foreignKey: 'statusPId' });

  Product.hasOne(ProductQuantity, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'productQuantity',
  });

  Product.hasOne(ProductPrice, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'price',
  });

  Product.hasMany(ProductTemp, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'productTemps',
  });

  Product.hasMany(ProductImages, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'images',
  });

  Product.hasMany(OrderDetail, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'orders',
  });

  Product.hasMany(EvaluateProduct, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'evaluates',
  });

  Product.hasMany(AttributeProduct, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'attributes',
  });
}

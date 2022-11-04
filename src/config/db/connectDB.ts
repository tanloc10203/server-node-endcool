import { Sequelize } from 'sequelize';
import { associateAddress, initAddress } from '../../models/address.model';
import {
  associateAttributeProduct,
  initAttributeProduct,
} from '../../models/attributeproduct.model';
import { associateCategory, initCategory } from '../../models/category.model';
import { associateEvaluateProduct, initEvaluateProduct } from '../../models/evaluateproduct.model';
import { associateMember, initMember } from '../../models/member.model';
import { associateOrder, initOrder } from '../../models/order.model';
import { associateOrderDetail, initOrderDetail } from '../../models/orderdetail.model';
import { associateProduct, initProduct } from '../../models/product.model';
import { associateProductImages, initProductImages } from '../../models/productimages.model';
import { associateProductPrice, initProductPrice } from '../../models/productprice.model';
import { associateProductQuantity, initProductQuantity } from '../../models/productquantity.model';
import { associateProductTemp, initProductTemp } from '../../models/producttemp.model';
import { associatePurchaseOrder, initPurchaseOrder } from '../../models/purchaseorder.model';
import { associatePurchaseStatus, initPurchaseStatus } from '../../models/purchasestatus.model';
import { associateSession, initSession } from '../../models/session.model';
import { associateStatusProduct, initStatusProduct } from '../../models/statusproduct.model';
import { associateTimeChange, initTimeChange } from '../../models/timechange.modle';
import { dbConfig } from './dbConfig';

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  dbConfig.DATABASE_NAME,
  dbConfig.USERNAME,
  null || dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false,
    timezone: '+07:00',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

initMember(sequelize);
initSession(sequelize);
initCategory(sequelize);
initTimeChange(sequelize);
initStatusProduct(sequelize);
initProduct(sequelize);
initProductPrice(sequelize);
initProductTemp(sequelize);
initProductImages(sequelize);
initOrder(sequelize);
initOrderDetail(sequelize);
initPurchaseStatus(sequelize);
initPurchaseOrder(sequelize);
initProductQuantity(sequelize);
initAddress(sequelize);
initEvaluateProduct(sequelize);
initAttributeProduct(sequelize);

associateMember();
associateSession();
associateCategory();
associateStatusProduct();
associateProduct();
associateTimeChange();
associateProductPrice();
associateProductTemp();
associateProductImages();
associateOrder();
associateOrderDetail();
associatePurchaseStatus();
associatePurchaseOrder();
associateProductQuantity();
associateAddress();
associateEvaluateProduct();
associateAttributeProduct();

export const db = {
  sequelize,
  Sequelize,
  Member: sequelize.models.Member,
  Session: sequelize.models.Session,
  Category: sequelize.models.Category,
  StatusProduct: sequelize.models.StatusProduct,
  Product: sequelize.models.Product,
  ProductPrice: sequelize.models.ProductPrice,
  TimeChange: sequelize.models.TimeChange,
  ProductTemp: sequelize.models.ProductTemp,
  ProductImages: sequelize.models.ProductImages,
  Order: sequelize.models.Order,
  OrderDetail: sequelize.models.OrderDetail,
  PurchaseStatus: sequelize.models.PurchaseStatus,
  PurchaseOrder: sequelize.models.PurchaseOrder,
  ProductQuantity: sequelize.models.ProductQuantity,
  Address: sequelize.models.Address,
  EvaluateProduct: sequelize.models.EvaluateProduct,
  AttributeProduct: sequelize.models.AttributeProduct,
};

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return sequelize;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error connect DB: ', error.message);
    }
    console.error('Unable to connectDB to the database:', error);
  }
};

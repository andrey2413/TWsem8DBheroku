import { Sequelize } from "sequelize";
import { sequelizeConfigProps } from "../config.js";
import { sequelizeOperationsAPI } from "./operations-api.js";

var sequelizeConnection = new Sequelize(
  "seminar_instance",
  "root",
  "test1234",
  sequelizeConfigProps
);

// ---------- 1:N ---------- //

export var Orders = sequelizeConnection.define("Orders", {
  OrderId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Title: {
    type: Sequelize.STRING,
  },
  Quantity: {
    type: Sequelize.DECIMAL(18, 2),
  },
  Message: {
    type: Sequelize.STRING,
  },
  City: {
    type: Sequelize.STRING,
  },
});

export var Products = sequelizeConnection.define("Products", {
  ProductId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Name: {
    type: Sequelize.STRING,
  },
  Price: {
    type: Sequelize.DECIMAL(18, 2),
  },
});

Orders.hasMany(Products, {
  foreignKey: "OrderId",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
  foreignKeyConstraint: true,
});

// ---------- 1:N ---------- //

// ---------- M:N ---------- //

export const Authors = sequelizeConnection.define("Authors", {
  AuthorId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  AuthorName: {
    type: Sequelize.STRING,
  },
});

export const Books = sequelizeConnection.define("Books", {
  BookId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  BookName: {
    type: Sequelize.STRING,
  },
});

export const AuthorsXBooks = sequelizeConnection.define("AuthorsXBooks", {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  BookId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  AuthorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Books.belongsToMany(Authors, {
  as: "Authors",
  through: { model: AuthorsXBooks, unique: false },
  foreignKey: "BookId",
});
Authors.belongsToMany(Books, {
  as: "Books",
  through: { model: AuthorsXBooks, unique: false },
  foreignKey: "AuthorId",
});

// ---------- M:N ---------- //

// ---------- 1:1 ---------- //

export const Students = sequelizeConnection.define("Students", {
  StudentId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  FirstName: {
    type: Sequelize.STRING,
  },
  LastName: {
    type: Sequelize.STRING,
  },
});

export const ContactInfo = sequelizeConnection.define("ContactInfo", {
  ContactInfoId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  City: {
    type: Sequelize.STRING,
  },
  Phone: {
    type: Sequelize.STRING,
  },
});

Students.hasOne(ContactInfo, { foreignKey: "StudentId" });
ContactInfo.belongsTo(Students, { foreignKey: "StudentId" });

// ---------- 1:1 ---------- //
sequelizeOperationsAPI.init(sequelizeConnection);

export { sequelizeConnection };

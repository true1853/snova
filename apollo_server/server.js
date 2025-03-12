// server.js

// Полифил для globalThis (если не определён)
if (typeof globalThis === 'undefined') {
  Object.defineProperty(global, 'globalThis', { value: global });
}
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback, thisArg) {
    return Array.prototype.concat.apply([], this.map(callback, thisArg));
  };
}
if (!String.prototype.matchAll) {
  String.prototype.matchAll = function(regexp) {
    const matches = [];
    let match;
    while ((match = regexp.exec(this)) !== null) {
      matches.push(match);
      if (!regexp.global) break;
    }
    return matches;
  };
}

const { getLocation: originalGetLocation } = require('graphql/language/location');
const graphql = require('graphql');
graphql.getLocation = function(source, pos) {
  if (source && source.body && typeof source.body !== 'string') {
    source.body = String(source.body);
  }
  return originalGetLocation(source, pos);
};

const { ApolloServer, gql } = require('apollo-server');
const pool = require('./db');
const jwt = require('jsonwebtoken');

// Секретный ключ для подписи JWT (лучше хранить в переменных окружения)
const SECRET_KEY = process.env.SECRET_KEY || 'your-very-secret-key';

const { GraphQLScalarType, Kind } = require("graphql");
const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom Date scalar type that returns formatted date string (YYYY-MM-DD HH:mm:ss)",
  serialize(value) {
    const date = value instanceof Date ? value : new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Обновлённая GraphQL-схема
const typeDefs = gql`
  scalar JSON
  scalar Date

  type Product {
    id: ID!
    name: String!
    description: String
    sku: String
    barcode: String
    price: Float!
    currency: String
    discount_price: Float
    stock_quantity: Int
    availability_status: String
    category_id: Int
    brand: String
    attributes: JSON
    created_at: Date
    updated_at: Date
    is_active: Boolean
    images: [ProductImage]
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    description: String
    products: [Product]
  }

  type ProductImage {
    id: ID!
    product_id: Int
    url: String!
    alt_text: String
    product: Product
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
    created_at: Date
    ozon_client_id: String
    ozon_api_key: String
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  type Query {
    products(orderBy: String, orderDir: String, filter: JSON): [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
    productImages(productId: ID!): [ProductImage!]!
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createProduct(
      name: String!,
      description: String,
      sku: String,
      barcode: String,
      price: Float!,
      currency: String,
      discount_price: Float,
      stock_quantity: Int,
      availability_status: String,
      category_id: Int,
      brand: String,
      attributes: JSON,
      is_active: Boolean
    ): Product!

    updateProduct(
      id: ID!,
      name: String,
      description: String,
      sku: String,
      barcode: String,
      price: Float,
      currency: String,
      discount_price: Float,
      stock_quantity: Int,
      availability_status: String,
      category_id: Int,
      brand: String,
      attributes: JSON,
      is_active: Boolean
    ): Product!

    deleteProduct(id: ID!): Boolean!

    createCategory(
      name: String!,
      description: String
    ): Category!

    updateCategory(
      id: ID!,
      name: String,
      description: String
    ): Category!

    deleteCategory(id: ID!): Boolean!

    addProductImage(
      product_id: Int!,
      url: String!,
      alt_text: String
    ): ProductImage!

    deleteProductImage(id: ID!): Boolean!

    createUser(
      name: String!,
      email: String!,
      password: String!,
      avatar: String
    ): User!

    updateUser(
      id: ID!,
      name: String,
      email: String,
      password: String,
      avatar: String,
      ozon_client_id: String,
      ozon_api_key: String
    ): User!

    deleteUser(id: ID!): Boolean!

    loginUser(
      email: String!,
      password: String!
    ): LoginResponse!
  }
`;

// Резолверы
const resolvers = {
  Date: DateScalar,
  Query: {
    // Получаем только товары, принадлежащие авторизованному пользователю
    products: async (_, { orderBy, orderDir, filter }, context) => {
      let query = "SELECT * FROM products";
      const params = [];
      const conditions = [];
      // Если пользователь авторизован, фильтруем по user_id
      if (context.user && context.user.id) {
        conditions.push(`user_id = $${params.length + 1}`);
        params.push(context.user.id);
      }
      if (filter && typeof filter === "object") {
        const filterKeys = Object.keys(filter);
        filterKeys.forEach((key) => {
          if (filter[key] !== undefined && filter[key] !== "") {
            conditions.push(`${key} = $${params.length + 1}`);
            params.push(filter[key]);
          }
        });
      }
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      if (orderBy) {
        const allowedColumns = ["name", "price", "created_at", "stock_quantity"];
        if (!allowedColumns.includes(orderBy)) {
          throw new Error("Invalid orderBy field");
        }
        orderDir = orderDir && orderDir.toUpperCase() === "DESC" ? "DESC" : "ASC";
        query += ` ORDER BY ${orderBy} ${orderDir}`;
      }
      const { rows } = await pool.query(query, params);
      return rows;
    },
    product: async (_, { id }, context) => {
      // При запросе одного товара можно также добавить проверку прав доступа
      const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
      return rows[0];
    },
    categories: async () => {
      const { rows } = await pool.query("SELECT * FROM categories");
      return rows;
    },
    category: async (_, { id }) => {
      const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
      return rows[0];
    },
    productImages: async (_, { productId }) => {
      const { rows } = await pool.query("SELECT * FROM product_images WHERE product_id = $1", [productId]);
      return rows;
    },
    users: async () => {
      const { rows } = await pool.query(
        "SELECT id, name, email, avatar, created_at, ozon_client_id, ozon_api_key FROM users"
      );
      return rows;
    },
    user: async (_, { id }) => {
      const { rows } = await pool.query(
        "SELECT id, name, email, avatar, created_at, ozon_client_id, ozon_api_key FROM users WHERE id = $1",
        [id]
      );
      return rows[0];
    },
  },
  Mutation: {
    createProduct: async (_, args, context) => {
      if (!context.user || !context.user.id) {
        throw new Error("Not authenticated");
      }
      const query = `
        INSERT INTO products 
          (name, description, sku, barcode, price, currency, discount_price, stock_quantity, availability_status, category_id, brand, attributes, is_active, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      const values = [
        args.name,
        args.description,
        args.sku,
        args.barcode,
        args.price,
        args.currency || "USD",
        args.discount_price,
        args.stock_quantity || 0,
        args.availability_status,
        args.category_id,
        args.brand,
        args.attributes,
        args.is_active !== undefined ? args.is_active : true,
        context.user.id,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0];
    },
    updateProduct: async (_, { id, ...args }, context) => {
      let idx = 1;
      const updates = [];
      const values = [];
      for (let key in args) {
        if (args[key] !== undefined) {
          updates.push(`${key} = $${idx++}`);
          values.push(args[key]);
        }
      }
      values.push(id);
      const query = `UPDATE products SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`;
      const { rows } = await pool.query(query, values);
      return rows[0];
    },
    deleteProduct: async (_, { id }) => {
      await pool.query("DELETE FROM products WHERE id = $1", [id]);
      return true;
    },
    createCategory: async (_, { name, description }) => {
      const query = `
        INSERT INTO categories (name, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      const { rows } = await pool.query(query, [name, description]);
      return rows[0];
    },
    updateCategory: async (_, { id, name, description }) => {
      let idx = 1;
      const updates = [];
      const values = [];
      if (name !== undefined) {
        updates.push(`name = $${idx++}`);
        values.push(name);
      }
      if (description !== undefined) {
        updates.push(`description = $${idx++}`);
        values.push(description);
      }
      values.push(id);
      const query = `UPDATE categories SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`;
      const { rows } = await pool.query(query, values);
      return rows[0];
    },
    deleteCategory: async (_, { id }) => {
      await pool.query("DELETE FROM categories WHERE id = $1", [id]);
      return true;
    },
    addProductImage: async (_, { product_id, url, alt_text }) => {
      const query = `
        INSERT INTO product_images (product_id, url, alt_text)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const { rows } = await pool.query(query, [product_id, url, alt_text]);
      return rows[0];
    },
    deleteProductImage: async (_, { id }) => {
      await pool.query("DELETE FROM product_images WHERE id = $1", [id]);
      return true;
    },
    createUser: async (_, { name, email, password, avatar }) => {
      const query = `
        INSERT INTO users (name, email, password, avatar)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, avatar, created_at, ozon_client_id, ozon_api_key
      `;
      const { rows } = await pool.query(query, [name, email, password, avatar]);
      return rows[0];
    },
    updateUser: async (_, { id, name, email, password, avatar, ozon_client_id, ozon_api_key }) => {
      let idx = 1;
      const updates = [];
      const values = [];
      if (name !== undefined && name !== "") {
        updates.push(`name = $${idx++}`);
        values.push(name);
      }
      if (email !== undefined && email !== "") {
        updates.push(`email = $${idx++}`);
        values.push(email);
      }
      if (password !== undefined && password !== "") {
        updates.push(`password = $${idx++}`);
        values.push(password);
      }
      if (avatar !== undefined) {
        updates.push(`avatar = $${idx++}`);
        values.push(avatar);
      }
      if (ozon_client_id !== undefined && ozon_client_id !== "") {
        updates.push(`ozon_client_id = $${idx++}`);
        values.push(ozon_client_id);
      }
      if (ozon_api_key !== undefined && ozon_api_key !== "") {
        updates.push(`ozon_api_key = $${idx++}`);
        values.push(ozon_api_key);
      }
      values.push(id);
      const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${idx} RETURNING id, name, email, avatar, created_at, ozon_client_id, ozon_api_key`;
      const { rows } = await pool.query(query, values);
      return rows[0];
    },
    deleteUser: async (_, { id }) => {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return true;
    },
    loginUser: async (_, { email, password }) => {
      const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = rows[0];
      if (!user) {
        throw new Error("Пользователь не найден");
      }
      if (user.password !== password) {
        throw new Error("Неверный пароль");
      }
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
      return { token, user };
    },
  },
  Product: {
    images: async (parent) => {
      const { rows } = await pool.query("SELECT * FROM product_images WHERE product_id = $1", [parent.id]);
      return rows;
    },
    category: async (parent) => {
      if (!parent.category_id) return null;
      const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [parent.category_id]);
      return rows[0];
    },
  },
  Category: {
    products: async (parent) => {
      const { rows } = await pool.query("SELECT * FROM products WHERE category_id = $1", [parent.id]);
      return rows;
    },
  },
  ProductImage: {
    product: async (parent) => {
      const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [parent.product_id]);
      return rows[0];
    },
  },
};

// Создаем Apollo Server с контекстом, который извлекает пользователя из JWT
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return { user };
      } catch (error) {
        console.error("Ошибка верификации JWT:", error);
      }
    }
    return {};
  },
  plugins: [
    {
      requestDidStart(requestContext) {
        if (
          requestContext.request.query &&
          typeof requestContext.request.query !== "string"
        ) {
          requestContext.request.query = String(requestContext.request.query);
        }
        return {};
      },
    },
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Сервер запущен по адресу ${url}`);
});

const bcrypt = require('bcrypt');
const knex = require('../db/knex');

const SALT_ROUNDS = 12;

class User {
  #passwordHash = null; // a private property

  // Create a User instance with the password hidden
  // Instances of User can be sent to clients without exposing the password
  constructor({ id, name, age, email, password_hash }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  // Controllers can use this instance method to validate passwords prior to sending responses
  isValidPassword = async (password) => bcrypt.compare(password, this.#passwordHash);

  // Hashes the given password and then creates a new user
  // in the users table. Returns the newly created user, using
  // the constructor to hide the passwordHash.
  static async create(name, age, email, password) {
    // Check if email already exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    // Hash the plain-text password using bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `INSERT INTO users (name, age, email, password_hash)
      VALUES (?, ?, ?, ?) RETURNING *`;
    const result = await knex.raw(query, [name, age, email, passwordHash]);

    const rawUserData = result.rows[0];
    return new User(rawUserData);
  }

  // Fetches ALL users from the users table, uses the constructor
  // to format each user (and hide their password hash), and returns.
  static async list() {
    const query = `SELECT * FROM users`;
    const result = await knex.raw(query);
    return result.rows.map((rawUserData) => new User(rawUserData));
  }

  // Fetches A single user from the users table that matches
  // the given user id. If it finds a user, uses the constructor
  // to format the user and returns or returns null if not.
  static async find(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await knex.raw(query, [id]);
    const rawUserData = result.rows[0];
    return rawUserData ? new User(rawUserData) : null;
  }

  // Same as above but uses the username to find the user
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;

    const result = await knex.raw(query, [email]);

    const rawUserData = result.rows[0];

    return rawUserData ? new User(rawUserData) : null;
  }

  // Updates the user that matches the given id with a new username.
  // Returns the modified user, using the constructor to hide the passwordHash.
  static async update(id, username) {
    const query = `
      UPDATE users
      SET username=?
      WHERE id=?
      RETURNING *
    `;
    const result = await knex.raw(query, [username, id]);
    const rawUpdatedUser = result.rows[0];
    return rawUpdatedUser ? new User(rawUpdatedUser) : null;
  }

  static async deleteAll() {
    return knex('users').del();
  }
}

module.exports = User;

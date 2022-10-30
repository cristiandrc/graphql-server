import { gql, ApolloServer, UserInputError } from "apollo-server";
import config from "./config/index.js";
import "./db.js";
import Person from "./models/person";
import User from "./models/user.js";
import jwt from "jsonwebtoken";

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type User {
    username: String!
    friends: [Person]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, phone: String!): Person

    createUser(username: String!): User

    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return Person.find({});

      return Person.find({ phone: { $exists: args.phone === "YES" } });
    },
    findPerson: async (root, args) => {
      const { name } = args;
      return await Person.findOne({ name });
    },
  },

  Mutation: {
    addPerson: (root, args) => {
      const person = new Person({ ...args });
      return person.save();
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) return;
      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          validateArgs: args,
        });
      }
      return person;
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username });
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("Wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, config.jwtSecretLogin),
      };
    },
  },

  /**
   * custom properties in Person
   */
  Person: {
    address: (root) => {
      return {
        city: root.city,
        street: root.street,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {},
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

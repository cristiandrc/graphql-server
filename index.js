import { gql, ApolloServer, UserInputError } from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";

const persons = [
  {
    name: "Cristian",
    phone: "0341234567",
    street: "street Frontend",
    city: "Colombia",
    id: "213ddf32-23234-2324a-dc23423-",
  },
  {
    name: "David",
    phone: "034122344567",
    street: "street FullStack",
    city: "Colombia",
    id: "213ddf32-23234-2324a-dc92833-",
  },
  {
    name: "Rojas",
    street: "street Testing",
    city: "Colombia",
    id: "213ddf32-98234-2324a-dc23423-",
  },
];

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

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      const { data: personsFromRestApi } = await axios.get(
        "http://localhost:3000/persons"
      );
      if (!args.phone) return personsFromRestApi;

      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;

      return personsFromRestApi.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },

  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },

    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name);
      if (personIndex === -1) null;

      const person = persons[personIndex];

      const updatePerson = { ...person, phone: args.phone };
      persons[personIndex] = updatePerson;
      return updatePerson;
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
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

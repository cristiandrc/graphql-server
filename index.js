import { gql, ApolloServer } from "apollo-server";
// import { ApolloServer } from "apollo-server-express";

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
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

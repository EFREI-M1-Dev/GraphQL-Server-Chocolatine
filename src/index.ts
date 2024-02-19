import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import {inspect} from "util";

const doctorsData = [
  {
    id: "1",
    name: 'Samia Mekame',
    speciality: 'OPHTALMOLOGIST',
  },
  {
    id: "2",
    name: 'Catherine Bedoy',
    speciality: 'PSYCHOLOGIST',
  },
];

const colorsData = ["#FF5733", "#33FF57", "#3357FF"]

const typeDefs = `#graphql
type Doctor {
  id: String
  name: String
  speciality: SPECIALITY
  addresses: Address
}

type Address {
  streetName: String
}

enum SPECIALITY {
  PSYCHOLOGIST
  OPHTHALMOLOGIST
}

enum OPERATION {
    ADD
    SUBTRACT
    MULTIPLY
    DIVIDE
}

type Query {
  doctors(specialities: [SPECIALITY!]): [Doctor]
  doctor(id: ID!): Doctor
  calcul(a: Float, b: Float, operation: [OPERATION!]): Float
  closestColor(hex: String): String
}
`


const resolvers = {
  Query: {
    doctors: (parent, args, context, info) => {
        const {specialities} = args
        if (specialities) {
          return doctorsData.filter(d => specialities.includes(d.speciality))
        }
    },
    doctor: (parent, args, context, info) => {
      const {id} = args
      return doctorsData.find(d => d.id === id)
    },
    calcul: (parent, args, context, info) => {
      const {a, b, operation} = args
      let result = a
      operation.forEach(op => {
        switch (op) {
          case 'ADD':
            result += b
            break
          case 'SUBTRACT':
            result -= b
            break
          case 'MULTIPLY':
            result *= b
            break
          case 'DIVIDE':
            result /= b
            break
        }
      })
      return result
    },
    closestColor: (parent, args, context, info) => {
      const {hex} = args
      let closest : number = Infinity;
      let index : number;

      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)

      colorsData.forEach((c, i) => {
        const r2 = parseInt(c.slice(1, 3), 16)
        const g2 = parseInt(c.slice(3, 5), 16)
        const b2 = parseInt(c.slice(5, 7), 16)

        const distance = Math.sqrt((r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2)

        if (distance < closest) {
          closest = distance
          index = i
        }
      });
      return colorsData[index];
    }
  },
  Doctor: {
    addresses: (parent, args, context, info) => {
      console.log(parent)
      return {streetName: `${parent.id} street`}
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000}
})

console.log(`🚀  Server ready at: ${url}`)
import { gql } from "@apollo/client";

export const LIST_USER = gql`
    query ListUsers {
        listUsers {
        fullname
        email
        bouteilles {
            id
        }
        }
    }
`;

export const GET_USER = gql`
    query GetUserById($getUserByIdId: ID!) {
        getUserById(id: $getUserByIdId) {
        id
        fullname
        fullname
        email
        password
        bouteilles {
            id
        }
        }
    }
`;


export const LOGIN = gql`
  query Login($input: ILoginInput!) {
    login(input: $input) {
      user {
        email
        fullname
      }
      token
    }
  }
`;

export const CHECK_USER_CONNECT = gql`
  query Connect {
    checkUser
  }
`;

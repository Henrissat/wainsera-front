import { gql } from "@apollo/client";

export const LIST_USER = gql`
    query ListUsers {
        listUsers {
          fullname
          email
        }
    }
`;

export const GET_USER = gql`
    query GetUserById($getUserByIdId: ID!) {
        getUserById(id: $getUserByIdId) {
          id
          fullname
          email
        }
    }
`;


export const LOGIN = gql`
  query Login($input: ILoginInput!) {
    login(input: $input) {
      user {
        id
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

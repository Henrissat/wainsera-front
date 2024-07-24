import { gql } from "@apollo/client";

export const LIST_CASIER = gql`
  query ListCasier {
    casiers {
      id
      name
      rangee
      colonne
    }
  }
`;

export const GET_CASIER = gql`
  query GetCasierById($id: Int!) {
    casier(id: $id) {
      id
      name
      rangee
      colonne
    }
  }
`;

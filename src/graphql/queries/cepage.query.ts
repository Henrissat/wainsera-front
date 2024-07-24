import { gql } from "@apollo/client";

export const LIST_CEPAGE = gql`
  query ListCepage {
    cepages {
      id
      nom_cepage
    }
  }
`;

export const GET_CEPAGE = gql`
  query GetCepageById($id: Int!) {
    cepage(id: $id) {
      id
      nom_cepage
    }
  }
`;

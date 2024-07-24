import { gql } from "@apollo/client";

export const LIST_CUVEE = gql`
  query ListCuvee {
    cuvees {
      id
      nom_domaine
    }
  }
`;

export const GET_CUVEE = gql`
  query GetCuveeById($id: Int!) {
    cuvee(id: $id) {
      id
      nom_domaine
    }
  }
`;

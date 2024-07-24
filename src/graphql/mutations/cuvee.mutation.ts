import { gql } from "@apollo/client";

export const ADD_CUVEE = gql`
  mutation AddCuvee($cuvee: IAddCuvee!) {
    addCuvee(cuvee: $cuvee) {
      id
      nom_domaine
    }
  }
`;

export const UPDATE_CUVEE = gql`
  mutation UpdateCuvee($id: Int!, $cuvee: IUpdateCuvee!) {
    updateCuvee(id: $id, cuvee: $cuvee) {
      id
      nom_domaine
    }
  }
`;

export const DELETE_CUVEE = gql`
  mutation DeleteCuvee($id: Int!) {
    deleteCuvee(id: $id)
  }
`;

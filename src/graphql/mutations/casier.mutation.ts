import { gql } from "@apollo/client";

export const ADD_CASIER = gql`
  mutation AddCasier($casier: IAddCasier!) {
    addCasier(casier: $casier) {
      id
      name
      rangee
      colonne
    }
  }
`;

export const UPDATE_CASIER = gql`
  mutation UpdateCasier($id: Int!, $casier: IUpdateCasier!) {
    updateCasier(id: $id, casier: $casier) {
      id
      name
      rangee
      colonne
    }
  }
`;

export const DELETE_CASIER = gql`
  mutation DeleteCasier($id: Int!) {
    deleteCasier(id: $id)
  }
`;

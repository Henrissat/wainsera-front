import { gql } from "@apollo/client";

export const ADD_CEPAGE = gql`
  mutation AddCepage($cepage: IAddCepage!) {
    addCepage(cepage: $cepage) {
      id
      nom_cepage
    }
  }
`;

export const UPDATE_CEPAGE = gql`
  mutation UpdateCepage($id: Int!, $cepage: IUpdateCepage!) {
    updateCepage(id: $id, cepage: $cepage) {
      id
      nom_cepage
    }
  }
`;

export const DELETE_CEPAGE = gql`
  mutation DeleteCepage($id: Int!) {
    deleteCepage(id: $id)
  }
`;

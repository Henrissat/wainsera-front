import { gql } from "@apollo/client";

export const LIST_VIN = gql`
  query ListVin {
    vins {
      id
      couleur
    }
  }
`;

export const GET_VIN = gql`
  query GetVinById($id: Int!) {
    vin(id: $id) {
      id
      couleur
    }
  }
`;

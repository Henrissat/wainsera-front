import { gql } from "@apollo/client";

export const ADD_VIN = gql`
  mutation AddVin($vin: IAddVin!) {
    addVin(vin: $vin) {
      id
      couleur
    }
  }
`;

export const UPDATE_VIN = gql`
  mutation UpdateVin($id: Int!, $vin: IUpdateVin!) {
    updateVin(id: $id, vin: $vin) {
      id
      couleur
    }
  }
`;

export const DELETE_VIN = gql`
  mutation DeleteVin($id: Int!) {
    deleteVin(id: $id)
  }
`;

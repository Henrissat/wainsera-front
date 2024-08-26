import { gql } from "@apollo/client";

export const ADD_REGION = gql`
  mutation AddRegion($region: IAddRegion!) {
    addRegion(region: $region) {
      id
      nom_region
      min_garde
      max_garde
      pays {
        id
        nom_pays
      }
    }
  }
`;

export const UPDATE_REGION = gql`
  mutation UpdateRegion($id: Int!, $region: IUpdateRegion!) {
    updateRegion(id: $id, region: $region) {
      id
      nom_region
      min_garde
      max_garde
      pays {
        id
        nom_pays
      }
    }
  }
`;

export const DELETE_REGION = gql`
  mutation DeleteRegion($id: Int!) {
    deleteRegion(id: $id)
  }
`;

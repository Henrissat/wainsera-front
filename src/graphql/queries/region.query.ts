import { gql } from "@apollo/client";

export const LIST_REGION = gql`
  query ListRegion {
    regions {
      id
      nom_region
      pays {
        id
        nom_pays
      }
    }
  }
`;

export const GET_REGION = gql`
  query GetRegionById($id: Int!) {
    region(id: $id) {
      id
      nom_region
      pays {
        id
        nom_pays
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const LIST_BOUTEILLE = gql`
  query Query {
    bouteilles {
      id
      millesime
      alcool
      quantite
      cuvee {
        nom_domaine
      }
      vin {
        couleur
      }
      cepages {
        nom_cepage
      }
      region {
        nom_region
        pays {
          nom_pays
        }
      }
      casier {
        name
        rangee
        colonne
      }
    }
  }
`;

export const GET_BOUTEILLE = gql`
query GetBouteilleById($getBouteilleByIdId: Float!) {
  getBouteilleById(id: $getBouteilleByIdId) {
    id
    millesime
    alcool
    quantite
    cuvee {
      nom_domaine
    }
    vin {
      couleur
    }
    cepages {
      nom_cepage
    }
    region {
      nom_region
      pays {
        nom_pays
      }
    }
    casier {
      name
      colonne
      rangee
    }
  }
}
`
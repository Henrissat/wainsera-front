import { gql } from "@apollo/client";

export const LIST_BOUTEILLE = gql`
  query Query {
    bouteilles {
      id
      millesime
      alcool
      quantite
      note
      note_perso
      bouche
      accord
      garde_apogee
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
        min_garde
        max_garde
        pays {
          nom_pays
        }
      }
      casier {
        name
        rangee
        colonne
      }
      user {
        id
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
    note
    note_perso
    bouche
    accord
    garde_apogee
    cuvee {
      nom_domaine
    }
    vin {
      id
      couleur
    }
    cepages {
      id
      nom_cepage
    }
    region {
      id
      nom_region
      min_garde
      max_garde
    }
    casier {
      id
      name
      colonne
      rangee
    }
    user {
      id
    }
  }
}
`
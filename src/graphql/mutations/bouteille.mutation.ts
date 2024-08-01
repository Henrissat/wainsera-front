import { gql } from "@apollo/client";


export const ADD_BOUTEILLE = gql`
    mutation AddBouteille($bouteille: IAddBouteille!) {
        addBouteille(bouteille: $bouteille) {
            alcool
            cepages {
                nom_cepage
            }
            cuvee {
                nom_domaine
            }
            millesime
            quantite
            vin {
                id
                couleur
            }
            region {
                id
                nom_region
                pays {
                id
                nom_pays
                }
            }
        }
    }
  
`

export const UPDATE_BOUTEILLE = gql`
  mutation UpdateBouteille($id: Int!, $bouteille: IAddBouteille!) {
    updateBouteille(id: $id, bouteille: $bouteille) {
      alcool
      cepages {
        nom_cepage
      }
      cuvee {
        nom_domaine
      }
      millesime
      quantite
      vin {
        id
        couleur
      }
      region {
        id
        nom_region
        pays {
          id
          nom_pays
        }
      }
    }
  }
`;

export const DELETE_BOUTEILLE = gql`
    mutation DeleteBouteille($id: Float!) {
        deleteBouteille(id: $id)
    }
`
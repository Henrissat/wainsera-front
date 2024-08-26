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
            note
            note_perso
            bouche
            accord
            garde_apogee
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
  mutation UpdateBouteille($bouteille: IUpdateBouteille!) {
    updateBouteille(bouteille: $bouteille) {
      id
      cuvee {
        nom_domaine
        id
      }
      cepages {
        nom_cepage
        id
      }
      millesime
      quantite
      note
      note_perso
      bouche
      accord
      garde_apogee
      region {
        id
        nom_region
      }
      vin {
        id
        couleur
      }
    }
  }
`;

export const DELETE_BOUTEILLE = gql`
    mutation DeleteBouteille($id: Float!) {
        deleteBouteille(id: $id)
    }
`
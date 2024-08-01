import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LIST_BOUTEILLE } from "../graphql/queries/bouteille.query";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import './home.css';
import AddBouteilleForm from "./utils/FormAddWine";
import { DELETE_BOUTEILLE } from "../graphql/mutations/bouteille.mutation";

interface ICepage {
  nom_cepage: string;
}

interface IRegion {
  nom_region: string;
}

interface ICuvee {
  nom_domaine: string;
}

interface IBouteille {
  id: number;
  millesime?: number;
  alcool?: number;
  quantite?: number;
  vin: {
    couleur: string;
  };
  cuvee?: ICuvee;
  
  cepages: ICepage[];
  region?: IRegion;
}

function Home() {
  const { loading, error, data, refetch } = useQuery(LIST_BOUTEILLE);
  const [deleteBouteille] = useMutation(DELETE_BOUTEILLE);
  const [selectedBouteille, setSelectedBouteille] = useState<number | null>(null);

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Une erreur s'est produite: {error.message}</div>;

  // Regrouper les bouteilles par couleur de vin, puis par région
  const groupedByColorAndRegion: { [color: string]: { [region: string]: IBouteille[] } } = {};

  data.bouteilles.forEach((b: IBouteille) => {
    const color = b.vin.couleur;
    const region = b.region ? b.region.nom_region : "Non spécifiée";

    if (!groupedByColorAndRegion[color]) {
      groupedByColorAndRegion[color] = {};
    }
    if (!groupedByColorAndRegion[color][region]) {
      groupedByColorAndRegion[color][region] = [];
    }
    groupedByColorAndRegion[color][region].push(b);
  });

  const handleUpdate = async (id: number) => {
    setSelectedBouteille(id);

  };

  const handleDelete = async (id: number) => {
    console.log("Suppression de la bouteille :", id);
    try {
      await deleteBouteille({ variables: { id } });
      refetch();
    } catch (e) {
      console.error("Erreur lors de la suppression de la bouteille :", e);
    }
  };

  return (
    <>
      <h1>Bouteilles</h1>
      <AddBouteilleForm />
      <div className="container-list">
        {Object.keys(groupedByColorAndRegion).map((color) => (
          <div key={color}>
            <h2>{color}</h2>
            {Object.keys(groupedByColorAndRegion[color]).map((region) => (
              <div key={region}>
                <h3>{region}</h3>
                <ul>
                  <li className="row-wine header-row">
                    <div>Domaine:</div>
                    <div>Millésime:</div>
                    <div>Alcool:</div>
                    <div>Quantité:</div>
                    <div>Cépages:</div>
                    <div></div> {/* Pour le bouton de suppression */}
                  </li>
                  {groupedByColorAndRegion[color][region].map((b) => (
                    <li key={b.id}>
                      <div className="row-wine">
                        <div>{b.cuvee?.nom_domaine}</div>
                        <div>{b.millesime}</div>
                        <div>{b.alcool}%</div>
                        <div>{b.quantite}</div>
                        <div className="list-cepages">
                          {b.cepages.map((cepage) => cepage.nom_cepage).join(', ')}
                        </div>
                        <div>
                          <button
                            className="delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDelete(b.id);
                            }}
                          >
                            <DeleteOutlineIcon />
                          </button>
                          <button
                            className="update-button"
                            onClick={() => handleUpdate(b.id)}
                          >
                            <span><CreateOutlinedIcon/></span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BOUTEILLE, LIST_BOUTEILLE } from "../graphql/queries/bouteille.query";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import './home.css';
import AddBouteilleForm from "./utils/FormAddWine";
import UpdateBouteilleForm from "./utils/FormUpdateWine";
import { DELETE_BOUTEILLE, UPDATE_BOUTEILLE } from "../graphql/mutations/bouteille.mutation";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface ICepage {
  nom_cepage?: string;
}

interface IRegion {
  nom_region?: string;
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
  const [updateBouteille] = useMutation(UPDATE_BOUTEILLE);
  const [selectedBouteille, setSelectedBouteille] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: bouteilleData } = useQuery(GET_BOUTEILLE, {
    variables: { getBouteilleByIdId: selectedBouteille || 0 },
    skip: selectedBouteille === null,
  });

  const handleUpdate = (id: number) => {
    setSelectedBouteille(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBouteille(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBouteille({ variables: { id } });
      refetch();
    } catch (e) {
      console.error("Erreur lors de la suppression de la bouteille :", e);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (!selectedBouteille) return;

    const variables = {
      bouteille: {
        id: selectedBouteille,
        millesime: formData.millesime ? parseInt(formData.millesime, 10) : null,
        alcool: formData.alcool ? parseFloat(formData.alcool) : null,
        quantite: formData.quantite ? parseInt(formData.quantite, 10) : null,
        vinId: formData.vinId ? parseInt(formData.vinId, 10) : null,
        regionId: formData.regionId ? parseInt(formData.regionId, 10) : null,
        cepageIds: formData.cepageIds ? formData.cepageIds.map((id: string) => parseInt(id, 10)) : [],
        cuveeNom: formData.cuveeNom || null
      }
    };

    console.log("Variables envoyées à la mutation :", variables);

    try {
      await updateBouteille({ variables });
      refetch();
      handleCloseModal();
    } catch (e) {
      console.error("Erreur lors de la mise à jour de la bouteille :", e);
    }
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Une erreur s'est produite: {error.message}</div>;

  const groupedByColorAndRegion: { [color: string]: { [region: string]: IBouteille[] } } = {};

  data.bouteilles.forEach((b: IBouteille) => {
    const color = b.vin?.couleur || "Non spécifié";
    const region = b.region?.nom_region || "Non spécifiée";

    if (!groupedByColorAndRegion[color]) {
      groupedByColorAndRegion[color] = {};
    }
    if (!groupedByColorAndRegion[color][region]) {
      groupedByColorAndRegion[color][region] = [];
    }
    groupedByColorAndRegion[color][region].push(b);
  });

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
                    <div></div>
                  </li>
                  {groupedByColorAndRegion[color][region].map((b) => (
                    <li key={b.id}>
                      <div className="row-wine">
                        <div>{b.cuvee?.nom_domaine || "Non spécifié"}</div>
                        <div>{b.millesime || "Non spécifié"}</div>
                        <div>{b.alcool ? `${b.alcool}%` : "Non spécifié"}</div>
                        <div>{b.quantite || "Non spécifiée"}</div>
                        <div className="list-cepages">
                          {b.cepages?.map((cepage) => cepage.nom_cepage).join(', ') || "Non spécifié"}
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
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Modifier la Bouteille</DialogTitle>
        <DialogContent>
          {selectedBouteille && bouteilleData && bouteilleData.getBouteilleById && (
            <UpdateBouteilleForm
              bouteille={bouteilleData.getBouteilleById}
              onSubmit={handleFormSubmit}
              onClose={handleCloseModal}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;

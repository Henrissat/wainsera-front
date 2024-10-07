import React, { useState } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { useQuery, useMutation } from "@apollo/client";
import { GET_BOUTEILLE } from "../graphql/queries/bouteille.query";
import { DELETE_BOUTEILLE, UPDATE_BOUTEILLE } from "../graphql/mutations/bouteille.mutation";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "../components/utils/StarRating";
import WineBottleImage from "../assets/wine.jpg";
import './wine.css';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import UpdateBouteilleForm from "../components/utils/FormUpdateWine";
import { toast } from "react-toastify";

interface ICepage {
  id: number;
  nom_cepage: string;
}

interface IBouteille {
  id: number;
  millesime?: number;
  alcool?: number;
  quantite?: number;
  note?: number;
  note_perso?: number;
  bouche?: string;
  accord?: string;
  garde_apogee?: number;
  cuvee: {
    id: number;
    nom_domaine: string;
  };
  cepages: ICepage[];
  region?: {
    id: number;
    nom_region: string;
    min_garde?: number;
    max_garde?: number;
    pays: {
      id: number;
      nom_pays: string;
    };
  };
  vin: {
    id: number;
    couleur: string;
  };
  casier?: {
    id: number;
    name?: string;
    rangee?: number;
    colonne?: number;
  };
}

function Wine() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_BOUTEILLE, {
    variables: { getBouteilleByIdId: id ? parseInt(id, 10) : null },
    skip: !id,
  });

  const [deleteBouteille] = useMutation(DELETE_BOUTEILLE);
  const [updateBouteille] = useMutation(UPDATE_BOUTEILLE);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const bouteille: IBouteille | null = data?.getBouteilleById || null;

  if (!bouteille) {
    return <div>Aucune donnée disponible pour cette bouteille.</div>;
  }

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette bouteille ?");
    if (!confirmation) return;

    try {
      await deleteBouteille({ variables: { id } });
      toast.success("Bouteille supprimée avec succès !");
      navigate("/"); // Redirige vers la page d'accueil après la suppression
    } catch (e) {
      console.error("Erreur lors de la suppression de la bouteille :", e);
      toast.error("Erreur lors de la suppression de la bouteille.");
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!bouteille?.id) return;

    const variables = {
      bouteille: {
        id: bouteille.id,
        millesime: formData.millesime ? parseInt(formData.millesime, 10) : null,
        alcool: formData.alcool ? parseFloat(formData.alcool) : null,
        quantite: formData.quantite ? parseInt(formData.quantite, 10) : null,
        note: formData.note ? parseFloat(formData.note) : null,
        note_perso: formData.note_perso ? parseFloat(formData.note_perso) : null,
        bouche: formData.bouche || null,
        accord: formData.accord || null,
        vinId: formData.vinId ? parseInt(formData.vinId, 10) : null,
        regionId: formData.regionId ? parseInt(formData.regionId, 10) : null,
        cepageIds: formData.cepageIds ? formData.cepageIds.map((id: string) => parseInt(id, 10)) : [],
        cuveeNom: formData.cuveeNom || null,
        casierId: formData.casierId ? parseInt(formData.casierId, 10) : null,
      },
    };

    try {
      await updateBouteille({ variables });
      toast.success("Bouteille mise à jour avec succès !");
      refetch(); // Rechargement des données après la mise à jour
      setIsModalOpen(false);
    } catch (e) {
      console.error("Erreur lors de la mise à jour de la bouteille :", e);
      toast.error("Erreur lors de la mise à jour de la bouteille.");
    }
  };

  const bannerClass = `banner ${bouteille.vin.couleur === "Rouge" ? "banner-red" 
                   : bouteille.vin.couleur === "Blanc" ? "banner-yellow" 
                   : "banner-pink"}`;

  let apogee;
  if (bouteille.garde_apogee !== null) {
    apogee = bouteille.garde_apogee;
  } else {
    const apogeeMin = bouteille.region?.min_garde || 0;
    const apogeeMax = bouteille.region?.max_garde || 0;
    const apogeeMoyenne = Math.floor((apogeeMin + apogeeMax) / 2);
    apogee = bouteille.millesime ? apogeeMoyenne + bouteille.millesime : apogeeMoyenne;
  }

  return (
    <>
      <div className="wine-header">
        <div className={bannerClass}>
          <div className="container-banner">
            <div className="wine-image">
              <img src={WineBottleImage} alt="Bouteille de vin" />
            </div>
            <div className="wine-info">
              <div className="wine-actions">
                <DeleteOutlineIcon onClick={() => handleDelete(bouteille.id)} />
                <div className="separator-vertical"></div>
                <CreateOutlinedIcon onClick={() => setIsModalOpen(true)} />
              </div>
              <div>
                <StarRating rating={bouteille.note || 0} />
                <span>{bouteille.note || ""}</span>
              </div>
              <h2 className="wine-title">{bouteille.cuvee.nom_domaine}</h2>
              <div className="wine-header-content">
                <div><strong>Vin : </strong> {bouteille.vin.couleur}</div>
                <div><strong>Millésime : </strong> {bouteille.millesime}</div>
                <div><strong>Quantité : </strong> {bouteille.quantite}</div>
                <div><strong>Note personnelle :</strong> <StarRating rating={bouteille.note_perso || 0} /><span> {bouteille.note_perso || "Non notée"}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-details">
          <div className="wine-details">
            <h3>Détails du vin</h3>
            <div className="wine-details-content">
              <div>
                <div><strong>Région :</strong> {bouteille.region?.nom_region || "Non spécifiée"}</div>
                <div><strong>Cépages :</strong> {bouteille.cepages.map((c) => c.nom_cepage).join(', ')}</div>
                <div><strong>Garde apogée :</strong> {apogee || "Non spécifié"}</div>
                <div><strong>Alcool :</strong> {bouteille.alcool ? `${bouteille.alcool}%` : "Non spécifié"}</div>
              </div>
              <div className="separator-vertical"></div>
              <div>
                <div><strong>Bouche :</strong> {bouteille.bouche || "Non spécifié"}</div>
                <div><strong>Accord :</strong> {bouteille.accord || "Non spécifié"}</div>
                <div><strong>Casier :</strong> {bouteille.casier?.name || "Non spécifié"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal pour mise à jour de la bouteille */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>Modifier la bouteille</DialogTitle>
          <DialogContent>
            <UpdateBouteilleForm
              bouteille={bouteille}
              onSubmit={handleUpdate}
              onClose={() => setIsModalOpen(false)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} color="primary">
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default Wine;

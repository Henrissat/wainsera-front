import { useState } from "react";
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
import { toast } from "react-toastify";
import { useLogin } from "../context/LoginProvider";

interface ICepage {
  nom_cepage?: string;
}

interface IRegion {
  nom_region?: string;
  min_garde?: number;
  max_garde? : number;
}

interface ICuvee {
  nom_domaine: string;
}

interface IBouteille {
  id: number;
  millesime?: number;
  alcool?: number;
  quantite?: number;
  note?:number;
  note_perso?:number;
  bouche?: string;
  accord?: string;
  garde_apogee?: number;
  vin: {
    couleur: string;
  };
  cuvee?: ICuvee;
  
  cepages: ICepage[];
  region?: IRegion;
  casier?: {
    name?: string;
    rangee?: number;
    colonne?: number;
  }
  user: {
    id: string
  }
}

function Home() {

  const { userLog } = useLogin();  
  const userId = userLog?.user.id;  
  console.log("login user", userLog);

  const { loading, error, data, refetch } = useQuery(LIST_BOUTEILLE);
  const [deleteBouteille] = useMutation(DELETE_BOUTEILLE);
  const [updateBouteille] = useMutation(UPDATE_BOUTEILLE);
  const [selectedBouteille, setSelectedBouteille] = useState<number | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState<boolean>(false); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data: bouteilleData } = useQuery(GET_BOUTEILLE, {
    variables: { getBouteilleByIdId: selectedBouteille || 0 },
    skip: selectedBouteille === null,
  });

  const filteredBouteilles = data?.bouteilles.filter((b: IBouteille) => b.user.id === userId) || [];

  const handleUpdate = (id: number) => {
    setSelectedBouteille(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBouteille(null);
  };

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm("Etes-vous sur de vouloir supprimer cette bouteille ?");

    if(!confirmation) return;
    
    try {
      await deleteBouteille({ variables: { id } });
      refetch();
      toast.success("Bouteille supprimée avec succès !"); 
    } catch (e) {
      toast.error("Erreur lors de la suppression de la bouteille."); 
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
        note: formData.note ? parseInt(formData.note, 10) : null,
        note_perso: formData.note_perso ? parseInt(formData.note_perso, 10) : null,
        bouche: formData.bouche || null,
        accord: formData.accord || null,
        vinId: formData.vinId ? parseInt(formData.vinId, 10) : null,
        regionId: formData.regionId ? parseInt(formData.regionId, 10) : null,
        cepageIds: formData.cepageIds ? formData.cepageIds.map((id: string) => parseInt(id, 10)) : [],
        cuveeNom: formData.cuveeNom || null,
        casierId: formData.casierId ? parseInt(formData.casierId, 10) : null,
        userId: formData.userId? parseInt(formData.userId, 10) : null
      }
    };

    console.log("Form Data:", formData);

    try {
      await updateBouteille({ variables });
      refetch();
      toast.success("Bouteille mise à jour avec succès !"); 
      handleCloseModal();
    } catch (e) {
      console.error("Erreur lors de la mise à jour de la bouteille :", e);
      toast.error("Erreur lors de la mise à jour de la bouteille."); 
    }
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Une erreur s'est produite: {error.message}</div>;

  const groupedByColorAndRegion: { [color: string]: { [region: string]: IBouteille[] } } = {};

  filteredBouteilles.forEach((b: IBouteille) => {
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

  const handleRowClick = (id: number) => {
    // Actions lorsque la ligne est cliquée (par exemple, navigation ou sélection)
    console.log(`Ligne cliquée avec l'ID: ${id}`);
  };
  

  return (
    <>
      <h1>Ma cave à vin</h1>

      <Button
        onClick={() => setIsAddFormVisible(!isAddFormVisible)} 
        startIcon={<AddCircleOutlineIcon />}
      >
        {isAddFormVisible ? "Fermer le formulaire d'ajout" : "Ajouter une bouteille"}
      </Button>

      {isAddFormVisible && <AddBouteilleForm />}

      <div className="container-list">
        {Object.keys(groupedByColorAndRegion).map((color) => (
          <div key={color} className="list">
            <h2>{color}</h2>
            {Object.keys(groupedByColorAndRegion[color]).map((region) => (
              <div key={region}>
                <h3>{region}</h3>
                <div className="separator_horizontal"></div>
                <ul>
                  <li className="row-wine header-row">
                    <div>Domaine</div>
                    <div>Millésime</div>
                    <div className="sml-disabled">Alcool</div>
                    <div>Quantité</div>
                    <div className="sml-disabled">Note</div>
                    <div className="xsml-disabled">Apogée</div>
                    <div></div>
                  </li>
                  {groupedByColorAndRegion[color][region].map((b) => {
                    let apogee
                    if(b.garde_apogee !== null) {
                      apogee = b.garde_apogee;
                    }else {
                      const apogeeMin = b.region?.min_garde || 0;
                      const apogeeMax = b.region?.max_garde || 0;
                      const apogeeMoyenne = Math.floor((apogeeMin + apogeeMax) / 2);
                      apogee = b.millesime ? apogeeMoyenne + b.millesime : null;
                    }
                    
                    return (
                      <li key={b.id}>
                        <div
                          className="row-wine clickable-row"
                          onClick={() => handleRowClick(b.id)}
                        >
                          <div>{b.cuvee?.nom_domaine || "Non spécifié"}</div>
                          <div>{b.millesime || "Non spécifié"}</div>
                          <div className="sml-disabled">{b.alcool ? `${b.alcool}%` : "Non spécifié"}</div>
                          <div>{b.quantite || "Non spécifiée"}</div>
                          <div className="sml-disabled">{b.note ? `${b.note}/5` : "?"}</div>
                          <div className="xsml-disabled">{apogee}</div> 
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
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleUpdate(b.id);
                              }}
                            >
                              <CreateOutlinedIcon />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onClose={handleCloseModal} className="custom-modal">
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

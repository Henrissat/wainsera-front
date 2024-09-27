import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ADD_BOUTEILLE } from "../../graphql/mutations/bouteille.mutation";
import { LIST_VIN } from "../../graphql/queries/vin.query";
import { LIST_CEPAGE } from "../../graphql/queries/cepage.query";
import { LIST_REGION } from "../../graphql/queries/region.query";
import { LIST_CASIER } from "../../graphql/queries/casier.query";
import './FormAddWine.css';
import { useLogin } from "../../context/LoginProvider";


// Définition des types pour les options
interface OptionType {
  value: number;
  label: string;
}

interface ICepage {
  id: number;
  nom_cepage: string;
}

interface IRegion {
  id: number;
  nom_region: string;
  pays: {
    id: number;
    nom_pays: string;
  };
}

interface IVin {
  id: number;
  couleur: string;
}

interface ICasier {
  id: number;
  name?: string;
  rangee?: number;
  colonne?: number;
}

interface OptionType {
  value: number;
  label: string; // Assurez-vous que label est toujours une chaîne de caractères
}

interface IFormInput {
  id: number;
  millesime: number;
  alcool: number;
  quantite: number;
  note?: number;
  note_perso?: number;
  bouche?: string;
  accord?: string;
  cepageIds: number[];
  vinId?: number;
  regionId?: number;
  cuveeNom: string;
  casierId?: number;
}

interface AddBouteilleFormProps {
  onSuccess: () => void;
}

function AddBouteilleForm({ onSuccess }: AddBouteilleFormProps) {
  const { register, handleSubmit, control, reset } = useForm<IFormInput>();
  const [addBouteille, { data, loading, error }] = useMutation(ADD_BOUTEILLE);
  const { userLog } = useLogin();  
  const userId = userLog?.user.id;  

  const { data: vinData } = useQuery<{ vins: IVin[] }>(LIST_VIN);
  const { data: cepageData } = useQuery<{ cepages: ICepage[] }>(LIST_CEPAGE);
  const { data: regionData } = useQuery<{ regions: IRegion[] }>(LIST_REGION);
  const { data: casierData } = useQuery<{ casiers: ICasier[] }>(LIST_CASIER);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    console.log(formData);
    const bouteilleData = {
      millesime: formData.millesime ? Number(formData.millesime) : null,
      alcool: formData.alcool ? Number(formData.alcool) : null,
      quantite: formData.quantite ? Number(formData.quantite) : null,
      note: formData.note ? Number(formData.note) : null,
      note_perso: formData.note_perso ? Number(formData.note_perso) : null,
      bouche: formData.bouche,
      accord: formData.accord,
      cepageIds: formData.cepageIds ? formData.cepageIds.map(id => Number(id)) : [],
      vinId: formData.vinId ? Number(formData.vinId) : null,
      regionId: formData.regionId ? Number(formData.regionId) : null,
      cuveeNom: formData.cuveeNom,
      casierId: formData.casierId ? Number(formData.casierId) : null,
      userId: userId
    };
  console.log(bouteilleData)
    try {
      await addBouteille({
        variables: {
          bouteille: bouteilleData
        }
      });
      reset();
      onSuccess(); 
    } catch (e) {
      console.error("Erreur lors de l'ajout de la bouteille :", e);
    }
  };

  const vinOptions: OptionType[] = vinData?.vins.map(vin => ({
    value: vin.id,
    label: vin.couleur
  })) || [];

  const cepageOptions: OptionType[] = cepageData?.cepages.map(cepage => ({
    value: cepage.id,
    label: cepage.nom_cepage
  })) || [];

  const regionOptions: OptionType[] = regionData?.regions.map(region => ({
    value: region.id,
    label: `${region.nom_region} - ${region.pays.nom_pays}`
  })) || [];

  const casierOptions: OptionType[] = casierData?.casiers.map(casier => ({
    value: casier.id,
    label: `${casier.name} - Rangee ${casier.rangee} - Colonne ${casier.colonne}` || "Nom inconnu" // Fournit une valeur par défaut si casier.name est undefined
  })) || [];


  return (
    <form className="formAddWine" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <div>
          <label>Nom du Domaine </label>
          <input {...register("cuveeNom", { required: true })} type="text" className="input" style={{minWidth: "300px"}}/>
        </div>
      </div>
      <div className="form-group">
        <div>
          <label>Millésime </label>
          <input {...register("millesime", { required: true })} type="number" className="input" style={{maxWidth: "90px"}}/>
        </div>
        <div>
          <label>Alcool (%) </label>
          <input {...register("alcool", { required: true })} type="number" step="0.1" className="input" style={{maxWidth: "50px"}}/>
        </div>
        <div>
          <label>Quantité </label>
          <input {...register("quantite", { required: true })} type="number" className="input" style={{maxWidth: "50px"}}/>
        </div>
        <div className="label-flex">
          <label>Type de vin </label>
          <Controller
            name="vinId"
            control={control}
            render={({ field }) => (
              <Select
                options={vinOptions}
                className="vin-select"
                onChange={(option: OptionType | null) => {
                  field.onChange(option ? option.value : null);
                }}
                value={vinOptions.find(option => option.value === field.value)}
              />
            )}
          />
        </div>
      </div>
      <div className="form-group">
        <div className="label-flex">
          <label>Cépages</label>
          <Controller
            name="cepageIds"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                isMulti
                options={cepageOptions}
                className="cepage-select"
                onChange={(selectedOptions) => {
                  const selectedIds = (selectedOptions as OptionType[]).map(option => option.value);
                  field.onChange(selectedIds);
                }}
                value={cepageOptions.filter(option => field.value.includes(option.value))}

              />
            )}
          />
        </div>
        <div className="label-flex">
          <label>Région - Pays</label>
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <Select
                options={regionOptions}
                className="region-select"
                onChange={(option: OptionType | null) => {
                  field.onChange(option ? option.value : null);
                }}
                value={regionOptions.find(option => option.value === field.value)}
              />
            )}
          />
        </div>
      </div>
      <div className="separator-horizontal"></div>
      <div className="form-group">
        <div>
          <label>Note </label>
          <input {...register("note")} type="number" step="0.1" className="input" style={{maxWidth: "90px"}}/>
        </div>
        <div>
          <label>Note perso </label>
          <input {...register("note_perso")} type="number" step="0.1" className="input" style={{maxWidth: "90px"}}/>
        </div>
      </div>
      <div className="form-group">
        <div>
          <label>Bouche </label>
          <input {...register("bouche")} type="text" className="input" style={{minWidth: "300px"}}/>
        </div>
        <div>
          <label>Accord </label>
          <input {...register("accord")} type="text" className="input" style={{minWidth: "300px"}}/>
        </div>
      </div>
      <div className="separator-horizontal"></div>
      <div className="form-group">
        <div className="label-flex">
          <label>Rangement</label>
          <Controller
            name="casierId"
            control={control}
            render={({ field }) => (
              <Select
                options={casierOptions}
                className="region-select"
                onChange={(option: OptionType | null) => {
                  field.onChange(option ? option.value : null);
                }}
                value={casierOptions.find(option => option.value === field.value)}
              />
            )}
          />
        </div>
      </div>
      <button type="submit" className="add-button">
        <AddCircleOutlineIcon /> <span style={{marginLeft: "5px"}}>Ajouter le vin</span>
      </button>
      {loading && <p>Ajout en cours...</p>}
      {error && <p>Erreur: {error.message}</p>}
      {data && <p>Bouteille ajoutée avec succès!</p>}
    </form>
  );
}

export default AddBouteilleForm;
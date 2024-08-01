import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ADD_BOUTEILLE } from "../../graphql/mutations/bouteille.mutation";
import { LIST_VIN } from "../../graphql/queries/vin.query";
import { LIST_CEPAGE } from "../../graphql/queries/cepage.query";
import { LIST_REGION } from "../../graphql/queries/region.query";
import './FormAddWine.css';


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

interface IFormInput {
  millesime: number;
  alcool: number;
  quantite: number;
  cepageIds: number[];
  vinId: number;
  regionId: number;
  cuveeNom: string;
}

function AddBouteilleForm() {
  const { register, handleSubmit, control, reset } = useForm<IFormInput>();
  const [addBouteille, { data, loading, error }] = useMutation(ADD_BOUTEILLE);

  const { data: vinData } = useQuery<{ vins: IVin[] }>(LIST_VIN);
  const { data: cepageData } = useQuery<{ cepages: ICepage[] }>(LIST_CEPAGE);
  const { data: regionData } = useQuery<{ regions: IRegion[] }>(LIST_REGION);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      await addBouteille({
        variables: {
          bouteille: {
            millesime: formData.millesime ? Number(formData.millesime) : null,
            alcool: formData.alcool ? Number(formData.alcool) : null,
            quantite: formData.quantite ? Number(formData.quantite) : null,
            cepageIds: formData.cepageIds ? formData.cepageIds.map(id => Number(id)) : [],
            vinId: formData.vinId ? Number(formData.vinId) : null,
            regionId: formData.regionId ? Number(formData.regionId) : null,
            cuveeNom: formData.cuveeNom,
          }
        }
      });
      reset();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <div>
          <label>Nom du Domaine </label>
          <input {...register("cuveeNom", { required: true })} type="text" className="input" style={{minWidth: "300px"}}/>
        </div>
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
      </div>
      <div className="form-group group-type">
        <div>
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
        <div>
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
        <div>
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
      <button type="submit" className="add-button">
        <AddCircleOutlineIcon />Enregistrer 
      </button>
      {loading && <p>Ajout en cours...</p>}
      {error && <p>Erreur: {error.message}</p>}
      {data && <p>Bouteille ajoutée avec succès!</p>}
    </form>
  );
}

export default AddBouteilleForm;
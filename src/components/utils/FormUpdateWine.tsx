import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { useQuery } from "@apollo/client";
import { LIST_VIN } from "../../graphql/queries/vin.query";
import { LIST_CEPAGE } from "../../graphql/queries/cepage.query";
import { LIST_REGION } from "../../graphql/queries/region.query";
import { LIST_CASIER } from "../../graphql/queries/casier.query";

import './FormUpdateWine.css';

interface OptionType {
  value: number;
  label: string;
}

interface IRegion {
  id: number;
  nom_region: string;
  pays: {
    id: number;
    nom_pays?: string;
  } | null; 
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

interface ICepage {
  id: number;
  nom_cepage: string;
}

interface ICuvee {
  id: number;
  nom_domaine: string;
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
  vin: {
    id: number;
    couleur: string;
  };
  cuvee?: ICuvee;
  cepages?: ICepage[];
  region?: IRegion;
  casierId?: ICasier;
  casier?: ICasier;              
}

interface IUpdateBouteilleFormProps {
  bouteille: IBouteille;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const UpdateBouteilleForm: React.FC<IUpdateBouteilleFormProps> = ({ bouteille, onSubmit }) => {
  const [vinOptions, setVinOptions] = useState<OptionType[]>([]);
  const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);
  const [cepageOptions, setCepageOptions] = useState<OptionType[]>([]);
  const [casierOptions, setCasierOptions] = useState<OptionType[]>([]);
  const [success, setSuccess] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);

  const { data: vinData } = useQuery<{ vins: IVin[] }>(LIST_VIN);
  const { data: cepageData } = useQuery<{ cepages: ICepage[] }>(LIST_CEPAGE);
  const { data: regionData } = useQuery<{ regions: IRegion[] }>(LIST_REGION);
  const { data: casierData } = useQuery<{ casiers: ICasier[] }>(LIST_CASIER);

  console.log(bouteille);

  
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      millesime: bouteille.millesime ?? '',
      alcool: bouteille.alcool ?? '',
      quantite: bouteille.quantite ?? '',
      note: bouteille.note ?? '',
      note_perso: bouteille.note_perso ?? '',
      bouche: bouteille.bouche ?? '',
      accord: bouteille.accord ?? '',
      cepageIds: bouteille.cepages ? bouteille.cepages.map(cepage => cepage.id) : [],
      vinId: bouteille.vin?.id ?? '',
      regionId: bouteille.region?.id ?? '',
      cuveeNom: bouteille.cuvee?.nom_domaine ?? '',
      casierId: bouteille.casierId?.id ?? ''     

    }
  });

  useEffect(() => {

    if (casierData && casierData.casiers) {
      const casierOptions = casierData.casiers.map(casiers => ({
        value: casiers.id,
        label: `${casiers.name} - Rangee ${casiers.rangee} - Colonne ${casiers.colonne}`
      }));
      setCasierOptions(casierOptions);
    } else {
      console.error("casierData.casiers is undefined");
    }


    if (vinData) {
      const vins = vinData.vins.map(vin => ({ value: vin.id, label: vin.couleur }));
      setVinOptions(vins);
    } else {
      console.error("casierData.casier is undefined");
    }

    if (cepageData) {
      const cepages = cepageData.cepages.map(cepage => ({ value: cepage.id, label: cepage.nom_cepage }));
      setCepageOptions(cepages);
    } else {
      console.error("cepageData.cepages is undefined");
    }

    if (regionData) {
      const regions = regionData.regions.map(region => ({
        value: region.id,
        label: region.nom_region + (region.pays ? ` (${region.pays.nom_pays})` : '')
      }));
      setRegionOptions(regions);
    }

    if (bouteille.casier) {
      setValue("casierId", bouteille.casier.id);
    }

    console.log("casierid", bouteille.casier?.id);

    if (bouteille.cepages) {
      const cepageIds = bouteille.cepages.map(cepage => cepage.id);
      setValue("cepageIds", cepageIds);
    }

    if (bouteille.vin) {
      setValue("vinId", bouteille.vin.id);
    }

    if (bouteille.region) {
      setValue("regionId", bouteille.region.id);
    }

    setValue("cuveeNom", bouteille.cuvee?.nom_domaine ?? '');
  }, [bouteille, vinData, cepageData, regionData, casierData, setValue]);
  
  const handleFormSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const updatedFormData = {
      ...formData,
      alcool: typeof formData.alcool === 'string' ? parseFloat(formData.alcool.replace(',', '.')) : formData.alcool,
      note: typeof formData.note === 'string' ? parseFloat(formData.note.replace(',', '.')) : formData.note,
      note_perso: typeof formData.note_perso === 'string' ? parseFloat(formData.note_perso.replace(',', '.')) : formData.note_perso,
    };

    try {
      await onSubmit(updatedFormData);
      setSuccess(true);
    } catch (e) {
      setError("Erreur lors de la mise à jour de la bouteille.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error occurred: {error}</p>;
  if (success) return <p>Wine updated successfully!</p>;

  return (
    <form className="formAUpdateWine" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="form-group">
        <div>
          <label>Nom du domaine </label>
          <input {...register("cuveeNom")} type="text"className="input" style={{minWidth: "300px"}}/>
        </div>
      </div>
      <div className="form-group">
        <div>
          <label>Millesime </label>
          <input {...register("millesime")} type="number" className="input" style={{maxWidth: "90px"}}/>
        </div>
        <div>
          <label>Alcool </label>
          <input type="number" step="0.1" {...register("alcool")} className="input" style={{maxWidth: "50px"}}/>
          <span>°</span>
        </div>
        <div>
          <label>Quantité</label>
          <input type="number" {...register("quantite")} className="input" style={{maxWidth: "50px"}}/>
        </div>
        <div className="label-flex">
          <label>Vin </label>
          <Controller
            name="vinId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={vinOptions}
                value={vinOptions.find(option => option.value === field.value) || null}
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : '')}
              />
            )}
          />
        </div>
      </div>
      <div className="form-group">
        <div className="label-flex">
          <label>Région </label>
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={regionOptions}
                value={regionOptions.find(option => option.value === field.value) || null}
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : '')}
              />
            )}
          />
        </div>
        <div className="label-flex">
          <label>Cépages </label>
          <Controller
            name="cepageIds"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={cepageOptions}
                value={cepageOptions.filter(option => field.value.includes(option.value))}
                onChange={(selectedOptions) => field.onChange(selectedOptions.map(option => option.value))}
              />
            )}
          />
        </div>
      </div>
      <div className="separator-horizontal"></div>
      <div className="form-group">
        <div>
          <label>Note </label>
          <input {...register("note")}  type="number" step="0.1" className="input" style={{minWidth: "30px"}}/>
        </div>
        <div>
          <label>Note perso </label>
          <input {...register("note_perso")}  type="number" step="0.1" className="input" style={{minWidth: "30px"}}/>
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
                {...field}
                options={casierOptions}
                value={casierOptions.find(option => option.value === field.value) || null}
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : '')}
              />
            )}
          />
        </div>
      </div>
      <div className="separator-horizontal"></div>
      <div style={{display:'flex'}}>
        <button type="submit" className="add-button">Mettre à jour</button>
        {/* <button type="button" onClick={onClose} className="cancel-button">Annuler</button> */}
      </div>
    </form>
  );
};

export default UpdateBouteilleForm;
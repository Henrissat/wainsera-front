import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { useQuery } from "@apollo/client";
import { LIST_VIN } from "../../graphql/queries/vin.query";
import { LIST_CEPAGE } from "../../graphql/queries/cepage.query";
import { LIST_REGION } from "../../graphql/queries/region.query";

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
  vin: {
    id: number;
    couleur: string;
  };
  cuvee?: ICuvee;
  cepages?: ICepage[];
  region?: IRegion;
}

interface IUpdateBouteilleFormProps {
  bouteille: IBouteille;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const UpdateBouteilleForm: React.FC<IUpdateBouteilleFormProps> = ({ bouteille, onSubmit, onClose }) => {
  const [vinOptions, setVinOptions] = useState<OptionType[]>([]);
  const [regionOptions, setRegionOptions] = useState<OptionType[]>([]);
  const [cepageOptions, setCepageOptions] = useState<OptionType[]>([]);

  const { data: vinData } = useQuery<{ vins: IVin[] }>(LIST_VIN);
  const { data: cepageData } = useQuery<{ cepages: ICepage[] }>(LIST_CEPAGE);
  const { data: regionData } = useQuery<{ regions: IRegion[] }>(LIST_REGION);

  console.log(bouteille);
  
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      millesime: bouteille.millesime ?? '',
      alcool: bouteille.alcool ?? '',
      quantite: bouteille.quantite ?? '',
      cepageIds: bouteille.cepages ? bouteille.cepages.map(cepage => cepage.id) : [],
      vinId: bouteille.vin?.id ?? '',
      regionId: bouteille.region?.id ?? '',
      cuveeNom: bouteille.cuvee?.nom_domaine ?? ''
    }
  });

  useEffect(() => {
    if (vinData) {
      const vins = vinData.vins.map(vin => ({ value: vin.id, label: vin.couleur }));
      setVinOptions(vins);
    }

    if (cepageData) {
      const cepages = cepageData.cepages.map(cepage => ({ value: cepage.id, label: cepage.nom_cepage }));
      setCepageOptions(cepages);
    }

    if (regionData) {
      const regions = regionData.regions.map(region => ({
        value: region.id,
        label: region.nom_region + (region.pays ? ` (${region.pays.nom_pays})` : '')
      }));
      setRegionOptions(regions);
    }

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
  }, [bouteille, vinData, cepageData, regionData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Millesime</label>
        <input type="number" {...register("millesime")} />
      </div>
      <div>
        <label>Alcool</label>
        <input type="number" {...register("alcool")} />
      </div>
      <div>
        <label>Quantité</label>
        <input type="number" {...register("quantite")} />
      </div>
      <div>
        <label>Vin</label>
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
      <div>
        <label>Région</label>
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
      <div>
        <label>Cépages</label>
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
      <div>
        <label>Nom du cuvée</label>
        <input type="text" {...register("cuveeNom")} />
      </div>
      <button type="submit">Mettre à jour</button>
      <button type="button" onClick={onClose}>Annuler</button>
    </form>
  );
};

export default UpdateBouteilleForm;
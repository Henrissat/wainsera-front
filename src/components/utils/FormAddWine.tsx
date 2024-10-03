import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
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
  label: string; 
}

interface IFormInput {
  id: number;
  millesime: number;
  alcool: string;
  quantite: number;
  note?: string;
  note_perso?: string;
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

interface AccordOptionType {
  value: string;
  label: string;
}

const list_accord: AccordOptionType [] = [
  { value: "charcuterie", label: "Charcuterie" },
  { value: "viandes-blanches", label: "Viandes blanches" },
  { value: "poisson", label: "Poisson" },
  { value: "fruits-de-mer", label: "Fruits de mer" },
  { value: "fromages", label: "Fromages" },
  { value: "viandes-rouges", label: "Viandes rouges" },
  { value: "gibier", label: "Gibier" },
  { value: "légumes", label: "Légumes" },
  { value: "plats-épices", label: "Plats épicés" },
  { value: "desserts-chocolat", label: "Desserts au chocolat" },
  { value: "desserts-fruits", label: "Desserts aux fruits" },
  { value: "plats-en-sauce", label: "Plats en sauce" },
  { value: "tartes-salees", label: "Tartes salées" },
];

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
      alcool: formData.alcool ? parseFloat(formData.alcool.replace(',', '.')) : null,
      quantite: formData.quantite ? Number(formData.quantite) : null,
      note: formData.note ? parseFloat(formData.note.replace(',', '.')) : null,
      note_perso: formData.note_perso ? parseFloat(formData.note_perso.replace(',', '.')) : null,
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
    label: `${region.nom_region} - ${region.pays ? region.pays.nom_pays : 'Aucun pays associé'}`
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
          <input {...register("alcool", { required: true })} type="text" className="input" style={{maxWidth: "50px"}}/>
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
          <input {...register("note")} type="text" className="input" style={{maxWidth: "90px"}}/> 
        </div>
        <div>
          <label>Note perso </label>
          <input {...register("note_perso")} type="text" className="input" style={{maxWidth: "90px"}}/> 
        </div>
      </div>
      <div className="form-group">
        <div>
          <label>Bouche </label>
          <input {...register("bouche")} type="text" className="input" style={{minWidth: "300px"}}/>
        </div>
        {/* <div>
          <label>Accord </label>
          <input {...register("accord")} type="text" className="input" style={{minWidth: "300px"}}/>
        </div> */}
        <Controller
            name="accord"
            control={control}
            render={({ field }) => (
              <CreatableSelect
                isMulti
                options={list_accord}
                onChange={(selectedOptions: MultiValue<AccordOptionType> | null) => {
                  const selectedValues = selectedOptions ? selectedOptions.map(option => option.value).join(', ') : '';
                  field.onChange(selectedValues); 
                }}
                className="input cepage-select"
                value={field.value
                  ?.split(', ')
                  .map((value: string) => ({ value, label: value })) || []}
              />
            )}
          />
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
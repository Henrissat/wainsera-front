import React from "react";
import './wine.css'; 
import WineBottleImage from "../assets/wine.jpg";  
import { useQuery } from "@apollo/client";
import { GET_BOUTEILLE } from "../graphql/queries/bouteille.query";
import { useParams } from "react-router-dom";

interface ICepage {
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
    nom_domaine: string;
  };
  cepages: ICepage[];
  region?: {
    nom_region: string;
  };
  vin: {
    couleur: string;
  };
}

function Wine() {
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(GET_BOUTEILLE, {
    variables: { getBouteilleByIdId: id ? parseInt(id, 10) : null },
    skip: !id, 
  });

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const bouteille: IBouteille | null = data?.getBouteilleById || null;

  if (!bouteille) {
    return <div>Aucune donnée disponible pour cette bouteille.</div>; 
  }

  const bannerClass = bouteille.vin.couleur === "Rouge" ? "banner-red"
    : bouteille.vin.couleur === "Blanc" ? "banner-yellow"
    : "banner-pink"; 

  return (
    <div className="wine-page">
      <div className={bannerClass}>
        <div className="container-banner"> 
          <div className="wine-image">
            <img src={WineBottleImage} alt="Bouteille de vin" />
          </div>
          <div className="wine-info">
            <h2>{bouteille.cuvee.nom_domaine}</h2>
            <p>Couleur : {bouteille.vin.couleur}</p>
            <p>Quantité : {bouteille.quantite}</p>
          </div>
        </div>
      </div>
      <div className="wine-details">
        <h2>Détails du vin</h2>
        <p><strong>Millésime :</strong> {bouteille.millesime}</p>
        <p><strong>Alcool :</strong> {bouteille.alcool ? `${bouteille.alcool}%` : "Non spécifié"}</p>
        <p><strong>Note :</strong> {bouteille.note || "Non notée"}</p>
        <p><strong>Bouche :</strong> {bouteille.bouche || "Non spécifié"}</p>
        <p><strong>Accord :</strong> {bouteille.accord || "Non spécifié"}</p>
        <p><strong>Région :</strong> {bouteille.region?.nom_region || "Non spécifiée"}</p>
        <p><strong>Cépages :</strong> {bouteille.cepages.map((c) => c.nom_cepage).join(', ')}</p>
      </div>
    </div>
  );
}

export default Wine;
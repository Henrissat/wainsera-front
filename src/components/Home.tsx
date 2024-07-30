import React from "react";
import { useQuery } from "@apollo/client";
import { LIST_BOUTEILLE } from "../graphql/queries/bouteille.query";

interface IBouteille {
  id: number;
  millesime?: number;
  alcool?: number;
  quantite?: number;
  cuvee?: {
    nom_domaine: string;
  };
  vin: {
    couleur: string;
  };
}

function Home() {
  const { loading, error, data } = useQuery(LIST_BOUTEILLE);

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Une erreur s'est produite: {error.message}</div>;

  // Regrouper les bouteilles par couleur de vin
  const groupedByColor: { [color: string]: IBouteille[] } = {};

  data.bouteilles.forEach((b: IBouteille) => {
    const color = b.vin.couleur;
    if (!groupedByColor[color]) {
      groupedByColor[color] = [];
    }
    groupedByColor[color].push(b);
  });

  return (
    <div className="container-list">
      {Object.keys(groupedByColor).map((color) => (
        <div key={color}>
          <h2>{color}</h2>
          <div>
            {groupedByColor[color].map((b) => (
              <p key={b.id}>Cuvee: {b.cuvee?.nom_domaine} | Millésime: {b.millesime} | Alcool: {b.alcool}% | Quantité: {b.quantite}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;

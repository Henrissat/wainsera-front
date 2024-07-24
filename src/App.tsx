import React from "react";
import "./App.css";
import { useQuery } from "@apollo/client";

import DemoLazyQuery from "./components/DemoLazyQuery";
import DemoMutation from "./components/DemoMutation";
import { useWainseraQuery } from "./generated";
import { LIST_BOUTEILLE } from "./graphql/queries/bouteille.query";

interface IBouteille {
  id: number;
  millesime?: number;
  alcool?: number;
  quantite?: number;
}
function App() {
  // const { loading, error, data } = useWainseraQuery();
  const { loading, error, data } = useQuery(LIST_BOUTEILLE);

  return (
    <div className="App">
      {loading ? (
        <p>Chargement en cours</p>
      ) : (
        data?.bouteilles?.map((b : IBouteille, index: number) => (
          <p key={index}>{b?.millesime}</p>
        ))
      )}

      <DemoLazyQuery />
      <DemoMutation/>
    </div>
  );
}

export default App;

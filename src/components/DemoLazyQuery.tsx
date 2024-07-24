import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { LIST_BOUTEILLE } from "../graphql/queries/bouteille.query";

function DemoLazyQuery() {
  const [getList, { loading, error }] = useLazyQuery(LIST_BOUTEILLE, {
    onCompleted(data) {
      console.log("%c⧭", "color: #733d00", data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleClick = () => {
    getList();
  };
  return (
    <div>
      <button onClick={handleClick}>Récupérer les livres sur demande</button>
    </div>
  );
}

export default DemoLazyQuery;

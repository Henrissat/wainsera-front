import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_BOUTEILLE } from "../graphql/mutations/bouteille.mutation";

function DemoMutation() {
  const [title, setTitle] = useState<string>("");
  const [addBouteilleDb, { loading }] = useMutation(ADD_BOUTEILLE, {
    onCompleted(data) {
      console.log("%c⧭", "color: #0088cc", data);
    },
    onError(error) {
      console.log("%c⧭", "color: #917399", error);
    },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const addBouteille = () => {
    console.log({
      variables: {
        
      },
    });
    addBouteilleDb({
      variables: {
        
      },
    });
  };
  return (
    <div>
      Hello
      {/* <input onChange={handleChange} />
      <button disabled={millesime.length === 0} onClick={addBouteille}>
        Ajouter le livre
      </button> */}
    </div>
  );
}

export default DemoMutation;

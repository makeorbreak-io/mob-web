import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import { EDITIONS } from "queries";

export default function() {
  const { loading, data } = useQuery(EDITIONS);
  const [selectedEdition, setSelectedEdition] = useState();

  useEffect(() => {
    if (!data) return;

    setSelectedEdition(data.editions.find((e) => e.isDefault));
  }, [data]);

  const EditionSelector = () => {
    if (loading) return null;

    return (
      <div className="form__field">
        <label className="form__field__label" htmlFor="edition-selector">
          Selected Edition
        </label>

        <select
          value={selectedEdition?.id}
          onChange={(ev) => setSelectedEdition(data.editions.find((e) => e.id === ev.target.value))}
          id="edition-selector"
          className='form__field__select'
        >
          {data.editions.map((edition) => (
            <option key={edition.id} value={edition.id}>
              {edition.name}{edition.isDefault && " (default)"}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return {
    loading,
    selectedEdition,
    editions: loading ? [] : data.editions,
    EditionSelector,
  };
}

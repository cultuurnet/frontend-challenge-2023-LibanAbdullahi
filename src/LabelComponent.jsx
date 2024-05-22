import { useState, useEffect } from "react";
import "./LabelComponent.css";

const LabelComponent = () => {
  const eventId = import.meta.env.VITE_EVENT_ID;
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (inputValue.trim() === "") {
        setFilteredSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND
          }/api/labels?query=${inputValue}&limit=6&start=0&suggestion=true`
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        // Filter suggestions directly after fetching data
        if (data && data.member) {
          const filtered = inputValue.trim()
            ? data.member
                .filter(
                  (label) =>
                    label.name
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()) &&
                    label.visibility === "visible"
                )
                .map((label) => label.name)
            : [];
          setFilteredSuggestions(filtered);
        } else {
          setFilteredSuggestions([]);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [inputValue]);

  // refaching the event details after adding or removing a label
  const refetchEventDetails = async () => {
    try {
      const eventResponse = await fetch(
        `${import.meta.env.VITE_BACKEND}/api/events/${eventId}`
      );
      if (eventResponse.ok) {
        const eventData = await eventResponse.json();
        setSelectedLabels(eventData.labels);
      } else {
        throw new Error("Failed to fetch updated event details");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddLabel = async (label) => {
    if (selectedLabels.includes(label) || !label.trim()) return;

    try {
      const labelName = encodeURIComponent(label);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND
        }/api/events/${eventId}/labels/${labelName}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        refetchEventDetails();

        setInputValue("");
        setFilteredSuggestions([]);
      } else {
        throw new Error("Failed to add label");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveLabel = async (label) => {
    try {
      const labelName = encodeURIComponent(label);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND
        }/api/events/${eventId}/labels/${labelName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove label");
      }

      refetchEventDetails();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='label-component'>
      <label className='label-explainer' htmlFor='label-input'>
        Met een label voeg je korte, specifieke trefwoorden toe.
      </label>
      <input
        type='text'
        id='label-input'
        placeholder='Search or add labels...'
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />

      <ul className='suggestions'>
        {filteredSuggestions.map((label) => (
          <li key={label} onClick={() => handleAddLabel(label)}>
            {label}
          </li>
        ))}

        {inputValue.trim() && !filteredSuggestions.includes(inputValue) && (
          <li onClick={() => handleAddLabel(inputValue)}>{inputValue}</li>
        )}
      </ul>

      <div>
        <h3>Selected Labels</h3>
        <ul className='selected-labels'>
          {selectedLabels.map((label) => (
            <li key={label}>
              {label}
              <button onClick={() => handleRemoveLabel(label)}>X</button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p>Error: {error}</p>}
    </div>
  );
};
export default LabelComponent;

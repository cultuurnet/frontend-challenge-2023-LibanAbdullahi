import { useState, useEffect } from "react";
import "./LabelComponent.css";

const LabelComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [labelsData, setLabelsData] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([null]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/labels?query=${inputValue}`
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        setLabelsData(data);
        handleInputChange(inputValue);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [inputValue]);

  const handleInputChange = (input) => {
    if (!labelsData || !labelsData.member) {
      return;
    }
    const filtered = input.trim()
      ? labelsData.member
          .filter(
            (label) =>
              label.name.toLowerCase().includes(input.toLowerCase()) &&
              label.visibility === "visible"
          )
          .map((label) => label.name)
      : [];

    setFilteredSuggestions(filtered);
  };

  const handleAddLabel = async (label) => {
    if (selectedLabels.includes(label) || !label.trim()) return;

    try {
      const labelName = encodeURIComponent(label);
      const response = await fetch(
        `http://localhost:3000/api/events/:eventId/labels/${labelName}`,
        {
          method: "PUT",
        }
      );

      if (response.status === 204) {
        const eventResponse = await fetch(
          `http://localhost:3000/api/events/:eventId`
        );
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setSelectedLabels(eventData.labels); // Update selectedLabels based on fetched data
        } else {
          throw new Error("Failed to fetch updated event details");
        }

        // Clear the input and suggestions
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
        `http://localhost:3000/api/events/:eventId/labels/${labelName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove label");
      }

      // Fetch the updated event details to get the remaining labels
      const eventResponse = await fetch(
        `http://localhost:3000/api/events/:eventId`
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

  return (
    <div className='label-component'>
      <h6 className='label-explainer'>
        Met een label voeg je korte, specifieke trefwoorden toe.{" "}
      </h6>
      <input
        type='text'
        placeholder='Search or add labels...'
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleInputChange(e.target.value);
        }}
      />

      <ul className='suggestions'>
        {filteredSuggestions.map((label) => (
          <li key={label} onClick={() => handleAddLabel(label)}>
            {label}
          </li>
        ))}

        {inputValue.trim() &&
          !filteredSuggestions.some(
            (sugg) => sugg.toLowerCase() === inputValue.toLowerCase()
          ) && <li onClick={() => handleAddLabel(inputValue)}>{inputValue}</li>}
      </ul>

      <div>
        <h3>Selected Labels</h3>
        <ul className='selected-labels'>
          {selectedLabels &&
            selectedLabels.map((label) => (
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

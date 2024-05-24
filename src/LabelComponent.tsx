import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import "./LabelComponent.css";

interface LabelComponentProps {
  eventId: string;
}

const LabelComponent: React.FC<LabelComponentProps> = ({ eventId }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(
          `${import.meta.env.VITE_BACKEND}/api/events/${eventId}`
        );
        if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setSelectedLabels(eventData.labels);
        } else {
          throw new Error("Failed to fetch event details");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const fetchSuggestions = async (query: string) => {
    if (query.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND
        }/api/labels?query=${query}&limit=6&start=0&suggestion=true`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      if (data && data.member) {
        const filtered = data.member
          .filter(
            (label: any) =>
              label.name.toLowerCase().includes(query.toLowerCase()) &&
              label.visibility === "visible"
          )
          .map((label: any) => label.name);
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => fetchSuggestions(query), 400),
    []
  );

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }
    debouncedFetchSuggestions(inputValue);
  }, [inputValue, debouncedFetchSuggestions]);

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
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAddLabel = async (label: string) => {
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
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRemoveLabel = async (label: string) => {
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
    } catch (error: any) {
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

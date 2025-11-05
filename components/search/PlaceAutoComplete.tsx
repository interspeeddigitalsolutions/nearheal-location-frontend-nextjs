import usePlacesAutocomplete, {
  getDetails,
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { GoogleMap } from "@react-google-maps/api";
import { useEffect, useState } from "react";

interface PlaceAutoCompleteSearchInputProps {
  initialTextValue?: string;
  setInitialTextValue: (value: string) => void;
  setselectedplace: any;
  placeholder?: string;
  searchType: string[];
  initialValue?: string;
  selectedPlaceErrorMessage?: string;
  onSearch?: (searchValue: string, selectedPlace: any) => void; // New prop for search callback
}

const PlaceAutoComplete = (
  BasicSearchInputProps: PlaceAutoCompleteSearchInputProps
) => {
  const {
    setselectedplace,
    setInitialTextValue,
    placeholder,
    searchType,
    initialTextValue,
    initialValue,
    selectedPlaceErrorMessage,
    onSearch,
  } = BasicSearchInputProps;
  const [mapCenter, setMapCenter] = useState();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "au" },
      types: searchType,
    },
    cache: false,
    debounce: 400,
  });

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setValue(inputValue);
      setselectedplace(null);
      setInitialTextValue("");
    } else {
      setValue(inputValue);
      // Set a text-only search object when user types without selecting
      setselectedplace({
        description: inputValue,
        main_text: inputValue,
        secondary_text: "",
        place_id: null,
        lat: null,
        lng: null,
        full_address: inputValue,
        isTextSearch: true, // Flag to indicate this is a free text search
      });
      setInitialTextValue(inputValue);
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && value.trim() !== "") {
      // Clear suggestions when user presses enter
      clearSuggestions();
      
      // Trigger search with current value
      if (onSearch) {
        onSearch(value, {
          description: value,
          main_text: value,
          secondary_text: "",
          place_id: null,
          lat: null,
          lng: null,
          full_address: value,
          isTextSearch: true,
        });
      }
    }
  };

  useEffect(() => {
    if (initialTextValue) {
      setValue(initialTextValue, false);
    }
    if (!initialTextValue) {
      setValue("", false);
      setselectedplace(null);
    }
  }, [initialTextValue]);

  const handleSelect = (suggestion: any) => async () => {
    let { description, place_id, structured_formatting } = suggestion;
    description = description.replace(/, Australia$/, "");

    const fullAddress = description;

    setValue(fullAddress, false);
    clearSuggestions();

    try {
      setInitialTextValue(fullAddress);
      const geocodes = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(geocodes[0]);
      const results = await getDetails({ placeId: place_id });
      // @ts-ignore
      const result = results.address_components[0].long_name;

      const selectedPlaceData = {
        description: result,
        main_text: structured_formatting.main_text,
        secondary_text: structured_formatting.secondary_text,
        place_id,
        lat: lat.toString(),
        lng: lng.toString(),
        full_address: fullAddress,
        isTextSearch: false, 
      };

      setselectedplace(selectedPlaceData);

      if (onSearch) {
        onSearch(fullAddress, selectedPlaceData);
      }
    } catch (error) {
      console.error("Error getting place details", error);
    }
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <div
          className="flex items-center p-2 cursor-pointer rounded hover:bg-gray-100"
          key={place_id}
          onClick={handleSelect(suggestion)}
        >
          <div>
            <p className="text-sm font-medium">{main_text}</p>
            <p className="text-xs text-gray-500">{secondary_text}</p>
          </div>
        </div>
      );
    });

  return (
    <div>
      {/* Input wrapper */}
      <div className="relative">
        <input
          type="text"
          className={`w-full bg-white text-gray-800 rounded-md border ${
            selectedPlaceErrorMessage
              ? "border-red-500 placeholder-red-500"
              : "border-gray-300 placeholder-gray-500"
          } shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={!ready}
          placeholder={
            selectedPlaceErrorMessage ? selectedPlaceErrorMessage : placeholder
          }
          required
        />
      </div>

      {/* Suggestions list */}
      {status === "OK" && (
        <div className="absolute z-10 mt-2 bg-white shadow-md rounded-md p-2 w-full">
          {renderSuggestions()}
        </div>
      )}
    </div>
  );
};

export default PlaceAutoComplete;
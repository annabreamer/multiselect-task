import React, { useState, useRef, useEffect } from "react";
import "./Multiselect.css";

export default function Multiselect({
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    const alreadySelected = selectedOptions.find(
      (o) => o.value === option.value
    );
    if (alreadySelected) {
      onSelectionChange(
        selectedOptions.filter((o) => o.value !== option.value)
      );
    } else {
      onSelectionChange([...selectedOptions, option]);
    }
    setIsOpen(false);
    setSearch("");
  };

  const handleRemove = (option) => {
    onSelectionChange(selectedOptions.filter((o) => o.value !== option.value));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="multiselect-wrapper">
      <div className="multiselect-container" ref={dropdownRef}>
        <div className="input-wrapper" onClick={toggleDropdown}>
          {selectedOptions.map((option) => (
            <span
              className="tag"
              key={option.value}
              onClick={(e) => e.stopPropagation()}
            >
              {option.label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option);
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            size={search.length + 1}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="search-input-inline"
          />
          <div
            className="arrow-container"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
          >
            <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▾</span>
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={
                      selectedOptions.find((o) => o.value === option.value)
                        ? "selected"
                        : ""
                    }
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="no-options">No matching options available</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedOptions.length > 0 && (
        <button className="clear-all-btn" onClick={handleClearAll}>
          Clear
        </button>
      )}
    </div>
  );
}

import { Search } from "lucide-react";

function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="common-search">
      <Search size={18} />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

export default SearchInput;
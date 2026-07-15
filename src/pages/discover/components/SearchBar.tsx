import { Search } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

export type RegisterType = UseFormRegister<{
  searchValue?: string;
}>;

const SearchBar = ({ register }: { register: RegisterType }) => {
  return (
    <fieldset className="w-full relative mb-6">
      <input
        {...register("searchValue")}
        type="search"
        placeholder="Search skills..."
        className="w-full py-2.5 pr-4 pl-10 border-border border-1 rounded-radius-xl text-base outline-none focus:border-2 focus:border-primary transition"
      />
      <Search
        size={20}
        className="absolute top-[50%] translate-[-50%] left-5 text-muted-foreground"
      />
    </fieldset>
  );
};

export default SearchBar;

import { Code2, Sparkles, Users } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

export type RegisterType = UseFormRegister<{
  searchValue?: string;
  filterValue?: "all" | "skills" | "people";
}>;

type FilterProps = {
  register: RegisterType;
};

const Filter = ({ register }: FilterProps) => {
  return (
    <fieldset className="flex gap-3 mb-8">
      <div className="flex">
        <input
          {...register("filterValue")}
          type="radio"
          id="all"
          value="all"
          className="hidden peer"
        />
        <label
          htmlFor="all"
          className="flex gap-2 items-center text-muted-foreground border-1 border-border px-4 py-2.5 rounded-radius-xl peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary cursor-pointer transition"
        >
          <Sparkles size={15} />
          <span className="text-sm font-medium">All</span>
        </label>
      </div>

      <div className="flex">
        <input
          {...register("filterValue")}
          type="radio"
          id="skills"
          value="skills"
          className="hidden peer"
        />
        <label
          htmlFor="skills"
          className="flex gap-2 items-center text-muted-foreground border-1 border-border px-4 py-2.5 rounded-radius-xl peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary cursor-pointer transition"
        >
          <Code2 size={15} />
          <span className="text-sm font-medium">Skills</span>
        </label>
      </div>

      <div className="flex">
        <input
          {...register("filterValue")}
          type="radio"
          id="people"
          value="people"
          className="hidden peer"
        />
        <label
          htmlFor="people"
          className="flex gap-2 items-center text-muted-foreground border-1 border-border px-4 py-2.5 rounded-radius-xl peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary cursor-pointer transition"
        >
          <Users size={15} />
          <span className="text-sm font-medium">People</span>
        </label>
      </div>
    </fieldset>
  );
};

export default Filter;

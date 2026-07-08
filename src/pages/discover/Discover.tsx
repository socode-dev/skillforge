import { motion } from "framer-motion";
import SearchBar from "@/pages/discover/components/SearchBar";
import Filter from "@/pages/discover/components/Filter";
import { searchAndFilterSchema } from "@/schemas/searchAndFilterSchema";
import { useAuthForm } from "@/hooks/useAuthForm";
import Recommendations from "@/pages/discover/components/Recommendations";
import PopularSkills from "@/pages/discover/components/PopularSkills";
import { ScrollToTop } from "@/Layouts/ScrollToTop";

const Discover = () => {
  const { discoverSearchShcema } = searchAndFilterSchema;
  const form = useAuthForm(discoverSearchShcema, "onChange", {
    searchValue: "",
    filterValue: "all",
  });

  const { register, watch } = form;

  const filterValue = watch("filterValue");
  const searchValue = watch("searchValue")!;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full pb-10 px-6 md:px-8 lg:px-10"
    >
      <ScrollToTop />
      <section className="w-full mb-8">
        <h2 className="text-2xl font-semibold mb-2">Discover</h2>
        <p className="text-muted-foreground text-sm">
          Explore skills, connect with people, and join collaborative projects
        </p>
      </section>

      <SearchBar register={register} />

      <Filter register={register} />

      {(filterValue == "all" || filterValue === "skills") && (
        <>
          <Recommendations searchValue={searchValue}/>
          <PopularSkills searchValue={searchValue}/>
        </>
      )}

    </motion.main>
  );
};

export default Discover;

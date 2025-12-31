import { motion } from "framer-motion";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";
import { searchAndFilterSchema } from "../../schemas/searchAndFilterSchema";
import { useAuthForm } from "../../hooks/useAuthForm";
import Recommendations from "./components/Recommendations";
import PopularSkills from "./components/PopularSkills";
import FeaturedMembers from "./components/FeaturedMembers";
import { ScrollToTop } from "../../Layouts/ScrollToTop";

const Discover = () => {
  const { discoverSearchShcema } = searchAndFilterSchema;
  const form = useAuthForm(discoverSearchShcema, "onChange", {
    searchValue: "",
    filterValue: "all",
  });

  const { register, watch } = form;

  const filterValue = watch("filterValue");

  return (
    <motion.main
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: -50, y: 50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full pb-10"
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
          <Recommendations />
          <PopularSkills />
        </>
      )}

      {(filterValue === "all" || filterValue === "people") && (
        <FeaturedMembers />
      )}
    </motion.main>
  );
};

export default Discover;

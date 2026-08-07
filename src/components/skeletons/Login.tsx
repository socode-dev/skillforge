import { motion } from "framer-motion";

export const InputField = () => {
    return (
        <div className="relative flex flex-col gap-2 animate-pulse">
            <div className="h-6 w-20 rounded-md bg-muted-foreground" />
            <div className="h-12 w-full rounded-md bg-muted-foreground" />
        </div>
    )
};

const LoginSkeleton = () => {

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-auto flex"
    >
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="pb-8 px-6 md:px-12 lg:px-18 w-full max-tablet:max-w-[500px] tablet:w-6/12 max-tablet:mx-auto flex flex-col"
      >
        <div className=" mt-8 w-38 h-8 rounded-md bg-muted-foreground grow animate-pulse" />

        <div className="space-y-4 my-8 animate-pulse">
          <h2 className="w-80 h-12 rounded-md bg-muted-foreground" />
          <p className="h-8 w-84 rounded-md bg-muted-foreground" />
        </div>

        <form className="flex flex-col gap-6">
          <fieldset className="space-y-1">
            <InputField />
          </fieldset>

          <fieldset className="space-y-1">
            <InputField />
          </fieldset>

          <fieldset className="flex justify-between items-center text-sm animate-pulse">
            {Array.from({length: 2}).map((_, i) => (<div key={i} className="w-32 h-6 rounded-md bg-muted-foreground" />))}
          </fieldset>

          <div className="h-12 w-full rounded-md bg-muted-foreground animate-pulse" />
        </form>

        <p className="w-56 h-6 rounded-md bg-muted-foreground mx-auto mt-8 animate-pulse" />
       </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="max-tablet:hidden px-8 grow flex flex-col justify-center items-center gap-8"
      >
        <div className="w-24 h-24 rounded-full bg-muted-foreground/20 flex justify-center items-center animate-spin-scale">
          <div className="w-16 h-16 rounded-full bg-muted-foreground/30 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full bg-muted-foreground/50" />
          </div>
        </div>

        <h3 className="h-12 w-68 rounded-md bg-muted-foreground animate-pulse" />

        <p className="h-8 w-10/12 rounded-md bg-muted-foreground animate-pulse" />
      </motion.section>
    </motion.main>
  );
};

export default LoginSkeleton;

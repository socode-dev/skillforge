import { motion } from "framer-motion";
import { InputField } from "./Login";

const SignupSkeleton = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-auto px-6 md:px-12 lg:px-18 space-y-10"
    >
      <div className="mt-8 h-8 w-40 rounded-md bg-muted-foreground animate-pulse" />

      <section className="w-full max-w-2xl mx-auto space-y-10">
        <div className="bg-card text-card-foreground p-8 border border-border rounded-radius-xl shadow space-y-8">
          <div className="space-y-6">
            <div className="h-5 w-1/4 rounded-md bg-muted-foreground animate-pulse" />
            <div className="h-4 w-2/3 rounded-md bg-muted-foreground animate-pulse" />
          </div>

          <div className="flex gap-3">
            <div className="h-10 flex-1 rounded-full bg-muted-foreground animate-pulse" />
            <div className="h-10 flex-1 rounded-full bg-muted-foreground animate-pulse opacity-50" />
            <div className="h-10 flex-1 rounded-full bg-muted-foreground animate-pulse opacity-50" />
          </div>

          <div className="space-y-5">
            <InputField />
            <InputField />
            <InputField />
            <InputField />
          </div>

          <div className="h-12 rounded-full bg-muted-foreground animate-pulse" />
        </div>
      </section>
    </motion.main>
  );
};

export default SignupSkeleton;
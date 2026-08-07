import { motion } from "framer-motion";

const SkillCard = ({idx}: {idx: number}) => {
  return(
    <motion.div key={idx} className="flex flex-col max-w-full bg-card p-4 border-border border-1 rounded-radius-xl">
              
      <div className="w-10 h-10 rounded-radius bg-muted shadow-lg animate-pulse" />
            
        <div className="h-8 w-56 my-2 bg-muted rounded-radius animate-pulse" />
            
        <div className="grow w-full h-10 bg-muted rounded-radius animate-pulse" />
            
        <div className="flex justify-between items-center gap-8 mt-4">
          <div className="h-8 w-28 bg-muted rounded-radius animate-pulse" />
            
          <div className="h-10 w-28 bg-muted rounded-radius animate-pulse" />
        </div>
    </motion.div>
  )
}

const DiscoverSkeleton = () => {

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full pb-10 px-6 md:px-8 lg:px-10"
    >
      <section className="w-full mb-8 space-y-2">
        <h2 className="w-44 h-12 rounded-radius-xl bg-card animate-pulse" />
        <div className="w-full max-w-120 h-12 rounded-radius-xl bg-card animate-pulse" />
      </section>

      <div className="w-full h-14 bg-card rounded-radius-xl mb-6" />

      <section className="mb-6">
        <div className="h-10 w-80 bg-card rounded-radius-xl mb-4 animate-pulse" />

        <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
          <div className="flex gap-4 w-max max-w-full snap-x snap-mandatory">
            {Array.from({length: 3}).map((_, idx) => (
              <SkillCard idx={idx} />
            ))}
          </div>
        </div>
    </section>

      <section className="mb-6">
      <div className="mb-4 w-80 h-10 bg-card rounded-radius-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({length: 6}).map((_, idx) => (
          <SkillCard idx={idx} />
        ))}
      </div>
    </section>
  
    </motion.main>
  );
};

export default DiscoverSkeleton;

import { motion } from "framer-motion";

const DashboardSkeleton = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6 md:p-10 space-y-8"
    >
      <div className="h-fit w-full rounded-radius-xl bg-card border border-border shadow animate-pulse p-8 space-y-4">
        <div className="h-16 w-full max-w-120 bg-muted-foreground rounded-radius"/>
        <div className="h-12 w-full max-w-96 bg-muted-foreground rounded-radius"/>
        
        <div className="flex gap-3">
          <div className="h-10 w-34 bg-muted-foreground rounded-radius"/>
          <div className="h-10 w-34 bg-muted-foreground rounded-radius"/>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-fit w-full flex gap-2 rounded-3xl bg-card border border-border shadow p-7"
          >
            <div className="h-14 w-16 rounded-md bg-muted-foreground animate-pulse" />
            <div className="space-y-2 w-full">
              <div className="h-7 w-7 rounded-md bg-muted-foreground animate-pulse" />
              <div className="h-5 w-52 rounded-md bg-muted-foreground animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className="bg-card border border-border rounded-3xl shadow p-6 space-y-5">
          <div className="h-5 w-1/3 rounded-md bg-muted-foreground animate-pulse" />
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 rounded-3xl bg-muted-foreground animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 rounded-3xl bg-card border border-border shadow p-5"
            >
              <div className="h-5 w-2/5 rounded-md bg-muted-foreground animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-4/5 rounded-md bg-muted-foreground animate-pulse" />
                <div className="h-4 w-1/2 rounded-md bg-muted-foreground animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default DashboardSkeleton;
const SettingsSkeleton = () => {
    return (
        <main className="w-full bg-background text-foreground pb-6 px-6 md:px-8 lg:px-10">
            <section className="w-full mb-8">
                <h2 className="w-32 h-8 bg-card rounded-radius-xl mb-1 animate-pulse" />
                <p className="w-11/12 max-w-[450px] h-6 bg-card rounded-radius-xl animate-pulse" />
            </section>
            
            {Array.from({length: 2}).map((_, idx) => (
                <div key={idx} className="w-full bg-card text-card-foreground px-4 border-1 border-border rounded-radius-xl mb-6 flex justify-between items-center py-6 cursor-pointer animate-pulse"
                    >
                    <div className="flex items-center gap-4">
                        <div className="w-7 h-7 bg-muted rounded-radius animate-pulse" />
                        <span className="w-48 h-6 bg-muted rounded-radius animate-pulse" />
                    </div>
                
                    <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                </div>
            ))}

      <section className="w-full flex flex-col justify-between gap-2 bg-card border-1 border-border rounded-radius-xl mb-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-muted rounded-radius animate-pulse" />
        <div className="w-32 h-6 bg-muted rounded-radius animate-pulse" />
      </div>

      <div className="w-full flex justify-between items-center pt-3 gap-4 border-border border-t-1">
        <div className="w-full">
            <div className="w-28 h-7 bg-muted rounded-radius animate-pulse mb-1" />
            <div className="w-full h-8 bg-muted rounded-radius animate-pulse mb-1" />
            <div className="w-48 h-5 bg-muted rounded-radius animate-pulse" />
        </div>

        <div className="w-32 h-8 bg-muted rounded-radius animate-pulse" />
      </div>

    </section>
    </main>
    )
}

export default SettingsSkeleton;
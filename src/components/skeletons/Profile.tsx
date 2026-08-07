const  ProfileSkeleton = () => {
    return (
        <main className="w-full bg-background text-foreground pb-6 px-6 md:px-8 lg:px-10 space-y-6">

            <section className="w-full mb-8 space-y-2">
                <div className="h-10 w-32 bg-card rounded-radius-xl animate-pulse" />
                <div className="w-11/12 h-8 bg-card rounded-radius-xl animate-pulse" />
            </section>

    <section className="p-6 border border-border bg-card rounded-radius-xl shadow">
        <fieldset className="flex flex-col md:flex-row gap-5 mb-8">
            <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
        
            <div className="grow flex justify-between items-start gap-2">
                <div className="grow">
                    <div className="mb-2 h-8 w-68 bg-muted rounded-radius animate-pulse" />
                    <div className="h-6 w-64 bg-muted rounded-radius animate-pulse" />
                </div>

                <div className="w-12 h-10 bg-muted rounded-radius animate-pulse" />
            </div>
        </fieldset>

        <hr className="w-11/12 border-muted mx-auto" />

        <fieldset className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
                <div className="h-12 w-12 bg-muted rounded-radius animate-pulse" />
                
                <div className="space-y-1">
                    <div className="h-6 w-18 bg-muted rounded-radius animate-pulse" />
                    <div className="h-6 w-36 bg-muted rounded-radius animate-pulse" />
                </div>
            </div>

            <div className="md:w-1/2 flex items-center gap-2 p-2 border border-border bg-muted rounded-radius">
                <div className="h-12 w-12 bg-muted-foreground rounded-radius animate-pulse" />

                <div className="space-y-2">
                    <div className="w-32 h-4 bg-muted-foreground rounded-radius animate-pulse" />
                    <div className="h-8 w-6 bg-muted-foreground rounded-radius animate-pulse" />
                    <div className="h-4 w-52 bg-muted-foreground rounded-radius animate-pulse" />
                </div>
            </div>
        </fieldset>
        </section>

    <section className="p-6 border border-border bg-card rounded-radius-xl shadow space-y-6">
            <fieldset className="space-y-1">
                <div className="h-6 w-48 bg-muted rounded-radius animate-pulse" />
                <div className="h-4 w-64 rounded-radius bg-muted animate-pulse" />
            </fieldset>

            <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({length: 3}).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-6 bg-muted border border-border rounded-radius-xl shadow">
                        <div className="w-12 h-12 bg-muted-foreground rounded-radius animate-pulse" />
                    
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-muted-foreground rounded-radius animate-pulse" />
                            <div className="w-32 h-6 bg-muted-foreground rounded-radius animate-pulse" />
                        </div>
                    </div>
                ))}
            </fieldset>
            
        </section>

  </main>
    )
}

export default ProfileSkeleton;
const ChatListSkeleton = () => {
    return (
        <main className="w-full pb-10">
            <div className="w-11/12 h-10 bg-card rounded-radius-xl mx-auto animate-pulse"/>
        
            <section className="w-full mt-6">
                {Array.from({length: 5}).map((_, idx) => (
                    <div key={idx} className="w-full flex gap-2.5 bg-card border-t-1 border-b-1 border-border py-4 px-6 md:px-8 cursor-pointer hover:bg-muted/35 transition"
                    >
                        <div className="relative min-w-14 max-w-14 h-14 max-h-14 flex justify-center items-center bg-muted text-primary-foreground rounded-full animate-pulse" />

                        <div className="w-full">
                            <div className="w-full flex justify-between items-center space-y-1">
                                <div className="h-5 w-28 bg-muted rounded-radius animate-pulse" />
                                <div className="h-4 w-26 bg-muted rounded-radius animate-pulse" />
                            </div>
                    
                            <div className="h-4 w-24 bg-muted rounded-radius animate-pulse" />
    
                            <div className="h-6 w-10/12 mt-3 max-w-[550px] bg-muted rounded-radius animate-pulse" />
                        </div>
                    
                    </div>
                ))}
                    
              </section>
            </main>
    )
}

export default ChatListSkeleton;
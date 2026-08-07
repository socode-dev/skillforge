const ChatThreadSkeleton = () => {
    return (
        <main className="relative h-[100dvh] overflow-hidden">
            <div className="fixed top-0 left-0 lg:w-5/6 lg:left-1/6 right-0 flex items-center gap-4 px-4 md:px-6 lg:px-8 py-3 border-b-1 border-border bg-background">
                <div className="w-4 h-4 bg-card rounded animate-pulse" />

            <div className="flex items-center gap-4 grow cursor-pointer">
                <div className="relative min-w-9 max-w-9 h-9 bg-card rounded-full animate-pulse" />
                        
                <div className="h-9 w-36 bg-card rounded-radius-xl animate-pulse" />
            </div>

            <button className="w-3 h-6 bg-card rounded-radius-xl animate-pulse" />
        </div>

        <div className="w-full h-full pt-4 pb-26 flex flex-col gap-4 px-4 md:px-6 lg:px-8 overflow-y-auto scrollbar-hide">
            
            <div className="w-full flex flex-col gap-3">
                <div className="w-28 h-5 mx-auto bg-card rounded-full" />

                {Array.from({length: 5}).map((_,idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                        <div className="flex flex-col self-end gap-1">
                            <div className="w-46 h-10 bg-card rounded-full rounded-br-none animate-pulse" />
                            <div className="w-5 h-3 bg-card rounded animate-pulse self-end" />
                        </div>
                            
                        <div className="flex gap-1 h-24">
                            <div className="w-10 h-10 bg-card rounded-full animate-pulse self-end" />
                            <div className="w-40 h-10 bg-card rounded-full rounded-bl-none animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
                    
        <div className="w-full fixed bottom-18 left-0 lg:w-5/6 lg:left-1/6 right-0 flex items-center gap-3 bg-background px-4 md:px-6 lg:px-8 py-4 border-y-1 border-border">
                    
                <div className="grow h-10 bg-card rounded-radius animate-pulse" />
        
                <div className="h-10 w-14 bg-card rounded-radius animate-pulse" />
        </div>
    </main>
    )
}

export default ChatThreadSkeleton;
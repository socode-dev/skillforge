const RequestCard = ({type}: {type: 'outgoing' | 'incoming'}) => {
    return (
    
    <figure className="w-full py-5 px-3 bg-card border border-border rounded-radius-xl flex gap-4 shadow relative overflow-hidden">
        <div className="absolute -right-20 top-16 bg-muted w-30 h-30 rounded-full animate-pulse" />
        
        <div className="w-14 h-14 rounded-full bg-muted animate-pulse"/>
        
        <div className="grow">
            <div className="flex justify-between items-start">
                <div className="space-y-2 mb-3">
                    <div className="w-40 h-8 bg-muted rounded-radius animate-pulse" />

                    <div className="w-36 h-6 rounded-full bg-muted animate-pulse" />
                </div>
        
                {type === "outgoing" && (
                    <div className="h-6 w-32 bg-muted rounded-full animate-pulse" />
                )}
            </div>
        
            <div className="w-full h-16 bg-muted rounded-radius animate-pulse" />
        
            <div className="h-8 w-28 bg-muted rounded-radius my-4 animate-pulse" />
        
            {type === 'incoming' ? (
                <div className="flex gap-2 items-center justify-between">
                    {Array.from({length: 2}).map((_, idx) => (
                        <div key={idx} className="w-1/2 h-10 bg-muted rounded-radius animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="w-full h-10 bg-muted rounded-radius animate-pulse" />
            )}
        </div>
    </figure>
    )
}

const IncomingSkeleton = ({type}: {type: 'incoming' | 'outgoing'}) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 3}).map((_, idx) => (
                <RequestCard key={idx} type={type} />
            ))}
        </section>
    ) 
}

const OutgoingSkeleton = ({type}: {type: 'outgoing' | 'outgoing'}) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 3}).map((_, idx) => (
                <RequestCard key={idx} type={type} />
            ))}
        </section>
    )
}


export {IncomingSkeleton, OutgoingSkeleton};

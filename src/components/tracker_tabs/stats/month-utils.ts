export type MonthKey = {
    year: number;
    month: number; // 0 = Jan
};

export const formatMonth = ( { year, month }: MonthKey ) =>
    new Date( year, month ).toLocaleString( "default", {
        month: "short",
        year: "numeric",
    } );

export const getRecentMonths = (
    count = 12,
    from = new Date()
): MonthKey[] => {
    const months: MonthKey[] = [];
    const d = new Date( from );

    for ( let i = 0; i < count; i++ ) {
        months.push( {
            year: d.getFullYear(),
            month: d.getMonth(),
        } );
        d.setMonth( d.getMonth() - 1 );
    }

    return months; // newest → oldest
};

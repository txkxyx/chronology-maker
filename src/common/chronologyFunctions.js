export function sortCareers(careers){
    careers.forEach(career => {
        career.events.sort(function(a, b){
            if(a.date < b.date) return 1;
            if(a.date > b.date) return -1;
            return 0
        })
    });
    careers.sort(function(a, b){
        if(a.year < b.year) return 1;
        if(a.year > b.year) return -1;
        return 0
    })
}

export function sortUsers(users){
    users.sort(function(a, b){
        if(a.startAt < b.startAt) return -1;
        if(a.startAt > b.startAt) return 1;
        return 0;
    })
}
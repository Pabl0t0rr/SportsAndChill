type Session = {
    _id: string,
    title: string,
    type: string,
    level: string,
    duration: number,
    instructor: string,
    capacity: number,
    reserved: number,
    tags: string[], //For saving the key words of each session
}
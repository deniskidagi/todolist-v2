function getDate(){
    let today = new Date()
    

    let options = {
        weekDay: "long",
        day: "numeric",
        month: "long"
    }

    let day = today.toLocaleDateString("en-US", options)
    
}
module.exports = getDate
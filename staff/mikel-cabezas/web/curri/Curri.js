function Curri() {
    this.length = 0
}

Curri.prototype.forEach = function(callback) {
    for (let i = 0; i < this.length; i++) {
        const element = this[i]
        
        callback(element)
    }
}

Curri.prototype.map = function map(callback) {
    const mapped = new Curri

    for (let i = 0; i < this.length; i++) {
        const element = this[i]
        
        mapped[mapped.length] = callback(element)
        mapped.length++
    }

    return mapped
}


Curri.prototype.pop = function(array) {
    const last = array[array.length - 1]

    array.length--

    return last
}




export default Curri
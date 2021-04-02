class Card {
    constructor(shape, color, number, inside) {
        this.shape = shape;
        this.color = color;
        this.number = number;
        this.inside = inside;   
    }

    get numberPath() {
        return String(this.number);
    }

    get insidePath() {
        switch (this.inside) {
            case 0:
                return "S";
            case 1:
                return "H";
            case 2:
                return "O";
            default:
                return "";
        }
    }

    get colorPath() {
        switch (this.color) {
            case 0:
                return "r";
            case 1:
                return "g";
            case 2:
                return "p";
            default:
                return "";
        }
    }

    get shapePath() {
        switch (this.shape) {
            case 0:
                return "P";
            case 1:
                return "S";
            case 2:
                return "D";
            default:
                return "";
        }
    }
}

let shapes = {
    ellipse: 0, //P
    wavy: 1,    //S
    rhomb: 2    //D
}

let colors = {
    red: 0,     //r
    green: 1,   //g
    purple: 2   //p
}

let numbers = {
    one: 1,
    two: 2,
    three: 3
}

let insides = {
    full: 0,    //S
    striped: 1, //H
    empty: 2    //O
}
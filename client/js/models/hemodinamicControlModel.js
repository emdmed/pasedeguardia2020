const hemodinamicControl = {
    date: "",
    ts: "",
    td: "",
    tam: ()=>{
        let one = 2 * +this.td;
        let two = +one + +this.ts;
        let three = +two / 3
        return three;
    }
}
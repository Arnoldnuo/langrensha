class T {
    constructor() {
        this.a = 1;
    }
}
let p = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve('testAsync');
    }, 1000);
});
class T1 extends T {
    constructor(){
        super();
        console.log(this.a);
    }
    async test(){
        let t = await p;
        console.log(t);
    }
}

T.test = 1;
let t = new T1();
let t1 = new T1();
t.a = 'hello';
t1.a = 'hello1';
t.test();
t1.test();

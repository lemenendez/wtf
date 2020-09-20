// convert array of properties to format:
// \n"name","value" (all in javascript virtual machine)
let tex =""
for (let i=0; i<data.length;i++ ) {
    let d = data[i]
    //console.log(d)
    for (const property in d ) {
        tex =`${tex}\n"${property}", "${d[property]}"`
        //console.log(`"${property}", "${d[property]}"`);
      }
  }
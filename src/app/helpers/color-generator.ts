  /*
    Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
    From: https://bocoup.com/blog/2d-picking-in-canvas
   */
  let nextCol = 1;
  export function genColor(){
    var ret = [];
    // via http://stackoverflow.com/a/15804183
    if(nextCol < 16777215){
      ret.push(nextCol & 0xff); // R
      ret.push((nextCol & 0xff00) >> 8); // G 
      ret.push((nextCol & 0xff0000) >> 16); // B

      //nextCol += 100; // This is exagerated for this example and would ordinarily be 1.
      nextCol += 1;
    }
    var col = "rgb(" + ret.join(',') + ")";
    return col;
  }
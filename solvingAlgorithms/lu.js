class LU_step{
    discription;
    u_matrix;
    l_matrix;
}
class Sub_step{
    formula;
    subValues;
}
// we store the lu steps in this array
var LU_steps= new Array(0);
// we store the forward sub step in this array
var fsub_steps= new Array(0);
// we store the backward sub step in this array
var bsub_steps= new Array(0);
// this indicates that we are solving using crout so that if we are when we use the lu method we dont put any steps in the steps array
var crout =false;
// this indicates that pivoting happend so that if it did happen and we are solving with crout we dont write any steps
var pivoted =false;
//this one showes if the system is solvable or not
var slovable=false;
// this varibale is an array that helps us track which rows were swithched if we pivoted
var pi;
// this indicates that the matrix is decomposable or not
var decomposable=true;
// this var holds the given percision
var percision=0;
function lu(x){
    // here we get the dimentions of the square matrix that we are going to decompose 
   var row=x.length;
    var coul=x[0].length;
    // this is a loop counter
    var t;
    //we make this object to hold the steps before putting it in the array 
    var m =new LU_step();
    // we are going to adjust the original matrix x and make it the upper matrix
    //we make a lower matrix with the same dimentions as the X matrix
    var lower=new Array(row);
    for(t=0;t<row;t++){
        lower[t]=new Array(coul);
    }
    // this are loop counters
    var i;
    var j;
    var k;
    // we make pi an array of the size of the number of rows 
    pi = new Array(row);
    // here we fill the lower matrix with zeros and the main diagonal with ones and fill th pi with zeros to indicate that no pivoting has happend
    for(i=0;i<row;i++){
        pi[i]=0;
        for(j=0;j<coul;j++){
            if(i==j){
                lower[i][j]=1;
            }else{
                lower[i][j]=0;
            }
        }
    }
    // here we use the forward elemenation method that we learned in the lecture
    for(i=0;i<row-1;i++){
        // here we check the current element that we will divide by to see if we need pivoting in case it's zero 
        if(x[i][i]==0){

            // if it is zero we use the pivote method
            // we send the matrix that we need to pivot X and the number of row that we are pivoting so that we know which one are we pivoting and the lower matrix to use it when we write the pivot step in the steps array
            x=pivot(x,i,lower);
        }
        // here we check if we could pivot or not and if we could not then the matrix can't be decomposed and we exit the loop
        if(!decomposable){
            break;
        }
        for(j=i+1;j<row;j++){
            // here we calculate the factor that we will multiply a row by and subtruct the ans from another row for example R3=R3-(factor)R1
            let factor=x[j][i]/x[i][i];
            //the factory that we got is an element in the L matrix so we add it in the right place 
            lower[j][i]=+factor.toFixed(percision);
            // here we calculate the upper matrix
            for( k=0;k<coul;k++){
                //we mutiply by the percision to move the floating point the number of the percision then use math.round then divide by the percision to return the number to the decimal form
                x[j][k]= +(x[j][k]-(+(factor*x[i][k]).toFixed(percision))).toFixed(percision);
            }
            // if this is not crout then we write steps
            if(!crout){
            m.descripton=`\\text{we multiply }r_${i+1} \\text{by } ${lower[j][i]} \\text{ and subtract it from } r_${j+1}`;
            m.l_matrix=[j,i,factor.toPrecision(percision)];
            m.u_matrix=JSON.parse(JSON.stringify(x));
            LU_steps.push(m);
            m=new LU_step();
            }
        }
    }
    // here we check for solvability by checking all the elements in the last row of the upper matrix if we find one element that is not zero then we this matrix has a unique solution and we make slvable equale to true to start solving in the LU_solve method
    for(i=0;i<coul;i++){
        if(x[row-1][i]!=0){
            slovable=true;
            break;
        }
    }
    if(!decomposable){
        slovable=false;
    }
    // here we combine the lower and upper matrix in one array to send it easily back to the LU solve method 
    var ans=[lower,x];
    return ans;
    
}
function pivot(x, number, lower){
    // here we are going to pivot so we make pivoted equal to true so that we dont write steps if we are using crout 
    pivoted=true;
    //here we have the row that has the zero in it that we need to pivot so that we can switch it after we find the new row with the bigger element
    var y=x[number];
    // here we get the number of rows of the matrix
    var row=x.length;
    // max is the number of row that we are going to switch with
    // here we set the row number of the row that has the largest number and we are going to switch the original coulmn with to the orignal coulmn number
    var max=number;
    var i;
    // here we start to search for the largest number in the coulmn of the zero that caused the pivoting to happen
    // we start the loop with the row number it self because we cant switch with a row that is over
    for(i=number;i<row;i++){
        if(Math.abs(x[i][number])>Math.abs(x[max][number])){
            max=i;
        }
    }
    // if max is equal to the number then we couldn't pivot and we can't decompose the matrix
    if(max==number){
        decomposable=false;
    }
    // here we adjust the pi array that indicates when two row are switched for pivoting 
    // for example if the matrix is 3*3 then pi=[0,0,0] and if we switched the first and second row it becomes pi=[2,0,0] then we switched the second and third pi=[2,3,0] and so on
    pi[number]=max;
    //here we simply switch the two rows
    x[number]=x[max];
    x[max]=y;
    // if we are not using crout and we are still decomposable we add the pivoting step tp the list
    if(!crout && decomposable){
        // we make an LU step object to store the step in it before putting it in the array
    var m=new LU_step();
    m.descripton=`\\text{we need to pivot to avoid dividing by zero and to do that we switch } r_${number+1} \\text{ with }r_${max+1}`;
    m.u_matrix=JSON.parse(JSON.stringify(x));
    m.l_matrix=[];
    LU_steps.push(m);
    }
    return x
}
export function solve_lu(matrix,is_crout,thePercision){
    // we store the lu steps in this array
    LU_steps= new Array(0);
    // we store the forward sub step in this array
    fsub_steps= new Array(0);
    // we store the backward sub step in this array
    bsub_steps= new Array(0);
    pivoted = false;
    slovable = false;
    decomposable = true;
    const x = [];
    for(let r = 0; r < matrix.length; r++) x[r] = [...matrix[r]];
    //we set the percision to the given value
    percision=thePercision;
    // here we get the dimontions that we are going to use to solve the forward and backward substitution
    var row=x.length;
    var coul=x[0].length-1;
    // these are loop counters 
    var i;
    var j;
    var k;
    // this variable we use in the calculation
    var sum;
    //these are to hold the values of formula array and subvalues array befor using them in the steps
    var form;
    var subV
    // we use this to hold the elimnation steps before putting them in there array
    var m =new Sub_step();
    // hear we make a temperary var to hold the matrix that we get from the decomposition
    var p;
    // these two variables are to hold the the lower and upper matrixes
    var lower;
    var upper
     // here we seperate the aug matrix into the answer matrix(B) and the square matrix which has the coefficient of the equations matrix (to_send)
    var b = new Array(row);
    var to_send=new Array(row);
    // here we fill the two matrix with their elements
    for(i=0;i<row;i++){
        b[i]=x[i][coul];
        to_send[i]=new Array(coul);
    }
    for(i=0;i<row;i++){
        for(j=0;j<coul;j++){
            to_send[i][j]=x[i][j];
        }
    }
    // if we are using the do little method then is_crout is false and we do the following
    if(!is_crout){
        //we send the coefficient matrix to be decomposed and get the returned matrix in p
    p= lu(to_send);
    // we get the lower and upper matrixes from p
    lower=p[0];
    upper=p[1];
    // here we check if pi has an element that is not equal to zero and if so we switch the elements of b accordingly because if we change the rows in the coef matrix we need to change the answer matrix as well
     for(i=0;i<pi.length;i++){
        if(pi[i]!=0){
            var hold=b[i];
            b[i]=b[pi[i]];
            b[pi[i]]=hold;
        }
    }
    
    
    // if we are using the crout method then we do the following
     } else{ 
        //we send the coefficient matrix to be decomposed and get the returned matrix in p
        p= lu_crout(to_send);
        // we get the lower and upper matrixes from p
        lower=p[0];
        upper=p[1];

      }


      //if the system is not solvable we return this insted
      crout = false;
    if(!slovable){
        return {luCanBeFound:decomposable,
        systemSolvable:slovable,
        finalAnswer:{
            l_matrix:JSON.parse(JSON.stringify(lower)),
            u_matrix:JSON.parse(JSON.stringify(upper)),
            answer:null,
        },
        step:JSON.parse(JSON.stringify(LU_steps)),
        backwardSub:JSON.parse(JSON.stringify(bsub_steps)),
        forwardSub:JSON.parse(JSON.stringify(fsub_steps))
    }
    }
    // we make a forward_ans array to store in it the result of the forward subsitution because we will use it in the forward sub 
    var forward_ans = new Array(row);
    // we get the first element of the forward_ans array manually
    forward_ans[0]= +(b[0]/lower[0][0]).toFixed(percision);
    form=[b[0],lower[0][0]];
    subV=[];
    m.subValues=JSON.parse(JSON.stringify(subV))
    m.formula=JSON.parse(JSON.stringify(form));
    //we clear form and subV so that we are able to reuse them
    form=new Array(0);
    subV=new Array(0);
    fsub_steps.push(m);
    m=new Sub_step();




    // here we preform forward subsitution like we saw in the lecture
    for(i=1;i<row;i++){
        sum =0;
        form.push(b[i]);
        for(j=0;j<i;j++){
            sum=+(sum+(+(lower[i][j]*forward_ans[j]).toFixed(percision))).toFixed(percision);
            form.push(-1*lower[i][j])
        }
        forward_ans[i]= +((+(b[i]-sum).toFixed(percision))/lower[i][i]).toFixed(percision);
        form.push(lower[i][j])
        for(k=0;k<i;k++){
            subV.push(forward_ans[k]);
        }

          m.subValues=JSON.parse(JSON.stringify(subV))
          m.formula=JSON.parse(JSON.stringify(form));
          //we clear form and subV so that we are able to reuse them
          form=new Array(0);
          subV=new Array(0);
          fsub_steps.push(m);
          m=new Sub_step();
        
    }



    // we make a final ans array to hold the result of the forward sub (the final answers)
    var final_ans=new Array(row);
    //we get the first element manually
    final_ans[row-1]= +(forward_ans[row-1]/upper[row-1][row-1]).toFixed(percision);
    form=[forward_ans[row-1],upper[row-1][row-1]];
    subV=[];
    m.subValues=JSON.parse(JSON.stringify(subV))
    m.formula=JSON.parse(JSON.stringify(form));
    //we clear form and subV so that we are able to reuse them
    form=new Array(0);
    subV=new Array(0);
    bsub_steps.push(m);
    m=new Sub_step();


    // we preform back word subsitution like we learned in the lecture
    for(i=row-2;i>=0;i--){
        form.push(forward_ans[i]);
        sum=0;
        for(j=coul-1;j>=i+1;j--){
            sum= +(sum+( +(upper[i][j]*final_ans[j]).toFixed(percision))).toFixed(percision);
            form.push(-1*upper[i][j])

        }
        final_ans[i]= +((+(forward_ans[i]-sum).toFixed(percision))/upper[i][i]).toFixed(percision);
        form.push(upper[i][j]);
        for(k=row-1;k>i;k--){
            subV.push(final_ans[k]);
        }

          m.subValues=JSON.parse(JSON.stringify(subV))
          m.formula=JSON.parse(JSON.stringify(form));
          //we clear form and subV so that we are able to reuse them
          form=new Array(0);
          subV=new Array(0);
          bsub_steps.push(m);
          m=new Sub_step();
        

    }
    // this case is if we are using the crout method and piovting happend 
    //we ned to switch the order of the unknowns because we switched the coulmns
    if(is_crout){
    for(i=0;i<pi.length;i++){
        if(pi[i]!=0){
            var hold=final_ans[i];
            final_ans[i]=final_ans[pi[i]];
            final_ans[pi[i]]=hold;
        }
        
    }
    if(pivoted){
    bsub_steps.push(`\\text{since we pivoted we need to switch the order of the unknowns}`);
    }
    }
    // we return the final object
    return {
        luCanBeFound:decomposable,
        systemSolvable:slovable,
        finalAnswer:{
            l_matrix:JSON.parse(JSON.stringify(lower)),
            u_matrix:JSON.parse(JSON.stringify(upper)),
            answer:JSON.parse(JSON.stringify(final_ans))
        },
        steps:JSON.parse(JSON.stringify(LU_steps)),
        backwardSub:JSON.parse(JSON.stringify(bsub_steps)),
        forwardSub:JSON.parse(JSON.stringify(fsub_steps)),
        forwardRsults: forward_ans,
    }
    
}


function lu_crout(x){
    // since we are using crout we make the crout boolean equal to true so that we dont write steps during the use of the lu method 
    crout=true;
    // we get the dimentions of the matrix sent to us
  var row=x.length;
  var coul=x[0].length;
  // send the transpose of the matrix to be solved using the lu method 
  var temp=lu(T(JSON.parse(JSON.stringify(x))));
  // then we get the upper and lower matrixes accordingly 
  var upper =T(temp[0]);
  var lower =T(temp[1]);
  // we combine the two arrays in one to send it back to the lu_solve method
  var ans= [lower,upper];
  // here if we didn't pivot we start to write the steps before we send the ans otherwise we send the ans without doing any thing
  if(!pivoted){
      
  var print_lower=JSON.parse(JSON.stringify(lower));
  var print_upper=JSON.parse(JSON.stringify(upper));
  var letters_lower=JSON.parse(JSON.stringify(lower));
  var letters_upper=JSON.parse(JSON.stringify(upper));
  var des=JSON.parse(JSON.stringify(upper));
  var hold="";
  var i;
  var j;
  var k;
  var m= new LU_step();
  for(i=0;i<row;i++){
    for(j=0;j<coul;j++){
        print_lower[i][j]=0;
        if(i==j){
            print_upper[i][j]=1;
            letters_lower[i][j]=`L_{${i+1}${j+1}}`;
            letters_upper[i][j]="1";
        }else{
            print_upper[i][j]=0;
        }
        if(i>j){
            letters_lower[i][j]=`L_{${i+1}${j+1}}`;
            letters_upper[i][j]="0";
        }
        if(i<j){
            letters_lower[i][j]="0";
            letters_upper[i][j]=`\\times U_{${i+1}${j+1}}`;
        }

    }
}
      for(i=0;i<row;i++){
          for(j=0;j<coul;j++){
              hold="";
              for(k=0;k<row;k++){
                  if(letters_lower[i][k]=="0" || letters_upper[k][j]=="0"){

                  } else if(letters_upper[k][j]=="1"){
                      hold=hold+"+"+letters_lower[i][k];
                  }else{
                    hold=hold+"+"+letters_lower[i][k]+letters_upper[k][j];
                  }
              }
              des[i][j]=hold.substr(1);
        }
    }
    for(i=0;i<row;i++){
        for(j=0;j<coul;j++){
           if(i<j){
               m.descripton=`\\text{since } ${x[i][j]} \\text{ is equal to } ${des[i][j]}  \\text{ we can calculate } U_{${i+1} ${j+1}}`;
               m.u_matrix=[i,j,upper[i][j]];
               m.l_matrix=JSON.parse(JSON.stringify(print_lower));
           }else{
               m.descripton=`\\text{since } ${x[i][j]} \\text{ is equal to } ${des[i][j]} \\text{ we can calculate } L_{${i+1} ${j+1}}`;
               print_lower[i][j]=lower[i][j];
               m.l_matrix=JSON.parse(JSON.stringify(print_lower));
               m.u_matrix=[];
           }
            LU_steps.push(m);
            m=new LU_step();
        }
    }
}

  return ans;

}
//this is a simple method that transposes the matrix
function T(x){
    var row=x.length;
    var coul=x[0].length;
    var i;
    var j;
    var temp=0;
    for(i=0;i<row-1;i++){
        for(j=i+1;j<coul;j++){
            temp=x[i][j];
            x[i][j]=x[j][i];
            x[j][i]=temp;
        }
    }
    return x;

}




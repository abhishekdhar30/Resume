
function pdf()
{
   document.getElementById("buttonn").remove();
    window.print();
    var template=
    `
    <div id="buttonn" class="text-center">
    <br><br><br>
    <style>
          body{
            background-image: url('images/a.jpg'); background-size: cover; background-position: top center; min-height: 620px;
          }
    </style>
    <button class="btn btn-dark btn-lg text-light" onclick="pdf()" 
    onMouseOver="this.style.background='#E05343'"
    onMouseOut="this.style.background='#1C1F23'">Download PDF</button>
<a class="btn btn-light btn-lg text-dark" style="margin-left:20px" href="/profile" 
onMouseOver="this.style.background='#E05343'"
    onMouseOut="this.style.background='white'">Edit Details</a>
    <a class="btn btn-dark btn-lg text-light" style="margin-left:20px ;background-color:#cf0000;" href="/" 
    onMouseOver="this.style.background='#E05343'"
        onMouseOut="this.style.background='#cf0000'">Back to Home page</a> 
    <br><br><br>
    </div>
    `;
    document.getElementById("body1").innerHTML=template;
    
}
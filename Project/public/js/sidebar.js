document.getElementById("sidebarCollapse").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle('active');
});


// document.getElementById("uncoloured").addEventListener("click", function() {
//     console.log("clicked");
//     document.getElementById("coloured").classList.toggle('active');
// });



function change()
{
    var template=
    `
    <br>
    <hr class="linecoloured">
    <div class="sameline">
    <label for="projectname">project </label>
    <input type="text" placeholder="projectname" id="projectname" name="projectname">
</div>
<div class="sameline">
    <label for="project1description">Project Description</label>
    <input type="text" placeholder="project1description" id="project1description" name="project1description">
</div>
<div class="sameline">
    <label for="link">Link</label>
    <input type="url" placeholder="link" id="link" name="link">
</div>
<div class="sameline">
    <label for="toolsused">Tools Used</label>
    <input type="text" placeholder="toolsused" id="toolsused" name="toolsused">
</div>`;

var a=document.getElementById("add");
a.innerHTML+=template;
}

// document.getElementById('fg').addEventListener('click',function(e)
// {
//    e.preventDefault();
//    console.log("clicked");
// })
  




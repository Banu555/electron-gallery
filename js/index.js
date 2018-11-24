const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
var fileExtension = ['.jpeg', '.jpg', '.png', '.gif', '.bmp'];

var pathQueue = [];
var parentPath = null;


function view(){
	var project =  JSON.parse(localStorage.getItem("project_1"));
	console.log(project.view.selected)
	$.each(project.view.selected,(function(k,v){
		if(k == 0){
			$("#gallery").prepend("<a href="+v+"><img src="+v+" id='firstImage'></a>")	
		}else{

			$("#gallery").prepend("<a href="+v+"><img src="+v+"></a>")
		}
	}))

	$('#gallery').lightGallery();

    $('#firstImage').trigger('click');    
	// $('#gallery').click(function(){
	// })
	// project.view.selected
	// "<a href="images/pic1.jpg"><img src="images/pic1.jpg"></a>"
	// $('#theDiv').prepend($('<img>',{id:'theImg',src:'theImg.png'}))
}

function selected(img){
	if(img.style.opacity == 0.2){
		img.style.opacity = 1;
		var project =  JSON.parse(localStorage.getItem("project_1"));
		if(project.view !== undefined){
			// alert("project")
			if(project.view.selected.indexOf(img.src) != -1){

				project.view.selected.pop(img.src)
			}
		}
		localStorage.setItem("project_1",JSON.stringify(project));
	}else{
		img.style.opacity = 0.2;

		var project =  JSON.parse(localStorage.getItem("project_1"));
		//replace with ternary function
		if(project.view !== undefined){
			// alert("project")
			if(project.view.selected.indexOf(img.src) == -1){

				project.view.selected.push(img.src)
			}
		}else{

			project.view = {"selected":[img.src]};
		}
		console.log(project)
		localStorage.setItem("project_1",JSON.stringify(project));
		console.log(localStorage.project_1)
	}
}

$(function() {
	// alert('D:\albums\nature\folder_2')
	// alert('D:\\albums\\nature\\folder_2')
	if (localStorage.getItem("project_1") !== null) {
		var project =  JSON.parse(localStorage.getItem("project_1"));
		pathQueue.push(project.parentPath)
		// console.log(pathQueue)
		$.each(project.folders,function(k,v){
			var folderPath = v.replace(/\\/g, "\\\\")
			// console.log(folderPath)
			$("#list").prepend(folderHTML({"imgURL":"./images/folder-images-icon.png","path1":folderPath,"showPath":v}))
		})
		$.each(project.imgFiles,function(k,v){
			var formattedPath = v.replace(/\\/g, "\\\\");
			$("#list").append(fileHTML({"imgURL":v,"path1":v,"showPath":v,"formattedPath":formattedPath}))
		})
	}
	else{
	}
});

function createProject(){
	// $("#list").html("")
	alert("Project created successfully")
}

function openFolder(dirPath) {
	console.log(dirPath)
	pathQueue.push(dirPath);
	console.log("pathQueue length : "+pathQueue.length)
	var parentPath = dirPath.substring(0,dirPath.lastIndexOf('\\')).replace(/\\/g, "\\\\");
	// console.log(parentPath)
	$("#list").html("");
	$(".form-group").html("");
	// $(".form-group").append("<button type='button' class='btn btn-success' onclick='backToParentFolder(\""+parentPath+"\")'>Back</button>");
	$(".form-group").append("<button type='button' class='btn btn-success' onclick='backToParentFolder()'>Back</button>");
	//scan the files
	fs.readdir(dirPath, function(err,dir){
		$.each(dir, function(k,f) {
			fNew = path.resolve(dirPath,f);
			if(fs.lstatSync(fNew).isDirectory()) {
				var folderPath = fNew.replace(/\\/g, "\\\\")
				// console.log(folderPath)
				$("#list").prepend(folderHTML({"imgURL":"./images/folder-images-icon.png","path1":folderPath,"showPath":fNew}))
			}else{
				var ext = path.extname(fNew);

				if($.inArray(ext,fileExtension) !== -1){
					var formattedPath = fNew.replace(/\\/g, "\\\\");
					$("#list").append(fileHTML({"imgURL":fNew,"path1":fNew,"showPath":fNew,"formattedPath":formattedPath}))
				}
			}			
		})
	})
}

function backToParentFolder(){
	console.log(pathQueue.pop());
	console.log(pathQueue.length)
	var parentPath = pathQueue[pathQueue.length-1].replace(/\\/g, "\\\\");
	$("#list").html("");
	$(".form-group").html("");
	if(pathQueue.length == 1){
		$(".form-group").append('<input type="file"  id="files" name="files" onchange="getfolder(event)" webkitdirectory mozdirectory msdirectory odirectory directory multiple accept="image/*" />')
	}
	else{
		$(".form-group").append("<button type='button' class='btn btn-success' onclick='backToParentFolder()'>Back</button>");
		// $(".form-group").append("<button type='button' class='btn btn-success' onclick='backToParentFolder(\""+parentPath+"\")'>Back</button>");

	}
	fs.readdir(parentPath, function(err,dir){
		$.each(dir, function(k,f) {
			fNew = path.resolve(parentPath,f);
			if(fs.lstatSync(fNew).isDirectory()) {
				var folderPath = fNew.replace(/\\/g, "\\\\")
				// console.log(folderPath)
				$("#list").prepend(folderHTML({"imgURL":"./images/folder-images-icon.png","path1":folderPath}))
			}else{
				var ext = path.extname(fNew);
				if($.inArray(ext,fileExtension) !== -1){
					var formattedPath = fNew.replace(/\\/g, "\\\\");
					$("#list").append(fileHTML({"imgURL":fNew,"path1":fNew,"formattedPath":formattedPath}))
				}
			}			
		})
	})

}

function getfolder(e) {
	var projectJSON = {};
	var folders = [];
	var imgFiles = [];

    var files = e.target.files;
    pathDir = files[0].path;
    //for page navigation from folder to subfolders
    if(pathQueue.length == 0){
    	pathQueue.push(pathDir)
    	// console.log(pathQueue)
    }
    if(localStorage.getItem("project_1") !== null){
    	var project = JSON.parse(localStorage.getItem("project_1"));
    	console.log(project.folders)
    }

	fs.readdir(pathDir, function(err,dir) {
    	//parent path
    	projectJSON.parentPath = pathDir;
		// console.log("dir : "+dir)
	  	$.each(dir, function(k,f) {
			fNew = path.resolve(pathDir,f);
			if(fs.lstatSync(fNew).isDirectory()) {
				// console.log(f,fNew,fs.lstatSync(fNew).isDirectory());
				var folderPath = fNew.replace(/\\/g, "\\\\");
				if(localStorage.getItem("project_1") !== null){
					console.log("********project_1 exits******");
					if(project.folders.indexOf(fNew) == -1){
						$("#list").prepend(folderHTML({"imgURL":"./images/folder-images-icon.png","path1":folderPath,"showPath":fNew}))
						project.folders.push(fNew);
						console.log(project.folders)
					}
				}else if(localStorage.getItem("project_1") === null){
					$("#list").prepend(folderHTML({"imgURL":"./images/folder-images-icon.png","path1":folderPath,"showPath":fNew}))
					folders.push(fNew);					
				}
			} else {
				var ext = path.extname(fNew);
				// console.log(f,fNew,fs.lstatSync(fNew).isDirectory());
				if(localStorage.getItem("project_1") !== null){
					if (project.imgFiles.indexOf(fNew) == -1){
						//Validate if its image
						if($.inArray(ext,fileExtension) !== -1){
							project.imgFiles.push(fNew);
							$("#list").append(fileHTML({"imgURL":fNew,"path1":fNew,"showPath":fNew}))
						}
					}
				}else if(localStorage.getItem("project_1") === null){
					//Validate if its image
					if($.inArray(ext,fileExtension) !== -1){
						var formattedPath = fNew.replace(/\\/g, "\\\\");
						$("#list").append(fileHTML({"imgURL":fNew,"path1":fNew,"showPath":fNew,"formattedPath":formattedPath}))
						imgFiles.push(fNew);
					}
				}
				// if(localStorage.getItem("project_1") == null){					
				// 		imgFiles.push(fNew);					
				// }else{
				// 	var project = JSON.parse(localStorage.getItem("project_1"));
				// 	if (project.imgFiles.indexOf(fNew)==-1){
				// 		project.imgFiles.push(fNew);
				// 	}
				// }
			}
		});
		if(localStorage.getItem("project_1") == null){
			projectJSON.folders = folders;
			projectJSON.imgFiles = imgFiles;
			localStorage.setItem("project_1",JSON.stringify(projectJSON));
		}
	});
}

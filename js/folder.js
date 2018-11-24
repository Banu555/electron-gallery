const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

var projectJSON = {};
var folders = [];
var imgFiles = [];

$(function() {
	folderHTML = $("#folderTemplate").html();
	folderHTML = handlebars.compile(folderHTML);
	
	fileHTML = $("#fileTemplate").html();
	fileHTML = handlebars.compile(fileHTML);

	var parameters = location.search.substring(1).split("?");
	var url_string = window.location.href;
	var url = new URL(url_string);
	var pathDir = url.searchParams.get("path").replace( /'/g, "")
	// var pathDir = "D:/albums/nature/some"
	// console.log(pathDir)

	var fileExtension = ['.jpeg', '.jpg', '.png', '.gif', '.bmp'];
	fs.readdir(pathDir, function(err,dir) {
		console.log("in readdir")
		console.log(dir)
	  	$.each(dir, function(k,f) {
			fNew = path.resolve(pathDir,f);
			if(fs.lstatSync(fNew).isDirectory()) {
				console.log("**********IF directory***********")
				$("#list").prepend(folderHTML({"imgURL":"./images/folder-images-icon.png","path1":fNew}))
				// console.log(f,fNew,fs.lstatSync(fNew).isDirectory());
				//localstorage item creation
				if(localStorage.getItem("subFolder") == null){
					folders.push(fNew);					
				}else{
					//add to existing item
					var project = JSON.parse(localStorage.getItem("subFolder"));
					console.log(project)
					if(project.folders.indexOf(fNew) == -1){

						project.folders.push(fNew);
					}
				}
			} else {
				console.log("************if image*************")
				//Validate if its image
				var ext = path.extname(fNew);
				console.log(f,fNew,fs.lstatSync(fNew).isDirectory());
				//access only image type 
				if($.inArray(ext,fileExtension) !== -1){
					$("#list").append(fileHTML({"imgURL":fNew,"path1":fNew}))
				}
				//update localstorage item
				if(localStorage.getItem("subFolder") == null){					
						imgFiles.push(fNew);					
				}else{
					var project = JSON.parse(localStorage.getItem("subFolder"));
					console.log(project)
					if (project.imgFiles.indexOf(fNew)==-1){

						project.imgFiles.push(fNew);
					}

				}
			}
		});
		if(localStorage.getItem("subFolder") == null){
			projectJSON.folders = folders;
			projectJSON.imgFiles = imgFiles;

			localStorage.setItem("subFolder",JSON.stringify(projectJSON))
		}
	});

});
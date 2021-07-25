let fs = require("fs");
let path = require("path");
let types = require("./ftypes");

function orgfn(src){
// console.log("Organize command executed for the directory ",src);
    let destPath;
    if (src == undefined) {
        // destPath = process.cwd();
        return;
    } 
    else {

        let isExists = fs.existsSync(src);

        if (isExists) {
            destPath = path.join(src,"organized_files");
            if (fs.existsSync(destPath) == false) { 
                fs.mkdirSync(destPath);
            }
        } 
        
        else {

            console.log("pls enter correct path");
            return;
        }
    }

    organizeHelper(src,destPath);
}


function organizeHelper(src, dest) {
    // 3. identify categories of all the files present in that input directory  ->
    let childNames = fs.readdirSync(src);
    // console.log(childNames);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belongs to --> ", category);
            // 4. copy / cut  files to that organized directory inside of any of category folder 
            sendFiles(childAddress, dest, category);
        }
    }
}
function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    // fs.unlinkSync(srcFilePath);
    console.log(fileName, "copied to ", category);

}
function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    // console.log(ext);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}


module.exports = {
    orgFxn : orgfn  
}

/*
fs.txt belongs to -->  documents
fs.txt copied to  documents
fsbasics.js belongs to -->  jsFiles
fsbasics.js copied to  jsFiles
pathbasics.js belongs to -->  jsFiles
pathbasics.js copied to  jsFiles
*/

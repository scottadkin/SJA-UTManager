
const fs = require("fs");
const path = require("path");

const CURRENT_DIR = __dirname;

class UTManager{

    constructor(){

        this.files = [];
        this.demos = [];
        this.sshots = [];

        this.sshotDirs = [];
        this.demoDirs = [];


        this.cacheFileList = [];
        this.cacheFiles = [];
        this.cacheIndex = [];

        this.home = "SJA UTManager";

        this.bCreatedMain = false;
        this.bCreatedScreenShots = false;
        this.bCreatedDemos = false;

        this.startUpMessage();
        this.createManagerDirectory();

        this.foundCacheFolder = false;

        this.getFileList();
        this.sortFiles();
        this.moveFiles();
        this.getCacheList();
    
    }


    startUpMessage(){

        console.log('\x1b[36m',"||--------------------------------------------------------------------||",'\x1b[0m');
        console.log('\x1b[36m',"||--------------------------------------------------------------------||",'\x1b[0m');
        console.log('\x1b[36m',"||--------------- SJA UTManager Version 0.1 12.02.17 -----------------||",'\x1b[0m');
        console.log('\x1b[36m',"||--------------------------------------------------------------------||",'\x1b[0m');
        console.log('\x1b[36m',"||--------------------------------------------------------------------||",'\x1b[0m');
    }

    createManagerDirectory(){

        //const self = this;
        if(!fs.existsSync(this.home)){
            
                this.notice("Main directory not found! (First time user?) Creating directory "+this.home+".");
                fs.mkdir(this.home);
                this.createDemosDirectory();
                this.createScreenShotsDirectory();
            }else{
                this.notice("Main directory found("+this.home+").");
                this.createDemosDirectory();
                this.createScreenShotsDirectory();
            }
       


    }

    createScreenShotsDirectory(){

        if(!fs.existsSync(this.home+"/Screenshots")){
            this.notice("Screenshots directory not found! (First time user?) Creating directory Screenshots.");
            fs.mkdir(this.home+"/Screenshots");               
        }else{
            this.notice("Screenshots directory found(Screenshots).");
            
        }
  
    }

    createDemosDirectory(){


        if(!fs.existsSync(this.home+"/Demos")){
           
                this.notice("Demos directory not found! (First time user?) Creating directory Demos.");
                fs.mkdir(this.home+"/Demos");          
            }else{
                this.notice("Demos directory found(Demos).");        
            }
     
    }

    getFileList(){

        this.files = fs.readdirSync(CURRENT_DIR);
    }

    createSubDirectories(type){

        let folder = "";
        let dirs = 0;

        if(type == 0){
            folder = this.home+"/Screenshots"
            dirs = this.sshotDirs;
        }else{
            folder = this.home+"/Demos";
            dirs = this.demoDirs;
        }

        //current folder
        let cf = 0;

        for(let i = 0; i < dirs.length; i++){

            cf = dirs[i];

            if(fs.existsSync(folder+"/"+cf)){
                this.notice("Sub Directory already exists! ("+folder+"/"+cf+")");
            }else{
                this.notice("Making sub directory ("+folder+"/"+cf+")");
                fs.mkdirSync(folder+"/"+cf);
            }
        }

    }

    stripExt(file){

        let reg = new RegExp("(.+?)\..+$","i");

        if(reg.test(file)){
            console.log("84y3v086vy3096v0394v609v340");
        }else{
            console.log("NOoooooooooo");
        }
    }

    sortFiles(){

        //current file
        let cf = "";
        //current file data
        let cd = "";

        this.log("Sorting files");

        let z = "";
        let fd = ""; // file directory, where the file is going to be mvoed to,

        for(let i = 0; i < this.files.length; i++){

            cf = this.files[i];

            if(this.bScreenShot(cf)){

                this.log(cf+" is a screenshot.");

                
                z = fs.statSync(cf);
                z = z.mtime;
                z.getDate();

                //this.stripExt(cf);

                this.sshots.push(
                    {
                        "name": cf,
                        "seconds": z.getSeconds(),
                        "minutes": z.getMinutes(),
                        "hours": z.getHours()+1,
                        "day": z.getDate(),
                        "month": z.getMonth()+1,
                        "year": z.getFullYear()
                    }
                );


                cd = this.sshots[this.sshots.length - 1];
                fd = cd.year+"_"+cd.month+"_"+cd.day;

                
                
                cd.dir = fd;
                cd.newname = fd+"_"+cd.hours+"_"+cd.seconds+"_"+Math.floor(Math.random()*9999);

                if(this.sshotDirs.indexOf(fd) === -1){
                    this.sshotDirs.push(fd);
                }
                
                

                
            }else if(this.bDemo(cf)){

                this.log(cf+" is a demo.");
                if(!this.bDemoCurrentlyActive(cf)){


                    z = fs.statSync(cf);
                    z = z.mtime;
                    z.getDate();

                this.demos.push(
                    {
                        "name": cf,
                        "seconds": z.getSeconds(),
                        "minutes": z.getMinutes(),
                        "hours": z.getHours()+1,
                        "day": z.getDate(),
                        "month": z.getMonth()+1,
                        "year": z.getFullYear()
                    }
                );

                //console.log(this.demos[this.demos.length-1]);
               
              // console.log("DIR = "+fd);
                cd = this.demos[this.demos.length - 1];
                fd = cd.year+"_"+cd.month+"_"+cd.day;
                
                cd.dir = fd;
                // add new name
                cd.newname = fd+"_"+cd.hours+"_"+cd.seconds+"_"+Math.floor(Math.random()*9999);

                if(this.demoDirs.indexOf(fd) === -1){
                    this.demoDirs.push(fd);
                }

                }else{
                    this.notice(cf+" is currently being recorded to, ignoring!");
                }
            }
        }

        this.notice("Found "+this.sshots.length+" screenshots to move.");
        this.notice("Found "+this.demos.length+" demos to move.");


    }

    bFileBusy(){

    }

    moveScreenshots(){

        this.log("Moving screenshots");

        for(let i = 0; i < this.sshots.length; i++){


            fs.open(this.sshots[i].name,"r+",(err, stats) =>{

                if(err){
                    if(err.code == "EBUSY"){
                        this.error("Failed to process "+this.sshots[i].name+", the file is currently in use by another process!");
                        this.error("Skipping file "+this.sshots[i].name);
                    }
                }else{
                    fs.createReadStream(this.sshots[i].name).pipe(fs.createWriteStream(this.home+"/Screenshots/"+this.sshots[i].dir+"/"+this.sshots[i].name));
                    this.notice("Moving "+this.sshots[i].name+"\" to \""+this.sshots[i].dir+"/"+this.sshots[i].name+"\"");
                    fs.unlinkSync(this.sshots[i].name);
                    this.notice("Deleting old file!");
                }
            });        
        }
    }

    moveDemos(){

        this.log("Moving demos.");

        for(let i = 0; i < this.demos.length; i++){

            fs.open(this.demos[i].name,"r+",(err, stats) =>{

                if(err){ 

                    if(err.code == "EBUSY"){
                        this.error("Failed to process "+this.demos[i].name+", the file is currently in use by another process!");
                        this.error("Skipping file "+this.demos[i].name);
                    }

                }else{

                    fs.createReadStream(this.demos[i].name).pipe(fs.createWriteStream(this.home+"/Demos/"+this.demos[i].dir+"/"+this.demos[i].name));
                    this.notice("Moving "+this.demos[i].name+"\" to \""+this.demos[i].dir+"/"+this.demos[i].name);    
                    fs.unlinkSync(this.demos[i].name);
                    this.notice("Deleting old file!");
                }
                
            });           
        }
    }

    moveFiles(){

        this.log("Moving files.");

        this.createSubDirectories(0);
        this.createSubDirectories(1);
        this.moveScreenshots();
        this.moveDemos();


    }

    bDemoCurrentlyActive(file){

        let stats = fs.statSync(file);

        if(stats.size == 0)
            return true;
        
        return false;
    }

    isFileA(file, regexp){

        let reg = new RegExp(regexp,'i');

        if(reg.test(file))
            return true;

        return false;
    }

    bScreenShot(file){

        return this.isFileA(file,"shot0...\.bmp$");
    }

    bDemo(file){
        return this.isFileA(file,".+\.dem$");
    }

    notice(message){
        console.log('\x1b[33m',"[Notice]: "+message, '\x1b[0m');
    }

    log(message){
        console.log('\x1b[32m',"[Log]:    "+message,'\x1b[0m');
    }

    error(message){
        console.log('\x1b[31m',"[ERROR]:  "+message, '\x1b[0m');
    }


    getCacheList(){ 


        fs.readFile("../Cache/cache.ini", (err, data) =>{
            if(err){
                this.error("Couldn't read ../Cache/cache.ini, skipping.");
            }else{

                this.log("Reading cache.ini");
                data = data.toString();

                let lines = [];

                let reg = new RegExp("(.+?)\r\n","gim");
            //    let reg = new RegExp("=","gim");

                let a = data.match(reg);

                for(let i = 0; i < a.length; i++){
                    a[i] = a[i].replace("\r\n","");
                }

                this.cacheFileList = a;

                this.notice("Found "+(a.length-1)+" cache files to convert.");

                this.moveCacheFiles();
            }
        });
    }

    findAndConvertCacheFile(filename){

        let folder = "";

        for(let i = 0; i < this.cacheIndex.length; i++){

            if(this.cacheIndex[i].uxx == filename.replace(".uxx","")){
                folder = this.getFileTypeFolder(this.cacheIndex[i].file);
                //convert File
                this.getFileTypeFolder(this.cacheIndex[i].file);
                this.notice("Converting ../Cache/"+this.cacheIndex[i].uxx+".uxx to "+folder+this.cacheIndex[i].file);
                fs.createReadStream("../Cache/"+this.cacheIndex[i].uxx+".uxx").pipe(fs.createWriteStream(folder+this.cacheIndex[i].file));
                fs.unlinkSync("../Cache/"+this.cacheIndex[i].uxx+".uxx");
                return;
            }
        }

    }

    createCacheIndex(){

        let tempObjects = [];

        this.notice("Creating cache index.");

        let reg = new RegExp("^(.+?)=(.+?)$","i");

        let currentResult = "";

        for(let i = 0; i < this.cacheFileList.length; i++){
            currentResult = this.cacheFileList[i].match(reg);

            if(currentResult != null){
                tempObjects.push({"uxx":currentResult[1],"file":currentResult[2]});

            }
        }

        this.cacheIndex = tempObjects;

    }


    getFileTypeFolder(file){

        //types .u(ufile) .ini(config) .utx(texture) .umx(music) .uax(audio) .unr(map)

        let reg = new RegExp("^.+?\\.(.+?)$","i");
        
        let result = file.match(reg);
        let ext = result[1];

        switch(ext){
            case "u": {     return "" } break;// current folder
            case "uax": {   return "../Sounds/" } break;
            case "umx": {   return "../Music/" } break;
            case "utx": {   return "../Textures/" } break;
            case "unr": {   return "../Maps/" } break;
            default: {      return "" } 
        }
    }


    deleteCacheFile(){

        fs.writeFile("../Cache/cache.ini","[Cache]\r\n");
    }

    moveCacheFiles(){

        let dir = "../cache/";
       

        if(fs.access(dir,(err) =>{
            if(err){
                this.error("Cache folder not found.");
                this.error("Skipping Cache files conversion.");
                return;
            }else{
                this.notice("Found cache folder.");
                
                this.cacheFiles = fs.readdirSync(dir);

                this.createCacheIndex();

//                console.log(this.cacheFileList);
                for(let i = 0; i < this.cacheFiles.length; i++){
                    //this.log("Found Cache file "+this.cacheFiles[i]);
                    //console.log(this.cacheFiles[i].replace(".uxx",""));
                    this.findAndConvertCacheFile(this.cacheFiles[i]);
                    //fs.createReadStream(this.cacheFiles[i].name).pipe(fs.createWriteStream(this.home+"/Demos/"+this.demos[i].dir+"/"+this.demos[i].name));

                }
            }
        }));

        this.deleteCacheFile();
        

    }

}



const Test1 = new UTManager();

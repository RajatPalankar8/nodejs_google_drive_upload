const fs = require('fs');
const { google }= require('googleapis');

const apikeys = require('./apikeys.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

async function uploadFile(authClient){
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient});

        var fileMetaData = {
            name:'mydrivetext.txt',
            parents:['1bZoTbqCew34MGr1DfgczcA40ECM_QhKg']
        }

        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream('mydrivetext.txt'),
                mimeType:'text/plain'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            resolve(file);
        })
    });
}

authorize().then(uploadFile).catch("error",console.error());

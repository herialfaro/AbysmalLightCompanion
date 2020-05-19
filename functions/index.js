//console.log(functions.auth.user().currentUser.uid);

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// Automatically allow cross-origin requests
//app.use(cors({ origin: true }));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });

 //http callable function
 
exports.callHello = functions.https.onCall((data, context) => {
    const name = data.name;
    return `hello, ${name}`;
});

// auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('user').doc(user.uid).set(
        {
            abysmalcoins: 20,
            bungieid: '',
            bungietype: 0,
            clanpoints: 0,
            dailymessage: true,
            displayname: '',
            isadmin: false,
            isinacademy: false,
            isincamp: false,
            lastdailycoins: admin.firestore.FieldValue.serverTimestamp(),
            rankid: 'nCijJ085MDcKLkLGnXxS',
            rankup: false
        }
    );
  });
  
  // auth trigger (user deleted)
  exports.userDeleted = functions.auth.user().onDelete(user => {
    const doc = admin.firestore().collection('user').doc(user.uid);
    return doc.delete();
  });

  //firestore call update bungieinfo
  exports.updateBungieInfo = functions.https.onCall(async(data,context) => {
      if(!context.auth)
      {
          throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
      }
      const snapshot = await admin.firestore().collection('user').doc(context.auth.uid).update(
          {
              bungieid: data.bungieInfo.destinyUserInfo.membershipId,
              bungietype: data.bungieInfo.destinyUserInfo.membershipType,
              displayname: data.bungieInfo.destinyUserInfo.displayName
          }
      );
      return {
        reference: snapshot.id
    }
  });

  //firestore call add report
  exports.addReport = functions.https.onCall(async(data, context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('report').add({
        description: data.description,
        name: data.displayname,
        userid: context.auth.uid
    });
    return {
        reference: snapshot.id
    }
  });

  //firestore call delete fireteam
  exports.deleteFireteam = functions.https.onCall(async(data, context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const fireteam = await admin.firestore().collection('fireteam').doc(data.ftid).get();
    if(context.auth.uid !== fireteam.data().creatorid)
    {
        throw new functions.https.HttpsError('forbidden','only creators can delete fireteams');
    }
    const snapshot = await admin.firestore().collection('fireteam').doc(data.ftid).delete();
    return {
        reference: snapshot.id
    }
  });

  //firestore call leave fireteam
  exports.leaveFireteam = functions.https.onCall(async(data, context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('fireteam').doc(data.ftid).collection('players').doc(data.playerid).delete();
    return {
        reference: snapshot.id
    }
  });

  //firestore call join fireteam
  exports.joinFireteam = functions.https.onCall(async(data, context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('fireteam').doc(data.ftid).collection('players').doc().set(
        {
            character: data.uclass,
            level: data.ulevel,
            playername: data.uname,
            userid: context.auth.uid
        }
    );
    return {
        reference: snapshot.id
    }
  });

  //firestore call update is full variable
  exports.updateIsFullFireteam = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('fireteam').doc(data.ftid).update(
        {
            isfull: data.fireteamfull
        }
    );
    return {
        reference: snapshot.id
    }
  });

  //firestore call update bandpostkey variable
  exports.updateBANDKeyFireteam = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('fireteam').doc(data.ftid).update(
        {
            bandpostkey: data.bandpostkey
        }
    );
    return {
        reference: snapshot.id
    }
  });

  //firestore call add fireteam and return id
  exports.addFireteam = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('fireteam').add({
        bandpostkey: data.bandpostkey,
        creatorid: data.creatorid,
        datecreated: admin.firestore.FieldValue.serverTimestamp(),
        fireteamactivityid: data.fireteamactivityid,
        enterscoinbet: data.coinbet,
        isfull: data.isfull,
        platform: data.platform,
        programcode: data.programcode,
        requiresmic: data.requiresmic

    });
    return {
        reference: snapshot.id
    }
  });

  //firestore call update band access token variable
  exports.deleteBANDAccessToken = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('bandaccesstoken').doc(context.auth.uid).delete();
    return {
        reference: snapshot.id
    }
  });

  exports.addBANDAccessToken = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const snapshot = await admin.firestore().collection('bandaccesstoken').doc(context.auth.uid).set(
        {
            token: data.token
        }
    );
    return {
        reference: snapshot.id
    }
  })

  exports.requestBANDToken = functions.https.onRequest((request, response) => {
    const cors = require('cors')({origin:true});
    var rp = require('request-promise');
    cors(request, response, () => {

        let _uri = `https://auth.band.us/oauth2/token?grant_type=authorization_code&code=${request.query.code}`;
        let _headers = {
            'Authorization': `Basic MjgyNjU4MzAwOnRqMW5SSFRnNFhlTDdqeWhTMi1iRGRuR3dKWWFiek5M`
        }

        var options = {
            method: 'POST',
            uri: _uri,
            headers: _headers,
            json: true
        };

        rp(options)
            .then(parsedBody => {
                return response.send(parsedBody);
            })
            .catch(err => {
                throw response.status(500).send(err)
                //.... Please refer to the following official video: https://www.youtube.com/watch?v=7IkUgCLr5oA&t=1s&list=PLl-K7zZEsYLkPZHe41m4jfAxUi0JjLgSM&index=3
            });

    });

    });

    exports.requestStreamRent = functions.https.onCall(async(data,context) => {
        if(!context.auth)
        {
            throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
        }
        if(!data.requestcode)
        {
            throw new functions.https.HttpsError('invalid code','stream code cannot be empty');
        }
        const highlight = await admin.firestore().collection('currentvideo').where('platform','==',0).get();
        const streaminfo = await admin.firestore().collection('addstream').get();
        var highlightvideo;
        var highlightplan;
        var highlightdate;
        var additionaltime;
        var abysmalcoinscost;
        highlight.docs.forEach(doc => {
            highlightvideo = doc.id;
            highlightplan = doc.data().plan;
            highlightdate = doc.data().dateupdated.seconds;
        });
        streaminfo.docs.forEach(info => {
        if(!info.data().enabled)
        {
            throw new functions.https.HttpsError('mode disabled','stream rent is not enabled');
        }
        if(highlightplan === "standard")
        {
          additionaltime = info.data().standardtime;
        }
        else if (highlightplan === "free")
        {
          additionaltime = info.data().freetime;
        }
        else if (highlightplan === "extra1")
        {
          additionaltime = info.data().extra1time;
        }
        else if (highlightplan === "extra2")
        {
          additionaltime = info.data().extra2time;
        }

        if(data.requestplan === "standard")
        {
            abysmalcoinscost = info.data().standardcost;
        }
        else if (data.requestplan === "free")
        {
            abysmalcoinscost = info.data().freecost;
        }
        else if (data.requestplan === "extra1")
        {
            abysmalcoinscost = info.data().extra1cost;
        }
        else if(data.requestplan === "extra2")
        {
            abysmalcoinscost = info.data().extra2cost;
        }
        });
        var predictiontime = (additionaltime*60000) + (highlightdate*1000);
        var timenow = Date.now();
        if(timenow <= predictiontime)
        {
            throw new functions.https.HttpsError('anticipation','there is still time left in the current spot');
        }
        const currentuser = await admin.firestore().collection('user').doc(context.auth.uid).get();
        if(abysmalcoinscost > currentuser.data().abysmalcoins)
        {
            throw new functions.https.HttpsError('insufficient','insuficcient coins');
        }
        const coinupdate = (currentuser.data().abysmalcoins) - abysmalcoinscost;
        if(isNaN(coinupdate))
        {
            throw new functions.https.HttpsError('nan','there was an error with the coin transaction');
        }
        await admin.firestore().collection('user').doc(context.auth.uid).update(
            {
                abysmalcoins: coinupdate
            }
        );
        const new_video = await admin.firestore().collection('video').add(
            {
                code: data.requestcode,
                videotype: data.requestplatform
            }
        );
        await admin.firestore().collection('currentvideo').doc(highlightvideo).update(
            {
                videoid: new_video.id,
                plan: data.requestplan,
                dateupdated: admin.firestore.FieldValue.serverTimestamp(),
                updatebyuser: context.auth.uid
            }
        );
        return {
            reference: new_video.id
        }
        
    });

    exports.checkDailyItems = functions.https.onCall(async(data,context) => {
        if(!context.auth)
        {
            throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
        }
        var giveDailyItems = false;
        var giveDailyMessage;
        var giveDailyCoins;
        var abysmalcoinsgift;
        const snapshot = await admin.firestore().collection('user').doc(context.auth.uid).get();
        if(snapshot.data().dailymessage)
        {
            const dailymessageinfo = await admin.firestore().collection('dailymessage').get();
            dailymessageinfo.docs.forEach(info => {
                if(info.data().active)
                {
                    const lastcheckdate = snapshot.data().lastdailycoins.seconds;
                    const stamptime = lastcheckdate*1000;
                    const now = Date.now();
                    const datenow = new Date(now);
                    const year = datenow.getFullYear();
                    const month = datenow.getMonth();
                    const day = datenow.getDate();
                    const today = new Date(year,month,day);
                    const todaytime = today.getTime();
                    if(stamptime >= todaytime)
                    {
                        throw new functions.https.HttpsError('anticipation','a day has not passed since last check');
                    }
                    abysmalcoinsgift = info.data().dailycoins;
                    giveDailyCoins = (snapshot.data().abysmalcoins) + abysmalcoinsgift;
                    if(isNaN(giveDailyCoins))
                    {
                        throw new functions.https.HttpsError('nan','there was an error with the coin transaction');
                    }
                    giveDailyItems = true;
                    giveDailyMessage = info.data().message;
                }
            });
            if(giveDailyItems)
            {
                await admin.firestore().collection('user').doc(context.auth.uid).update(
                    {
                        abysmalcoins: giveDailyCoins,
                        lastdailycoins: admin.firestore.FieldValue.serverTimestamp()
                    }
                );
            }
        }
        return {
            reference: giveDailyItems,
            message: giveDailyMessage,
            coins: abysmalcoinsgift
        }
    });

  //http authorizarion request

  //exports.GetBandAccessToken = functions.https.onRequest((req,res) => {
      
    /*const cors = require('cors')({origin:true});
    cors(request, response, () => {});
    var rp = require('request-promise');
    //await cors(req, res, () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic MjgyNjU4MzAwOnRqMW5SSFRnNFhlTDdqeWhTMi1iRGRuR3dKWWFiek5M");
    
    var options = {
        method: 'GET',
        uri: data.url,
        headers: myHeaders,
        json: true
    }

    var response = await rp(options);
    return response;*/

  //});
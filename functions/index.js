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
            displayhighlight: true,
            dailymessage: true,
            displayname: '',
            isadmin: false,
            isinacademy: false,
            isincamp: false,
            lastdailycoins: admin.firestore.FieldValue.serverTimestamp(),
            preference: 1,
            rankid: 'nCijJ085MDcKLkLGnXxS',
            rankup: false,
            temporalpoints: 0
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

  //firestore call update temporalpoints
  exports.updateTemporalPoints = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const admincheck = await admin.firestore().collection('user').doc(context.auth.uid).get();
    if(!admincheck.data().isadmin)
    {
        throw new functions.https.HttpsError('unauthenticated','only admins can add requests');
    }
    const snapshot = await admin.firestore().collection('user').doc(data.userid).update(
        {
            temporalpoints: data.temporalpoints
        }
    );
    return {
      reference: snapshot.id
  }
  });

  //firestore call update rankup only
  exports.updateRankUpOnly = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const admincheck = await admin.firestore().collection('user').doc(context.auth.uid).get();
    if(!admincheck.data().isadmin)
    {
        throw new functions.https.HttpsError('unauthenticated','only admins can add requests');
    }
    const snapshot = await admin.firestore().collection('user').doc(data.userid).update(
        {
            rankup: data.rankup
        }
    );
    return {
      reference: snapshot.id
  }
});

  //firestore call update ongoingcheck only
  exports.updateOngoingCheck = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const admincheck = await admin.firestore().collection('user').doc(context.auth.uid).get();
    if(!admincheck.data().isadmin)
    {
        throw new functions.https.HttpsError('unauthenticated','only admins can add requests');
    }
    var recordid;
    const pointsrecord = await admin.firestore().collection('pointsrecord').get();
    pointsrecord.forEach(record => {
        recordid = record.id;
    });
    const snapshot = await admin.firestore().collection('pointsrecord').doc(recordid).update(
        {
            ongoingcheck: data.ongoingcheck,
            ongoingmark: admin.firestore.FieldValue.serverTimestamp()
        }
    );
    return {
      reference: snapshot.id
  }
});

  //firestore call override ongoingcheck
  exports.overrideOngoingCheck = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const admincheck = await admin.firestore().collection('user').doc(context.auth.uid).get();
    if(!admincheck.data().isadmin)
    {
        throw new functions.https.HttpsError('unauthenticated','only admins can add requests');
    }
    var recordid;
    const pointsrecord = await admin.firestore().collection('pointsrecord').get();
    pointsrecord.forEach(record => {
        recordid = record.id;
    });
    const record = await admin.firestore().collection('pointsrecord').doc(recordid).get();
    if(!(record.data().ongoingcheck))
    {
        throw new functions.https.HttpsError('invalid','ongoingcheck is already false');
    }
    const now = Date.now();
    const checkdate = record.data().ongoingmark.seconds;
    const checkmark = (checkdate * 1000) + 10800000;
    if(now < checkmark)
    {
        throw new functions.https.HttpsError('anticipation','three hours have not yet passed since last check');
    }
    const snapshot = await admin.firestore().collection('pointsrecord').doc(recordid).update(
        {
            ongoingcheck: false,
            ongoingmark: admin.firestore.FieldValue.serverTimestamp()
        }
    );
    return {
      reference: snapshot.id
  }
});

  //firestore call update users rank
  exports.updateUsersRanks = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    const admincheck = await admin.firestore().collection('user').doc(context.auth.uid).get();
    if(!admincheck.data().isadmin)
    {
        throw new functions.https.HttpsError('unauthenticated','only admins can add requests');
    }
    const allusers = await admin.firestore().collection('user').get();
    const ranks = await admin.firestore().collection('rank').orderBy('pointsneeded').get();
    var snapshotlist = [];
    allusers.forEach(user => {
        var totalpoints = user.data().clanpoints;
        const currentrank = user.data().rankid;
        const temppoints = user.data().temporalpoints;
        totalpoints += temppoints;
        var newrank = currentrank;
        var rankup = false;
        ranks.forEach(rank => {
            if(totalpoints >= rank.data().pointsneeded)
            {
                newrank = rank.id;
            }
        });
        if(newrank !== currentrank)
        {
            rankup = true;
        }
        const updaterank = admin.firestore().collection('user').doc(user.id).update(
            {
                clanpoints: totalpoints,
                rankup: rankup,
                rankid: newrank
            }
        );
        snapshotlist.push(updaterank);
    });
    await Promise.all(snapshotlist);
    var recordid;
    const pointsrecord = await admin.firestore().collection('pointsrecord').get();
    pointsrecord.forEach(record => {
        recordid = record.id;
    });
    const snapshot = await admin.firestore().collection('pointsrecord').doc(recordid).update(
        {
            lastadminchecked: context.auth.uid,
            lastcheck: admin.firestore.FieldValue.serverTimestamp(),
            ongoingcheck: false
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
    if((data.ulevel > 1100) || (data.ulevel < 750))
    {
        throw new functions.https.HttpsError('invalid level','level is beyond acceptable parameters');
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
  });

  exports.addMentorPost = functions.https.onCall(async(data,context) => {
    if(!context.auth)
    {
        throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
    }
    if(data.p_description.lenght > 500)
    {
        throw new functions.https.HttpsError('string lenght exceeded','post description cannot exceed 500 characters');
    }
    var ismentor = false;
    var p_mentorid;
    const mentors = await admin.firestore().collection('mentors').where('programcode','==',data.p_programcode).get();
    mentors.docs.forEach(info => {
        if(info.data().userid === context.auth.uid)
        {
            ismentor = true;
            p_mentorid = info.id;
        }
    });
    if(ismentor)
    {
        const snapshot = await admin.firestore().collection('mentorpost').add(
            {
                currentvideoid: data.p_currentvideoid,
                dateadded: admin.firestore.FieldValue.serverTimestamp(),
                description: data.p_description,
                fireteamid: data.p_fireteamid,
                mentorid: p_mentorid,
                programcode: data.p_programcode,
                title: data.p_title
            }
        );
        return {
            reference: snapshot.id
        }
    }
    else
    {
        throw new functions.https.HttpsError('unautorized','user is not a mentor');
    }
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

    exports.addProjectStream = functions.https.onCall(async(data,context) => {
        if(!context.auth)
        {
            throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
        }
        if(!data.requestcode)
        {
            throw new functions.https.HttpsError('invalid code','stream code cannot be empty');
        }
        var requesttag;
        switch(data.requestprogram)
        {
            case 1:
                switch(data.requestchannel)
                {
                   case '1':
                    requesttag = 'Video Campamento 1';
                   break;
                   case '2':
                    requesttag = 'Video Campamento 2';
                   break;
                   case '3':
                    requesttag = 'Video Campamento 3';
                   break;
                   default:
                   throw new functions.https.HttpsError('invalid channel','channel code cannot be null');
                }
                break;
            case 2:
                switch(data.requestchannel)
                {
                   case '1':
                    requesttag = 'Video Academia 1';
                   break;
                   case '2':
                    requesttag = 'Video Academia 2';
                   break;
                   case '3':
                    requesttag = 'Video Academia 3';
                   break;
                   default:
                   throw new functions.https.HttpsError('invalid channel','channel code cannot be null');
                }
                break;
            default:
                throw new functions.https.HttpsError('invalid program','program code cannot be null');
        }
        const projectstream = await admin.firestore().collection('currentvideo').where('tag','==',requesttag).get();
        var streamchannelid;
        projectstream.docs.forEach(doc => {
            streamchannelid = doc.id;
        });

        const new_video = await admin.firestore().collection('video').add(
            {
                code: data.requestcode,
                videotype: data.requestplatform
            }
        );

        const update_video = await admin.firestore().collection('currentvideo').doc(streamchannelid).update(
            {
                videoid: new_video.id,
                dateupdated: admin.firestore.FieldValue.serverTimestamp(),
                updatebyuser: context.auth.uid
            }
        );
        return {
            reference: streamchannelid
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

    exports.updateRecieveDaily = functions.https.onCall(async(data,context) => {
        if(!context.auth)
        {
            throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
        }
        const snapshot = await admin.firestore().collection('user').doc(context.auth.uid).update(
            {
                dailymessage: data.settings
            }
        );
        return {
            reference: snapshot.id
        }
    });

    exports.updatePreference = functions.https.onCall(async(data,context) => {
        if(!context.auth)
        {
            throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
        }
        const snapshot = await admin.firestore().collection('user').doc(context.auth.uid).update(
            {
                preference: data.settings
            }
        );
        return {
            reference: snapshot.id
        }
    });

    exports.updateShowStream = functions.https.onCall(async(data,context) => {
        if(!context.auth)
        {
            throw new functions.https.HttpsError('unauthenticated','only authenticated users can add requests');
        }
        const snapshot = await admin.firestore().collection('user').doc(context.auth.uid).update(
            {
                displayhighlight: data.settings
            }
        );
        return {
            reference: snapshot.id
        }
    });

    exports.requestBANDToken = functions.https.onRequest(async(request, response) => {
        const cors = require('cors')({origin:true});
        var rp = require('request-promise');
        cors(request, response, () => {
            const bandkey = request.query.bandkey;
    
            let _uri = `https://auth.band.us/oauth2/token?grant_type=authorization_code&code=${request.query.code}`;
            let _headers = {
                'Authorization': bandkey
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
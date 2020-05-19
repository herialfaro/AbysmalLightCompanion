const signOut = document.querySelector('.sign-out');

const activity = document.querySelector('#activity-name');
const details = document.querySelector('#fireteam-details');

const classList = document.querySelector('#class-list');
const levelSelector = document.querySelector('#level');
const deleteButton = document.querySelector('.delete-fireteam');
const joinButton = document.querySelector('.join-fireteam');
const leaveButton = document.querySelector('.leave-fireteam');
const campDesc = document.querySelector('.camp-fireteam');
const academyDesc = document.querySelector('.academy-fireteam');
const joinError = document.querySelector('.cannot-join');
const deleteError = document.querySelector('.cannot-delete');
const leaveError = document.querySelector('.cannot-leave');
const loading = document.querySelector('.loading');

const containerClass = document.querySelectorAll('.container');

const ftyoutubePlayer = document.querySelector('.video-youtube');
const ftmixerPlayer = document.querySelector('.video-mixer');
const fttwitchPlayer = document.querySelector('.video-twitch');

auth.onAuthStateChanged(user => {
    if (user)
    {
        if(fireteamid)
        {
            //loads highlight
    db.collection('currentvideo').where('platform','==',0).get().then(
        (snapshot) => {
          snapshot.docs.forEach(
            doc => {
              db.collection('video').doc(doc.data().videoid).get().then(
                (videoSnapshot) => {
                  var type = videoSnapshot.data().videotype;
                  if(type == 1)
                  {
                    ftmixerPlayer.src = `https://mixer.com/embed/player/${videoSnapshot.data().code}?disableLowLatency=1`;
                    ftmixerPlayer.classList.remove('hidden');
                  }
                  else if(type == 2)
                  {
                    fttwitchPlayer.src = `https://player.twitch.tv/?channel=${videoSnapshot.data().code}`;
                    fttwitchPlayer.classList.remove('hidden');
                  }
                  else if(type == 0)
                  {
                    ftyoutubePlayer.src = `https://www.youtube.com/embed/${videoSnapshot.data().code}`;
                    ftyoutubePlayer.classList.remove('hidden');
                  }
                }
              )
            }
          );
        }
      );


            var fireteamdata;
            var players;
            var activityid;
            db.collection('fireteam').doc(fireteamid).get().then(
                (snapshot) => {
                    //MAKE SURE TO LOOK FOR EXTRAS LATER
                    var fireteamfull;
                    var fireteammic;
                    fireteamdata = snapshot.data();
                    if(fireteamdata.isfull)
                    {
                        fireteamfull = "Sí";
                    }
                    else
                    {
                        fireteamfull = "No";
                    }

                    if(fireteamdata.requiresmic)
                    {
                        fireteammic = "Sí";
                    }
                    else
                    {
                        fireteammic = "No";
                    }

                    details.textContent = `Escuadra llena: ${fireteamfull} | Requiere mic: ${fireteammic} | Plataforma: ${fireteamdata.platform}`;
                    activityid = fireteamdata.fireteamactivityid;
                    return db.collection('activity').get();
                }
              ).then((activitySnapshot) => {
                  var checkextras = true;
                activitySnapshot.docs.forEach(doc => {
                    if(doc.id == activityid)
                    {
                        checkextras = false;
                        activity.textContent = doc.data().name;
                    }
                });
                if(checkextras)
                {
                    db.collectionGroup('extra').get().then((extraSnapshot) => {
                        extraSnapshot.docs.forEach(doc => {
                            if(doc.id == activityid)
                            {
                                activity.textContent = doc.data().name;
                            }
                        });
                    });
                }
                return db.collection('fireteam').doc(fireteamid).collection('players').get();
              }).then((playersSnapshot) => {
                  var count = 1;
                  playersSnapshot.docs.forEach(doc => {
                    const p = document.querySelector(`#p${count}`);
                    p.textContent = `${doc.data().playername} ${doc.data().character} ${doc.data().level}`;
                  count++;
                  });
                  containerClass.forEach(element => element.classList.remove('hidden'));
                  players = playersSnapshot;
                  return db.collection('user').doc(user.uid).get();
              }).then((userSnapshot) => {
                  if(userSnapshot.data().displayname)
                  {
                    if(!userSnapshot.data().isincamp && fireteamdata.programcode == 1)
                    {
                        campDesc.classList.remove('hidden');
                    }
                    else if (!userSnapshot.data().isinacademy && fireteamdata.programcode == 2)
                    {
                        academyDesc.classList.remove('hidden');
                    }
                    else
                    {
                        if(fireteamdata.creatorid == user.uid)
                        {
                            deleteButton.classList.remove('hidden');
                        }
                        else
                        {
                            var playerfound = false;
                            players.docs.forEach(player => {
                                if(player.data().userid == user.uid)
                                {
                                    playerfound = true;
                                }
                            });
                            if(playerfound)
                            {
                                leaveButton.classList.remove('hidden');
                            }
                            else
                            {
                                joinButton.classList.remove('hidden');
                            }
                        }
                    }
                  }
                  else
                  {
                    window.location.replace('index.html');
                  }
              }).catch(error => {window.location.replace('404.html')});
        }
        else
        {
            window.location.replace('404.html');
        }
    }
    else
    {
        window.location.replace('index.html');
    }
});

//DELETE FIRETEAM
deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    deleteButton.classList.add('hidden');
    loading.classList.remove('hidden');
    db.collection('fireteam').doc(fireteamid).get().then((snapshot) => {
    var new_deletion = {
        ftid: fireteamid,
        creatorid: snapshot.data().creatorid
      }
      const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
      deleteFireteam(new_deletion)
    .then(() => {
      window.location.replace('index.html');
    })
    .catch(error => {deleteError.classList.remove('hidden')
    loading.classList.add('hidden')});
})
});

//LEAVE FIRETEAM
leaveButton.addEventListener('click', (e) => {
    e.preventDefault();
    leaveButton.classList.add('hidden');
    loading.classList.remove('hidden');
    var fireteamdata;
    var playerexists;
    var currentplayer;
    db.collection('fireteam').doc(fireteamid).get().then((snapshot) => {
        fireteamdata = snapshot.data();
        return db.collection('fireteam').doc(fireteamid).collection('players').get();
    }).then((playersSnapshot) => {
        playerexists = false;
        playersSnapshot.docs.forEach(doc => {
            if(auth.currentUser.uid == doc.data().userid)
            {
                playerexists = true;
                currentplayer = doc;
            }
        });
        if(playerexists)
        {
            var new_removal = {
                ftid: fireteamid,
                playerid: currentplayer.id
              }
              const leaveFireteam  = firebase.functions().httpsCallable('leaveFireteam');
              leaveFireteam(new_removal)
              .then(() => {
                var new_update = {
                    ftid: fireteamid,
                    fireteamfull: false
                }
                const updateIsFullFireteam  = firebase.functions().httpsCallable('updateIsFullFireteam');
                updateIsFullFireteam(new_update).then(() => {
                    window.location.reload(true);
                });
              })
              .catch(error => {leaveError.classList.remove('hidden')
              loading.classList.add('hidden')});
        }
        else
        {
            leaveError.classList.remove('hidden');
            loading.classList.add('hidden');
        }
    });
});

//ADD PLAYER TO FIRETEAM
joinButton.addEventListener('click', (e) => {
    e.preventDefault();
    joinButton.classList.add('hidden');
    loading.classList.remove('hidden');
    var fireteamdata;
    var playerexists;
    var countplayers;
    var checkextras;
    var numofplayers
    db.collection('fireteam').doc(fireteamid).get().then((snapshot) => {
        fireteamdata = snapshot.data();
        return db.collection('fireteam').doc(fireteamid).collection('players').get();
    }).then((playersSnapshot) => {
        playerexists = false;
        countplayers = 0;
        playersSnapshot.docs.forEach(doc => {
            if(auth.currentUser.uid == doc.data().userid)
            {
                playerexists = true;
            }
            countplayers++;
        });
        return db.collection('activity').get();
    }).then((activitySnapshot) => {
        checkextras = true;
        numofplayers = 0;
                activitySnapshot.docs.forEach(doc => {
                    if(doc.id == fireteamdata.fireteamactivityid)
                    {
                        checkextras = false;
                        numofplayers = doc.data().maxplayers;
                    }
                });
            return db.collection('user').doc(auth.currentUser.uid).get()
    }).then((userSnapshot) => {
        if(checkextras)
                {
                    db.collectionGroup('extra').get().then((extraSnapshot) => {
                        extraSnapshot.docs.forEach(doc => {
                            if(doc.id == fireteamdata.fireteamactivityid)
                            {
                                numofplayers = doc.data().maxplayers;
                            }
                        });

                        if(!playerexists)
                    {
                        if(fireteamdata.isfull)
                        {
                            joinError.classList.remove('hidden');
                            loading.classList.add('hidden');
                        }
                        else
                        {
                            var isftfull = false;

                            if(countplayers >= (numofplayers - 1))
                            {
                                isftfull = true;
                            }

                            var update_fireteam = {
                                ftid: fireteamid,
                                fireteamfull: isftfull
                            }
                            const updateIsFullFireteam  = firebase.functions().httpsCallable('updateIsFullFireteam');
                            updateIsFullFireteam(update_fireteam);
                            
                            var new_player = {
                                uname: userSnapshot.data().displayname,
                                uclass: classList.value,
                                ftid: fireteamid,
                                ulevel: levelSelector.value
                              }
                            const joinFireteam  = firebase.functions().httpsCallable('joinFireteam');
                            joinFireteam(new_player)
                            .then(() => {
                                window.location.reload(true)
                            });
                        }
                    }
                    else
                    {
                        joinError.classList.remove('hidden');
                        loading.classList.add('hidden');
                    }
                    });
                }
                else
                {
                    if(!playerexists)
                    {
                        if(fireteamdata.isfull)
                        {
                            joinError.classList.remove('hidden');
                            loading.classList.add('hidden');
                        }
                        else
                        {
                            var isftfull = false;

                            if(countplayers >= (numofplayers - 1))
                            {
                                isftfull = true;
                            }

                            var update_fireteam = {
                                ftid: fireteamid,
                                fireteamfull: isftfull
                            }
                            const updateIsFullFireteam  = firebase.functions().httpsCallable('updateIsFullFireteam');
                            updateIsFullFireteam(update_fireteam);

                            var new_player = {
                                uname: userSnapshot.data().displayname,
                                uclass: classList.value,
                                ftid: fireteamid,
                                ulevel: levelSelector.value
                              }
                            const joinFireteam  = firebase.functions().httpsCallable('joinFireteam');
                            joinFireteam(new_player).then(() => {
                                window.location.reload(true)
                            });
                        }
                    }
                    else
                    {
                        joinError.classList.remove('hidden');
                        loading.classList.add('hidden');
                    }
                }
    });
});

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
  });
const accountTrigger = document.querySelector('#account-trigger');

const accountBungie = document.querySelector('#account-bungie-name');
const accountCoins = document.querySelector('#account-coins');
const accountPoints = document.querySelector('#account-clan-points');
const accountRank = document.querySelector('#account-rank');
const accountPreference = document.querySelector('#account-preference');

const micCheckbox = document.querySelector('#mic-required');
const bandCheckbox = document.querySelector('#publish-band');
const platformSelect = document.querySelector('#platform-list');

const classSelect = document.querySelector('#class-list');
const levelInput = document.querySelector('#level');

const bandError = document.querySelector('.band-error');
const lfgerror = document.querySelector('.lfg-error');
const fterror = document.querySelector('.fireteam-error');
const loading = document.querySelector('.loading');

const ftselector1 = document.querySelector('#ft1');
const ftselector2 = document.querySelector('#ft2');
const ftselector3 = document.querySelector('#ft3');
const ftselector4 = document.querySelector('#ft4');
const ftselector5 = document.querySelector('#ft5');

const createFTButton = document.querySelector('#create-ft-button');
const FTButtonContainer = document.querySelector('.ft-button');

const streamPlatform = document.querySelector('#stream-list');
const streamError = document.querySelector('.stream-error');
const streamCorrect = document.querySelector('.stream-correct');
const RQButtonContainer = document.querySelector('.request-button');
const loading2 = document.querySelector('.loading2');

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

accountTrigger.addEventListener('click', (e) => {
  e.preventDefault();

  db.collection('user').doc(auth.currentUser.uid).get().then(
    (snapshot) => {
        db.collection('rank').doc(snapshot.data().rankid).get().then((ranksnapshot) => {
        accountBungie.textContent = `Nombre en Bungie.net: ${snapshot.data().displayname}`;
        accountCoins.textContent = `Tus Abysmal Coins: ${snapshot.data().abysmalcoins}`;
        accountPoints.textContent = `Tus puntos de clan: ${snapshot.data().clanpoints}`;
        var preferencestring;
        var rankname;
        const preferenceinteger = snapshot.data().preference;
        switch(preferenceinteger)
        {
          case 1:
            preferencestring = 'Balanceado';
            rankname = ranksnapshot.data().name;
            break;
          case 2:
            preferencestring = 'PvE (jugador contra entorno)';
            rankname = ranksnapshot.data().pvealt;
            break;
          case 3:
            preferencestring = 'PvP (jugador contra jugador)';
            rankname = ranksnapshot.data().pvpalt;
            break;
          default:
            preferencestring = '';
            rankname = ranksnapshot.data().name;
            break;
        }
        accountRank.textContent = `Tu rango de clan: ${rankname}`;
        accountPreference.textContent = `Tu preferencia de actividad: ${preferencestring}`;
      });
    }
  );
});

// stream form
streamForm.addEventListener('submit', (e) => {
  e.preventDefault();
  RQButtonContainer.classList.add('hidden');
  FTButtonContainer.classList.add('hidden');
  loading.classList.remove('hidden');
  loading2.classList.remove('hidden');
  streamError.classList.add('hidden');
  
  const code = streamForm.code.value;
  const plan = streamPlan.value;
  const platform = streamPlatform.value;

  var request = {
    requestcode : code,
    requestplan : plan,
    requestplatform : platform
  }
  const requestStreamRent = firebase.functions().httpsCallable('requestStreamRent');
  requestStreamRent(request)
  .then(() => {
    streamCorrect.classList.remove('hidden');
    FTButtonContainer.classList.remove('hidden');
    loading.classList.add('hidden');
    loading2.classList.add('hidden');
    if(platform == 1)
    {
      twitchPlayer.src = `https://player.twitch.tv/?channel=${code}`;
      twitchPlayer.classList.remove('hidden');
      youtubePlayer.src = `https://www.youtube.com`;
      youtubePlayer.classList.add('hidden');
    }
    else if(platform == 0)
    {
      youtubePlayer.src = `https://www.youtube.com/embed/${code}?autoplay=1`;
      twitchPlayer.classList.add('hidden');
      twitchPlayer.src = `https://twitch.tv`;
      youtubePlayer.classList.remove('hidden');
    }
  })
  .catch(error => {streamError.classList.remove('hidden')
  RQButtonContainer.classList.remove('hidden')
  FTButtonContainer.classList.remove('hidden')
  loading.classList.add('hidden')
  loading2.classList.add('hidden')});
});

ftselector1.addEventListener('click', () => {
  if(ftselector1.value)
  {
    window.location.replace(`fireteams.html?fireteamid=${ftselector1.value}`);
  }
});

ftselector2.addEventListener('click', () => {
  if(ftselector2.value)
  {
    window.location.replace(`fireteams.html?fireteamid=${ftselector2.value}`);
  }
});

ftselector3.addEventListener('click', () => {
  if(ftselector3.value)
  {
    window.location.replace(`fireteams.html?fireteamid=${ftselector3.value}`);
  }
});

ftselector4.addEventListener('click', () => {
  if(ftselector4.value)
  {
    window.location.replace(`fireteams.html?fireteamid=${ftselector4.value}`);
  }
});

ftselector5.addEventListener('click', () => {
  if(ftselector5.value)
  {
    window.location.replace(`fireteams.html?fireteamid=${ftselector5.value}`);
  }
});

createFTButton.addEventListener('click', (e) => {
  e.stopPropagation();
    bandError.classList.add('hidden');
    lfgerror.classList.add('hidden');
    fterror.classList.add('hidden');
    FTButtonContainer.classList.add('hidden');
    RQButtonContainer.classList.add('hidden');
    loading.classList.remove('hidden');
    loading2.classList.remove('hidden');

  if(levelInput.value > 1100 || levelInput.value < 750)
  {
    fterror.classList.remove('hidden');
    FTButtonContainer.classList.remove('hidden');
    loading.classList.add('hidden');
    loading2.classList.add('hidden');
  }
  else
  {
    newActivityList.forEach(activity => {
      if(activity == activityList.value)
      {
        var promises = [];
        var bandpostkey;
        var activityId;
        promises.push(db.collection('activity').where('name','==',activity).get());
        promises.push(db.collectionGroup('extra').where('name','==',activity).get());
  
        Promise.all(promises)
            .then((results) => {
              results.forEach(doc => {
                if(!doc.empty)
                {
                  doc.forEach(docSnapshot => {
                    activityId = docSnapshot.data().docid;
                  })
                }
              });
  
        //GET BAND ACCESS TOKEN
        return db.collection('bandaccesstoken').doc(auth.currentUser.uid).get();
  
            }).then((result) => {
          var bandusertoken;
          bandpostkey = "";
          if(bandCheckbox.checked)
          {
            if(result.data())
            {
                bandusertoken = result.data().token;
  
                 //GET BANDS
            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
  
            fetch(`https://openapi.band.us/v2.1/bands?access_token=${bandusertoken}`, requestOptions)
            .then(response => response.json())
            .then(result => {
              var bandkey = "";
              result.result_data.bands.forEach(
                band => {
                  if(band.name == "Abysmal Light LFG")
                  {
                    bandkey = band.band_key;
                  }
                }
              );
              if(bandkey)
              {
                //CREATE FT AND THEN A BAND POST
                //MODIFY COIN BET IN FUTURE RELEASES
                var newFireteam = {
                  bandpostkey: bandpostkey,
                  creatorid: auth.currentUser.uid,
                  fireteamactivityid: activityId,
                  coinbet: false,
                  isfull: false,
                  platform: platformSelect.value,
                  programcode: 0,
                  requiresmic: micCheckbox.checked
                }
        
                const addFireteam = firebase.functions().httpsCallable('addFireteam');
                addFireteam(newFireteam)
                .then((response) => {
                  db.collection('user').doc(auth.currentUser.uid).get().then(
                    (snapshot) => {
                      var content = `${classSelect.value} ${levelInput.value} busca escuadra para ${activityList.value} %0A Unirse: ${window.location.hostname}/fireteams.html?fireteamid=${response.data.reference}`;
                      const url = `https://openapi.band.us/v2.2/band/post/create?access_token=${bandusertoken}&band_key=${bandkey}&content=${content}&do_push=true`;
  
                      requestOptions = {
                        method: 'POST',
                        redirect: 'follow'
                      };
  
                      fetch(url, requestOptions)
                      .then(Postresponse => Postresponse.json())
                      .then(Postresult => {
                        console.log(Postresult.result_data.post_key);
                        console.log(snapshot.data().displayname);
  
                        var update_fireteam = {
                          ftid: response.data.reference,
                          bandpostkey: Postresult.result_data.post_key
                        }
  
                        const updateBANDKeyFireteam  = firebase.functions().httpsCallable('updateBANDKeyFireteam');
                        updateBANDKeyFireteam(update_fireteam).then((ftsnapshot) => {
  
                          var newPlayer = {
                            ftid: response.data.reference,
                            uclass: classSelect.value,
                            ulevel: levelInput.value,
                            uname: snapshot.data().displayname
                          }
                          const joinFireteam = firebase.functions().httpsCallable('joinFireteam');
                          joinFireteam(newPlayer)
                          .then(() => {
                            window.location.replace(`fireteams.html?fireteamid=${response.data.reference}`);
                          })
                          .catch(error => {
                            bandError.classList.add('hidden');
                            lfgerror.classList.add('hidden');
                            loading.classList.add('hidden');
                            loading2.classList.add('hidden');
                            FTButtonContainer.classList.remove('hidden');
                            RQButtonContainer.classList.remove('hidden');
                            fterror.classList.remove('hidden');
            
                            var new_deletion = {
                              ftid: response.data.reference,
                              creatorid: auth.currentUser.uid
                            }
                            const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                            deleteFireteam(new_deletion);

                            const delete_url = `https://openapi.band.us/v2.2/band/post/remove?access_token=${bandusertoken}&band_key=${bandkey}&post_key=${Postresult.result_data.post_key}`;
  
                            requestOptions = {
                              method: 'POST',
                              redirect: 'follow'
                            };

                            fetch(delete_url, requestOptions);
                          });
  
                        });
                      }).catch(error => {
                        bandError.classList.add('hidden');
                        lfgerror.classList.add('hidden');
                        loading.classList.add('hidden');
                        loading2.classList.add('hidden');
                        FTButtonContainer.classList.remove('hidden');
                        RQButtonContainer.classList.remove('hidden');
                        fterror.classList.remove('hidden');
        
                        var new_deletion = {
                          ftid: response.data.reference,
                          creatorid: auth.currentUser.uid
                        }
                        const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                        deleteFireteam(new_deletion);

                        const delete_url = `https://openapi.band.us/v2.2/band/post/remove?access_token=${bandusertoken}&band_key=${bandkey}&post_key=${Postresult.result_data.post_key}`;
  
                            requestOptions = {
                              method: 'POST',
                              redirect: 'follow'
                            };

                            fetch(delete_url, requestOptions);
                      });
  
                    }
                  );
                })
                .catch(error => {
                    bandError.classList.add('hidden');
                    lfgerror.classList.add('hidden');
                    loading.classList.add('hidden');
                    loading2.classList.add('hidden');
                    FTButtonContainer.classList.remove('hidden');
                    RQButtonContainer.classList.remove('hidden');
                    fterror.classList.remove('hidden');

                    const delete_url = `https://openapi.band.us/v2.2/band/post/remove?access_token=${bandusertoken}&band_key=${bandkey}&post_key=${Postresult.result_data.post_key}`;
  
                            requestOptions = {
                              method: 'POST',
                              redirect: 'follow'
                            };

                            fetch(delete_url, requestOptions);
                });
  
              }
              else
              {
                bandError.classList.add('hidden');
                FTButtonContainer.classList.remove('hidden');
                RQButtonContainer.classList.remove('hidden');
                lfgerror.classList.remove('hidden');
                loading.classList.add('hidden');
                loading2.classList.add('hidden');
                fterror.classList.add('hidden');
              }
            });
            }
            else
            {
              FTButtonContainer.classList.remove('hidden');
              RQButtonContainer.classList.remove('hidden');
              bandError.classList.remove('hidden');
              lfgerror.classList.add('hidden');
              loading.classList.add('hidden');
              loading2.classList.add('hidden');
              fterror.classList.add('hidden');
            }
          }
          else
          {
          //MODIFY COIN BET IN FUTURE RELEASES
          var newFireteam = {
            bandpostkey: bandpostkey,
            creatorid: auth.currentUser.uid,
            fireteamactivityid: activityId,
            coinbet: false,
            isfull: false,
            platform: platformSelect.value,
            programcode: 0,
            requiresmic: micCheckbox.checked
          }
  
          const addFireteam = firebase.functions().httpsCallable('addFireteam');
          addFireteam(newFireteam)
          .then((response) => {
            db.collection('user').doc(auth.currentUser.uid).get().then(
              (snapshot) => {
                var newPlayer = {
                  ftid: response.data.reference,
                  uclass: classSelect.value,
                  ulevel: levelInput.value,
                  uname: snapshot.data().displayname
                }
                const joinFireteam = firebase.functions().httpsCallable('joinFireteam');
                joinFireteam(newPlayer)
                .then(() => {
                  window.location.replace(`fireteams.html?fireteamid=${response.data.reference}`);
                })
                .catch(error => {var new_deletion = {
                    ftid: response.data.reference,
                    creatorid: auth.currentUser.uid
                  }
                  const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                  deleteFireteam(new_deletion);
  
                  bandError.classList.add('hidden');
                  lfgerror.classList.add('hidden');
                  loading.classList.add('hidden');
                  loading2.classList.add('hidden');
                  fterror.classList.remove('hidden');
                  FTButtonContainer.classList.remove('hidden');
                  RQButtonContainer.classList.remove('hidden');
                });
              }
            );
          })
          .catch(error => {
              bandError.classList.add('hidden');
              lfgerror.classList.add('hidden');
              loading.classList.add('hidden');
              loading2.classList.add('hidden');
              FTButtonContainer.classList.remove('hidden');
              RQButtonContainer.classList.remove('hidden');
              fterror.classList.remove('hidden');
          });
          
          }
      });
      }
    });
  }
});
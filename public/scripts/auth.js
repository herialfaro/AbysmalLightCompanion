const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const googlesignin = document.querySelector('#google-button');
const signOut = document.querySelector('.sign-out');

const namesList = document.querySelector('.names-list');
const companionModules = document.querySelector('.companion');
const navigationBar = document.querySelector('.navbar');
const reportOk = document.querySelector('.report-ok');
const reportError = document.querySelector('.report-error');

const bungieList = document.querySelector('#bungie-list');
const bungieListButton = document.querySelector('.bungie-confirmation-yes');
const bungieClose = document.querySelector('.bungie-confirmation-no');
const bungieLoading = document.querySelector('.loading-bungie-confirmation');

const namesReport = document.querySelector('#name-report');
const namesReportButton = document.querySelector('.name-report-button');
const namesReportLoading = document.querySelector('.loading-report');

const bandAuthButton = document.querySelector('#gotobandauth');
const configurationButton = document.querySelector('#gotoaccountdetails');

const streamRentStatus = document.querySelector('.stream-notenabled');
const streamOccupied = document.querySelector('.stream-occupied');
const streamVacant = document.querySelector('.stream-vacant');

const dailyMessage = document.querySelector('#modal-message-text');
const dailyMessageButton = document.querySelector('#modal-message-close');
const dailyMessagemodal = document.querySelector('#modal-daily');

streamPlan = document.querySelector('#stream-plan');

// toggle auth modals
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
  });
});

bandAuthButton.addEventListener('click', (e) => {
  window.location.replace('bandauth.html');
});

configurationButton.addEventListener('click', (e) => {
  window.location.replace('accountdetails.html');
});

// google signin
googlesignin.addEventListener('click', (e) => {
  e.preventDefault();
  
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
  .then(user => {
    console.log('logged in', user);
  })
  .catch(error => {
    console.log(error.message);
  });
});

// register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
      console.log('registered', user);
      window.location.reload(true);
    })
    .catch(error => {
      registerForm.querySelector('.error').textContent = error.message;
      window.location.reload(true);
    });
});

// login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(user => {
      console.log('logged in', user);
    })
    .catch(error => {
      loginForm.querySelector('.error').textContent = error.message;
    });
});

// sign out
signOut.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      window.location.reload(true);
    });
});

// auth listener
auth.onAuthStateChanged(user => {
  if (user) {
    authWrapper.classList.remove('open');
    authModals.forEach(modal => modal.classList.remove('active'));
    navigationBar.classList.remove('hidden');

    //creates local list
    var usersList = [];

    //saves all current users in the list
    db.collection('user').get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        usersList.push(doc.data());
      });
      //checks if current user has a bungieid assigned to it
      db.collection('user').doc(user.uid).get().then((snapshot) => {
        if(snapshot.data().bungieid == '')
        {
          db.collection('apikeys').get().then((keysnapshot) => {
            keysnapshot.docs.forEach(doc => {
              const xapikey = doc.data().bungiekey;
              namesList.classList.remove('hidden');
              companionModules.classList.add('hidden');
      
              //GET ABYSMAL LIGHT LIST OF MEMBERS
              var myHeaders = new Headers();
              myHeaders.append("X-API-KEY", xapikey);
              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
    
              fetch("https://www.bungie.net/Platform/GroupV2/3398247/Members/", requestOptions)
              .then(response => response.json())
              .then(result => {
                var data = result.Response.results;
                data.forEach(bungiemember => {
                  var userAlreadyExists = false;
                  usersList.forEach(user => {
                    if(bungiemember.destinyUserInfo.membershipId == user.bungieid)
                    {
                      userAlreadyExists = true;
                    }
                  });
                  if(!userAlreadyExists)
                  {
                    bungieUsers.push(bungiemember);
                  }
                });
            
                //console.log(bungieUsers);
                //console.log(data);
            
                //Adds bungie users without a taken id to the list
                bungieUsers.forEach(user => {
                  var displayname = user.destinyUserInfo.displayName;
                  newOption = document.createElement("OPTION");
                  newOptionValue = document.createTextNode(displayname);
                  newOption.appendChild(newOptionValue);
            
                  bungieList.insertBefore(newOption,bungieList.lastChild);
                });
              }).catch(error => console.log('error', error));
              });
            });
        }
        else
        {
          //loads daily message
          const checkDailyItems = firebase.functions().httpsCallable('checkDailyItems');
          checkDailyItems()
          .then(response => {
            if(response.data.reference)
            {
              const messagestring = `Mensaje diario: ${response.data.message}
              Has conseguido ${response.data.coins} Abysmal Coin(s).`;
              dailyMessage.textContent = messagestring;
              M.Modal.getInstance(dailyMessagemodal).open();
            }
          })
          .catch(error => {
            console.log(error.message);
        });

          //loads stream options
          db.collection('addstream').get().then((snapshot) => {
            snapshot.docs.forEach(item => {
              if(item.data().enabled)
              {
                db.collection('currentvideo').where('platform','==',0).get().then(result => {
                  result.docs.forEach(highlight => {
                    var datenow = new Date();
                    var additionaltime = 0;

                    if(highlight.data().plan == "standard")
                    {
                      additionaltime = item.data().standardtime;
                    }
                    else if (highlight.data().plan == "extra1")
                    {
                      additionaltime = item.data().extra1time;
                    }
                    else if (highlight.data().plan == "extra2")
                    {
                      additionaltime = item.data().extra2time;
                    }

                    var dateprediction = new Date((highlight.data().dateupdated.seconds*1000) + (additionaltime*60000));

                    if(datenow.getTime() > dateprediction.getTime())
                    {
                      var newOptionstandard = null;
                      var newOptionextra1 = null;
                      var newOptionextra2 = null;

                      streamForm.classList.remove('hidden');
                      streamVacant.classList.remove('hidden');

                      newOptionfree = document.createElement("OPTION");
                      var output = `Opción gratuita - Tiempo (en minutos): ${item.data().freetime} ***
                      Costo (Abysmal Coins): ${item.data().freecost} `;
                      var newOptionfreeValue = document.createTextNode(output);
                      newOptionfree.appendChild(newOptionfreeValue);
                      newOptionfree.value = "free";
                      streamPlan.insertBefore(newOptionfree,streamPlan.lastChild);
        
        
                      newOptionstandard = document.createElement("OPTION");
                      var output = `Opción estándar - Tiempo (en minutos): ${item.data().standardtime} ***
                      Costo (Abysmal Coins): ${item.data().standardcost} `;
                      var newOptionstandardValue = document.createTextNode(output);
                      newOptionstandard.appendChild(newOptionstandardValue);
                      newOptionstandard.value = "standard";
                      streamPlan.insertBefore(newOptionstandard,streamPlan.lastChild);
        
                      newOptionextra1 = document.createElement("OPTION");
                      var output = `Opción extra 1 - Tiempo (en minutos): ${item.data().extra1time} ***
                      Costo (Abysmal Coins): ${item.data().extra1cost} `;
                      var newOptionextra1Value = document.createTextNode(output);
                      newOptionextra1.appendChild(newOptionextra1Value);
                      newOptionextra1.value = "extra1";
                      streamPlan.insertBefore(newOptionextra1,streamPlan.lastChild);
        
                      newOptionextra2 = document.createElement("OPTION");
                      var output = `Opción extra 2 - Tiempo (en minutos): ${item.data().extra2time} ***
                      Costo (Abysmal Coins): ${item.data().extra2cost} `;
                      var newOptionextra2Value = document.createTextNode(output);
                      newOptionextra2.appendChild(newOptionextra2Value);
                      newOptionextra2.value = "extra2";
                      streamPlan.insertBefore(newOptionextra2,streamPlan.lastChild);
                    }
                    else
                    {
                      var timeleft = (dateprediction.getTime() - datenow.getTime())/60000;
                      timeleft = Math.round(timeleft);
                      streamOccupied.textContent = `Actualmente hay alguien
                      rentando espacio para su directo,
                      le quedan ${timeleft} minutos.

                      Intenta refrescar la página cuando
                      el tiempo se haya terminado.`;
                      streamOccupied.classList.remove('hidden');
                    }
                  });
                });
              }
              else
              {
                streamRentStatus.classList.remove('hidden');
              }
            });
          });
          

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
                  mixerPlayer.src = `https://mixer.com/embed/player/${videoSnapshot.data().code}?disableLowLatency=1`;
                  mixerPlayer.classList.remove('hidden');
                }
                else if(type == 2)
                {
                  twitchPlayer.src = `https://player.twitch.tv/?channel=${videoSnapshot.data().code}`;
                  twitchPlayer.classList.remove('hidden');
                }
                else if(type == 0)
                {
                  youtubePlayer.src = `https://www.youtube.com/embed/${videoSnapshot.data().code}?autoplay=1`;
                  youtubePlayer.classList.remove('hidden');
                }
              }
            )
          }
        );
      }
    );

          namesList.classList.add('hidden');
          companionModules.classList.remove('hidden');

          //LOAD FIRETEAMS LIST
   db.collection('fireteam').where('programcode','==',0).orderBy('datecreated').get().then((snapshot) => {
     var temp_array = [];
     var doc_array = [];
    snapshot.docs.forEach(doc => {
      temp_array.push(doc.data());
      doc_array.push(doc);
    });
    for (var i = temp_array.length - 1; i >= 0; i--) {
      var value = temp_array[i];
      newFireteamList.push(value);
    }
    temp_array = [];
    for (var i = doc_array.length - 1; i >= 0; i--) {
      var value = doc_array[i];
      temp_array.push(value);
    }

    //HANDLE PROMISES IN A LOOP
    //https://stackoverflow.com/questions/31426740/how-to-return-many-promises-in-a-loop-and-wait-for-them-all-to-do-other-stuff
    var ftpromises = [];
    for(var count = 0; count < 5; count++)
    {
      if(newFireteamList[count])
      {
      ftpromises.push(db.collection('activity').doc(newFireteamList[count].fireteamactivityid).get());
      ftpromises.push(db.collectionGroup('extra').where('docid','==',newFireteamList[count].fireteamactivityid).get());
      }
    }
    Promise.all(ftpromises)
          .then((results) => {
            newFireteamList = temp_array;
            var namesArray = [];
            results.forEach(doc => 
              {
                if(doc.exists)
                {
                  namesArray.push(doc.data().name);
                }
                else
                {
                  if(doc.empty == false)
                  {
                    doc.forEach(object => {
                      namesArray.push(object.data().name);
                    });
                  }
                }
              });
              for(var ftcounter = 0; ftcounter < newFireteamList.length; ftcounter++)
              {
                var fireteamText = `${namesArray[ftcounter]}`;
                var fireteamId = newFireteamList[ftcounter].id

                const ft = document.querySelector(`#ft${ftcounter+1}`);
                ft.textContent = fireteamText;
                ft.value = fireteamId;
              }
          });
  });
        }

        //LOAD FULL ACTIVITY LIST
        var actpromises = [];
        actpromises.push(db.collection('activity').orderBy('name').get());
        actpromises.push(db.collectionGroup('extra').orderBy('name').get());

        Promise.all(actpromises).then((results) => {
          results.forEach((doc) => {
            if(doc.exists)
                {
                  newActivityList.push(doc.data().name);
                  newOption = document.createElement("OPTION");
                  newOptionValue = document.createTextNode(doc.data().name);
                  newOption.appendChild(newOptionValue);

                  activityList.insertBefore(newOption,activityList.lastChild);
                }
                else
                {
                  if(doc.empty == false)
                  {
                    doc.forEach(object => {
                      newActivityList.push(object.data().name);
                      newOption = document.createElement("OPTION");
                      newOptionValue = document.createTextNode(object.data().name);
                      newOption.appendChild(newOptionValue);

                      activityList.insertBefore(newOption,activityList.lastChild);
                    });
                  }
                }
          });
        });

      });
    });
  } else {
    navigationBar.classList.add('hidden');
    reportOk.classList.add('hidden');
    reportError.classList.add('hidden');
    companionModules.classList.add('hidden');
    authWrapper.classList.add('open');
    authModals[0].classList.add('active');
  }
});

bungieListButton.addEventListener('click', (e) => {
  e.stopPropagation();
  //console.log(bungieList.value);
  bungieLoading.classList.remove('hidden');
  bungieListButton.classList.add('hidden');
  bungieClose.classList.add('hidden');

  bungieUsers.forEach(user => {
    if(user.destinyUserInfo.displayName == bungieList.value)
    {
      var new_user = {
        bungieInfo : user,
        uid: auth.currentUser.uid
      }
      const updateBungieInfo = firebase.functions().httpsCallable('updateBungieInfo');
      updateBungieInfo(new_user)
      .then(() => {
        //page reloads
        window.location.reload(true);
      })
      .catch(error => {console.log(error.message)
        bungieLoading.classList.add('hidden')
        bungieListButton.classList.remove('hidden')});
    }
  });
});

bungieClose.addEventListener('click', (e) => {
  e.stopPropagation();
  const modal = document.querySelector('#modal-bungie-confirmation');
    M.Modal.getInstance(modal).close();
});

namesReportButton.addEventListener('click', (e) => {
  e.stopPropagation();

  namesReportLoading.classList.remove('hidden');
  namesReportButton.classList.add('hidden');

  var report = {
    description : namesReport.value,
    displayname: fname.value
  }
  const addReport = firebase.functions().httpsCallable('addReport');
  addReport(report)
  .then(response => {
    namesList.classList.add('hidden');
    reportOk.classList.remove('hidden');
    reportError.classList.add('hidden');
    namesReportLoading.classList.add('hidden');
  })
  .catch(error => {
    namesList.classList.add('hidden');
    reportError.classList.remove('hidden');
    reportOk.classList.add('hidden');
    namesReportLoading.classList.add('hidden');
    namesReportButton.classList.remove('hidden');
})
});

dailyMessageButton.addEventListener('click', (e) => {
  e.stopPropagation();
  M.Modal.getInstance(dailyMessagemodal).close();
  });
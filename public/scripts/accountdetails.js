const signOut = document.querySelector('.sign-out');

const accountBungie = document.querySelector('#account-bungie-name');
const accountCoins = document.querySelector('#account-coins');
const accountPoints = document.querySelector('#account-clan-points');
const accountRank = document.querySelector('#account-rank');
const accountPreference = document.querySelector('#account-preference');

const accountMessagesYes = document.querySelector('.daily-messages-true');
const accountMessagesNo = document.querySelector('.daily-messages-false');
const changePassword = document.querySelector('.changepassword');

const accountLoading = document.querySelector('.save-loading');
const accountSuccess = document.querySelector('.save-success');
const accountFailure = document.querySelector('.save-failure');
const accountWarning1 = document.querySelector('.warning1');
const accountWarning2 = document.querySelector('.warning2');

const hidedefaultbtn = document.querySelector('.hide-highlight');
const showdefaultbtn = document.querySelector('.show-highlight');

const preferenceSave = document.querySelector('.preference-save');
const preferenceLoading = document.querySelector('.preference-loading');
const preferenceSuccess = document.querySelector('.preference-success');
const preferenceFailure = document.querySelector('.preference-failure');
const preferenceList = document.querySelector('#preference-list');

auth.onAuthStateChanged(user => {
    if (user)
    { 
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
                if(snapshot.data().dailymessage)
                {
                    accountMessagesYes.classList.remove('hidden');
                    accountWarning1.classList.remove('hidden');
                }
                else
                {
                    accountMessagesNo.classList.remove('hidden');
                    accountWarning2.classList.remove('hidden');
                }
              });

              var displaystream = snapshot.data().displayhighlight;
              if(displaystream)
              {
                hidedefaultbtn.classList.remove('hidden');
              }
              else
              {
                showdefaultbtn.classList.remove('hidden');
              }
            }
          );
    }
    else
    {
        window.location.replace('index.html');
    }
});

accountMessagesNo.addEventListener('click', (e) => {
    accountLoading.classList.remove('hidden');
    accountSuccess.classList.add('hidden');
    accountFailure.classList.add('hidden');
    accountMessagesNo.classList.add('hidden');
    accountMessagesYes.classList.add('hidden');
    accountWarning1.classList.add('hidden');
    accountWarning2.classList.add('hidden');
    showdefaultbtn.classList.add('hidden');
    hidedefaultbtn.classList.add('hidden');
    e.preventDefault();
    var receive_messages = {
        settings: true
      }
    const updateRecieveDaily  = firebase.functions().httpsCallable('updateRecieveDaily');
    updateRecieveDaily(receive_messages)
    .then(() => {
        accountLoading.classList.add('hidden');
        accountSuccess.classList.remove('hidden');
    })
    .catch(error => {
        accountLoading.classList.add('hidden');
        accountFailure.classList.remove('hidden');
        accountMessagesNo.classList.remove('hidden');
    });
});

preferenceSave.addEventListener('click', (e) => {
    e.preventDefault();
    preferenceLoading.classList.remove('hidden');
    preferenceSave.classList.add('hidden');
    const numvalue = parseInt(preferenceList.value);
    var set_preference = {
        settings: numvalue
      }
    const updatePreference  = firebase.functions().httpsCallable('updatePreference');
    updatePreference(set_preference)
    .then(() => {
        preferenceLoading.classList.add('hidden');
        preferenceSuccess.classList.remove('hidden');
    })
    .catch(error => {
        preferenceLoading.classList.add('hidden');
        preferenceFailure.classList.remove('hidden');
        preferenceSave.classList.remove('hidden');
    });
});

accountMessagesYes.addEventListener('click', (e) => {
    accountLoading.classList.remove('hidden');
    accountSuccess.classList.add('hidden');
    accountFailure.classList.add('hidden');
    accountMessagesNo.classList.add('hidden');
    accountMessagesYes.classList.add('hidden');
    accountWarning1.classList.add('hidden');
    accountWarning2.classList.add('hidden');
    showdefaultbtn.classList.add('hidden');
    hidedefaultbtn.classList.add('hidden');
    e.preventDefault();
    var receive_messages = {
        settings: false
      }
    const updateRecieveDaily  = firebase.functions().httpsCallable('updateRecieveDaily');
    updateRecieveDaily(receive_messages)
    .then(() => {
        accountLoading.classList.add('hidden');
        accountSuccess.classList.remove('hidden');
    })
    .catch(error => {
        accountLoading.classList.add('hidden');
        accountFailure.classList.remove('hidden');
        accountMessagesYes.classList.remove('hidden');
    });
});

showdefaultbtn.addEventListener('click', (e) => {
    accountLoading.classList.remove('hidden');
    accountSuccess.classList.add('hidden');
    accountFailure.classList.add('hidden');
    accountMessagesNo.classList.add('hidden');
    accountMessagesYes.classList.add('hidden');
    accountWarning1.classList.add('hidden');
    accountWarning2.classList.add('hidden');
    showdefaultbtn.classList.add('hidden');
    hidedefaultbtn.classList.add('hidden');
    e.preventDefault();
    var show_highlight = {
        settings: true
      }
    const updateShowStream  = firebase.functions().httpsCallable('updateShowStream');
    updateShowStream(show_highlight )
    .then(() => {
        accountLoading.classList.add('hidden');
        accountSuccess.classList.remove('hidden');
    })
    .catch(error => {
        accountLoading.classList.add('hidden');
        accountFailure.classList.remove('hidden');
        accountMessagesNo.classList.remove('hidden');
    });
});

hidedefaultbtn.addEventListener('click', (e) => {
    accountLoading.classList.remove('hidden');
    accountSuccess.classList.add('hidden');
    accountFailure.classList.add('hidden');
    accountMessagesNo.classList.add('hidden');
    accountMessagesYes.classList.add('hidden');
    accountWarning1.classList.add('hidden');
    accountWarning2.classList.add('hidden');
    showdefaultbtn.classList.add('hidden');
    hidedefaultbtn.classList.add('hidden');
    e.preventDefault();
    var show_highlight = {
        settings: false
      }
    const updateShowStream  = firebase.functions().httpsCallable('updateShowStream');
    updateShowStream(show_highlight )
    .then(() => {
        accountLoading.classList.add('hidden');
        accountSuccess.classList.remove('hidden');
    })
    .catch(error => {
        accountLoading.classList.add('hidden');
        accountFailure.classList.remove('hidden');
        accountMessagesNo.classList.remove('hidden');
    });
});

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
  });
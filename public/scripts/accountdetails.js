const signOut = document.querySelector('.sign-out');

const accountBungie = document.querySelector('#account-bungie-name');
const accountCoins = document.querySelector('#account-coins');
const accountPoints = document.querySelector('#account-clan-points');
const accountRank = document.querySelector('#account-rank');

const accountMessagesYes = document.querySelector('.daily-messages-true');
const accountMessagesNo = document.querySelector('.daily-messages-false');
const changePassword = document.querySelector('.changepassword');

const accountLoading = document.querySelector('.save-loading');
const accountSuccess = document.querySelector('.save-success');
const accountFailure = document.querySelector('.save-failure');
const accountWarning1 = document.querySelector('.warning1');
const accountWarning2 = document.querySelector('.warning2');

auth.onAuthStateChanged(user => {
    if (user)
    { 
        db.collection('user').doc(auth.currentUser.uid).get().then(
            (snapshot) => {
                db.collection('rank').doc(snapshot.data().rankid).get().then((ranksnapshot) => {
                accountBungie.textContent = `Nombre en Bungie.net: ${snapshot.data().displayname}`;
                accountCoins.textContent = `Tus Abysmal Coins: ${snapshot.data().abysmalcoins}`;
                accountPoints.textContent = `Tus puntos de clan: ${snapshot.data().clanpoints}`;
                accountRank.textContent = `Tu rango de clan: ${ranksnapshot.data().name}`;
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

accountMessagesYes.addEventListener('click', (e) => {
    accountLoading.classList.remove('hidden');
    accountSuccess.classList.add('hidden');
    accountFailure.classList.add('hidden');
    accountMessagesNo.classList.add('hidden');
    accountMessagesYes.classList.add('hidden');
    accountWarning1.classList.add('hidden');
    accountWarning2.classList.add('hidden');
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

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
  });
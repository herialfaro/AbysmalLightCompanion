const signOut = document.querySelector('.sign-out');

const bandAuthorized = document.querySelector('.band-authorized');
const bandUnauthorized = document.querySelector('.band-unauthorized');

const bandName = document.querySelector('#band-name');
const bandPicture = document.querySelector('#band-pic');
const bandMemberTrue = document.querySelector('.band-member-true');
const bandMemberFale = document.querySelector('.band-member-false');
const bandMemberNotFound = document.querySelector('.band-member-notfound');
const bandMemberError = document.querySelector('.band-member-error');

const bandConfirmation = document.querySelector('.band-confirmation-yes');
const bandClose = document.querySelector('.band-confirmation-no');
const bungieLoading = document.querySelector('.loading-band-confirmation');

const bandLink = document.querySelector('#band-link');

document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
});

auth.onAuthStateChanged(user => {
    if (user)
    {   
        if(auth_code)
        {
            //GET BAND ACESS TOKEN
          /*var myHeaders = new Headers();
          myHeaders.append("Authorization", "Basic MjgyNjU4MzAwOnRqMW5SSFRnNFhlTDdqeWhTMi1iRGRuR3dKWWFiek5M");

          console.log(auth_code);
          var url = `https://auth.band.us/oauth2/token?grant_type=authorization_code&code=${auth_code}`;
          console.log(url);
    
          var options = {
          method: 'GET',
          uri: url,
          headers: myHeaders,
          json: true
          }*/

                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                      };
                    fetch(`https://us-central1-abysmal-light-companion.cloudfunctions.net/requestBANDToken?code=${auth_code}`, requestOptions)
                    .then(response => response.json())
                    .then(result => { 
                        if(result.access_token)
                        {
                            var new_token = {
                                token: result.access_token
                              }
                            const addBANDAccessToken  = firebase.functions().httpsCallable('addBANDAccessToken');
                            addBANDAccessToken(new_token)
                            .then(() => {
                                window.location.replace('bandauth.html');
                            })
                            .catch(error => {
                                bandMemberError.remove('hidden');
                                bandAuthorized.classList.add('hidden');
                                bandUnauthorized.classList.add('hidden');
                                bandMemberNotFound.classList.add('hidden');
                            });
                        }
                        else
                        {
                            bandMemberError.remove('hidden');
                            bandAuthorized.classList.add('hidden');
                            bandUnauthorized.classList.add('hidden');
                            bandMemberNotFound.classList.add('hidden');
                        }
                    })
                    .catch((error) => {
                        bandMemberError.remove('hidden');
                        bandAuthorized.classList.add('hidden');
                        bandUnauthorized.classList.add('hidden');
                        bandMemberNotFound.classList.add('hidden');
                    });

          /*const GetBandAccessToken  = firebase.functions().httpsCallable('GetBandAccessToken');
          GetBandAccessToken((url,options))
        .then((response) => {
            console.log(response);
        });*/

          //cloud function request

        }
        else
        {
            db.collection('bandaccesstoken').doc(user.uid).get().then((snapshot) => {
                if(snapshot.data())
                {
                    bandAuthorized.classList.remove('hidden');
                    bandUnauthorized.classList.add('hidden');
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                      };
                    fetch(`https://openapi.band.us/v2/profile?access_token=${snapshot.data().token}`, requestOptions)
                    .then(response => response.json())
                    .then(result => { 
                        bandName.textContent = result.result_data.name;
                        bandPicture.src = result.result_data.profile_image_url;
                        if(result.result_data.is_app_member)
                        {
                            bandMemberTrue.classList.remove('hidden');
                        }
                        else
                        {
                            bandMemberFalse.classList.remove('hidden');
                        }
                    });
                }
                else
                {
                    bandAuthorized.classList.add('hidden');
                    bandUnauthorized.classList.remove('hidden');
                    console.log('token no existe');
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
        }
    }
    else
    {
        window.location.replace('index.html');
    }
});

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
});

bandClose.addEventListener('click', (e) => {
    e.stopPropagation();
    const modal = document.querySelector('#modal-band');
      M.Modal.getInstance(modal).close();
});

bandConfirmation.addEventListener('click', (e) => {
    e.stopPropagation();
    bungieLoading.classList.remove('hidden');
    bandConfirmation.classList.add('hidden');
    bandClose.classList.add('hidden');

    var remove_token = {
        bandtoken: ""
      }
      const deleteBANDAccessToken  = firebase.functions().httpsCallable('deleteBANDAccessToken');
      deleteBANDAccessToken(remove_token)
    .then(() => {
      window.location.reload(true);
    })
    .catch(error => {error.message});
});

bandLink.addEventListener('click', (e) => {
    e.stopPropagation();
    var url = "https://auth.band.us/oauth2/authorize?response_type=code&client_id=282658300&redirect_uri=https://abysmal-light-companion.web.app/bandauth.html";
    window.location.replace(url);
});

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
  });
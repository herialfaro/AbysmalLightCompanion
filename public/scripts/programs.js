const signOut = document.querySelector('.sign-out');

const programTitle = document.querySelector('#program_name');
const programContent = document.querySelector('.program_content');
const forbiddenContent = document.querySelector('.forbidden_content');

const pjyoutubePlayer = document.querySelector('.video-youtube');
const pjmixerPlayer = document.querySelector('.video-mixer');
const pjtwitchPlayer = document.querySelector('.video-twitch');

const postselector1 = document.querySelector('#post1');
const postselector2 = document.querySelector('#post2');
const postselector3 = document.querySelector('#post3');
const postselector4 = document.querySelector('#post4');
const postselector5 = document.querySelector('#post5');
const postselector6 = document.querySelector('#post6');
const mentorPostButton = document.querySelector('.mentorpost-button');

const d2checklistbutton = document.querySelector('.checklist-button');
const raidreportbutton = document.querySelector('.raidreport-button');

const seePostmodal = document.querySelector('#modal-seepost');
const originalPoster = document.querySelector('.post-op');
const postTitle = document.querySelector('.post-title');
const postDescription = document.querySelector('.post-description');
const postVideo = document.querySelector('.post-video');
const seeFireteambutton = document.querySelector('.gotofireteams');
const closeModalbutton = document.querySelector('.close-modal');

const videochannel1 = document.querySelector('#video1_button');
const videochannel2 = document.querySelector('#video2_button');
const videochannel3 = document.querySelector('#video3_button');

const modalpost = document.querySelector('#modal-programpost');
const postCreationTitle = document.querySelector('#program-title');
const postCreationDescription = document.querySelector('#program-post');

const fireteamcheckbox = document.querySelector('#add-fireteam');
const streamcheckbox = document.querySelector('#add-video');
const fireteamcontainer = document.querySelector('.fireteam-container');
const streamcontainer = document.querySelector('.stream-container');

const activityList = document.querySelector('#activity-list');

const mentorPublishButton = document.querySelector('.post-publish');
const mentorPostError = document.querySelector('.post-error');
const loading = document.querySelector('.loading');

const levelInput = document.querySelector('#level');
const micCheckbox = document.querySelector('#mic-required');
const bandCheckbox = document.querySelector('#publish-band');
const platformSelect = document.querySelector('#platform-list');
const classSelect = document.querySelector('#class-list');

const streamPlatform = document.querySelector('#stream-list');
const streamChannel = document.querySelector('#channel-list');

var post_array = [];
var video_array = [];

document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
});

auth.onAuthStateChanged(user => {
    if (user)
    {
        switch(programcode)
        {
            case 1:
                //CAMP CRUCIBLE
            programTitle.textContent = "Camp Crucible";
            db.collection('user').doc(user.uid).get().then(
            (snapshot) => { 
                if(snapshot.data().isincamp)
                {
                    LoadProgram(programcode);
                    raidreportbutton.classList.add('hidden');
                }
                else
                {
                    forbiddenContent.classList.remove('hidden');
                }
            });
                break;
            case 2:
                //RAID ACADEMY
            programTitle.textContent = "Raid Academy";
            db.collection('user').doc(user.uid).get().then(
                (snapshot) => { 
                    if(snapshot.data().isinacademy)
                    {
                        LoadProgram(programcode);
                    }
                    else
                    {
                        forbiddenContent.classList.remove('hidden');
                    }
                });
                break;
            default:
                window.location.replace('404.html');
        }
    }
    else
    {
        window.location.replace('index.html');
    }
});

fireteamcheckbox.addEventListener( 'change', function() {
    if(fireteamcheckbox.checked) {
        fireteamcontainer.classList.remove('hidden');
    } else {
        fireteamcontainer.classList.add('hidden');
    }
});

streamcheckbox.addEventListener( 'change', function() {
    if(streamcheckbox.checked) {
        streamcontainer.classList.remove('hidden');
    } else {
        streamcontainer.classList.add('hidden');
    }
});

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
});

seeFireteambutton.addEventListener('click', () => {
  var url = `fireteams.html?fireteamid=${postfireteamid}`;
  window.location.replace(url);
  });

mentorPublishButton.addEventListener('click', (e) => {
    e.preventDefault();
    var postmode;
    if(fireteamcheckbox.checked)
    {
        if(streamcheckbox.checked)
        {
            postmode = 4;
        }
        else
        {
            postmode = 2;
        }
    }
    else
    {
        if(streamcheckbox.checked)
        {
            postmode = 3;
        }
        else
        {
            postmode = 1;
        }
    }
    var desc = postCreationDescription.value;
    if(desc.length > 500)
    {
        mentorPublishButton.classList.remove('hidden');
        mentorPostError.classList.remove('hidden');
        loading.classList.add('hidden');
    }
    else
    {
        if(!postCreationTitle.value)
        {
            mentorPublishButton.classList.remove('hidden');
            mentorPostError.classList.remove('hidden');
            loading.classList.add('hidden');
        }
        else
        {
            WritePost(postmode);
        }
    }
});

postselector1.addEventListener('click', (e) => {
    e.preventDefault();
    OpenPost(0);
});

postselector2.addEventListener('click', (e) => {
    e.preventDefault();
    OpenPost(1);
});

postselector3.addEventListener('click', (e) => {
    e.preventDefault();
    OpenPost(2);
});

postselector4.addEventListener('click', (e) => {
    e.preventDefault();
    OpenPost(3);
});

postselector5.addEventListener('click', (e) => {
    e.preventDefault();
    OpenPost(4);
});

postselector6.addEventListener('click', (e) => {
    e.preventDefault();
    OpenPost(5);
});

videochannel1.addEventListener('click', (e) => {
    e.preventDefault();
    var tag;
    if (programcode === 1)
    {
        tag = "Video Campamento 1";
    }
    else if (programcode === 2)
    {
        tag = "Video Academia 1";
    }
    PlayVideo(tag);
});

videochannel2.addEventListener('click', (e) => {
    e.preventDefault();
    var tag;
    if (programcode === 1)
    {
        tag = "Video Campamento 2";
    }
    else if (programcode === 2)
    {
        tag = "Video Academia 2";
    }
    PlayVideo(tag);
});

videochannel3.addEventListener('click', (e) => {
    e.preventDefault();
    var tag;
    if (programcode === 1)
    {
        tag = "Video Campamento 3";
    }
    else if (programcode === 2)
    {
        tag = "Video Academia 3";
    }
    PlayVideo(tag);
});

closeModalbutton.addEventListener('click', (e) => {
    e.preventDefault();
    M.Modal.getInstance(seePostmodal).close();
});

mentorPostButton.addEventListener('click', (e) => {
    e.preventDefault();
    M.Modal.getInstance(modalpost).open();
});

function PlayVideo(projecttag)
{
    db.collection('currentvideo').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().tag === projecttag)
            {
                db.collection('video').doc(doc.data().videoid).get().then(videoSnapshot => {
                  var type = videoSnapshot.data().videotype;
                  if(type == 1)
                  {
                    pjmixerPlayer.src = `https://mixer.com/embed/player/${videoSnapshot.data().code}?disableLowLatency=1`;
                    pjmixerPlayer.classList.remove('hidden');
                    pjtwitchPlayer.src = `https://twitch.tv`;
                    pjtwitchPlayer.classList.add('hidden');
                    pjyoutubePlayer.src = `https://www.youtube.com`;
                    pjyoutubePlayer.classList.add('hidden');
                  }
                  else if(type == 2)
                  {
                    pjtwitchPlayer.src = `https://player.twitch.tv/?channel=${videoSnapshot.data().code}`;
                    pjtwitchPlayer.classList.remove('hidden');
                    pjmixerPlayer.src = `https://mixer.com`;
                    pjmixerPlayer.classList.add('hidden');
                    pjyoutubePlayer.src = `https://www.youtube.com`;
                    pjyoutubePlayer.classList.add('hidden');
                  }
                  else if(type == 0)
                  {
                    pjyoutubePlayer.src = `https://www.youtube.com/embed/${videoSnapshot.data().code}?autoplay=1`;
                    pjyoutubePlayer.classList.remove('hidden');
                    pjmixerPlayer.src = `https://mixer.com`;
                    pjmixerPlayer.classList.add('hidden');
                    pjtwitchPlayer.src = `https://twitch.tv`;
                    pjtwitchPlayer.classList.add('hidden');
                  }
                });
            }
        });
    });
}

function OpenPost(index)
{
    if(post_array[index])
    {
        db.collection('mentors').doc(post_array[index].mentorid).get().then((snapshot) => {
            db.collection('user').doc(snapshot.data().userid).get().then((userSnapshot) => {
                originalPoster.textContent = `Por: ${userSnapshot.data().displayname}`;
                postTitle.textContent = post_array[index].title;
                postDescription.textContent = post_array[index].description;
                if(post_array[index].currentvideoid)
                {
                    db.collection('currentvideo').doc(post_array[index].currentvideoid).get().then((videoSnapshot) => {
                        postVideo.textContent = videoSnapshot.data().tag;
                    })
                }
                else
                {
                    postVideo.textContent = "";
                }
                if(post_array[index].fireteamid)
                {
                    seeFireteambutton.classList.remove('hidden');
                    postfireteamid = post_array[index].fireteamid;
                }
                else
                {
                    seeFireteambutton.classList.add('hidden');
                }
                M.Modal.getInstance(seePostmodal).open();
            })
        })
    }
}

function LoadProgram(code)
{
    programContent.classList.remove('hidden');

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
                    pjmixerPlayer.src = `https://mixer.com/embed/player/${videoSnapshot.data().code}?disableLowLatency=1`;
                    pjmixerPlayer.classList.remove('hidden');
                  }
                  else if(type == 2)
                  {
                    pjtwitchPlayer.src = `https://player.twitch.tv/?channel=${videoSnapshot.data().code}`;
                    pjtwitchPlayer.classList.remove('hidden');
                  }
                  else if(type == 0)
                  {
                    pjyoutubePlayer.src = `https://www.youtube.com/embed/${videoSnapshot.data().code}?autoplay=1`;
                    pjyoutubePlayer.classList.remove('hidden');
                  }
                }
              )
            }
          );
        }
      );

      db.collection('mentorpost').where('programcode','==',code).orderBy('dateadded').get().then((snapshot) => {
      var temp_array = [];
    snapshot.docs.forEach(doc => {
      temp_array.push(doc.data());
    });
    for (var i = 0; i < 6; i++) {
      var value = temp_array[(temp_array.length)-(i+1)];
      post_array.push(value);
    }
    postselector1.textContent = post_array[0].title;
    postselector2.textContent = post_array[1].title;
    postselector3.textContent = post_array[2].title;
    postselector4.textContent = post_array[3].title;
    postselector5.textContent = post_array[4].title;
    postselector6.textContent = post_array[5].title;
    });

    db.collection('mentors').where('programcode','==',code).get().then((snapshot) => {
        var ismentor = false;
        snapshot.docs.forEach(doc => {
            if(auth.currentUser.uid === doc.data().userid)
            {
                ismentor = true;
            }
        });
        if(ismentor)
        {
            mentorPostButton.classList.remove('hidden');
        }
    });

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
}

function WritePost(mode)
{
    mentorPublishButton.classList.add('hidden');
    loading.classList.remove('hidden');
    switch(mode)
    {
        case 1:
            console.log('Ninguno');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        var newPost = {
                          p_currentvideoid: "",
                          p_title: postCreationTitle.value,
                          p_description: postCreationDescription.value,
                          p_fireteamid: "",
                          p_programcode: programcode,
                        }

                        const addMentorPost = firebase.functions().httpsCallable('addMentorPost');
                        addMentorPost(newPost)
                        .then(() => {
                          window.location.reload(true);
                        })
                        .catch(error => {
                          mentorPublishButton.classList.remove('hidden');
                          mentorPostError.classList.remove('hidden');
                          loading.classList.add('hidden');
                        });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        break;
        case 2:
            console.log('Escuadra solo');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if(levelInput.value > 1100 || levelInput.value < 750)
  {
    mentorPublishButton.classList.remove('hidden');
    mentorPostError.classList.remove('hidden');
    loading.classList.add('hidden');
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
                var newFireteam = {
                  bandpostkey: bandpostkey,
                  creatorid: auth.currentUser.uid,
                  fireteamactivityid: activityId,
                  coinbet: false,
                  isfull: false,
                  platform: platformSelect.value,
                  programcode: programcode,
                  requiresmic: micCheckbox.checked
                }
        
                const addFireteam = firebase.functions().httpsCallable('addFireteam');
                addFireteam(newFireteam)
                .then((response) => {
                  db.collection('user').doc(auth.currentUser.uid).get().then(
                    (snapshot) => {
                      var content;
                      switch(programcode)
                      {
                          case 1:
                            content = `${classSelect.value} ${levelInput.value} busca escuadra para ${activityList.value}
                            como actividad del Campamento Crisol.
                             Ver publicación en el campamento: ${window.location.hostname}/programs.html?programcode=${programcode}
                             Unirse: ${window.location.hostname}/fireteams.html?fireteamid=${response.data.reference}`;
                          break;
                          case 2:
                            content = `${classSelect.value} ${levelInput.value} busca escuadra para ${activityList.value}
                            como actividad de la Academia de Incursiones.
                             Ver publicación en la academia: ${window.location.hostname}/programs.html?programcode=${programcode}
                             Unirse: ${window.location.hostname}/fireteams.html?fireteamid=${response.data.reference}`;
                          break;
                      }
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
                            var newPost = {
                                p_currentvideoid: "",
                                p_title: postCreationTitle.value,
                                p_description: postCreationDescription.value,
                                p_fireteamid: response.data.reference,
                                p_programcode: programcode,
                              }
                              const addMentorPost = firebase.functions().httpsCallable('addMentorPost');
                              addMentorPost(newPost)
                              .then(() => {
                                window.location.reload(true);
                              })
                              .catch(error => {
                                mentorPublishButton.classList.remove('hidden');
                                mentorPostError.classList.remove('hidden');
                                loading.classList.add('hidden');
                
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
                          })
                          .catch(error => {
                            mentorPublishButton.classList.remove('hidden');
                            mentorPostError.classList.remove('hidden');
                            loading.classList.add('hidden');
            
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
                        mentorPublishButton.classList.remove('hidden');
                        mentorPostError.classList.remove('hidden');
                        loading.classList.add('hidden');
        
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
                    mentorPublishButton.classList.remove('hidden');
                    mentorPostError.classList.remove('hidden');
                    loading.classList.add('hidden');

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
                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');
              }
            });
            }
            else
            {
                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');
            }
          }
          else
          {
          var newFireteam = {
            bandpostkey: bandpostkey,
            creatorid: auth.currentUser.uid,
            fireteamactivityid: activityId,
            coinbet: false,
            isfull: false,
            platform: platformSelect.value,
            programcode: programcode,
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
                    var newPost = {
                        p_currentvideoid: "",
                        p_title: postCreationTitle.value,
                        p_description: postCreationDescription.value,
                        p_fireteamid: response.data.reference,
                        p_programcode: programcode,
                      }

                    const addMentorPost = firebase.functions().httpsCallable('addMentorPost');
                              addMentorPost(newPost)
                              .then(() => {
                                window.location.reload(true);
                              })
                              .catch(error => {
                                mentorPublishButton.classList.remove('hidden');
                                mentorPostError.classList.remove('hidden');
                                loading.classList.add('hidden');
                
                                var new_deletion = {
                                  ftid: response.data.reference,
                                  creatorid: auth.currentUser.uid
                                }
                                const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                                deleteFireteam(new_deletion);
                              });
                })
                .catch(error => {console.log(error.message);
                    var new_deletion = {
                    ftid: response.data.reference,
                    creatorid: auth.currentUser.uid
                  }
                  const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                  deleteFireteam(new_deletion);
  
                  mentorPublishButton.classList.remove('hidden');
                  mentorPostError.classList.remove('hidden');
                  loading.classList.add('hidden');
                });
              }
            );
          })
          .catch(error => {
            mentorPublishButton.classList.remove('hidden');
            mentorPostError.classList.remove('hidden');
            loading.classList.add('hidden');
          });
          
          }
      });
      }
    });
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        break;
        case 3:
            console.log('Directo solo');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const code = streamForm.code.value;
  const platform = streamPlatform.value;
  const channel = streamChannel.value;
  const program = programcode;

  var request = {
    requestcode : code,
    requestplatform : platform,
    requestchannel: channel,
    requestprogram: program
  }

  const addProjectStream = firebase.functions().httpsCallable('addProjectStream');
  addProjectStream(request)
  .then((response) => {
    var newPost = {
        p_currentvideoid: response.data.reference,
        p_title: postCreationTitle.value,
        p_description: postCreationDescription.value,
        p_fireteamid: "",
        p_programcode: programcode,
      }

    const addMentorPost = firebase.functions().httpsCallable('addMentorPost');
              addMentorPost(newPost)
              .then(() => {
                window.location.reload(true);
              })
              .catch(error => {
                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');
              });
})
.catch(error => {

  mentorPublishButton.classList.remove('hidden');
  mentorPostError.classList.remove('hidden');
  loading.classList.add('hidden');
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        break;
        case 4:
            console.log('Escuadra y directo');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(levelInput.value > 1100 || levelInput.value < 750)
  {
    mentorPublishButton.classList.remove('hidden');
    mentorPostError.classList.remove('hidden');
    loading.classList.add('hidden');
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
                var newFireteam = {
                  bandpostkey: bandpostkey,
                  creatorid: auth.currentUser.uid,
                  fireteamactivityid: activityId,
                  coinbet: false,
                  isfull: false,
                  platform: platformSelect.value,
                  programcode: programcode,
                  requiresmic: micCheckbox.checked
                }
        
                const addFireteam = firebase.functions().httpsCallable('addFireteam');
                addFireteam(newFireteam)
                .then((response) => {
                  db.collection('user').doc(auth.currentUser.uid).get().then(
                    (snapshot) => {
                      var content;
                      switch(programcode)
                      {
                          case 1:
                            content = `${classSelect.value} ${levelInput.value} busca escuadra para ${activityList.value}
                            como actividad del Campamento Crisol.
                             Ver publicación en el campamento: ${window.location.hostname}/programs.html?programcode=${programcode}
                             Unirse: ${window.location.hostname}/fireteams.html?fireteamid=${response.data.reference}`;
                          break;
                          case 2:
                            content = `${classSelect.value} ${levelInput.value} busca escuadra para ${activityList.value}
                            como actividad de la Academia de Incursiones.
                             Ver publicación en la academia: ${window.location.hostname}/programs.html?programcode=${programcode}
                             Unirse: ${window.location.hostname}/fireteams.html?fireteamid=${response.data.reference}`;
                          break;
                      }
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
                            const code = streamForm.code.value;
                            const platform = streamPlatform.value;
                            const channel = streamChannel.value;
                            const program = programcode;

  var request = {
    requestcode : code,
    requestplatform : platform,
    requestchannel: channel,
    requestprogram: program
  }

  const addProjectStream = firebase.functions().httpsCallable('addProjectStream');
  addProjectStream(request)
  .then((snapshot) => {
    var newPost = {
        p_currentvideoid: snapshot.data.reference,
        p_title: postCreationTitle.value,
        p_description: postCreationDescription.value,
        p_fireteamid: response.data.reference,
        p_programcode: programcode,
      }

    const addMentorPost = firebase.functions().httpsCallable('addMentorPost');
              addMentorPost(newPost)
              .then(() => {
                window.location.reload(true);
              })
              .catch(error => {
                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');

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
})
.catch(error => {

  mentorPublishButton.classList.remove('hidden');
  mentorPostError.classList.remove('hidden');
  loading.classList.add('hidden');

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
                          })
                          .catch(error => {
                            mentorPublishButton.classList.remove('hidden');
                            mentorPostError.classList.remove('hidden');
                            loading.classList.add('hidden');
            
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
                        mentorPublishButton.classList.remove('hidden');
                        mentorPostError.classList.remove('hidden');
                        loading.classList.add('hidden');
        
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
                    mentorPublishButton.classList.remove('hidden');
                    mentorPostError.classList.remove('hidden');
                    loading.classList.add('hidden');

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
                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');
              }
            });
            }
            else
            {
                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');
            }
          }
          else
          {
          var newFireteam = {
            bandpostkey: bandpostkey,
            creatorid: auth.currentUser.uid,
            fireteamactivityid: activityId,
            coinbet: false,
            isfull: false,
            platform: platformSelect.value,
            programcode: programcode,
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
                  const code = streamForm.code.value;
                  const platform = streamPlatform.value;
                  const channel = streamChannel.value;
                  const program = programcode;

  var request = {
    requestcode : code,
    requestplatform : platform,
    requestchannel: channel,
    requestprogram: program
  }

  const addProjectStream = firebase.functions().httpsCallable('addProjectStream');
  addProjectStream(request)
  .then((snapshot) => {
    var newPost = {
        p_currentvideoid: snapshot.data.reference,
        p_title: postCreationTitle.value,
        p_description: postCreationDescription.value,
        p_fireteamid: response.data.reference,
        p_programcode: programcode,
      }

    const addMentorPost = firebase.functions().httpsCallable('addMentorPost');
              addMentorPost(newPost)
              .then(() => {
                window.location.reload(true);
              })
              .catch(error => {
                var new_deletion = {
                  ftid: response.data.reference,
                  creatorid: auth.currentUser.uid
                }
                const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                deleteFireteam(new_deletion);

                mentorPublishButton.classList.remove('hidden');
                mentorPostError.classList.remove('hidden');
                loading.classList.add('hidden');
              });
})
.catch(error => {
  var new_deletion = {
    ftid: response.data.reference,
    creatorid: auth.currentUser.uid
  }
  const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
  deleteFireteam(new_deletion);

  mentorPublishButton.classList.remove('hidden');
  mentorPostError.classList.remove('hidden');
  loading.classList.add('hidden');
});
                })
                .catch(error => {
                    var new_deletion = {
                    ftid: response.data.reference,
                    creatorid: auth.currentUser.uid
                  }
                  const deleteFireteam  = firebase.functions().httpsCallable('deleteFireteam');
                  deleteFireteam(new_deletion);
  
                  mentorPublishButton.classList.remove('hidden');
                  mentorPostError.classList.remove('hidden');
                  loading.classList.add('hidden');
                });
              }
            );
          })
          .catch(error => {
            mentorPublishButton.classList.remove('hidden');
            mentorPostError.classList.remove('hidden');
            loading.classList.add('hidden');
          });
          
          }
      });
      }
    });
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        break;
    }
}
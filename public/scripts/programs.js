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
const mentorpostbutton = document.querySelector('.mentorpost-button');

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
        if(programcode === 1)
        {
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
        }
        else if(programcode === 2)
        {
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

signOut.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        window.location.replace('index.html');
      });
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
                if(post_array[index].currentvideoid != "")
                {
                    db.collection('currentvideo').doc(post_array[index].currentvideoid).get().then((videoSnapshot) => {
                        postVideo.textContent = videoSnapshot.data().tag;
                    })
                }
                if(post_array[index].fireteamid != "")
                {
                    seeFireteambutton.classList.remove('hidden');
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
            mentorpostbutton.classList.remove('hidden');
        }
    });
}
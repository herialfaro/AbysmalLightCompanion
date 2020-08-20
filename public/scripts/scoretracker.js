const pointsReady = document.querySelector('.points-ready');
const pointsCalculated = document.querySelector('.points-caluclated');
const ongoingCheck = document.querySelector('.ongoing-check');
const loading = document.querySelector('.loading-process');
const percentage = document.querySelector('.percentage-process');

const calculateButton = document.querySelector('.calculate-btn');
const bandButton = document.querySelector('.publishonband');
const seeList = document.querySelector('.seelist');

const lastAdmin = document.querySelector('#last-admin');

const modalPoints = document.querySelector('#pointslist-modal');
const modalBAND = document.querySelector('#bandpost-modal');

const bandConfirmation = document.querySelector('.band-confirmation');
const bandNo = document.querySelector('.band-no');
const bandLoading = document.querySelector('.band-loading');
const bandError = document.querySelector('.band-error');
const bandPublished = document.querySelector('.band-published');

const listError = document.querySelector('.pointslist-error');
const pointsList = document.querySelector('#pointslist-list');
const listClose = document.querySelector('.pointslist-close');

const onGoingErrorBtn = document.querySelector('.ongoingerror-btn');
const onGoingErrorText = document.querySelector('.ongoingerror-text');
const onGoingErrorLoading = document.querySelector('.ongoingerror-loading');
const onGoingErrorFailure = document.querySelector('.ongoingerror-failure');
const onGoingErrorSuccess = document.querySelector('.ongoingerror-success');

var lastcheck;
var currdate;
var resetdate;
var pastresetdate;

var myHeaders;
var requestOptions;

document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
});

seeList.addEventListener('click', (e) => {
    e.stopPropagation();
    pointsList.innerHTML = '';
    db.collection('user').get().then(users => {
        users.forEach(user => {
            if(user.data().bungieid != '')
            {
                let li = document.createElement('li');
                li.textContent = `${user.data().displayname} ~ Puntos: ${user.data().temporalpoints}`;
                pointsList.appendChild(li);
            }
        });
    }).catch(err => {
        listError.classList.remove('hidden');
    })
    M.Modal.getInstance(modalPoints).open();
});

onGoingErrorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onGoingErrorBtn.classList.add('hidden');
    onGoingErrorText.classList.add('hidden');
    onGoingErrorLoading.classList.remove('hidden');
    const overrideOngoingCheck  = firebase.functions().httpsCallable('overrideOngoingCheck');
    overrideOngoingCheck().then(() => {
        onGoingErrorLoading.classList.add('hidden');
        onGoingErrorSuccess.classList.remove('hidden');
    }).catch(err => {
        onGoingErrorLoading.classList.add('hidden');
        onGoingErrorFailure.classList.remove('hidden');
    });
});

listClose.addEventListener('click', (e) => {
    e.stopPropagation();
    M.Modal.getInstance(modalPoints).close();
});

bandButton.addEventListener('click', (e) => {
    e.stopPropagation();
    M.Modal.getInstance(modalBAND).open();
});

bandNo.addEventListener('click', (e) => {
    e.stopPropagation();
    M.Modal.getInstance(modalBAND).close();
});

bandConfirmation.addEventListener('click', (e) => {
    e.stopPropagation();
    bandConfirmation.classList.add('hidden');
    bandNo.classList.add('hidden');
    bandLoading.classList.remove('hidden');
    db.collection('bandaccesstoken').doc(auth.currentUser.uid).get().then((result) => {
        if(result.data())
        {
            const bandusertoken = result.data().token;
  
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
                  if(band.name == "Abysmal Light")
                  {
                    bandkey = band.band_key;
                  }
                }
              );
              if(bandkey)
              {
                  db.collection('user').get().then(userresults => {
                      db.collection('rank').get().then(rankresults => {
                          var rankuplist = '';
                          userresults.forEach(user => {
                              if(user.data().rankup)
                              {
                                  const name = user.data().displayname;
                                  var userrank;
                                  rankresults.forEach(rank => {
                                      if(user.data().rankid == rank.id)
                                      {
                                          const preference = user.data().preference;
                                          switch(preference)
                                          {
                                              case 1:
                                                userrank = rank.data().name;
                                                  break;
                                              case 2:
                                                userrank = rank.data().pvealt;
                                                  break;
                                              case 3:
                                                userrank = rank.data().pvpalt;
                                                  break;
                                              default:
                                                userrank = '';
                                                  break;
                                          }
                                      }
                                  });
                                  rankuplist += `${name} ~ ${userrank}.%0A`;
                              }
                          });
                          var content = `HONORES DE LA SEMANA:%0AFelicitemos a nuestros compañeros de Abysmal por haber subido de rango esta semana.
                          
                          ${rankuplist}Nuevamente, gracias por su compromiso y dedicación al clan.%0ARecuerden que para que puedan empezar a generar puntos y subir de rangos deben tener una cuenta registrada con el acompañante Abysmal Light y haber escogido su nombre de la lista de usuarios de Bungie.%0ASi todavía no lo has hecho, regístrate a través de esta liga:%0Ahttps://abysmal-light-companion.web.app/`;
                          const url = `https://openapi.band.us/v2.2/band/post/create?access_token=${bandusertoken}&band_key=${bandkey}&content=${content}&do_push=true`;
      
                          requestOptions = {
                            method: 'POST',
                            redirect: 'follow'
                          };
      
                          fetch(url, requestOptions).then(Postresponse => Postresponse.json())
                          .then(Postresult => {
                            bandLoading.classList.add('hidden');
                            bandPublished.classList.remove('hidden');
                          })
                          .catch(err => {
                            bandLoading.classList.add('hidden');
                            bandError.classList.remove('hidden'); 
                          });
                      }).catch(err => {
                        bandLoading.classList.add('hidden');
                        bandError.classList.remove('hidden'); 
                      });
                  }).catch(err => {
                    bandLoading.classList.add('hidden');
                    bandError.classList.remove('hidden'); 
                  });
              }
              else
              {
                bandLoading.classList.add('hidden');
                bandError.classList.remove('hidden'); 
              }
            }).catch(err => {
                bandLoading.classList.add('hidden');
                bandError.classList.remove('hidden'); 
            })
        }
        else
        {
            bandLoading.classList.add('hidden');
            bandError.classList.remove('hidden'); 
        }
    }).catch(err => {
        bandLoading.classList.add('hidden');
        bandError.classList.remove('hidden');
    });
});

auth.onAuthStateChanged(user => {
    if (user)
    {   
        //checks if current user has a bungieid assigned to it
      db.collection('user').doc(user.uid).get().then((snapshot) => {
        if(snapshot.data().bungieid == '')
        {
            window.location.replace('index.html');
        }
        else
        {
            if(!(snapshot.data().isadmin))
            {
                window.location.replace('index.html');
            }
            db.collection('pointsrecord').get().then((recordsnapshot) => {
                recordsnapshot.docs.forEach(
                    doc => {
                    if(doc.data().ongoingcheck)
                    {
                        ongoingCheck.classList.remove('hidden');
                    }
                    else
                    {
                        db.collection('user').doc(doc.data().lastadminchecked).get().then((usersnapshot) => {
                            lastAdmin.textContent = `Última actualización por: ${usersnapshot.data().displayname}`;
                        });
                            lastcheck = new Date((doc.data().lastcheck.seconds)*1000);
                            currdate = new Date();

                            var milliseconds;
                            resetdate = currdate;
                            var resetday = currdate.getUTCDay();
                            while(resetday != 2)
                            {
                                milliseconds = (resetdate) - (86400000);
                                resetdate = new Date(milliseconds);
                                resetday = resetdate.getUTCDay();
                            }
                            resetdate = new Date(Date.UTC(resetdate.getUTCFullYear(),resetdate.getUTCMonth(),resetdate.getUTCDate(),
                            17,0,0,0));
                            milliseconds = (resetdate) - (1000*60*60*24*7);
                            pastresetdate = new Date(milliseconds);
                            milliseconds = null;
                            if(lastcheck < resetdate)
                            {
                                pointsReady.classList.remove('hidden');
                                calculateButton.classList.remove('hidden');
                            }
                            else
                            {
                                pointsCalculated.classList.remove('hidden');
                                bandButton.classList.remove('hidden');
                                seeList.classList.remove('hidden');
                            }
                    } 
                    });
            });
        }
    });
    }
    else
    {
        window.location.replace('index.html');
    }
});

calculateButton.addEventListener('click', (e) => {
    e.stopPropagation();
    loading.classList.remove('hidden');
    pointsReady.classList.add('hidden');
    calculateButton.classList.add('hidden');
    var check = {
        ongoingcheck: true
    }
    const updateOngoingCheck  = firebase.functions().httpsCallable('updateOngoingCheck');
    updateOngoingCheck(check).then(() => {
        loading.textContent = 'Cargando: paso 0/5 completado';
        ScoreTracker();
    }).catch(err => {
        loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
    });
});

function ScoreTracker()
{
    var actpromises = [];
    actpromises.push(db.collection('activity').get());
    actpromises.push(db.collectionGroup('extra').get());
    Promise.all(actpromises).then((results) => {
        var activitylist = [];
            results[0].forEach(result => {
                var extralist = [];
                results[1].forEach(resultextra => {
                    if(resultextra.data().parentid === result.data().docid)
                    {
                        var extra = {
                            displayname: resultextra.data().bungiedisplayname,
                            points: resultextra.data().points
                        }
                        extralist.push(extra);
                    }
                });
                var activity = {
                    bungieapino: result.data().bungieapino,
                    points: result.data().points,
                    type: result.data().gametype,
                    activitiesextra: extralist
                };
                activitylist.push(activity);
            });
        //Continue here
        FetchperMember(activitylist);
    }).catch(err => {
        loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
    });
}

function FetchperMember(activitylist)
{
    var listofmembers = [];
    var rankuppromises = [];
    db.collection('user').get().then(snapshot => {
        snapshot.forEach(doc => {
            if(doc.data().bungieid != '')
            {
                listofmembers.push(doc.data());
                var currPlayer = {
                    userid: doc.id,
                    rankup: false
                  }
                const updateRankUpOnly = firebase.functions().httpsCallable('updateRankUpOnly');
                rankuppromises.push(updateRankUpOnly(currPlayer));
            }
        });
        Promise.all(rankuppromises).then(() => {
            const icounter = listofmembers.length;
        loading.textContent = 'Cargando: paso 1/5 completado';
        db.collection('apikeys').get().then((keysnapshot) => {
            var memberpromises = [];
            keysnapshot.docs.forEach(doc => {
                const xapikey = doc.data().bungiekey;
                for(var i = 0; i < icounter; i++)
                {
                    //GET ABYSMAL LIGHT LIST OF MEMBERS
                    myHeaders = new Headers();
                    myHeaders.append("X-API-KEY", xapikey);
                    requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    memberpromises.push(fetch(`https://www.bungie.net/Platform/Destiny2/${listofmembers[i].bungietype}/Profile/${listofmembers[i].bungieid}/?components=100`, requestOptions));
                }
            });
            //continue here
            var secondPromises = [];
            Promise.all(memberpromises).then(responses => {
                responses.forEach(response => {
                    secondPromises.push(response.json());
                });
                Promise.all(secondPromises).then(results => {
                    var memberlist = [];
                    results.forEach(result => {
                        var member = {
                            membershipid: result.Response.profile.data.userInfo.membershipId,
                            characterids: result.Response.profile.data.characterIds,
                            membershiptype: result.Response.profile.data.userInfo.membershipType,
                            name: result.Response.profile.data.userInfo.displayName
                        };
                        memberlist.push(member);
                    });
                    loading.textContent = 'Cargando: paso 2/5 completado';
                    FetchperChatacter(activitylist,memberlist);
                }).catch(err => {
                    loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
                });
            }).catch(err => {
                loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
            });
        });
        }).catch(err => {
            loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.'
        });
    }).catch(err => {
        loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.'
    });
}

async function FetchperChatacter(activitylist,memberlist)
{
    //here be the foreach member function
    var finallist = [];
    memberlist.forEach(async element => {
        var allactivities = [];
        activitylist.forEach(async act => {
        var responselist = [];
    for(var i = 0; i < element.characterids.length; i++)
    {
        var response;
        var period;
        var pagecount = 0;
        do{
            try{
                await sleep(50);
                response = await FetchActivityHistory(element.membershiptype,element.membershipid,element.characterids[i],act.bungieapino,pagecount,requestOptions);
                const lenght = response.Response.activities.length;
                period = new Date(response.Response.activities[lenght - 1].period);
                pagecount++;
                responselist.push(response);
            }
            catch (e)
            {
                continue;
            }
        }while(period > pastresetdate);
    }
    var activitygroup = {
        definition: act,
        list: responselist
    }
    allactivities.push(activitygroup);
    });
    var finalelement = {
        member: element,
        list: allactivities
    }
    finallist.push(finalelement);
    });
    await sleep(5000);
    CalculatePoints(finallist);
    // console.log(activitylist);
    // fetch(`https://www.bungie.net/Platform/Destiny2/${memberlist[20].membershiptype}/Account/${memberlist[20].membershipid}/Character/${memberlist[20].characterids[0]}/Stats/Activities/?mode=75&count=30&page=0`, requestOptions)
    //           .then(response => response.json())
    //           .then(result => {
    //               console.log(result.Response.activities[0].period);
    //               var period = new Date(result.Response.activities[0].period);
    //               console.log(period);
    //           });
}

async function CalculatePoints(finallist)
{
    var pointslist = [];
    const totalmembers = finallist.length;
    var currentmember = 0;
    percentage.classList.remove('hidden');
    percentage.textContent = `Progreso del paso 3: ${currentmember}/${totalmembers}`;
    for(var i = 0; i < finallist.length; i++)
    {
        //2 attributes: list & member
        var finalpoints = 0;
        for(var j = 0; j < finallist[i].list.length; j++)
        {
            if(finallist[i].list[j].definition.activitiesextra.length > 0)
            {
                for(var k = 0; k < finallist[i].list[j].list.length; k++)
                {
                    if(finallist[i].list[j].list[k].Response != undefined)
                    {
                        if(finallist[i].list[j].list[k].Response.activities != undefined)
                        { 
                           for(var l = 0; l < finallist[i].list[j].list[k].Response.activities.length; l++)
                           {
                                const activitydate = new Date(finallist[i].list[j].list[k].Response.activities[l].period);
                                if ((activitydate > resetdate) || (activitydate < pastresetdate))
                                {
                                    continue;
                                }
                                var currentpoints = 0;
                                switch(finallist[i].list[j].definition.type)
                                {
                                    case 'pvp':
                                        const completedpvp = finallist[i].list[j].list[k].Response.activities[l].values.completed.basic.value;
                                        const standingpvp = finallist[i].list[j].list[k].Response.activities[l].values.standing.basic.value;
                                        if((completedpvp == 1) && (standingpvp == 0))
                                        {
                                            await sleep(50);
                                            const activityDefinition = await FetchActivityDefinition(finallist[i].list[j].list[k].Response.activities[l].activityDetails.directorActivityHash, requestOptions);
                                            if(activityDefinition.Response != undefined)
                                            {
                                                currentpoints = finallist[i].list[j].definition.points;
                                                finallist[i].list[j].definition.activitiesextra.forEach(extra => {
                                                    if(activityDefinition.Response.displayProperties.name == extra.displayname)
                                                    {
                                                        currentpoints = extra.points;
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                currentpoints = finallist[i].list[j].definition.points;
                                            }
                                        }
                                    break;
                                    case 'pve':
                                        const completedpve = finallist[i].list[j].list[k].Response.activities[l].values.completed.basic.value;
                                        if(completedpve == 1)
                                        {
                                            await sleep(60);
                                            try{
                                                const activityDefinition = await FetchActivityDefinition(finallist[i].list[j].list[k].Response.activities[l].activityDetails.directorActivityHash, requestOptions);
                                                    if(activityDefinition.Response != undefined)
                                                    {
                                                        currentpoints = finallist[i].list[j].definition.points;
                                                        finallist[i].list[j].definition.activitiesextra.forEach(extra => {
                                                            if(activityDefinition.Response.displayProperties.name == extra.displayname)
                                                            {
                                                                currentpoints = extra.points;
                                                            }
                                                        });
                                                    }
                                                    else
                                                    {
                                                        currentpoints = finallist[i].list[j].definition.points;
                                                    }
                                            }
                                            catch (e)
                                            {
                                                loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
                                            }
                                        }
                                    break;
                                    case 'pvecompetitive':
                                        const completedpvecomp = finallist[i].list[j].list[k].Response.activities[l].values.completed.basic.value;
                                        if(completedpvecomp == 1)
                                        {
                                            await sleep(50);
                                            const activityDefinition = await FetchActivityDefinition(finallist[i].list[j].list[k].Response.activities[l].activityDetails.directorActivityHash, requestOptions);
                                            if(activityDefinition.Response != undefined)
                                            {
                                                currentpoints = (finallist[i].list[j].definition.points) * (finallist[i].list[j].list[k].Response.activities[l].values.teamScore.basic.value);
                                                finallist[i].list[j].definition.activitiesextra.forEach(extra => {
                                                    if(activityDefinition.Response.displayProperties.name == extra.displayname)
                                                    {
                                                        currentpoints = (extra.points) * (finallist[i].list[j].list[k].Response.activities[l].values.teamScore.basic.value);
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                currentpoints = (finallist[i].list[j].definition.points) * (finallist[i].list[j].list[k].Response.activities[l].values.teamScore.basic.value);
                                            }
                                        }
                                    break;
                                    default:
                                    break;
                                }
                                finalpoints += currentpoints;
                           }
                        }
                    }
                }
            }
            else
            {
                for(var k = 0; k < finallist[i].list[j].list.length; k++)
                {
                    if(finallist[i].list[j].list[k].Response != undefined)
                    {
                        if(finallist[i].list[j].list[k].Response.activities != undefined)
                        { 
                            for(var l = 0; l < finallist[i].list[j].list[k].Response.activities.length; l++)
                            {
                                const activitydate = new Date(finallist[i].list[j].list[k].Response.activities[l].period);
                                if ((activitydate > resetdate) || (activitydate < pastresetdate))
                                {
                                    continue;
                                }
                                var currentpoints = 0;
                                switch(finallist[i].list[j].definition.type)
                                {
                                    case 'pvp':
                                        const completedpvp = finallist[i].list[j].list[k].Response.activities[l].values.completed.basic.value;
                                        const standingpvp = finallist[i].list[j].list[k].Response.activities[l].values.standing.basic.value;
                                        if((completedpvp == 1) && (standingpvp == 0))
                                        {
                                            currentpoints = finallist[i].list[j].definition.points;
                                        }
                                    break;
                                    case 'pve':
                                        const completedpve = finallist[i].list[j].list[k].Response.activities[l].values.completed.basic.value;
                                        if(completedpve == 1)
                                        {
                                            currentpoints = finallist[i].list[j].definition.points;
                                        }
                                    break;
                                    case 'pvecompetitive':
                                        const completedpvecomp = finallist[i].list[j].list[k].Response.activities[l].values.completed.basic.value;
                                        if(completedpvecomp == 1)
                                        {
                                            currentpoints = (finallist[i].list[j].definition.points) * (finallist[i].list[j].list[k].Response.activities[l].values.teamScore.basic.value);
                                        }
                                    break;
                                    default:
                                    break;
                                }
                                finalpoints += currentpoints;
                            }
                        }
                    }
                }
            }
        }
        var finalmember = {
            membershipid: finallist[i].member.membershipid,
            displayname: finallist[i].member.name,
            points: finalpoints
        }
        pointslist.push(finalmember);
        currentmember++;
        percentage.textContent = `Progreso del paso 3: ${currentmember}/${totalmembers}`;
        await sleep(5000);
    }
    percentage.classList.add('hidden');
    loading.textContent = 'Cargando: paso 3/5 completado';
    UploadResultstoDB(pointslist);
}

function UploadResultstoDB(pointslist)
{
    db.collection('user').get().then(snapshot => {
        var userPromises = [];
        snapshot.forEach(user => {
            var temppoints = 0;
            for(var i = 0; i < pointslist.length; i++)
            {
                if(pointslist[i].membershipid == user.data().bungieid)
                {
                    temppoints = pointslist[i].points;
                }
            }
            var temporal_points = {
                userid: user.id,
                temporalpoints: temppoints
            }
            const updateTemporalPoints  = firebase.functions().httpsCallable('updateTemporalPoints');
            userPromises.push(updateTemporalPoints(temporal_points));
        });
        Promise.all(userPromises).then(responses => {
            loading.textContent = 'Cargando: paso 4/5 completado';
            const updateUsersRanks = firebase.functions().httpsCallable('updateUsersRanks');
            updateUsersRanks().then(() => {
                loading.textContent = 'Cargando: paso 5/5 completado';
                pointsCalculated.classList.remove('hidden');
                bandButton.classList.remove('hidden');
                seeList.classList.remove('hidden');
            }).catch(err => {
                loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
            });
        }).catch(err => {
            loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
        });
    }).catch(err => {
        loading.textContent = 'Hubo un error al calcular los puntos, por favor refresca la página e inténtalo de nuevo.';
    });
}

async function FetchActivityHistory(membershiptype, membershipid, characterid, mode, pages, Options)
{
    const snapshot = await fetch(`https://www.bungie.net/Platform/Destiny2/${membershiptype}/Account/${membershipid}/Character/${characterid}/Stats/Activities/?mode=${mode}&count=30&page=${pages}`, Options);
    const response = await snapshot.json();
    return response;
}

async function FetchActivityDefinition(activityhash, Options)
{
    const snapshot = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/${activityhash}/`, Options);
    const response = await snapshot.json();
    return response;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
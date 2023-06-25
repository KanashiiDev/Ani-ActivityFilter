// ==UserScript==
// @name        Activity Filter
// @namespace   https://github.com/KanashiiDev
// @match       https://anilist.co/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @version     1.0.8
// @author      KanashiiDev
// @description Filters users anime/manga activities.
// @supportURL  https://github.com/KanashiiDev/Ani-ActivityFilter/issues
// ==/UserScript==

//CSS
var styles = `
   .mainbtn {
    list-style: none;
    cursor: pointer;
    color: rgb(var(--color-text))
   }
    .mainbtns {
    -webkit-transition:0.25s;
    -o-transition:0.25s;
    transition:0.25s;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-size: 1.3rem;
    font-weight: 900;
    border: 0px;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    padding: 4px;
    margin: 4px;
    cursor: pointer;
    background: rgb(var(--color-background));
    color: rgb(var(--color-text));
    }
    .btn-active {
    background: rgb(40, 56, 77);
    color: rgb(159, 173, 189)
    }
    .searchinput {
    -webkit-transition:0.25s;
    -o-transition:0.25s;
    transition:0.25s;
    font-family: Overpass, -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-size: 1.3rem;
    font-weight: 900;
    border:0;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    padding: 4px;
    margin: 4px;
    background: rgb(var(--color-background));
    color: rgb(var(--color-text));
    outline: none;
    }
    .searchinput::-webkit-input-placeholder {
    color: rgb(var(--color-text));
    }
    .searchinput::-moz-placeholder {
    color: rgb(var(--color-text));
    }
    .searchinput:-ms-input-placeholder {
    color: rgb(var(--color-text));
    }
    .searchinput::-ms-input-placeholder {
    color: rgb(var(--color-text));
    }
    .searchinput::placeholder {
    color: rgb(var(--color-text));
    }
    .mainbtns:active {
    background:rgba(40,56,77)
    }
    .mainbtns:hover {
    color: rgb(var(--color-blue))
    }
    .maindiv {
    width: 100%;
    -webkit-transition: 1s;
    -o-transition: 1s;
    transition: 1s;
    position: relative;
    background: rgb(var(--color-foreground));
    overflow-y: scroll;
    display: -ms-grid;
    display: grid;
    color: rgb(var(--color-text));
    padding: 10px;
    padding-bottom:0;
    margin-right: 10px;
    margin-bottom: 20px;
    border: 1px solid #6969694d;
    -webkit-border-radius: 10px;
            border-radius: 10px
    }
    .maindivheader{
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    text-align:center;
    }
    .ResultDivInside {
    overflow-y: scroll;
    -webkit-border-radius: 10px;
            border-radius: 10px;
    padding: 10px;
    padding-top: 20px;
    padding-bottom: 0;
    margin-top: 10px;
    margin-bottom: 10px
    }
    .userdata,
    .animedata {
    cursor: pointer;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 20fr 1fr;
    grid-template-columns: 20fr 1fr;
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    padding: 5px;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    border: 0px;
    -webkit-border-radius: 5px;
            border-radius: 5px;
    background: transparent;
    }
    .userdataimg,
    .animedataimg {
    background-repeat:no-repeat;
    height: 25px;
    width: 25px;
    padding:0 0 23px;
    background-size: cover;
    margin-left: 5px;
    border: 1px solid rgba(var(--color-foreground));
    -webkit-border-radius: 5px;
            border-radius: 5px
    }
    .blacklistDiv {
    max-height: 245px;
    overflow-y: scroll;
    grid-template-columns: repeat(auto-fill,201px);
    justify-content: space-evenly
    }
    .animedataDiv {
    display: grid;
    max-height: 250px;
    overflow-y: scroll;
    padding-top: 5px
    }
    .buttonsDiv {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    word-break: break-word
    }
    .blocked {
    border: 1px solid darkred;
    margin-bottom: 5px;
    border-radius: 5px;
    background: rgb(var(--color-background))
    }
    .selected {
    border:1px solid gray;
    margin-bottom:5px;
    border-radius:5px;
    background:rgb(var(--color-background))
    }
    #switchbtn {
    position: relative;
    display: inherit;
    height: 25px;
    align-items: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 10px;
    margin-right: 75px;
    &:hover {
    color: rgb(var(--color-text));
    }}
    #stopbtn{
    height:30px;
    text-transform: uppercase;
    margin-top:0;
    -webkit-box-flex:1;
    -webkit-flex-grow:1;
    -ms-flex-positive:1;
        flex-grow:1
    }
    .actdiv{
    margin-bottom:15px;
    }
    .blacklistDiv,
   .animedataDiv,
   .ResultDivInside {
   -webkit-mask-image: linear-gradient(to bottom, transparent 0, black var(--top-mask-size), black -webkit-calc(100% - var(--bottom-mask-size)), transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0, black var(--top-mask-size), black calc(100% - var(--bottom-mask-size)), transparent 100%);
    --bottom-mask-size: 10px;
    --top-mask-size: 10px
    }
    #animelist div:nth-child(1) b,
    #animelist div:nth-child(2) b,
    #animelist div:nth-child(3) b {
    margin-top: 20px;
    margin-bottom: 5px;
    background: rgba(var(--color-background));
    padding: 5px;
    -webkit-border-radius: 5px;
            border-radius: 5px;
    display: block;
    text-align: center
    }
    #animelist div:nth-child(1) b {
    margin-top:3px
    }
`
//Add CSS
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

//Get Username
let auth;
let user = '';
let userid = 0;
try {
    auth = JSON.parse(localStorage.getItem('auth'));
} catch (err) {
    console.warn('could not get auth');
}
if (auth) {
    user = auth.name;
    userid = auth.id;
} else {
    try {
        user = document
            .querySelector(".nav .links .link[href^='/user/']")
            .href.match(/\/user\/(.*)\//)[1];
    } catch (e) {
        alert('Please login before to use -Anime Filter- script.');
        return;
    }
}
let username = String(user);
let usernameurl = String('https://anilist.co/user/' + user + '/');
var mainarray = [];
let onMainDiv = false;
let notLiked = false;
var val = 0;
var active = false;
var filterall = false;
var oldHref = document.location.href;
interval = null;
var liststatus = [];
var blacklistarray = [];
var animeswitch = true;
// Create Function
//create("element", {class:"", id:""},'text');
function create(tag, attrs, html) {
    if (!tag) throw new SyntaxError("'tag' not defined"); // In case you forget
    var ele = document.createElement(tag),
        attrName, styleName;
    if (attrs) for (attrName in attrs) {
      if (attrName === "style") for (styleName in attrs.style) {
        ele.style[styleName] = attrs.style[styleName];
      }
      else if (attrs[attrName])
        ele.setAttribute(attrName, attrs[attrName]);
    }
  if (html)
    ele.innerHTML = html;
  return ele;
}
//Set Function
//set(element,{style:{..}});
//set(element, {class:"", id:"",style:{..}},'text');
function set(tag, attrs, html) {
    if (!tag) throw new SyntaxError("'tag' not defined"); // In case you forget
    var ele = tag,
        attrName, styleName;
    if (attrs) for (attrName in attrs) {
      if (attrName === "style") for (styleName in attrs.style) {
        ele.style[styleName] = attrs.style[styleName];
      }
      else if (attrs[attrName])
        ele.setAttribute(attrName, attrs[attrName]);
    }
  if (html)
    ele.innerHTML = html;
  return ele;
}
const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

notLiked = JSON.parse(localStorage.getItem("notLiked"));
function notLikedCheck() {notLiked = !notLiked; localStorage.setItem("notLiked", notLiked); getSettings();}
onMainDiv = JSON.parse(localStorage.getItem("onMainDiv"));
function onMainDivCheck() {onMainDiv = !onMainDiv;localStorage.setItem("onMainDiv", onMainDiv);getSettings();}
hideUser = JSON.parse(localStorage.getItem("hideUser"));
function hideUserCheck() {hideUser = !hideUser;localStorage.setItem("hideUser", hideUser);getSettings();
}

function getSettings() {
notlikedbtn.classList.toggle("btn-active", notLiked);resultbtn.classList.toggle("btn-active", onMainDiv);hideuserbtn.classList.toggle("btn-active", hideUser);
let activitiesidarray = window.localStorage.getItem('blockarray');if(activitiesidarray !== null) {let ars = activitiesidarray.split(/[.,!,?]/);blacklistarray = ars;}
let listarray = window.localStorage.getItem('liststatus');if(listarray === null || listarray === '') {listarray = [];}else{let ars2 = listarray.split(/[.,!,?]/);liststatus = ars2;}
for (i=0;i<3;i++) {if (liststatus.indexOf('CURRENT') === -1) {button10.classList.toggle("btn-active", false);}else { button10.classList.toggle("btn-active", true);}
if (liststatus.indexOf('COMPLETED') === -1) {button9.classList.toggle("btn-active", false);} else { button9.classList.toggle("btn-active", true);}
if (liststatus.indexOf('PLANNING') === -1) {button11.classList.toggle("btn-active", false);} else { button11.classList.toggle("btn-active", true);}}
}

let switchbutton=create("button",{class:"mainbtns",id:"switchbtn"},'<p>'+"Anime"+'</p>'+"/"+'<p>'+"Manga"+'</p>');switchbutton.onclick=()=>{animeswitch = !animeswitch; switchAnimeManga()};
let button=create("li",{class:"el-dropdown-menu__item mainbtn",id:"Watching"},"Activity Filter");button.onclick=()=>{createDiv()};
let button2=create("button",{class:"mainbtns",id:"closebtn"},"Close");button2.onclick=()=>{closeDiv()};
let button3=create("button",{class:"mainbtns",id:"filterallbtn"},"Filter All");button3.onclick=()=>{clearInterval(interval),filterAll()};
let button4=create("button",{class:"mainbtns",id:"stopbtn"},"Stop");button4.onclick=()=>{stop()};
let button5=create("button",{class:"mainbtns",id:"refreshbtn"},"Refresh");button5.onclick=()=>{refresh()};
let button6=create("button",{class:"mainbtns",id:"resultbtn"},"Move Results");button6.onclick=()=>{onMainDivCheck(),$(".feed-type-toggle > div.active").click()};
let button7=create("button",{class:"mainbtns",id:"notlikedbtn"},"Not Liked");button7.onclick=()=>{notLikedCheck(),$(".feed-type-toggle > div.active").click()};
let button8=create("button",{class:"mainbtns",id:"hideuserbtn"},"Hide "+username);button8.onclick=()=>{hideUserCheck(),$(".feed-type-toggle > div.active").click()};
let button9=create("button",{class:"mainbtns",id:"currentbtn"},"Completed ");button9.onclick=()=>{liststatus.indexOf("COMPLETED") === -1 ? liststatus.push("COMPLETED") : liststatus.splice(liststatus.indexOf("COMPLETED"), 1);localStorage.setItem("liststatus", [(liststatus)]);getSettings();getlist()};
let button10=create("button",{class:"mainbtns",id:"completedbtn"},"Current ");button10.onclick=()=>{liststatus.indexOf("CURRENT") === -1 ? liststatus.push("CURRENT") : liststatus.splice(liststatus.indexOf("CURRENT"), 1);localStorage.setItem("liststatus", [(liststatus)]);getSettings();getlist()};
let button11=create("button",{class:"mainbtns",id:"planningbtn"},"Planning ");button11.onclick=()=>{liststatus.indexOf("PLANNING") === -1 ? liststatus.push("PLANNING") : liststatus.splice(liststatus.indexOf("PLANNING"), 1);localStorage.setItem("liststatus", [(liststatus)]);getSettings();getlist()};
let button12=create("button",{class:"mainbtns",id:"blacklistbtn",style: {position:"absolute",right:"10px"}},"Blacklist");button12.onclick=()=>{toggleBlocklist()};
let searchinput=create("input",{class:"searchinput",id:"searchinput"});searchinput.onkeyup=()=>{search()};searchinput.placeholder = "Search";
let blacklistDiv = create("div", {class: "blacklistDiv",style: {display:"none"}});
let activityDiv = create("div", {class: "activityDiv",style: {display:"block"}});

function start() {
  if (!/^\/(home|user)\/?([\w-]+)?\/?$/.test(location.pathname)) {return}
  let filters = document.querySelectorAll(".el-dropdown-menu");
  if (!filters) {setTimeout(start, 500);return}
  setTimeout(start, 1000);
  for (var x = 0; x < filters.length; x++) {
    if (filters[x].children[0].innerText.trim() === "All") {
      filters[x].appendChild(button);}}
}

function createDiv() {
    listprogress(); active = !active;
    if (document.querySelector("li.el-dropdown-menu__item.active")) {
        delay(100).then(() => document.querySelector("li.el-dropdown-menu__item.active").className = document.querySelector("li.el-dropdown-menu__item.active").className.replace(/(?:^|\s)active(?!\S)/g, ''));
    }
    if (active) {
        button.setAttribute("class", "el-dropdown-menu__item active");
          let listDiv = create("div", {class: "maindiv",id: "listDiv"}, '<div class="maindivheader"><b>'+button.innerText+'</b></div>');
      if (/^\/(user)\/?([\w-]+)?\/?$/.test(location.pathname)) {
        var list = document.querySelector(".activity-feed-wrap");}
        else {var list = document.querySelector(".activity-feed-wrap + div");}
        list.insertBefore(listDiv, list.children[0]);
        document.querySelector("#listDiv > div").append(button12,switchbutton);
        let buttonsDiv=create("div",{class:"buttonsDiv",id:"buttonsDiv"});
        listDiv.append(blacklistDiv,buttonsDiv,searchinput);
        buttonsDiv.append(button2, button3, button5, button6, button7, button8,button9,button10,button11);
        let stopDiv=create("div",{class:"stopDiv",id:"stopDiv",style:{display:"none",marginTop:"10px"}});
        listDiv.appendChild(stopDiv);
        stopDiv.appendChild(button4);
        let animedataDiv=create("div",{class:"animedataDiv",id:"animedataDiv"});
        listDiv.appendChild(animedataDiv);
        let ResultDiv=create("div",{class:"maindiv",id:"ResultDiv",style:{display:"none",maxHeight:"460px"}},"<b>Results</br></b>");
        let ResultDivInside=create("div",{class:"ResultDivInside",id:"ResultDivInside",style:{maxHeight:"400px"}});
        ResultDiv.appendChild(ResultDivInside);
        $(ResultDiv).insertAfter(listDiv);
        searchinput.value = "";
        getSettings();
        animeswitch = true;
        switchAnimeManga();
    }
    if (!active) {closeDiv();}
}

function closeDiv() {
    clearInterval(interval);
    var list = document.querySelectorAll("li:nth-child(1)");
    for (var x = 0; x < list.length; x++) {
        if (list[x].innerText.trim() == "All") {
            list[x].click();}}
    button.setAttribute("class", "el-dropdown-menu__item");
    listDiv.remove();
    ResultDiv.remove();
    active = false;
}
function switchAnimeManga(){
  if(animeswitch)
    {switchbutton.children[0].style.color="rgb(var(--color-blue))";
     switchbutton.children[1].style.color="";
     button9.innerText = "Completed Anime";
     button10.innerText = "Current Anime";
     button11.innerText = "Planning Anime";
     searchinput.placeholder = "Search Anime";
    }
  else {
    switchbutton.children[0].style.color="";
    switchbutton.children[1].style.color="rgba(var(--color-green))";
    button9.innerText = "Completed Manga";
    button10.innerText = "Current Manga";
    button11.innerText = "Planning Manga";
    searchinput.placeholder = "Search Manga";
  }
  if (searchinput.value === "") {getlist();} else {search();}
}

function listprogress() {
   if (/^\/(home)\/?([\w-]+)?\/?$/.test(location.pathname)) {
    var list = document.querySelectorAll("li:nth-child(3)");
    for (var x = 0; x < list.length; x++) {
        if (list[x].innerText.trim() == "List Progress") {
            list[x].click();}}
}
   if (/^\/(user)\/?([\w-]+)?\/?$/.test(location.pathname)) {
    var list = document.querySelectorAll("li:nth-child(4)");
    for (var x = 0; x < list.length; x++) {
        if (list[x].innerText.trim() == "List") {
            list[x].click();}}
   }
}

function filterAll() {
    var elem = document.querySelectorAll(".animedatalink")
    if(elem.length > 0) {
        elem.forEach(animeinfo => {
            mainarray.push(animeinfo.innerText);
            mainarray.join("");})
    filterall = true;
    listprogress();
    set(buttonsDiv, {style: {pointerEvents: "none"}});
    set(stopDiv, {style: {display: "flex"}});
    set(button4, {style: {visibility: "visible"}});
      delay(1000).then(() => replacedivloop());}
  else {window.alert("Error:The list is empty. Please add anime or manga.")}
}

function replacedivloop(el) {
  if(!onMainDiv){
  let activitydiv = document.querySelector("div.activity-feed-wrap > div.activity-edit");
  activitydiv.append(activityDiv)
  let scroller = document.querySelector("div.activity-feed-wrap > div.scroller");
  set(scroller, {style: {top: "0",position:"fixed",height:"10vh",visibility:"hidden"}});}
    interval = setTimeout(function() {
        var loop = 0;
        var result = 0;
        let elem = document.querySelectorAll(".animedata");
        let activities = document.querySelectorAll(".activity-feed > div > div.wrap > div.list > div > div.status > a.title");
        var activityArray = [];
        let trimArray = [];

        activities.forEach(act => {
        activityArray.push(act.text);
        })

        let trimArray1 = activityArray.map(element => {
            return element.trim();
        });

        if (filterall) {trimArray = mainarray.map(element => {return element.trim();});
        } else {trimArray = el.textContent;}
            if (filterall) {
                   for (var i = 0; i < mainarray.length; i++) {
                if (trimArray1[val] == trimArray[i]) {
                    result = 1;
                }
            }} else {
                   for (var i = 0; i < activities.length; i++) {
                if (trimArray1[val] == trimArray) {
                    result = 1;
                }
            }
        }
        if (result == 0) {
            if (trimArray1[val] == null) {
              window.scrollTo(window.scrollX, window.scrollY - 1);
              window.scrollTo(window.scrollX, window.scrollY + 1);
                val = 0;
                $(".load-more").click();
            } else {
                document.getElementsByClassName("activity-entry")[val].innerHTML = "";
                document.getElementsByClassName("activity-entry")[val].classList.remove('activity-entry');
                val = 0;
            }
        }
        if (result == 1) {

            var entry = document.getElementsByClassName("activity-entry")[val];

            if (entry) {
                var liked = entry.querySelector('.liked');
                var user = entry.querySelector('.name').innerText;
                var entryhref = activities[val].href;
            }
          if (blacklistarray.length > 0) {
            for (var i = 0; i < mainarray.length; i++) {
              if (blacklistarray.indexOf(user) !== -1) {
                entry.innerHTML = "";
                entry.classList.remove('activity-entry');
              }
            }
          }
            if (notLiked) {
                if (entry) {
                    if (liked) {
                        entry.innerHTML = "";
                        entry.classList.remove('activity-entry');
                    }
                }
            }
            if (hideUser) {
                if (entry) {
                    if (user && user == username) {
                        entry.innerHTML = "";
                        entry.classList.remove('activity-entry');
                    }
                }
            }
          if(animeswitch){
            if (entryhref !== null && entryhref.indexOf("/manga/") > -1) {
                entry.innerHTML = "";
                entry.classList.remove('activity-entry');
            }
          }
          else{
            if (entryhref !== null && entryhref.indexOf("/anime/") > -1) {
                entry.innerHTML = "";
                entry.classList.remove('activity-entry');
            }
          }
            if (onMainDiv) {
                result = 0;
                entry.classList.remove('activity-entry');
                entry.classList.add('actdiv');
                document.getElementById("ResultDivInside").append(entry);
                if (ResultDiv.innerText.length > 10) {
                  set(ResultDiv, {style: {display: "grid"}});
                } else {
                set(ResultDiv, {style: {display: "none"}});
                }
            } else {
                result = 0;
                entry.classList.remove('activity-entry');
                entry.classList.add('actdiv');
                activityDiv.append(entry);}
            val++;
        }
        loop++;
        if (loop < 20) {
            if (filterall) {
                replacedivloop()
            } else {
                replacedivloop(el);
            }
        }
        let ad = document.querySelectorAll(".animedata");
        for (var x = 0; x < ad.length; x++) {
            if (filterall) {
              ad[x].classList.toggle("selected", true);
            } else {
                if (ad[x].innerText == el.innerText) {
                  ad[x].classList.toggle("selected", true);
                } else {
                  ad[x].classList.toggle("selected", false);
                }
            }
        }
    }, 50)
}

function refresh() {
    stop();
    set(ResultDiv, {style: {display: "none"}});
    listprogress();
    getlist();
}

function stop() {
    filterall = false;
    clearInterval(interval);
    let ad = document.querySelectorAll(".animedata");
    for (var x = 0; x < ad.length; x++) {
        set(buttonsDiv, {style: {pointerEvents: "auto"}})
        ad[x].classList.toggle("selected", false);
        set(ResultDivInside, {style: {background: 'rgb(var(--color-background))'}});
    }
    set(stopDiv, {style: {display: "none"}});
}

function getlist() {
  let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);
  if (searchinput.value == "") {animedataDiv.innerHTML = "";} else {return}
  let listcurrent = "CURRENT";
  let listtype="ANIME";
  if(!animeswitch){listtype="MANGA";}
   let maindiv = create("div",{id:"animelist"});animedataDiv.appendChild(maindiv);
  liststatus.forEach(function(data){listcurrent = data;listquery();});
  function listquery(){
    let title = create("div",false, "<b>" + listcurrent + "</b>");maindiv.appendChild(title);
    if(liststatus.length === 1){title.children[0].style.cssText ="display:none"}
    var query = `query($name:String!,$listType:MediaType,$listStatus:MediaListStatus){
    MediaListCollection(userName:$name,type:$listType,status:$listStatus,sort:MEDIA_TITLE_ROMAJI){lists{entries{... mediaListEntry}}}}
    fragment mediaListEntry on MediaList{mediaId media {type id siteUrl title {romaji}coverImage {large}}}`;
    var variables = {name: username,listType: listtype,listStatus: listcurrent};
    let url = 'https://graphql.anilist.co',
        options = {method: 'POST',headers: {'Content-Type': 'application/json','Accept': 'application/json'},
                   body: JSON.stringify({query: query,variables: variables})};
    fetch(url, options).then(handleResponse).then(handleData).catch(handleError);
    function handleResponse(response) {return response.json().then(function(json) {return response.ok ? json : Promise.reject(json);});}
    
    function handleData(data) {
      let strArray = [];
        data.data.MediaListCollection.lists.forEach(list => {
          list.entries.forEach(animedata => {
          strArray.push(animedata.media.title.romaji);
          let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);
          if(findDuplicates(strArray).length < 1){
          let aimg = create("a", {class: "animedataimg",href:animedata.media.siteUrl,style: {backgroundImage: "url(" + animedata.media.coverImage.large + ")"}});
          let a = create("a", {class: "animedata",id: (animedata.media.id)});
          let alink = create("a", {class: "animedatalink",id: (animedata.media.id)});
          aimg.before(a);
          alink.innerText = (animedata.media.title.romaji);
          title.appendChild(a);
          a.appendChild(alink);
          a.appendChild(aimg);}})
        })
    }
    function handleError(error) {console.error(error);}
}
delay(500).then(() => animedataclick());
}

function toggleBlocklist(){
  if(blacklistDiv.style.display === "none"){
    blacklistDiv.style.display = "grid";
    blacklistDiv.innerHTML = "";
    getFollowing();
  }
  else{blacklistDiv.style.display = "none"}
};

function getFollowing() {
  recall();
  var page=1;
  function recall(){
      var query = `query ($id: Int!, $page: Int) {Page (page: $page) {pageInfo{currentPage hasNextPage}
  following(userId: $id, sort:USERNAME) {name avatar{medium} siteUrl}}}`;
    var variables = {id:userid,page:page};
    let url = 'https://graphql.anilist.co',options = {method: 'POST',headers: {'Content-Type': 'application/json','Accept': 'application/json'},
            body: JSON.stringify({query: query,variables: variables})};
    fetch(url, options).then(handleResponse).then(handleData).catch(handleError);
    function handleResponse(response) {return response.json().then(function(json) {return response.ok ? json : Promise.reject(json);});}

    function handleData(data) {
       data.data.Page.following.forEach(following => {
        let userimg=create("a",{class:"userdataimg",href:following.siteUrl,style:{backgroundImage:"url("+following.avatar.medium+")"}});
        let userdata=create("a",{class:"userdata"});
        userimg.before(userdata);
        userdata.innerText = (following.name);
        blacklistDiv.appendChild(userdata);
        userdata.appendChild(userimg);
        })
      if(data.data.Page.pageInfo.hasNextPage === true){
			page = data.data.Page.pageInfo.currentPage + 1;
			recall();
		}
      blacklistclick();
      blacklistcheck();
    }
    function handleError(error) {console.error(error);}}
}

function search() {
   if(!animeswitch){
  var query = `query ($id: Int, $page: Int, $search: String) {Page (page: $page) {media (id: $id, search: $search, type: MANGA) {type id siteUrl title { romaji } coverImage { large  }}}}`;}
  else {var query = `query ($id: Int, $page: Int, $search: String) {Page (page: $page) {media (id: $id, search: $search, type: ANIME) {type id siteUrl title { romaji } coverImage { large  }}}}`;}
    var variables = {search: searchinput.value,page: 1};
    let url = 'https://graphql.anilist.co',options = {method: 'POST',headers: {'Content-Type': 'application/json','Accept': 'application/json'},body: JSON.stringify({query: query,variables: variables})};
    fetch(url, options).then(handleResponse).then(handleData).catch(handleError);
    function handleResponse(response) {return response.json().then(function(json) {return response.ok ? json : Promise.reject(json);});}

   function handleData(data) {
      if (searchinput.value == "") {getlist();} else {animedataDiv.innerHTML = "";}
      data.data.Page.media.forEach(animedata => {
        let aimg=create("a",{class:"animedataimg",href:animedata.siteUrl,style:{backgroundImage:"url("+animedata.coverImage.large+")"}});
        let a=create("a",{class:"animedata",id:animedata.id});
        let alink = create("a", {class: "animedatalink",id: (animedata.id)});
        aimg.before(a);
        alink.innerText = (animedata.title.romaji);
        animedataDiv.appendChild(a);
        a.appendChild(alink);
        a.appendChild(aimg);
        })
        var elem = document.querySelectorAll(".animedata")
        mainarray = [];
        elem.forEach(animeinfo => {
            mainarray.push(animeinfo.innerText);
            mainarray.join("");
        })
     animedataclick()
    }
    function handleError(error) {console.error(error);}
}

function animedataclick() {
    each('.animedatalink', function(el) {
        el.addEventListener('click', function(e) {
            listprogress();
            refresh();
            delay(1000).then(() => replacedivloop(el));
            set(stopDiv, {style: {display: "flex"}});
            set(button4, {style: {visibility: "visible"}})
              set(buttonsDiv, {style: {pointerEvents: "none"}})
        });
    });
    function each(el, callback) {
        var allDivs = document.querySelectorAll(el),
            alltoArr = Array.prototype.slice.call(allDivs);
        Array.prototype.forEach.call(alltoArr, function(selector, index) {
            if (callback) return callback(selector);
        });
    };
}

function blacklistcheck(){
  let userdata = document.querySelectorAll(".userdata")
  if (!userdata) {setTimeout(blacklistcheck, 500);return}
  let activitiesidarray = window.localStorage.getItem('blockarray');
  if(activitiesidarray !==null) {
  let x = activitiesidarray.split(/[.,!,?]/);
  blacklistarray = x;}
  userdata.forEach(userinfo => {
    if (blacklistarray.indexOf(userinfo.innerText) === -1) {
      userinfo.classList.toggle("blocked", false)}
    else {userinfo.classList.toggle("blocked", true)}}
)}
function blacklistclick() {
    each('.userdata', function(el) {
      var newItem = el.innerText;
      el.onclick = () => {
        blacklistarray.indexOf(newItem) === -1 ? blacklistarray.push(newItem) : blacklistarray.splice(blacklistarray.indexOf(newItem), 1);
        localStorage.setItem("blockarray", [(blacklistarray)]);
        let activitiesidarray = window.localStorage.getItem('blockarray');
  let x = activitiesidarray.split(/[.,!,?]/);
          localStorage.setItem("blockarray", (x));blacklistcheck();
}
    });
    function each(el, callback) {
        var allDivs = document.querySelectorAll(el),
            alltoArr = Array.prototype.slice.call(allDivs);
        Array.prototype.forEach.call(alltoArr, function(selector, index) {
            if (callback) return callback(selector);
        });
    };
}

window.addEventListener('load', function() {
  active = false;
  start();
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                active = false;
                start();
                set(button, {class:"el-dropdown-menu__item"});
            }});
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
});

window.onclick = function() {
    if (active && ResultDiv && ResultDiv.innerText == 'Results\n') set(ResultDiv, {style: {display: "none"}});
}

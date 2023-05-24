// ==UserScript==
// @name        Activity Filter
// @namespace   https://github.com/hachiman-hikigaya
// @match       https://anilist.co/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant       none
// @version     1.0
// @author      hachiman-hikigaya
// @description Filters users anime activities.
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
    -webkit-box-flex:1;
    -webkit-flex-grow:1;
        -ms-flex-positive:1;
            flex-grow:1
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
    -webkit-box-flex:1;
    -webkit-flex-grow:1;
        -ms-flex-positive:1;
            flex-grow:1;
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
    .animedata {
    cursor: pointer;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
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

   .animedataDiv,
   .ResultDivInside {
   -webkit-mask-image: linear-gradient(to bottom, transparent 0, black var(--top-mask-size), black -webkit-calc(100% - var(--bottom-mask-size)), transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0, black var(--top-mask-size), black calc(100% - var(--bottom-mask-size)), transparent 100%);
    --bottom-mask-size: 10px;
    --top-mask-size: 10px
    }
`
//Add CSS
var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

//get username
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

// Create Function
//create("element", {class:"", id:""},'text');
function create(tag, attrs, html) {
    if (!tag) throw new SyntaxError("'tag' not defined"); // In case you forget

    var ele = document.createElement(tag),
        attrName, styleName;
    if (attrs)
        for (attrName in attrs) {
            if (attrName === "style")
                for (styleName in attrs.style) {
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
    if (attrs)
        for (attrName in attrs) {
            if (attrName === "style")
                for (styleName in attrs.style) {
                    ele.style[styleName] = attrs.style[styleName];
                }
            else if (attrs[attrName])
                ele.setAttribute(attrName, attrs[attrName]);
        }
    if (html)
        ele.innerHTML = html;
    return ele;
}
//Create Buttons
var button = create("li", {
    class: "el-dropdown-menu__item mainbtn",
    id: "Watching"
}, 'Anime Filter');
button.onclick = () => {
    createDiv()
};

var button2 = create("button", {
    class: "mainbtns",
    id: "closebtn"
}, 'Close');
button2.onclick = () => {
    closeDiv()
};

var button3 = create("button", {
    class: "mainbtns",
    id: "filterallbtn"
}, 'Filter All');
button3.onclick = () => {
    clearInterval(interval);
    filterAll();
};

var button4 = create("button", {
    class: "mainbtns",
    id: "stopbtn",
    style: {
        visibility: "hidden",
        marginTop: "0"
    }
}, 'Stop');
button4.onclick = () => {
    stop()
};

var button5 = create("button", {
    class: "mainbtns",
    id: "refreshbtn"
}, 'Refresh');
button5.onclick = () => {
    refresh()
};

var button6 = create("button", {
    class: "mainbtns",
    id: "resultbtn"
}, 'Move Results');
button6.onclick = () => {
    onMainDivCheck();
    $(".feed-type-toggle > div.active").click();
};

var button7 = create("button", {
    class: "mainbtns",
    id: "notlikedbtn"
}, 'Not Liked');
button7.onclick = () => {
    notLikedCheck();
    $(".feed-type-toggle > div.active").click();
};

var button8 = create("button", {
    class: "mainbtns",
    id: "hideuserbtn"
}, 'Hide ' + username);
button8.onclick = () => {
    hideUserCheck();
    $(".feed-type-toggle > div.active").click();
};

var searchinput = create("input", {
    class: "searchinput",
    id: "searchinput"
});
searchinput.onkeyup = () => {
    search()
};
searchinput.placeholder = "Search Anime";
//Check - NotLiked
notLiked = JSON.parse(localStorage.getItem("notLiked"));

function notLikedCheck() {
    notLiked = !notLiked;
    localStorage.setItem("notLiked", notLiked);
    getSettings();
}
//Check - onMainDiv
onMainDiv = JSON.parse(localStorage.getItem("onMainDiv"));

function onMainDivCheck() {
    onMainDiv = !onMainDiv;
    localStorage.setItem("onMainDiv", onMainDiv);
    getSettings();
}
//Check - hideUser
hideUser = JSON.parse(localStorage.getItem("hideUser"));

function hideUserCheck() {
    hideUser = !hideUser;
    localStorage.setItem("hideUser", hideUser);
    getSettings();
}
//Get Saved Settings
function getSettings() {
    if (notLiked) {
        set(notlikedbtn, {
            style: {
                background: "rgba(40,56,77)"
            }
        });
    } else {
        set(notlikedbtn, {
            style: {
                background: "rgb(var(--color-background))"
            }
        });
    }
    if (onMainDiv) {
        set(resultbtn, {
            style: {
                background: "rgba(40,56,77)"
            }
        });
    } else {
        set(resultbtn, {
            style: {
                background: "rgb(var(--color-background))"
            }
        });
    }
    if (hideUser) {
        set(hideuserbtn, {
            style: {
                background: "rgba(40,56,77)"
            }
        });
    } else {
        set(hideuserbtn, {
            style: {
                background: "rgb(var(--color-background))"
            }
        });
    }
}

//Create MainDiv
function createDiv() {
    listprogress();
    active = !active;
    if (document.querySelector("li.el-dropdown-menu__item.active")) {
        delay(100).then(() => document.querySelector("li.el-dropdown-menu__item.active").className = document.querySelector("li.el-dropdown-menu__item.active").className.replace(/(?:^|\s)active(?!\S)/g, ''));
    }
    if (active) {
        button.setAttribute("class", "el-dropdown-menu__item active");

        var listDiv = create("div", {
            class: "maindiv",
            id: "listDiv"
        }, '<b>' + button.innerText + '</b>');
        const list = document.querySelector(".activity-feed-wrap + div");
        list.insertBefore(listDiv, list.children[0]);

        var buttonsDiv = create("div", {
            class: "buttonsDiv",
            id: "buttonsDiv",
            style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                marginTop: "10px",
                wordBreak: "break-word"
            }
        });
        listDiv.appendChild(buttonsDiv);


        listDiv.appendChild(searchinput);

        buttonsDiv.append(button2, button3, button5, button6, button7, button8);

        var stopDiv = create("div", {
            class: "stopDiv",
            id: "stopDiv",
            style: {
                display: "none",
                marginTop: "10px"
            }
        });
        listDiv.appendChild(stopDiv);
        stopDiv.appendChild(button4);

        var animedataDiv = create("div", {
            class: "animedataDiv",
            id: "animedataDiv",
            style: {
                display: "grid",
                maxHeight: "265px",
                overflowY: "scroll",
                paddingTop: "5px"
            }
        });
        listDiv.appendChild(animedataDiv);

        var ResultDiv = create("div", {
            class: "maindiv",
            id: "ResultDiv",
            style: {
                display: "none",
                maxHeight: "460px"
            }
        }, '<b>Results</br></b>');
        var ResultDivInside = create("div", {
            class: "ResultDivInside",
            id: "ResultDivInside",
            style: {
                maxHeight: "400px"
            }
        });
        ResultDiv.appendChild(ResultDivInside);
        $(ResultDiv).insertAfter(".maindiv");
        searchinput.value = "";
        getlist();
        getSettings();
    };
    if (!active) {
        closeDiv();
    }
}

//Close MainDiv
function closeDiv() {
    clearInterval(interval);
    var list = document.querySelectorAll("li:nth-child(1)");
    for (var x = 0; x < list.length; x++) {
        if (list[x].innerText.trim() == "All") {
            list[x].click();
        }
    }
    button.setAttribute("class", "el-dropdown-menu__item");
    listDiv.remove();
    ResultDiv.remove();
    active = false;
}

//Filter All Button
function filterAll() {
    var elem = document.querySelectorAll(".animedata")
    if(elem.length > 0) {
    mainarray = [];
    for (var x = 0; x < elem.length; x++) {
        mainarray.push(elem[x].innerText);
        mainarray.join("");
    }
    filterall = true;
    listprogress();
    set(stopDiv, {
        style: {
            display: "flex"
        }
    });
    set(button4, {
        style: {
            visibility: "visible"
        }
    })
      delay(1000).then(() => replacedivloop());}
  else {window.alert("Error: Anime list is empty. Please search or watch anime.")}
}

//Click to list progress
function listprogress() {
    var list = document.querySelectorAll("li:nth-child(3)");
    for (var x = 0; x < list.length; x++) {
        if (list[x].innerText.trim() == "List Progress") {
            list[x].click();
        }
    }
}

//Filter Activity
function replacedivloop(el) {
    interval = setTimeout(function() {
        var loop = 0;
        var result = 0;
        let elem = document.querySelectorAll(".animedata");
        let activities = document.querySelectorAll(".activity-feed > div > div.wrap > div.list > div > div.status > a.title");
        var activityArray = [];
        let trimArray = [];

        for (var x = 0; x < activities.length; x++) {
            activityArray.push(activities[x].text);
        }
        let trimArray1 = activityArray.map(element => {
            return element.trim();
        });
        if (filterall) {
            trimArray = mainarray.map(element => {
                return element.trim();
            });
        } else {
            trimArray = el.textContent;
        }
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
                if (onMainDiv) {
                    window.scrollTo(0, 100);
                    window.scrollTo(0, 0);
                }
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
            if (entryhref !== null && entryhref.indexOf("/manga/") > -1) {
                entry.innerHTML = "";
                entry.classList.remove('activity-entry');
            }
            if (onMainDiv) {
                result = 0;
                document.getElementById("ResultDivInside").append(entry);
                if (ResultDiv.innerText.length > 10) {
                    set(ResultDiv, {
                        style: {
                            display: "grid"
                        }
                    });
                } else {
                    set(ResultDiv, {
                        style: {
                            display: "none"
                        }
                    });
                }
            }
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
                set(ad[x], {
                    style: {
                        border: "1px solid gray",
                        marginBottom: "5px",
                        borderRadius: "5px",
                        background: 'rgb(var(--color-background))'
                    }
                });
            } else {
                if (ad[x].innerText == el.innerText) {
                    set(ad[x], {
                        style: {
                            border: "1px solid gray",
                            borderRadius: "5px",
                            background: 'rgb(var(--color-background))'
                        }
                    });
                } else {
                    set(ad[x], {
                        style: {
                            border: "0",
                            marginBottom: "0",
                            background: 'transparent'
                        }
                    });
                }
            }
        }
    }, 25)
}

//refresh activity list
function refresh() {
    stop();
    set(ResultDiv, {
        style: {
            display: "none"
        }
    });
    $(".feed-type-toggle > div.active").click();
}

//stop
function stop() {
    filterall = false;
    clearInterval(interval);
    let ab = document.querySelectorAll(".animedata");
    for (var x = 0; x < ab.length; x++) {
        set(ab[x], {
            style: {
                border: "0",
                marginBottom: "0",
                background: 'transparent'
            }
        });
        set(ResultDivInside, {
            style: {
                background: 'rgb(var(--color-background))'
            }
        });
    }
    set(stopDiv, {
        style: {
            display: "none"
        }
    });
}

//Delay
const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

//Remove Results if list refreshed
window.onclick = function() {
    if (active && ResultDiv.innerText == 'Results\n') set(ResultDiv, {
        style: {
            display: "none"
        }
    });
}

//reappend button
window.onpageshow = function() {
  if (document.location.href === "https://anilist.co/home") {
     document.querySelector(".el-dropdown-menu").appendChild(button);
   }
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                active = false;
                if (oldHref === "https://anilist.co/home") {
                  document.querySelector(".el-dropdown-menu").appendChild(button);
                  set(button, {class:"el-dropdown-menu__item"});
                }
              else {
                clearInterval(interval);
              }
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
}

function getlist() {
    var query = `
query($name:String!,$listType:MediaType,$listStatus:MediaListStatus){
				MediaListCollection(userName:$name,type:$listType,status:$listStatus){
		lists{
			entries{
				... mediaListEntry
			}
		}
	}
}
fragment mediaListEntry on MediaList{
	mediaId
    media {
    type
    id
    siteUrl
    title {
      romaji
    }
  coverImage {
    large
  }
}}
`;

    var variables = {
        name: username,
        listType: "ANIME",
        listStatus: "CURRENT"
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            })
        };

    fetch(url, options).then(handleResponse)
        .then(handleData)
        .catch(handleError);

    function handleResponse(response) {
        return response.json().then(function(json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        var arr = [];
        var arr2 = [];
        animedataDiv.innerHTML = "";
      if(data.data.MediaListCollection.lists.length > 0){
        for (var x = 0; x < data.data.MediaListCollection.lists[0].entries.length; x++) {
            arr.push(data.data.MediaListCollection.lists[0].entries[x].media.title.romaji);
            arr2.push(data.data.MediaListCollection.lists[0].entries[x].media.coverImage.large);
            const trimArray = arr.map(element => {
                return element.trim();
            });

            var aimg = create("a", {
                class: "animedataimg",
                id: "animedataimg",
                href: "" + (data.data.MediaListCollection.lists[0].entries[x].media.siteUrl),
                style: {
                    backgroundImage: "url(" + data.data.MediaListCollection.lists[0].entries[x].media.coverImage.large + ")"
                }
            });
            var a = create("a", {
                class: "animedata",
                id: (data.data.MediaListCollection.lists[0].entries[x].media.id),
                href: (empty())
            });
            aimg.before(a);
            a.innerText = (data.data.MediaListCollection.lists[0].entries[x].media.title.romaji);
            animedataDiv.appendChild(a);
            a.appendChild(aimg);
        }}
        animedataclick();

    }

    function handleError(error) {
        console.error(error);
    }
}

function search() {
    var query = `
query ($id: Int, $page: Int, $search: String) {
  Page (page: $page) {
    media (id: $id, search: $search, type: ANIME) {
    type
    id
    siteUrl
    title {
      romaji
    }
  coverImage {
    large
  }
  }
  }
}
`;

    var variables = {
        search: searchinput.value,
        page: 1
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            })
        };

    fetch(url, options).then(handleResponse)
        .then(handleData)
        .catch(handleError);

    function handleResponse(response) {
        return response.json().then(function(json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        var arr = [];
        var arr2 = [];
        if (searchinput.value == "") {
            getlist();
        } else {
            animedataDiv.innerHTML = "";
        }

        for (var x = 0; x < data.data.Page.media.length; x++) {
            arr.push(data.data.Page.media[x].title.romaji);
            arr2.push(data.data.Page.media[x].coverImage.large);
            const trimArray = arr.map(element => {
                return element.trim();
            });

            var aimg = create("a", {
                class: "animedataimg",
                id: "animedataimg",
                href: "" + (data.data.Page.media[x].siteUrl),
                style: {
                    backgroundImage: "url(" + data.data.Page.media[x].coverImage.large + ")"
                }
            });
            var a = create("a", {
                class: "animedata",
                id: (data.data.Page.media[x].id),
                href: (empty())
            });
            aimg.before(a);
            a.innerText = (data.data.Page.media[x].title.romaji);
            animedataDiv.appendChild(a);
            a.appendChild(aimg);

        }
        var elem = document.querySelectorAll(".animedata")
        mainarray = [];
        for (var x = 0; x < elem.length; x++) {
            mainarray.push(elem[x].innerText);
            mainarray.join("");
        }
        animedataclick();
    }

    function handleError(error) {
        console.error(error);
    }
}
function empty(){}
function animedataclick() {
    each('.animedata', function(el) {
        el.addEventListener('click', function(e) {
            filterall = false;
            listprogress();
            clearInterval(interval);
            refresh();
            replacedivloop(el);
            set(stopDiv, {
                style: {
                    display: "flex"
                }
            });
            set(button4, {
                style: {
                    visibility: "visible"
                }
            })
            e.preventDefault();
            filterLinks(el);
        });
    });
    // filter links functions
    function filterLinks(element) {
        // get text
        var el = element.textContent
    };
    // forech arrays
    function each(el, callback) {
        var allDivs = document.querySelectorAll(el),
            alltoArr = Array.prototype.slice.call(allDivs);
        Array.prototype.forEach.call(alltoArr, function(selector, index) {
            if (callback) return callback(selector);
        });
    };

}

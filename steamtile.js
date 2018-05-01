document.head.insertAdjacentHTML("beforeend",`<link rel="stylesheet" href="${chrome.runtime.getURL("steamtile.css")}">`);

var _currsearchrows;
function replaceImages()
{
    var searchrows=document.querySelectorAll(".search_result_row");

    if ((_currsearchrows && searchrows[0]==_currsearchrows[0]) || searchrows.length==0)
    {
        setTimeout(()=>{
            replaceImages();
        },100);
        return;
    }

    _currsearchrows=searchrows;

    for (var x=0,l=searchrows.length;x<l;x++)
    {
        searchrows[x].firstElementChild.firstElementChild.src=`https://steamcdn-a.akamaihd.net/steam/apps/${searchrows[x].href.replace(/.*\/(\d+)\/.*/,"$1")}/header.jpg`;
    }

    attachButtons();
}

function attachButtons()
{
    var pagebuttons=document.querySelectorAll(".search_pagination_right a");
    for (var x=0,l=pagebuttons.length;x<l;x++)
    {
        if (!pagebuttons[x].attached)
        {
            pagebuttons[x].addEventListener("click",(e)=>{
                console.log("hey");
                replaceImages();
            });
        }
        pagebuttons[x].attached=1;
    }
}

replaceImages();